// backend/routes/inbox.js
const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");
const Vacancy = require("../models/Vacancy");
const { analyzeAndCompareWithGemini } = require("../services/gemini.service");
const { processVacancyMessage } = require("./vacancies");
const {
  shouldIgnoreMessage,
  getWhitelistedAgency,
  isTruncated,
  getPrefixHash,
} = require("../utils/messageFilters");
const aiService = require("../services/ai.service");

const AUTO_PROCESS_VACANCIES = true;
let isProcessing = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function hasMinimalVacancyData(text) {
  const hasRate =
    /\d+[.,]?\d*\s*(zł|zlot|€|eur|pln).*?(год|час|hour|\/h|\/год)/i.test(text);
  const hasSalary = /\d{2,}[.,]?\d*\s*(zł|zlot|€|eur|pln)/i.test(text);
  const hasLocation =
    /(📍|місто\s*:|місце роботи|location\s*:|miejsce pracy)/i.test(text);
  return (hasRate || hasSalary) && hasLocation;
}

function normalizeText(text) {
  if (!text) return "";
  return text.toLowerCase().replace(/[^a-zа-яёіў0-9]/gi, "");
}

function logPreview(text) {
  if (!text) return "";
  return text.replace(/\n/g, " ").replace(/\s+/g, " ").trim().substring(0, 80);
}

// --- 1. ПРЫЁМ ПАВЕДАМЛЕННЯ (БУФЕР) ---
router.post("/push", async (req, res) => {
  const text = (req.body.text || req.body.notification || "").trim();
  const senderRaw = (req.body.sender || req.body.not_title || "Unknown").trim();
  const source = req.body.source || "viber";
  const chatId = req.body.chatId || null;
  console.log(
    `📡 RAW PUSH: ад "${senderRaw}" (ID: ${chatId}) | Тэкст: ${text.substring(0, 30)}...`,
  );
  // 1. Жорсткі фільтр шуму (да базы)
  if (shouldIgnoreMessage(text)) {
    console.log(
      `🗑️ Адхілена (Noise/Regex) ад "${senderRaw}": "${logPreview(text)}..."`,
    );
    return res.status(200).json({ status: "ignored_noise" });
  }

  try {
    // 2. Вайтліст (да базы)
    const agency = getWhitelistedAgency(senderRaw, chatId);

    if (!agency) {
      // Лог для дыягностыкі ID
      console.log(
        `🚫 Адхілена (Whitelist): ад "${senderRaw}" (ID: ${chatId}) | Тэкст: "${logPreview(text)}"`,
      );
      return res.status(200).json({ status: "ignored_not_whitelisted" });
    }

    if (agency === "IGNORE_SELF")
      return res.status(200).json({ status: "ignored_self_loop" });

    console.log(
      `📥 Прынята: ${text.length} сімв. ад "${senderRaw}" (${agency}) [${source}]`,
    );

    const incomingPrefixHash = getPrefixHash(text);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    // 3. Дэдуплікацыя (да базы)
    const existingMsg = await UnprocessedMessage.findOne({
      agencyName: agency,
      prefixHash: incomingPrefixHash,
      createdAt: { $gte: fortyEightHoursAgo },
    });

    if (existingMsg) {
      if (text.length > existingMsg.text.length) {
        console.log(
          `🔄 Абнаўленне (stitching): ${agency} (${existingMsg.text.length} -> ${text.length} сімв.)`,
        );
        existingMsg.text = text;
        existingMsg.textHash = normalizeText(text);
        existingMsg.prefixHash = incomingPrefixHash;
        existingMsg.isTruncated = isTruncated(text, source);
        existingMsg.processed = false;
        await existingMsg.save();
        return res.status(200).json({ status: "updated_in_buffer" });
      } else {
        console.log(
          `🔁 Ігнараваны дубль (prefixHash) ад ${agency}: "${logPreview(text)}"`,
        );
        return res.status(200).json({ status: "ignored_duplicate" });
      }
    }

    // 4. Захаванне (толькі калі прайшло ўсе фільтры)
    const newMsg = new UnprocessedMessage({
      sender: senderRaw,
      agencyName: agency,
      text: text,
      textHash: normalizeText(text),
      prefixHash: incomingPrefixHash,
      source: source,
      category: "info", // Пакідаем info па тваім жаданні
      processed: false,
      isTruncated: isTruncated(text, source),
    });

    await newMsg.save();
    console.log(`💾 Захавана ў буфер: ${agency} (ID: ${newMsg._id})`);
    res.status(200).json({ status: "saved_to_buffer", id: newMsg._id });
  } catch (error) {
    console.error("❌ Push Error:", error);
    res.status(200).json({ status: "error" });
  }
});
// --- 2. ФОНАВАЯ АПРАЦОЎКА БУФЕРА ---
async function processPendingMessages() {
  if (isProcessing) return;

  try {
    // 1. РАМОНТ: Скідваем паведамленні, якія завіслі ў апрацоўцы больш за 10 хвілін
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    await UnprocessedMessage.updateMany(
      { rawText: "__processing__", updatedAt: { $lt: tenMinutesAgo } },
      { rawText: "" },
    );

    const pending = await UnprocessedMessage.find({
      processed: false,
      rawText: "",
    }).limit(10);

    if (pending.length === 0) return;

    isProcessing = true;
    console.log(
      `⚙️ ПАЧАТАК АПРАЦОЎКІ: ${pending.length} новых паведамленняў...`,
    );

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    for (const msg of pending) {
      try {
        console.log(
          `📝 Аналіз [${msg.agencyName}]: "${logPreview(msg.text)}..."`,
        );

        msg.rawText = "__processing__";
        await msg.save();

        await sleep(2000);

        const todayMessages = await UnprocessedMessage.find({
          agencyName: msg.agencyName,
          processed: true,
          createdAt: { $gte: startOfToday },
        }).limit(10);

        const todayVacancies = await Vacancy.find({
          agencyName: msg.agencyName,
          createdAt: { $gte: startOfToday },
        }).limit(5);

        const analysis = await analyzeAndCompareWithGemini(
          msg.text,
          todayMessages,
          todayVacancies,
        );

        if (!analysis || analysis.error) {
          msg.retryCount = (msg.retryCount || 0) + 1;
          if (msg.retryCount >= 5) {
            msg.rawText = "__limit_exceeded__";
            msg.processed = true;
            msg.category = "chat";
          } else {
            msg.rawText = ""; // Скідваем для наступнай спробы
          }
          await msg.save();
          continue;
        }

        if (analysis.category === "NOISE") {
          msg.category = "chat";
          msg.processed = true;
          msg.rawText = (analysis.translatedText || msg.text).substring(
            0,
            2000,
          );
          await msg.save();
          continue;
        }

        const categoryMap = {
          UPDATE: "update",
          RECRUITER_INFO: "info",
          FULL_VACANCY: "vacancy",
          MULTI_VACANCY: "vacancy",
        };

        let finalCategory = categoryMap[analysis.category] || "info";
        let isAutoDone = false;
        const isMulti = analysis.category === "MULTI_VACANCY";

        if (
          finalCategory === "vacancy" &&
          AUTO_PROCESS_VACANCIES &&
          !msg.isTruncated
        ) {
          if (!isMulti && !hasMinimalVacancyData(msg.text)) {
            finalCategory = "update";
          } else {
            console.log(`🔥 Запуск Groq-парсінгу для ${msg.agencyName}...`);
            // 🆕 ФІКС: Адпраўляем msg.text (арыгінал), а не пераклад-самары
            const result = await processVacancyMessage(
              msg.text,
              msg.sender,
              msg.agencyName,
              msg.text,
              msg.isTruncated,
            );
            if (result && !result.error) isAutoDone = true;
          }
        }

        msg.rawText = analysis.translatedText || msg.text;
        msg.category = finalCategory;
        msg.processed = isAutoDone;
        await msg.save();
      } catch (err) {
        console.error(`❌ Памылка ітэрацыі (${msg.agencyName}):`, err.message);
        msg.rawText = ""; // Дазваляем паўторную спробу
        await msg.save();
      }
    }
  } catch (globalErr) {
    console.error("❌ Global Buffer Processor Error:", globalErr);
  } finally {
    isProcessing = false;
  }
}

