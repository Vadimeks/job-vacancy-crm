const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

router.post("/push", async (req, res) => {
  console.log("--- НОВЫ ЗАПЫТ ---");
  console.log("Body:", req.body);

  try {
    const body = req.body || {};
    const sender = body.sender || body.not_title || "Невядомы";

    // ВЫБАР ТЭКСТУ: Бярэм самае доўгае з даступных палёў
    let text = "";
    const candidates = [body.bigText, body.text, body.notification];

    // Шукаем самы доўгі тэкст сярод кандыдатаў
    candidates.forEach((c) => {
      if (c && c.length > text.length && !c.includes("urlencode:")) {
        text = c;
      }
    });

    // ХІТРАСЦЬ: Калі ўсё яшчэ пуста, шукаем у ключах (для разламаных запытаў)
    if (!text || text.length < 2) {
      const keys = Object.keys(body);
      const messageKey = keys.find(
        (k) =>
          k !== "sender" && k !== "source" && k !== "text" && k.length > 10,
      );
      if (messageKey) text = messageKey;
    }

    if (!text || text.length < 2) {
      console.log("⚠️ Паведамленне занадта кароткае або не распазнана.");
      return res.status(200).json({ status: "ignored" });
    }

    // Класіфікацыя
    let category = "chat";
    const t = text.toLowerCase();
    if (
      t.includes("вакансія") ||
      t.includes("zł") ||
      t.includes("netto") ||
      t.includes("шукаем") ||
      t.includes("заезд")
    ) {
      category = "vacancy";
    } else if (
      t.includes("стоп") ||
      t.includes("актуальна") ||
      t.includes("дабор")
    ) {
      category = "update";
    }

    const newMessage = new UnprocessedMessage({
      sender,
      text,
      source: body.source || "viber",
      category,
    });

    await newMessage.save();
    console.log(
      `✅ Захавана ад ${sender}: ${category} (${text.substring(0, 30)}...)`,
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("❌ Памылка:", error);
    res.status(500).json({ status: "error" });
  }
});

// Маршруты для фронтэнда (GET, DELETE, STATS) застаўляюцца без змен...
router.get("/", async (req, res) => {
  try {
    const messages = await UnprocessedMessage.find({ processed: false }).sort({
      createdAt: -1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const unreadCount = await UnprocessedMessage.countDocuments({
      isRead: false,
      processed: false,
    });
    res.json({ unreadCount });
  } catch (error) {
    res.json({ unreadCount: 0 });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await UnprocessedMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Паведамленне выдалена" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
