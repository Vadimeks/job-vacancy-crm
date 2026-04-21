const mongoose = require("mongoose");

const UnprocessedMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // "OTTO для Партнерів (OTTO)"
  agencyName: { type: String, default: "" }, // "OTTO" — для фільтрацыі і парсера
  text: { type: String, required: true },
  source: { type: String, default: "viber" }, // 'viber' або 'telegram'
  category: {
    type: String,
    enum: ["vacancy", "update", "chat"],
    default: "chat",
  },
  processed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Індэкс для хуткага пошуку непрацэсаваных + дэдуплікацыі
UnprocessedMessageSchema.index({ processed: 1, createdAt: -1 });
UnprocessedMessageSchema.index({ sender: 1, text: 1, createdAt: 1 });

module.exports = mongoose.model("UnprocessedMessage", UnprocessedMessageSchema);
