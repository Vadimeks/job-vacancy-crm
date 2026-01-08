const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  agencyName: { type: String, required: true }, // Назва агенцыі
  templateName: { type: String, required: true }, // Унікальная назва (напр. "Lisner_Fish_Factory")
  keywords: [String], // Ключавыя словы для Агента (напр. ["Lisner", "Ліснер", "Колобжег"])

  // Дадзеныя, якія будуць падцягвацца аўтаматычна
  title: String,
  location: String,
  description: String,
  salaryDetails: String,
  accommodationDetails: String,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Template", templateSchema);
