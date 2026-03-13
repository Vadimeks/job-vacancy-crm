// backend/models/Vacancy.js
const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  agencyName: { type: String, default: "Manual" },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    default: null,
  },

  location: { type: String, required: true },
  country: { type: String, default: "Польща" },
  city: String,
  address: String,

  salary: {
    base: String, // 25,36 zł нетто/год
    student: String, // 31,40 zł нетто/год
    monthly: String, // 4 250 – 6 000 zł/міс
    bonus: String, // Премія 200 zł
    notes: String, // дадатковыя заўвагі
  },

  schedule: {
    shifts: String, // "2 зміни по 8-11 годин"
    hours: String, // "220–270 годин на місяць"
    details: String, // дадатковая інфа
  },

  accommodation: {
    available: { type: Boolean, default: true },
    cost: String, // "750 zł/міс"
    details: String, // "для пар — 2-місні кімнати"
    deposit: String, // "200 zł (повертається)"
  },

  transport: {
    provided: { type: Boolean, default: true },
    cost: String, // "безкоштовно" або "150 zł"
    details: String,
  },

  requirements: {
    gender: String,
    age: String,
    nationalities: [String], // ["Україна", "Молдова"]
    docs: [String],
    physical: String,
  },

  conditions: {
    temperature: String, // "+10°C"
    workwear: String, // "спецодяг надається"
    food: String, // "безкоштовний чай, кава"
  },

  contractType: String, // "Umowa zlecenie"
  description: String,
  arrivalDate: String, // "20.03" (адна дата, з паведамлення)
  count: Number, // колькасць людзей

  rawText: String,
  telegramPost: String, // гатовы тэкст які адправілі ў канал

  status: {
    type: String,
    enum: ["active", "closed", "archived"],
    default: "active",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vacancy", vacancySchema);
