const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

// --- ШАБЛОНЫ СМЕЦЦЯ: паведамленні, якія НЕ трэба захоўваць ---
const NOISE_PATTERNS = [
  /^ви маєте нові повідомлення в:/i,
  /^новий коментар до вашого повідомлення$/i,
  /^дивіться топ-повідомлення від/i,
  /реагує на ваше повідомлення/i,
  /відповідає:/i,
  /^you have new messages in:/i,
];

function isNoise(text) {
  if (!text) return true;
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
    t.includes("умова праці") ||
    t.includes("umowa") ||
    t.includes("praca") ||
    t.includes("robota") ||
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

// POST /api/inbox/push — прыём з MacroDroid
router.post("/push", async (req, res) => {
  try {
    const body = req.body || {};

    // Збіраем тэкст: bigText > text > notification
    let text = "";
    const candidates = [
      body.bigText,
      body.bigtext,
      body.text,
      body.notification,
    ];
    candidates.forEach((c) => {
      if (
        c &&
        typeof c === "string" &&
        c.length > text.length &&
        !c.includes("urlencode:")
      ) {
        text = c;
      }
    });

    // Калі ўсё яшчэ пуста — шукаем доўгі ключ (разламаны запыт)
    if (!text || text.length < 2) {
      const longKey = Object.keys(body).find(
        (k) => !["sender", "source", "text"].includes(k) && k.length > 10,
      );
      if (longKey) text = longKey;
    }

    const sender = body.sender || body.not_title || "Невядомы";

    // Фільтрацыя смецця
    if (!text || text.length < 5 || isNoise(text)) {
      console.log(`⏭ Прапушчана (шум): ${sender}: ${text?.substring(0, 40)}`);
      return res.status(200).json({ status: "ignored" });
    }

    // Дэдуплікацыя: той самы тэкст ад таго ж адпраўніка за 10 хвілін
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const duplicate = await UnprocessedMessage.findOne({
      sender,
      text,
      createdAt: { $gte: tenMinutesAgo },
    });

    if (duplicate) {
      console.log(`⏭ Дублікат прапушчаны: ${sender}`);
      return res.status(200).json({ status: "duplicate" });
    }

    const category = classify(text);

    const newMessage = new UnprocessedMessage({
      sender,
      text,
      source: body.source || "viber",
      category,
    });

    await newMessage.save();
    console.log(
      `✅ Захавана [${category}] ад ${sender}: ${text.substring(0, 40)}...`,
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("❌ Памылка:", error);
    res.status(500).json({ status: "error" });
  }
});

// GET /api/inbox — спіс непрацэсаваных
router.get("/", async (req, res) => {
  try {
    const { category, limit = 100 } = req.query;
    const filter = { processed: false };
    if (category) filter.category = category;

    const messages = await UnprocessedMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  } catch (error) {
    res.json({ total: 0, vacancy: 0, update: 0, chat: 0 });
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

// DELETE /api/inbox/bulk — масавае выдаленне
router.delete("/bulk", async (req, res) => {
  try {
    const { ids, category, all } = req.body;

    let result;
    if (all) {
      result = await UnprocessedMessage.deleteMany({ processed: false });
    } else if (category) {
      result = await UnprocessedMessage.deleteMany({
        processed: false,
        category,
      });
    } else if (ids?.length) {
      result = await UnprocessedMessage.deleteMany({ _id: { $in: ids } });
    } else {
      return res.status(400).json({ message: "Нічога не пазначана" });
    }

    res.json({ deleted: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/inbox/:id/process — пазначыць як апрацаванае
router.patch("/:id/process", async (req, res) => {
  try {
    await UnprocessedMessage.findByIdAndUpdate(req.params.id, {
      processed: true,
    });
    res.json({ message: "Пазначана як апрацаванае" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
