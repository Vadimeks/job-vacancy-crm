const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

// 1. Прыём паведамленняў (ужо ёсць)
router.post("/push", async (req, res) => {
  // Гэты лог дапаможа ўбачыць, што прыслаў тэлефон
  console.log("📥 [Inbox] Raw body:", req.body);

  try {
    const { sender, text, source } = req.body || {};

    if (!text) {
      console.log("⚠️ Тэкст паведамлення адсутнічае.");
      return res.status(200).json({ status: "ignored_no_text" });
    }

    // Вызначаем катэгорыю
    let category = "chat";
    const t = text.toLowerCase();
    if (
      t.includes("вакансія") ||
      t.includes("zł/h") ||
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

    // ЗАПІСВАЕМ У БАЗУ (дадаем category)
    const newMessage = new UnprocessedMessage({
      sender: sender || "Невядомы",
      text,
      source: source || "viber",
      category, // <--- ВАЖНА: дадалі запіс катэгорыі
    });

    await newMessage.save();
    console.log(`✅ [Inbox] Захавана ад ${sender}: ${category}`);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("❌ [Inbox] Памылка:", error);
    res.status(500).json({ status: "error" });
  }
});

// 2. Атрыманне ўсіх неапрацаваных паведамленняў
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

// 3. Выдаленне паведамлення
router.delete("/:id", async (req, res) => {
  try {
    await UnprocessedMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Паведамленне выдалена" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
