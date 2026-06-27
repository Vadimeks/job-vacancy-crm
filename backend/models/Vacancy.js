const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema(
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    templateName: { type: String, default: "" },
    vacancydescription: { type: String, default: "" }, // Кароткі опіс суці (укр)
    brand: { type: String, default: "" }, // Назва прадпрыемства/завода (напр. LG, Amazon)
    agencyName: { type: String, default: "Manual" },
    sheetName: { type: String, default: "" }, // 👈 ДАДАДЗЕНА: Назва ліста ў Google Sheets (напр. "Польша", "Opiekunki")
    sourceType: {
      type: String,
      enum: [
        "spreadsheet",
        "viber",
        "telegram",
        "site",
        "trello",
        "airtable",
        "manual",
      ],
      default: "manual",
      index: true,
    }, // 👈 ДАДАДЗЕНА: Тып крыніцы паходжання вакансіі
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },
    relatedTemplates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
      },
    ],
    category: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    contractType: { type: String, default: "" }, // "Umowa zlecenie" / "Umowa o pracę"

    // 🔒 УНУТРАНЫ БЛОК ДЛЯ РЭКРУТЭРАЎ
    forRecruiter: {
      internalNotes: { type: String, default: "" },
      hideAgencyNameForCandidate: { type: Boolean, default: true },
      hideEnterpriseNameForCandidate: { type: Boolean, default: true },
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: { type: String, default: "" }, // Горад ПОЛЬСЬКАЮ
    locationCoords: {
  lat: { type: Number, default: null },
  lng: { type: Number, default: null }
},
    locationDescription: { type: String, default: "" },
    voivodeship: { type: String, default: "" },
    country: { type: String, default: "Polska" },
    checkInCity: { type: String, default: "" },

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: { type: Number, default: null }, // Мінімальная лічба для фільтра
      studentNetto: { type: Number, default: null },
      baseBrutto: { type: Number, default: null },
      currency: { type: String, default: "PLN" }, // Выдалены enum, каб дазволіць любую валюту (напр. CZK)
      rawSalaryDisplay: { type: String, default: "" }, // Тут будзе "25-30 зл/год" або "5000-7000 зл/мес"
      hoursRange: { type: String, default: "" },
      payoutDates: { type: String, default: "" },
      bonusDetails: { type: String, default: "" },
      salaryNotes: { type: String, default: "" },
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: { type: String, default: "" },
      hoursPerShift: { type: String, default: "" },
      workDaysWeek: { type: String, default: "" },
      breakDuration: { type: String, default: "" },
      canChooseShiftOnStart: { type: Boolean, default: false },
      shiftChoiceDetails: { type: String, default: "" },
      description: { type: String, default: "" },
       onlyDayShifts: { type: Boolean, default: false },
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: { type: String, default: "" }, // "Безкоштовне", "Платне", "Власне"
       isFree: { type: Boolean, default: false }, // 👈 ДАДАЦЬ ГЭТА
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
      gender: {
        type: [String],
        default: ["Чоловіки", "Жінки", "Пари", "Сім'ї"],
      },
      genderDescription: { type: String, default: "" },
      age: {
        min: { type: Number, default: null },
        max: { type: Number, default: null },
        rawText: { type: String, default: "" }, // Тут будзе "18-55 років"
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
      specificNuances: [
        {
          category: { type: String }, // Напр. "TEMPERATURE"
          text: { type: String }, // Напр. "+5°C"
        },
      ],
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
    description: { type: String, default: "" },
    additionalNotes: { type: String, default: "" },

    // === 🔴 Спецыфічныя палі толькі для ВАКАНСІЙ ===
    arrivalDate: { type: String, default: "" },
    count: { type: String, default: "" },

    originalText: { type: String, default: "" }, // Арыгінал з MacroDroid (любая мова)
    rawText: { type: String, default: "" }, // Пераклад (украінская), з якім працуе парсер
    isTruncated: { type: Boolean, default: false }, // Ці было зыходнае паведамленне абрэзаным
    telegramFull: { type: String, default: "" }, // Поўная версія паста для ТГ
    telegramShort: { type: String, default: "" }, // Кароткая версія паста для ТГ
    isPublished: { type: Boolean, default: false, index: true }, // Ці апублікавана ў канале
    postOutdated: { type: Boolean, default: false }, // Ці патрабуе пост перагенерацыі пасля абнаўлення
    postGeneratedAt: { type: Date }, // Дата апошняй паспяховай генерацыі паста праз AI
    parsingResultType: { type: String, default: "FULL_VACANCY" }, // 🆕 Вердыкт AI (FULL_VACANCY, UPDATE, TRUNCATED, INFO)
    status: {
      type: String,
      enum: ["active", "closed", "archived", "pending_ai"], // 👈 Дададзены статус чаргі
      default: "active",
    },
    closingReason: { type: String, default: "" }, // Прычына закрыцця (напр. "Знікла з Airtable" або "STOP")
    isFavorite: { type: Boolean, default: false, index: true },
    vacancyCode: { type: String, unique: true, sparse: true },
    // --- ДАДАДЗЕНА ДЛЯ ГЛАБАЛЬНАЙ АБАРОНЫ АД ДУБЛІКАТАЎ ---
    // Хэш зыходнага радка з табліцы. Дазваляе ігнараваць дублікаты вечна.
    sourceHash: { type: String, index: true },
    isLowQuality: { type: Boolean, default: false }, // 👈 Пазнака, што JSON быў біты або адрамантаваны
     airtableId: { type: String, default: null, index: true }, // 👈 ДАДАЦЬ ГЭТА (ID запісу ў Airtable)
    // -----------------------------------------------------
  },
  { timestamps: true },
); // 👈 Дададзена аўтаматычнае кіраванне палямі createdAt і updatedAt
// Індэксы для паскарэння сінхранізацыі і пошуку
vacancySchema.index({ sourceHash: 1, status: 1 });
vacancySchema.index({ agencyName: 1, sheetName: 1, status: 1 }); // 👈 Аптымізацыя для ізаляванага закрыцця

module.exports = mongoose.model("Vacancy", vacancySchema);
