// backend/routes/inbox.js
const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");
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
    // MacroDroid можа дасылаць назву чата ў розных палях
    const senderRaw = (body.sender || body.not_title || "").trim();
    let text = body.bigText || body.text || body.notification || "";

    // 1. Праверка на вайтліст (ці гэта чат агенцыі?)
    const agency = getWhitelistedAgency(senderRaw);
    if (!agency) {
      return res.status(200).json({ status: "ignored_not_whitelisted" });
    }

    // 2. Жорсткі фільтр шуму (Regex)
    if (shouldIgnoreMessage(text)) {
      console.log(
        `🗑️ Шум адфільтраваны: [${agency}] ${text.substring(0, 40)}...`,
      );
      return res.status(200).json({ status: "ignored_noise" });
    }

    console.log(`✅ Паведамленне прайшло фільтр: ${agency} [${senderRaw}]`);

    // 3. Класіфікацыя праз AI
    const classification = await classifyMessage(text, senderRaw);
    const finalAgency =
      classification.agency === "UNKNOWN" || !classification.agency
        ? agency
        : classification.agency;

    // 4. Калі гэта поўная вакансія з высокім даверам — аўта-працэсінг
    if (
      classification.category === "FULL_VACANCY" &&
      classification.confidence > 0.7
    ) {
      const result = await processVacancyMessage(text, senderRaw, finalAgency);
      return res.status(200).json({
        status: "auto_processed",
        vacancyId: result._id,
      });
    } else {
      // 5. Ва ўсіх астатніх выпадках — у Пясочніцу (Inbox)
      const categoryMap = {
        UPDATE: "update",
        FULL_VACANCY: "vacancy",
        RECRUITER_INFO: "info", // Цяпер дазволена ў мадэлі
        NOISE: "chat",
      };

      await new UnprocessedMessage({
        sender: senderRaw,
        agencyName: finalAgency,
        text: classification.translatedText || text,
        source: body.source || "viber",
        category: categoryMap[classification.category] || "chat",
        processed: false,
      }).save();

      res
        .status(200)
        .json({ status: "success", category: classification.category });
    }
  } catch (error) {
    console.error("❌ Inbox Push Error:", error);
    // Вяртаем 200, каб MacroDroid не зацыкліваў спробы пры памылцы
    res.status(200).json({ status: "error", message: error.message });
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
