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

// РЭЖЫМ АЎТАПІЛОТА
const AUTO_PROCESS_VACANCIES = true;
const processingCache = new Set();

// Хэлпер для нармалізацыі тэксту (дэдуплікацыя)
function normalizeText(text) {
  if (!text) return "";
  return text.toLowerCase().replace(/[^a-zа-яёіў0-9]/gi, "");
}

// Хэлпер для хуткай класіфікацыі (выкарыстоўваецца ў cleanup)
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

// --- ГАЛОЎНЫ РОЎТ ПРЫЁМУ (MacroDroid) ---
router.post("/push", async (req, res) => {
  const text = (req.body.text || req.body.notification || "").trim();

  // 1. ІМГНЕННЫ ФІЛЬТР ШУМУ (Крок 1: адсякаем сістэмныя паведамленні адразу)
  if (shouldIgnoreMessage(text)) {
    // Выводзім першыя 60 сімвалаў, каб разумець, што менавіта адфільтравалася
    console.log(
      `🗑️ Адхілена (Regex): "${text.substring(0, 60).replace(/\n/g, " ")}..."`,
    );
    return res.status(200).json({ status: "ignored_noise" });
  }

  const textHash = normalizeText(text);

  // Абарона ад адначасовых запытаў
  if (processingCache.has(textHash)) {
    return res.status(200).json({ status: "ignored_concurrent" });
  }

  try {
    processingCache.add(textHash);
    const senderRaw = (
      req.body.sender ||
      req.body.not_title ||
      "Unknown"
    ).trim();
    const source = req.body.source || "viber";

    // 2. ПРАВЕРКА ВАЙТЛІСТА
    const agency = getWhitelistedAgency(senderRaw);
    if (agency === "IGNORE_SELF") {
      return res.status(200).json({ status: "ignored_self_loop" });
    }
    if (!agency) {
      console.log(`⚠️ Чат не ў вайтлісце: ${senderRaw}`);
      return res.status(200).json({ status: "ignored_not_whitelisted" });
    }

    // 3. ХЭШ-ДЭДУПЛІКАЦЫЯ (24 гадзіны)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const exactDuplicate = await UnprocessedMessage.findOne({
      textHash,
      createdAt: { $gte: twentyFourHoursAgo },
    });
    if (exactDuplicate) {
      return res.status(200).json({ status: "ignored_exact_duplicate" });
    }

    // 4. ЗБОР КАНТЭКСТУ ДЛЯ GEMINI (12 гадзін)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const recentMessages = await UnprocessedMessage.find({
      agencyName: agency,
      createdAt: { $gte: twelveHoursAgo },
    }).limit(10);
    const recentVacancies = await Vacancy.find({
      agencyName: agency,
      createdAt: { $gte: twelveHoursAgo },
    }).limit(5);

    // 5. АНАЛІЗ GEMINI (Сэмантычная праверка)
    const analysis = await analyzeAndCompareWithGemini(
      text,
      recentMessages,
      recentVacancies,
    );

    // Калі Gemini адхіліў як дубль або шум
    if (
      !analysis.error &&
      (analysis.category === "NOISE" ||
        analysis.comparison.verdict === "DUPLICATE")
    ) {
      console.log(`🚫 Gemini адхіліў: ${analysis.comparison.reason}`);
      return res.status(200).json({ status: "ignored_semantic_duplicate" });
    }

    // 6. ПРАВЕРКА НА АБРЭЗКУ (isTruncated)
    const truncated = isTruncated(text);

    // 7. ЗАХАВАННЕ Ў ПЯСОЧНІЦУ (Save-First Strategy)
    const categoryMap = {
      UPDATE: "update",
      RECRUITER_INFO: "info",
      FULL_VACANCY: "vacancy",
    };

    // Вызначаем катэгорыю: калі абрэзана — заўсёды vacancy
    let finalCategory = categoryMap[analysis.category] || "info";
    if (truncated) finalCategory = "vacancy";
    if (analysis.comparison.verdict === "UPDATE") finalCategory = "update";
    if (analysis.error) finalCategory = "info";

    const newMsg = new UnprocessedMessage({
      sender: senderRaw,
      agencyName: agency,
      text: text,
      rawText: analysis.translatedText || text,
      textHash: textHash,
      source: source,
      category: finalCategory,
      isTruncated: truncated,
      processed: false,
    });

    await newMsg.save();
    console.log(`📥 Захавана ў Пясочніцу (${newMsg.category}): ${senderRaw}`);

    // 8. АЎТА-ПАРСІНГ (Толькі для поўных новых вакансій)
    if (
      !analysis.error &&
      analysis.category === "FULL_VACANCY" &&
      analysis.comparison.verdict === "NEW" &&
      !truncated &&
      AUTO_PROCESS_VACANCIES
    ) {
      console.log("🚀 Запуск Groq-парсера...");
      try {
        const result = await processVacancyMessage(
          analysis.translatedText,
          senderRaw,
          agency,
          text,
          truncated,
        );
        if (result && result._id) {
          newMsg.processed = true;
          await newMsg.save();
          return res
            .status(200)
            .json({ status: "auto_processed", vacancyId: result._id });
        }
      } catch (err) {
        console.error("❌ Groq Error:", err.message);
      }
    }

    res.status(200).json({ status: "saved_to_inbox" });
  } catch (error) {
    console.error("❌ Inbox Push Error:", error);
    res.status(200).json({ status: "error_logged" });
  } finally {
    processingCache.delete(textHash);
  }
});

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
