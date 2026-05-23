const mongoose = require("mongoose");

const syncHistorySchema = new mongoose.Schema(
  {
    agencyName: { type: String, required: true },
    sheetName: { type: String, required: true },
    stats: {
      added: { type: Number, default: 0 },
      updated: { type: Number, default: 0 },
      closed: { type: Number, default: 0 },
      ignored: { type: Number, default: 0 },
    },
    // Спіс назваў апрацаваных вакансій для хуткага логу
    details: { type: [String], default: [] },
    status: { type: String, enum: ["success", "error"], default: "success" },
    errorMessage: { type: String },
    // TTL індэкс: запіс аўтаматычна выдаліцца праз 30 дзён (2592000 секунд)
    createdAt: { type: Date, default: Date.now, expires: 2592000 },
  },
  { timestamps: true },
);

// Індэкс для хуткага пошуку гісторыі па агенцыі
syncHistorySchema.index({ agencyName: 1, createdAt: -1 });

module.exports = mongoose.model("SyncHistory", syncHistorySchema);
