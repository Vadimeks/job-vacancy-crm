// backend/data/templates/apolo.js
const apoloTemplates = [
  // Вакансія №1 - VIRTU Zawiercie
  {
    agencyName: "OTTO",
    templateName: "VIRTU Zawiercie - Виробництво готових обідів",
    vacancydescription:
      "Робота на виробництві готових страв та напівфабрикатів (піца, крокети, вареники, пасти): контроль якості, пакування, обслуговування машин.",
    category: "⚙️ Виробництво і промисловість / Харчова промисловість",
    keywords: [
      "VIRTU",
      "Zawiercie",
      "готові обіди",
      "піца",
      "крокети",
      "вареники",
      "паста",
      "виробництво",
      "пакування",
    ],
    contractType: "Umowa zlecenie",
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Zawiercie",
    locationDescription:
      "Łośnicka 35 або Technologiczna 6, 42-400 Zawiercie (48 км від Katowice)",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Katowice",
    salary: {
      baseNetto: "24.71 PLN/год нетто",
      studentNetto: "30.60 PLN/год нетто",
      hoursRange: "230 - 290 робочих годин на місяць",
      payoutDates: "20 - 22 числа за попередній місяць",
      bonusDetails:
        "Доплата за своє житло +1 PLN/год. Для чоловіків +1 PLN до ставки після відпрацювання 180 годин.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "7",
      breakDuration: "2*20 хв",
      canChooseShiftOnStart: true,
      shiftChoiceDetails: "Можна вибрати теплий або холодний цех.",
      description:
        "ПН - ВС, плаваючий вихідний. I зміна: 06:00 - 18:00, ІІ зміна: 18:00 - 06:00. Перерви: 2*20 хв (в російській версії 2*15 хв).",
    },
    accommodation: {
      type: "Надається",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "600 PLN/міс",
      details:
        "600 PLN із зарплати (20 PLN/доба). При відпрацюванні 250 годин - 450 PLN, при відпрацюванні 280 годин житло безкоштовно (щомісяця). Для студентів 25 PLN/доба, при відпрацюванні 250 годин - 600 PLN, при відпрацюванні 280 годин житло безкоштовно. Будинки та квартири з хорошими умовами, по 3-4 особи в кімнаті.",
    },
    transport: {
      provided: false,
      costRaw: "Безкоштовно",
      details:
        "Пішки або громадським транспортом. Громадський транспорт містом безкоштовний.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Продукція на підприємстві безкоштовна для працівників щодня. Також продукція підприємства доступна зі знижкою (піци, паста, вареники, галушки, млинці, лазіння, крокети, запіканки).",
    },
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
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails:
        "Для Азербайджану, Таджикистану, Киргизстану, Казахстану та студентів - тільки зі знанням російської мови.",
      physicalLoad:
        "Середня (вага повної коробки близько 10 кг, робота стоячи)",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: [
        "Температурні режими в цехах",
        "заборони на підприємстві",
      ],
      specificConditionsDetails:
        "Робота стоячи, в цехах: пекарня (+20°C), налисники (+30°C), упаковка (+5°C). На підприємстві заборонено ходити з розпущеним волоссям та носити будь-які прикраси.",
      workwearFree: true,
      foodType: "Безкоштовне/Зі знижкою",
      foodDetails:
        "Продукція на підприємстві безкоштовна для працівників щодня. Також продукція підприємства доступна зі знижкою (піци, паста, вареники, галушки, млинці, лазіння, крокети, запіканки).",
    },
    startExpenses: {
      hasStartExpenses: true,
      details:
        "150 PLN - медогляд із першої зарплати. 150 PLN - санепід із першої зарплати.",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "300 PLN за спецодяг та взуття, якщо при звільненні не повертаєте.",
    },
    description:
      "Контроль якості продукції, поповнення запасів сировини, заміна пакувальної плівки/етикеток, обслуговування машин, прибирання робочого місця. Виготовлення, упаковка, фасування, сортування, зважування продукції. Контроль якості упаковки та стікерування виробів. Підготовка продукції до відправки (викладення на палети, палетування).",
    additionalNotes:
      "Virtu - польська компанія, заснована в 1992 році, що спеціалізується на виробництві готових страв та напівфабрикатів.",
  },
  // Вакансія №2 - CARFI Siedlce
  {
    agencyName: "OTTO",
    templateName: "CARFI Siedlce - Виробництво пластикових деталей",
    vacancydescription:
      "Робота на виробничій лінії з монтажу, з'єднання, пакування пластикових деталей та обслуговування простих машин.",
    category:
      "⚙️ Виробництво і промисловість / Виробництво гумових та пластмасових виробів",
    keywords: [
      "CARFI",
      "Siedlce",
      "пластикові деталі",
      "садівництво",
      "промисловість",
      "медицина",
      "автогалузь",
      "виробництво",
      "монтаж",
      "пакування",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Siedlce",
    locationDescription: "Berdyczowska 9, 08-110 Siedlce",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Warszawa",
    salary: {
      baseNetto: "24.63 PLN/год нетто",
      studentNetto: "30.50 PLN/год нетто",
      hoursRange: "",
      payoutDates: "20–22 числа за попередній місяць",
      bonusDetails: "Доплата 1 PLN/год нетто при проживанні на власному житлі.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "5-6",
      breakDuration: "30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "ПН–ПТ (СБ — на продукції). Продукція: 06:00–14:00, 14:00–22:00, 22:00–06:00. Монтаж: 06:00–14:00, 14:00–22:00. Надгодини можливі при збільшенні замовлень. Перерва: 30 хв.",
    },
    accommodation: {
      type: "Надається",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "22 PLN/доба",
      details: "22 PLN/доба (вираховується із зарплати). Кімнати на 3–4 особи.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Самостійний доїзд.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Молдова", "Білорусь", "Грузія", "Англомовні"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Комунікативне знання польської мови.",
      physicalLoad:
        "Мінімальна (робота більше мануальна, ніж ходьба, темп помірний)",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details:
        "170 PLN — медогляд (разово із зарплати). 97 PLN/міс — страхування (тільки для осіб до 26 років зі статусом студента).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details: "220 PLN — робочий одяг (разово із зарплати).",
    },
    description:
      "Робота на виробничій лінії (темп помірний). Контроль якості готової продукції. Монтаж та з’єднання пластикових деталей. Упаковування виробів. Обслуговування простих виробничих машин. Дотримання інструкцій техніки безпеки.",
    additionalNotes:
      "Carfi — виробництво пластикових деталей для садівництва, промисловості, медицини та автогалузі. Досвід не потрібен — усьому навчають на місці. Приємна музика на складі.",
  },
  // Вакансія №3 - RENUS Swarzędz
  {
    agencyName: "OTTO",
    templateName:
      "RENUS Swarzędz - Логістичний склад брендового одягу та аксесуарів",
    vacancydescription:
      "Робота на логістичному складі брендового одягу та аксесуарів: приймання, комплектація, сортування, пакування та підготовка до відправлення.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "Rhenus Logistics",
      "Swarzędz",
      "Poznań",
      "логістичний склад",
      "одяг",
      "аксесуари",
      "комплектація",
      "сортування",
      "пакування",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes:
        "ПЕРЕВІРИТИ ДОЇЗДИ ДО Rondo Śródka. НА 1 ЗМІНУ АВТОБУС ЇДЕ О 5:00. СТОСУЄТЬСЯ КАНДИДАТІВ НА ВЛАСНОСНОМУ ЖИТЛІ!!",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Swarzędz",
    locationDescription: "Rabowicka 67, Swarzędz (13 км від Poznań)",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    salary: {
      baseNetto: "25.60 PLN/год нетто",
      studentNetto: "30.50 PLN/год нетто",
      hoursRange: "210-270 годин на місяць",
      payoutDates: "20 - 22 числа за попередній пропрацьований місяць",
      bonusDetails:
        "Доплата за власне житло +1 PLN/год нетто. Склад може нараховувати додаткові премії за відвідуваність без пропусків, а також за активну участь у сезоні розпродажів – за внутрішнім рішенням компанії. Преміальна ставка за виконання норм: 1 рівень: 26.40 зл нетто (студенти 31.50 зл нетто), 2 рівень: 27.20 зл нетто (студенти 32.50 зл нетто), 3 рівень: 28.00 зл нетто (студенти 33.50 зл нетто).",
      salaryNotes:
        "Після зароблених 30 000 зл брутто: 1 рівень: 22.75 зл нетто, 2 рівень: 23.48 зл нетто, 3 рівень: 24.20 зл нетто.",
    },
    schedule: {
      shiftsCount: 4,
      hoursPerShift: "8 або 12",
      workDaysWeek: "5-7",
      breakDuration: "2*15 хв (8-годинні зміни), 3*15 хв (12-годинні зміни)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails:
        "Графік встановлює заклад. У низький сезон може бути робота по 8 годин, стандартний графік 12 годин.",
      description:
        "Зміни по 12 годин: D (06:00-18:00), P (10:00-22:00), S (14:00-02:00), N (18:00-06:00), R (08:00-20:00), Z (20:00-08:00). Зміни по 8 годин: I (06:00-14:00), II (14:00-22:00), III (22:00-06:00), IV (18:00-02:00). Можливість додатково брати 3 вихідних, окрім тих, що є в графіку (не надаються тільки під час розпродажу).",
    },
    accommodation: {
      type: "Надається",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "17 PLN/доба",
      details: "17 PLN/доба (вираховується з зарплати). Кімнати на 3–4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний транспорт з Poznań (Rondo Śródka) і зі Swarzędz (зупинки Lidl, Netto - DOZ Apteka dbam o zdrowie).",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 53,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Середня",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details:
        "97 PLN кожен місяць (для осіб до 26 років зі статусом студента).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "70 PLN одноразово із зарплати за 2 робочі футболки. 100 PLN одноразово із зарплати за теплий полар. 100 PLN одноразово із зарплати за спеціальне взуття (якщо не відпрацювати 1 місяць).",
    },
    description:
      "INBOUND: приймання доставок, обробка декларацій. PICK: комплектація замовлень, робота зі сканером, упаковка та розміщення товарів на складі. SORT: сортування товарів за замовленнями клієнтів. PACK: приготування товару до відправлення, комплектація за накладною, зняття магнітних кліпс з одягу. OUTBOUND: підготовка замовлень до відправлення.",
    additionalNotes:
      "Rhenus Logistics - логістичний склад брендового одягу та аксесуари. Відео зі складу: https://www.youtube.com/watch?v=iDDfdDvJsRQ.",
  },
  // Вакансія №4 - RENUS Błonie
  {
    agencyName: "OTTO",
    templateName: "RENUS Błonie - Склад інтернет-магазину Lidl",
    vacancydescription:
      "Робота на складі інтернет-магазину Lidl: комплектація замовлень, підготовка до відправлення, обробка повернень та сортування товару.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "Rhenus Logistics",
      "Błonie",
      "Warszawa",
      "Lidl",
      "склад",
      "одяг",
      "текстиль",
      "аксесуари",
      "побутова техніка",
      "комплектація",
      "сортування",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes:
        "ВСІ КАНДИДАТИ МАЮТЬ ЗАВАНТАЖИТИ Viber. Перед підписанням умови, кандидат, має пройти онбордінг і отримати сертифікат: реєстрація людини в пф (прописуємо мейл і номер телефону), координатор надасть доступ і потім ми це передаємо людям.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Błonie",
    locationDescription: "ul. Batorego 6 Pass (45 км від Warszawa)",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Warszawa",
    salary: {
      baseNetto: "25.50 PLN/год нетто",
      studentNetto: "30.50 PLN/год нетто",
      hoursRange: "210 - 270 годин на місяць",
      payoutDates: "20 - 22 числа за попередній пропрацьований місяць",
      bonusDetails:
        "700 PLN брутто сезонна премія. Премії за виконання норм: 1 поріг - 1.25 PLN/год нетто, 2 поріг - 2.50 PLN/год нетто.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8, 10 або 12",
      workDaysWeek: "5-7",
      breakDuration: "30 хв (якщо 12 годин + 15 хв)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни по 8 годин: 06:00 - 14:15, 14:15 - 22:15. Зміни по 10 годин: 06:00 - 16:15, 12:15 - 22:15. Зміни по 12 годин: 06:00 - 18:15, 10:15 - 22:15. Без нічних змін. Вихідні: субота - неділя (під час Black Friday можуть бути робочі субота або неділя).",
    },
    accommodation: {
      type: "Надається",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "20 PLN/доба",
      details:
        "20 PLN/доба. Квартири або будинки з дуже хорошими умовами проживання. Кімнати 3-4х місні. Доплата за своє житло +1.00 PLN/год нетто.",
    },
    transport: {
      provided: false,
      costRaw: "200 PLN",
      details: "200 PLN із зарплати. Зупинка Błonie Okrzei.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Базовий",
      languageDetails: "Польська мова на базовому рівні.",
      physicalLoad: "Середня",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details: "160 PLN - взуття, одяг одноразово із зарплати.",
    },
    description:
      "Комплектація замовлень - працівники їздять по складу на візках зі сканером, завантажують товар згідно зі списком на візок і відвозять на відповідну полицю. Відправлення - робота на лінії, підготовка товару до відправлення, перевірка коробок на лінії (чи сходиться товар), пакування товару. Повернення товару - робота зі сканером, перевірка коробок (чи все сходиться, чи є пошкодження), передача товару на наступну позицію (розкладання товару). Розміщення і сортування товару - працівник розвозить товар з повернення по складу на відповідні місця зберігання.",
    additionalNotes:
      "Даний Rhenus Logistics зберігає товари інтернет-магазину Lidl, такі як одяг, текстиль, аксесуари для дому та дрібна побутова техніка.",
  },
  // Вакансія №5 - NOTINO Głuchów
  {
    agencyName: "OTTO",
    templateName: "NOTINO Głuchów - Склад косметики та засобів гігієни",
    vacancydescription:
      "Робота на складі косметики та засобів гігієни NOTINO: комплектація замовлень зі сканером, прийом та пакування товару.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "NOTINO",
      "Głuchów",
      "Łódź",
      "склад",
      "косметика",
      "засоби гігієни",
      "комплектація",
      "пакування",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Głuchów",
    locationDescription: "Inwestycyjna 2, 95-080 Głuchów",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "24.63 PLN/год нетто",
      studentNetto: "30.50 PLN/год нетто",
      hoursRange: "",
      payoutDates: "20 - 22 числа за попередній пропрацьований місяць",
      bonusDetails:
        "Можливі премії від 200 PLN до 500 PLN на місяць. +1 PLN/год нетто доплата за власне житло.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8 (в сезон 12)",
      workDaysWeek: "5-7",
      breakDuration: "30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни по 8 годин: 06:00–14:15, 14:15–22:30. В період сезону зміни по 12 годин. Вихідні плаваючі. В період піку сезону можливі нічні зміни. Перерва: 30 хвилин.",
    },
    accommodation: {
      type: "Надається",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "20 PLN/доба",
      details: "20 PLN/доба вираховується із зарплати. Кімнати на 3 - 4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "150 PLN/місяць",
      details:
        "Доїзд з Piotrków Trybunalski - 150 PLN/місяць. Доїзд з Łódź - 150 PLN/місяць.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 50,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Середня",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: [
        "Заборона на біжутерію та прикраси",
        "штани без кишень",
      ],
      specificConditionsDetails:
        "На складі не можна носити біжутерію та прикраси. Обов’язково треба мати штани без кишень.",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details: "150 PLN - медогляд (одноразово з зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details: "Футболка та взуття - 150 PLN, якщо не відпрацювати 1 місяць.",
    },
    description:
      "Комплектація замовлень зі сканером. Прийом товару на склад. Пакування товару - робота на лінії.",
    additionalNotes:
      "На складі NOTINO зберігаються товари: косметика та засоби гігієни.",
  },
  // Вакансія №6 - IDL Psary
  {
    agencyName: "OTTO",
    templateName:
      "IDL Psary - Логістичний склад брендового одягу та аксесуарів",
    vacancydescription:
      "Робота на логістичному складі брендового одягу та аксесуарів: приймання, комплектація, пакування та підготовка до відправлення.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "ID-LOGISTICS",
      "Psary",
      "Katowice",
      "логістичний склад",
      "одяг",
      "аксесуари",
      "комплектація",
      "пакування",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes:
        "Не беремо Нігерію, Камерун, Бангладеш, Грузію. Потрібно в ПФ прописувати коментар де працювала людина, скільки часу, на яких процесах.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Psary",
    locationDescription: "Akacjowa 6, Psary (15 км від Katowice)",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Dąbrowa Górnicza",
    salary: {
      baseNetto:
        "25.35 PLN/год нетто (акційна ставка 31,40 PLN брутто/год з жовтня по грудень)",
      studentNetto: "31.40 PLN/год нетто",
      hoursRange: "",
      payoutDates: "20 - 22 числа за попередній пропрацьований місяць",
      bonusDetails:
        "Премії за виконання норми від 240 PLN брутто до 1200 PLN брутто.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8 - 12",
      workDaysWeek: "5 - 6",
      breakDuration: "20 хв (8 годин), 20 хв + 15 хв (12 годин)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails:
        "Зміни по 8 - 12 годин (вибирати зміну та к-сть годин не можна, графік формує заклад). Зміни можуть починатись з 06:00, 10:00, 12:00, 14:00, 18:00, 20:00, 22:00. Плаваючий вихідний.",
      description:
        "5 - 6 днів на тиждень. Зміни по 8 - 12 годин. Перерви: 8 годин роботи - 20 хв, 12 годин роботи - 20 хв, 15 хв.",
    },
    accommodation: {
      type: "Надається",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "510 PLN/місяць",
      details:
        "510 PLN/місяць із зарплати. Квартири або будинки з комфортними умовами. Кімнати на 3 - 4 особи. Доплата за своє житло +1.50 PLN/год нетто.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Безкоштовний з Katowice, Sosnowiec, Dąbrowa Górnicza, Będzin.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Є автомати з перекусами, готовими обідами, солодким та напоями, також кавомати.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: [
        "Україна",
        "Білорусь",
        "Молдова",
        "Азія",
        "Колумбія",
        "Англомовні",
      ],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Середня",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Вимоги до взуття"],
      specificConditionsDetails:
        "Можна бути в своїх штанах (чорних, сірих, темно-синіх, джинсах) але обов’язково в шафці мати робочі. На процесах PICK/PACK можна працювати в своєму взутті, але обов’язково в шафці мати робочі бути, на процесі IN&OUT — обов’язково в робочих бутах.",
      workwearFree: false,
      foodType: "Власне",
      foodDetails:
        "Є автомати з перекусами, готовими обідами, солодким та напоями, також кавомати.",
    },
    startExpenses: {
      hasStartExpenses: true,
      details:
        "150 PLN - медогляд (якщо не відпрацюєте 2 місяці). 97 PLN - медичне страхування для студентів до 26 років (якщо немає власного страхування).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details: "300 PLN - одяг (якщо не відпрацюєте 2 місяці).",
    },
    description:
      "INBOUND — приймання доставок, обробка декларацій. PICK — комплектація замовлень, робота зі сканером, розміщення товарів по складу. PACK — приготування товару до відправлення, комплектація замовлень за накладною. OUTBOUND — підготовка замовлень клієнтів до відправлення по країнах замовників. Оплачуване навчання (3-5 днів).",
    additionalNotes:
      "На даному складі ID-LOGISTICS зберігаються брендовий одяг та аксесуари. Грає приємна музика на складі. КОНТАКТ З КООРДИНАТОРАМИ ВИКЛЮЧНО У VIBER. Якщо у вас є досвід роботи на складі в одній із нижчеперелічених галузей то прописуйте це відразу (pick, pack, inbound, outbound): Одяг і взуття, Електроніка та побутова техніка, Меблі та предмети інтер’єру, Продукти харчування та напої, Автозапчастини. Хороший зір (робота в окулярах дозволена).",
  },
  // Вакансія №7 - DPD Brwinow
  {
    agencyName: "OTTO",
    templateName: "DPD Brwinow - Міжнародна служба експрес-доставки",
    vacancydescription:
      "Робота на складі міжнародної служби експрес-доставки DPD: завантаження/розвантаження посилок.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "DPD",
      "Brwinów",
      "Warszawa",
      "експрес-доставка",
      "логістика",
      "посилки",
      "завантаження",
      "розвантаження",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes: "ВСІ КАНДИДАТИ МАЮТЬ ЗАВАНТАЖИТИ Viber",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Brwinów",
    locationDescription: "św. Tomasza 4, 05-840 Brwinów (20 км від Warszawa)",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Warszawa",
    salary: {
      baseNetto: "24.62 PLN/год нетто",
      studentNetto: "30.50 PLN/год нетто",
      hoursRange: "200–280 годин на місяць",
      payoutDates: "20 - 22 числа за попередній пропрацьований місяць",
      bonusDetails:
        "+ премія 2 PLN брутто (1.60 PLN нетто) за кожну відпрацьовану годину без пропусків.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 1,
      hoursPerShift: "11",
      workDaysWeek: "5",
      breakDuration: "30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни з 18:00 до 05:00 (або з 19:00 до 05:00, залежно від виробничих потреб). Понеділок–п’ятниця (5 днів на тиждень). Перерви: 1×30 хвилин.",
    },
    accommodation: {
      type: "Надається",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "23 PLN/доба",
      details:
        "23 PLN/доба (вираховується із зарплати). Квартири або будинки з хорошими умовами. Кімнати на 3–4 особи. Доплата за власне житло: +1.00 PLN/год нетто.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Робочий автобус DPD забирає з вокзалу у Pruszkówie о 18:15 (важливо прийти заздалегідь, чекати не будуть) і привозить назад туди ж.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Безкоштовні обіди. Безкоштовний медогляд.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 45,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Висока (вага посилок: від 300 грамів до 40 кг)",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: false,
      foodType: "Обіди",
      foodDetails: "Безкоштовні обіди.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "240 PLN за спеціальний одяг і взуття (одноразово вираховується із зарплати).",
    },
    description:
      "Завантаження посилок у вантажівки, що під’їжджають до лінії. Розвантаження вантажівок на лінію. Вага посилок: від 300 грамів до 40 кг.",
    additionalNotes:
      "DPD - міжнародна служба експрес-доставки. Можна працювати у своєму зручному одязі, крім взуття (спеціальне взуття надається роботодавцем). Відео з роботи: https://www.youtube.com/watch?v=oJ63Sen8WiQ.",
  },
  // Вакансія №8 - ССС Polkowice
  {
    agencyName: "OTTO",
    templateName: "CCC Polkowice - Склад взуття та аксесуарів",
    vacancydescription:
      "Робота на складі CCC та Half Price у Polkowice: пакування, розвантаження, прийом, викладення та збирання товару зі сканером.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "CCC",
      "Polkowice",
      "Half Price",
      "склад",
      "взуття",
      "аксесуари",
      "рюкзаки",
      "пакування",
      "логістика",
      "сканер",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes:
        "Якщо старі працівники на запит потрібна наступна інфо: період роботи, яка зміна - хто керівник, яка частина складу, перша стр паспорту",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Polkowice",
    locationDescription: "",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "Wrocław",
    salary: {
      baseNetto: "24,63 PLN/год нетто",
      studentNetto: "30,50 PLN/год нетто",
      hoursRange: "",
      payoutDates: "20–22 числа за попередній пропрацьований місяць",
      bonusDetails: "+1 PLN нетто за своє житло",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "5-6",
      breakDuration: "20 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Пн–Пт (06:00–14:00, 14:00–22:00, 22:00–06:00). Іноді робочі суботи (графік може змінюватись, залежно від кількості замовлень). Перерви: 1*20 хв.",
    },
    accommodation: {
      type: "Надається",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "20 PLN/доба",
      details:
        "20 PLN/доба із зарплати. Квартири або будинки з добрими умовами проживання. Кімнати 3–4-місні.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Надаємо безкоштовний транспорт з Legnica, Lubin.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 50,
      nationalities: [
        "Україна",
        "Білорусь",
        "Молдова",
        "Грузія",
        "Азія/Африка з англійським рівнем B1",
      ],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Середня (розвантаження машин для чоловіків)",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Заборона на прикраси та біжутерію"],
      specificConditionsDetails:
        "На складі заборонено носити прикраси та біжутерію.",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details: "150 PLN – медичний огляд, одноразово із зарплати.",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details: "200 PLN – одяг (штани, взуття, жилет), одноразово із зарплати.",
    },
    description:
      "Упаковка замовлень та підготовка до відправки (основний процес для дівчат та чоловіків). Розвантаження машин із товаром (чоловіків ставлять на цей процес). Прийом, викладення товару. Збирання товару зі сканером.",
    additionalNotes:
      "На складі знаходяться товари для магазинів CCC та Half Price, такі як взуття, аксесуари для взуття та рюкзаки.",
  },
  // Вакансія №9 - IDL Rakitno
  {
    agencyName: "OTTO",
    templateName: "IDL Rakitno - Товари для дому інтернет-магазину Амазон",
    vacancydescription:
      "Робота на складі ID Logistics з товарами для дому інтернет-магазину Амазон: прийом, викладка, збір та пакування замовлень.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "ID Logistics",
      "Rakitno",
      "Gorzów Wielkopolski",
      "Амазон",
      "товари для дому",
      "склад",
      "логістика",
      "пакування",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Rakitno",
    locationDescription: "ul. Nowa Niedrzwica 58 (околиці Gorzów Wielkopolski)",
    voivodeship: "Lubuskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "24.63 PLN нетто/год",
      studentNetto: "30.50 PLN нетто/год",
      hoursRange: "",
      payoutDates:
        "20 числа кожного наступного місяця за попередній відпрацьований",
      bonusDetails:
        "Доплата за власне житло +1.37 PLN/год. Премії до 800 PLN/брутто за виконання норм.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12",
      workDaysWeek: "5-6",
      breakDuration: "1-30 хв та 1-15 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "Графік залежить від обсягу замовлень на складі.",
      description:
        "5-6 днів на тиждень по 8-10-12 годин. Зміни: 06:00-14:00, 14:00-22:00, 22:00-06:00 (8 годин), 06:00-18:00, 18:00-06:00, 14:00-02:00 (12 годин). Є нічні зміни. Перерви: 1-30 хв та 1-15 хв.",
    },
    accommodation: {
      type: "Надається",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "510 PLN/місяць",
      details:
        "510 PLN/місяць (300 PLN для студентів до 26 років). Квартири або будинки. Кімнати на 3-4 особи. Після 240 відпрацьованих годин: для осіб 26+ років — 310 PLN, для студентів до 26 років — 100 PLN.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Безкоштовно з Gorzów Wielkopolski.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "На складі є столова, автомати з бутербродами, безкоштовні фрукти.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: [
        "Україна",
        "Молдова",
        "Білорусь",
        "Колумбія",
        "Англомовні студенти польських ВНЗ",
      ],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Середня (товари вагою від 5 до 30 кг)",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: false,
      foodType: "Власне",
      foodDetails:
        "На складі є столова, автомати з бутербродами, безкоштовні фрукти.",
    },
    startExpenses: {
      hasStartExpenses: true,
      details: "190 PLN, якщо не відпрацьовується 2 місяці (медогляд).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "250 PLN (штани, кофта, футболка, взуття) - утримується з першої зарплати.",
    },
    description:
      "Прийом, викладка товару. Збір товару зі сканером. Пакування замовлень і підготовка до відправки. Товари вагою від 5 до 30 кг. Робота не вимагає досвіду, є оплачуване навчання (3-5 днів).",
    additionalNotes:
      "На даному складі ID Logistics зберігаються товари для дому інтернет-магазину Амазон, такі як: дрібна побутова техніка, речі для кухні, спальні і ванни, аксесуари для прибирання ітд. Норми роботи реальні, можливість зміни процесу за бажанням.",
  },
  // Вакансія №10 - Цукерки Nysa
  {
    agencyName: "OTTO",
    templateName: "Цукерки Nysa - Виробництво цукерок",
    vacancydescription:
      "Робота на кондитерському заводі в Nysa: сортування, пакування та перебір солодощів, підготовка етикеток.",
    category: "⚙️ Виробництво і промисловість / Харчова промисловість",
    keywords: [
      "Цукерки Nysa",
      "Nysa",
      "Wrocław",
      "кондитерський завод",
      "цукерки",
      "желейні",
      "маршмелоу",
      "фармацевтичні",
      "пакування",
      "сортування",
    ],
    contractType: "Umowa zlecenie",
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Nysa",
    locationDescription: "Nowowiejska 22, Nysa 48-303 (60 км від Opole)",
    voivodeship: "Opolskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "30,50 PLN брутто/год",
      studentNetto: "",
      hoursRange: "",
      payoutDates: "До 10-го робочого дня кожного місяця",
      bonusDetails: "",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "4",
      breakDuration: "Узгоджуються з керівником",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота в системі 4-бригадовій, у дві зміни по 12 годин (06:00-18:00, 18:00-06:00). Зазвичай графік виглядає так: 4 дні роботи - 2 дні вихідних. Протягом зміни перерви узгоджуються з керівником. Машини не зупиняються, тому на перерву працівники виходять по одному.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "Не передбачена",
      details: "Проживання власне (компенсація не передбачена).",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд до роботи громадським транспортом (за власний рахунок).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Карта Multisport та медичний пакет LuxMed.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 99,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Санепід книжка, якщо немає, працівник проходить за власний кошт (≈160 PLN).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Комунікативна польська мова.",
      physicalLoad: "Середня (стояча робота, ротація між подібними позиціями)",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Заборони на виробництві", "температура в цеху"],
      specificConditionsDetails:
        "На виробництво не дозволяється вносити особисті речі, зокрема: прикраси (ланцюжки, каблучки, сережки тощо); заборонені штучні нігті, гібридні або гелеві покриття, а також штучні вії. Усі речі залишаються в шафках, які працівник отримує у перший день разом із робочим одягом. Також у підприємстві діють окремі роздягальні - «чиста» та «брудна» зона. Температура в цеху: близько 20°C.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медичний огляд: санепід книжка, якщо немає, працівник проходить за власний кошт (≈160 PLN).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Прості виробничі процеси: сортування, пакування та перебір солодощів; підготовка етикеток; прибирання робочого місця; дотримання санітарних та виробничих норм.",
    additionalNotes:
      "Без вікових обмежень. Стабільний графік, комфортні умови. Можливе продовження документів (карти побиту). Початок роботи: дату, час підписання документів і медогляду повідомляє координатор.",
  },
  // Вакансія №11 - IDL Tarnowo Podgórne
  {
    agencyName: "OTTO",
    templateName:
      "IDL Tarnowo Podgórne - Склад брендових товарів, одягу та аксесуарів",
    vacancydescription:
      "Робота на складі ID Logistics з брендовими товарами, одягом та аксесуарами: комплектація замовлень, пакування та розміщення товарів.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "ID Logistics",
      "Tarnowo Podgórne",
      "Poznań",
      "склад",
      "брендові товари",
      "одяг",
      "аксесуари",
      "комплектація",
      "пакування",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Tarnowo Podgórne",
    locationDescription: "Sowia 31, Tarnowo Podgórne",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    salary: {
      baseNetto: "24.63 PLN/год нетто",
      studentNetto: "30.50 PLN/год нетто",
      hoursRange: "",
      payoutDates: "20 - 22 числа за попередній пропрацьований місяць",
      bonusDetails:
        "Премії до 1000 PLN брутто за виконання норм. +1 PLN доплата за своє житло.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12",
      workDaysWeek: "6",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails:
        "Зміни по 8-12 годин, кожного дня працівник отримує графік на наступний день. 2 зміни по 12 годин: 07:00 - 19:00, 19:00 - 07:00. При спаді роботи у 3 зміни по 8 годин (07:00-15:00, 15:00-23:00, 23:00-07:00). Зміни для працівників формує заклад в залежності від к-сть замовлень (вибирати години та зміни не можна). Першого дня вас розподіляють по процесах та відразу визначають зміну (денну або нічну). Після цього ви постійно працюєте тільки в одній зміні — змінювати її неможливо.",
      description: "6 робочих днів, 1 вихідний. Зміни по 8-12 годин.",
    },
    accommodation: {
      type: "Надається",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "500 PLN/місяць",
      details:
        "500 PLN/місяць із зарплати. Квартири, будинки та реже хостели з комфортними умовами. Кімнати на 3 - 4 особи.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Доїзд до роботи безкоштовний з Poznań (Rondo Rataje, Zwierzyniecka, Bukowska, Ogrody, Dabrowskiego).",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Жінки", "Пари"],
      ageMax: 45,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Середня",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Заборона на власний одяг"],
      specificConditionsDetails: "У своєму одязі не можна.",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details:
        "150 PLN - медогляд (вираховується, якщо не відпрацювати 2 місяці).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "300 PLN - одяг одноразово вираховується із зарплати (футболка, штани, взуття, фліска, камізелька).",
    },
    description:
      "PICK — комплектація замовлень, робота зі сканером, розміщення товарів по складу. PACK — приготування товару до відправлення, пакування речей згідно зі стандартами. Прийом нового товару.",
    additionalNotes:
      "На складі ID Logistics зберігаються брендовані товари, зокрема одяг та аксесуари.",
  },
  // Вакансія №12 - STOKROTKA Teresin
  {
    agencyName: "OTTO",
    templateName: "STOKROTKA Teresin - Склад супермаркету",
    vacancydescription:
      "Робота на складі супермаркету Stokrotka на комплектації замовлень: збирання товару зі сканером, пакування та підготовка до відправки.",
    category: "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
    keywords: [
      "STOKROTKA",
      "Teresin",
      "Warszawa",
      "супермаркет",
      "склад",
      "комплектація",
      "продукти харчування",
      "напої",
      "побутова хімія",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes:
        "Як рахується аккорд на Стокротці? Залежно від кількості пунктів на день вважається поріг. І від порога – розумієте свою ставку. Як рахуються пункти? (не коробки, не картони, не пачки, а саме ПУНКТИ ЗА ПАЛЕТУ). Чим різноманітний товар на палеті – тим більше пунктів. Досвідчені роблять 4-5 поріг, початківці +- 2-3 й поріг і від цього вже йде ставка відповідна на годину.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Teresin",
    locationDescription: "Lazurowa 2, 96-515 Teresin (54 km od Warszawa)",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "26,73 PLN/год нетто (адаптація)",
      studentNetto: "31.60 PLN/год нетто",
      hoursRange: "",
      payoutDates: "20 - 22 числа за попередній пропрацьований місяць",
      bonusDetails:
        "Робота на аккорд: 1 поріг - 33.10 зл/год брутто (26,73 зл/год нетто), 2 поріг - 35 зл/год брутто (28,26 зл/год нетто), 3 поріг - 37.30 зл/год брутто (30,12 зл/год нетто), 4 поріг - 40 зл/год брутто (28,89 зл/год нетто), 5 поріг - 44.15 зл/год брутто (35,65 зл/год нетто).",
      salaryNotes:
        "Адаптація: якщо людина приходить, наприклад, на роботу 20 числа, то до кінця місяця вона матиме погодинну ставку, а з першого числа буде акорд.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8 (можливо 12)",
      workDaysWeek: "5-6",
      breakDuration: "1*20 хв (8 годин), 2*15-20 хв (12 годин)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails:
        "Графік може змінюватись відповідно до виробничих потреб. Плаваючий вихідний. Графік надсилається на тиждень.",
      description:
        "5 - 6 днів на тиждень. Зміни: 06:00-14:00, 14:00-22:00, 22:00-06:00 (в подальшому можна працювати по 12 годин).",
    },
    accommodation: {
      type: "Надається",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "19 PLN/доба",
      details:
        "19 PLN/доба із зарплати. Квартири або будинки з комфортними умовами проживання. Кімнати 3 - 4 місні. Або + 1 PLN нетто доплата за власне житло.",
    },
    transport: {
      provided: false,
      costRaw: "+ 1 PLN нетто",
      details: "Власний транспорт. Доплата + 1 PLN нетто до погодинної ставки.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 55,
      nationalities: ["Україна", "Молдова", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Сертифікат (wózki unoszące, або навички використання для отримання сертифікату).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови на комунікативному рівні.",
      physicalLoad: "Середня (робота на аккорд)",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Хороший зір", "робота в різних відділах"],
      specificConditionsDetails:
        "Хороший зір. Протягом зміни працівник може змінювати відділ, залежно від кількості роботи. Відділи: Сухий відділ, Холодний відділ, М’ясний відділ, Молочний відділ.",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details: "150 PLN - ліцензія на електро вузик одноразово із зарплати.",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "500 PLN - одяг і медогляд із зарплати, якщо не відпрацювати 3 місяці.",
    },
    description:
      "Робота на складі на комплектації замовлень. Збирання товару зі сканером/system voice на вузку та мануально. Упаковка замовлень та підготовка до відправки. Після заповнення контейнера, працівник відвозить товар у відповідний відділ і бере новий контейнер.",
    additionalNotes:
      "На складі зберігаються продукти харчування, напої, побутова хімія, засоби гігієни та інші товари для супермаркетів Stokrotka. Усе сортується для подальшої доставки до магазинів.",
  },
];

module.exports = apoloTemplates;
