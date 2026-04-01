const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
  agencyName: { type: String, required: true }, // Назва агенцыі (напр. "MANPOWER")
  templateName: { type: String, required: true }, // Назва завода + горад ПОЛЬСЬКАЮ (напр. "Hutchinson Dębica")

  // Публічная назва для кандыдатаў
  vacancydescription: { type: String, default: "" }, // Кароткі опіс суці работы (укр)

  category: { type: String, default: "" }, // Напр: "⚙️ Виробництво і промисловість / Логістика, склади та пакування"
  keywords: { type: [String], default: [] },
  contractType: { type: String, default: "" }, // "Umowa zlecenie" / "Umowa o pracę"

  // 🔒 УНУТРАНЫ БЛОК ДЛЯ РЭКРУТЭРАЎ
  forRecruiter: {
    internalNotes: { type: String, default: "" },
    hideAgencyNameForCandidate: { type: Boolean, default: true },
    hideEnterpriseNameForCandidate: { type: Boolean, default: true },
  },

  // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
  location: { type: String, default: "" }, // Горад працы ПОЛЬСЬКАЮ (напр. "Warszawa")
  locationDescription: { type: String, default: "" }, // Дакладная адраса або апісанне лакацыі
  voivodeship: { type: String, default: "" }, // Ваяводства ПОЛЬСЬКАЮ
  country: { type: String, default: "Polska" }, // Заўсёды "Polska"
  checkInCity: { type: String, default: "" }, // Місто оформлення документів ПОЛЬСЬКАЮ

  // === 3. ФІНАНСЫ ===
  salary: {
    baseNetto: { type: String, default: "" },
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
    type: { type: String, default: "" }, // "Безкоштовне", "Платне", "Власне"
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
    polishLanguageLevel: { type: String, default: "Не вимагається" },
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
    foodType: { type: String, default: "Власне" }, // "Власне", "Обіди", "Субсидоване"
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
  description: { type: String, default: "" },
  additionalNotes: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

// Унікальны індэкс: пара agencyName + templateName (БЕЗ unique: true, каб заліць усё)
templateSchema.index({ agencyName: 1, templateName: 1 });

module.exports = mongoose.model("Template", templateSchema);
