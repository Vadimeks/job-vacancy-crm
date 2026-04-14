const express = require("express");
const router = express.Router();
const RawMessage = require("../models/RawMessage");

// Атрымаць усе новыя паведамленні
router.get("/", async (req, res) => {
  try {
    const messages = await RawMessage.find({ status: "new" }).sort({
      createdAt: -1,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Змяніць статус (напрыклад, на processed або ignored)
router.patch("/:id", async (req, res) => {
  try {
    const updated = await RawMessage.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Выдаліць паведамленне
router.delete("/:id", async (req, res) => {
  try {
    await RawMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Паведамленне выдалена" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
