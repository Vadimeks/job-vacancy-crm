// backend/data/templates/vekos.js
const vekosTemplates = [
  // Вакансія №1 - Пакування готової продукції HELIO
  {
    // === 1. СИСТЕМНІ ПОЛЯ (Групування та пошук) ===
    agencyName: "VEKOS",
    templateName: "HELIO Sochaczew",
    vacancydescription:
      "Пакування готової продукції (горішки, сухофрукти) на виробництві.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "HELIO",
      "Sochaczew",
      "Брохув",
      "Пакування",
      "Горішки",
      "Сухофрукти",
    ],
    contractType: "Umowa zlecenie",
    // === ВНУТРІШНЯ ІНФОРМАЦІЯ (ТІЛЬКИ ДЛЯ РЕКРУТЕРА) ===
    forRecruiter: {
      internalNotes:
        "Вихідний за погодженням з координатором. Попереджати жінок про заборону манікюру, нарощених вій та прикрас.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛОКАЦІЇ ТА ГЕОГРАФІЯ ===
    location: "Sochaczew",
    locationDescription: "Brochów 119, 05-088 Brochów (70 км від Warszawa)",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Warszawa",
    // === 3. ФІНАНСИ ===
    salary: {
      baseNetto: "24.63 zł/год нетто",
      studentNetto: "30.50 zł/год нетто",
      hoursRange: "240 - 288", // 12 годин * 5-6 днів * 4 тижні
      payoutDates: "",
      bonusDetails:
        "+ 2 злотих до ставки, якщо кандидат працює на процесі леї (засипання сировини у машини). Компенсація за своє житло – 300 зл.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration: "", // Не вказано
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 зміни: з 06:00 до 18:00 та з 18:00 до 06:00. Вихідний за погодженням з координатором.",
    },
    // === 5. ПРОЖИВАННЯ ТА ТРАНСПОРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "600 zł/міс",
      details:
        "Житло з усіма умовами: інтернет, душова, ванна, пральна машина, кухня з усім необхідним. Вартість вираховується із зарплати.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    // === 6. КОМПЕНСАЦІЇ ВІД ПРАЦЕДАВЦЯ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    // === 7. ВИМОГИ ТА КАНДИДАТИ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 50,
      nationalities: ["Україна"], // За замовчуванням, якщо не вказано інше
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"], // За замовчуванням
      needsAdditionalDocs: true,
      additionalDocsDetails: "Sanepid (санітарна книжка)",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Робота стоячи", // Припускається для пакування
    },
    // === 8. ВІДРЯДЖЕННЯ В ЄВРОПУ (ДЕЛЕГАЦІЇ А1) ===
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    // === 9. СПЕЦИФІЧНІ УМОВИ ТА ХАРЧУВАННЯ ===
    conditions: {
      hasSpecificConditions: true,
      specificNuances: [
        "Заборона біжутерії",
        "Заборона манікюру",
        "Заборона нарощених вій",
      ],
      specificConditionsDetails:
        "Робота в приміщенні за температури 20℃. Жінкам заборонено мати манікюр, нарощені вії та прикраси.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "На території є їдальня із чайником та холодильником.",
    },
    // === 10. ВИТРАТИ НА СТАРТІ ТА ВІДПОВІДАЛЬНІСТЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "200 злотих за санітарну книжку вираховується з першої зарплати.",
    },
    earlyTerminationLiability: {
      hasLiability: false, // Не вказано
      details: "",
    },
    // === 11. ОПИС ПРОЦЕСІВ ТА НОТАТКИ ===
    description:
      "Обов'язки включають пакування готової продукції (горішки, сухофрукти тощо), збирання картонних упаковок та наклеювання стікерів.",
    additionalNotes:
      "Можливість отримати додаткові 2 злотих до ставки за роботу на процесі леї (засипання сировини у машини). Компенсація за власне житло – 300 злотих.",
  },
];
module.exports = vekosTemplates;
