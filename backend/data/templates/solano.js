// backend/data/templates/solano.js

const solanoTemplates = [
  // Вакансія №1 - Куриний мясокомбінат (Розділка пакування курячого філе)
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "SOLANO",
    templateName: "DROBIMEX Karczew",
    vacancydescription:
      "Робота на куриному мясокомбінаті, що включає обробку, розділення та пакування курячого філе.",
    category: "⚙️ Виробництво і промисловість / Харчова промисловість",
    keywords: [
      "DROBIMEX",
      "Karczew",
      "Варшава",
      "курятина",
      "м'ясокомбінат",
      "пакування",
      "розділка",
    ],
    contractType: "Umowa zlecenie",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Karczew",
    locationDescription: "20 км від Варшави",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "від 23.60 PLN/год нетто (30.50 PLN брутто/год)",
      studentNetto: "",
      hoursRange: "200–260",
      payoutDates: "",
      bonusDetails:
        "+0.74 PLN/год за стаж (після 9 міс), +0.80 PLN/год Група II, +1.48 PLN/год Група III, +350 PLN брутто/міс бонус від компанії, +3.24 PLN/год для працівників забою",
      salaryNotes: "Середня зарплата: 4500–5600 PLN нетто/місяць",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8–12",
      workDaysWeek: "5–6 днів на тиждень",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни по 8–12 годин, 5–6 днів на тиждень. Місячна норма: 200–260 годин.",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "19.70 PLN/день (≈590 PLN/міс)",
      details:
        "3–4 особи в кімнаті, хороші умови, все необхідне. Потрібно мати свій посуд для індукційної плити та особистий посуд. Ковдра та подушка: 55 PLN.",
    },
    transport: {
      provided: false,
      costRaw: "Не потрібен",
      details: "Житло поруч із роботою.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Безкоштовний обід.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 99,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad:
        "Готовність працювати у змінному графіку, хороша мануальна моторика, уважність, вміння дотримуватись стандартів роботи.",
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
      foodType: "Обіди",
      foodDetails: "Безкоштовний обід.",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медогляд і санітарна книжка: 154 PLN (утримується із зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "Штрафів у договорах немає.",
    },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Обов’язки включають обробку, розділення та пакування продукції з птиці, перевірку якості готової продукції, роботу з обладнанням на виробничій лінії, а також дотримання гігієни та чистоти на робочому місці.",
    additionalNotes:
      "Можливість отримання авансу після 10 робочих днів. Відома компанія, що розширює команду.",
  },
  // Вакансія №2 - Куриний мясокомбінат (Розділка пакування курячого філе)
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "SOLANO",
    templateName: "DROBIMEX Lublin",
    vacancydescription:
      "Робота на куриному мясокомбінаті, що включає обробку, розділення та пакування курячого філе.",
    category: "⚙️ Виробництво і промисловість / Харчова промисловість",
    keywords: [
      "DROBIMEX",
      "Lublin",
      "Варшава",
      "курятина",
      "м'ясокомбінат",
      "пакування",
      "розділка",
    ],
    contractType: "Umowa zlecenie",
    // === УНУТРАНАЯ ІНФОРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Lublin",
    locationDescription: "",
    voivodeship: "Lubelskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "від 23.60 PLN/год нетто (30.50 PLN брутто/год)",
      studentNetto: "",
      hoursRange: "200–260",
      payoutDates: "",
      bonusDetails:
        "+0.74 PLN/год за стаж (після 9 міс), +0.80 PLN/год Група II, +1.48 PLN/год Група III, +350 PLN брутто/міс бонус від компанії, +3.24 PLN/год для працівників забою",
      salaryNotes: "Середня зарплата: 4500–5600 PLN нетто/місяць",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8–12",
      workDaysWeek: "5–6 днів на тиждень",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни по 8–12 годин, 5–6 днів на тиждень. Місячна норма: 200–260 годин.",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "19.70 PLN/день (≈590 PLN/міс)",
      details:
        "3–4 особи в кімнаті, хороші умови, все необхідне. Потрібно мати свій посуд для індукційної плити та особистий посуд. Ковдра та подушка: 55 PLN.",
    },
    transport: {
      provided: false,
      costRaw: "Не потрібен",
      details: "Житло поруч із роботою.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Безкоштовний обід.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 99,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad:
        "Готовність працювати у змінному графіку, хороша мануальна моторика, уважність, вміння дотримуватись стандартів роботи.",
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
      foodType: "Обіди",
      foodDetails: "Безкоштовний обід.",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медогляд і санітарна книжка: 154 PLN (утримується із зарплати).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "Штрафів у договорах немає.",
    },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Обов’язки включають обробку, розділення та пакування продукції з птиці, перевірку якості готової продукції, роботу з обладнанням на виробничій лінії, а також дотримання гігієни та чистоти на робочому місці.",
    additionalNotes:
      "Можливість отримання авансу після 10 робочих днів. Відома компанія, що розширює команду.",
  },
  // Вакансія №3 - Куринне виробництво (Zeewolde, Нідерланди)
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "SOLANO",
    templateName: "STORTEBOOM HOLANDIA Zeewolde",
    vacancydescription:
      "Робота на підприємстві з виробництва курячої продукції в Нідерландах.",
    category: "⚙️ Виробництво і промисловість / Харчова промисловість",
    keywords: [
      "STORTEBOOM",
      "Zeewolde",
      "Нідерланди",
      "курятина",
      "виробництво",
      "пакування",
    ],
    contractType: "Umowa zlecenie",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Zeewolde",
    locationDescription: "",
    voivodeship: "",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "€14.40 брутто/год (після 2-х місяців €14.69 брутто/год)",
      studentNetto: "",
      hoursRange: "Приблизно 180",
      payoutDates: "",
      bonusDetails:
        "Надбавки за понаднормові, оплата відпускних, святкові виплати, ADV згідно САО. Водій робочого авто отримує додатково +25 євро на тиждень.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "Приблизно 8 (іноді більше)",
      workDaysWeek: "Можлива робота у вихідні та свята",
      breakDuration:
        "3 безкоштовні перерви: 20+20+20 хвилин або 15+15+30 хвилин (залежно від лінії)",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота в 2 зміни, приблизно по 8 годин (іноді більше в пікові періоди). Можлива робота у вихідні та свята.",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "€150 на тиждень",
      details:
        "Комфортні умови, однокімнатні та двокімнатні кімнати. Посуд та постільну білизну слід взяти з собою або купити на місці. Оплата за житло здійснюється після отримання заробітної плати.",
    },
    transport: {
      provided: true,
      costRaw: "130 євро (одноразово)",
      details:
        "Організований транспорт з Польщі до Нідерландів. Надається транспорт для робочих цілей.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 99,
      nationalities: ["Україна"],
      standardDocs: [
        "Карта побуту з децизією",
        "Польська робоча віза (дійсна не менше 6 місяців)",
        "PESEL UKR",
      ],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "ZUS 7 (довідка про сплату внесків за останні 30 днів), копія контракту з попереднім роботодавцем (Umowa zlecenie, Umowa o pracę, Umowa o dzieło). Не приймаються кандидати, які перебувають у процесі отримання карти побиту.",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "Бажано знання англійської мови.",
      physicalLoad:
        "Фізична витривалість, готовність працювати в холоді (близько +4 градусів, підвищена вологість повітря), швидкість та акуратність, хороші мануальні здібності.",
    },
    // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ (ДЭЛЕГАЦЫІ А1) ===
    businessTrip: {
      isBusinessTrip: true,
      requiresPolishExperience: false,
      requiredDocuments: [
        "Карта побуту з децизією",
        "Польська робоча віза",
        "PESEL UKR",
        "ZUS 7",
        "Копія контракту з попереднім роботодавцем",
      ],
      tripDetails:
        "Делегація до Zeewolde, Нідерланди. Можливість продовження делегації більше ніж на 90 днів.",
    },
    // === 9. СПЕЦЫФІЧНЫЯ ЎМОВЫ І ХАРЧАВАННЕ ===
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Холодний склад", "Підвищена вологість"],
      specificConditionsDetails:
        "Робота в умовах холодильного виробництва (близько +4 градусів, підвищена вологість повітря).",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "Є столова, де можна купити або розігріти свій обід.",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Вартість транспорту з Польщі до Нідерландів становить 130 євро (одноразовий платіж). Рекомендується мати додаткові кошти на первинні витрати (харчування, побутові товари) до отримання першої зарплати.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Обов'язки включають пакування продукції (робота стоячи, укладання готових упаковок на конвеєр), обслуговування лінії (виконання допоміжних завдань, просте обслуговування обладнання), роботу з продукцією (наклеювання цінників, переміщення та підйом ящиків з курячою продукцією), а також дотримання правил гігієни та чистоти на робочому місці.",
    additionalNotes:
      "Легальна та стабільна робота з офіційним працевлаштуванням. Постійна опіка координатора та підтримка в адаптації. Доступ до юридичної та медичної допомоги, програми пільг. Своєчасна виплата заробітної плати. Можливість отримання авансу після 10 відпрацьованих днів. Проживання та робота з людьми, що говорять вашою мовою, допомагає швидше адаптуватися.",
  },
  // Вакансія №4 - STADLER Siedlce (Виробництво вагонів метро / трамваїв / поїздів)
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "SOLANO",
    templateName: "STADLER Siedlce",
    vacancydescription:
      "Робота на сучасному заводі з виробництва вагонів метро, трамваїв та поїздів.",
    category: "⚙️ Виробництво і промисловість / Машинобудування",
    keywords: [
      "STADLER",
      "Siedlce",
      "Седльце",
      "вагони",
      "трамваї",
      "поїзди",
      "монтаж",
      "електрик",
      "клеяр",
    ],
    contractType: "Umowa zlecenie",
    // === УНУТРАНАЯ ІНФОРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Попереджайте кандидата про металевий пил і запах фарби в Lakiernia. Рекрутація проходить ВИКЛЮЧНО через CV. Якщо CV прийняте — місце закріплене за кандидатом, співбесіди на заводі немає.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Siedlce",
    locationDescription: "",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "Електрик: 27–34 zł/год нетто (з SEP: 32–38 zł/год, без SEP: 27–30 zł/год). Монтер/Клеяр: 28–30 zł/год нетто.",
      studentNetto:
        "Електрик: 33–40 zł/год нетто. Монтер/Клеяр: 35 zł/год нетто.",
      hoursRange: "",
      payoutDates: "20–25 число",
      bonusDetails: "",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8–10",
      workDaysWeek: "Пн-Пт, субота за бажанням, неділя вихідний",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "2 зміни (без нічних): 05:45–14:00, 14:00–22:15. Можливі подовжені зміни 8–10 годин. Пн-Пт, субота за бажанням, неділя вихідний.",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "600 zł/місяць",
      details: "Житло поруч із роботою.",
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
      gender: ["Чоловіки", "Жінки"],
      ageMax: 99,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad:
        "В основному монтаж і підготовка деталей, перенесення дрібних елементів, інколи 10–20 кг (рідко, не постійно).",
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
      specificNuances: ["Металевий пил", "Запах фарби"],
      specificConditionsDetails:
        "У залі Lakiernia/підготовка поверхонь є металевий пил і запах фарби.",
      workwearFree: false,
      foodType: "Власне",
      foodDetails: "",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медогляд: 200 zł, повертається роботодавцем після 3 місяців роботи.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Обов’язки включають складання та монтаж елементів, встановлення підлог, панелей, дверей, сидінь, роботу з інструментом (шуруповерт, ключі тощо). На кінцевому монтажі — фінальна збірка вагонів, докручування, підготовка деталей, допоміжні монтажні роботи. У Lakiernia/підготовка поверхонь — шліфування, чистка, підготовка до фарбування, фарбування вагонів. Для електриків: досвід роботи, читання технічних креслень, робота з електроінструментом.",
    additionalNotes:
      "Стабільна довгострокова робота. Можливість працевлаштування електриків з SEP і без SEP (SEP не обов’язковий, але впливає на ставку). Аванс після першого тижня. Завод повного циклу: від каркасу до готового вагона.",
  },
];

module.exports = solanoTemplates;
