// backend/data/templates/mrowki.js
const mrowkiTemplates = [
  // Вакансія №1 - AMI Mikstat
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MRÓWKI",
    templateName: "AMI Mikstat",
    vacancydescription:
      "Робота на м'ясному заводі з переробки птиці, що включає забій, обробку та миття.",
    category: "⚙️ Виробництво і промисловість / Харчова промисловість",
    keywords: [
      "AMI",
      "Mikstat",
      "м'ясокомбінат",
      "птиця",
      "забій",
      "обробка",
      "мийка",
      "курятина",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Mikstat",
    locationDescription: "63-510 Mikstat",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24 zł/год нетто",
      studentNetto: "30.50 zł/год",
      hoursRange: "",
      payoutDates: "",
      bonusDetails: "",
      salaryNotes: "",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "10-12",
      workDaysWeek: "Нд-Пт",
      breakDuration: "30 хв + 15 хв (оплачувані)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Нічна/ранкова робота. Зміни: 22:00–08:00, 04:00–16:00, друга денна зміна з 05:00-06:00 до 15:00-16:00.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "500 zł/місяць",
      details: "Житло з умовами.",
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
      gender: ["Жінки"],
      ageMax: 55,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Базовий",
      languageDetails: "Бажано хоча б розуміння польської мови.",
      physicalLoad: "Робота в умовах різної температури (від 5-6°C до 25°C).",
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
      specificNuances: ["Холодний цех", "Запах м'яса"],
      specificConditionsDetails:
        "Температура на ділянці розбору: 5–6°C, в інших місцях: до 25°C.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "165 zł за оформлення санітарної книжки утримуються із зарплати.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Допомога на лінії забою курей, прибирання робочих місць, укладання фольги в контейнери. Для жінок: ручна обробка та нарізка філе.",
    additionalNotes:
      "Допомога в продовженні легального перебування в Польщі, надаються аванси.",
  },

  // Вакансія №2 - Збірка меблів Sława
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MRÓWKI",
    templateName: "Sława",
    vacancydescription:
      "Робота монтажником меблів на виробництві та у відрядженнях по Польщі.",
    category: "⚙️ Виробництво і промисловість / Виробництво меблів",
    keywords: [
      "Sława",
      "меблі",
      "монтажник",
      "збірник",
      "Corian",
      "відрядження",
      "Poznań",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФОРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Sława",
    locationDescription:
      "База: 67-410 Sława. Делегації (відрядження) по Польщі.",
    voivodeship: "Lubuskie",
    country: "Polska",
    checkInCity: "",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "29 zł/год нетто",
      studentNetto: "",
      hoursRange: "",
      payoutDates: "",
      bonusDetails: "",
      salaryNotes: "",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 1,
      hoursPerShift: "10",
      workDaysWeek: "Пн-Сб",
      breakDuration: "За домовленістю",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "Пн–Пт: 07:00–17:00. Сб: 8 годин. Нд: вихідний.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Безкоштовне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "Безкоштовно",
      details: "Житло з необхідними умовами.",
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
      gender: ["Чоловіки"],
      ageMax: 55,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Фізична витривалість, здатність працювати на висоті.",
    },

    // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ (ДЭЛЕГАЦЫІ А1) ===
    businessTrip: {
      isBusinessTrip: true,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "Відрядження по Польщі.",
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
      "Оббивка/оздоблення меблів, підбір матеріалів та інструментів, монтаж готельних меблів (бари, стійки ресепшен, шафи, вироби з Corian, настінні покриття, двері), заміри на об'єкті, підгонка елементів, загальні будівельні та оздоблювальні роботи, дотримання техніки безпеки, порядок на робочому місці, дбайливе користування інструментом та робочим одягом. За потреби: завантаження/розвантаження обладнання.",
    additionalNotes:
      "Допомога з легалізацією/продовженням перебування в Польщі, надаються аванси.",
  },

  // Вакансія №3 - ОПЕРАТОР МАШИН Gostyń
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MRÓWKI",
    templateName: "Поліграфічне підприємство Gostyń",
    vacancydescription:
      "Робота оператором офсетних машин на поліграфічному підприємстві з виготовлення упакування.",
    category: "⚙️ Виробництво і промисловість / Поліграфія",
    keywords: [
      "Gostyń",
      "оператор",
      "офсетні машини",
      "упакування",
      "поліграфія",
      "Poznań",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФОРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Gostyń",
    locationDescription: "63-800 Gostyń (70 км від Poznań)",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26 зл/год на руки",
      studentNetto: "30.50 зл/год на руки",
      hoursRange: "~240",
      payoutDates: "",
      bonusDetails: "",
      salaryNotes: "",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "10-12",
      workDaysWeek: "Пн-Пт, іноді суботи",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни: Пн–Пт: 06:00–18:00 / 22:00–06:00. Нд: 18:00–06:00. Пн–Чт: 18:00–06:00. Можлива робоча субота.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "450 зл/місяць",
      details: "Житло з усіма умовами.",
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
      gender: ["Чоловіки"],
      ageMax: 50,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Базовий",
      languageDetails: "Обов’язковий рівень розуміння польської мови.",
      physicalLoad: "Хороший стан здоров’я.",
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
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details: "Робочий одяг безкоштовно після 1,5 місяця.",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Зняття склеєних коробок з машини та укладання на піддони, ручне обгортання плівкою, наклеювання етикеток, вивіз повних піддонів ручним візком, транспортування пустих піддонів, допомога оператору машини (очищення аркушів, подача пакетів), вивіз макулатури та виробничих відходів, підтримка чистоти на робочому місці, виконання вказівок керівника.",
    additionalNotes:
      "Допомога в легалізації перебування в Польщі, надаються аванси.",
  },

  // Вакансія №4 - КАЙТЕРИНГ Wysogotowo
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MRÓWKI",
    templateName: "Кейтеринг Wysogotowo",
    vacancydescription:
      "Робота в сфері громадського харчування на виробництві готових страв.",
    category: "⚙️ Виробництво і промисловість / Харчова промисловість",
    keywords: [
      "Wysogotowo",
      "кейтеринг",
      "громадське харчування",
      "готові страви",
      "кухар",
      "упаковка",
      "Poznań",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФОРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Wysogotowo",
    locationDescription: "62-081 Wysogotowo (10 км від Poznań)",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26 зл/год на руки",
      studentNetto: "30.50 зл/год",
      hoursRange: "",
      payoutDates: "",
      bonusDetails: "",
      salaryNotes: "",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "9-12",
      workDaysWeek:
        "5 днів/тиждень (плаваючі вихідні, суботи та неділі завжди робочі)",
      breakDuration:
        "10 хв (кавова), 15 хв (сніданок), 20 хв (обід), 5 хв (куріння)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Графік складається один раз на місяць. 1-а зміна з 07:30 до 19:30 (або з 10:00 до 20:00). 2-а зміна з 20:00 до 07:30.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Безкоштовний доїзд з Bułgarska/Polska (Poznań).",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовний обід + солодощі, безкоштовна кава (кавові машини), чай.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 45,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Базовий",
      languageDetails: "Розуміння польської мови.",
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
      hasSpecificConditions: true,
      specificNuances: ["Різні температурні режими"],
      specificConditionsDetails:
        "У цеху: від 20°C взимку до 30°C+ влітку. Зона упаковки: +8°C (працювати не більше 3 годин). Склад для сортування товару: +4°C до +8°C (працювати не більше 15-20 хвилин).",
      workwearFree: true,
      foodType: "Обіди",
      foodDetails: "Безкоштовний обід.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "165 зл за оформлення санітарної книжки при оформленні в офісі.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Допомога кухарю в простих кулінарних процесах, допомога в приготуванні страв, упаковка готових страв, сортування готових страв на складі, прибирання та миття кухонних приміщень, прибирання та миття кухонного обладнання, підтримання чистоти на робочому місці.",
    additionalNotes:
      "Оформлення та інструктаж на завтра. Допомога в продовженні легального перебування на території Польщі, надаються аванси.",
  },
];
module.exports = mrowkiTemplates;
