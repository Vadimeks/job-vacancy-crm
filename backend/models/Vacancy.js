// backend/models/Vacancy.js
const mongoose = require("mongoose");

const SPHERES = [
  "warehouse",
  "food_production",
  "automotive",
  "agriculture",
  "retail",
  "other",
];

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

  // Сфера вытворчасці
  sphere: { type: String, enum: SPHERES },

  salary: {
    base: String,
    student: String,
    monthly: String,
    bonus: String,
    notes: String, // Гэта ёсць, супер
  },

  schedule: {
    shifts: String,
    hours: String,
    details: String,
    types: [String], // ["day", "night", "rotating"]
  },

  overtimeAvailable: { type: Boolean, default: false },

  accommodation: {
    available: { type: Boolean, default: true },
    cost: String,
    details: String,
    deposit: String,
  },

  transport: {
    provided: { type: Boolean, default: true },
    cost: String,
    details: String,
  },

  requirements: {
    gender: String,
    age: String,
    ageMax: Number, // 58 — для матчынгу
    ageMin: Number, // 18 — мінімальны ўзрост
    nationalities: [String],
    docs: [String], // ["санепід", "UDT"]
    physical: String,
    languages: [String], // ["польська", "нідэрландская"]
    languageLevel: String, // "камунікатыўны" / "базавы" / "не патрабуецца"
  },

  contractType: String, // "zlecenie" / "o_prace" / "any"

  conditions: {
    temperature: String,
    workwear: String,
    food: String,
    notes: String, // ДАДАЦЬ ГЭТА (для адрасоў і дробных дэталяў)
  },

  description: String,
  arrivalDate: String,
  count: Number,

  rawText: String,
  telegramPost: String,
  additionalNotes: { type: String, default: "" },

  status: {
    type: String,
    enum: ["active", "closed", "archived"],
    default: "active",
  },

  vacancyCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vacancy", vacancySchema);
