const mongoose = require("mongoose");

const airtableSourceSchema = new mongoose.Schema(
  {
    // Унікальны ID базы (пачынаецца на app...)
    baseId: { type: String, required: true },
    
    // ID табліцы (пачынаецца на tbl...)
    tableId: { type: String, required: true },

    // Назва для ўнутранага карыстання (напр. "SK_Manpower")
    boardName: { type: String, required: true },

    // Назва агенцыі (MANPOWER, GRUPA PROGRES, JOB IMPULSE)
    agencyName: { type: String, required: true },

    // Спіс назваў калонак (картак), якія трэба сканаваць
    // Калі пуста — скануем усё
    includedColumns: [{ type: String }],

    // Спецыфічныя правілы (напр. { checkField: "Актуальность", checkValue: "ДА" })
    syncRules: {
      checkField: { type: String, default: null },
      checkValue: { type: String, default: null }
    },

    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },

    lastProcessedAt: { type: Date },
  },
  { timestamps: true }
);

// Індэкс для хуткага пошуку
airtableSourceSchema.index({ agencyName: 1, status: 1 });

module.exports = mongoose.model("AirtableSource", airtableSourceSchema);