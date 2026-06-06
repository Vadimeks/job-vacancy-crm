const mongoose = require("mongoose");

const sheetSourceSchema = new mongoose.Schema(
  {
    spreadsheetId: { type: String, required: true },
    sheetName: { type: String, required: true },
    agencyName: { type: String, required: true }, // Каму належыць табліца
    status: { type: String, enum: ["active", "paused"], default: "active" },

    // Мапінг слупкоў (будзе запаўняцца аўтаматычна праз AI пры першым сканаванні)
    columnMap: { type: Map, of: Number },

    lastProcessedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SheetSource", sheetSourceSchema);
