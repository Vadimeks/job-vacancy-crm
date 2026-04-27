// backend/routes/inbox.js
const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");
const { classifyWithGemini } = require("../services/gemini.service");
const { processVacancyMessage } = require("./vacancies");
const {
  shouldIgnoreMessage,
  getWhitelistedAgency,
  isTruncated, // Імпартуем функцыю праверкі абрэзкі
} = require("../utils/messageFilters");

// РЭЖЫМ АДЛАДКІ: false = усё ідзе ў Інбокс. true = вакансіі адразу ідуць у Groq.
const AUTO_PROCESS_VACANCIES = true; //false калі трэба каб ішло ўсё ў пясочніцу
// Кэш для абароны ад адначасовых запытаў (Race Condition)
const processingCache = new Set();
function normalizeText(text) {
  if (!text) return "";
  // Выдаляем УСЁ акрамя літар і лічбаў (прыбіраем прабелы, эмодзі, пунктуацыю)
  return text.toLowerCase().replace(/[^a-zа-яёіў0-9]/gi, "");
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
  const text = (req.body.text || req.body.notification || "").trim();
  const textHash = normalizeText(text);

  // 1. Абарона ад адначасовых дубляў (пакуль Gemini яшчэ думае)
  if (processingCache.has(textHash)) {
    console.log("⏳ Дубль ужо апрацоўваецца, ігнаруем...");
    return res.status(200).json({ status: "ignored_concurrent" });
  }

  try {
    processingCache.add(textHash); // Дадаем у кэш

    const senderRaw = (
      req.body.sender ||
      req.body.not_title ||
      "Unknown"
    ).trim();
    const source = req.body.source || "viber";

    if (!text || text.length < 15) {
      return res.status(200).json({ status: "ignored_too_short" });
    }

    // 2. Вайтліст
    const agency = getWhitelistedAgency(senderRaw);
    if (agency === "IGNORE_SELF")
      return res.status(200).json({ status: "ignored_self_loop" });
    if (!agency) {
      console.log(`🚫 Чат не ў вайтлісце: ${senderRaw}`);
      return res.status(200).json({ status: "ignored_not_whitelisted" });
    }

    // 3. Дэдуплікацыя (24 гадзіны)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const duplicate = await UnprocessedMessage.findOne({
      textHash,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (duplicate) {
      console.log(`🚫 Дубль знойдзены ў базе (${source})`);
      return res.status(200).json({ status: "ignored_duplicate" });
    }

    // 4. Жорсткі фільтр (Regex)
    if (shouldIgnoreMessage(text)) {
      return res.status(200).json({ status: "ignored_noise_regex" });
    }

    // 5. Аналіз Gemini
    console.log(`🔍 Gemini аналізуе ад ${agency}...`);
    const classification = await classifyWithGemini(text);

    if (classification.category === "NOISE") {
      return res.status(200).json({ status: "ignored_noise_ai" });
    }

    // 6. Праверка на абрэзку (Truncation)
    const truncated = isTruncated(text);
    if (truncated) {
      console.log("⚠️ Тэкст абрэзаны, аўта-парсінг адменены.");
    }

    // 7. Аўта-парсінг (толькі калі НЕ абрэзана і катэгорыя FULL_VACANCY)
    if (
      classification.category === "FULL_VACANCY" &&
      AUTO_PROCESS_VACANCIES &&
      !truncated
    ) {
      console.log("🚀 Запуск Groq для поўнай вакансіі...");
      try {
        const result = await processVacancyMessage(
          classification.translatedText,
          senderRaw,
          agency,
        );
        return res
          .status(200)
          .json({ status: "auto_processed", vacancyId: result._id });
      } catch (err) {
        console.error("❌ Памылка Groq, захоўваем у інбокс.");
      }
    }

    // 8. Захаванне ў Пясочніцу
    const categoryMap = {
      UPDATE: "update",
      RECRUITER_INFO: "info",
      FULL_VACANCY: "vacancy",
    };

    const newMsg = new UnprocessedMessage({
      sender: senderRaw,
      agencyName: agency,
      text: text, // Арыгінал
      rawText: classification.translatedText || text, // Пераклад для рэкрутэра
      textHash: textHash,
      source: source,
      category: categoryMap[classification.category] || "info",
      isTruncated: truncated,
      processed: false,
    });

    await newMsg.save();
    console.log(`📥 Захавана ў Пясочніцу: ${newMsg.category} ад ${agency}`);
    res.status(200).json({ status: "saved_to_inbox" });
  } catch (error) {
    console.error("❌ Inbox Push Error:", error);
    res.status(200).json({ status: "error_logged" });
  } finally {
    processingCache.delete(textHash); // Абавязкова чысцім кэш
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
