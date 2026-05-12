// backend/routes/inbox.js
const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");
const Vacancy = require("../models/Vacancy");
const {
  analyzeAndCompareWithGemini,
  enrichTextWithDocs,
} = require("../services/gemini.service");
const { processVacancyMessage } = require("./vacancies");
const {
  shouldIgnoreMessage,
  getWhitelistedAgency,
  isTruncated,
  getPrefixHash,
  shouldIgnorePostAI,
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
    /(📍|місто|місце\s+роботи|location|miejsce\s+pracy|локація|адреса)/i.test(
      text,
    );

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

  // 1. Вайтліст (да базы) - Прыярытэтная праверка
  const agency = getWhitelistedAgency(senderRaw, chatId);

  if (!agency) {
    return res.status(200).json({ status: "ignored_not_whitelisted" });
  }

  if (agency === "IGNORE_SELF") {
    return res.status(200).json({ status: "ignored_self_loop" });
  }

  console.log(
    `📡 RAW PUSH: ад "${senderRaw}" (ID: ${chatId}) | Тэкст: ${text.substring(0, 30)}...`,
  );

  // 2. Жорсткі фільтр шуму
  if (shouldIgnoreMessage(text)) {
    console.log(
      `🗑️ Адхілена (Noise/Regex) ад "${senderRaw}": "${logPreview(text)}..."`,
    );
    return res.status(200).json({ status: "ignored_noise" });
  }

  try {
    console.log(
      `📥 Прынята: ${text.length} сімв. ад "${senderRaw}" (${agency}) [${source}]`,
    );

    const incomingPrefixHash = getPrefixHash(text);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    // 3. Дэдуплікацыя (па хэшы або прэфіксе ў межах адной агенцыі)
    const incomingTextHash = normalizeText(text);

    const existingMsg = await UnprocessedMessage.findOne({
      agencyName: agency,
      $or: [{ prefixHash: incomingPrefixHash }, { textHash: incomingTextHash }],
      createdAt: { $gte: fortyEightHoursAgo },
    });

    if (existingMsg) {
      // Калі новае паведамленне даўжэйшае (даслалі працяг), абнаўляем старое
      if (text.length > existingMsg.text.length) {
        console.log(`🔄 Абнаўленне (stitching): ${agency}`);
        existingMsg.text = text;
        existingMsg.textHash = incomingTextHash;
        existingMsg.prefixHash = incomingPrefixHash;
        existingMsg.processed = false;
        existingMsg.aiAnalyzed = false;
        await existingMsg.save();
        return res.status(200).json({ status: "updated_in_buffer" });
      } else {
        // Калі тэкст такі ж або карацейшы — гэта дубль, ігнаруем
        console.log(`🔁 Ігнараваны дубль ад ${agency}: "${logPreview(text)}"`);
        return res.status(200).json({ status: "ignored_duplicate" });
      }
    }

    // 4. Захаванне
    const newMsg = new UnprocessedMessage({
      sender: senderRaw,
      agencyName: agency,
      text: text,
      textHash: normalizeText(text),
      prefixHash: incomingPrefixHash,
      source: source,
      category: "info",
      processed: false,
      aiAnalyzed: false,
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
    // 1. Аднаўленне "прапушчаных" або завіслых паведамленняў (старэйшых за 5 хвілін)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recovered = await UnprocessedMessage.updateMany(
      {
        aiAnalyzed: false,
        rawText: "__processing__",
        updatedAt: { $lt: fiveMinutesAgo },
      },
      { rawText: "" },
    );
    if (recovered.modifiedCount > 0) {
      console.log(
        `🔄 Адноўлена ў чаргу: ${recovered.modifiedCount} прапушчаных паведамленняў.`,
      );
    }

    // 2. Бярэм УСЕ неапрацаваныя, пачынаючы з самых старых (FIFO)
    const pending = await UnprocessedMessage.find({
      processed: false,
      aiAnalyzed: false,
      rawText: { $ne: "__processing__" },
    }).sort({ createdAt: 1 });

    if (pending.length === 0) return;

    isProcessing = true;
    console.log(`⚙️ КАНВЕЕР: Апрацоўка ${pending.length} паведамленняў...`);

    for (const msg of pending) {
      try {
        msg.rawText = "__processing__";
        await msg.save();

        const enrichedText = await enrichTextWithDocs(msg.text);
        const analysis = await analyzeAndCompareWithGemini(
          enrichedText,
          [],
          [],
        );

        if (!analysis) {
          // КРЫТЫЧНА: Калі AI вярнуў null (ліміты), спыняем увесь цыкл
          console.log(
            `⏳ AI ліміты дасягнуты. Спыняем канвеер для паведамлення ${msg._id}.`,
          );
          msg.rawText = "";
          await msg.save();
          break; // 👈 Выхад з цыкла for, астатнія паведамленні чакаюць 10 хвілін
        }

        const raw = analysis.translatedText;
        const translatedText = typeof raw === "string" ? raw : enrichedText;

        // --- НОВАЕ: Layer 2 Filtering (Ачыстка Пясочніцы) ---
        if (
          analysis.category === "NOISE" ||
          shouldIgnorePostAI(translatedText)
        ) {
          console.log(
            `🗑️ Аўта-архівацыя шуму (Layer 2): "${logPreview(translatedText)}..."`,
          );
          msg.category = "chat";
          msg.processed = true; // Паведамленне знікне з Пясочніцы
          msg.aiAnalyzed = true;
          msg.rawText = translatedText;
          await msg.save();
          continue;
        }
        const categoryMap = {
          UPDATE: "update",
          RECRUITER_INFO: "info",
          FULL_VACANCY: "vacancy",
          MULTI_VACANCY: "update",
        };

        let finalCategory = categoryMap[analysis.category] || "info";
        let isAutoDone = false;

        if (
          analysis.category === "FULL_VACANCY" &&
          AUTO_PROCESS_VACANCIES &&
          !msg.isTruncated
        ) {
          if (hasMinimalVacancyData(translatedText)) {
            console.log(`🔥 Stage 2: Groq-парсінг для ${msg.agencyName}...`);
            const result = await processVacancyMessage(
              translatedText,
              msg.sender,
              msg.agencyName,
              msg.text,
              msg.isTruncated,
            );
            if (result && !result.error) isAutoDone = true;
          } else {
            finalCategory = "update";
          }
        }

        msg.rawText = translatedText;
        msg.category = finalCategory;
        msg.aiAnalyzed = true;
        msg.processed = isAutoDone;
        await msg.save();

        await sleep(2000);
      } catch (err) {
        console.error(`❌ Памылка на ${msg._id}:`, err.message);
        msg.rawText = "";
        await msg.save();
        break; // Пры любой памылцы лепш спыніцца і пачакаць
      }
    }
  } catch (globalErr) {
    console.error("❌ Global Error:", globalErr);
  } finally {
    isProcessing = false;
  }
}

// Інтэрвал апрацоўкі павялічаны да 10 хвілін
setInterval(processPendingMessages, 600000);
processPendingMessages();

// --- 3. РОЎТЫ КІРАВАННЯ ---

router.get("/", async (req, res) => {
  try {
    const { category, limit = 200 } = req.query;
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
