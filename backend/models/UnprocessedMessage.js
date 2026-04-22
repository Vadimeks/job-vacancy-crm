// backend/models/UnprocessedMessage.js
const mongoose = require("mongoose");

const UnprocessedMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // Напрыклад: "OTTO для Партнерів (OTTO)"
  agencyName: { type: String, default: "" }, // "OTTO" — для фільтрацыі і парсера
  text: { type: String, required: true },
  source: { type: String, default: "viber" }, // 'viber' або 'telegram'
  category: {
    type: String,
    enum: ["vacancy", "update", "info", "chat"], // Дадалі "info"
    default: "chat",
  },
  processed: { type: Boolean, default: false },
  textHash: { type: String, index: true }, // Нармалізаваны тэкст для параўнання
  createdAt: { type: Date, default: Date.now, expires: "48h" }, // Аўтавыдаленне праз 2 сутак
});

// Індэкс для хуткага пошуку непрацэсаваных + дэдуплікацыі
UnprocessedMessageSchema.index({ processed: 1, createdAt: -1 });
UnprocessedMessageSchema.index({ sender: 1, text: 1, createdAt: 1 });

module.exports = mongoose.model("UnprocessedMessage", UnprocessedMessageSchema);
