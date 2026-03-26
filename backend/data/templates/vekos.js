// backend/data/templates/vekos.js
const vekosTemplates = [
  // 1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "VEKOS",
    templateName: "HELIO Sochaczew - Упаковка готової продукції",
    vacancydescription: "Упаковка готової продукції (горішки, сухофрукти)",
    category: "📦 Логістика / Склади супермаркетів та продуктів харчування",
    keywords: [
      "HELIO",
      "Sochaczew",
      "Сохачев",
      "упаковка",
      "сухофрукти",
      "горішки",
      "Brochów",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) Кандидати: жінки та чоловіки до 50 років. " +
        "2) Суворі вимоги до жінок: без манікюру, без нарощених вій. " +
        "3) Будь-які прикраси суворо заборонені. " +
        "4) Для студентів обов'язкова наявність довідки студента!",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Sochaczew",
    locationDescription: "біля Варшави (70 км)",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Warszawa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "+2 zł до ставки, якщо кандидат працює на процесі леї (окремий процес, де засипають сировину у машини). Компенсація за своє житло — 300 zł.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "5–6 днів на тиждень",
      breakDuration: "Визначається внутрішнім розпорядком заводу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 зміни по 12 годин: з 06:00 до 18:00, з 18:00 до 06:00. Вихідний за погодженням з координатором.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "600 zł/місяць (вираховується із зарплати)",
      details:
        "Житло з усіма умовами: інтернет, душова, ванна, пралка, кухня з усім необхідним.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Доїзд самостійно.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Компенсація за своє житло — 300 zł.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 50,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Потрібна санітарна книжка (сан книжка).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота в приміщенні за температури 20℃. Жінки без манікюру та нарощених вій, прикраси заборонені.",
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
      hasSpecificConditions: true,
      specificNuances: ["Заборона манікюру та вій", "Прикраси заборонені"],
      specificConditionsDetails:
        "Жінки мають бути без манікюру та без нарощених вій. Надягати прикраси на зміну заборонено.",
      workwearFree: true,
      foodType: "За свій рахунок",
      foodDetails: "На території є їдальня із чайником та холодильником.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "З першої зарплати знімається вартість сан книжки (200 злотих).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Упаковка готової продукції (горішки, сухофрукти, тощо); Збирання картонних упаковок, наклеювання стікерів. Робочий одяг видається безкоштовно (халат, шапочка, взуття).",
    additionalNotes: "Адреса підприємства: Brochów 119, 05-088 Brochów.",
  },
];
module.exports = vekosTemplates;
