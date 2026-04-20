const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

router.post("/push", async (req, res) => {
  try {
    const { sender, text, source } = req.body;

    // Запісваем у MongoDB
    const newMessage = new UnprocessedMessage({ sender, text, source });
    await newMessage.save();

    console.log(`📥 [Inbox] Атрымана паведамленне з ${source}: ${sender}`);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("❌ [Inbox] Памылка:", error);
    res.status(500).json({ status: "error" });
  }
});

module.exports = router;
