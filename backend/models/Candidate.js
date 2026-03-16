// backend/models/Candidate.js
const mongoose = require("mongoose");

const SPHERES = [
  "warehouse",
  "food_production",
  "automotive",
  "agriculture",
  "retail",
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
    nationality: String,
    currentLocation: String,
    age: Number,
    gender: { type: String, enum: ["male", "female"] },

    // Мовы
    languages: [String], // ["польська", "нідэрландская"]

    jobPreferences: {
      location: String,
      locationFlexible: Boolean, // гатовы да пераезду куды заўгодна
      locationRadius: Boolean, // гатовы ў радыусе 100км ад свайго горада
      spheres: [{ type: String, enum: SPHERES }], // сферы якія цікавяць
      schedule: [String], // ["1_shift", "2_shifts", "3_shifts"]
      scheduleTypes: [String], // ["day", "night", "rotating"]
      wantsOvertime: Boolean, // гатовы да надгадзін
      contractType: String, // "zlecenie" / "o_prace" / "any"
      needsAccommodation: Boolean,
      travelGroup: {
        type: String,
        enum: ["alone", "couple", "family"],
      },
      readyDate: String,
      notes: String,
    },

    documents: {
      hasVisa: Boolean,
      visaExpiry: Date,
      hasSanepid: Boolean,
      hasUDT: Boolean,
      other: [String],
      files: [String],
    },

    status: {
      type: String,
      enum: ["new", "active", "waiting", "employed", "left", "blacklist"],
      default: "new",
    },
    blacklistReason: String,

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
