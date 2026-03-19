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
    notes: String,
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
    ageMax: Number,
    ageMin: Number,
    nationalities: [String],
    docs: [String],
    physical: String,
    languages: [String],
    languageLevel: String,
  },

  contractType: String,

  conditions: {
    temperature: String,
    workwear: String,
    food: String,
    notes: { type: String, default: "" }, // ДАДАЎ: Для адрасоў і дробных дэталяў
  },

  description: String,
  arrivalDate: { type: String, default: "" }, // Зрабіў String, бо там можа быць спіс дат
  count: { type: String, default: "" }, // Змяніў на String, бо AI піша "5 пар", "10 хлопцаў"

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