setInterval(processPendingMessages, 300000);
processPendingMessages();
// --- 3. РОЎТЫ КІРАВАННЯ (ФРОНТЭНД) ---

router.get("/", async (req, res) => {
  try {
    const { category, limit = 200 } = req.query;
    // 🔧 Паказваем толькі неапрацаваныя (processed: false)
    const filter = { category: { $ne: "chat" }, processed: false };
    if (category && category !== "all") filter.category = category;
    const messages = await UnprocessedMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [total, vacancy, update, info] = await Promise.all([
      UnprocessedMessage.countDocuments({
        category: { $ne: "chat" },
        processed: false,
      }),
      UnprocessedMessage.countDocuments({
        category: "vacancy",
        processed: false,
      }),
      UnprocessedMessage.countDocuments({
        category: "update",
        processed: false,
      }),
      UnprocessedMessage.countDocuments({ category: "info", processed: false }),
    ]);
    res.json({ total, vacancy, update, info, chat: 0 });
  } catch {
    res.json({ total: 0, vacancy: 0, update: 0, info: 0, chat: 0 });
  }
});

router.post("/cleanup", async (req, res) => {
  try {
    const all = await UnprocessedMessage.find({ processed: false });
    let deleted = 0;
    for (const msg of all) {
      if (shouldIgnoreMessage(msg.text)) {
        await msg.deleteOne();
        deleted++;
      }
    }
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/bulk", async (req, res) => {
  try {
    const { ids, category, all } = req.body || {};
    let result;
    if (all) {
      result = await UnprocessedMessage.deleteMany({});
    } else if (category) {
      result = await UnprocessedMessage.deleteMany({ category });
    } else if (Array.isArray(ids) && ids.length > 0) {
      result = await UnprocessedMessage.deleteMany({ _id: { $in: ids } });
    } else {
      return res.status(400).json({ message: "Нічога не пазначана" });
    }
    res.json({ deleted: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await UnprocessedMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Выдалена" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/process", async (req, res) => {
  try {
    await UnprocessedMessage.findByIdAndUpdate(req.params.id, {
      processed: true,
    });
    res.json({ message: "Апрацавана" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
