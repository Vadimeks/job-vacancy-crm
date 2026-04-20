const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

// 1. Прыём паведамленняў (ужо ёсць)
router.post("/push", async (req, res) => {
  try {
    // Калі req.body адсутнічае, выкарыстоўваем пусты аб'ект, каб не было памылкі
    const { sender, text, source } = req.body || {};
    if (!text || text.includes("[notification_text]")) {
      console.log(
        "⚠️ Атрымана пустое паведамленне або няправільныя зменныя, ігнаруем.",
      );
      return res.status(200).json({ status: "ignored" });
    }
    // Далей твая логіка (класіфікацыя і захаванне)...
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
    const newMessage = new UnprocessedMessage({ sender, text, source });

    await newMessage.save();
    console.log(`📥 [Inbox] Атрымана паведамленне з ${source}: ${sender}`);
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
