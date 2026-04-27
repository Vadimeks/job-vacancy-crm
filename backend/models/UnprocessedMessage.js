// backend/models/UnprocessedMessage.js
const mongoose = require("mongoose");

const UnprocessedMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  agencyName: { type: String, default: "" },
  text: { type: String, required: true }, // Арыгінал (любая мова)
  rawText: { type: String, default: "" }, // Пераклад ад Gemini (украінская)
  isTruncated: { type: Boolean, default: false }, // Ці абрэзана паведамленне
  source: { type: String, default: "viber" },
  category: {
    type: String,
    enum: ["vacancy", "update", "info", "chat"],
    default: "chat",
  },
  processed: { type: Boolean, default: false },
  textHash: { type: String, index: true },
  createdAt: { type: Date, default: Date.now, expires: "48h" },
});

UnprocessedMessageSchema.index({ processed: 1, createdAt: -1 });
UnprocessedMessageSchema.index({ sender: 1, text: 1, createdAt: 1 });

module.exports = mongoose.model("UnprocessedMessage", UnprocessedMessageSchema);
