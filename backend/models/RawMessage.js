const mongoose = require("mongoose");

const rawMessageSchema = new mongoose.Schema({
  // Змест паведамлення
  text: {
    type: String,
    required: true,
  },

  // Крыніца (Telegram чат, Viber і г.д.)
  source: {
    type: String,
    default: "Telegram",
  },

  // Дадатковая інфа (напр. імя карыстальніка ці назва чата)
  senderInfo: {
    type: String,
    default: "",
  },

  // Статус паведамлення ў пясочніцы
  status: {
    type: String,
    enum: ["new", "processed", "ignored"],
    default: "new",
  },

  // Дата атрымання
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Індэкс для аўтаматычнага выдалення ігнараваных паведамленняў праз 30 дзён (апцыянальна)
rawMessageSchema.index({ createdAt: 1 });

module.exports = mongoose.model("RawMessage", rawMessageSchema);
