// backend/data/templates/solano.js
// 4 вакансії → 3 унікальных шаблони
// DROBIMEX Karczew + DROBIMEX Lublin — аб'єднані (однаковий текст, різна локація)
const solanoTemplates = [
  // === 1. DROBIMEX Karczew ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "SOLANO",
    templateName:
      "DROBIMEX Karczew - Куриний м'ясокомбінат (розділка, пакування)",
    vacancydescription:
      "Куриний м'ясокомбінат (Розділка та пакування курячого філе)",
    category: "⚙️ Виробництво і прамысловасть / М'ясокомбінати та рибзаводи",
    keywords: [
      "SOLANO",
      "DROBIMEX",
      "Karczew",
      "курятина",
      "м'ясокомбінат",
      "птиця",
      "Карчев",
      "Варшава",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Karczew",
    locationDescription: "Karczew (20 км від Варшави)",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Warszawa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "від 23.60 PLN/год (30.50 PLN брутто/год)",
      studentNetto: "",
      hoursRange: "200–260 годин на місяць",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Є додаткові бонуси: +0,74 PLN/год — за стаж (після 9 міс); +0,80 PLN/год — Група II; +1,48 PLN/год — Група III; +350 PLN брутто/міс — бонус від компанії; +3,24 PLN/год — для працівників забою. Аванс після 10 робочих днів.",
      salaryNotes:
        "Загальна зарплата: 4500–5600 PLN нетто/місяць. У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Штрафів у договорах немає!",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "5–6 днів на тиждень",
      breakDuration: "Визначається внутрішнім розпорядком підприємства",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 зміни по 8–12 годин, 5–6 днів на тиждень. Місячна норма годин: 200–260 год.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "19.70 PLN/день (≈590 PLN/міс)",
      details:
        "3–4 особи в кімнаті. Хороші умови, все необхідне, але візьміть із собою посуд для індукційної плити та посуд для себе. Ковдра та подушка: 55 PLN (утримується разово).",
    },
    transport: {
      provided: false,
      costRaw: "не потрібен",
      details: "Транспорт не потрібен — житло поруч із підприємством.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

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
      hasSpecificConditions: true,
      specificNuances: ["Холод", "Запах"],
      specificConditionsDetails:
        "Робота на м'ясокомбінаті (курятина). Температурний режим відповідає харчовим нормам для роботи з сирим м'ясом.",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails: "На підприємстві надається безкоштовний обід.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медогляд і санітарна книжка: 154 PLN (утримується із зарплати). Разово за ковдру та подушку (за потреби): 55 PLN.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Обробка, розділення та пакування продукції з птиці; перевірка якості готової продукції; робота з обладнанням на виробничій лінії; дотримання гігієни та чистоти на робочому місці. Робочий одяг надається безкоштовно. Штрафів у договорах немає!",
    additionalNotes: "Локація: Karczew (20 км від Варшави).",
  },

  // === 2. DROBIMEX Lublin ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "SOLANO",
    templateName:
      "DROBIMEX Lublin - Куриний м'ясокомбінат (розділка, пакування)",
    vacancydescription:
      "Куриний м'ясокомбінат (Розділка та пакування курячого філе)",
    category: "⚙️ Виробництво і прамысловасть / М'ясокомбінати та рибзаводи",
    keywords: [
      "SOLANO",
      "DROBIMEX",
      "Lublin",
      "курятина",
      "м'ясокомбінат",
      "птиця",
      "Люблін",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Lublin",
    locationDescription: "Lublin",
    voivodeship: "Люблінське",
    country: "Польща",
    checkInCity: "Lublin",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "від 23.60 PLN/год (30.50 PLN брутто/год)",
      studentNetto: "",
      hoursRange: "200–260 годин на місяць",
      payoutDates: "20–22 числа за попередній місяць.",
      bonusDetails:
        "Є додаткові бонуси: +0,74 PLN/год — за стаж (після 9 міс); +0,80 PLN/год — Група II; +1,48 PLN/год — Група III; +350 PLN брутто/міс — бонус від компанії; +3,24 PLN/год — для працівників забою. Аванс після 10 робочих днів.",
      salaryNotes:
        "Загальна зарплата: 4500–5600 PLN нетто/місяць. У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Штрафів у договорах немає!",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "5–6 днів на тиждень",
      breakDuration: "Визначається внутрішнім розпорядком підприємства",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 зміни по 8–12 годин, 5–6 днів на тиждень. Місячна норма годин: 200–260 год.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "19.70 PLN/день (≈590 PLN/міс)",
      details:
        "3–4 особи в кімнаті. Хороші умови, все необхідне, але візьміть із собою посуд для індукційної плити та посуд для себе. Ковдра та подушка: 55 PLN (утримується разово).",
    },
    transport: {
      provided: false,
      costRaw: "не потрібен",
      details: "Транспорт не потрібен — житло поруч із підприємством.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

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
      hasSpecificConditions: true,
      specificNuances: ["Холод", "Запах"],
      specificConditionsDetails:
        "Робота на м'ясокомбінаті (курятина). Температурний режим відповідає харчовим нормам для роботи з сирим м'ясом.",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails: "На підприємстві надається безкоштовний обід.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Медогляд і санітарна книжка: 154 PLN (утримується із зарплати). Разово за ковдру та подушку (за потреби): 55 PLN.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Обробка, розділення та пакування продукції з птиці; перевірка якості готової продукції; робота з обладнанням на виробничій лінії; дотримання гігієни та чистоти на робочому місці. Робочий одяг надається безкоштовно. Штрафів у договорах немає!",
    additionalNotes: "Локація: Lublin.",
  },

  // 3
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "SOLANO",
    templateName: "STORTEBOOM Zeewolde - Куряче виробництво (Нідерланди)",
    vacancydescription:
      "Куряче виробництво (виробництво курячої продукції в Нідерландах)",
    category: "⚙️ Виробництво і прамысловасть / М'ясокомбінати та рибзаводи",
    keywords: [
      "STORTEBOOM",
      "Storteboom",
      "Zeewolde",
      "Зеволде",
      "Нідерланди",
      "Netherlands",
      "Holland",
      "курятина",
      "Флеволанд",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Zeewolde",
    locationDescription:
      "Zeewolde, Нідерланди (провінція Флеволанд, 45 хв від Амстердама)",
    voivodeship: "Флеволанд (Нідерланди)",
    country: "Нідерланди",
    checkInCity: "Zeewolde",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "€14.40 брутто/год (базова ставка)",
      studentNetto: "",
      hoursRange: "Приблизно 180 годин на місяць",
      payoutDates:
        "Своєчасна виплата (згідно з внутрішнім регламентом компанії).",
      bonusDetails:
        "Після 2-х місяців роботи підвищення до €14.69 брутто в час. Надбавки за сверхурочные, оплата отпускных, праздничные выплаты, ADV согласно САО (коллективный договор отрасли). Водитель рабочего авто получает дополнительно +25 евро в неделю. Аванс: после 10-ти отработанных дней.",
      salaryNotes:
        "Рекомендуємо мати додаткові кошти на первинні витрати. Орієнтовні ціни в Нідерландах на 2025/2026 рр.: хліб ~€1.50-3.00, молоко ~€1.00-2.19, яйця ~€2.50-4.00, куряча грудка ~€8.00-10.00/кг, картопля ~€1.20-2.00, яблука/банани ~€2.00-4.00, сир ~€8.87-11.00, сигарети (Marlboro) ~€12.50-12.99 за пачку. Супермаркети Albert Heijn (AH) дорожчі, LIDL та Dirk більш бюджетні.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Нд (можлива робота у вихідні та свята)",
      breakDuration:
        "3 безкоштовні перерви: 20+20+20 хвилин або 15+15+30 хвилин (в залежності від лінії).",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 зміни, приблизно по 8 годин (іноді більше в пікові періоди). Можлива робота у вихідні та святкові дні.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "€150/тиждень",
      details:
        "Комфортні умови, однокімнатні та двокімнатні кімнати. Посуд і постільну білизну слід взяти з собою або купити на місці. Оплата за житло здійснюється після отримання заробітної плати.",
    },
    transport: {
      provided: true,
      costRaw: "€130 (доставка з Польщі)",
      details:
        "Вартість транспорту з Польщі до Нідерландів — 130 євро (одноразовий платіж). Надається транспорт для робочих цілей. Водій робочого авто отримує додатково +25 євро на тиждень.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Карта побиту з обох сторін + децизія (або підтвердження повідомлення уженду про зміну роботодавця протягом 15 днів), ZUS 7 (формуляр US-7), копія контракту з попереднім роботодавцем (Umowa zlecenie / o pracę / o dzieło).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Бажано знання англійської мови.",

      physicalLoad:
        "Фізична витривалість, хороше здоров'я і готовність працювати в холоді (около +4 градусів, підвищена вологість). Уміння працювати швидко та акуратно, хороші мануальні здібності. Робота підходить для людей без спеціальної освіти.",
    },

    // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ (ДЭЛЕГАЦЫІ А1) ===
    businessTrip: {
      isBusinessTrip: true,
      requiresPolishExperience: true,
      requiredDocuments: ["PESEL UKR", "Карта побиту", "ZUS 7"],
      tripDetails:
        "Офіційне відрядження (делегація) з Польщі до Нідерландів. Може бути продовжена більше ніж на 90 днів.",
    },

    // === 9. СПЕЦЫФІЧНЫЯ ЎМОВЫ І ХАРЧАВАННЕ ===
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Холод (~+4°C)", "Вологість"],
      specificConditionsDetails:
        "Робота в умовах холодильного виробництва (близько +4 градусів, підвищена вологість). Нові працівники проходять навчання на місці.",
      workwearFree: true,
      foodType: "За свій рахунок",
      foodDetails: "Є столова, де можна купити або розігріць свій обід.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Транспорт з Польщі до Нідерландів — €130 (одноразово). Рекомендується мати додаткові кошти на первинні витрати (харчування, побут) до першої зарплати. Оплата за житло (€150/тиждень) здійснюється з першої зарплати.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Упаковка продукції: робота в стоячій позиції, упаковка продуктів та укладання готових упаковок на конвеєр. Обслуговування лінії: виконання різних допоміжних завдань на лінії, просте обслуговування обладнання. Робота з продукцією: наклеювання цінників, переміщення та підйом ящиків з курячою продукцією. Дотримання правил гігієни та турбота про чистоту робочого місця. Взуття надається роботодавцем, теплий одяг (термобілизну) необхідно мати свою.",
    additionalNotes:
      "Інструкція ZUS 7 (формуляр US-7): отримати на сайті zus.pl, особисто у відділенні альбо через PUE ZUS. Усі документи (децизії, карти побиту, контракти) відсканувати у хорошій якості, без обрізаних країв та пальців на фото. Потрібен номер телефону та email.",
  },

  // 4
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "SOLANO",
    templateName:
      "STADLER Siedlce - Виробництво вагонів метро, трамваїв, поїздів",
    vacancydescription:
      "Виробництво вагонів метро, трамваїв та поїздів (Монтер / Електрик / Клеяр)",
    category:
      "⚙️ Виробництво і прамысловасть / Металообробка та машинобудування",
    keywords: [
      "SOLANO",
      "STADLER",
      "Stadler",
      "Siedlce",
      "Сєдльце",
      "вагони",
      "метро",
      "трамваї",
      "монтер",
      "електрик",
      "клеяр",
      "Wyklejanie",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Siedlce",
    locationDescription: "Siedlce (Седльце, Польща)",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Siedlce",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "Монтер/Клеяр: 28–30 zł/год; Електрик без SEP: 27–30 zł/год; Електрик з SEP: 32–38 zł/год (залежно від досвіду загальна ставка електрика 27-34 zł/год).",
      studentNetto:
        "Монтер/Клеяр: 35 zł/год; Електрик: 33–40 zł/год (для студентів до 26 років).",
      hoursRange: "180–220 годин на місяць",
      payoutDates: "20–25 числа наступного місяця.",
      bonusDetails: "Аванс можливий після першого відпрацьованого тижня.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Оплата медогляду 200 zł — повертається роботодавцем після 3 місяців роботи.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-10",
      workDaysWeek: "Пн–Пт (субота за бажанням)",
      breakDuration: "Визначається внутрішнім розпорядком заводу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 зміни (без нічних): 05:45–14:00, 14:00–22:15. Можливі подовжені зміни 8–10 год. Пн–Пт, субота за бажанням, неділя вихідний. Стабільна довгострокова робота.",
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
      costRaw: "за власний рахунок (не потрібен)",
      details: "Житло знаходиться поруч із роботою, доїзд не потрібен.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Медогляд 200 zł повертається роботодавцем після 3 місяців успішної роботи.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Обов'язково резюме (CV) з досвідом роботи. Для електриків: досвід роботи, читання технічних креслень, робота з електроінструментом, SEP перевага.",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "B1",
      languageDetails:
        "Обов'язкова розмовна польська мова на комунікативному рівні.",

      physicalLoad:
        "Монтаж і підготовка деталей, перенесення дрібних елементів, інколи 10–20 кг (рідко, не постійно).",
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
        "У залі Lakiernia є металевий пил і запах фарби — підходить не всім, попереджайте кандидата заздалегідь. Без зварювання. Можлива періодична ротація між залами за потреби (не щодня).",
      workwearFree: true,
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Медогляд: 200 zł (повертається через 3 місяці роботи).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Сучасний завод повного циклу: від каркасу до готового вагона (метро, трамваї, поїзди). Монтажні зали: складання та монтаж елементів; встановлення підлог, панелей, дверей, сидінь; робота з інструментом (шуруповерт, ключі). Кінцевий монтаж: фінальна збірка вагонів; докручування, підготовка деталей, допоміжні монтажні роботи. Lakiernia/підготовка поверхонь: шліфування, чистка, підготовка до фарбування; фарбування вагонів. Електрики: монтаж електричних систем, читання технічних креслень, робота з електроінструментом. Вступна рекрутація + BHP szkolenie: 2 або 9 лютого.",
    additionalNotes:
      "Рекрутація ВИКЛЮЧНО через CV. Скан CV надсилається на завод. Завод погоджує або відмовляє. Якщо погодили — місце 100% гарантоване, співбесіди на заводі немає. Кандидат їде одразу на підтверджене місце.",
  },
];

module.exports = solanoTemplates;
