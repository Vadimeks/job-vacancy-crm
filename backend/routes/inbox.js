const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

// =====================================================================
// ДАКЛАДНЫ МАППІНГ: назва чата → агенцыя
// Параўнанне case-insensitive, поўнае супадзенне
// =====================================================================
const CHAT_AGENCY_MAP = {
  "посередники apolo": "APOLO",
  "biedronka - ppg partner (sistempl)": "Global",
  "партнери jobsi": "BISAR",
  "est polska": "EST",
  "вакансіі ewl (рекрутація)": "EWL",
  "fws rekrutacja": "FWS",
  "partner/intraservis": "Intraservice",
  "kono | partners hub": "KONO",
  "manpower freelance_2025": "MANPAWER",
  "mrówki group partners": "MRÓWKI",
  "вакансии для партнеров": "NIDEN",
  "otto  - робота в польщі": "OTTO",
  "otto для партнерів": "OTTO",
  "rekrutacja ps informacje": "PERSONEL SERVICE",
  "grupa progres/актуальні вакансії": "PROGRES",
  "works4you вакансии в польше": "RALEN",
};

/**
 * Вяртае { agency, chatLabel } або null калі чат не ў спісе
 */
function resolveAgency(senderRaw) {
  const lower = senderRaw.toLowerCase().trim();
  const agency = CHAT_AGENCY_MAP[lower];
  if (!agency) return null;
  return {
    agency,
    chatLabel: `${senderRaw} (${agency})`,
  };
}

// --- ШАБЛОНЫ СМЕЦЦЯ ---
const NOISE_PATTERNS = [
  /^ви маєте нові повідомлення в:/i,
  /^новий коментар до вашого повідомлення/i,
  /^дивіться топ-повідомлення від/i,
  /реагує .* на "/i,
  /відповідає:/i,
  /вхідний виклик/i,
  /пропущений виклик/i,
  /^you have new messages in:/i,
];

function isNoise(text) {
  if (!text || text.trim().length < 5) return true;
  return NOISE_PATTERNS.some((p) => p.test(text.trim()));
}

// --- КЛАСІФІКАЦЫЯ ---
function classify(text) {
  if (!text) return "chat";
  const t = text.toLowerCase();
  if (
    t.includes("вакансія") ||
    t.includes("вакансії") ||
    t.includes("zł") ||
    t.includes("netto") ||
    t.includes("brutto") ||
    t.includes("шукаем") ||
    t.includes("шукаємо") ||
    t.includes("заезд") ||
    t.includes("оплата") ||
    t.includes("umowa") ||
    t.includes("praca") ||
    (t.includes("місто") && t.includes("zł"))
  ) {
    return "vacancy";
  }
  if (
    t.includes("стоп") ||
    t.includes("актуально") ||
    t.includes("актуальна") ||
    t.includes("добор") ||
    t.includes("дабор") ||
    t.includes("закрито") ||
    t.includes("набір")
  ) {
    return "update";
  }
  return "chat";
}

// =====================================================================
// POST /api/inbox/push
// =====================================================================
router.post("/push", async (req, res) => {
  try {
    const body = req.body || {};
    const senderRaw = (body.sender || body.not_title || "").trim();

    if (!senderRaw) {
      return res.status(200).json({ status: "ignored", reason: "no_sender" });
    }

    // WHITELIST: толькі вядомыя чаты
    const resolved = resolveAgency(senderRaw);
    if (!resolved) {
      console.log(`⏭ Невядомы чат: ${senderRaw}`);
      return res.status(200).json({ status: "not_whitelisted" });
    }

    const { agency, chatLabel } = resolved;

    // ВЫБАР ТЭКСТУ
    let text = "";
    [body.bigText, body.bigtext, body.text, body.notification].forEach((c) => {
      if (
        c &&
        typeof c === "string" &&
        c.length > text.length &&
        !c.includes("urlencode:")
      ) {
        text = c;
      }
    });

    if (!text || text.length < 2) {
      const longKey = Object.keys(body).find(
        (k) => !["sender", "source", "text"].includes(k) && k.length > 10,
      );
      if (longKey) text = longKey;
    }

    // ФІЛЬТР СМЕЦЦЯ
    if (isNoise(text)) {
      return res.status(200).json({ status: "ignored" });
    }

    // ДЭДУПЛІКАЦЫЯ (10 хвілін)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const duplicate = await UnprocessedMessage.findOne({
      sender: chatLabel,
      text,
      createdAt: { $gte: tenMinutesAgo },
    });
    if (duplicate) {
      return res.status(200).json({ status: "duplicate" });
    }

    const category = classify(text);

    await new UnprocessedMessage({
      sender: chatLabel, // "OTTO для Партнерів (OTTO)"
      agencyName: agency, // "OTTO"
      text,
      source: body.source || "viber",
      category,
    }).save();

    console.log(`✅ [${category}] ${chatLabel}: ${text.substring(0, 60)}`);
    res.status(200).json({ status: "success", category, agency });
  } catch (error) {
    console.error("❌ inbox/push:", error);
    res.status(500).json({ status: "error" });
  }
});

// GET /api/inbox/stats  ← ПЕРАД /:id
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

// DELETE /api/inbox/bulk  ← ПЕРАД /:id
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
    console.error("❌ bulk delete:", error);
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
