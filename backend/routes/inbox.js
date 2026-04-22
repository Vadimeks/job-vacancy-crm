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

// =====================================================================
// ДАПАМОЖНЫЯ ФУНКЦЫІ
// =====================================================================

/**
 * Нармалізацыя тэксту для параўнання: выдаляем эмодзі, сімвалы, прабелы і пунктуацыю.
 * Гэта дазваляе адсякаць дублікаты, нават калі ў іх розныя эмодзі.
 */
function normalizeText(text) {
  if (!text) return "";
  return text
    .replace(
      /[\p{Emoji}\p{Emoji_Presentation}\p{Symbol}\s\p{Punctuation}]/gu,
      "",
    )
    .toLowerCase();
}

/**
 * Лакальная класіфікацыя для ручнога Cleanup
 */
function classify(text) {
  if (!text) return "chat";
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
  return "chat";
}

// =====================================================================
// POST /api/inbox/push (Viber Gateway / Android Bridge)
// =====================================================================
router.post("/push", async (req, res) => {
  try {
    const body = req.body || {};
    const senderRaw = (body.sender || body.not_title || "").trim();
    let text = body.bigText || body.text || body.notification || "";

    if (!text || text.length < 15)
      return res.status(200).json({ status: "ignored_too_short" });

    // 1. РАЗУМНАЯ ДЭДУПЛІКАЦЫЯ
    const textHash = normalizeText(text);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const duplicate = await UnprocessedMessage.findOne({
      textHash,
      createdAt: { $gte: oneHourAgo },
    });

    if (duplicate) {
      console.log("🚫 Дубль адсечаны (Viber)");
      return res.status(200).json({ status: "ignored_duplicate" });
    }

    // 2. ВАЙТЛІСТ (Ці наш гэта чат?)
    const agency = getWhitelistedAgency(senderRaw);
    if (!agency)
      return res.status(200).json({ status: "ignored_not_whitelisted" });

    // 3. ЖОРСТКІ ФІЛЬТР (Regex)
    if (shouldIgnoreMessage(text))
      return res.status(200).json({ status: "ignored_noise_regex" });

    console.log(`🔍 Gemini аналізуе паведамленне ад ${agency}...`);

    // 4. КЛАСІФІКАЦЫЯ GEMINI
    const classification = await classifyWithGemini(text);

    if (classification.category === "NOISE") {
      console.log("🗑️ Gemini вызначыў як шум");
      return res.status(200).json({ status: "ignored_noise_ai" });
    }

    // 5. РАЗМЕРКАВАННЕ
    if (classification.category === "FULL_VACANCY") {
      console.log("🚀 Гэта вакансія! Запуск Groq-парсера...");
      const result = await processVacancyMessage(text, senderRaw, agency);
      return res
        .status(200)
        .json({ status: "auto_processed", vacancyId: result._id });
    } else {
      const categoryMap = { UPDATE: "update", RECRUITER_INFO: "info" };
      const newMsg = new UnprocessedMessage({
        sender: senderRaw,
        agencyName: agency,
        text: classification.translatedText || text,
        textHash: textHash, // ЗАХОЎВАЕМ ХЭШ
        source: "viber",
        category: categoryMap[classification.category] || "chat",
        processed: false,
      });
      await newMsg.save();
      console.log(`📥 Захавана ў Пясочніцу: ${classification.category}`);
      res.status(200).json({ status: "saved_to_inbox" });
    }
  } catch (error) {
    console.error("❌ Inbox Push Error:", error);
    res.status(200).json({ status: "error" });
  }
});

// =====================================================================
// POST /api/inbox/push-userbot (Telegram Userbot)
// =====================================================================
router.post("/push-userbot", async (req, res) => {
  try {
    const { rawText, senderInfo } = req.body;

    if (!rawText || rawText.length < 15) return res.sendStatus(200);

    // 1. РАЗУМНАЯ ДЭДУПЛІКАЦЫЯ
    const textHash = normalizeText(rawText);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const duplicate = await UnprocessedMessage.findOne({
      textHash,
      createdAt: { $gte: oneHourAgo },
    });

    if (duplicate) {
      console.log("🚫 Дубль адсечаны (Userbot)");
      return res.status(200).json({ status: "ignored_duplicate" });
    }

    // 2. ЖОРСТКІ ФІЛЬТР (Regex)
    if (shouldIgnoreMessage(rawText)) return res.sendStatus(200);

    // 3. КЛАСІФІКАЦЫЯ GEMINI
    const classification = await classifyWithGemini(rawText);

    if (classification.category === "NOISE") return res.sendStatus(200);

    if (classification.category === "FULL_VACANCY") {
      console.log("🚀 Гэта вакансія з Юзербота! Запуск Groq...");
      const result = await processVacancyMessage(
        rawText,
        senderInfo,
        classification.agency,
      );
      return res.json({ status: "auto_processed", id: result._id });
    } else {
      const categoryMap = { UPDATE: "update", RECRUITER_INFO: "info" };
      const newMsg = new UnprocessedMessage({
        sender: senderInfo,
        agencyName: classification.agency || "UNKNOWN",
        text: classification.translatedText || rawText,
        textHash: textHash, // ЗАХОЎВАЕМ ХЭШ
        source: "telegram_userbot",
        category: categoryMap[classification.category] || "chat",
      });
      await newMsg.save();
      return res.json({ status: "saved_to_inbox" });
    }
  } catch (error) {
    console.error("❌ Userbot Push Error:", error);
    res.sendStatus(500);
  }
});

// =====================================================================
// АСТАТНІЯ МАРШРУТЫ
// =====================================================================

router.get("/stats", async (req, res) => {
  try {
    const [total, vacancy, update, info, chat] = await Promise.all([
      UnprocessedMessage.countDocuments({ processed: false }),
      UnprocessedMessage.countDocuments({
        processed: false,
        category: "vacancy",
      }),
      UnprocessedMessage.countDocuments({
        processed: false,
        category: "update",
      }),
      UnprocessedMessage.countDocuments({ processed: false, category: "info" }),
      UnprocessedMessage.countDocuments({ processed: false, category: "chat" }),
    ]);
    res.json({ total, vacancy, update, info, chat });
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

router.get("/", async (req, res) => {
  try {
    const { category, limit = 200 } = req.query;
    const filter = { processed: false };
    if (category && category !== "all") filter.category = category;
    const messages = await UnprocessedMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(messages);
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
