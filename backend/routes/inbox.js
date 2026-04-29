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
// 🔧 FIX 1: Дадаць імпарт aiService (быў адсутны → "aiService is not defined")
const aiService = require("../services/ai.service");

const AUTO_PROCESS_VACANCIES = true;
let isProcessing = false; // Сцяг, каб пазбегнуць накладання працэсаў

// Хэлпер для нармалізацыі тэксту
function normalizeText(text) {
  if (!text) return "";
  return text.toLowerCase().replace(/[^a-zа-яёіў0-9]/gi, "");
}

// --- 1. ПРЫЁМ ПАВЕДАМЛЕННЯ (БУФЕР) ---
router.post("/push", async (req, res) => {
  const text = (req.body.text || req.body.notification || "").trim();

  if (shouldIgnoreMessage(text)) {
    console.log(
      `🗑️ Адхілена (Regex): "${text.substring(0, 60).replace(/\n/g, " ")}..."`,
    );
    return res.status(200).json({ status: "ignored_noise" });
  }

  try {
    const senderRaw = (
      req.body.sender ||
      req.body.not_title ||
      "Unknown"
    ).trim();
    const agency = getWhitelistedAgency(senderRaw);

    if (!agency)
      return res.status(200).json({ status: "ignored_not_whitelisted" });
    if (agency === "IGNORE_SELF")
      return res.status(200).json({ status: "ignored_self_loop" });

    console.log(`📥 Прынята: ${text.length} сімв. ад "${senderRaw}"`);

    // ПРАВЕРКА НА АБНАЎЛЕННЕ (Stitching)
    // 🔧 FIX 2: Акно павялічана з 5 да 60 хвілін (паводле LOG.md v0.3.0)
    // Telegram спачатку шле кароткае апавяшчэнне (~200 сімв.),
    // а поўны тэкст прыходзіць праз 5-30+ хвілін — таму 5 хвілін было мала.
    const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingMsg = await UnprocessedMessage.findOne({
      agencyName: agency,
      processed: false,
      createdAt: { $gte: sixtyMinutesAgo },
    });

    if (existingMsg) {
      // Калі новы тэкст даўжэйшы — абнаўляем існуючы запіс
      if (text.length > existingMsg.text.length) {
        console.log(
          `🔄 Абнаўленне тэксту для ${agency} (${existingMsg.text.length} -> ${text.length})`,
        );
        existingMsg.text = text;
        existingMsg.textHash = normalizeText(text);
        existingMsg.isTruncated = isTruncated(text);
        await existingMsg.save();
        return res.status(200).json({ status: "updated_in_buffer" });
      } else {
        return res.status(200).json({ status: "ignored_shorter_update" });
      }
    }

    // Калі паведамленне новае — проста захоўваем яго
    const newMsg = new UnprocessedMessage({
      sender: senderRaw,
      agencyName: agency,
      text: text,
      textHash: normalizeText(text),
      source: req.body.source || "viber",
      category: "info", // Часовая катэгорыя да апрацоўкі AI
      processed: false,
      isTruncated: isTruncated(text),
    });

    await newMsg.save();
    res.status(200).json({ status: "saved_to_buffer" });
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

    console.log(`⚙️ Апрацоўка буфера: ${pending.length} паведамленняў...`);

    for (const msg of pending) {
      try {
        // Збор кантэксту
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
        const recentMessages = await UnprocessedMessage.find({
          agencyName: msg.agencyName,
          processed: true,
          createdAt: { $gte: twelveHoursAgo },
        }).limit(5);
        const recentVacancies = await Vacancy.find({
          agencyName: msg.agencyName,
          createdAt: { $gte: twelveHoursAgo },
        }).limit(3);

        // AI Аналіз (Gemini -> Groq Fallback)
        const analysis = await analyzeAndCompareWithGemini(
          msg.text,
          recentMessages,
          recentVacancies,
        );

        if (
          !analysis.error &&
          (analysis.category === "NOISE" ||
            analysis.comparison.verdict === "DUPLICATE")
        ) {
          console.log(`🗑️ Выдаленне дубліката/шуму пасля AI аналізу`);
          await msg.deleteOne();
          continue;
        }

        // Вызначэнне катэгорыі
        const categoryMap = {
          UPDATE: "update",
          RECRUITER_INFO: "info",
          FULL_VACANCY: "vacancy",
        };
        let finalCategory = analysis.error
          ? "info"
          : categoryMap[analysis.category] || "info";
        if (analysis.comparison.verdict === "UPDATE") finalCategory = "update";

        // Прыярытэт абрэзкі
        if (msg.isTruncated) finalCategory = "vacancy";

        // Пераклад (калі Gemini ўпаў) — 🔧 FIX 1 дазваляе гэты код зараз працаваць
        let translatedText = analysis.translatedText || msg.text;
        if (analysis.error && msg.text.length > 300) {
          translatedText = await aiService.simpleTranslate(msg.text);
        }

        // Абнаўляем паведамленне вынікамі AI
        msg.rawText = translatedText;
        msg.category = finalCategory;
        msg.processed = true;
        await msg.save();

        // Аўта-парсінг Groq
        if (
          !analysis.error &&
          analysis.category === "FULL_VACANCY" &&
          !msg.isTruncated &&
          AUTO_PROCESS_VACANCIES
        ) {
          console.log(`🚀 Аўта-парсінг вакансіі: ${msg.agencyName}`);
          await processVacancyMessage(
            translatedText,
            msg.sender,
            msg.agencyName,
            msg.text,
            msg.isTruncated,
          );
        }
      } catch (err) {
        console.error(
          `❌ Памылка апрацоўкі паведамлення ${msg._id}:`,
          err.message,
        );
      }
    }
  } catch (globalErr) {
    console.error("❌ Global Buffer Processor Error:", globalErr);
  } finally {
    isProcessing = false;
  }
}

// Запуск працэсара кожныя 2 хвіліны
setInterval(processPendingMessages, 120000);

// --- РОЎТЫ КІРАВАННЯ (Фронтэнд) ---

router.get("/", async (req, res) => {
  try {
    const { category, limit = 200 } = req.query;
    const filter = { processed: false, category: { $ne: "chat" } };
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
        processed: false,
        category: { $ne: "chat" },
      }),
      UnprocessedMessage.countDocuments({
        processed: false,
        category: "vacancy",
      }),
      UnprocessedMessage.countDocuments({
        processed: false,
        category: "update",
      }),
      UnprocessedMessage.countDocuments({ processed: false, category: "info" }),
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
    let reclassified = 0;
    for (const msg of all) {
      if (shouldIgnoreMessage(msg.text)) {
        await msg.deleteOne();
        deleted++;
        continue;
      }
      const newCategory = classify(msg.text);
      if (newCategory !== msg.category) {
        msg.category = newCategory;
        await msg.save();
        reclassified++;
      }
    }
    res.json({ deleted, reclassified });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/bulk", async (req, res) => {
  try {
    const { ids, category, all } = req.body || {};
    let result;
    if (all) {
      result = await UnprocessedMessage.deleteMany({ processed: false });
    } else if (category) {
      result = await UnprocessedMessage.deleteMany({
        processed: false,
        category,
      });
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
