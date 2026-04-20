const mongoose = require("mongoose");

const UnprocessedMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  source: { type: String, required: true }, // 'viber' або 'telegram'
  createdAt: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false }, // маркер: ці стала паведамленне вакансіяй
});

module.exports = mongoose.model("UnprocessedMessage", UnprocessedMessageSchema);
