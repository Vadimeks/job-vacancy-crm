// backend/data/templates/progres.js
const progresTemplates = [
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "PROGRES",
    templateName: "LPP Pruszcz Gdański - Склад нового одягу",
    vacancydescription: "Pruszcz Gdański — Склад нового одягу. E-Commerce",
    category: "📦 Логістика / Склади одягу та взуття",
    keywords: [
      "LPP",
      "Pruszcz Gdański",
      "Гданськ",
      "одяг",
      "e-commerce",
      "Sinsay",
      "Cropp",
      "House",
      "Reserved",
      "Mohito",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Pruszcz Gdański",
    locationDescription: "Pruszcz Gdański (околиця Гданська)",
    voivodeship: "Поморське",
    country: "Польща",
    checkInCity: "Gdańsk",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.36 zł/год (з PIT-2); 22.36 zł/год (без PIT-2)",
      studentNetto: "31.40 zł/год (для студентів брутто = нетто)",
      hoursRange: "від 200 до 240 годин/місяць",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Премії за перевиконання норм від 100 до 1000 zł брутто (норма залежить від відділу). Після 2 місяців роботи — знижка -25% у магазинах LPP (Sinsay, Cropp, House, Reserved, Mohito).",
      salaryNotes:
        "Ставка 31.40 zł брутто/год. У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "5–6 днів на тиждень",
      breakDuration: "Визначається внутрішнім розпорядком складу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни по 12 годин. Денна: 06:00–18:00, нічна: 18:00–04:00 / 06:00. Працюють 5–6 днів на тиждень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "500 zł/місяць (утримують із зарплати)",
      details:
        "Локації житла: Pruszcz Gdański / Łęgowo / Cieplewo / Pszczółki. Проживання 1–2 км до складу. Кімнати на 2–4 особи, всі зручності. Інтернет і постіль надаються.",
    },
    transport: {
      provided: true,
      costRaw: "130 zł/місяць",
      details: "Автобус від роботодавця — 130 зл/місяць.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Молдова", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails:
        "Знання польської мови не обов'язкове (сканер і прості процеси).",

      physicalLoad:
        "Легка робота, зняття кліпсів/захистів з одягу (товар подається на стіл), комплектація замовлень зі сканером.",
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
      foodType: "За свій рахунок",
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
      "Зняття кліпсів/захистів з одягу (товар подається на стіл); Комплектація замовлень зі сканером (як телефон); Пакування інтернет-замовлень, сканування штрих-коду та передача на наступний процес. Роботодавець видає жилетку, штани та закрите взуття — свої.",
    additionalNotes: "Адреса: Pruszcz Gdański. Оформлення у Гданську.",
  },
];

module.exports = progresTemplates;
