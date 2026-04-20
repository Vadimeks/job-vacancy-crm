const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

// 1. Прыём паведамленняў (ужо ёсць)
router.post("/push", async (req, res) => {
  try {
    const { sender, text, source } = req.body;
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
