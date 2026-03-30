// backend/data/templates/progres.js
const progresTemplates = [
  // Вакансія №1 - LPP Pruszcz Gdański
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "PROGRES",
    templateName: "LPP Pruszcz Gdański",
    vacancydescription:
      "Склад нового одягу: зняття кліпсів, комплектація та пакування інтернет-замовлень.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "LPP",
      "Pruszcz Gdański",
      "Гданськ",
      "Склад",
      "Одяг",
      "Пакування",
      "Комплектація",
    ],
    contractType: "Umowa zlecenie",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Pruszcz Gdański",
    locationDescription: "Околиця Гданська",
    voivodeship: "Pomorskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "31,40 zł брутто/год",
      studentNetto: "31,40 zł нетто/год",
      hoursRange: "",
      payoutDates: "",
      bonusDetails:
        "Премії за перевиконання норм: 100–1000 zł брутто (норма залежить від відділу)",
      salaryNotes:
        "25,36 zł нетто/год — з PIT-2; 22,36 zł нетто/год — без PIT-2",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "5–6 днів на тиждень",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "Денна зміна: 06:00–18:00; Нічна зміна: 18:00–04:00 / 06:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "500 zł/міс",
      details:
        "Локації: Pruszcz Gdański / Łęgowo / Cieplewo / Pszczółki. 1–2 км до складу. Кімнати 2–4 особи, всі зручності, інтернет + постіль надаються. Вартість утримують із зарплати.",
    },
    transport: {
      provided: true,
      costRaw: "130 zł/міс",
      details: "Автобус від роботодавця",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 99,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "Сканер + прості процеси",
      physicalLoad: "Легка робота",
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
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
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
    description:
      "Робота на складі нового одягу. Обов'язки включають зняття кліпсів/захистів з одягу (легка робота, товар подається на стіл), комплектацію замовлень зі сканером (схожим на телефон), пакування інтернет-замовлень, сканування штрих-коду та передачу на наступний процес.",
    additionalNotes:
      "Бонус: після 2 місяців роботи — знижка -25% у магазинах Sinsay, Cropp, House, Reserved, Mohito. Робочий одяг: видають жилетку, взуття закрите та штани — свої.",
  },
];

module.exports = progresTemplates;
