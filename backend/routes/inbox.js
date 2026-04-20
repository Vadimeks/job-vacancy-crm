const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

router.post("/push", async (req, res) => {
  // Гэты лог пакажа нам у Render, што РЭАЛЬНА прыйшло
  console.log("--- НОВЫ ЗАПЫТ ---");
  console.log("Body:", req.body);

  try {
    const body = req.body || {};

    // Бярэм тэкст з любога магчымага поля (на выпадак памылак у MacroDroid)
    const text = body.text || body.notification || body.not_text || "";
    const sender = body.sender || body.not_title || "Невядомы";
    const source = body.source || "viber";

    if (!text || text.length < 2) {
      console.log("⚠️ Тэкст занадта кароткі або адсутнічае, ігнаруем.");
      return res.status(200).json({ status: "ignored_empty" });
    }

    // Класіфікацыя
    let category = "chat";
    const t = text.toLowerCase();
    if (
      t.includes("вакансія") ||
      t.includes("zł") ||
      t.includes("netto") ||
      t.includes("шукаем")
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
      source,
      category,
      isRead: false,
    });

    await newMessage.save();
    console.log(`✅ Захавана: ${sender} -> ${category}`);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("❌ Памылка:", error);
    res.status(500).json({ status: "error", message: error.message });
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
