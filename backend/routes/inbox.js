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
} = require("../utils/messageFilters");
const aiService = require("../services/ai.service");

const AUTO_PROCESS_VACANCIES = true;
let isProcessing = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  if (shouldIgnoreMessage(text)) {
    console.log(
      `🗑️ Адхілена (Regex/OldDate) ад "${senderRaw}": "${logPreview(text)}..."`,
    );
    return res.status(200).json({ status: "ignored_noise" });
  }

  try {
    const agency = getWhitelistedAgency(senderRaw);

    if (!agency) {
      console.log(
        `🚫 Адхілена (Whitelist): ад "${senderRaw}" | Тэкст: "${logPreview(text)}"`,
      );
      return res.status(200).json({ status: "ignored_not_whitelisted" });
    }

    if (agency === "IGNORE_SELF") {
      console.log(`🔄 Ігнараванне (Self-Loop): "${senderRaw}"`);
      return res.status(200).json({ status: "ignored_self_loop" });
    }

    console.log(
      `📥 Прынята: ${text.length} сімв. ад "${senderRaw}" (${agency})`,
    );

    const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingMsg = await UnprocessedMessage.findOne({
      agencyName: agency,
      createdAt: { $gte: sixtyMinutesAgo },
    }).sort({ createdAt: -1 });

    if (existingMsg) {
      if (text.length > existingMsg.text.length) {
        console.log(
          `🔄 Абнаўленне: ${agency} (${existingMsg.text.length} -> ${text.length} сімв.)`,
        );
        existingMsg.text = text;
        existingMsg.textHash = normalizeText(text);
        existingMsg.isTruncated = isTruncated(text);
        existingMsg.processed = false;
        await existingMsg.save();
        return res.status(200).json({ status: "updated_in_buffer" });
      } else {
        console.log(`🔁 Ігнараваны дубль ад ${agency}`);
        return res.status(200).json({ status: "ignored_duplicate" });
      }
    }

    const newMsg = new UnprocessedMessage({
      sender: senderRaw,
      agencyName: agency,
      text: text,
      textHash: normalizeText(text),
      source: req.body.source || "viber",
      category: "info",
      processed: false,
      isTruncated: isTruncated(text),
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
  isProcessing = true;

  try {
    const pending = await UnprocessedMessage.find({ processed: false }).limit(
      10,
    );

    if (pending.length === 0) {
      isProcessing = false;
      return;
    }

    console.log(
      `⚙️ ПАЧАТАК АПРАЦОЎКІ: ${pending.length} паведамленняў у чарзе...`,
    );

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    for (const msg of pending) {
      try {
        console.log(
          `📝 Аналіз [${msg.agencyName}]: "${logPreview(msg.text)}..."`,
        );
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
          console.log(
            `⏳ AI памылка (ліміты) для ${msg.agencyName}. Пакідаю ў Пясочніцы.`,
          );
          continue;
        }

        console.log(
          `🤖 AI Вердыкт для ${msg.agencyName}: ${analysis.category} | ${analysis.comparison.verdict} (Прычына: ${analysis.comparison.reason})`,
        );

        if (analysis.comparison.verdict === "DUPLICATE") {
          console.log(`📎 Сэмантычны дубль. Хаваю.`);
          msg.category = "chat";
          msg.processed = true;
          await msg.save();
          continue;
        }

        const categoryMap = {
          UPDATE: "update",
          RECRUITER_INFO: "info",
          FULL_VACANCY: "vacancy",
        };

        let finalCategory = categoryMap[analysis.category] || "info";
        if (analysis.comparison.verdict === "UPDATE") finalCategory = "update";
        if (msg.isTruncated) finalCategory = "vacancy";

        msg.rawText = analysis.translatedText || msg.text;
        msg.category = finalCategory;
        msg.processed = true;
        await msg.save();
        console.log(
          `✅ Апрацавана: ${msg.agencyName} -> Катэгорыя: ${finalCategory}`,
        );

        // 🔧 Мінімальная даўжыня 400 сімв.: кароткія паведамленні (абнаўленні тыпу
        // "трэба 5 людзей, выхад 5.05") не павінны аўта-парсіцца як поўныя вакансіі.
        const isLongEnough = msg.text.length >= 400;

        if (
          analysis.category === "FULL_VACANCY" &&
          !msg.isTruncated &&
          isLongEnough &&
          AUTO_PROCESS_VACANCIES
        ) {
          console.log(`🔥 Запуск Groq-парсінгу для ${msg.agencyName}...`);
          await processVacancyMessage(
            msg.rawText,
            msg.sender,
            msg.agencyName,
            msg.text,
            msg.isTruncated,
          );
        }
      } catch (err) {
        console.error(`❌ Памылка ітэрацыі (${msg.agencyName}):`, err.message);
      }
    }
    console.log(`🏁 АПРАЦОЎКА ЗАВЕРШАНА`);
  } catch (globalErr) {
    console.error("❌ Global Buffer Processor Error:", globalErr);
  } finally {
    isProcessing = false;
  }
}

setInterval(processPendingMessages, 60000);

// --- 3. РОЎТЫ КІРАВАННЯ (ФРОНТЭНД) ---

router.get("/", async (req, res) => {
  try {
    const { category, limit = 200 } = req.query;
    // 🔧 ВЫПРАЎЛЕННЕ: Прыбралі processed: false, каб паведамленні не знікалі пасля AI
    const filter = { category: { $ne: "chat" } };
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
      UnprocessedMessage.countDocuments({ category: { $ne: "chat" } }),
      UnprocessedMessage.countDocuments({ category: "vacancy" }),
      UnprocessedMessage.countDocuments({ category: "update" }),
      UnprocessedMessage.countDocuments({ category: "info" }),
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
