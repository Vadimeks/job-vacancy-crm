// backend/models/TrelloSource.js
const mongoose = require("mongoose");

const trelloSourceSchema = new mongoose.Schema(
  {
    // Унікальны ID дошкі Trello (бярэцца з URL або API)
    boardId: { type: String, required: true, unique: true },

    // Назва для ўнутранага карыстання (напр. "Personnel Service 2026")
    boardName: { type: String, required: true },

    // Назва агенцыі (NIDEN, KREON, PERSONNEL SERVICE)
    agencyName: { type: String, required: true },

    // Ключы доступу (індывідуальныя для кожнай крыніцы або агульныя)
    apiKey: { type: String, required: true },
    token: { type: String, required: true },

    // Статус сінхранізацыі
    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },

    // Дата апошняй паспяховай сінхранізацыі
    lastProcessedAt: { type: Date },
  },
  { timestamps: true },
);

// Індэкс для хуткага пошуку па агенцыі
trelloSourceSchema.index({ agencyName: 1, status: 1 });

module.exports = mongoose.model("TrelloSource", trelloSourceSchema);
