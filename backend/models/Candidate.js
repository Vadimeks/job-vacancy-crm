const mongoose = require("mongoose");

// Сінхранізуем сферы з катэгорыямі з шаблона вакансіі
const SPHERES = [
  "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
  "🏗️ Будівництво та ремонт",
  "🍏 Сільське господарство",
  "🚕 Транспорт і логістика",
  "🏨 Готельно-ресторанний бізнес",
  "other",
];

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactType: {
      type: String,
      enum: ["telegram", "viber", "phone"],
      required: true,
    },
    telegram: String,
    phone: String,
    nationality: { type: String, default: "Україна" },
    currentLocation: String, // Горад, дзе зараз знаходзіцца
    age: Number,
    // Пашыраем гендэр для адпаведнасці шаблону (для пар)
    gender: { type: String, enum: ["male", "female", "couple"] },

    // Мовы з узроўнямі для дакладнага матчынгу з вакансіяй
    languages: [
      {
        name: { type: String, default: "Польська" },
        level: { type: String, default: "Не вимагається" }, // "Не вимагається", "A2", "B1" і г.д.
      },
    ],

    jobPreferences: {
      location: String,
      locationFlexible: { type: Boolean, default: false },
      locationRadius: { type: Boolean, default: false },
      spheres: [{ type: String }], // Будзе захоўваць назвы катэгорый з вакансій
      schedule: [String],
      scheduleTypes: [String],
      wantsOvertime: { type: Boolean, default: true },
      contractType: { type: String, default: "any" }, // "Umowa zlecenie", "Umowa o pracę", "any"
      needsAccommodation: { type: Boolean, default: true },
      travelGroup: {
        type: String,
        enum: ["alone", "couple", "family"],
        default: "alone",
      },
      readyDate: String,
      notes: String,
    },

    documents: {
      // Сінхранізуем са standardDocs з шаблона
      hasPeselUkr: { type: Boolean, default: false },
      hasVisa: { type: Boolean, default: false },
      hasKartaPobytu: { type: Boolean, default: false },
      visaExpiry: Date,
      hasSanepid: { type: Boolean, default: false }, // Адпавядае additionalDocsDetails
      hasUDT: { type: Boolean, default: false }, // Адпавядае additionalDocsDetails
      other: [String],
      files: [String], // Спасылкі на фота дакументаў/CV
    },

    status: {
      type: String,
      enum: ["new", "active", "waiting", "employed", "left", "blacklist"],
      default: "new",
    },
    blacklistReason: String,

    // Гісторыя водгукаў
    appliedVacancies: [
      {
        vacancyId: { type: mongoose.Schema.Types.ObjectId, ref: "Vacancy" },
        appliedAt: { type: Date, default: Date.now },
        type: { type: String, enum: ["want_work", "want_info"] },
      },
    ],

    currentVacancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vacancy",
      default: null,
    },

    notes: String,
    history: [
      {
        date: { type: Date, default: Date.now },
        type: String,
        text: String,
      },
    ],

    source: {
      type: String,
      enum: ["site", "telegram_bot", "manual", "referral"],
      default: "manual",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Candidate", candidateSchema);
