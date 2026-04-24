// backend/routes/inbox.js
const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");
const { classifyWithGemini } = require("../services/gemini.service");
const { processVacancyMessage } = require("./vacancies");
const {
  shouldIgnoreMessage,
  getWhitelistedAgency,
} = require("../utils/messageFilters");

// РЭЖЫМ АДЛАДКІ: false = усё ідзе ў Інбокс. true = вакансіі адразу ідуць у Groq.
const AUTO_PROCESS_VACANCIES = false;

function normalizeText(text) {
  if (!text) return "";
  return text
    .replace(
      /[\p{Emoji}\p{Emoji_Presentation}\p{Symbol}\s\p{Punctuation}]/gu,
      "",
    )
    .toLowerCase();
}

function classify(text) {
  if (!text) return "info";
  const t = text.toLowerCase();
  if (
    t.includes("zł") ||
    t.includes("netto") ||
    t.includes("вакансія") ||
    t.includes("praca")
  )
    return "vacancy";
  if (t.includes("актуально") || t.includes("набір") || t.includes("добор"))
    return "update";
  return "info";
}

// АДЗІНЫ РОЎТ ДЛЯ ЎСІХ ПАВЕДАМЛЕННЯЎ (MacroDroid)
router.post("/push", async (req, res) => {
  try {
    // Прымаем дадзеныя (падтрымка Raw Text ад MacroDroid)
    const senderRaw = (
      req.body.sender ||
      req.body.not_title ||
      "Unknown"
    ).trim();
    const text = (
      req.body.text ||
      req.body.bigText ||
      req.body.notification ||
      ""
    ).trim();
    const source = req.body.source || "viber"; // MacroDroid павінен дасылаць source=viber або source=telegram

    if (!text || text.length < 15)
      return res.status(200).json({ status: "ignored_too_short" });

    // 1. ДЭДУПЛІКАЦЫЯ (ПА ХЭШЫ)
    const textHash = normalizeText(text);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const duplicate = await UnprocessedMessage.findOne({
      textHash,
      createdAt: { $gte: oneHourAgo },
    });

    if (duplicate) {
      console.log(`🚫 Дубль адсечаны (${source})`);
      return res.status(200).json({ status: "ignored_duplicate" });
    }

    // 2. ВАЙТЛІСТ (толькі для Viber)
    let agency = getWhitelistedAgency(senderRaw);
    if (!agency && source === "viber") {
      return res.status(200).json({ status: "ignored_not_whitelisted" });
    }
    if (!agency) agency = "UNKNOWN";

    // 3. ЖОРСТКІ ФІЛЬТР (Regex)
    if (shouldIgnoreMessage(text))
      return res.status(200).json({ status: "ignored_noise_regex" });

    // 4. GEMINI КЛАСІФІКАЦЫЯ
    console.log(`🔍 Gemini аналізуе паведамленне ад ${agency} (${source})...`);
    const classification = await classifyWithGemini(text);

    if (classification.category === "NOISE") {
      return res.status(200).json({ status: "ignored_noise_ai" });
    }

    // 5. АЎТАМАТЫЗАЦЫЯ (КАЛІ ЎКЛЮЧАНА)
    if (classification.category === "FULL_VACANCY" && AUTO_PROCESS_VACANCIES) {
      console.log("🚀 Аўта-парсінг вакансіі ўключаны! Запуск Groq...");
      const result = await processVacancyMessage(text, senderRaw, agency);
      return res
        .status(200)
        .json({ status: "auto_processed", vacancyId: result._id });
    }

    // 6. ЗАХАВАННЕ Ў ПЯСОЧНІЦУ
    const categoryMap = {
      UPDATE: "update",
      RECRUITER_INFO: "info",
      FULL_VACANCY: "vacancy",
    };
    const newMsg = new UnprocessedMessage({
      sender: senderRaw,
      agencyName: agency,
      text: classification.translatedText || text,
      textHash: textHash,
      source: source,
      category: categoryMap[classification.category] || "info",
      processed: false,
    });

    await newMsg.save();
    console.log(`📥 Захавана ў Пясочніцу: ${newMsg.category}`);
    res.status(200).json({ status: "saved_to_inbox" });
  } catch (error) {
    console.error("❌ Inbox Push Error:", error);
    res.status(200).json({ status: "error_logged" });
  }
});

// GET /api/inbox - Выдача для фронта (без Chat)
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

// Астатнія метады (stats, cleanup, bulk, delete) застаюцца як былі...
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
      if (shouldIgnoreMessage(msg.text) || msg.category === "chat") {
        await msg.deleteOne();
        deleted++;
        continue;
      }
      const newCategory = classify(msg.text);
      if (newCategory !== msg.category && newCategory !== "chat") {
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
