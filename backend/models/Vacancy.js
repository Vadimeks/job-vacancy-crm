const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema({
  // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
  title: { type: String, required: true }, // Поўная назва: "Brembo Dąbrowa Górnicza"
  vacancydescription: { type: String, required: true }, // Кароткі опіс суці (укр)

  agencyName: { type: String, default: "Manual" },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    default: null,
  },
  category: { type: String, required: true },
  keywords: { type: [String], default: [] },
  contractType: { type: String, required: true }, // "Umowa zlecenie" / "Umowa o pracę"

  // 🔒 УНУТРАНЫ БЛОК ДЛЯ РЭКРУТЭРАЎ
  forRecruiter: {
    internalNotes: { type: String, default: "" },
    hideAgencyNameForCandidate: { type: Boolean, default: true },
    hideEnterpriseNameForCandidate: { type: Boolean, default: true },
  },

  // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
  location: { type: String, required: true }, // Горад ПОЛЬСЬКАЮ
  locationDescription: { type: String, default: "" },
  voivodeship: { type: String, required: true },
  country: { type: String, default: "Polska" }, // Зменена з "Польща"
  checkInCity: { type: String, default: "" },

  // === 3. ФІНАНСЫ ===
  salary: {
    baseNetto: { type: String, required: true },
    studentNetto: { type: String, default: "" },
    hoursRange: { type: String, default: "" },
    payoutDates: { type: String, default: "" },
    bonusDetails: { type: String, default: "" },
    salaryNotes: { type: String, default: "" },
  },

  // === 4. ГРАФІК ===
  schedule: {
    shiftsCount: { type: Number, default: 0 },
    hoursPerShift: { type: String, default: "" },
    workDaysWeek: { type: String, default: "" },
    breakDuration: { type: String, default: "" },
    canChooseShiftOnStart: { type: Boolean, default: false },
    shiftChoiceDetails: { type: String, default: "" },
    description: { type: String, default: "" },
  },

  // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
  accommodation: {
    type: { type: String, required: true }, // "Безкоштовне", "Платне", "Власне"
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

  // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
  employerCompensations: {
    hasCompensations: { type: Boolean, default: false },
    details: { type: String, default: "" },
  },

  // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
  requirements: {
    gender: { type: [String], default: ["Чоловіки", "Жінки"] },
    ageMax: { type: Number, default: 99 },
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
    polishLanguageLevel: { type: String, default: "Не вимагається" }, // Зменена для сінхранізацыі
    languageDetails: { type: String, default: "" },
    physicalLoad: { type: String, default: "" },
  },

  // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ (ДЭЛЕГАЦЫІ А1) ===
  businessTrip: {
    isBusinessTrip: { type: Boolean, default: false },
    requiresPolishExperience: { type: Boolean, default: false },
    requiredDocuments: { type: [String], default: [] },
    tripDetails: { type: String, default: "" },
  },

  // === 9. СПЕЦЫФІЧНЫЯ ЎМОВЫ І ХАРЧАВАННЕ ===
  conditions: {
    hasSpecificConditions: { type: Boolean, default: false },
    specificNuances: { type: [String], default: [] },
    specificConditionsDetails: { type: String, default: "" },
    workwearFree: { type: Boolean, default: false },
    foodType: { type: String, default: "Власне" },
    foodDetails: { type: String, default: "" },
  },

  // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
  startExpenses: {
    hasStartExpenses: { type: Boolean, default: false },
    details: { type: String, default: "" },
  },
  earlyTerminationLiability: {
    hasLiability: { type: Boolean, default: false },
    details: { type: String, default: "" },
  },

  // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
  description: { type: String, required: true },
  additionalNotes: { type: String, default: "" },

  // === 🔴 Спецыфічныя палі толькі для ВАКАНСІЙ ===
  arrivalDate: { type: String, default: "" },
  count: { type: String, default: "" },

  rawText: { type: String, default: "" },
  telegramPost: { type: String, default: "" },

  status: {
    type: String,
    enum: ["active", "closed", "archived"],
    default: "active",
  },

  vacancyCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vacancy", vacancySchema);
