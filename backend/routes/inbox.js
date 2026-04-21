// backend/routes/inbox.js
const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");
const { classifyMessage } = require("../services/classifier.service");
const { processVacancyMessage } = require("./vacancies");
const { shouldIgnoreMessage } = require("../utils/messageFilters"); // Новы імпарт

// =====================================================================
// МАППІНГ: ключавая частка назвы чата → агенцыя
// =====================================================================
const CHAT_AGENCY_MAP = [
  { key: "посередники apolo", agency: "APOLO" },
  { key: "ppg partner (SistemPL)", agency: "Global" },
  { key: "партнери jobsi", agency: "BISAR" },
  { key: "est-polska", agency: "EST" },
  { key: "вакансіі ewl (рекрутація)", agency: "EWL" },
  { key: "fws rekrutacja", agency: "FWS" },
  { key: "partner/intraservis", agency: "Intraservice" },
  { key: "kono", agency: "KONO" },
  { key: "manpower freelance_2025", agency: "MANPOWER" },
  { key: "mrówki group partners", agency: "MRÓWKI" },
  { key: "вакансии для партнеров", agency: "NIDEN" },
  { key: "otto - робота в Польщі", agency: "OTTO" },
  { key: "otto для партнерів", agency: "OTTO" },
  { key: "rekrutacja ps informacje", agency: "PERSONEL SERVICE" },
  { key: "grupa progres", agency: "PROGRES" },
  { key: "works4you вакансии в Польше", agency: "RALEN" },
  { key: "тест", agency: "Manual" },
];

// =====================================================================
// КЛАСІФІКАЦЫЯ (Лакальная, для Cleanup)
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
// POST /api/inbox/push (Viber Gateway)
// =====================================================================
router.post("/push", async (req, res) => {
  try {
    const body = req.body || {};
    const senderRaw = (body.sender || body.not_title || "").trim();
    let text = body.bigText || body.text || body.notification || "";

    const agency = getWhitelistedAgency(senderRaw);
    if (!agency)
      return res.status(200).json({ status: "ignored_not_whitelisted" });

    if (shouldIgnoreMessage(text))
      return res.status(200).json({ status: "ignored_noise" });

    console.log(`✅ Whitelisted Viber: ${agency} [${senderRaw}]`);

    const classification = await classifyMessage(text, senderRaw);
    const finalAgency =
      classification.agency === "UNKNOWN" ? agency : classification.agency;

    if (
      classification.category === "FULL_VACANCY" &&
      classification.confidence > 0.7
    ) {
      const result = await processVacancyMessage(text, senderRaw, finalAgency);
      return res
        .status(200)
        .json({ status: "auto_processed", vacancyId: result._id });
    } else {
      // ЗАЎСЁДЫ захоўваем у Inbox для вайтліста
      const categoryMap = {
        UPDATE: "update",
        FULL_VACANCY: "vacancy",
        RECRUITER_INFO: "info",
        NOISE: "chat",
      };

      await new UnprocessedMessage({
        sender: senderRaw,
        agencyName: finalAgency,
        text: classification.translatedText || text,
        source: body.source || "viber",
        category: categoryMap[classification.category] || "chat",
      }).save();

      res.status(200).json({ status: "success" });
    }
  } catch (error) {
    console.error("❌ Inbox Push Error:", error);
    res.status(500).json({ status: "error" });
  }
});

// GET /api/inbox/stats
router.get("/stats", async (req, res) => {
  try {
    const [total, vacancy, update, chat] = await Promise.all([
      UnprocessedMessage.countDocuments({ processed: false }),
      UnprocessedMessage.countDocuments({
        processed: false,
        category: "vacancy",
      }),
      UnprocessedMessage.countDocuments({
        processed: false,
        category: "update",
      }),
      UnprocessedMessage.countDocuments({ processed: false, category: "chat" }),
    ]);
    res.json({ total, vacancy, update, chat });
  } catch {
    res.json({ total: 0, vacancy: 0, update: 0, chat: 0 });
  }
});

// POST /api/inbox/cleanup
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

// DELETE /api/inbox/bulk
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

// GET /api/inbox
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
