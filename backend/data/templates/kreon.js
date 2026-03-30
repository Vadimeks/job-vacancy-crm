// backend/data/templates/kreon.js
const kreonTemplates = [
  // Вакансія №1 - STADLER Siedlce
  {
    agencyName: "KREON",
    templateName: "STADLER Siedlce - Виробництво вагонів та потягів",
    vacancydescription:
      "Робота на сучасному заводі Stadler з виробництва вагонів метро, трамваїв та поїздів: монтажні роботи (механічний, електронний), клеяж, підготовка поверхонь.",
    category: "⚙️ Виробництво і промисловість / Машинобудування",
    keywords: [
      "STADLER",
      "Siedlce",
      "вагони",
      "потяги",
      "трамваї",
      "монтаж",
      "електромонтаж",
      "клеяж",
      "лакування",
      "виробництво",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Siedlce",
    locationDescription: "",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Warszawa",
    salary: {
      baseNetto: "28-35 PLN/год нетто",
      studentNetto: "33-40 PLN/год нетто",
      hoursRange: "",
      payoutDates: "20–25 числа",
      bonusDetails: "SEP не обов’язковий, але підвищує ставку.",
      salaryNotes:
        "Монтер: 28 PLN/год (мінімальний досвід) | студент: 33 PLN/год. Електромонтер: 31 PLN/год | студент: 35 PLN/год. Клеяж: 29 PLN/год | студент: 34 PLN/год. Електрик (досвід + сертифікати): 35 PLN/год | студент: 40 PLN/год.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-10",
      workDaysWeek: "5-6",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни: 05:45–14:00, 14:00–22:15. Можливі подовжені зміни 8–10 год. Пн–Пт, суботи за бажанням. Ночей немає, неділя вихідний.",
    },
    accommodation: {
      type: "Надається",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "600 PLN/місяць",
      details: "600 PLN/місяць. Поруч із роботою.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд самостійно.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 99,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "A2-B1",
      languageDetails: "Польська на рівні A2–B1 (комунікація).",
      physicalLoad:
        "Легка/Середня (переважно не важка, інколи перенос 10–20 кг (рідко))",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Пил/запах фарби"],
      specificConditionsDetails:
        "На ділянці Lakiernia / підготовка поверхонь є пил/запах фарби.",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details: "Медогляд 200 PLN (повернення після 3 місяців роботи).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Montaż mechaniczny — монтаж, скручування, встановлення підлог/панелей/дверей/сидінь, робота з шуруповертом і ключами. Montaż elektroniki — електромонтажні роботи (можна з SEP або без). Wyklejanie (клеяж) — наклеювання/обклеювання елементів. Lakiernia / підготовка поверхонь (частина місць) — шліфування, чистка, підготовка до фарбування. Кандидат подається на конкретне місце. Можлива періодична ротація між залами за потребою, але не щодня.",
    additionalNotes:
      "Stadler — сучасний великий завод повного циклу: від каркасу до готового вагона. Рекрутація тільки через CV (досвід + польська для розуміння завдань). Якщо CV затверджено — місце 100% гарантоване, співбесіди на заводі немає. Аванс після 1-го тижня. Старт + BHP: 2 або 9 лютого.",
  },
];
module.exports = kreonTemplates;
