const nidenTemplates = [
  // === 1. Пусты шаблон-заглушка ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "NIDEN",
    templateName: "NIDEN-empty",
    vacancydescription: "Назва вакансії (Публічна назва для кандидатів)",
    category: "", // Напрыклад: "⚙️ Виробництво і прамысловасть / ..."
    keywords: ["NIDEN", "Польща"],
    contractType: "Umowa zlecenie", // Або "Umowa o pracę"

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "",
    locationDescription: "",
    voivodeship: "",
    country: "Польща",
    checkInCity: "",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "",
      payoutDates: "",
      bonusDetails: "",
      salaryNotes: "",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 0,
      hoursPerShift: "",
      workDaysWeek: "",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне", // Або "Безкоштовне" / "Частково безкоштовне"
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: [], // Напрыклад: ["Чоловіки", "Жінки", "Пари"]
      ageMax: 0,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не потрібна", // Або "A1", "A2" і г.д.
      languageDetails: "",
      physicalLoad: "",
    },

    // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ (ДЭЛЕГАЦЫІ А1) ===
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },

    // === 9. СПЕЦЫФІЧНЫЯ ЎМОВЫ І ХАРЧАВАННЕ ===
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [], // Напрыклад: ["Холод", "Шум"]
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "За свій рахунок", // Або "Безкоштовно"
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description: "",
    additionalNotes: "",
  },
];

module.exports = nidenTemplates;
