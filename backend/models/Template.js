// backend/models/Template.js
const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  agencyName: { type: String, required: true },
  templateName: { type: String, required: true },
  keywords: [String], // ["Гольчево", "Голчево", "маринад"]

  // Асноўная інфа
  title: String, // "Гольчево. 80 км від Щецина"
  location: String, // "Гольчево (Golczewo)"
  country: { type: String, default: "Польща" },

  // Аплата
  salary: {
    base: String, // "25,36 zł нетто/год"
    student: String, // "31,40 zł нетто/год (до 26 років)"
    monthly: String, // "4 250 – 6 000 zł нетто/місяць"
    bonus: String,
    notes: String,
  },

  // Графік
  schedule: {
    shifts: String, // "2 зміни по 8-11 годин"
    hours: String, // "220–270 годин на місяць"
    details: String, // дадатковая інфа па зменах
  },

  // Абавязкі
  description: String, // поўны тэкст абавязкаў

  // Жытло
  accommodation: {
    available: { type: Boolean, default: true },
    cost: String, // "750 zł/місяць"
    details: String, // "для пар — 2-місні кімнати"
    deposit: String, // "200 zł (повертається)"
  },

  // Транспарт
  transport: {
    provided: { type: Boolean, default: true },
    cost: String, // "безкоштовно" або "150 zł"
    details: String,
  },

  // Патрабаванні
  requirements: {
    gender: String, // "жінки" / "чоловіки" / "жінки, чоловіки"
    age: String, // "до 58 років"
    nationalities: [String], // ["Україна", "Молдова", "Білорусь"]
    docs: [String], // ["санепід", "UDT", "CV"]
    physical: String,
  },

  // Умовы працы
  conditions: {
    temperature: String, // "+10°C"
    workwear: String, // "спецодяг та взуття надається"
    food: String, // "безкоштовний чай, кава"
    notes: String, // адрас або дрібні деталі місця роботи
  },

  // Тып дагавора
  contractType: String, // "Umowa zlecenie" / "Umowa o pracę"

  // Нататкі для рэкрутэра
  additionalNotes: String, // тэрмінова, тэлефоны, забароны, асаблівасці

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Template", templateSchema);
