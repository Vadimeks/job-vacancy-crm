// backend/data/templates/apolo.js
const apoloTemplates = [
  // 1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "VIRTU Zawiercie - Виробництво готових обідів",
    vacancydescription:
      "Виробництво готових обідів та напівфабрикатів (піца, крокети, вареники, паста)", // 👍 Удакладнілі паводле арыгінала
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

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) Кандидати: чоловіки, жінки, пари до 55 років (Україна, Молдова, Білорусь, Азербайджан, Таджикистан, Киргизстан, Казахстан, студенти). Для кандидатів з Азії обов'язкове знання російської або української мови.\n" +
        "2) Доплата чоловікам: +1 zł/год після відпрацювання 180 годин.\n" +
        "3) На підприємстві суворо заборонено ходити з розпущеним волоссям та носити будь-які прикраси.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Zawiercie",
    locationDescription: "48 км від Катовіце (оформлення у Katowice)", // 👍 Удакладнілі месца афармлення
    voivodeship: "Сілезське",
    country: "Польща",
    checkInCity: "Katowice",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.71 zł/год",
      studentNetto: "30.60 zł/год",
      hoursRange: "230–290",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "+1 zł/год нетто до ставки після відпрацювання 180 годин (для чоловіків). Доплата за власне житло +1 zł/год нетто.",
      salaryNotes:
        "Розрахунок за житло залежить від годин: 26+ років — 600 zł (або 20 zł/доба), при 250 год — 450 zł, пры 280 год — безкоштовно. Студенти: 25 zł/доба, при 250 год — 600 zł, при 280 год — безкоштовно. У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "Пн–Нд (плаваючий вихідний)",
      breakDuration: "2 перерви по 15-20 хвилин", // 👍 Узгоджана паводле арыгіналаў
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Праця по 12 годин: I зміна 06:00–18:00, II зміна 18:00–06:00. Від 230 до 290 робочих годин на місяць. Вихідні плаваючі.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Частково безкоштовне",
      forCouples: true, // 👍 Бяруць пары паводле тэксту
      withChildren: false,
      withPets: false,
      costRaw:
        "Дорослим (26+): 600 zł/місяць (при 250 год — 450 zł, при 280 год — безкоштовно). Студенти: 25 zł/доба (при 250 год — 600 zł, при 280 год — безкоштовно).", // 👍 Выправілі лічбы паводле арыгінала
      details: "Будинки та квартири з хорошими умовами. Кімнати на 3–4 особи.",
    },
    transport: {
      provided: false,
      costRaw: "Міський транспорт безкоштовний",
      details:
        "Пішки або міським громадським транспортом (громадський транспорт містом безкоштовний).",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: [
        "Україна",
        "Молдова",
        "Білорусь",
        "Азербайджан",
        "Таджикистан",
        "Киргизстан",
        "Казахстан",
      ],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Потрібна санітарна книжка (санепід).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails:
        "Знання польської мови не вимагається (для кандидатів з Азії обов'язкова російська або українська мова).",

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
        "Спека",
        "Заборона прикрас і розпущеного волосся",
      ],
      specificConditionsDetails:
        "Робота в цехах: пекарня (+20°C), млинці/налисники (+30°C), упаковка (+5°C). Заборонено ходити з розпущеним волоссям та носити будь-які прикраси.",
      workwearFree: true, // 👍 Робочий одяг безкоштовний (якщо повернути при звільненні)
      foodType: "Безкоштовно",
      foodDetails:
        "Продукція підприємства безкоштовна для працівників щодня на зміні. Також продукція доступна зі знижкою (піци, паста, вареники, галушки, млинці, лазанья, крокеты, запіканкі).", // 👍 Удакладнілі паводле арыгінала
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медогляд: 150 zł + санепід: 150 zł (одноразово знімається з першої зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Спецодяг та взуття видаються безкоштовна (утримання 300 zł із зарплати, якщо не повернути при звільненні).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Виготовлення, упаковка, фасування, сортування, зважування продукції; Контроль якості продукції та упаковки; Поповнення запасів сировини; Заміна пакувальної плівки/етикеток; Обслуговування машин; Прибирання робочого місця; Підготовка продукції до відправки (викладення на палети, палетування).",
    additionalNotes:
      "Адреса: Łośnicka 35 або Technologiczna 6, 42-400 Zawiercie. Місце оформлення документів: Katowice.",
  },

  // 2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "CARFI Siedlce - Виробництво пластикових деталей",
    vacancydescription:
      "Виробництво пластикових деталей (для садівництва, промисловості, медицини та автогалузі)", // 👍 Удакладнілі паводле арыгінала
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
      "автогалузь",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) Кандидати: Чоловіки, жінки, пари від 18 до 55 років. Громадяни України, Молдови, Білорусі, Грузії та англомовні.\n" +
        "2) Досвід не потрібен — усьому навчають на місці.\n" +
        "3) Для осіб до 26 років зі статусом студента страхування 97 zł/міс (якщо немає свого).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Siedlce",
    locationDescription: "Siedlce (оформлення у Warszawa)", // 👍 Удакладнілі месца афармлення
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
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Для осіб до 26 років зі статусом студента страхування 97 zł/міс.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн–Пт (Сб — на продукції)",
      breakDuration: "1 перерва — 30 хвилин",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Продукція: 6:00–14:00, 14:00–22:00, 22:00–6:00. Монтаж: 6:00–14:00, 14:00–22:00. Надгодини можливі при збільшенні замовлень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true, // 👍 Прымаюць сямейныя пары па тэксце
      withChildren: false,
      withPets: false,
      costRaw: "22 zł/доба вираховується із зарплати (~660 зл/місяць)",
      details: "Кімнати на 3–4 особи.",
    },
    transport: {
      provided: false,
      costRaw: "За власний рахунок",
      details: "Самостійний доїзд.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата +1 zł/год нетто при проживанні на власному житлі.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Молдова", "Білорусь", "Грузія", "Англомовні"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "А1",
      languageDetails: "Комунікативне знання польської мови.",

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
      hasSpecificConditions: true,
      specificNuances: ["Приємна музика на складі"],
      specificConditionsDetails: "На складі грає приємна музика.",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Медогляд: 170 zł (одноразово з першої зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Робочий одяг: 220 zł (одноразово із зарплати, якщо не відпрацьовано встановлений термін / не повернено одяг).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Робота на виробничій лінії (темп помірний); Контроль якості готової продукції; Монтаж та з'єднання пластикових деталей; Упаковування виробів; Обслуговування простих виробничих машин; Дотримання інструкцій техніки безпеки.",
    additionalNotes:
      "Адреса: Berdyczowska 9, 08-110 Siedlce. Місце оформлення документів: Warszawa.",
  },

  // 3
  {
    // === 1. СИСТЕМНІ ПОЛЯ (Групування та пошук) ===
    agencyName: "APOLO",
    templateName: "Rhenus Logistics Swarzędz - Склад брендового одягу",
    vacancydescription: "Логістичний склад брендового одягу та аксесуарів", // 👍 Публічна назва для кандидатів
    category: "📦 Логістика / Склади одягу та взуття",
    keywords: [
      "Rhenus",
      "Rhenus Logistics",
      "Swarzędz",
      "Свожендз",
      "Познань",
      "Poznań",
      "брендовий одяг",
      "Rabowicka",
    ],
    contractType: "Umowa zlecenie",

    // === ВНУТРІШНЯ ІНФОРМАЦІЯ (ТІЛЬКИ ДЛЯ РЕКРУТЕРА) ===
    forRecruiter: {
      internalNotes:
        "1) ВАЖЛИВО ПЕРЕВІРИТИ ДОЇЗДИ ДО Rondo Śródka! На 1 зміну автобус їде о 05:00. Стосується кандидатів на власному житлі.\n" +
        "2) Щомісячне страхування для осіб до 26 років зі статусом студента — 97 zł/місяць.\n" +
        "3) Зупинки у Swarzędz: ЛіTheoretical Lidl, Нетто (DOZ Apteka dbam o zdrowie).\n" +
        "4) Кандидати від 18 до 53 років (чоловіки, жінки, пари).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛОКАЦІЇ ТА ГЕОГРАФІЯ ===
    location: "Swarzędz",
    locationDescription: "13 км від Познані (оформлення у Poznań)", // 👍 Уточнили місце оформлення
    voivodeship: "Великопольське",
    country: "Польща",
    checkInCity: "Poznań",

    // === 3. ФІНАНСИ ===
    salary: {
      baseNetto: "25.60 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "210–270", // 👍 Додали згідно з текстом
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Доплата за власне житло +1 zł/год нетто. Склад може нараховувати додаткові премії за відвідуваність без пропусків та активну участь у сезоні розпродажів. Преміальна ставка за виконання норм: 1 рівень — 26.40 zł, 2 рівень — 27.20 zł, 3 рівень — 28.00 zł нетто. Для студентів: 1 рівень — 31.50 zł, 2 рівень — 32.50 zł, 3 рівень — 33.50 zł нетто.", // 👍 Премії вказані в нетто
      salaryNotes:
        "Після зароблених 30 000 зл брутто ставки нетто знижуються: 1 рівень — 22.75 zł, 2 рівень — 23.48 zł, 3 рівень — 24.20 zł. Щомісячне страхування для студентів до 26 років — 97 zł/місяць.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12", // 👍 Уточнили (може бути 8 і 12)
      workDaysWeek: "Пн–Нд (графік встановлює заклад, 210-270 годин на місяць)",
      breakDuration:
        "при 8 год — 2 перерви по 15 хв; при 12 год — 3 перерви по 15 хв", // 👍 Уточнили за текстом
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни по 12 годин: D 06:00–18:00, P 10:00–22:00, S 14:00–02:00, N 18:00–06:00, R 08:00–20:00, Z 20:00–08:00. Зміни по 8 годин: І 06:00–14:00, ІІ 14:00–22:00, ІІІ 22:00–06:00, ІV 18:00–02:00. У низький сезон може бути робота по 8 годин. Можливість додатково брати 3 вихідних на місяць за власним бажанням (не надаються під час розпродажів).",
    },

    // === 5. ПРОЖИВАННЯ ТА ТРАНСПОРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true, // 👍 Оскільки беруть пари
      withChildren: false,
      withPets: false,
      costRaw: "17 zł/доба вираховується з зарплати (~510 zł/місяць)",
      details: "Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний транспорт від фірми Rhenus зі Swarzędz (зупинки Lidl та DOZ Apteka/Netto) та з Познані (Rondo Śródka). На 1 зміну автобус їде о 05:00.", // 👍 Уточнили зупинки
    },

    // === 6. КОМПЕНСАЦІЇ ВІД РОБОТОДАВЦЯ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
    },

    // === 7. ВИМОГИ ТА КАНДИДАТИ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 53,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",
      physicalLoad:
        "Робота на ногах, динамічна. Процеси: INBOUND, PICK, SORT, PACK, OUTBOUND.",
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
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВИТРАТИ НА СТАРТІ ТА ВІДПОВІДАЛЬНІСТЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Робочий одяг (одноразово із зарплати): 70 zł за 2 футболки та 90 zł за теплий полар (фліс).", // 👍 Виправили ціну полара за російською версією (90 зл замість 90-100)
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Робоче взуття: 100 zł (одноразово із зарплати, якщо не відпрацювати 1 місяць).",
    },

    // === 11. ОПИС ПРОЦЕСІВ ТА НОТАТКИ ===
    description:
      "INBOUND: приймання доставок, обробка декларацій; PICK: комплектація замовлень, робота зі сканером, упаковка та розміщення товарів на складі; SORT: сортування товарів за замовленнями клієнтів; PACK: приготування товару до відправлення, комплектація за накладною, зняття магнітних кліпс з одягу; OUTBOUND: підготовка замовлень до відправлення.",
    additionalNotes:
      "Адреса: Rabowicka 67, Swarzędz. Місце оформлення: Poznań.",
  },

  // 4
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "Rhenus Logistics Błonie - Склад інтернет-магазину Lidl",
    vacancydescription:
      "Склад інтернет-магазину Lidl (одяг, текстиль, товари для дому, дрібна побутова техніка)", // 👍 Удакладнілі паводле арыгінала
    category: "📦 Логістика / Склади одягу, взуття та побутової техніки",
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

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) ВСІ КАНДИДАТИ МАЮТЬ ЗАВАНТАЖИТИ Viber.\n" +
        "2) Перед підписанням умови кандидат має пройти онбординг та отримати сертифікат: реєстрація в ПФ (прописуємо мейл і номер телефону). Координатор надасть доступ і потім ми це передаємо людям.\n" +
        "3) Зупинка автобуса: Błonie Okrzei (https://maps.app.goo.gl/mKS6mBicETh9exWq5?g_st=iv).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. LAKAЦЫІ І ГЕАГРАФІЯ ===
    location: "Błonie",
    locationDescription: "45 км від Варшави (оформлення у Warszawa)", // 👍 Удакладнілі месца афармлення па тэксце
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Warszawa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.50 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "210–270", // 👍 Па арыгінальным тэксце
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Сезонна премія: 700 zł брутто. Премії за виробіток (пороги): 1 рівень — +1,25 zł/год нетто, 2 рівень — +2,50 zł/год нетто. Доплата за власне житло +1 zł/год нетто.", // 👍 Выправілі брутто на нетто для парогаў паводле ўкраінскага тэксту
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-10-12", // 👍 Па тэксце ёсць тры варыянты гадзін
      workDaysWeek:
        "Пн–Пт (субота і неділя — вихідні, але під час Black Friday можуть бути робочі дні)",
      breakDuration: "30 хвилин (при зміні 12 годин + додатково 15 хвилин)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "БЕЗ НІЧНИХ СМЕН. Зміни можуть змінюватись відповідно до виробничих потреб. По 8 годин: 06:00–14:15, 14:15–22:15. По 10 годин: 06:00–16:15, 12:15–22:15. По 12 годин: 06:00–18:15, 10:15–22:15.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "20 zł/доба вираховується із зарплати (~600 зл/місяць)",
      details:
        "Квартири або будинки з дуже хорошими умовами проживання. Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "200 zł/місяць вираховується із зарплати",
      details: "Зупинка робочого транспорту: Błonie Okrzei.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
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
      hasEntranceTests: true, // 👍 Тлумачэнне пра онбордынг пакідаем тут
      entranceTestsDetails:
        "Перед підписанням умови кандидат має пройти онбординг та отримати сертифікат (реєстрація в ПФ через мейл та номер телефону). Координатор надає доступ.",

      polishLanguageLevel: "А1",
      languageDetails: "Базовий рівень польської мови.",

      physicalLoad:
        "Робота на ногах. Працівники пересуваються по складу на візках зі сканером.",
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
      "Комплектація замовлень — працівники їздять по складу на візках зі сканером, завантажують товар згідно зі списком на візок і відвозять на відповідну полицю; Відправлення — робота на лінії, підготовка товару до відправлення, перевірка коробок на лінії (чи сходиться товар), пакування товару; Повернення товару — робота зі сканером, перевірка коробок (відповідність, пошкодження), передача товару на наступну позицію (розкладання товару); Розміщення і сортування товару — розвезення товару з повернення по складу на відповідні місця зберігання.",
    additionalNotes:
      "Адреса: Błonie, ul. Batorego 6 Pass. Місце оформлення документів: Warszawa.",
  },

  // 5
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "NOTINO Głuchów - Склад косметики та засобів гігієни",
    vacancydescription: "Логістичний склад косметики та засобів гігієни", // 👍 Публічны загаловак для кандыдатаў
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

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) Кандидати: чоловіки, жінки, пари від 18 до 50 років. Україна, Білорусь, Молдова.\n" +
        "2) Обов’язково треба мати штани без кишень.\n" +
        "3) На складі не можна носити біжутерію та прикраси.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Głuchów",
    locationDescription: "біля Лодзі",
    voivodeship: "Лодзинське",
    country: "Польща",
    checkInCity: "Lodz",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto: "30.50 zł/год", // 👍 Для студентів/учнів в Польщі до 26 років
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Можливі премії від 200 до 500 zł на місяць. Доплата за власне житло +1 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8", // 👍 (в період сезону по 12 годин)
      workDaysWeek: "Плаваючий вихідний",
      breakDuration: "1 перерва — 30 хвилин",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни по 8 годин: 06:00–14:15, 14:15–22:30. В період сезону зміни по 12 годин. В період піку сезону можливі нічні зміни. Вихідні плаваючі.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true, // 👍 Па тэксце звычайна бяруць пары на Notino
      withChildren: false,
      withPets: false,
      costRaw: "20 zł/доба вираховується із зарплати (~600 зл/місяць)",
      details: "Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "150 zł/місяць",
      details:
        "Доїзд з Piotrków Trybunalski — 150 зл/місяць, доїзд з Лодзі — 150 зл/місяць.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"], // 👍 Паводле тэксту
      ageMax: 50,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Обов’язково треба мати штани без кишень. Робота стояча на ногах, ходьба по складу зі сканером.",
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
      specificNuances: ["Штани без кишень", "Заборона біжутерії та прикрас"],
      specificConditionsDetails:
        "На складі суворо заборонено носити біжутерію та прикраси. Обов’язково треба мати штани без кишень.",
      workwearFree: true, // 👍 Робочий одяг безкоштовний, якщо відпрацювати місяць
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Медогляд: 150 зл (одноразово з зарплати).", // 👍 Выправілі паводле тэксту
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Футболка та взуття безкоштовно (але утримання 150 зл, якщо не відпрацювати 1 місяць).", // 👍 Выправілі паводле тэксту
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Комплектація замовлень зі сканером; Прийом товару на склад; Пакування товару — робота на лінії. На складі NOTINO зберігаються товари: косметика та засоби гігієни.",
    additionalNotes: "Адреса: Inwestycyjna 2, 95-080 Głuchów.",
  },

  // 6
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "ID-LOGISTICS Psary - Склад брендового одягу та аксесуарів",
    vacancydescription:
      "Логістичний склад брендового одягу та аксесуарів (взуття, біжутерія, сумки)", // 👍 Публічны загаловак для кандыдатаў
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

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) Не беремо Нігерію, Камерун, Бангладеш, Грузію.\n" +
        "2) Кандидати: жінки, чоловіки, пари від 18 до 55 років (Україна, Білорусь, Молдова, Азія, Колумбія та англомовні).\n" +
        "3) Потрібно в ПФ прописувати коментар, де працювала людина, скільки часу, на яких процесах. Якщо є досвід на складах (одяг, електроніка, меблі, продукти, автозапчастини) — прописувати відразу.\n" +
        "4) Контакт з координаторами виключно у Viber.\n" +
        "5) 97 зл — медичне страхування для студентів до 26 років (якщо немає власного).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Psary",
    locationDescription:
      "15 км від Катовіце (оформлення у Dąbrowa Górnicza або Katowice)", // 👍 Удакладнілі месца афармлення
    voivodeship: "Сілезське",
    country: "Польща",
    checkInCity: "Dąbrowa Górnicza",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.35 zł/год", // (з жовтня по грудень діє акція 31,40 zł брутто/год) 👍
      studentNetto: "31.40 zł/год",
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Премії за виконання норми від 240 до 1 200 zł брутто. Доплата за власне житло +1,50 zł/год нетто.",
      salaryNotes:
        "Акція: від жовтня до грудня діє ставка 31,40 zł брутто/год! У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12",
      workDaysWeek: "5–6 днів на тиждень (плаваючий вихідний)",
      breakDuration:
        "при 8 год — 20 хв; при 12 год — 40 хв (20 хв + 15-20 хв).", // 👍 Удакладнілі паводле абедзвюх версій
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни по 8-12 годин. Графік формує заклад (вибрати зміну не можна). 8-годинні: 6:00-14:00, 14:00-22:00, 22:00-6:00. 12-годинні: 6:00-18:00, 18:00-6:00, 14:00-2:00.", // 👍 Дадалі канкрэтныя гадзіны змен па арыгінале
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true, // 👍 Паводле тэксту прымаюць пары
      withChildren: false,
      withPets: false,
      costRaw: "510 zł/місяць (із зарплати)",
      details:
        "Квартири або будинки (рідше хостели) з комфортними умовами. Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний транспорт з Katowice, Sosnowiec, Dąbrowa Górnicza, Będzin. Зупинки: Katowice plac Wolności, Katowice NOSPR, Sosnowiec Dworzec PKP, Pogoń Kościół, Gołonóg Manhattan, REDEN, Dąbrowa Górnicza Centrum, Mydlice Szpital, Koszelew, Syberka, Grodziec.", // 👍 Дадалі прыпынкі па тэксце
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1,50 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"], // 👍 Дадалі пары
      ageMax: 55,
      nationalities: [
        "Україна",
        "Білорусь",
        "Молдова",
        "Країни Азії",
        "Колумбія та англомовні",
      ], // 👍 Дадалі па арыгінале
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails:
        "Знання польської мови не вимагається (також беруть англомовних).",

      physicalLoad:
        "Робота на ногах, ходьба по складу. Потрібен хороший зір (можна працювати в окулярах).",
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
      hasSpecificConditions: true, // 👍 Змянілі на true, бо ёсць правілы па адзенні/музыцы
      specificNuances: [
        "Приємна музика на складі",
        "Правила щодо власного одягу та взуття",
      ],
      specificConditionsDetails:
        "На складі грає приємна музика. Можна бути в своїх штанах (чорних, сірих, темно-синіх, джинсах), але обов’язково в шафці мати робочі. На процесах PICK/PACK можна у своєму взутті, на INBOUND/OUTBOUND — обов'язково робоче (але в шафці завжди мати робочі бути).", // 👍 Дадалі па арыгінале
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails:
        "На складі є автомати з перекусами, готовими обідами, солодким та напоями, кавомати.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медогляд: 150 zł (якщо не відпрацюєте 2 місяці). Одяг: 300 zł (якщо не відпрацюєте 2 місяці).", // 👍 Змянілі па тэксце
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Утримання 300 zł із зарплати за одяг та 150 zł за медогляд, якщо не відпрацьовано 2 місяці.",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Оплачуване навчання від 3 до 5 днів. INBOUND — приймання доставок, обробка декларацій; PICK — комплектація замовлень, робота зі сканером; PACK — приготування товару до відправлення, комплектація замовлень за накладною; OUTBOUND — підготовка замовлення до відправлення по країнах.", // 👍 Дадалі пра навучанне
    additionalNotes:
      "Адреса: Akacjowa 6, Psary. Місце оформлення документів: Dąbrowa Górnicza / Katowice.",
  },

  // 7
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "DPD Brwinów - Міжнародна служба експрес-доставки",
    vacancydescription:
      "Міжнародна служба експрес-доставки (поштові склади та посилки)", // 👍 Публічны загаловак для кандыдатаў
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

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) ВСІ КАНДИДАТИ МАЮТЬ ЗАВАНТАЖИТИ Viber.\n" +
        "2) Тільки чоловіки від 18 до 45 років (громадяни України та інші, згідно з документами).\n" +
        "3) Важка фізична праця (посилки від 300 г до 40 кг). Хороша фізична форма.\n" +
        "4) Робочий автобус забирає з вокзалу у Прушкові о 18:15 (важливо прийти заздалегідь, чекати не будуть).\n" +
        "5) Місце оформлення документів: Warszawa.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Brwinów",
    locationDescription: "20 км від Варшави (оформлення у Warszawa)", // 👍 Удакладнілі месца афармлення
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Warszawa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.62 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "200–280", // 👍 Па арыгінальным тэксце
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "+2 zł брутто (1,60 zł нетто) за кожну відпрацьовану годину без пропусків. Доплата за власне житло +1 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Безкоштовний медогляд.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 1,
      hoursPerShift: "10-11", // (Нічні зміни з 18:00 до 05:00 або з 19:00 до 05:00)
      workDaysWeek: "Пн–Пт (5 днів на тиждень)",
      breakDuration: "1 перерва по 30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Нічні зміни з 18:00 до 05:00 (або з 19:00 до 05:00, залежно від виробничих потреб). Пн-Пт.",
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
      nationalities: ["Україна"], // 👍 Залишили як у твоєму коді, хоча зазвичай Аполо бере ширше
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

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
      specificNuances: [
        "Важка фізична праця",
        "Робота у своєму одязі (крім взуття)",
      ], // 👍 Удакладнілі па тэксце
      specificConditionsDetails:
        "Нічні зміни, робота з посилками до 40 кг. Можна працювати у своєму зручному одязі, крім взуття (спеціальне взуття надається роботодавцем).", // 👍 Дадалі па арыгінале
      workwearFree: false,
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
        "Одноразове утримання 240 zł із зарплати за спеціальний одяг та взуття.", // 👍 Трохі змінілі фармулёўку як у тэксце
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Завантаження посилок у вантажівки, що під'їжджають до лінії; Розвантаження вантажівок на лінію; Вага посилок: від 300 грамів до 40 кг.",
    additionalNotes:
      "Адреса: św. Tomasza 4, 05-840 Brwinów. Місце оформлення документів: Warszawa.",
  },

  // 8
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "CCC Polkowice - Склад магазинів CCC та Half Price",
    vacancydescription: "Склад мережі магазинів взуття, рюкзаків та аксесуарів",
    category: "📦 Логістика / Склади одягу та взуття",
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

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) Кандидати: Чоловіки, жінки, пари від 18 до 50 років. Україна, Білорусь, Молдова, Грузія. Також Азія/Африка з англійською мовою B1.\n" +
        "2) Для колишніх працівників CCC при повторному працевлаштуванні потрібно надати: період роботи, яка зміна, хто керівник, яка частина складу, перша сторінка паспорту.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Polkowice",
    locationDescription: "Polkowice (оформлення у Wrocław)", // 👍 Удакладнілі месца афармлення па тэксце
    voivodeship: "Нижньосілезьке",
    country: "Польща",
    checkInCity: "Wrocław",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto: "30.50 zł/год",
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "Доплата за власне житло +1 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн–Пт (іноді суботи залежно ад кількості замовлень)",
      breakDuration: "1 перерва по 20 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "3 зміни по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00. Графік може змінюватись залежно від кількості замовлень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true, // 👍 Па тэксце пазначана, што прымаюць сямейныя пары
      withChildren: false,
      withPets: false,
      costRaw: "20 zł/доба із зарплати (~600 zł/місяць)", // 👍 Удакладнілі форму выліку
      details:
        "Квартири або будинки з хорошими умовами проживання. Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details: "Безкоштовний транспорт з міст Legnica та Lubin.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"], // 👍 Дадалі пары
      ageMax: 50,
      nationalities: [
        "Україна",
        "Білорусь",
        "Молдова",
        "Грузія",
        "Країни Азії/Африки (з англійською B1)",
      ], // 👍 Дадалі па арыгінале
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails:
        "Знання польської мови не вимагається (для кандидатів з Азії/Африкі потрібна англійська B1).", // 👍 Удакладнілі

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
      specificNuances: ["Заборона біжутерії та прикрас"],
      specificConditionsDetails:
        "На складі суворо заборонено носити прикраси та біжутерію (ланцюжки, каблучки, сережки тощо)!",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Медогляд: 150 zł (одноразово знімається з першої зарплати).", // 👍 Медагляд па тэксце заўсёды з першай ЗП
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Робочий одяг (штани, взуття, жилет): 200 zł (одноразово знімається із зарплати).", // 👍 Удакладнілі камплектацыю па тэксце
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Упаковка замовлень та підготовка до відправки (основний процес для жінок та чоловіків); Розвантаження машин із товаром (чоловіків ставлять на цей процес); Прийом та викладка товару; Збирання товару зі сканером.",
    additionalNotes: "Адреса: Polkowice. Місце оформлення документів: Wrocław.",
  },

  // 9
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "ID-LOGISTICS Rakitno - Склад Amazon (товари для дому)",
    vacancydescription:
      "Склад товарів для дому інтернет-магазину (дрібна побутова техніка, речі для кухні та ванни)", // 👍 Удакладнілі паводле арыгінала
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

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) Кандидати: Чоловіки, жінки, пари до 55 років. Громадяни України, Молдови, Білорусі, Колумбії, а також англомовні студенти польських ВНЗ. " +
        "2) Норми роботи реальні, можливість зміни процесу за бажанням. " +
        "3) Робота не вимагає досвіду, є оплачуване навчання (3-5 днів). " +
        "4) На складі зберігаються: дрібна побутова техніка, речі для кухні, спальні і ванни, аксесуари для прибирання.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

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
      hoursRange: "",
      payoutDates: "20 числа за попередній місяць.",
      bonusDetails:
        "Премії до 800 zł брутто за виконання норм. Доплата за власне житло +1,37 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-10-12", // 👍 Дадалі 10 гадзін па арыгінале
      workDaysWeek: "5–6 днів на тиждень (плаваючий вихідний)",
      breakDuration: "1 перерва по 30 хв та 1 перерва по 15 хв.", // 👍 (у сырым тэксце пазначана 1-30 хв та 1-15 хв)
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "По 8-10-12 годин. Зміни: 6:00-14:00, 14:00-22:00, 22:00-6:00 (8 годин), 6:00-18:00, 18:00-6:00, 14:00-02:00 (12 годин). Графік залежить ад аб'ёму заказаў на складзе. Ёсць нічныя змены.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true, // 👍 Па арыгіналу бяруць пары
      withChildren: false,
      withPets: false,
      costRaw:
        "510 zł/місяць (300 zł для студентів до 26 р.). Після 240 відпрацьованих годин: для осіб 26+ років — 310 зл, для студентів до 26 років — 100 зл.", // 👍 Удакладнілі згодна з арыгіналам
      details: "Квартири або будинки. Кімнати на 3-4 особи.",
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
      gender: ["Чоловіки", "Жінки", "Пари"], // 👍 Дадалі пары
      ageMax: 55,
      nationalities: [
        "Україна",
        "Молдова",
        "Білорусь",
        "Колумбія",
        "Англомовні студенти польських ВНЗ",
      ], // 👍 Дадалі новыя нацыянальнасці па тэксце
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails:
        "Знання польської мови не вимагається (також беруть англомовних студентів).",

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
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails:
        "На складі є столова, автомати з бутербродами, безкоштовні фрукти.", // 👍 Дадалі па арыгінале
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Одяг (штани, кофта, футболка, взуття): 250 zł (одноразово утримується з першої зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Медогляд: 190 zł (утримується, якщо не відпрацьовано 2 місяці).", // 👍 Выправілі назву па тэксце (там напісана "Медогляд")
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Прийом та викладка товару; Збір товару зі сканером; Пакування замовлень і підготовка до відправки; Робота не вимагає досвіду — є оплачуване навчання (3–5 днів). Товари вагою від 5 до 30 кг.",
    additionalNotes:
      "Адреса: ul. Nowa Niedrzwica 58, Rakitno. Норми роботи реальні. Можливість зміни процесу за бажанням.",
  },

  // 10
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName: "Цукерки Nysa - Виробництво цукерок",
    vacancydescription:
      "Виробництво цукерок (желейних, маршмелоу, фармацевтичних)", // 👍 Дакладна па тэксце
    category:
      "⚙️ Виробництво і прамысловасть / Харчова промисловість і кондитерські вироби",
    keywords: [
      "Цукерки",
      "Nysa",
      "Ниса",
      "Wrocław",
      "Вроцлав",
      "желейні",
      "маршмелоу",
      "кондитерські",
      "фармацевтичних",
      "Nowowiejska",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) Тільки власне житло (компенсація не передбачена, доїзд за власний рахунок). " +
        "2) Обов'язкова комунікативна польська мова. " +
        "3) Потрібна санепід книжка (якщо немає — за власний кошт ≈160 зл). " +
        "4) Без вікових обмежень. Стабільний графік, комфортні умови. " +
        "5) Дату, час підписання документів і медогляду повідомляє координатор.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Nysa",
    locationDescription: "60 км від Ополе",
    voivodeship: "Опольське",
    country: "Польща",
    checkInCity: "Nysa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "30.50 zł брутто/год",
      studentNetto: "",
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails: "Карта Multisport та медичний пакет LuxMed.", // 👍 Дадалі па тэксце
      salaryNotes:
        "Можливе продовження документів (карти побиту). У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "4 дні роботи — 2 дні вихідних (4-бригадова система)",
      breakDuration:
        "Визначається індивідуально (машини не зупиняються, вихід по одному)", // 👍 Удакладнілі
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота в 4-бригадовій системі, у дві зміни по 12 годин: 06:00–18:00, 18:00–06:00. Протягом зміни перерви узгоджуються з керівником. Машини не зупиняються, тому на перерву працівники виходять по одному.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Тільки власне житло",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "Власне житло (компенсація не передбачена)",
      details: "Житло агентство не надає.",
    },
    transport: {
      provided: false,
      costRaw: "За власний рахунок",
      details: "Доїзд до роботи громадським транспортом за власний рахунок.",
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
        "Потрібна санітарна книжка (санепід). Якщо немає — виготовлення власним коштом (≈160 zł).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "А2",
      languageDetails: "Комунікативна польська мова.",

      physicalLoad: "Тип роботи: стояча, ротація між подібними позиціями.", // 👍 Дадалі "ротацыю"
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
        "Температура в цеху близько 20°C. ЗАБОРОНЕНО вносити особисті речі на виробництво (прикраси: ланцюжки, каблучки, сережки тощо). Заборонені штучні нігті, гібридні або гелеві покриття, а також штучні вії. Усі речі залишаються в шафках, які працівник отримує у перший день разом із робочим одягом. Діють окремі роздягальні — чиста та брудна зона.", // 👍 Максімальна поўна
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
      "Прості виробничі процеси: сортування, пакування та перебір солодощів; Підготовка етикеток; Прибирання робочого місця; Дотримання санітарних та виробничих норм.",
    additionalNotes: "Адреса: Nowowiejska 22, Nysa 48-303.",
  },

  // 11
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName:
      "ID-LOGISTICS Tarnowo Podgórne - Склад брендових товарів та одягу",
    vacancydescription: "Склад брендових товарів, одягу та аксесуарів", // 👍 Чысты загаловак для кандыдатаў
    category: "📦 Логістика / Склади одягу та взуття",
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

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "1) Тільки жінки та пари (вік від 18 до 40 або 45 років, у різних версіях тексту). Громадяни України, Білорусі. " +
        "2) Щодня працівник отримує графік на наступний день. Вибирати години та зміни не можна. " +
        "3) У перший день розподіляють по процесах (не тільки PICK/PACK, можуть бути інші завдання). " +
        "4) Відразу визначають зміну (день або ніч). Перевестися неможливо. " +
        "5) Автобус Poznań (Rondo Rataje, Zwierzyniecka, Bukowska, Ogrody, Dabrowskiego).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

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
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць.", // 👍 Удакладнілі паводле ўкраінскага тэксту
      bonusDetails:
        "Премії до 1 000 zł брутто за виконання норм. Доплата за власне житло +1 zł/год нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "12",
      workDaysWeek: "6 робочих днів, 1 вихідний (або за замовленнями)",
      breakDuration: "Визначається внутрішнім розпорядком складу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни по 8-12 годин. Кожного дня працівник отримує графік на наступний день. Наразі 2 зміни по 12 годин: 07:00-19:00, 19:00-07:00. При спаді роботи у 3 зміни по 8 годин: 07:00-15:00, 15:00-23:00, 23:00-07:00. Зміни формує заклад (вибирати години не можна).", // 👍 Дадалі падрабязнасці
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true, // 👍 Па тэксце пазначана, што бяруць пары
      withChildren: false,
      withPets: false,
      costRaw: "500 zł/місяць (із зарплати)",
      details:
        "Квартири, будинки (іноді хостели) з комфортними умовами. Кімнати на 3-4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний транспорт з Познані. Зупинки: Rondo Rataje (BP) 6:00, Zwierzyniecka (Merkury) 6:10, Bukowska (Szylinga) 6:10, Ogrody 6:17, Dabrowskiego (Avia) 6:25.", // 👍 Унеслі ўсе прыпынкі
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год нетто.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Жінки", "Пари"], // 👍 Тэматычна ўказана "Жінки та пари"
      ageMax: 45, // 👍 (у расійскім варыянце тэксту 40, ва ўкраінскім 45. Лепш пакінуць 45 або запісаць мяжу)
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad: "Робота на ногах. У своєму одязі працювати не можна.",
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
      specificNuances: ["Заборона власного одягу"], // 👍 Па тэксце
      specificConditionsDetails: "У своєму одязі працювати не можна.",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Робочий одяг (футболка, штани, взуття, фліска, жилетка): 300 зл (одноразово вираховується із зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details: "Медогляд: 150 зл (утримується, якщо не відпрацювати 2 місяці).",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "PICK: комплектація замовлень, робота зі сканером, розміщення товарів по складу; PACK: приготування товару до відправлення, пакування згідно зі стандартами; Прийом нового товару.",
    additionalNotes: "Адреса: Sowia 31, Tarnowo Podgórne.",
  },

  // 12
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "APOLO",
    templateName:
      "STOKROTKA Teresin - Склад супермаркету (комплектація замовлень)",
    vacancydescription:
      "Склад супермаркету. Комплектація замовлень (продукти харчування, побутова хімія)", // 👍 Публічны загаловак для кандыдатаў
    category: "📦 Логістика / Склади супермаркетів та продуктів харчування",
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

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "💰 ЯК РАХУЄТЬСЯ АКОРД НА СТОКРОТЦІ?\n" +
        "Залежно від кількості пунктів на день вважається поріг (не коробки чи пачки, а ПУНКТИ ЗА ПАЛЕТУ). " +
        "Наприклад: 1 палета, де різний товар (йогурт, вода, яблука). Зібрати, застрейчити і поставити під буфер — 20-30 хв і близько 10 пунктів. " +
        "Якщо в замовленні 10 однакових ящиків води — це 5 хв і 4-5 пунктів. Чим різноманітніший товар на палеті, тим більше пунктів. Працівники не обирають товар чи залу, кожному приходить комісія, розподілена складом. Досвідчені роблять 4-5 поріг, початківці +- 2-3 поріг.\n\n" +
        "📋 ІНШЕ:\n" +
        "- Потрібен сертифікат (wózki unoszące) або навички використання для його отримання.\n" +
        "- Адаптація: якщо людина приходить 20 числа, до кінця місяця має погодинну ставку, а з 1-го числа наступного місяця — акорд.\n" +
        "- Кандидати: чоловіки, жінки, 18-55 років (Україна, Молдова, Білорусь).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Teresin",
    locationDescription: "54 км від Варшави",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Teresin",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26.73 zł/год", // (33.10 zł брутто)
      studentNetto: "31.60 zł/год",
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Акордна система оплати (залежить від виробітку): 1 поріг — 26,73 zł (33.10 брутто); 2 поріг — 28,26 zł (35 брутто); 3 поріг — 30,12 zł (37.30 брутто); 4 поріг — 28,89 zł (40 брутто); 5 поріг — 35,65 zł (44.15 брутто) нетто. Доплата за власне житло +1 zł/год нетто. Доплата за власний транспорт +1 zł/год нетто.",
      salaryNotes:
        "Адаптація: до кінця першого місяця — погодинна ставка (якщо прийшов у кінці місяця), з першого числа наступного місяця — акорд. У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
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
        "3 зміни по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00 (у подальшому можна працювати по 12 годин). Графік може змінюватись відповідно до виробничих потреб і надсилається на тиждень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "19 zł/доба (із зарплати)",
      details:
        "Квартири або будинки з комфортними умовами проживання. Кімнати на 3–4 особи.",
    },
    transport: {
      provided: false,
      costRaw: "Власний транспорт (+1 zł/год нетто доплата)",
      details:
        "Власний транспорт. Доплата +1 zł нетто до погодинної ставки за використання свого авто.",
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
      needsAdditionalDocs: true, // Потрібен сертифікат wózki unoszące
      additionalDocsDetails:
        "Сертифікат wózki unoszące (або навички використання для його отримання).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "А2",
      languageDetails:
        "Комунікативний рівень польської мови (для розуміння голосових систем system voice).",

      physicalLoad:
        "Хороший зір. Збирання товару зі сканером / system voice на електровізку та мануально.",
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
      specificNuances: ["Холод"],
      specificConditionsDetails:
        "Робота у відділах: сухий, холодний, м'ясний, молочний. Протягом зміни працівник може змінювати відділ залежно від кількості роботи.",
      workwearFree: false, // Утримання одягу та медогляду, якщо не відпрацьовано 3 місяці
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Одноразове утримання 150 zł із зарплати за ліцензію на електровузик.",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Утримання 500 zł із зарплати за одяг та медогляд, якщо не відпрацьовано 3 місяці.",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Робота на складі на комплектації замовлень; Збирання товару зі сканером / system voice на електровізку та вручну; Упаковка замовлень та підготовка до відправки; Після заповнення контейнера працівник відвозить товар у відповідний відділ і бере новий контейнер.",
    additionalNotes:
      "Адреса: Lazurowa 2, 96-515 Teresin. На складі зберігаються продукти харчування, напої, побутова хімія, засоби гігієни.",
  },
];

module.exports = apoloTemplates;
