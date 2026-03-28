// backend/data/templates/bisar.js
const bisarTemplates = [
  // === 1. YORK Bolechowo (Виробництво товарів для дому) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "YORK Bolechowo - Виробництво товарів для дому",
    vacancydescription:
      "Виробництво та пакування товарів для дому (губки, щітки, пластикові вироби)",
    category:
      "⚙️ Виробництво і прамысловасть / Пластик, пакування та товари для дому",
    keywords: [
      "BISAR",
      "YORK",
      "Bolechowo",
      "Bolechowo Osiedle",
      "Poznań",
      "Познань",
      "губки",
      "щітки",
      "віники",
      "пластик",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Польський виробник побутових товарів для прибирання з більш ніж 32-річним досвідом. Робота на посаді Operator Maszyn. У цеху з виробництва щіток (сектор 2) трохи шумно.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Bolechowo Osiedle",
    locationDescription:
      "Bolechowo Osiedle (18 км від Познані, Великопольське воєводство)",
    voivodeship: "Великопольське",
    country: "Польща",
    checkInCity: "Bolechowo Osiedle / Poznań",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.00 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "168–200",
      payoutDates:
        "Згідно з внутрішнім розпорядком агенції Bisar на банківську картку.",
      bonusDetails: "+1.00 zł/год доплата за власне житло.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Вартість робочого одягу вираховується із заробітної плати.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт (можливі робочі суботи для 1-ї зміни)",
      breakDuration: "Визначається внутрішнім розпорядком заводу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 3 зміни по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00. Робочі суботи можливі тільки для кандидатів, які працюють у першу зміну.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł / добу (вираховується із зарплати)",
      details:
        "Проживання надається. При заселенні потрібно мати своє постільне бельё; ковдри та подушки надаються. Є доплата за власне житло +1 zł/год.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details:
        "Доїзд до роботи місцевим громадським транспортом за власний рахунок.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1 zł/год.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55, // Бажано
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Готовність до роботи стоячи. Для жінок робота більш мануальна (спритність рук). Бажання працювати мінімум 3 місяці.",
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
      specificNuances: ["Шум (у цеху виробництва щіток)"],
      specificConditionsDetails:
        "Кімнатна температура (цех пластику та губок). У цеху з виробництва щіток, мітел та совків (набивання ворсу) трохи шумно.",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails: "Харчування на підприємстві не надається.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Вартість робочого одягу вираховується із заробітної плати.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Сектор 1 (Виробництво губок для миття посуду): автоматичний процес порізки та пакування, перевірка якості готової продукції, наклеювання етикеток, пакування в картонні коробки для відправки. Сектор 2 (Виробництво щіток, мітел і совків): автоматичне набивання ворсу, пакування готової продукції в картонні коробки. Сектор 3 (Виробництво пластикових виробів: ручки для мітел, щітки, відра): завантаження спеціального грануляту в машину, автоматичний процес виготовлення виробу машиною, перевірка якості готових виробів. Робота стоячи.",
    additionalNotes: "Адреса роботи: Bolechowo Osiedle (18 км від Познані).",
  },
  // === 2. ZARA Stryków (Склад одягу) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "ZARA Stryków - Склад одягу",
    vacancydescription:
      "Працівник складу брендового одягу та аксесуарів (сортування, пакування, збір замовлень)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "ZARA",
      "Stryków",
      "Стрикув",
      "Lódź",
      "Лодзь",
      "Głowno",
      "Гловно",
      "одяг",
      "склад",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Оформлення документів відбувається у місті Гловно (Głowno). Важливо попередити кандидатів про власний зручний одяг (видається тільки взуття).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Stryków",
    locationDescription: "Stryków (місце проживання — Głowno, 20 км від Лодзі)",
    voivodeship: "Лодзинське",
    country: "Польща",
    checkInCity: "Głowno",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "200–240",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "+1.50 zł/год — доплата за власне житло (за кожну відпрацьовану годину).",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Взуття видається безкоштовно.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration: "Оплачувана перерва згідно з внутрішнім розпорядком.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 8-12 годин: перша зміна 06:00 – 18:00, друга зміна 18:00 – 06:00. Робота 5-6 днів на тиждень з оплачуваними перервами.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "600 zł / місяць (утримується із зарплати)",
      details:
        "Комфортні будинки з усіма необхідними зручностями. При поселенні мати свій комплект постільної білизни.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний доїзд на роботу організованим транспортом з міст Лодзь та Гловно.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1.50 zł/год.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Хороша фізична форма для роботи на ногах. Вміння користуватися терміналом (сканером).",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Температура в приміщенні: від +20°C до +22°C. Робота зі сканером.",
      workwearFree: true, // оскільки взуття безкоштовне, а одяг свій
      foodType: "За свій рахунок",
      foodDetails: "На території є їдальня та автомати з продажу напоїв.",
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
      "Прийом/відвантаження: завантаження та розвантаження товару (позиція переважно для чоловіків). R-Sort: надходження товару, контроль якості, сканування штрих-коду. Pack: упаковка онлайн-замовлень. Pick (Вибір): збирання одягу за допомогою терміналу (сканера).",
    additionalNotes:
      "📍 Приїзд на оформлення документів — місто Гловно (Głowno). Житло також у Głowno. Робоче взуття видається безкоштовно.",
  },
  // === 3. LPP Rzeszów / Jasionka (Склад онлайн-замовлень) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "LPP Rzeszów (Jasionka) - Склад онлайн-замовлень",
    vacancydescription:
      "Працівник складу онлайн-замовлень брендового одягу (прийом, сортування, пакування, збір замовлень)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "LPP",
      "Rzeszów",
      "Жешув",
      "Jasionka",
      "Ясьонка",
      "Reserved",
      "Sinsay",
      "склад",
      "одяг",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "LPP — найбільша польська мережа магазинів одягу (бренди Reserved, Cropp, Sinsay тощо). Оформлення документів відбувається у місті Жешув (Rzeszów). Кандидати з правами UDT можуть претендувати на вищу ставку/додаткові виплати (за умови наявності наборів).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Jasionka",
    locationDescription:
      "Ясьонка (Jasionka, 13 км від Жешува), проживання у Жешуві.",
    voivodeship: "Підкарпатське",
    country: "Польща",
    checkInCity: "Rzeszów",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років з довідкою студента).",
      hoursRange: "200–240",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "+1.00 zł/год — доплата за власне житло (за кожну відпрацьовану годину). Додаткові виплати за права UDT (при наявності відповідних наборів).",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Робочий одяг має бути власний.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration: "Оплачувана перерва згідно з внутрішнім розпорядком.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 8-12 годин: перша зміна 06:00 – 18:00, друга зміна 18:00 – 06:00. Робота 5-6 днів на тиждень з оплачуваними перервами.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "550 zł / місяць (утримується із зарплати)",
      details:
        "Комфортні будинки з усіма необхідними зручностями у Жешуві. Є доплата за власне житло +1.00 zł/год.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований доїзд на роботу з Жешува службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1.00 zł/год.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота на ногах, витривалість. Вміння користуватися смартфоном/терміналом (сканером).",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Температура в приміщенні: від +20°C до +22°C. Робота зі сканером.",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails: "На території є їдальня та автомати з продажу напоїв.",
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
      "Щодня керівник ставить перед працівниками конкретні завдання: Прийом/відвантаження (відповідальність за отримання та завантаження товару — посада переважно чоловіча); R-Sort (отримання товару, контроль якості, сканування штрих-коду); Pack (упаковка онлайн-замовлень); Pick (Вибір: збирання одягу за допомогою терміналу).",
    additionalNotes:
      "📍 Приїзд на оформлення документів — місто Жешув (Rzeszów). Працівники мають мати власний зручний одяг для роботи.",
  },
  // === 4. LPP Bydgoszcz (Склад онлайн-замовлень) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "LPP Bydgoszcz - Склад онлайн-замовлень",
    vacancydescription:
      "Працівник складу брендового одягу та аксесуарів (прийом, сортування, пакування, збір замовлень)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "LPP",
      "Bydgoszcz",
      "Бидгощ",
      "Бідгощ",
      "Sinsay",
      "Reserved",
      "одяг",
      "склад",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "LPP — найбільша польська мережа магазинів одягу (Reserved, Cropp, Sinsay тощо). Оформлення документів відбувається безпосередньо у місті Бидгощ (Bydgoszcz). Зустрічають кандидатів з вокзалів та поселяють. ВАЖЛИВО: заклад приймає на роботу мінімально на 2,5 місяці.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Bydgoszcz",
    locationDescription: "Bydgoszcz (Бидгощ, Куявсько-Поморське воєводство)",
    voivodeship: "Куявсько-Поморське",
    country: "Польща",
    checkInCity: "Bydgoszcz",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років за наявності довідки з навчального закладу).",
      hoursRange: "220–260",
      payoutDates:
        "Регулярно на банківський рахунок (згідно з регламентом Bisar).",
      bonusDetails:
        "+1.00 zł/год — компенсація за власне житло (за кожну відпрацьовану годину). Можуть бути окремі ставки для операторів навантажувачів.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Робочий одяг власний.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "10-12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration: "Оплачувані перерви згідно з внутрішнім розпорядком.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 10-12 годин: перша зміна 06:00 - 18:00, друга зміна 18:00 - 06:00. Робота 5-6 днів на тиждень з оплачуваними перервами.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "600 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки з усім необхідним обладнанням. Доступні місця для сімейних пар. Зустрічаємо з вокзалів та поселяємо. Є компенсація за власне житло +1.00 zł/год.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований доїзд до місця роботи службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1.00 zł/год.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота на ногах. Вміння користуватися терміналом (сканером). Готовність працювати мінімально 2,5 місяці.",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Температура в приміщенні: від +20°C до +22°C. Робота зі сканером.",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails:
        "На території є їдальня та автомати з безкоштовними напоями.",
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
      "Щодня бригадир ставить перед працівниками конкретні завдання: Przyjęcie/wysyłka — прийом або погрузка товару (процес переважно для чоловіків). R-Sort — прийом товару, перевірка його на брак, сканування штрих-кодів. Pack — пакування інтернет-замовлень. Pick — збір одягу з терміналом, розкладання одягу з терміналом. Оператори Вузика: розвантаження та погрузка товарів; транспортування та вивантаження товарів на території складу.",
    additionalNotes:
      "📍 Приїзд на оформлення документів — місто Бидгощ (Bydgoszcz). Робочий одяг власний.",
  },
  // === 5. NO LIMIT Natolin (Склад брендового одягу) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "NO LIMIT Natolin - Склад брендового одягу",
    vacancydescription:
      "Працівник складу брендового одягу, взуття та аксесуарів (сортування повернень, збір замовлень, пакування)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "No Limit",
      "Natolin",
      "Натолін",
      "Warszawa",
      "Варшава",
      "Pruszków",
      "Прушкув",
      "одяг",
      "взуття",
      "склад",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "No Limit — великий логістичний оператор. Склад у Натоліні (Natolin). Житло у місті Прушкув (Pruszków). Вакансія орієнтована переважно на чоловіків. Швидкий вихід на роботу — через 2–3 дні після приїзду.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Natolin",
    locationDescription:
      "Natolin (13 км від Варшави), місце проживання — Прушкув (Pruszków).",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Pruszków / Warszawa",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год (з PIT-2); 22.03 zł/год (без PIT-2)",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "240–280",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "Ставки для операторів з польськими правами UDT: 28.27 zł/год нетто (звичайна) / 35.00 zł/год нетто (для студентів).",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Щоденні безкоштовні перекуси на зміні.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration: "Оплачувані перерви згідно з внутрішнім розпорядком.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 12 годин: перша зміна 06:00 – 18:00, друга зміна 10:00 – 22:00. Робота 5-6 днів на тиждень з оплачуваними перервами.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false, // Оскільки вакансія для чоловіків
      withChildren: false,
      withPets: false,
      costRaw: "580 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки у місті Pruszków з усіма необхідними зручностями. При заселенні потрібно мати власну постільну білизну та посуд.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details: "Безкоштовний автобус від фірми від місця проживання до складу.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Щоденні безкоштовні перекуси на території підприємства.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 50,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Хороша фізична форма для роботи на ногах. Вміння користуватися терміналом (сканером). Для операторів навантажувачів — обов'язкова наявність польських прав UDT.",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Температура в приміщенні: від +20°C до +22°C. Робота зі сканером.",
      workwearFree: false,
      foodType: "За свій рахунок (перекуси безкоштовно)",
      foodDetails:
        "На території є їдальня, автомати з безкоштовними напоями та щоденні безкоштовні перекуси.",
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
      "Zwroty — прийом і контроль поверненого товару. Pick — збір замовлень за транспортними накладними (термінал/сканер). Pack — пакування одягу, взуття та аксесуарів. Kontrola jakości — перевірка товарів на дефекти. Оператори Wózka (за наявності UDT) — розвантаження, навантаження та транспортування товару по складу.",
    additionalNotes:
      "📍 Місце проживання — Pruszków. Початок роботи — через 2–3 дні після приїзду. Робочий одяг власний.",
  },
  // === 6. CEVA Sulechów (Логістичний склад замовлень) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "CEVA Sulechów - Логістичний склад замовлень",
    vacancydescription:
      "Працівник логістичного складу інтернет-замовлень (сортування, пакування, підготовка до відправлення)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "CEVA",
      "Sulechów",
      "Сулехув",
      "Zielona Góra",
      "Зелена Гура",
      "Nowa Sól",
      "Нова Суль",
      "склад",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "CEVA Sulechów — сучасний автоматизований логістичний склад інтернет-замовлень. Місце праці та проживання переважно у м. Sulechów. ВАЖЛИВО: мінімальний термін працевлаштування від 2-х місяців.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Sulechów",
    locationDescription:
      "Sulechów (Сулехув, біля Зеленої Гури), місце проживання — Sulechów.",
    voivodeship: "Любуське",
    country: "Польща",
    checkInCity: "Sulechów / Zielona Góra",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "200–240",
      payoutDates:
        "Регулярно на банківський рахунок (згідно з регламентом Bisar).",
      bonusDetails:
        "Фірма покриває витрати на проїзд для кандидатів із власним житлом у місті Zielona Góra.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Робочий одяг має бути власний.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration: "Оплачувані перерви згідно з внутрішнім розпорядком.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни, по 8-10-12 годин на зміну. Перша зміна: 06:00 - 14:00. Друга зміна: 14:00 - 22:00. Робота 5-6 днів на тиждень з оплачуваними перервами.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "810 zł / місяць (вираховується із зарплати)",
      details:
        "Проживання організоване у місті Sulechów. Комфортні умови, всі необхідні зручності для працівників.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований доїзд на роботу з міст Nowa Sól та Zielona Góra службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Покриття витрат на доїзд для кандидатів зі своїм житлом у Зеленій Гурі.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота стоячи (на ногах), робота в динамічному середовищі. ВАЖЛИВО: Мінімальний термін працевлаштування від 2 місяців.",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Кімнатна температура, сучасний автоматизований склад.",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails:
        "На території складу є їдальня та місця для відпочинку працівників.",
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
      "Сортування товарів, пакування інтернет-замовлень, перевірка товарів на брак/відповідність та підготовка їх до відправлення. Робота в динамічному середовищі на автоматизованому складі.",
    additionalNotes:
      "📍 Робота та проживання переважно в місті Sulechów. Кандидати мають мати власний зручний одяг для роботи.",
  },
  // === 7. IDL Psary (Склад онлайн-замовлень) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "IDL Psary - Склад онлайн-замовлень",
    vacancydescription:
      "Працівник складу інтернет-замовлень брендового одягу (сортування, пакування, збір замовлень Pick-to-Light)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "IDL",
      "Psary",
      "Псари",
      "Katowice",
      "Катовіце",
      "Sosnowiec",
      "Сосновець",
      "одяг",
      "склад",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "IDL Psary — технологічний склад інтернет-замовлень одягу (15 км від Сосновця, 19 км від Катовіце). Використовується система PTL (Pick-to-Light). Оформлення документів та приїзд — місто Сосновець (Sosnowiec).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Psary",
    locationDescription:
      "Псари (Psary, 15 км від Сосновця, 19 км від Катовіце), проживання та оформлення у Сосновці.",
    voivodeship: "Сілезьке",
    country: "Польща",
    checkInCity: "Sosnowiec",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років за наявності довідки з навчального закладу).",
      hoursRange: "200–240",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "+1.00 zł/год — компенсація за власне житло (за кожну відпрацьовану годину). Передбачена окрема ставка для працівників з UDT.",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Робочий одяг та взуття видаються безкоштовно.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration:
        "При 8 год — 30 хв; при 10 год — 40 хв; при 12 год — 30+15 хв перерви.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2-3 зміни по 8-12 годин. Перерви розраховуються залежно від тривалості зміни.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "600 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки з усім необхідним. У кімнатах проживає по 2–4 людини. Є доплата за власне житло +1.00 zł/год.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований доїзд на роботу з міста Сосновець службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1.00 zł/год.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота на ногах. Вміння користуватися терміналом (сканером) та базове розуміння комп'ютера. Уважність при перевірці браку.",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Температура в приміщенні: від +20°C до +22°C. Використання технології PTL (Pick-to-Light).",
      workwearFree: true,
      foodType: "За свій рахунок",
      foodDetails: "На території закладу є їдальня та автомати з напоями.",
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
      "Щодня бригадир зміни вирішує, на якому процесі працюватиме працівник: Przyjęcie/wysyłka — чоловіки сканують зібрані інтернет-замовлення, розкладають у контейнери, відвозять для подальшої відвантаження або пакування. R-Sort — прийом товару, сканування кожного елемента одягу, перевірка на брак. Pick (збір/розкладання) — збір замовлень за допомогою візка та термінала або розкладання замовлень по ячейках. Pack — працівники беруть замовлення зі шафок PTL, сканують штрих-коди, звіряють з ПК, перевіряють на брак та пакують.",
    additionalNotes:
      "📍 Оформлення та приїзд — місто Сосновець (Sosnowiec). Робочий одяг та взуття видаються безкоштовно.",
  },
  // === 8. AMAZON Łozienica (Логістичний склад замовлень) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "AMAZON Łozienica - Логістичний склад замовлень",
    vacancydescription:
      "Робітник складу інтернет-замовлень Amazon (прийом, розкладання, сортування, пакування, відправка)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "AMAZON",
      "Амазон",
      "Łozienica",
      "Лозеніца",
      "Szczecin",
      "Щецин",
      "Gryfino",
      "Грифіно",
      "склад",
    ],
    contractType: "Umowa o pracę",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Офіційне працевлаштування за Umowa o pracę. Приїзд на оформлення документів — місто Грифіно (Gryfino), а проживання організоване у Щецині (Szczecin). Робота на складі у Лозеніці (35 км від Щецина).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łozienica",
    locationDescription:
      "Лозеніца (Łozienica, 35 км від Щецина), проживання у місті Щецин.",
    voivodeship: "Західнопоморське",
    country: "Польща",
    checkInCity: "Gryfino",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "28.44 zł брутто/год (базова ставка для Umowa o pracę).",
      studentNetto:
        "Розраховується згідно зі ставками брутто/нетто для Umowa o pracę.",
      hoursRange: "168–180",
      payoutDates: "Регулярно, 10 числа кожного місяця на банківський рахунок.",
      bonusDetails:
        "+15% премія від базової ставки (приблизно +600 zł брутто). Доплата +100% за роботу у святкові та вихідні дні.",
      salaryNotes:
        "Оскільки це Umowa o pracę, працівники мають право на оплачувану відпустку та лікарняні. Безкоштовний ланч і фрукти.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "5 днів на тиждень",
      breakDuration:
        "Оплачувана перерва згідно з Кодексом праці (Umowa o pracę).",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 8 годин: перша зміна 06:00 – 14:00, друга зміна 14:00 – 22:00. Робота 5 днів на тиждень з оплачуваною перервою.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "550 zł / місяць (утримується із зарплати)",
      details:
        "Комфортні будинки у Щецині з усіма необхідними зручностями. При поселенні мати свій комплект постільної білизни.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований доїзд на роботу зі Щецина службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовні щоденні гарячі ланчі (4 рази на тиждень), безкоштовні фрукти (двічі на тиждень), чай і кава безкоштовно (не з автомата).",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Вміння працювати в команді, базові навички роботи з терміналом (сканером). Готовність до роботи на ногах.",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Сучасний теплий склад, температура в приміщенні: від +20°C до +22°C.",
      workwearFree: true,
      foodType: "Безкоштовно (ланчі 4 рази на тиждень)",
      foodDetails:
        "На території є їдальня, де надається безкоштовний ланч (4 рази на тиждень), безкоштовні фрукти (2 рази на тиждень), а також безкоштовний чай/кава (заварна, не з автомата).",
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
      "Щодня бригадир ставить перед працівниками конкретні завдання: RCV — приймання товару, маркування, сканування штрих-коду. STOW/PICK — розкладання та збирання одягу/товарів за допомогою терміналу. PACK — пакування замовлень. СОРТУВАННЯ — сканування штрих-кодів і сортування товарів по коробках. Доставка (Shipping) — відправка готових посилок.",
    additionalNotes:
      "📍 Приїзд на оформлення — місто Грифіно (Gryfino). Проживання у місті Щецин (Szczecin). Робочий одяг видається безкоштовно.",
  },
  // === 9. ZALANDO Gardno (Логістичний склад замовлень) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "ZALANDO Gardno - Міжнародний логістичний склад",
    vacancydescription:
      "Робітник складу брендового одягу та аксесуарў Zalando (розвантаження, прийом, розкладання, пакування, шипінг)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "ZALANDO",
      "Заландо",
      "Gardno",
      "Гардно",
      "Szczecin",
      "Щецин",
      "Gryfino",
      "Грифіно",
      "склад",
    ],
    contractType: "Umowa o pracę",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Zalando в Гардно (30 км від Щецина). Офіційне працевлаштування за Umowa o pracę. Приїзд на оформлення документів та проживання — місто Грифіно (Gryfino). Нічні зміни випадають рідко — приблизно раз на 8 тижнів.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Gardno",
    locationDescription:
      "Гардно (Gardno, 30 км від Щецина), проживання у місті Грифіно (Gryfino).",
    voivodeship: "Західнопоморське",
    country: "Польща",
    checkInCity: "Gryfino",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "30.06 zł брутто/год (гарантований базовий тариф для Umowa o pracę).",
      studentNetto:
        "Ставка розраховується згідно із законодавством для Umowa o pracę.",
      hoursRange: "168–200",
      payoutDates: "Регулярно, 10 числа кожного місяця на банківський рахунок.",
      bonusDetails:
        "+15% премії від загальної суми (+700 zł брутто). Додатково +25 zł брутто за кожен день у нічну зміну. +100 zł брутто за вихід у вихідний день.",
      salaryNotes:
        "Працівники отримують картку на харчування номіналом 250 злотих. Оскільки це Umowa o pracę, передбачені оплачувані лікарняні та відпустки.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration:
        "Оплачувана перерва 25 хвилин згідно з внутрішнім розпорядком.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 3 зміни: 05:50 – 14:00, 13:50 – 22:00, 21:50 – 06:00. Робота 5-6 днів на тиждень. Нічні зміни раз на 8 тижнів.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "450 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки у місті Грифіно з усіма необхідними зручностями. При поселенні мати свій комплект постільної білизни.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований доїзд до місця роботи службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Картка на харчування номіналом 250 злотих щомісяця. Безкоштовні напої на території підприємства.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота на ногах. Вміння користуватися терміналом (сканером). Готовність до позмінної роботи.",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Сучасний теплий склад, температура в приміщенні: від +20°C до +22°C.",
      workwearFree: true,
      foodType: "Частково безкоштовне (бонус 250 злотих на картку)",
      foodDetails:
        "На території є їдальня та автомати з безкоштовними напоями. Додатково видається картка для придбання їжі на 250 злотих.",
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
      "Щодня бригадир ставить перед працівниками конкретні завдання: Розвантаження — працівники розвантажують піддони з товаром на електронавантажувачі. RCV — приймання товару, маркування, сканування штрих-коду. STOW/PICK — розкладання/збирання одягу та товарів за допомогою терміналу. PACK — пакування замовлень. Шипінг (Shipping) — сортування посилок за країнами, транспортування їх у рядах до контейнера та підготовка до завантаження.",
    additionalNotes:
      "📍 Приїзд на оформлення — місто Грифіно (Gryfino). Проживання у місті Грифіно. Робочий одяг видається безкоштовно.",
  },
  // === 10. ШВАЧКИ Rypin (Швейне виробництво військової форми) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "ШВАЧКИ Rypin - Швейне виробництво (військова форма)",
    vacancydescription:
      "Швачка на промислові машини JUKI / SIRUBA (пошиття військової форми та мундирів, без нічних змін)",
    category: "⚙️ Виробництво і прамысловасть / Легка промисловість та пошиття",
    keywords: [
      "BISAR",
      "Швачки",
      "Rypin",
      "Рипін",
      "Bydgoszcz",
      "Бидгощ",
      "швейне",
      "оверлок",
      "JUKI",
      "мундири",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Робота у м. Rypin (109 км від Бидгоща). Приїзд на оформлення документів — місто Бидгощ (Bydgoszcz). Обов'язково потрібен досвід роботи швачкою на промислових машинах (оверлок).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Rypin",
    locationDescription:
      "Рипін (Rypin, 109 км від Бидгоща), проживання у місті Rypin.",
    voivodeship: "Куявсько-Поморське",
    country: "Польща",
    checkInCity: "Bydgoszcz",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.36 zł/год",
      studentNetto:
        "31.40 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "180–220",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "Передбачені додаткові бонуси за продуктивність та якість роботи.",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Робочий одяг власний.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 1,
      hoursPerShift: "11", // Згідно з годинами 06:00-17:00 / 07:00-18:00
      workDaysWeek: "Пн-Сб (6 днів на тиждень)",
      breakDuration: "Визначається внутрішнім розпорядком швейної фабрики.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Тільки денна зміна (БЕЗ НІЧНИХ): з 06:00 – 17:00 або з 07:00 – 18:00. Стабільний графік.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "400 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки з усіма необхідними зручностями. При заселенні потрібно мати власну постільну білизну та посуд.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details:
        "Інформація щодо доїзду до роботи надається на місці працевлаштування.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Жінки"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: true,
      entranceTestsDetails:
        "Перевірка швейних навичок на місці (якість шва на промисловій машині).",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Досвід роботи швачкою обов'язковий. Вміння працювати на промислових автоматичних машинах (5-нитковий широкий оверлок JUKI / SIRUBA). Гарний зір та точність.",
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
      specificConditionsDetails:
        "Кімнатна температура, чисте та сучасне швейне виробництво. Матеріал легкий у роботі, не тягнеться (тканина для мундирів).",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails:
        "На території підприємства є облаштоване місце для вживання власної їжі (їдальня).",
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
      "Пошиття виробів (зокрема військових мундирів) відповідно до технічної документації на автоматичних промислових машинах JUKI та SIRUBA (5-нитковий широкий оверлок). Контроль якості швів, дотримання охайності та точності виконання.",
    additionalNotes:
      "📍 Оформлення документів — місто Бидгощ (Bydgoszcz). Робота без нічних змін. Доступне та недороге житло.",
  },
  // === 11. LPP Pruszcz Gdański (Інтернет-магазин одягу) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "LPP Pruszcz Gdański - Інтернет-магазин одягу",
    vacancydescription:
      "Працівник складу брендового одягу та аксесуарів E-commerce (прийом, сортування, пакування, збір замовлень)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "LPP",
      "Pruszcz Gdański",
      "Прущ Гданський",
      "Gdańsk",
      "Гданськ",
      "E-COMMERCE",
      "Sinsay",
      "Reserved",
      "склад",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "LPP Pruszcz Gdański (10 км від Гданська). Сучасний логістичний центр E-commerce (відомі бренди Reserved, Cropp, Sinsay тощо). Приїзд на оформлення документів — Pruszcz Gdański.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Pruszcz Gdański",
    locationDescription:
      "Pruszcz Gdański (Прущ Гданський, 10 км від Гданська), місце проживання — Pruszcz Gdański / Gdańsk.",
    voivodeship: "Поморське",
    country: "Польща",
    checkInCity: "Pruszcz Gdański",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років за наявності довідки з навчального закладу).",
      hoursRange: "200–240",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails: "",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Робочий одяг власний.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration:
        "Стандартні оплачувані перерви згідно з внутрішнім розпорядком.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 8-12 годин залежно від обсягу замовлень. Передбачені оплачувані перерви.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "600 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортне проживання з усіма необхідними зручностями. При заселенні мати свій комплект постільної білизни.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований доїзд на роботу службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота на ногах. Вміння користуватися терміналом (сканером).",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Кімнатна температура (+20°C ... +22°C), сучасний склад.",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails:
        "На території є їдальня та місця для відпочинку працівників.",
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
      "Щодня бригадир зміни вирішує, на якому процесі працівник працюватиме: Przyjęcie/wysyłka — прийом або погрузка товару (процес переважно для чоловіків). R-Sort — прийом товару, перевірка його на брак, сканування штрих-кодів. Pack — пакування інтернет-замовлень. Pick — збір одягу з терміналом, розкладання одягу з терміналом. Інші дрібні процеси — маркування продукції, сортування тощо.",
    additionalNotes:
      "📍 Приїзд та оформлення документів — місто Pruszcz Gdański. Робочий одяг власний.",
  },
  // === 12. SOKOLÓW Sokołów Podlaski (М'ясне виробництво) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "SOKOLÓW Sokołów Podlaski - М'ясне виробництво",
    vacancydescription:
      "Робочий на м'ясокомбінаті (свинина: обвалка, жилування, пакування готової продукції)",
    category: "⚙️ Виробництво і прамысловасть / М'ясокомбінати та рибзаводи",
    keywords: [
      "BISAR",
      "SOKOLÓW",
      "Соколув",
      "Sokołów Podlaski",
      "м'ясо",
      "свинина",
      "обвалка",
      "жилування",
      "пакування",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Sokolów — один із найбільших виробників м'ясної продукції в Польщі. Робота у м. Соколув-Подляський (100 км від Варшави). Зверніть увагу на місце оформлення: кандидати спочатку їдуть на оформлення документів у Прущ-Гданський (Pruszcz Gdański), що знаходиться далеко від місця роботи.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Sokołów Podlaski",
    locationDescription:
      "Соколув-Подляський (Sokołów Podlaski, 100 км від Варшави), проживання там же.",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Pruszcz Gdański",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років з відповідними документами).",
      hoursRange: "220–260",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails: "Два безкоштовних гарячих обіди на день під час зміни.",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Робочий одяг видається безкоштовно.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration:
        "Оплачувані перерви згідно з внутрішнім розпорядком заводу.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 8-12 годин: перша зміна 06:00 – 18:00, друга зміна 18:00 – 06:00. Робота 5-6 днів на тиждень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "550 zł / місяць (утримується із зарплати)",
      details:
        "Комфортні будинки з усіма необхідними зручностями у місті Соколув-Подляський. При заселенні мати свій комплект постільної білизни.",
    },
    transport: {
      provided: true,
      costRaw: "50 zł / місяць",
      details:
        "Підприємство організовує та надає довіз до роботи. Вартість (50 зл) утримується із зарплати.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Два безкоштовних гарячих обіди на день під час робочої зміни.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Потрібна польська санітарна книжка (або готовність оформити на місці).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Готовність до фізичної праці стоячи в умовах зниженої температури.",
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
        "Халодний цех, робоча внутрішня температура: від +5°C до +7°C.",
      workwearFree: true,
      foodType: "Безкоштовно (2 рази на день)",
      foodDetails:
        "На території підприємства надається два безкоштовних гарячих обіди на день.",
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
      "Переробка м'яса (свинина): жилування та обвалка. Виготовлення м'ясної продукції. Пакування: робота на автоматизованих лініях пакування готової продукції (для жінок та чоловіків). Розкрій: робота на сирих лініях (для жінок та чоловіків). Додаткові процедури для чоловіків: завантаження товарів на піддони, розвантаження та переміщення піддонів, управління автоматизованою лінією.",
    additionalNotes:
      "📍 Важливо: Приїзд на оформлення документів — місто Прущ-Гданський (Pruszcz Gdański). Робочий одяг видається безкоштовно.",
  },
  // === 13. SPEDIMEX Stryków (Склад одягу інтернет-магазину) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "SPEDIMEX Stryków - Склад одягу інтернет-магазину",
    vacancydescription:
      "Працівник складу брендового одягу E-commerce (сортування повернень, пакування, зняття магнітних затискачів)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "SPEDIMEX",
      "Спедімекс",
      "Stryków",
      "Стрикув",
      "Lódź",
      "Лодзь",
      "Głowno",
      "Гловно",
      "одяг",
      "повернення",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Робота у м. Stryków. Приїзд на оформлення документів та проживання — місто Гловно (Głowno, 20 км від Лодзі). Кожен день керівник ставить перед працівниками конкретні завдання.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Stryków",
    locationDescription:
      "Stryków (Стрикув), місце проживання та оформлення документів — місто Гловно (Głowno, 20 км від Лодзі).",
    voivodeship: "Лодзинське",
    country: "Польща",
    checkInCity: "Głowno",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років за наявності довідки студента).",
      hoursRange: "200–240",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "+1.00 zł/год — надбавка за оренду власної квартири (за кожну відпрацьовану годину).",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Частина робочого одягу видається безкоштовно.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration:
        "Оплачувана перерва згідно з внутрішнім розпорядком складу.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 8-12 годин. Робота 5-6 днів на тиждень з оплачуваними перервами.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "600 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки у місті Гловно з усіма необхідними зручностями. При заселенні мати свій комплект постільної білизни.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований довіз до місця роботи службовим транспортом з Гловно та Стрикува.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за власне житло +1.00 zł/год.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Робота стоячи (на ногах). Базове вміння користуватися комп'ютером та ручним сканером. Уважність при перевірці товарів на брак.",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Теплий склад, температура в приміщенні: від +20°C до +22°C.",
      workwearFree: true,
      foodType: "За свій рахунок",
      foodDetails:
        "На території підприємства є їдальня та автомати з продажу напоїв.",
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
      "Кожен день керівник ставить конкретні завдання: зняття магнітних затискачів; сортування та перевірка одягу після повернення від клієнтів; сортування та пакування нових товарів; пакування та комплектація одягу, придбаного в інтернеті. Робота з комп'ютером та сканером.",
    additionalNotes:
      "📍 Приїзд на оформлення документів — місто Гловно (Głowno). Надаються штани, взуття та жилетка безкоштовно. Свою футболку мати обов'язково.",
  },
  // === 14. BORN2BE Pniewy (Інтернет-магазин взуття та одягу) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "BORN2BE Pniewy - Інтернет-магазин взуття та одягу",
    vacancydescription:
      "Працівник складу брендового одягу та взуття E-commerce (пакування, збір зі сканером, сортування, повернення)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "BORN2BE",
      "Pniewy",
      "Пневи",
      "Pruszków",
      "Прушків",
      "Grójec",
      "Груєць",
      "взуття",
      "одяг",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "BORN2BE Pniewy (біля Варшави). Проживання у м. Pruszków або м. Grójec. При заїзді в Grójec люди їздять на роботу самостійно місцевим транспортом. Приїзд на оформлення документів — місто Прушків (Pruszków).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Pniewy",
    locationDescription:
      "Pniewy (Пневи, біля Варшави), місце проживання — Прушків (Pruszków) або Гройєць (Grójec).",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Pruszków",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років за наявності довідки).",
      hoursRange: "220–260",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "Передбачені премії за продуктивність! Окрема ставка для операторів навантажувачів (UDT).",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Робочий одяг власний.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "10-12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration:
        "Оплачувані перерви згідно з внутрішнім розпорядком складу.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 10-12 годин: перша зміна 06:00 – 18:00, друга зміна 18:00 – 06:00. Робота 5-6 днів на тиждень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "580 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки з усім необхідним (кухня, ванна, пральна машина, мікрохвильова піч, Wi-Fi). Місто Pruszków або Grójec.",
    },
    transport: {
      provided: false, // Оскільки з Гройця їздять самі, ставимо false, а деталі розписуємо
      costRaw: "за власний рахунок",
      details:
        "При поселенні у місті Grójec працівники добираються до роботи самостійно місцевим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails:
        "Для звичайних працівників мова не потрібна. Для операторів навантажувачів (вузиків) потрібне знання польської мови на розмовному рівні.",

      physicalLoad:
        "Робота стоячи (на ногах). Вміння користуватися сканером. Для операторів вузиків — базове вміння користуватися комп'ютером (не боятися ПК).",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails: "Теплий сучасний склад, кімнатна температура.",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails:
        "На території підприємства є їдальня та облаштовані місця для відпочинку працівників.",
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
      "Склад спеціалізується на пакуванні, комплектації, зборі товарів за допомогою сканера. Процес Wysyłka: пакування інтернет-замовлень, сортування замовлень за країнами відправлення. Процес Zwroty: перевірка на брак повернених товарів, які не підійшли покупцям (перевірка на цілісність, наявність ґудзиків, плям, пошкоджень). Оператори Вузика: розвантаження та навантаження товарів, транспортування та розкладання товарів на складі.",
    additionalNotes:
      "📍 Оформлення документів — місто Прушків (Pruszków). Працівники мають мати власний зручний одяг для роботи.",
  },
  // === 15. GREENYARD Kwidzyn (Овочевий консервний завод) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "GREENYARD Kwidzyn - Овочевий консервний завод",
    vacancydescription:
      "Працівник овочевого консервного заводу (підготовка сировини, кукурудза/горошок, фасування, пакування)",
    category:
      "⚙️ Виробництво і прамысловасть / Харчова промисловість та переробка",
    keywords: [
      "BISAR",
      "GREENYARD",
      "Грін'ярд",
      "Kwidzyn",
      "Квідзин",
      "Gdańsk",
      "Гданськ",
      "кукурудза",
      "горошок",
      "овочевий",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Завод GREENYARD у Kwidzyn (80 км ад Гданська). Спеціалізується на виготовленні консерв, міксів та напівфабрикатів (кукурудза, горошок). Приїзд на оформлення документів — місто Прущ-Гданський (Pruszcz Gdański). Проживання та робота у місті Квідзин.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Kwidzyn",
    locationDescription:
      "Квідзин (Kwidzyn, 80 км від Гданська), проживання там же.",
    voivodeship: "Поморське",
    country: "Польща",
    checkInCity: "Pruszcz Gdański",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "24.63 zł/год",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років за наявності відповідних документів).",
      hoursRange: "168–184",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "Безкоштовні гарячі обіди та напої на території закладу під час робочої зміни.",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Фірма за власний рахунок виготовляє санітарну книжку для кожного працівника.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek:
        "Робота протягом 7 днів (зміни чергуються), передбачено 2 вихідних на тиждень.",
      breakDuration:
        "Оплачувані перерви згідно з внутрішнім розпорядком заводу.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у тризмінній системі по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "550 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки та квартири з усім необхідним (кухня, ванна, пральна машина, мікрохвильова піч, Wi-Fi).",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Доїзд до роботи не потрібен, житло знаходиться в пішій доступності до заводу (близько 15 хвилин пішки).",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Безкоштовні гарячі обіди та напої на території підприємства.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Обов'язкове проходження медогляду та виготовлення санітарної книжки (організовує та оплачує фірма).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Готовність до стоячої роботи на виробничій лінії в динамічному середовищі.",
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
      specificConditionsDetails:
        "Теплий цех, комфортна температура: від +15°C до +20°C.",
      workwearFree: true,
      foodType: "Безкоштовно (гарячі обіди)",
      foodDetails:
        "На території закладу є їдальня з безкоштовними гарячими обідами та напоями.",
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
      "Підготовка сировини до консервування (автоматизоване очищення кукурудзи / горошку). Контроль якості очищеної продукції на лінії. Фасування та сортування овочів. Укладання готової продукції в баночки/консерви. Упакування та маркування готових виробів. Додаткові процеси для чоловіків: погрузка товару на піддони, розгрузка та переміщення піддонів, контроль роботи автоматизованої лінії машин.",
    additionalNotes:
      "📍 Приїзд на оформлення документів — місто Прущ-Гданський (Pruszcz Gdański). Робочий одяг видається безкоштовно.",
  },
  // === 16. FIEGE Łozienica (Склад одягу на постійну основу) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "FIEGE Łozienica - Склад одягу (Постійна робота)",
    vacancydescription:
      "Робітник складу одягу на постійну основу (прийом, сканування, збір замовлень, пакування)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "BISAR",
      "FIEGE",
      "Фіге",
      "Łozienica",
      "Лозеніца",
      "Szczecin",
      "Щецин",
      "Gryfino",
      "Грифіно",
      "склад",
    ],
    contractType: "Umowa o pracę",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Робота у м. Łozienica (35 км від Щецина). Офіційне працевлаштування за Umowa o pracę. Приїзд на оформлення документів — місто Грифіно (Gryfino). Лише громадяни України. Увага: PESEL UKR не підходить! Житла для пар немає.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łozienica",
    locationDescription:
      "Łozienica (Лозеніца, 35 км від Щецина), проживання у місті Щецин.",
    voivodeship: "Західнопоморське",
    country: "Польща",
    checkInCity: "Gryfino",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "29.40 zł брутто/год (гарантований базовий тариф для Umowa o pracę).",
      studentNetto:
        "Ставка розраховується згідно із законодавством для Umowa o pracę.",
      hoursRange: "168–180",
      payoutDates: "Регулярно, 10 числа кожного місяця на банківський рахунок.",
      bonusDetails:
        "+15% премії від загальної суми (+600 zł брутто). Доплата +100% за роботу у святкові та вихідні дні.",
      salaryNotes:
        "Працівники мають право на оплачувану відпустку та лікарняні. Безкоштовний ланч і фрукти на зміні.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "5 днів на тиждень",
      breakDuration:
        "Оплачувана перерва згідно з Кодексом праці (Umowa o pracę).",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 8 годин: перша зміна 06:00 – 14:00, друга зміна 14:00 – 22:00. Робота 5 днів на тиждень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "450 zł / місяць (утримується із зарплати)",
      details:
        "Комфортні будинки у Щецині з усіма необхідними зручностями. УВАГА: житла для сімейних пар немає.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований доїзд на роботу зі Щецина службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовний ланч (4 рази на тиждень), безкоштовні фрукти (двічі на тиждень), натуральний чай і кава (не з автомату).",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"], // виключаємо пари
      ageMax: 50,
      nationalities: ["Україна"], // Тільки Україна
      standardDocs: ["Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Лише постійні документи (наприклад, віза від 7 місяців, вньосек на карту побиту, або вже готова карта побиту). PESEL UKR не підходить.",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Тільки для осіб, націлених на постійну довгострокову роботу (вік від 23 до 50 років).",
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
      specificNuances: ["Робота на ногах"],
      specificConditionsDetails:
        "Теплий склад, температура в приміщенні: від +20°C до +22°C.",
      workwearFree: true,
      foodType: "Безкоштовно (ланчі 4 рази на тиждень)",
      foodDetails:
        "На території підприємства є їдальня з безкоштовними ланчами та натуральними гарячимі напоями.",
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
      "RCV — приймання товару, маркування, сканування штрих-коду. STOW/PICK — розкладання та збирання одягу за допомогою терміналу. PACK — замовлення упаковки. СОРТУВАННЯ — сканування штрих-кодів і сортування товарів по коробках. Доставка (Shipping) — відправка готових посилок. Кожен день керівник ставить конкретні завдання.",
    additionalNotes:
      "📍 Приїзд на оформлення — місто Грифіно (Gryfino). Проживання у місті Щецин (Szczecin). Робочий одяг забезпечується безкоштовно.",
  },
  // === 17. KOOPEROL Zduny (Виробництво готових страв та морепродуктів) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "KOOPEROL Zduny - Виробництво готових страв та морепродуктів",
    vacancydescription:
      "Працівник харчового виробництва (виробництво голубців, фрикадельок та ролмопсів з оселедця)",
    category:
      "⚙️ Виробництво і прамысловасть / Харчова промисловість та переробка",
    keywords: [
      "BISAR",
      "Kooperol",
      "Куперол",
      "Zduny",
      "Здуни",
      "Gdańsk",
      "Гданськ",
      "Tczew",
      "Тчев",
      "голубці",
      "морепродукти",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Робота у м. Zduny (46 км від Гданська). Житло у містах Tczew / Swarożyn. Робота як з готовими стравами (голубці, фрикадельки), так і з рибою (ролмопси). Медичний огляд (санітарну книжку) повністю оплачує роботодавець. Вихід на роботу через 3-5 днів після приїзду.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Zduny",
    locationDescription:
      "Здуни (Zduny, 46 км від Гданська), місце проживання — Tczew або Swarożyn.",
    voivodeship: "Поморське",
    country: "Польща",
    checkInCity: "Tczew / Swarożyn",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.36 zł/год",
      studentNetto:
        "31.40 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "168–200",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "Передбачені додаткові бонуси за продуктивність та якість виконання процесів.",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Медичний огляд за рахунок фірми.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration:
        "Оплачувані перерви згідно з внутрішнім розпорядком заводу.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 8 годин: перша зміна 06:00 – 14:00, друга зміна 14:00 – 22:00. Робота 5-6 днів на тиждень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "550 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки у м. Tczew або Swarożyn з усіма зручностями. При заселенні потрібно мати власну постільну білизну та посуд.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Безкоштовний організований доїзд до місця роботи від місця проживання службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Покриття витрат на медичний огляд (санітарну книжку).",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Обов'язкове проходження медичного огляду (організовує та оплачує фірма).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Мануальні здібності (вміння швидко скручувати вироби — голубці/ролмопси). Відсутність алергії на рибу та готовність до роботи стоячи.",
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
      specificNuances: ["Холод (в окремих цехах)", "Рибний запах"],
      specificConditionsDetails:
        "Температура залежить від цеху: виробництво голубців (+22°C), холодний цех (+5...+8°C), пакування риби (+1...+2°C).",
      workwearFree: true,
      foodType: "За свій рахунок",
      foodDetails:
        "На території підприємства є облаштована їдальня для вживання власної їжі.",
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
      "Виробництво голубців, фрикадельок та експрес-страв: підготовка сировини, скручування голубців, формування фрикадельок, укладання в контейнери/банки, контроль лінії стерилізації. Виробництво ролмопсів: згортання філе оселедця з огірком, проколювання зубочисткою, пакування в банки за вагою. Додаткові процеси для чоловіків: приготування розсолу, вилов риби з бочок, подача сировини.",
    additionalNotes:
      "📍 Приїзд на оформлення — за 3-5 днів до початку роботи. Місце проживання — Tczew / Swarożyn. Робочий одяг, взуття та рукавички надаються за рахунок фірми.",
  },
  // === 18. KUCHNIA VIKINGA Białystok (Пакування кейтерингу) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "BISAR",
    templateName: "KUCHNIA VIKINGA Białystok - Пакування кейтерингу",
    vacancydescription:
      "Пакувальник дієтичного кейтерингу та помічник на кухні (приготування страв, зважування, пакування раціонів)",
    category:
      "⚙️ Виробництво і прамысловасть / Харчова промисловість та переробка",
    keywords: [
      "BISAR",
      "Kuchnia Vikinga",
      "Кухня Вікінга",
      "Białystok",
      "Білосток",
      "кейтеринг",
      "дієтичне харчування",
      "пакування",
    ],
    contractType: "Umowa zlecenie",

    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Kuchnia Vikinga — один із лідерів ринку кейтерингу в Польщі. Робота і проживання у м. Białystok (ul. Hurtowa 2 / ul. Handlowa 4). У роздягальнях немає індивідуальних шафок: цінні речі здаються керівнику зміни під розписку.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Białystok",
    locationDescription: "Білосток (Białystok), місце проживання — Білосток.",
    voivodeship: "Підляське",
    country: "Польща",
    checkInCity: "Białystok",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.36 zł/год",
      studentNetto:
        "31.40 zł/год (для студентів до 26 років за наявності довідки).",
      hoursRange: "168–200",
      payoutDates:
        "Регулярно, з 15 по 20 число кожного місяця на банківський рахунок.",
      bonusDetails:
        "-35% знижка для працівників на замовлення кейтерингу компанії через мобільний додаток.",
      salaryNotes:
        "У 2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Медогляд та оформлення санітарної книжки за кошти фірми.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "5-6 днів на тиждень (система 4/1)",
      breakDuration: "Оплачувані перерви згідно з розпорядком кухні.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 3 зміни по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00. Система 4/1. Після нічної зміни — 2 вихідні.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "750 zł / місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки у місті Білосток з усіма необхідними зручностями. При заселенні обов'язково мати свою постільну білизну та посуд.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Фірма купує проїзний квиток на місцеві автобуси BKM (маршрути 2, 6, 8, 11, 17). Зупинки за 500 м від заводу.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовний проїзний квиток на міський транспорт Білостока (BKM).",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Обов'язкове проходження медогляду та виготовлення санітарної книжки (організовує та оплачує фірма).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Вміння працювати в команді, швидкість, точність (зважування інгредієнтів пропорційно під калорійність). Готовність до стоячої роботи в прохолодному приміщенні.",
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
        "Холодний цех, робоча внутрішня температура: від 0°C до +6°C.",
      workwearFree: true,
      foodType: "За свій рахунок (знижка на продукцію)",
      foodDetails:
        "На території підприємства діє знижка 35% для працівників на замовлення кейтерингу в мобільному додатку.",
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
      "Допомога на кухні та пакування: приготування готових страв за стандартами якості та рецептурою, зважування та точне вимірювання інгредієнтів пропорційно під дієти та калорійність. Робота з кухонним обладнанням (міксери, слайсери, печі), пакування готових раціонів у контейнери. Підтримання чистоти на робочому місці згідно з санітарними нормами.",
    additionalNotes:
      "📍 Робота та оформлення документів — місто Білосток (Białystok). Робочий одяг видається безкоштовно за рахунок фірми. Працівникам обов'язково мати свій теплий одяг під спецівку.",
  },
];

module.exports = bisarTemplates;
