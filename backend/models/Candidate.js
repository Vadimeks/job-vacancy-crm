// backend/models/Candidate.js
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  // --- АСНОЎНАЯ ІНФА ---
  name: { type: String, required: true },

  // Спосаб сувязі
  contactType: {
    type: String,
    enum: ["telegram", "viber", "phone"],
    required: true,
  },
  telegram: String, // @username
  phone: String, // +380XXXXXXXXX

  // Асабістыя дадзеныя
  nationality: String,
  currentLocation: String, // горад дзе зараз
  age: Number,
  gender: { type: String, enum: ["male", "female"] },

  // --- ПАЖАДАННІ ДА ПРАЦЫ ---
  jobPreferences: {
    location: String, // дзе шукае працу
    locationFlexible: Boolean, // гатовы да пераезду
    schedule: [String], // ["1_shift", "2_shifts", "3_shifts"]
    contractType: String, // "zlecenie" / "o_prace" / "any"
    needsAccommodation: Boolean,
    travelGroup: {
      // з кім едзе
      type: String,
      enum: ["alone", "couple", "family"],
    },
    readyDate: String, // калі гатовы прыступіць
    notes: String, // дадатковыя пажаданні
  },

  // --- ДАКУМЕНТЫ ---
  documents: {
    hasVisa: Boolean,
    visaExpiry: Date,
    hasSanepid: Boolean,
    hasUDT: Boolean,
    other: [String],
    files: [String], // спасылкі на файлы (пазней S3/Cloudinary)
  },

  // --- СТАТУС І ГІСТОРЫЯ ---
  status: {
    type: String,
    enum: ["new", "active", "waiting", "employed", "left", "blacklist"],
    default: "new",
  },
  blacklistReason: String,

  // Прывязка да вакансій
  appliedVacancies: [
    {
      vacancyId: { type: mongoose.Schema.Types.ObjectId, ref: "Vacancy" },
      appliedAt: Date,
      type: { type: String, enum: ["want_work", "want_info"] },
    },
  ],

  currentVacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vacancy",
    default: null,
  },

  // --- КАМУНІКАЦЫІ ---
  notes: String, // нататкі рэкрутэра
  history: [
    {
      // гісторыя зносін
      date: { type: Date, default: Date.now },
      type: String, // "call", "chat", "note"
      text: String,
    },
  ],

  // Адкуль прыйшоў
  source: {
    type: String,
    enum: ["site", "telegram_bot", "manual", "referral"],
    default: "manual",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Аўтаматычна абнаўляем updatedAt
candidateSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Candidate", candidateSchema);
