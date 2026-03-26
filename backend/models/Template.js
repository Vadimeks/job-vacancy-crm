const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
  agencyName: { type: String, required: true }, // Назва агенцыі (напрыклад: "APOLO")
  templateName: { type: String, required: true }, // Поўная тэхнічная назва (напрыклад: "NOTINO Głuchów - Склад")

  // 🌟 ПУБЛІЧНАЯ НАЗВА ДЛЯ КАНДЫДАТАЎ (Загаловак у Telegram / на сайце)
  vacancydescription: { type: String, required: true }, // Напрыклад: "Логістичний склад косметики"

  category: { type: String, required: true }, // Катэгорыя для фільтрацыі
  keywords: [String], // Ключавыя словы для пошуку
  contractType: { type: String, required: true }, // "Umowa zlecenie" / "Umowa o pracę"

  // 🔒 УНУТРАНЫ БЛОК ДЛЯ РЭКРУТЭРАЎ (Пакуль паказваем усім, потым фільтруем)
  forRecruiter: {
    internalNotes: { type: String, default: "" }, // Інструкцыі па Viber, забароненых краінах, ПФ і г.д.
    hideAgencyNameForCandidate: { type: Boolean, default: true }, // Ці трэба выразаць APOLO пры публікацыі
    hideEnterpriseNameForCandidate: { type: Boolean, default: true }, // Ці трэба выразаць назву завода пры публікацыі
  },

  // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
  location: { type: String, required: true }, // Чыстая назва горада для радыус-фільтраў
  locationDescription: String, // Тэкст для карткі (напрыклад: "45 км від Варшави")
  voivodeship: { type: String, required: true }, // Ваяводства
  country: { type: String, default: "Польща" },
  checkInCity: String, // Дзе офіс падпісання дакументаў

  // === 3. ФІНАНСЫ ===
  salary: {
    baseNetto: { type: String, required: true }, // Базавая стаўка
    studentNetto: String, // Стаўка для студэнтаў
    hoursRange: String, // Дыяпазон гадзін (напрыклад: "210–270")
    payoutDates: String, // Даты выплаты
    bonusDetails: String, // Прэміі
    salaryNotes: String, // Падаткі і іншыя фінансавыя нюансы
  },

  // === 4. ГРАФІК ===
  schedule: {
    shiftsCount: Number, // Колькасць змен
    hoursPerShift: String, // Колькі гадзін у змене (8, 12)
    workDaysWeek: String, // Працоўныя дні
    breakDuration: String, // Перапынкі
    canChooseShiftOnStart: { type: Boolean, default: false },
    shiftChoiceDetails: String,
    description: String, // Поўны тэкст графіка
  },

  // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
  accommodation: {
    type: { type: String, required: true }, // "Безкоштовне", "Платне", "Частково безкоштовне"
    forCouples: { type: Boolean, default: false },
    withChildren: { type: Boolean, default: false },
    withPets: { type: Boolean, default: false },
    costRaw: String, // Кошт (тэкстам)
    details: String, // Апісанне жытла
  },
  transport: {
    provided: { type: Boolean, default: false },
    costRaw: String,
    details: String,
  },

  // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
  employerCompensations: {
    hasCompensations: { type: Boolean, default: false },
    details: String, // Даплаты за сваё жыллё і г.д.
  },

  // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
  requirements: {
    gender: { type: [String], default: [] }, // Масіў ["Чоловіки", "Жінки", "Пари"]
    ageMax: Number,
    nationalities: [String],
    standardDocs: [String],
    needsAdditionalDocs: { type: Boolean, default: false },
    additionalDocsDetails: String,
    experienceRequired: { type: Boolean, default: false },
    hasEntranceTests: { type: Boolean, default: false },
    entranceTestsDetails: String,
    polishLanguageLevel: { type: String, default: "Не потрібна" }, // Тэг для фільтра
    languageDetails: String, // Тлумачэнне тэкстам пра мову
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
    specificNuances: [String], // Напрыклад: ["Холод", "Шум"]
    specificConditionsDetails: String,
    workwearFree: { type: Boolean, default: true },
    foodType: String, // "Частково-безкоштовно", "За свій рахунок"
    foodDetails: String,
  },

  // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
  startExpenses: {
    hasStartExpenses: { type: Boolean, default: false },
    details: String, // Медагляд, санэпід
  },
  earlyTerminationLiability: {
    hasLiability: { type: Boolean, default: false },
    details: String, // Кошт абутку / адзення пры заўчасным звальненні
  },

  // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
  description: { type: String, required: true }, // Спіс абавязкаў
  additionalNotes: String, // Адрас, каардынаты, музыка на складзе

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Template", templateSchema);
