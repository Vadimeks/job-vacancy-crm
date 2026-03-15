// backend/models/Candidate.js
const mongoose = require("mongoose");

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

    jobPreferences: {
      location: String,
      locationFlexible: Boolean,
      schedule: [String],
      contractType: String,
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
