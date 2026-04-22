// backend/routes/inbox.js
const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");
const { classifyWithGemini } = require("../services/gemini.service");
const { classifyMessage } = require("../services/classifier.service");
const { processVacancyMessage } = require("./vacancies");
const {
  shouldIgnoreMessage,
  getWhitelistedAgency,
} = require("../utils/messageFilters");

// =====================================================================
// КЛАСІФІКАЦЫЯ (Лакальная дапаможная функцыя для ручнога Cleanup)
// =====================================================================
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

    // 1. ДЭДУПЛІКАЦЫЯ (Каб не плаціць за адно і тое ж паведамленне двойчы)
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    const duplicate = await UnprocessedMessage.findOne({
      text: text,
      createdAt: { $gte: tenMinsAgo },
    });

    if (duplicate) {
      console.log("🚫 Дубль ігнаруецца");
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
      // Перадаем у Groq толькі тое, што Gemini палічыў вакансіяй
      const result = await processVacancyMessage(text, senderRaw, agency);
      return res
        .status(200)
        .json({ status: "auto_processed", vacancyId: result._id });
    } else {
      // UPDATE або RECRUITER_INFO — у Пясочніцу
      const categoryMap = { UPDATE: "update", RECRUITER_INFO: "info" };

      const newMsg = new UnprocessedMessage({
        sender: senderRaw,
        agencyName: agency,
        text: classification.translatedText || text,
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
// POST /api/inbox/push-userbot
router.post("/push-userbot", async (req, res) => {
  try {
    const { rawText, senderInfo } = req.body;

    if (!rawText || rawText.length < 15) return res.sendStatus(200);

    // 1. Жорсткі фільтр
    if (shouldIgnoreMessage(rawText)) return res.sendStatus(200);

    // 2. Класіфікацыя Gemini
    const classification = await classifyWithGemini(rawText);

    if (classification.category === "NOISE") return res.sendStatus(200);

    if (classification.category === "FULL_VACANCY") {
      // Калі гэта вакансія — запускаем Groq
      const result = await processVacancyMessage(
        rawText,
        senderInfo,
        classification.agency,
      );
      return res.json({ status: "auto_processed", id: result._id });
    } else {
      // Калі UPDATE або INFO — у Пясочніцу
      const categoryMap = { UPDATE: "update", RECRUITER_INFO: "info" };
      const newMsg = new UnprocessedMessage({
        sender: senderInfo,
        agencyName: classification.agency || "UNKNOWN",
        text: classification.translatedText || rawText,
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
// GET /api/inbox/stats - Статыстыка для фронтэнда
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

// POST /api/inbox/cleanup - Ачыстка ад шуму і перакласіфікацыя
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

// DELETE /api/inbox/bulk - Масавае выдаленне
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

// GET /api/inbox - Спіс паведамленняў
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

// DELETE /api/inbox/:id
router.delete("/:id", async (req, res) => {
  try {
    await UnprocessedMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Выдалена" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/inbox/:id/process
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
