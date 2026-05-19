const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  agencyName: { type: String, required: true },
  templateName: { type: String, required: true },
  vacancydescription: { type: String, default: "" },
  brand: { type: String, default: "" },
  category: { type: String, default: "" },
  keywords: { type: [String], default: [] },
  contractType: { type: String, default: "" },

  forRecruiter: {
    internalNotes: { type: String, default: "" },
    hideAgencyNameForCandidate: { type: Boolean, default: true },
    hideEnterpriseNameForCandidate: { type: Boolean, default: true },
  },

  location: { type: String, default: "" },
  locationDescription: { type: String, default: "" },
  voivodeship: { type: String, default: "" },
  country: { type: String, default: "Polska" },
  checkInCity: { type: String, default: "" },

  salary: {
    baseNetto: { type: Number, default: null },
    studentNetto: { type: Number, default: null },
    baseBrutto: { type: Number, default: null },
    currency: { type: String, enum: ["PLN", "EUR"], default: "PLN" },
    rawSalaryDisplay: { type: String, default: "" },
    hoursRange: { type: String, default: "" },
    payoutDates: { type: String, default: "" },
    bonusDetails: { type: String, default: "" },
    salaryNotes: { type: String, default: "" },
  },

  schedule: {
    shiftsCount: { type: Number, default: 0 },
    hoursPerShift: { type: String, default: "" },
    workDaysWeek: { type: String, default: "" },
    breakDuration: { type: String, default: "" },
    canChooseShiftOnStart: { type: Boolean, default: false },
    shiftChoiceDetails: { type: String, default: "" },
    description: { type: String, default: "" },
  },

  accommodation: {
    type: { type: String, default: "" },
    forCouples: { type: Boolean, default: false },
    withChildren: { type: Boolean, default: false },
    withPets: { type: Boolean, default: false },
    costRaw: { type: String, default: "" },
    details: { type: String, default: "" },
  },
  transport: {
    provided: { type: Boolean, default: false },
    costRaw: { type: String, default: "" },
    details: { type: String, default: "" },
  },

  employerCompensations: {
    hasCompensations: { type: Boolean, default: false },
    details: { type: String, default: "" },
  },

  requirements: {
    gender: { type: [String], default: ["Чоловіки", "Жінки", "Пари", "Сім'ї"] },
    genderDescription: { type: String, default: "" },
    age: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 60 },
      rawText: { type: String, default: "" },
    },
    nationalities: { type: [String], default: ["Україна"] },
    standardDocs: {
      type: [String],
      default: ["PESEL UKR", "Віза", "Карта побуту"],
    },
    needsAdditionalDocs: { type: Boolean, default: false },
    additionalDocsDetails: { type: String, default: "" },
    experienceRequired: { type: Boolean, default: false },
    hasEntranceTests: { type: Boolean, default: false },
    entranceTestsDetails: { type: String, default: "" },
    polishLanguageLevel: { type: String, default: "Не вимагається" },
    languageDetails: { type: String, default: "" },
    physicalLoad: { type: Boolean, default: false },
  },

  businessTrip: {
    isBusinessTrip: { type: Boolean, default: false },
    requiresPolishExperience: { type: Boolean, default: false },
    requiredDocuments: { type: [String], default: [] },
    tripDetails: { type: String, default: "" },
  },

  conditions: {
    hasSpecificConditions: { type: Boolean, default: false },
    specificNuances: [
      {
        category: { type: String },
        text: { type: String },
      },
    ],
    specificConditionsDetails: { type: String, default: "" },
    workwearFree: { type: Boolean, default: false },
    foodType: { type: String, default: "Власне" },
    foodDetails: { type: String, default: "" },
  },

  startExpenses: {
    hasStartExpenses: { type: Boolean, default: false },
    details: { type: String, default: "" },
  },
  earlyTerminationLiability: {
    hasLiability: { type: Boolean, default: false },
    details: { type: String, default: "" },
  },

  description: { type: String, default: "" },
  additionalNotes: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

templateSchema.index({ agencyName: 1, templateName: 1 });

module.exports = mongoose.model("Template", templateSchema);
