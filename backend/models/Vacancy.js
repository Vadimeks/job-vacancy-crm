const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema({
  // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
  title: { type: String, required: true }, // Напрыклад: "VIRTU Zawiercie - Виробництво готових обідів"

  // 🌟 ПУБЛІЧНАЯ НАЗВА ДЛЯ КАНДЫДАТАЎ (Загаловак у Telegram / на сайце)
  vacancydescription: { type: String, required: true }, // Напрыклад: "Виробництво готових обідів (піца, вареники)"

  agencyName: { type: String, default: "Manual" },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    default: null,
  },
  category: { type: String, required: true }, // Напрыклад: "📦 Логістика / Склади одягу та взуття"
  keywords: [String],
  contractType: { type: String, required: true }, // "Umowa zlecenie" / "Umowa o pracę"

  // 🔒 УНУТРАНЫ БЛОК ДЛЯ РЭКРУТЭРАЎ (Пакуль паказваем усім, потым фільтруем)
  forRecruiter: {
    internalNotes: { type: String, default: "" }, // Інструкції па Viber, забароненых краінах, ПФ і г.д.
    hideAgencyNameForCandidate: { type: Boolean, default: true }, // Ці трэба выразаць APOLO пры публікацыі
    hideEnterpriseNameForCandidate: { type: Boolean, default: true }, // Ці трэба выразаць назву завода пры публікацыі
  },

  // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
  location: { type: String, required: true }, // Чыстая назва для радыус-фільтраў
  locationDescription: String,
  voivodeship: { type: String, required: true },
  country: { type: String, default: "Польща" },
  checkInCity: String,

  // === 3. ФІНАНСЫ ===
  salary: {
    baseNetto: { type: String, required: true },
    studentNetto: String,
    hoursRange: String,
    payoutDates: String,
    bonusDetails: String,
    salaryNotes: String,
  },

  // === 4. ГРАФІК ===
  schedule: {
    shiftsCount: Number,
    hoursPerShift: String,
    workDaysWeek: String,
    breakDuration: String,
    canChooseShiftOnStart: { type: Boolean, default: false },
    shiftChoiceDetails: String,
    description: String,
  },

  // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
  accommodation: {
    type: { type: String, required: true }, // "Безкоштовне", "Платне", "Частково безкоштовне"
    forCouples: { type: Boolean, default: false },
    withChildren: { type: Boolean, default: false },
    withPets: { type: Boolean, default: false },
    costRaw: String,
    details: String,
  },
  transport: {
    provided: { type: Boolean, default: false },
    costRaw: String,
    details: String,
  },

  // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
  employerCompensations: {
    hasCompensations: { type: Boolean, default: false },
    details: String,
  },

  // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
  requirements: {
    gender: { type: [String], default: [] }, // Строга масіў [String]
    ageMax: Number,
    nationalities: [String],
    standardDocs: [String],
    needsAdditionalDocs: { type: Boolean, default: false },
    additionalDocsDetails: String,
    experienceRequired: { type: Boolean, default: false },
    hasEntranceTests: { type: Boolean, default: false },
    entranceTestsDetails: String,
    polishLanguageLevel: { type: String, default: "Не потрібна" },
    languageDetails: String,
    physicalLoad: String,
  },

  // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ (ДЭЛЕГАЦЫІ А1) ===
  businessTrip: {
    isBusinessTrip: { type: Boolean, default: false },
    requiresPolishExperience: { type: Boolean, default: false },
    requiredDocuments: [String],
    tripDetails: String,
  },

  // === 9. СПЕЦЫФІЧНЫЯ ЎМОВЫ І ХАРЧАВАННЕ ===
  conditions: {
    hasSpecificConditions: { type: Boolean, default: false },
    specificNuances: [String],
    specificConditionsDetails: String,
    workwearFree: { type: Boolean, default: true },
    foodType: String,
    foodDetails: String,
  },

  // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
  startExpenses: {
    hasStartExpenses: { type: Boolean, default: false },
    details: String,
  },
  earlyTerminationLiability: {
    hasLiability: { type: Boolean, default: false },
    details: String,
  },

  // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
  description: { type: String, required: true },
  additionalNotes: String, // Дадатковыя нататкі па вакансіі

  // === 🔴 Спецыфічныя палі толькі для ВАКАНСІЙ (не для шаблонаў) ===
  arrivalDate: { type: String, default: "" }, // Спіс дат заездаў
  count: { type: String, default: "" }, // "5 пар", "10 хлопців"

  rawText: String, // Сыры тэкст, з якога парсілі
  telegramPost: String, // Гатовы пост для тг

  status: {
    type: String,
    enum: ["active", "closed", "archived"],
    default: "active",
  },

  vacancyCode: { type: String, unique: true }, // Унікальны код (ID) вакансіі
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vacancy", vacancySchema);
