const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

// =====================================================================
// МАППІНГ: ключавая частка назвы чата → агенцыя
// Параўнанне case-insensitive, частковае (includes).
// Парадак важны — больш дакладныя запісы вышэй.
// =====================================================================
const CHAT_AGENCY_MAP = [
  { key: "посередники apolo", agency: "APOLO" },
  { key: "biedronka - ppg partner", agency: "Global" },
  { key: "партнери jobsi", agency: "BISAR" },
  { key: "est polska", agency: "EST" },
  { key: "вакансіі ewl", agency: "EWL" },
  { key: "fws rekrutacja", agency: "FWS" },
  { key: "partner/intraservis", agency: "Intraservice" },
  { key: "partner / intraservis", agency: "Intraservice" },
  { key: "kono | partners hub", agency: "KONO" },
  { key: "manpower freelance", agency: "MANPOWER" },
  { key: "mrówki group partners", agency: "MRÓWKI" },
  { key: "вакансии для партнеров", agency: "NIDEN" },
  { key: "otto  - робота", agency: "OTTO" },
  { key: "otto - робота", agency: "OTTO" },
  { key: "otto для партнерів", agency: "OTTO" },
  { key: "rekrutacja ps", agency: "PERSONEL SERVICE" },
  { key: "grupa progres", agency: "PROGRES" },
  { key: "works4you", agency: "RALEN" },
  { key: "Exx", agency: "UNKNOWN" },
];

function resolveAgency(senderRaw) {
  const lower = senderRaw.toLowerCase();
  for (const entry of CHAT_AGENCY_MAP) {
    if (lower.includes(entry.key)) {
      return {
        agency: entry.agency,
        chatLabel: `${senderRaw} (${entry.agency})`,
      };
    }
  }
  return null;
}

// =====================================================================
// ШАБЛОНЫ СМЕЦЦЯ
// =====================================================================
const NOISE_PATTERNS = [
  /^ви маєте нові повідомлення в:/i,
  /^новий коментар до вашого повідомлення/i,
  /^дивіться топ-повідомлення від/i,
  /реагує .* на "/i,
  /відповідає:/i,
  /вхідний виклик/i,
  /пропущений виклик/i,
  /^you have new messages in:/i,
  /приєднався до /i,
  /приєдналась до /i,
  /покинув групу/i,
  /покинула групу/i,
  /додав .* до групи/i,
  /можу подати/i,
  /можна подати/i,
  /не отвечает на звонки/i,
  /не відповідає на дзвінки/i,
  /не відповідає мені/i,
  /^доброго дня[,.]?\s*$/i,
  /^добрий день[,.]?\s*$/i,
  /^дякую[.!]?\s*$/i,
];

function isNoise(text) {
  if (!text || text.trim().length < 5) return true;
  return NOISE_PATTERNS.some((p) => p.test(text.trim()));
}

// =====================================================================
// КЛАСІФІКАЦЫЯ
// =====================================================================
function classify(text) {
  if (!text) return "chat";
  const t = text.toLowerCase();

  if (
    t.includes("zł") ||
    t.includes("netto") ||
    t.includes("brutto") ||
    t.includes("шукаем") ||
    t.includes("шукаємо") ||
    t.includes("umowa") ||
    t.includes("praca") ||
    t.includes("zatrudni") ||
    t.includes("вакансія") ||
    t.includes("вакансії") ||
    t.includes("заезд") ||
    t.includes("rekrutacj") ||
    (t.includes("netto") && t.match(/\d{3,}/))
  )
    return "vacancy";

  if (
    t.includes("стоп") ||
    t.includes("актуально") ||
    t.includes("актуальна") ||
    t.includes("актуальні") ||
    t.includes("закрито") ||
    t.includes("закрыто") ||
    t.includes("добор") ||
    t.includes("дабор") ||
    t.includes("набір") ||
    (t.includes("всі вакансії") &&
      (t.includes("актуальн") || t.includes("вчора")))
  )
    return "update";

  return "chat";
}

// =====================================================================
// POST /api/inbox/push
// =====================================================================
router.post("/push", async (req, res) => {
  try {
    const body = req.body || {};
    const senderRaw = (body.sender || body.not_title || "").trim();

    if (!senderRaw) return res.status(200).json({ status: "ignored" });

    const resolved = resolveAgency(senderRaw);
    if (!resolved) {
      console.log(`⏭ Невядомы чат: ${senderRaw}`);
      return res.status(200).json({ status: "not_whitelisted" });
    }

    const { agency, chatLabel } = resolved;

    // Выбар тэксту
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

    if (isNoise(text)) {
      return res.status(200).json({ status: "ignored" });
    }

    // Дэдуплікацыя (10 хвілін)
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
      sender: chatLabel,
      agencyName: agency,
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

// POST /api/inbox/cleanup — ачыстка і перакласіфікацыя базы
router.post("/cleanup", async (req, res) => {
  try {
    const all = await UnprocessedMessage.find({ processed: false });
    let deleted = 0;
    let reclassified = 0;

    for (const msg of all) {
      if (isNoise(msg.text)) {
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

    console.log(
      `🧹 Cleanup: выдалена ${deleted}, перакласіфікавана ${reclassified}`,
    );
    res.json({ deleted, reclassified });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
