// backend/data/templates/kreon.js
const kreonTemplates = [
  // 1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "KREON",
    templateName: "STADLER Siedlce - Виробництво вагонів та потягів",
    vacancydescription:
      "Виробництво вагонів метро, трамваїв та поїздів (монтаж без зварювання)", // 👍 Публічны загаловак для кандыдатаў
    category:
      "⚙️ Виробництво і прамысловасть / Машинобудування та важка промисловість",
    keywords: [
      "Stadler",
      "Siedlce",
      "Седльце",
      "монтаж",
      "вагони",
      "поїзди",
      "монтер",
      "електрик",
      "клеяж",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "⚠️ ВІДБІР ТІЛЬКИ ПО CV! Завод затверджує або відмовляє. Якщо затверджено — місце 100% гарантоване, співбесіди немає. " +
        "Обов'язково вказувати досвід та рівень польської мови. Старт + BHP: 2 або 9 лютого.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Siedlce",
    locationDescription: "Siedlce (оформлення у Warszawa)", // 👍 Удакладнілі месца афармлення па табліцы
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Warszawa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "28–35 zł/год", // 👍 Залежыць ад працэсу (ніжэй дэталі)
      studentNetto: "33–40 zł/год",
      hoursRange: "210–250", // Зыходзячы з 8-10 гадзін і субот
      payoutDates: "20–25 числа за попередній місяць.",
      bonusDetails: "Аванс можливий після 1-го тижня роботи.",
      salaryNotes:
        "Ставки нетто по процесах:\n" +
        "- Монтер (мін. досвід): 28 zł/год (студент 33 zł/год)\n" +
        "- Електромонтер: 31 zł/год (студент 35 zł/год)\n" +
        "- Клеяж: 29 zł/год (студент 34 zł/год)\n" +
        "- Електрик (досвід + сертифікати/SEP): 35 zł/год (студент 40 zł/год). SEP не обов'язковий, але підвищує ставку.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-10",
      workDaysWeek: "Пн–Пт (суботи за бажанням)",
      breakDuration: "Визначається внутрішнім розпорядком заводу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 зміни: I зміна 05:45–14:00, II зміна 14:00–22:15. Можливі подовжені зміни по 8–10 годин. Ночей немає. Неділя — вихідний.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true, // 👍 Калі едуць разам
      withChildren: false,
      withPets: false,
      costRaw: "600 zł/місяць (вираховується із зарплати)",
      details:
        "Будинки або квартири поруч із роботою (піша доступність). Кімнати на 3-4 особи.",
    },
    transport: {
      provided: false,
      costRaw: "Пішки",
      details: "Житло знаходиться поруч із заводом, доїзд не потрібен.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"], // 👍 Жінки і чоловіки
      ageMax: 55,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true, // Потрібне резюме (CV)
      additionalDocsDetails:
        "Обов'язково резюме (CV) з описом досвіду роботи. Сертифікати SEP вітаються для електриків.",
      experienceRequired: true, // 👍 Патрабуецца досвед
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "А2",
      languageDetails:
        "Польська мова на рівні А2–B1 (для комунікації та розуміння завдань).",

      physicalLoad:
        "Робота переважно не важка (дрібні елементи), робота з електроінструментом. Інколи перенос 10–20 кг (рідко). Вміння читати креслення (бажано/обов'язково для електрики).",
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
      specificNuances: ["Запах фарби", "Пил"],
      specificConditionsDetails:
        "На лакувальні/підготовці поверхонь є пил та запах фарби. Stadler — сучасний великий завод повного циклу (без зварювання). Кандидат подається на конкретне місце. Можлива періодична ротація між залами за потребою, але не щодня.",
      workwearFree: true,
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медогляд: 200 zł (вираховується із зарплати, але ПОВЕРТАЄТЬСЯ після 3 місяців роботи).", // 👍 Утачнілі паводле арыгінала
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Montaż mechaniczny — монтаж, скручування, встановлення підлог/панелей/дверей/сидінь, робота з шуруповертом і ключами; Montaż elektroniki — електромонтажні роботи; Wyklejanie (клеяж) — наклеювання/обклеювання елементів; Lakiernia/підготовка поверхонь — шліфування, чистка, підготовка до фарбування.",
    additionalNotes: "Адреса заводу: Siedlce. Місце оформлення: Warszawa.",
  },
];
module.exports = kreonTemplates;
