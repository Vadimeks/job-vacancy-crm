// backend/data/templates/apolo.js
const apoloTemplates = [
  // 1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "VIRTU Zawiercie - Виробництво готових обідів",
    category: "⚙️ Виробництво і прамысловасть / Гатові страви / кейтэрынг",
    keywords: [
      "VIRTU",
      "Zawiercie",
      "Завєрцє",
      "Katowice",
      "піца",
      "вареники",
      "крокети",
      "паста",
      "virtu",
      "готові страви",
      "напівфабрикати",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Zawiercie",
    locationDescription: "48 км від Катовіце",
    voivodeship: "Сілезське",
    country: "Польща",
    checkInCity: "Katowice",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.71 zł/год",
      studentNetto: "30.60 zł/год",
      hoursRange: "230–290",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "+1 zł/год після відпрацювання 180 годин (чоловіки).",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетта може зменшуватися. Нарахування житла залежить від годин: при 250 год — 450 zł, при 280 год — безкоштовно.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "Пн–Нд, плаваючий вихідний",
      breakDuration: "2 перерви по 20 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни по 12 годин: I зміна 06:00–18:00, II зміна 18:00–06:00",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Частково безкоштовне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw:
        "600 zł/місяць (при 250 год — 450 zł, при 280 год — безкоштовно)",
      details: "Будинки та квартири з хорошими умовами. Кімнати по 3–4 особи.",
    },
    transport: {
      provided: false,
      costRaw: "безкоштовний міський транспорт",
      details:
        "Пішки або громадський транспорт. Міський транспорт безкоштовний.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Молдова", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Потрібна санітарна книжка (санепід).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не потрібна",
      polishLanguageDetails: "", // 👍 Асобнае тэкставае поле для тлумачэння
      physicalLoad:
        "Робота стоячи. Вага повної коробки близько 10 кг. Можна вибрати теплий або холодний цех.",
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
        "Холод",
        "Спека", // Для пекарні (+20°C/+30°C)
        "Заборона прикрас / макіяжу / нігтів",
      ],
      specificConditionsDetails:
        "У пекарні +20°C, налисники +30°C, на упаковці +5°C. Заборонено розпущене волосся та будь-які прикраси.",
      workwearFree: true,
      foodType: "Частково-безкоштовно",
      foodDetails:
        "Продукція підприємства безкоштовна для працівників щодня. Також зі знижкою.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медогляд 150 zł + санепід 150 zł (знімається з першої зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Спецодяг та взуття видається безкоштовно (300 zł утримання із зарплати, якщо не повернути при звільненні).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Контроль якості продукції; Поповнення запасів сировини; Заміна пакувальної плівки/етикеток; Обслуговування машин; Прибирання робочого місця; Виготовлення, упаковка, фасування, сортування, зважування продукції; Контроль якості упаковки та стікерування виробів; Підготовка продукції до відправки (викладення на палети, палетування).",
    additionalNotes:
      "Адреса: Łośnicka 35 або Technologiczna 6, 42-400 Zawiercie. Оформлення: Katowice.",
  },

  // 2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "CARFI Siedlce - Виробництво пластикових деталей",
    category: "⚙️ Виробництво і прамысловасть / Пластикові вироби",
    keywords: [
      "CARFI",
      "Siedlce",
      "Сєдльце",
      "Warszawa",
      "Варшава",
      "пластик",
      "пластикові деталі",
      "carfi",
      "садівництво",
      "медицина",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Siedlce",
    locationDescription: "Siedlce",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Warszawa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "Доплата +1 zł/год нетто при проживанні на власному житлі.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетта може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн–Пт (Сб — на продукції)",
      breakDuration: "30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Продукція: 06:00–14:00, 14:00–22:00, 22:00–06:00. Монтаж: 06:00–14:00, 14:00–22:00",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "22 zł/доба (вираховується із зарплати)",
      details: "Кімнати на 3–4 особи.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Самостійний доїзд.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата +1 zł/год нетто при проживанні на власному житлі.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 55,
      nationalities: ["Україна", "Молдова", "Білорусь", "Грузія"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "А1", // Дакладны тэг для фільтра
      polishLanguageDetails:
        "Комунікативне знання польської мови (розуміти та відповідати на рівні А1-А2).", // 👍 Асобнае тэкставае поле для тлумачэння

      physicalLoad:
        "Мінімальне фізичне навантаження. Робота більше мануальна, ніж ходьба.",
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
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Медогляд 170 zł (одноразово з першої зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Одяг 220 zł (одноразово, якщо не відпрацьовано встановлений термін / не повернено одяг).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Робота на виробничій лінії (темп помірний); Контроль якості готової продукції; Монтаж та з'єднання пластикових деталей; Упаковування виробів; Обслуговування простих виробничих машин; Дотримання інструкцій техніки безпеки.",
    additionalNotes:
      "Адреса: Berdyczowska 9, 08-110 Siedlce. Прыємна музика на складі.",
  },

  // 3
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "Rhenus Logistics Swarzędz - Склад брендового одягу",
    category: "📦 Логістика / Склади одягу та взуття",
    keywords: [
      "Rhenus",
      "Rhenus Logistics",
      "Swarzędz",
      "Свожендз",
      "Познань",
      "Poznań",
      "брендовий одяг",
      "rhenus",
      "Rabowicka",
      "логістика",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Swarzędz",
    locationDescription: "13 км від Познані",
    voivodeship: "Великопольське",
    country: "Польща",
    checkInCity: "Poznań",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.60 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "210–270",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Доплата за власне житло +1 zł/год. Премії за відвідуваність та участь у сезоні розпродажів. Зростання ставки за рівнями (1 рівень: +0,80 zł, 2 рівень: +1,60 zł, 3 рівень: +2,40 zł).",
      salaryNotes:
        "Для студентів діють підвищені ставки за рівнями (1 рівень: 31,50 zł, 2 рівень: 32,50 zł, 3 рівень: 33,50 zł). У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3, // Працуюць у 3 змены (раніца, дзень, ноч)
      hoursPerShift: "12",
      workDaysWeek: "Пн–Нд (плаваючі вихідні)",
      breakDuration: "8-год — 2×15 хв, 12-год — 3×15 хв.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни по 12 годин: D 06:00–18:00, P 10:00–22:00, S 14:00–02:00, N 18:00–06:00, R 08:00–20:00, Z 20:00–08:00. Зміни по 8 годин: I 06:00–14:00, II 14:00–22:00, III 22:00–06:00, IV 18:00–02:00. В низький сезон — по 8 годин, стандартний — 12 годин.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "17 zł/доба (вираховується із зарплати)",
      details: "Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний транспорт з Познані (Rondo Śródka) та зі Swarzędz. На 1 зміну автобус їде о 5:00 (для кандидатів на власному житлі).",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 53,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      polishLanguageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота динамічна, на ногах. Процеси INBOUND, PICK, SORT, PACK, OUTBOUND.",
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
      workwearFree: false, // Выдаткі здымаюцца, калі не адпрацаваць 1 месяц
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
        "Якщо не відпрацювати 1 місяць, утримується за одяг: 70 zł — 2 футболки, 100 zł — теплий полар, 100 zł — взуття.",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "INBOUND: приймання доставок, обробка декларацій; PICK: комплектація замовлень, робота зі сканером, упаковка та розміщення товарів на складі; SORT: сортування товарів за замовленнями клієнтів; PACK: приготування товару до відправлення, комплектація за накладною, зняття магнітних кліпс з одягу; OUTBOUND: підготовка замовлень до відправлення.",
    additionalNotes: "Адреса: Rabowicka 67, Swarzędz.",
  },

  // 4
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "Rhenus Logistics Błonie - Склад інтернет-магазину Lidl",
    category: "📦 Логістика / Склади одягу та взуття", // Lidl одяг/текстиль/аксесуари
    keywords: [
      "Rhenus",
      "Rhenus Logistics",
      "Błonie",
      "Блоне",
      "Warszawa",
      "Варшава",
      "Lidl",
      "Лідл",
      "rhenus błonie",
      "одяг",
      "текстиль",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Błonie",
    locationDescription: "45 км від Варшави",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Warszawa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.50 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "210–270",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "700 zł брутто сезонна премія. Премії за рівні: 1 рівень +1,25 zł/год, 2 рівень +2,50 zł/год. Доплата за власне житло +1 zł/год.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2, // Дзённыя змены (без нічных)
      hoursPerShift: "12", // Можа быць 8, 10 або 12
      workDaysWeek:
        "Пн–Пт (вихідні субота-неділя, робочі під час Black Friday)",
      breakDuration: "30 хв (при 12 год + 15 хв додатково)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "БЕЗ НІЧНИХ. По 8 годин: 06:00–14:15, 14:15–22:15. По 10 годин: 06:00–16:15, 12:15–22:15. По 12 годин: 06:00–18:15, 10:15–22:15.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "20 zł/доба (вираховується із зарплати)",
      details:
        "Квартири або будинки з дуже хорошими умовами. Кімнати 3–4-місні.",
    },
    transport: {
      provided: true,
      costRaw: "200 zł/місяць (із зарплати)",
      details: "Зупинка: Błonie Okrzei.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true, // Онбордынг і сертыфікат
      entranceTestsDetails:
        "Перед підписанням умови проводиться онбординг та отримання сертифікату.",

      polishLanguageLevel: "А1", // Базавы ўзровень
      polishLanguageDetails:
        "Базовий рівень польської мови (А1) для розуміння на складі.",

      physicalLoad:
        "Їзда по складу на візках зі сканером, завантаження товару, підготовка до відправлення, перевірка та пакування. Робота на ногах.",
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
        "Одноразове утримання 160 zł із зарплати за взуття та одяг (якщо не відпрацьовано встановлений термін).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Комплектація замовлень — їзда по складу на візках зі сканером, завантаження товару та доставка на полицю; Відправлення — робота на лінії, підготовка товару до відправлення, перевірка та пакування; Повернення товару — робота зі сканером, перевірка коробок, передача товару на наступну позицію; Розміщення і сортування товару по складу.",
    additionalNotes:
      "Адреса: ul. Batorego 6 Pass, Błonie. Всі кандидати мають завантажити Viber.",
  },

  // 5
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "NOTINO Głuchów - Склад косметики та засобів гігієни",
    category: "📦 Логістика / Склади косметики та побутової хімії",
    keywords: [
      "NOTINO",
      "Głuchów",
      "Глухув",
      "Łódź",
      "Лодзь",
      "косметика",
      "гігієна",
      "notino",
      "Inwestycyjna",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛAKAЦЫІ І ГЕАГРАФІЯ ===
    location: "Głuchów",
    locationDescription: "біля Лодзі",
    voivodeship: "Лодзинське",
    country: "Польща",
    checkInCity: "Lodz",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "", // У арыгінале няма фіксаванага дыяпазону
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Можливі премії від 200 до 500 zł на місяць. Доплата за власне житло +1 zł/год.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2, // Стандартна 2 змены
      hoursPerShift: "8", // У сезон па 12
      workDaysWeek: "Плаваючий вихідний",
      breakDuration: "30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни по 8 годин: 06:00–14:15, 14:15–22:30. В сезон — зміни по 12 годин. В період піку можливі нічні зміни.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "20 zł/доба (вираховується із зарплати)",
      details: "Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "150 zł/місяць",
      details: "Доїзд з Piotrków Trybunalski або з Лодзі — 150 zł/місяць.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 50,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      polishLanguageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Обов'язково мати штани без кишень. Робота стояча на ногах, ходьба па складу са сканерам.",
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
      specificNuances: ["Заборона прикрас / макіяжу / нігтів"],
      specificConditionsDetails:
        "На складі суворо заборонено носити біжутерію та прикраси.",
      workwearFree: false, // Ёсць вылікі, калі не адпрацаваць 1 месяц
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Витрати на медогляд: 150 zł (знімається з першої зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Одноразове утримання 150 zł із зарплати за футболку та взуття, якщо не відпрацьовано 1 місяць.",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Комплектація замовлень зі сканером; Прийом товару на склад; Пакування товару — робота на лінії.",
    additionalNotes: "Адреса: Inwestycyjna 2, 95-080 Głuchów.",
  },

  // 6
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "ID-LOGISTICS Psary - Склад брендового одягу та аксесуарів",
    category: "📦 Логістика / Склади одягу та взуття",
    keywords: [
      "ID-LOGISTICS",
      "ID Logistics",
      "Psary",
      "Псари",
      "Katowice",
      "Катовіце",
      "брендовий одяг",
      "id logistics psary",
      "Akacjowa",
      "Dąbrowa Górnicza",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Psary",
    locationDescription: "15 км від Катовіце",
    voivodeship: "Сілезське",
    country: "Польща",
    checkInCity: "Dąbrowa Górnicza",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.35 zł/год",
      studentNetto: "31.40 zł/год",
      hoursRange: "", // У арыгінале дыяпазон гадзін не пазначаны
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Премії за виконання норми від 240 до 1 200 zł брутто. Доплата за власне житло +1,50 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3, // Змены ранішнія, дзённыя і начныя
      hoursPerShift: "12", // Ад 8 да 12 гадзін
      workDaysWeek: "5–6 днів на тиждень (плаваючий вихідний)",
      breakDuration: "8 год — 20 хв, 12 год — 20+15 хв.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "По 8–12 годин. Зміни можуть починатись з 06:00, 10:00, 12:00, 14:00, 18:00, 20:00, 22:00. Графік формує заклад (вибрати зміну не можна).",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "510 zł/місяць (із зарплати)",
      details:
        "Квартири або будинки з комфортними умовами. Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний транспорт з Katowice, Sosnowiec, Dąbrowa Górnicza, Będzin.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1,50 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false, // Вопыт будзе перавагай, але не абавязковы
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      polishLanguageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота на ногах, ходьба па складу. Про процесах PICK/PACK можна у своєму взутті, на INBOUND/OUTBOUND — обов'язково робоче. Потрібен хороший зір.",
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
      foodType: "За свій рахунок",
      foodDetails:
        "На складі є автомати з перекусами, готовими обідами, солодким та напоями, кавомати.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Витрати на медогляд: 150 zł (вираховується з першої зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Утримання 300 zł із зарплати за одяг, якщо не відпрацьовано 2 місяці.",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "INBOUND: приймання доставок, обробка декларацій; PICK: комплектація замовлень, робота зі сканером, розміщення товарів по складу; PACK: приготування товару до відправлення, комплектація замовлень за накладною; OUTBOUND: підготовка замовлень клієнтів до відправлення.",
    additionalNotes:
      "Адреса: Akacjowa 6, Psary. Контакт з координаторами виключно у Viber.",
  },

  // 7
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "DPD Brwinów - Міжнародна служба експрес-доставки",
    category: "📦 Логістика / Кур'єрські служби та поштові склади",
    keywords: [
      "DPD",
      "Brwinów",
      "Брвінув",
      "Warszawa",
      "Варшава",
      "доставка",
      "посилки",
      "dpd",
      "Pruszków",
      "Tomasza",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Brwinów",
    locationDescription: "20 км від Варшави",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Warszawa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.62 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "200–280",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "+2 zł брутто (1,60 zł нетто) за кожну відпрацьовану годину без пропусків. Доплата за власне житло +1 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Безкоштовний медогляд.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 1, // Фіксавана нічні зміни
      hoursPerShift: "10-11",
      workDaysWeek: "Пн–Пт (5 днів на тиждень)",
      breakDuration: "1 перерва по 30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни з 18:00 до 05:00 (або з 19:00 до 05:00, залежно від потреб).",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "23 zł/доба (вираховується із зарплати)",
      details: "Квартири або будинки з хорошими умовами. Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Робочий автобус DPD забирає з вокзалу у Прушкові о 18:15 (чекати не будуть) і привозить назад.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 45,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      polishLanguageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Хороша фізична форма. Готовність до нічних змін. Вага посилок від 300 грамів до 40 кг. Завантаження та розвантаження вантажівок.",
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
      specificNuances: ["Важка фізична праця"],
      specificConditionsDetails: "Нічні зміни, робота з посилками до 40 кг.",
      workwearFree: false, // Одноразове утримання 240 zł
      foodType: "Безкоштовно",
      foodDetails: "Безкоштовні повноцінні обіди надаються підприємством.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: false,
      details: "Медогляд безкоштовний.",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Одноразове утримання 240 zł із зарплати за одяг та взуття (якщо не відпрацьовано встановлений термін).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Завантаження посилок у вантажівки, що під'їжджають до лінії; Розвантаження вантажівок на лінію; Вага посилок: від 300 грамів до 40 кг.",
    additionalNotes:
      "Адреса: św. Tomasza 4, 05-840 Brwinów. Усі кандидати мають завантажити Viber.",
  },

  // 8
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "CCC Polkowice - Склад магазинів CCC та Half Price",
    category: "📦 Логістика / Склади одягу та взуття", // Склад взуття, аксесуарів, рюкзаків
    keywords: [
      "CCC",
      "ССС",
      "Polkowice",
      "Полковіце",
      "Wrocław",
      "Вроцлав",
      "Half Price",
      "взуття",
      "рюкзаки",
      "ccc polkowice",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Polkowice",
    locationDescription: "Polkowice", // У арыгінале няма апісання адлегласці
    voivodeship: "Нижньосілезьке",
    country: "Польща",
    checkInCity: "Wrocław",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "", // У арыгінале дыяпазон гадзін не пазначаний
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "Доплата за власне житло +1 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн–Пт (іноді суботи залежно від замовлень)",
      breakDuration: "1 перерва по 20 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "3 зміни по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "20 zł/доба (із зарплати)",
      details: "Квартири або будинки з добрими умовами. Кімнати 3–4-місні.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details: "Безкоштовний транспорт з Legnica та Lubin.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 50,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      polishLanguageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота на ногах, збирання товару зі сканером, упаковка та підготовка до відправки. Чоловіки залучаються до розвантаження машин із товаром.",
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
      specificNuances: ["Заборона прикрас / макіяжу / нігтів"],
      specificConditionsDetails:
        "На складі суворо заборонено носити прикраси та біжутерію!",
      workwearFree: false, // Є одноразове спасання 200 zł
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Медогляд: 150 zł (одноразово знімається з першої зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Одяг: 200 zł (одноразово стягується із зарплати, якщо не відпрацьовано встановлений термін).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Упаковка замовлень та підготовка до відправки (основний процес); Розвантаження машин із товаром (чоловіки); Прийом та викладення товару; Збирання товару зі сканером.",
    additionalNotes:
      "Адреса: Polkowice. Для колишніх працівників CCC при повторному працевлаштуванні потрібно надати: період роботи, яка зміна, хто керівник, яка частина складу, перша сторінка паспорту.",
  },

  // 9
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "ID-LOGISTICS Rakitno - Склад Amazon (товари для дому)",
    category: "📦 Логістика / Склади товарів для дому та b2b",
    keywords: [
      "ID-LOGISTICS",
      "ID Logistics",
      "Rakitno",
      "Ракітно",
      "Gorzów Wielkopolski",
      "Гожув",
      "Amazon",
      "Амазон",
      "id logistics rakitno",
      "Nowa Niedrzwica",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Rakitno",
    locationDescription: "околиці Gorzów Wielkopolski",
    voivodeship: "Любуське",
    country: "Польща",
    checkInCity: "Gorzów Wielkopolski",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "", // У арыгінале дыяпазон гадзін не пазначаны
      payoutDates: "20 числа за попередній місяць.",
      bonusDetails:
        "Премії до 800 zł брутто за виконання норм. Доплата за власне житло +1,37 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "12", // Ад 8 да 12 гадзін
      workDaysWeek: "5–6 днів на тиждень (плаваючий вихідний)",
      breakDuration: "1 перерва по 30 хв та 1 перерва по 15 хв.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "По 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00. По 12 годин: 06:00–18:00, 18:00–06:00, 14:00–02:00. Графік залежить ад аб'ёму заказаў.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw:
        "510 zł/місяць (300 zł для студентів до 26 р.). Після 240 год: 310 zł (26+), 100 zł (студенти)",
      details: "Квартири або будинки. Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details: "Безкоштовний транспорт з Gorzów Wielkopolski.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1,37 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 55,
      nationalities: ["Україна", "Молдова", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      polishLanguageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота на ногах, збір товару зі сканером, упаковка. Товари вагою від 5 до 30 кг.",
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
      workwearFree: false, // Выдаткі здымаюцца з першай ЗП
      foodType: "За свій рахунок",
      foodDetails:
        "На складі є столова, автомати з бутербродами, безкоштовні фрукти.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Одяг (штани, кофта, футболка, взуття): 250 zł (одноразово з першої зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Медогляд: 190 zł (стягується із зарплати, якщо не відпрацьовано 2 місяці).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Прийом та викладка товару; Збір товару зі сканером; Пакування замовлень і підготовка до відправки; Робота не вимагає досвіду — є оплачуване навчання (3–5 днів).",
    additionalNotes:
      "Адреса: ul. Nowa Niedrzwica 58, Rakitno. Норми роботи реальні. Можливість зміни процесу за бажанням.",
  },

  // 10
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "Цукерки Nysa - Виробництво цукерок",
    category:
      "⚙️ Виробництво і прамысловасть / Харчова промисловість і кондитерські вироби",
    keywords: [
      "Цукерки",
      "Nysa",
      "Ниса",
      "Wrocław",
      "Вроцлав",
      "цукерки",
      "желейні",
      "маршмелоу",
      "кондитерські",
      "Nowowiejska",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Nysa",
    locationDescription: "60 км від Ополе",
    voivodeship: "Опольське",
    country: "Польща",
    checkInCity: "Nysa", // Оформлення на місці (немає вказівки на Вроцлав/Катовіце)

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "30.50 zł брутто/год", // У арыгінале стаўка брутто
      studentNetto: "",
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "Карта Multisport та медичний пакет LuxMed.",
      salaryNotes:
        "Можливе продовження документів (карта побиту). У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "4 дні роботи — 2 дні вихідних (система 4 бригад)",
      breakDuration: "Визначається індивідуально (машини не зупиняються)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни по 12 годин: I зміна 06:00–18:00, II зміна 18:00–06:00. Ротація між позиціями.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Тільки власне житло",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "Тільки власне житло (компенсація не передбачена)",
      details: "Житло агентство не надає.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Громадський транспорт за власний рахунок.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 99, // Без вікових обмежень
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Потрібна санітарна книжка (санепід). Якщо немає — виготовлення власним коштом (~160 zł).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "А2", // Комунікативна польська мова
      polishLanguageDetails:
        "Комунікативна польська мова (розуміння та відповіді на виробничі завдання).",

      physicalLoad: "Робота стояча, ротація між подібними позиціями.",
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
        "Заборона прикрас / макіяжу / нігтів",
        "Роздягальня чиста/брудна зона",
      ],
      specificConditionsDetails:
        "Температура ~20°C. ЗАБОРОНЕНО: прикраси, штучні нігті, гібридні/гелеві покриття, штучні вії.",
      workwearFree: true,
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: false, // Санэпід аплачваецца пры вырабе самастойна, а не адлічваецца з ЗП
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Прості виробничі процеси: сортування, пакування та перебір солодощів; Підготовка етикеток; Прибирання робочого місця; Дотримання санітарних та виробничих норм.",
    additionalNotes: "Адреса: Nowowiejska 22, 48-303 Nysa.",
  },

  // 11
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName:
      "ID-LOGISTICS Tarnowo Podgórne - Склад брендових товарів та одягу",
    category: "📦 Логістика / Склади одягу та взуття", // Брендові товари, одяг та аксесуари
    keywords: [
      "ID-LOGISTICS",
      "ID Logistics",
      "Tarnowo Podgórne",
      "Тарново",
      "Poznań",
      "Познань",
      "брендові товари",
      "id logistics tarnowo",
      "Sowia",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Tarnowo Podgórne",
    locationDescription: "біля Познані",
    voivodeship: "Великопольське",
    country: "Польща",
    checkInCity: "Poznań",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "", // У арыгінале дыяпазон гадзін не пазначаны
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Премії до 1 000 zł брутто за виконання норм. Доплата за власне житло +1 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3, // Пры спадзе 3 змены па 8 гадзін
      hoursPerShift: "12", // Можа быць 8 або 12 гадзін
      workDaysWeek:
        "6 робочих днів, 1 вихідний (графік залежить від замовлень)",
      breakDuration: "Визначається внутрішнім розпорядком складу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "По 12 годин: 07:00–19:00, 19:00–07:00. При спаді по 8 годин: 07:00–15:00, 15:00–23:00, 23:00–07:00. У першы дзень вызначаецца змена (дзённая ці начная) — змяняць нельга.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "500 zł/місяць (із зарплати)",
      details: "Квартири, будинки з комфортними умовами. Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details: "Безкоштовний доїзд до роботи з Познані.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 45,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      polishLanguageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота на ногах, ходьба па складу. У своєму одязі працювати не можна.",
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
      workwearFree: false, // Ёсць аднаразовае ўтрыманне
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Одяг (футболка, штани, взуття, фліска, камізелька): 300 zł (одноразово знімається із зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Медогляд: 150 zł (стягується із зарплати, якщо не відпрацьовано 2 місяці).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "PICK: комплектація замовлень, робота зі сканером, розміщення товарів по складу; PACK: приготування товару до відправлення, пакування згідно зі стандартами; Прийом нового товару.",
    additionalNotes:
      "Адреса: Sowia 31, Tarnowo Podgórne. У перший день розподіляють по процесах — це не завжди лише pick і pack.",
  },

  // 12
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName:
      "STOKROTKA Teresin - Склад супермаркету (комплектація замовлень)",
    category: "📦 Логістика / Склади супермаркетів та продуктів харчування", // Склад мережі супермаркетів
    keywords: [
      "STOKROTKA",
      "Stokrotka",
      "Teresin",
      "Тересін",
      "Warszawa",
      "Варшава",
      "супермаркет",
      "склад",
      "stokrotka",
      "Lazurowa",
      "акорд",
    ],
    contractType: "Umowa zlecenie",

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Teresin",
    locationDescription: "54 км від Варшави",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Teresin", // Оформлення на місці

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26.73 zł/год", // Стартова погодинна ставка (1 рівень)
      studentNetto: "31.60 zł/год",
      hoursRange: "", // У арыгінале дыяпазон гадзін не пазначаны
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Акордна система оплати (залежить від виробітку): 1 рівень — 26,73; 2 рівень — 28,26; 3 рівень — 30,12; 4 рівень — 28,89; 5 рівень — 35,65 zł нетто. Доплата за власне житло +1 zł/год нетто. Доплата за власний транспорт +1 zł/год нетто.",
      salaryNotes:
        "Адаптаційний період: до кінця першого місяця — погодинна ставка, з першого числа наступного місяця — акорд. У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8", // Пізніше можна по 12 годин
      workDaysWeek: "5–6 днів на тиждень (плаваючий вихідний)",
      breakDuration: "по 8 год — 1×20 хв, по 12 год — 2×15–20 хв.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "3 зміни по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00 (пізніше можна по 12 годин). Графік надсилається на тиждень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "19 zł/доба (вираховується із зарплати)",
      details: "Квартири або будинки з комфортними умовами. Кімнати 3–4-місні.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок (+1 zł/год доплата)",
      details:
        "Власний транспорт. Доплата +1 zł нетто да погодинної ставки за використання свого авто.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Доплата за власне житло +1 zł/год нетто. Доплата за власний транспорт +1 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false, // Wózki unoszące — ліцензія робиться на місці
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "А2", // Комунікативний рівень
      polishLanguageDetails:
        "Комунікативний рівень польської мови (для розуміння голосових команд system voice).",

      physicalLoad:
        "Збирання товару зі сканером на електровізку та мануально. Потрібен хороший зір.",
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
        "Холод", // Наявність холодного і м'ясного відділів
      ],
      specificConditionsDetails:
        "Робота у відділах: сухий, холодний, м'ясний, молочний.",
      workwearFree: false, // Є утримання за недопрацьовані 3 місяці
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Одноразове утримання 150 zł із зарплати за ліцензію на електровозик.",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Утримання 500 zł із зарплати за одяг та медогляд, якщо не відпрацьовано 3 місяці.",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Робота на складі на комплектації замовлень; Збирання товару зі сканером/system voice на вузку та мануально; Упаковка замовлень та підготовка до відправки.",
    additionalNotes:
      "Адреса: Lazurowa 2, 96-515 Teresin. Досвідчені робітники роблять 4–5 рівень акорду, початківці — 2–3 рівень.",
  },
];

module.exports = apoloTemplates;
