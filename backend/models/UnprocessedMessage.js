// backend/models/UnprocessedMessage.js
const mongoose = require("mongoose");

const UnprocessedMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    agencyName: { type: String, default: "" },
    text: { type: String, required: true }, // Арыгінал
    rawText: { type: String, default: "" }, // Тут будзе захоўвацца пераклад пасля Stage 1
    isTruncated: { type: Boolean, default: false },
    source: { type: String, default: "viber" },
    category: {
      type: String,
      enum: ["vacancy", "update", "info", "chat"],
      lowercase: true, // 👈 Аўтаматычна пераводзіць UPDATE -> update для валідацыі
      default: "info",
    },
    processed: { type: Boolean, default: false }, // true толькі калі вакансія створана або гэта сметніца
    aiAnalyzed: { type: Boolean, default: false }, // AI зрабіў Stage 1
    textHash: { type: String, index: true },
    prefixHash: { type: String, index: true, default: "" },
    createdAt: { type: Date, default: Date.now, expires: "72h" }, // Павялічана да 3 дзён
  },
  { timestamps: true },
);

UnprocessedMessageSchema.index({ processed: 1, aiAnalyzed: 1, createdAt: -1 });
UnprocessedMessageSchema.index({ agencyName: 1, prefixHash: 1, createdAt: -1 });

module.exports = mongoose.model("UnprocessedMessage", UnprocessedMessageSchema);
