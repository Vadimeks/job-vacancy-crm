// backend/data/templates/mrowki.js
const mrowkiTemplates = [
  // 1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MRÓWKI",
    templateName: "AMI Mikstat - Забій і обробка птиці",
    vacancydescription: "Мясний заклад. Забій і обробка птиці (курятина)",
    category: "⚙️ Виробництво і прамысловасть / М'ясокомбінати та рибзаводи",
    keywords: [
      "AMI",
      "Mikstat",
      "Мікстат",
      "мясо",
      "птиця",
      "забій",
      "курятина",
      "Ostrów Wielkopolski",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Mikstat",
    locationDescription: "Mikstat, 63-510 (околиця Ostrów Wielkopolski)",
    voivodeship: "Великопольське",
    country: "Польща",
    checkInCity: "Ostrów Wielkopolski",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24 zł/год",
      studentNetto: "30.50 zł/год (для студентів до 26 років)",
      hoursRange: "220–280 годин/місяць",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "Доступні аванси.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "10-12",
      workDaysWeek: "Нд–Пт (нічна/ранкова робота)",
      breakDuration:
        "Після 3 год роботи — 30 хв, додатково — 15 хв. Обидві перерви оплачувані.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни по 10-12 годин на день. Нічна: 22:00–08:00, Ранкова: 04:00–16:00, Друга денна зміна: з 05:00-06:00 до 15:00-16:00. Працюють з неділі по п'ятницю.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "500 zł/місяць",
      details: "Житло з умовами (вираховується із зарплати).",
    },
    transport: {
      provided: false,
      costRaw: "не вказано",
      details: "Доїзд/відстань не вказані.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Жінки", "Чоловіки"],
      ageMax: 55,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails:
        "Санітарна книжка (допомагають оформити, 165 zł утримують із зарплати).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Бажано хоча б розуміння польської мови.",

      physicalLoad:
        "Відсутність проблем зі здоров'ям. Ручна обробка та нарізка філе курей. Допомога на лінії забою. Прибирання робочих місць, укладання фольги в контейнери. Також передбачено розміщення, зважування та сортування курей у ящиках (вага близько 15 кг + коробка 2 кг).",
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
      specificNuances: ["Холод", "Запах"],
      specificConditionsDetails:
        "Температура на виробництві: ділянка розбору 5–6°C, інші місця — до 25°C.",
      workwearFree: true,
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Оформлення санітарної книжки: 165 zł (утримують із зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Допомога на лінії забою курей; прибирання робочих місць; укладання фольги в контейнери. Ручна обробка та нарізка філе. Для чоловіків (при потребі) передбачено розміщення, зважування та сортування курей у ящиках (вага близько 15 кг + коробка 2 кг). Надається робоча форма та допомога в продовженні легального перебування в Польщі.",
    additionalNotes: "Адреса: Mikstat, 63-510.",
  },
  // 2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MRÓWKI",
    templateName: "Sława - Монтаж і збірка меблів",
    vacancydescription:
      "Монтажник меблів / збірник меблів (виробництво готельних меблів, бари, стійки ресепшен)",
    category:
      "⚙️ Виробництво і прамысловасть / Виробництво меблів та деревообробка",
    keywords: [
      "Sława",
      "Poznań",
      "меблі",
      "Corian",
      "монтаж",
      "збірка меблів",
      "відрядження",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Sława",
    locationDescription:
      "База: 67-410 Sława + делегації (відрядження) по Польщі",
    voivodeship: "Любуське",
    country: "Польща",
    checkInCity: "Poznań",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "29 zł/год",
      studentNetto: "",
      hoursRange: "210–250 годин/місяць",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "Доступні аванси.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Офіційне працевлаштування (Umowa zlecenie), допомога з легалізацією/продовженням перебування в Польщі.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 1,
      hoursPerShift: "10",
      workDaysWeek: "Пн–Сб",
      breakDuration: "Перерви за домовленістю",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Понеділок–П’ятниця: 07:00–17:00. Субота: 8 годин. Неділя — вихідний. Перерви за домовленістю.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Безкоштовне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "0 zł",
      details: "Безкоштовне житло з необхідними умовами.",
    },
    transport: {
      provided: false,
      costRaw: "не вказано",
      details: "Транспорт для доїзду не вказаний.",
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
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Обов'язковий досвід у збірці/монтажі меблів або суміжних монтажних роботах. Фізична витривалість, точність, сумлінність, акуратність, 'відчуття естетики'. Вміння працювати з ручними та стаціонарними інструментами. Вміння працювати в команді, самостійність, хороша організація. Здатність працювати на висоті (за потреби). Готовність вчитися та працювати.",
    },

    // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ (ДЭЛЕГАЦЫІ А1) ===
    businessTrip: {
      isBusinessTrip: true,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "Делегації (відрядження) по Польщі.",
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
      "Оббивка/оздоблення меблів відповідно до замовлення; Підбір матеріалів та інструментів під конкретне замовлення; Монтаж готельних меблів: бари, стійки ресепшен, комори/шафи, вироби з Corian, настінні покриття, двері всіх типів; Заміри на об'єкті, підгонка елементів 'по місцю'; Загальні будівельні та оздоблювальні роботи; Дотримання техніки безпеки, порядок на робочому місці; Дбайливе користування інструментом та робочим одягом; За потреби: завантаження/розвантаження обладнання. Видається безкоштовна робоча форма.",
    additionalNotes:
      "Адреса бази: 67-410 Sława. Робота передбачає відрядження по Польщі.",
  },
  // 3
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MRÓWKI",
    templateName: "Gostyń - Оператор офсетных машин",
    vacancydescription:
      "Поліграфічне підприємство по виготовленню упакування. Оператор машин",
    category:
      "⚙️ Виробництво і прамысловасть / Поліграфія та паперова промисловість",
    keywords: [
      "Gostyń",
      "Poznań",
      "поліграфія",
      "упаковка",
      "офсетні машини",
      "Гостинь",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Gostyń",
    locationDescription: "63-800 Gostyń (70 км від Познані)",
    voivodeship: "Великопольське",
    country: "Польща",
    checkInCity: "Poznań",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26 zł/год",
      studentNetto: "30.50 zł/год (до 26 років на руки)",
      hoursRange: "~240 годин/місяць",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "Доступні аванси.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Надається допомога в легалізації перебування в Польщі.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "Пн-Пт (можлива робоча субота)",
      breakDuration: "Визначається внутрішнім розпорядком підприємства",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 зміни. Пн–Пт: 06:00–18:00 / 22:00–06:00. Нд: 18:00–06:00. Пн–Чт: 18:00–06:00. Можлива робоча субота.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "450 zł/місяць",
      details: "Житло з усіма умовами (вираховується із зарплати).",
    },
    transport: {
      provided: false,
      costRaw: "не вказано",
      details: "Інформація про доїзд відсутня.",
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
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "А1",
      languageDetails: "Польська мова — обов’язковий рівень розуміння.",

      physicalLoad: "Хороший стан здоров’я. Бажання працювати.",
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
      hasLiability: true,
      details:
        "Робочий одяг — безкоштовно після 1,5 місяця роботи (до цього моменту може бути утримання, якщо звільнитися раніше).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Зняття склеєних коробок з машини та укладання на піддони; Ручне обгортання плівкою, наклеювання етикеток; Вивіз повних піддонів ручним візком; Транспортування пустих піддонів; Допомога оператору машини (очищення аркушів, подача палетів/пакетів); Вивіз макулатури та виробничих відходів; Підтримка чистоти на робочому місці; Виконання вказівок керівника.",
    additionalNotes: "Адреса підприємства: 63-800 Gostyń.",
  },
  // 4
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MRÓWKI",
    templateName: "Wysogotowo - Кейтеринг, виробництво страв",
    vacancydescription:
      "Працівник сфери громадського харчування (Кейтеринг, виробництво готових страв)",
    category: "⚙️ Виробництво і прамысловасть / Гатові страви / кейтэрынг",
    keywords: [
      "Wysogotowo",
      "Poznań",
      "кейтеринг",
      "харчування",
      "готові страви",
      "Висоготово",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Wysogotowo",
    locationDescription: "62-081 Wysogotowo (10 км від Познані)",
    voivodeship: "Великопольське",
    country: "Польща",
    checkInCity: "Poznań",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26 zł/год",
      studentNetto: "30.50 zł/год (студенти до 26 років)",
      hoursRange: "200–240 годин/місяць",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "Доступні аванси.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Надається допомога в продовженні легального перебування на території Польщі.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "9-12",
      workDaysWeek: "5 днів на тиждень",
      breakDuration:
        "Кавовий — 10 хв, сніданок — 15 хв, обід — 20 хв, куріння — 5 хв (є зони для куріння).",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота по 5 днів на тиждень по 9–12 годин у 2 зміни. 1-а зміна: з 07:30 до 19:30 (або з 10:00 до 20:00), 2-а зміна: з 20:00 до 07:30. Графік складається один раз на місяць. Вихідні дні плаваючі. Суботи та неділі завжди робочі. Іноді п'ятниці можуть бути вільними або з коротшими змінами.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "0 zł",
      details: "Житло не надається (няма інфармації про житло від агенціі).",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний транспорт (доїзд з Познані з зупинки Bułgarska/Polska).",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 45,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Потрібна санітарна книжка (допомагають з оформленням — 165 зл при оформленні в офісі).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "А1",
      languageDetails:
        "Розуміння польської мови. Вміння працювати в колективі.",

      physicalLoad:
        "Робота на кухні та складі. Проходження БХП обов'язково на підприємстві.",
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
      specificNuances: [
        "Холод у зоні пакування і сортування",
        "Спека на кухні",
      ],
      specificConditionsDetails:
        "Температура: у цеху — від +20 взимку до +30 і більше влітку. Зона упаковки +8 градусів (можна працювати не більше 3 годин). Склад для сортування товару +4...+8 градусів (працюють не більше 15-20 хвилин).",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails:
        "Безкоштовний обід + солодощі. Безкоштовна кава (кавові машини) та чай.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Оформлення санітарної книжки: 165 зл (при оформленні в офісі).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Допомога кухарю в простих кулінарних процесах; Допомога в приготуванні страв; Упаковка готових страв; Сортування готових страв на складі; Прибирання та миття кухонних приміщень та кухонного обладнання; Підтримання чистоти на робочому місці. Надається робоча форма.",
    additionalNotes: "Адреса підприємства: 62-081 Wysogotowo.",
  },
];
module.exports = mrowkiTemplates;
