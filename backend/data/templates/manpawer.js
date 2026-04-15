// backend/data/templates/manpawer.js

const manpawerTemplates = [
  // Вакансія №1 - Hutchinson Bielsko-Biała (Mazańcowice)
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Hutchinson Bielsko-Biała Виробництво гумових шлангів для автомобільних систем охолодження та кондиціонування (Автомобільна промисловість)",
    vacancydescription:
      "Виробництво гумових шлангів для автомобільних систем охолодження та кондиціонування (Автомобільна промисловість) — Bielsko-Biała",
    category: "Автомобільна промисловість",
    keywords: [
      "Hutchinson",
      "Bielsko-Biała",
      "Mazańcowice",
      "Бєльско-Бяла",
      "автопром",
      "оператор машин",
      "гумові шланги",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Мануальні тести на 2-й день роботи. Можна з дітьми (оплата за дитину 800 зл наперед). Вік до 57 років. Початок роботи щопонеділка, іноді в четвер.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Bielsko-Biała",
    locationDescription: "Mazańcowice",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Bielsko-Biała",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "від 3800 до 4300 zł/міс нетто",
      studentNetto: "",
      hoursRange: "168 - 220",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Премія за відсутність прогулів 80 zł брутто. Додаток за нічні зміни 20%. Доплата за прання 42 zł. Бонус за роботу у вихідний (мін 4 год) 50 zł брутто.",
      salaryNotes:
        "Основна ставка 27,79 zł брутто/год. Доплата за доїзд 3 zł/км.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "4-бригадна система (2 дні робочі / 2 вихідні або 3/3)",
      breakDuration: "2 перерви по 20 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00-18:00, 18:00-06:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: true,
      withPets: false,
      costRaw: "800 zł/міс",
      details:
        "Хостел, 2-4 особи в кімнаті. ПЕРШІ 2 МІСЯЦІ БЕЗКОШТОВНО (акція). Депозит при поселенні 300 зл.",
    },
    transport: {
      provided: false,
      costRaw: "Власне",
      details: "Доїзд міським транспортом.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Доплата до житла 470 zł брутто протягом 180 днів. Картка MultiSport, Medicover, страхування PZU.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 57,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Мануальні тести на 2-й день роботи.",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Легка праця при обслуговуванні машин.",
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
      foodType: "Власне",
      foodDetails: "Є їдальня з мікрохвильовками та автоматами.",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "Депозит за житло 300 зл.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Обслуговування прес-формувальних та монтажних машин. Зварювання двох елементів на автоматичних машинах, пакування деталей у ящики, маркування (друк наклейок з кодами). Робота з труборізними машинами та мийками для знежирення.",
    additionalNotes:
      "Роботодавець надає повний соціальний пакет MANPAWERPremium. Можливість роботи в наднормові години (+100% оплата у вихідні).",
  },
  // Вакансія №2 - Hutchinson Żywiec 2
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Żywiec Виробництво гумових та пластикових шлангів для автомобільної промисловості (Автомобільна промисловість)",
    vacancydescription:
      "Виробництво гумових та пластикових шлангів для автомобільної промисловості (Автомобільна промисловість) — Żywiec",
    category: "Автомобільна промисловість",
    keywords: [
      "Hutchinson",
      "Żywiec",
      "Живець",
      "автопром",
      "оператор автоклава",
      "пари",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Кандидат має подивитися відео про продукцію перед подачею. Бонус за направлення друга 550 зл брутто.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Żywiec",
    locationDescription: "ul. Stolarska 23",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Katowice",
    salary: {
      baseNetto: "від 3500 до 4000 zł/міс нетто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Бонус за продуктивність до 250 zł брутто. Доплата до власного житла 470 zł брутто (180 днів).",
      salaryNotes:
        "Ставка: 32,90 zł брутто/год (автоклав), 29,30 zł брутто/год (оператор машини).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00-14:00, 14:00-22:00, 22:00-06:00",
    },
    accommodation: {
      type: "Безкоштовне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "Безкоштовно",
      details: "Перші 2 місяці проживання безкоштовне.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, страхування PZU.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 45,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Мануальні тести перед початком роботи.",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "Фізична підготовка для чоловіків (робота на автоклаві).",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Для чоловіків: експлуатація вулканізаційної машини, монтаж та зняття шлангів з фітингів, контроль якості, заповнення документів. Для жінок: обслуговування машин, перевірка продукту, монтаж шлангів.",
    additionalNotes:
      "Працевлаштування на основі трудового договору (Umowa o pracę). Можливість довгострокової співпраці та кар'єрного росту.",
  },
  // Вакансія №3 - McCormick Stefanowo-2
  {
    agencyName: "MANPAWER",
    templateName: "McCormick Stefanowo Виробництво та пакування спецій та приправ (Харчова промисловість)",
    vacancydescription: "Виробництво та пакування спецій та приправ (Харчова промисловість) — Stefanowo",
    category: "Харчова промисловість",
    keywords: [
      "Stefanowo",
      "Стефаново",
      "спеції",
      "UDT",
      "оператор машин",
      "пакування",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Обов'язково резюме польською мовою. Тільки з мовою B1. Рекрутація: тел. розмова -> розмова на заводі -> медогляд.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Stefanowo",
    locationDescription: "ul. Malinowa 18/20",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168+",
      payoutDates: "",
      bonusDetails:
        "Жінки: премія 10% за 4-бригадну систему. Нічні зміни +20%. Надгодини в суботу +100%.",
      salaryNotes:
        "Чоловіки: 34-37,50 zł брутто/год. Можлива ставка 7250 zł брутто/міс (для досвідчених з UDT, без житла). Жінки: 28 zł брутто/год.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Чоловіки: Пн-Пт. Жінки: 4-бригадна система.",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00-14:00, 14:00-22:00, 22:00-06:00",
    },
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "350-400 zł/міс",
      details: "Житло не надається при ставці 7250 зл брутто.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "З міст: Radom, Jedlińsk, Warka, Białobrzegi, Grójec, Tarczyn.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, страхування PZU, MyBenefit.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Sanepid (бажано), UDT (для чоловіків на кари)",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Середній",
      languageDetails: "Польська мова на рівні B1 обов'язкова.",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Запах приправ"],
      specificConditionsDetails: "Робота на виробництві спецій.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Чоловіки: подача продукції до машин, зважування спецій, обслуговування обладнання (в т.ч. навантажувачів при наявності UDT). Жінки: пакування приправ, контроль термінів придатності та якості готової продукції.",
    additionalNotes:
      "Офіційне працевлаштування, оплачувані відпустки та лікарняні.",
  },
  // Вакансія №4 - Mondelez Płońsk
  {
    agencyName: "MANPAWER",
    templateName: "Mondelez Płońsk Виробництво та фасування печива (Харчова промисловість)",
    vacancydescription:
      "Виробництво та фасування печива (Харчова промисловість) — Płońsk",
    category: "Харчова промисловість",
    keywords: [
      "Płońsk",
      "Плоньськ",
      "кондитерська фабрика",
      "печиво",
      "пакування",
      "жінки",
    ],
    contractType: "Umowa o pracę tymчасowa",
    forRecruiter: {
      internalNotes:
        "Тільки для жінок. Особиста зустріч в офісі Płońsk обов'язкова. Потрібен Sanepid.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Płońsk",
    locationDescription: "ul. Mazowiecka 5 (офіс)",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Płońsk",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Доплата за ніч +8 zł брутто/год. Робота в неділю +130 zł брутто. Квартальна премія до 10%. Картка Sodexo (2 зл за відпрацьований день).",
      salaryNotes:
        "Погодинна ставка 27,70 - 30,11 zł брутто (залежить від місяця).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "За графіком підприємства",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Велика мережа маршрутів: Płock, Czerwińsk, Wyszogród, Drobin, Raciąż, Glinojeck та ін.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, MyBenefit.",
    },
    requirements: {
      gender: ["Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка (Sanepid) обов'язкова.",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Потрібно розуміти польську мову.",
      physicalLoad: "Робота на лінії.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Збір готової продукції з лінії, фасування печива в пакети та коробки, маркування, контроль якості упаковки, підтримання порядку.",
    additionalNotes:
      "Робота на відомому кондитерському підприємстві. Пакет переваг MANPAWERGroup Premium.",
  },
  // Вакансія №5 - Allegro Adamów-1
  {
    agencyName: "MANPAWER",
    templateName: "Allegro Adamów Склад інтернет-магазину: комплектація та пакування товарів (Склади та логістика)",
    vacancydescription:
      "Склад інтернет-магазину: комплектація та пакування товарів (Склади та логістика) — Adamów",
    category: "Склади та логістика",
    keywords: [
      "Adamów",
      "Адамув",
      "склад",
      "e-commerce",
      "Allegro",
      "пакування",
      "сканер",
    ],
    contractType: "Umowa zlecenie",
    forRecruiter: {
      internalNotes:
        "Зустріч в офісі Grodzisk Mazowiecki. Досвід не обов'язковий, мова не обов'язкова.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Adamów",
    locationDescription: "",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Grodzisk Mazowiecki",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 240",
      payoutDates: "",
      bonusDetails:
        "Премія за продуктивність до 20%. Сезонний бонус 1000 zł брутто за 100% відвідуваність.",
      salaryNotes: "Базова ставка: 32,00 zł брутто/год.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "Пн-Пт + вихідні (за потреби)",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Зміни: 06:00–14:00, 14:00–22:00. Субота/неділя: 08:00–16:00.",
    },
    accommodation: {
      type: "Безкоштовне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "0",
      details: "Житло надається безкоштовно.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобус з міст: Warszawa, Żyrardów, Sochaczew, Skierniewice, Pruszków, Błonie, Grodzisk та ін.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Обід за 1 зл. MultiSport, Medicover, Generali.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "Знання мови не обов'язкове.",
      physicalLoad: "Робота на ногах, зі сканером.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Повноцінний обід на підприємстві за 1 зл.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Збирання (комплектація) замовлень за допомогою сканера, пакування товарів для відправлення клієнтам, прості складські роботи.",
    additionalNotes:
      "Робота на великому логістичному складі відомого маркетплейсу. Можливість працювати багато годин у сезон.",
  },
  // Вакансія №6 - Media Expert Łódź-1
  {
    agencyName: "MANPAWER",
    templateName: "Media Expert Łódź Склад побутової техніки та електроніки: комплектація та відвантаження (Склади та логістика)",
    vacancydescription:
      "Склад побутової техніки та електроніки: комплектація та відвантаження (Склади та логістика) — Łódź",
    category: "Склади та логістика",
    keywords: [
      "Łódź",
      "Лодзь",
      "Media Expert",
      "склад електроніки",
      "UDT",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки з гарною польською мовою B1. Зустріч в офісі Łódź, потім розмова з лідером на складі. Потрібно резюме.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Łódź",
    locationDescription: "Jędrzejowska 43a / 45a",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "Łódź",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168+",
      payoutDates: "",
      bonusDetails:
        "Премія 400 зл + 300-400 зл за відсутність пропусків. Нічні години +40%.",
      salaryNotes:
        "Ставки: Основні відділи 4900 брутто, Заладунок 5100 брутто, UDT 5300 брутто.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-10",
      workDaysWeek: "5 днів на тиждень (Нд-Пт)",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "Залежить від відділу: 14-22, 18-02, 20-06.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Безкоштовний автобус (крім складу Zakładowa).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Харчування за 2,5 зл. MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      additionalDocsDetails:
        "Для операторів: UDT IWJO/WJOII та досвід на retrak.",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Середній",
      languageDetails: "Рівень B1 — вільне спілкування.",
      physicalLoad:
        "Фізична праця на завантаженні/розвантаженні великої техніки.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Обіди за 2,5 зл.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Обслуговування сканера, комплектація замовлень (телефони, навушники або холодильники залежно від складу), розвантаження та завантаження автомобілів.",
    additionalNotes: "Надгодини: +50% у будні, +100% у вихідні.",
  },
  // Вакансія №7 - Brembo Częstochowa
  {
    agencyName: "MANPAWER",
    templateName: "Brembo Częstochowa Виробництво компонентів гальмівних систем для автомобілів (Автомобільна промисловість)",
    vacancydescription:
      "Виробництво компонентів гальмівних систем для автомобілів (Автомобільна промисловість) — Częstochowa",
    category: "Автомобільна промисловість",
    keywords: [
      "Częstochowa",
      "Ченстохова",
      "Brembo",
      "автопром",
      "ЧПУ",
      "цинкування",
      "монтаж",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки з комунікативною польською. Чоловіки — на цинкування, жінки — на монтаж. Потрібно резюме.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Częstochowa",
    locationDescription: "ul. Dekabrystów 67",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Częstochowa",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Надбавка за 4-бригади 630 зл брутто. Премія продукційна 7%. Нічні +20%.",
      salaryNotes: "24-25,60 zł брутто/год. Загалом бл. 4132 брутто + бонуси.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "4 дні ніч (22-06), 2 вих, 4 дні друга (14-22), 1 вих, 4 дні перша (06-14), 1 вих.",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "~1000 zł/міс",
      details: "Житло не надається, але агентство може дати контакти.",
    },
    transport: {
      provided: false,
      costRaw: "Власне",
      details: "Громадський транспорт (автобуси 15, 22, 24, трамвай).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, MyBenefit.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails:
        "Бажано вміння користуватися штангенциркулем та читати креслення.",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Польська мова обов'язкова.",
      physicalLoad: "Робота на виробничій лінії або верстатах ЧПУ.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Монтаж компонентів супортів, контроль якості, пакування. Цинкування: розміщення деталей на підвіски. Обробка деталей на верстатах ЧПУ за кресленнями.",
    additionalNotes: "Стабільна робота на відомому заводі гальмівних систем.",
  },
  // Вакансія №8 - Lantmannen Stanisławów Pierwszy
  {
    agencyName: "MANPAWER",
    templateName: "Lantmannen Stanisławów Pierwszy Харчове виробництво: пакування хлібобулочних виробів (Харчова промисловість)",
    vacancydescription: "Харчове виробництво: пакування хлібобулочних виробів (Харчова промисловість) — Stanisławów Pierwszy",
    category: "Харчова промисловість",
    keywords: [
      "Stanisławów Pierwszy",
      "Nieporęt",
      "пекарня",
      "пакування",
      "хліб",
      "Sanepid",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes: "Польська мова А2. Потрібен Sanepid. Житло не надається.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Stanisławów Pierwszy",
    locationDescription: "gmina Nieporęt (біля Варшави)",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails: "Премія до 10% (після 3 міс). Нічні +20%.",
      salaryNotes: "5966 zł брутто / місяць.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "4 дні 06-14 (1 вих), 4 дні 14-22 (1 вих), 4 дні 22-06 (2 вих).",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Самостійний доїзд.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, MyBenefit.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка (Sanepid) обов'язкова.",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Рівень А2.",
      physicalLoad: "Робота в теплих приміщеннях пекарні.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Пакування готової випічки, підготовка товару до відправлення (палетування), доставка сировини до лінії, підтримання порядку.",
    additionalNotes: "Робота на сучасному харчовому підприємстві.",
  },
  // Вакансія №9 - Hutchinson Bielsko-Biała (Повтор з уточненнями)
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Bielsko-Biała Обслуговування прес-формувальних машин для автопрому (Автомобільна промисловість)",
    vacancydescription: "Обслуговування прес-формувальних машин для автопрому (Автомобільна промисловість) — Bielsko-Biała",
    category: "Автомобільна промисловість",
    keywords: [
      "Bielsko-Biała",
      "Бєльско-Бяла",
      "Hutchinson",
      "мануальні тести",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes: "Беремо до 57 років. Можна з дітьми. Початок щопонеділка.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Bielsko-Biała",
    locationDescription: "Mazańcowice",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Bielsko-Biała",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 240",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Нічні +20%, доплата за доїзд 3 зл/км, прання 42 зл, вихідні +100%.",
      salaryNotes: "27,79 zł брутто/год.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "2 через 2 або 3 через 3",
      breakDuration: "2 по 20 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–18:00, 18:00–06:00",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: true,
      withPets: false,
      costRaw: "800 zł/міс",
      details: "Перші 2 місяці безкоштовно. Хостел 2-4 особи.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Міський транспорт.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата 470 брутто до ЗП за житло.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 57,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Мануальні тести на 2-й день.",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Обслуговування машин монтажу та зварювання. Робота з труборізними машинами. Пакування деталей.",
    additionalNotes: "Замовлення на 50 людей до кінця року.",
  },
  // Вакансія №10 - Hutchinson Dębica-1
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Zawada Виробництво силіконових ущільнювачів для авто та авіації (Автомобільна промисловість)",
    vacancydescription:
      "Виробництво силіконових ущільнювачів для авто та авіації (Автомобільна промисловість) — Zawada",
    category: "Автомобільна промисловість",
    keywords: ["Dębica", "Дембіца", "Zawada", "силікон", "авіація", "оператор"],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Польська А2 обов'язково. Житла немає, але є доплата. Екскурсія на завод перед роботою.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Zawada",
    locationDescription: "79N, 39-200 Dębica",
    voivodeship: "Podkarpackie",
    country: "Polska",
    checkInCity: "Dębica",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Нічні +20%. Групова премія 200 зл. Надбавка за посаду 20-30 зл/день.",
      salaryNotes: "4806 zł брутто / місяць.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00 – 14:00, 14:00 – 22:00, 22:00 – 06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "30-64 zł/міс",
      details:
        "Маршрути: Brzostek, Pilzno, Ropczyce, Wielopole Skrzyńskie, Nagoszyn.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Доплата 475 зл брутто до ЗП за власне житло. MultiSport, Medicover.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Рівень мінімум А2.",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Вирізання силіконових деталей та ременів, обслуговування прес-формувальних машин, контроль якості готових ущільнювачів.",
    additionalNotes:
      "Продукція використовується в автомобільній та авіаційній промисловості.",
  },
  // Вакансія №11 - Mahle Krotoszyn-1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Mahle Krotoszyn Оператор машин на заводі з виготовлення автомобільних деталей (Автомобільна промисловість)",
    vacancydescription:
      "Оператор машин на заводі з виготовлення автомобільних деталей (Автомобільна промисловість) — Krotoszyn",
    category: "Автомобільна промисловість",
    keywords: [
      "Mahle",
      "Krotoszyn",
      "Кротошин",
      "автодеталі",
      "оператор машин",
      "польська мова",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Обов'язкове CV польською мовою. Простий математичний тест польською на місці. Можна громадян Молдови, Білорусі, Грузії, Вірменії за умови знання мови (читання/письмо).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Krotoszyn",
    locationDescription: "ul. Mahle 6",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 200",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Премія 10% від ставки. Доплата за нічні +20%. Бонус 75 zł брутто за роботу у вихідні за графіком. Надгодини у вихідний +100%.",
      salaryNotes: "Основна ставка 4400 zł брутто/місяць.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система (6 робочих / 2 вихідних)",
      breakDuration: "20–30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "06:00–14:00, 14:00–22:00, 22:00–06:00 (2 ранки, 2 дні, 2 ночі, 2 вихідних)",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "50 zł",
      details:
        "Маршрути: Jarocin, Koźmin, Ostrów, Kobylin, Milicz, Zduny, Pleszew, Kobierno, Odolanów, Sulmierzyce.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, групове страхування.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь", "Молдова", "Грузія", "Вірменія"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Простий математичний тест польською мовою.",
      polishLanguageLevel: "Середній",
      languageDetails:
        "Мінімум базовий рівень: вміння читати та писати польською.",
      physicalLoad: "Робота стоячи, переміщення між машинами.",
    },
    // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ ===
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
      foodType: "Власне",
      foodDetails: "Є їдальня з мікрохвильовками.",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Контроль роботи кількох виробничих машин одночасно, моніторинг процесу виготовлення деталей, дотримання стандартів якості та порядку на робочому місці.",
    additionalNotes:
      "Стабільне працевлаштування на основі трудового договору. Пакет переваг MANPAWERGroup Premium.",
  },
  // Вакансія №12 - Hutchinson Żywiec 1
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Żywiec Виготовлення паливних систем та трубок для автомобільних кондиціонерів (Автомобільна промисловість)",
    vacancydescription:
      "Виготовлення паливних систем та трубок для автомобільних кондиціонерів (Автомобільна промисловість) — Żywiec",
    category: "Автомобільна промисловість",
    keywords: [
      "Hutchinson",
      "Żywiec",
      "Живець",
      "жінки",
      "автопром",
      "гнуття труб",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки для жінок. Мануальний тест польською мовою. Обов'язковий перегляд відео про продукцію.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Żywiec",
    locationDescription: "ul. Leśnianka 73",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Bielsko-Biała",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Премія до 100 zł брутто. Доплата за ніч +20%. Надгодини: будні +50%, субота +100%.",
      salaryNotes:
        "Ставка 28,61 zł брутто/год. Доплата за власне житло 475 зл брутто (перші 6 міс).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20–30 хв",
      canChooseShiftOnStart: false,
      description: "05:45–13:45, 13:45–21:45, 21:45–05:45",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: true,
      withPets: false,
      costRaw: "800 zł/міс",
      details:
        "Перші 2 місяці — БЕЗКОШТОВНО. Далі 800 зл. При поселенні з дитиною — 800 зл наперед за дитину.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд міським транспортом. Є безкоштовний паркінг.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, страхування PZU.",
    },
    requirements: {
      gender: ["Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Мануальний тест польською мовою.",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Потрібно розуміти інструкції.",
      physicalLoad: "Робота з використанням захисного взуття та окулярів.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Захисні окуляри"],
      specificConditionsDetails: "Обов'язкове взуття з металевим носком.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Обслуговування виробничих машин, контроль якості готових елементів паливних систем, перевірка робочого місця.",
    additionalNotes:
      "Робота на відомому заводі автокомпонентів. Пакет MANPAWER Group Premium.",
  },
  // Вакансія №13 - Mondelez Cieszyn
  {
    agencyName: "MANPAWER",
    templateName: "Mondelez Cieszyn Легка робота на виробництві вафельних батончиків: фасування та пакування (Харчова промисловість)",
    vacancydescription:
      "Легка робота на виробництві вафельних батончиків: фасування та пакування (Харчова промисловість) — Cieszyn",
    category: "Харчова промисловість",
    keywords: [
      "Cieszyn",
      "Цешин",
      "Mondelez",
      "солодощі",
      "пакування",
      "санепід",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Потрібен Sanepid (підприємство покриває витрати). Беремо громадян України, Білорусі, Молдови.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Cieszyn",
    locationDescription: "ul. Liburnia 15 (офіс)",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 200",
      payoutDates: "",
      bonusDetails:
        "Премія 10% після повного місяця. Доплата за ніч +20%. Доплата за неділю +132 zł брутто. Вихідні +100%.",
      salaryNotes:
        "Ставка 28,61 (після 3 міс — 29,76, після 6 міс — 30,51) zł брутто/год.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "Система 2 через 2",
      breakDuration: "20–30 хв",
      canChooseShiftOnStart: false,
      description: "06:00–18:00, 18:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Пішки або громадським транспортом.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Жінки"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Санітарна книжка (sanepid) — підприємство допомагає з оформленням.",
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "Легка ручна робота.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Теплі приміщення.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Збір солодкої продукції з лінії, фасування у пакети та коробки, маркування, контроль якості упаковки.",
    additionalNotes:
      "Є можливість переходу на посаду оператора продукції зі збільшенням ставки.",
  },
  // Вакансія №14 - Eurocomfort Leszno
  {
    agencyName: "MANPAWER",
    templateName: "Eurocomfort Leszno Виробництво матраців, подушок та ковдр (Виробництво та промисловість)",
    vacancydescription:
      "Виробництво матраців, подушок та ковдр (Виробництво та промисловість) — Leszno",
    category: "Виробництво та промисловість",
    keywords: [
      "Leszno",
      "Лешно",
      "IKEA",
      "матраци",
      "швачка",
      "склад",
      "II WJO",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes:
        "Кандидати мають добре говорити польською, українською, російською, англійською або іспанською (не мішати). Екскурсія на завод.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Leszno",
    locationDescription: "ul. Spółdzielcza 49",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 240",
      payoutDates: "",
      bonusDetails: "Премія за ефективність 200–500 zł брутто/місяць.",
      salaryNotes:
        "Ставки: Виробництво 30,50–35; Склад 30,50–35; Швачка 32 zł брутто/год.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "Пн-Пт",
      breakDuration: "2 перерви по 20 хв",
      canChooseShiftOnStart: false,
      description: "06:00-18:00, 18:00-06:00",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "500 zł",
      details: "Житло надається з 18.11.2025.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "Для складу — II WJO.",
      experienceRequired: true,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Або вільна укр/рос/англ/ісп.",
      physicalLoad: "Фізична робота на виробництві або складі.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Виробництво: склеювання матраців, одягання чохлів, пакування. Швачки: пошиття ковдр та чохлів. Склад: сканування, розміщення товару, робота на навантажувачі (II WJO).",
    additionalNotes: "Відоме підприємство, що працює для бренду IKEA.",
  },
  // Вакансія №15 - Mondelez Płońsk (B1)
  {
    agencyName: "MANPAWER",
    templateName: "Mondelez Płońsk Виробництво кондитерської продукції (печиво): збір з лінії та пакування (Харчова промисловість)",
    vacancydescription:
      "Виробництво кондитерської продукції (печиво): збір з лінії та пакування (Харчова промисловість) — Płońsk",
    category: "Харчова промисловість",
    keywords: ["Płońsk", "Плоньськ", "печиво", "жінки", "sanepid", "B1"],
    contractType: "Umowa o pracę tymczasową",
    forRecruiter: {
      internalNotes:
        "Тільки для жінок. Рівень польської B1 обов'язковий. Потрібно мати санепід книжку та досвід на виробництві.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Płońsk",
    locationDescription: "ul. Mazowiecka 5 (офіс)",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Доплата за ніч +8 zł брутто/год. Неділя +130 zł брутто. Квартальна премія до 10%. Sodexo 2 зл/день.",
      salaryNotes:
        "27,70 - 30,11 zł брутто/год. Договір 1/2 з доповненням до повного етапу.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "За графіком",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "06:00-14:00, 14:00-22:00, 22:00-06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Автобуси з Płock, Czerwińsk, Drobin, Raciąż та ін.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, MyBenefit.",
    },
    requirements: {
      gender: ["Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка (sanepid).",
      experienceRequired: true,
      hasEntranceTests: false,
      polishLanguageLevel: "Середній",
      languageDetails: "Польська мова B1 (читання/письмо/розмова).",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Збір готового печива з лінії, фасування, маркування, контроль якості пакування.",
    additionalNotes: "Місячні договори. Пакет MANPAWERGroup Premium.",
  },
  // Вакансія №16 - Bosch Łódź UDT
  {
    agencyName: "MANPAWER",
    templateName: "Bosch Łódź Обслуговування навантажувача та логістика на заводі побутової техніки (Склади та логістика)",
    vacancydescription:
      "Обслуговування навантажувача та логістика на заводі побутової техніки (Склади та логістика) — Łódź",
    category: "Склади та логістика",
    keywords: ["Łódź", "Лодзь", "UDT", "Bosch", "навантажувач", "категорія B"],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Обов'язкова комунікативна польська та права кат. B. Мануальні тести у клієнта.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Łódź",
    locationDescription: "Jędrzejowska / Lodowa / Papiernicza",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "Łódź",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 180",
      payoutDates: "",
      bonusDetails:
        "Премія до 250 zł брутто. Нічні +20%. Надгодини +50/100%. Обов'язкова субота (раз на міс) — бонус 150 зл.",
      salaryNotes: "33,00 zł брутто/год ≈ 5544 zł брутто/міс.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт (іноді суботи)",
      breakDuration: "20 хв + 2x5 хв",
      canChooseShiftOnStart: false,
      description: "6:00–14:00, 14:00–22:00, 22:00–6:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобуси з Grabów, Łęczyca, Ozorków, Zgierz, Piotrków Tryb. та районів Лодзі.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, Generali.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Права UDT та польські права категорії B.",
      experienceRequired: true,
      hasEntranceTests: true,
      entranceTestsDetails: "Мануальні тести на підприємстві.",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Теплі приміщення.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Транспортування компонентів зі складу до виробничого залу та готової продукції на склад готових виробів. Обслуговування навантажувача, прийом товару, сортування ящиків.",
    additionalNotes: "Робота на відомому підприємстві побутової техніки.",
  },
  // Вакансія №17 - Gestamp Wrocław UDT
  {
    agencyName: "MANPAWER",
    templateName: "Gestamp Wrocław Оператор навантажувача (UDT) та Milk-run на заводі автомобільних компонентів (Склади та логістика)",
    vacancydescription:
      "Оператор навантажувача (UDT) та Milk-run на заводі автомобільних компонентів (Склади та логістика) — Wrocław",
    category: "Склади та логістика",
    keywords: [
      "Wrocław",
      "Вроцлав",
      "UDT",
      "Gestamp",
      "навантажувач",
      "Milk-run",
      "SAP",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Потрібен діючий UDT та права кат. B. Досвід з SAP вітається.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Wrocław",
    locationDescription: "ul. Kwiatkowskiego 3",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "Wrocław",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 200",
      payoutDates: "",
      bonusDetails:
        "Щомісячна премія до 800 зл брутто. Дофінансування доїзду до 186 зл брутто.",
      salaryNotes: "4800 zł брутто/місяць (залежить від досвіду).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12",
      workDaysWeek: "Пн-Пт або 4-бригадна система",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "8-годинні (6-14-22) або 12-годинні в 4-бригадці.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд самостійний (автобус N319).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Сертифікат UDT, права кат. B.",
      experienceRequired: true,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "Milk-run передбачає транспортування ящиків до 25 кг.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Сучасне тепле приміщення.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Транспортування компонентів між складом і виробництвом, завантаження вантажівок, обслуговування газових/електричних навантажувачів, робота з SAP (друк етикеток).",
    additionalNotes:
      "Gestamp — великий виробник металевих конструкцій для авто.",
  },
  // Вакансія №18 - SFC Częstochowa
  {
    agencyName: "MANPAWER",
    templateName: "SFC Częstochowa Виготовлення гумових автозапчастин: обслуговування автоклавів та монтаж (Автомобільна промисловість)",
    vacancydescription:
      "Виготовлення гумових автозапчастин: обслуговування автоклавів та монтаж (Автомобільна промисловість) — Częstochowa",
    category: "Автомобільна промисловість",
    keywords: [
      "Częstochowa",
      "Ченстохова",
      "SFC",
      "автоклави",
      "гума",
      "важка робота",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes:
        "Чоловіки на автоклави — фізично важка робота. Висока температура влітку. Можна з мін. досвідом та мін. мовою.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Częstochowa",
    locationDescription: "ul. Legionów 244",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Częstochowa",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 220",
      payoutDates: "",
      bonusDetails:
        "Доплата за нічні ~5.5-5.7 зл/год. Робота у вихідний 62.64 zł/год брутто. Надгодини +50/100%.",
      salaryNotes: "Автоклави: 35 зл брутто/год. Монтаж: 30,50 зл брутто/год.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20–30 хв",
      canChooseShiftOnStart: false,
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Міський автобус 11.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Початковий",
      languageDetails: "Мінімальне знання польської.",
      physicalLoad: "Фізично важка робота в умовах високої температури.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Висока температура"],
      specificConditionsDetails: "Робота з гарячими формами та печима.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Потрібно мати свій замок для шафи.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Автоклави (ч): монтаж деталей у форми, обслуговування парових контейнерів. Монтаж (ч/ж): складання компонентів (затискачі, фітинги), маркування, сортування та пакування продукції.",
    additionalNotes: "Робота на виробництві гумових автокомпонентів.",
  },
  // Вакансія №19 - Brembo Dąbrowa Górnicza-1
  {
    agencyName: "MANPAWER",
    templateName: "Brembo Dąbrowa Górnicza Працівник виробничої лінії на заводі гальмівних дисків (Автомобільна промисловість)",
    vacancydescription:
      "Працівник виробничої лінії на заводі гальмівних дисків (Автомобільна промисловість) — Dąbrowa Górnicza",
    category: "Автомобільна промисловість",
    keywords: [
      "Dąbrowa Górnicza",
      "Даброва Гурнича",
      "Brembo",
      "гальмівні диски",
      "без мови",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки для чоловіків. Без знання польської мови (з 02.04.2026). Обов'язково рік досвіду на виробництві. Велика кількість надгодин.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Dąbrowa Górnicza",
    locationDescription: "",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Dąbrowa Górnicza",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 240",
      payoutDates: "",
      bonusDetails:
        "Додаток за 4-бригади 900 зл. Премія 8% (~362 зл) + виробнича 7% (~300 зл). Нічні +20%. Бон на харчування 630 зл.",
      salaryNotes: "База 27 zł брутто/год + численні додатки.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система (Пн-Нд)",
      breakDuration: "20–30 хв",
      canChooseShiftOnStart: false,
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобуси з графіка: Sosnowiec, Katowice, Bytom, Tychy, Jaworzno, Zawiercie та ін.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, Generali.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      experienceRequired: true,
      hasEntranceTests: false,
      polishLanguageLevel: "Не вимагається",
      languageDetails: "З 02.04.2026 беремо без мови.",
      physicalLoad: "Важка фізична праця, робота з гальмівними дисками.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Шум", "Запах"],
      specificConditionsDetails:
        "Ливарне виробництво, шліфування та фарбування.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Бон на харчування 630 зл брутто. Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Обслуговування ліній шліфування та фарбування гальмівних дисків. Підготовка контейнерів (рохла), відбір продукції, укладання в контейнери, контроль якості.",
    additionalNotes: "Brembo — світовий лідер у виробництві гальмівних систем.",
  },
  // Вакансія №20 - BSH Wrocław
  {
    agencyName: "MANPAWER",
    templateName: "BSH Wrocław Ручна збірка та контроль якості побутової техніки (Виробництво та промисловість)",
    vacancydescription:
      "Ручна збірка та контроль якості побутової техніки (Виробництво та промисловість) — Wrocław",
    category: "Виробництво та промисловість",
    keywords: ["Wrocław", "Вроцлав", "BSH", "побутова техніка", "збірка", "B1"],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки для чоловіків. Польська B1. Обов'язково 8 міс досвіду на виробництві та CV польською. Мануальні тести перед прийомом.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Wrocław",
    locationDescription: "ul. Żmigrodzka 143",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168+",
      payoutDates: "",
      bonusDetails:
        "Премія до 800 zł брутто. Нічні +20%. Субота +250 zł брутто. Надгодини +50/100%.",
      salaryNotes: "Ставка 30 zł брутто/год.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "Робота в 3 зміни.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд міським транспортом (трамваї 1, 7, 15, 16).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, Generali.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      experienceRequired: true,
      hasEntranceTests: true,
      entranceTestsDetails: "Мануальні тести на заводі.",
      polishLanguageLevel: "Середній",
      languageDetails: "Комунікативне знання (B1).",
      physicalLoad: "Ручна збірка компонентів.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Ручна збірка побутової техніки за допомогою інструментів, припасування елементів, перевірка готової продукції на наявність дефектів, контроль якості на лінії.",
    additionalNotes:
      "Відомий виробник побутової техніки. Пакет MANPAWERGroup Premium.",
  },
  // Вакансія №21 - Gestamp Wrocław (Автоматизована лінія)
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Gestamp Wrocław Робота на автоматизованій лінії виробництва автомобільних компонентів: пакування та контроль якості (Автомобільна промисловість)",
    vacancydescription:
      "Робота на автоматизованій лінії виробництва автомобільних компонентів: пакування та контроль якості (Автомобільна промисловість) — Wrocław",
    category: "Автомобільна промисловість",
    keywords: [
      "Wrocław",
      "Вроцлав",
      "автопром",
      "пакування",
      "контроль якості",
      "оператор лінії",
    ],
    contractType: "Umowa zlecenie",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Обов'язкова комунікативна польська мова. Перевіряти, чи працював кандидат раніше на цьому проекті. Зустріч в офісі ul. Swobodnej 1 або на заводі.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Wrocław",
    locationDescription: "ul. Kwiatkowskiego 3",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія до 800 zł брутто (ефективність + нічні + надгодини). 30 zł брутто на каву/солодощі. 130 zł брутто на карту SmartLunch.",
      salaryNotes:
        "Ставка: 30,50 zł брутто/год. Доплата за самостійний доїзд до 186 zł брутто.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12",
      workDaysWeek: "Пн-Пт або 4-бригадна система",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "3 зміни по 8 год (щотижнева ротація) або 2 зміни по 12 год (4-бригадка).",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло або дофінансування не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд громадським транспортом (автобус N319).",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU, MyBenefit, SmartLunch (130 зл).",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Читання, письмо та розмовна мова.",
      physicalLoad: "Робота на виробничій лінії.",
    },
    // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ ===
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
      specificConditionsDetails: "Теплі виробничі приміщення.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Карта SmartLunch на 130 зл брутто.",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Пакування автомобільних деталей, контроль якості продукції, виготовлення та обробка деталей, обслуговування виробничих машин.",
    additionalNotes:
      "Міжнародна компанія, що працює у понад 20 країнах. Стабільність та пакет MANPAWERGroup Premium.",
  },
  // Вакансія №22 - Gestamp Września
  {
    agencyName: "MANPAWER",
    templateName: "Gestamp Chocicza Mała Виробництво автомобільних компонентів: контроль якості або робота на навантажувачі UDT (Автомобільна промисловість)",
    vacancydescription:
      "Виробництво автомобільних компонентів: контроль якості або робота на навантажувачі UDT (Автомобільна промисловість) — Chocicza Mała",
    category: "Автомобільна промисловість",
    keywords: [
      "Września",
      "Вжесня",
      "Chocicza Mała",
      "контроль якості",
      "UDT",
      "автопром",
      "безкоштовне житло",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Позиція пакувальника неактуальна. Актуальні: Оператор якості та Оператор UDT. Зустріч в офісі Biuro OnSite у Września.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Chocicza Mała",
    locationDescription: "біля м. Września",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Września",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Квартальна премія 450 zł брутто. Нічні +20%. Надгодини +50/100%.",
      salaryNotes:
        "Якість: 30,00 zł брутто/год (~5000 брутто/міс). UDT: 30,25 zł брутто/год (5082 брутто/міс).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт або 4-бригадна система",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "06:00–14:00; 14:00–22:00; 22:00–06:00.",
    },
    accommodation: {
      type: "Безкоштовне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "0",
      details: "Хостел Alfa Marina. Поселення організовує агентство.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Самостійний доїзд.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Для оператора навантажувача — чинний сертифікат UDT.",
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Рівень А2/B1.",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Теплі виробничі приміщення.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Оператор якості: обслуговування зварювальної камери, контроль якості, заповнення техдокументації, робота з електроінструментами та ПК. Оператор UDT: завантаження/розвантаження, комплектація лінії, робота з SAP.",
    additionalNotes:
      "Безкоштовне житло — велика перевага. Робота в автомобільній галузі (металеві компоненти).",
  },
  // Вакансія №23 - Kerry Oleśnica-1
  {
    agencyName: "MANPAWER",
    templateName: "Kerry Oleśnica Виробництво харчових добавок та ароматизаторів: підготовка сировини та пакування (Харчова промисловість)",
    vacancydescription:
      "Виробництво харчових добавок та ароматизаторів: підготовка сировини та пакування (Харчова промисловість) — Oleśnica",
    category: "Харчова промисловість",
    keywords: [
      "Oleśnica",
      "Олешниця",
      "харчова промисловість",
      "ароматизатори",
      "sanepid",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Обов'язкове резюме та санітарна книжка (або готовність зробити). Зустріч в офісі Oleśnica.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Oleśnica",
    locationDescription: "ul. Energetyczna 13",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Бонус за присутність та якість 800 zł брутто. Нічні +20%. Надгодини +50/100%.",
      salaryNotes: "Ставка: 31,50 zł брутто/год.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "3 зміни, вихідні вільні.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається. Доплати немає.",
    },
    transport: {
      provided: true,
      costRaw: "320 zł/міс",
      details:
        "Службовий автобус з міст: Namysłów, Twardogóra, Syców, Międzybórz, Bierutów. Або дофінансування власного доїзду.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, Generali.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка (sanepid) обов'язкова.",
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "Перенесення контейнерів вагою 10–20 кг.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Запах харчових добавок"],
      specificConditionsDetails:
        "Робота згідно зі стандартами гігієни харчового виробництва. Обов'язковий захисний одяг.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Підготовка сировини: змішування панірування, спецій та добавок за інструкціями. Обслуговування процесів на лінії. Пакування та перенесення готової продукції.",
    additionalNotes:
      "Робота в стабільній міжнародній компанії харчової галузі.",
  },
  // Вакансія №24 - Faurecia Grójec
  {
    agencyName: "MANPAWER",
    templateName: "Faurecia Grójec Виготовлення каркасів та напрямних для автомобільних сидінь: обслуговування машин (Автомобільна промисловість)",
    vacancydescription:
      "Виготовлення каркасів та напрямних для автомобільних сидінь: обслуговування машин (Автомобільна промисловість) — Grójec",
    category: "Автомобільна промисловість",
    keywords: [
      "Grójec",
      "Груєць",
      "автопром",
      "каркаси сидінь",
      "чоловіки",
      "житло в Радомі",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки для чоловіків. Можна без знання мови та досвіду. Зустріч в офісі Grodzisk Mazowiecki.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Grójec",
    locationDescription: "",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Grodzisk Mazowiecki",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Продуктивна премія до 15%. Нічні +20%. Надгодини +50/100%.",
      salaryNotes: "4806 zł брутто/міс.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20–30 хв",
      canChooseShiftOnStart: false,
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00.",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "300 zł/міс",
      details: "Житло в м. Radom. Час доїзду до роботи приблизно 1,5 години.",
    },
    transport: {
      provided: true,
      costRaw: "Платний",
      details:
        "Довіз з міст: Radom, Wyśmierzyce, Białobrzegi, Falęcice, Sucha, Stanisławów, Warka.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, страхування.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Обслуговування машин на виробничій лінії, виготовлення напрямних для автомобільних сидінь, контроль процесу виробництва.",
    additionalNotes:
      "Стабільне працевлаштування на Umowa o pracę. Пакет MANPAWER Group Premium.",
  },
  // Вакансія №25 - McCormick Stefanowo-3
  {
    agencyName: "MANPAWER",
    templateName: "McCormick Stefanowo Оператор машин та навантажувачів на виробництві приправ: подача сировини та контроль якості (Харчова промисловість)",
    vacancydescription:
      "Оператор машин та навантажувачів на виробництві приправ: подача сировини та контроль якості (Харчова промисловість) — Stefanowo",
    category: "Харчова промисловість",
    keywords: [
      "Stefanowo",
      "Стефаново",
      "спеції",
      "UDT",
      "оператор машин",
      "sanepid",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки з санепід книжкою та UDT. Потрібне CV. Якщо ставка 7250 брутто — житло не надається.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Stefanowo",
    locationDescription: "ul. Malinowa 18/20",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails: "Нічні +20%. Надгодини (субота) +100%.",
      salaryNotes:
        "37,50 zł брутто/год (з UDT). Для досвідчених з мовою — 7250 zł брутто/міс (без житла).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00.",
    },
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "350–400 zł/міс",
      details: "Житло не надається при ставці 7250 зл.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобус з міст: Radom, Jedlińsk, Warka, Białobrzegi, Grójec, Tarczyn.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU, MyBenefit.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Санітарна книжка (sanepid) та сертифікат UDT обов'язково.",
      experienceRequired: true,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Особливо для ставки 7250 брутто.",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Запах приправ"],
      specificConditionsDetails: "Виробництво спецій.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Подача продукції в машину, зважування спецій, керування візком (до 30 см або вище при UDT), контроль виробничого процесу, контроль якості.",
    additionalNotes:
      "Пакет переваг MANPAWERGroup Premium. Безкоштовний транспорт на надгодини в суботу.",
  },
  // Вакансія №26 - Hitachi Łódź
  {
    agencyName: "MANPAWER",
    templateName: "Hitachi Łódź Оператор машин на виробництві ізоляційних матеріалів для трансформаторів (Виробництво та промисловість)",
    vacancydescription:
      "Оператор машин на виробництві ізоляційних матеріалів для трансформаторів (Виробництво та промисловість) — Łódź",
    category: "Виробництво та промисловість",
    keywords: [
      "Łódź",
      "Лодзь",
      "трансформатори",
      "столяр",
      "штангенциркуль",
      "оператор машин",
    ],
    contractType: "Umowa o pracę tymczasową",
    forRecruiter: {
      internalNotes:
        "Тільки для чоловіків. Комунікативна польська мова. Потрібне CV. Вміння користуватися штангенциркулем обов'язкове.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Łódź",
    locationDescription: "ul. Aleksandrowska 67/93",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "Łódź",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія до 800 zł брутто. Підвищена нічна доплата. Надгодини у вихідні до +200%.",
      salaryNotes: "5000 zł брутто / місяць.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "05:30–13:30; 13:30–21:30; 21:30–05:30.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Самостійний доїзд.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "Базове читання техкреслень.",
      polishLanguageLevel: "Середній",
      languageDetails: "Комунікативний рівень.",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Сучасне виробниче обладнання.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Обслуговування виробничих верстатів та інструментів, контроль точності за допомогою штангенциркуля, дотримання стандартів якості та техніки безпеки.",
    additionalNotes:
      "Націленість на довготривалу співпрацю. Внутрішні навчання.",
  },
  // Вакансія №27 - Brembo Dąbrowa Górnicza (CNC)
  {
    agencyName: "MANPAWER",
    templateName: "Brembo Dąbrowa Górnicza Візуальний контроль якості та обслуговування CNC машин на заводі гальмівних дисків (Автомобільна промисловість)",
    vacancydescription:
      "Візуальний контроль якості та обслуговування CNC машин на заводі гальмівних дисків (Автомобільна промисловість) — Dąbrowa Górnicza",
    category: "Автомобільна промисловість",
    keywords: [
      "Dąbrowa Górnicza",
      "Даброва Гурнича",
      "CNC",
      "штангенциркуль",
      "математика",
      "диски",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Польська B1/B2. Тест на знання математики (дроби) та уважність. Освіта мінімум профтех. Зустріч за адресою ul. Toruńska 7.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Dąbrowa Górnicza",
    locationDescription: "ul. Toruńska 7 (офіс)",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Dąbrowa Górnicza",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Доплата за 4-бригади 900 зл. Премії 8% та 7%. Нічні +20% та +3 зл/год. Надгодини +50/100%.",
      salaryNotes: "Ставка: 28,00 zł брутто/год.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система",
      breakDuration: "2 перерви по 15 хв",
      canChooseShiftOnStart: false,
      description:
        "4 ніч (2 вих), 4 день (1 вих), 4 ранок (1 вих). Графік на 4 міс вперед.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобуси з: Sosnowiec, Katowice, Mysłowice, Olkusz, Zawiercie та ін.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, MyBenefit.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: true,
      hasEntranceTests: true,
      entranceTestsDetails: "Математичний тест (дроби), тест на пошук помилок.",
      polishLanguageLevel: "Середній",
      languageDetails: "Рівень B1/B2.",
      physicalLoad: "Переважно сидяча робота.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Автомати з кавою, мікрохвильовки.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Візуальний контроль якості гальмівних дисків, перевірка дефектів, обслуговування виробничих машин з пультом керування, робота з лазером.",
    additionalNotes:
      "Вміння користуватися штангенциркулем та знання основ технічного креслення — обов'язкові.",
  },
  // Вакансія №28 - Unirubber Zielonka
  {
    agencyName: "MANPAWER",
    templateName: "Unirubber Zielonka Фізично важка робота на виробництві гумового грануляту (Виробництво та промисловість)",
    vacancydescription:
      "Фізично важка робота на виробництві гумового грануляту (Виробництво та промисловість) — Zielonka",
    category: "Виробництво та промисловість",
    keywords: [
      "Węgliniec",
      "Zielonka",
      "гума",
      "гранулят",
      "важка робота",
      "сезонна",
      "чоловіки",
    ],
    contractType: "Umowa o pracę tymczasową",
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки. Робота в брудному середовищі. Сезон з квітня по листопад. Реєстрація телефонічно.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Zielonka",
    locationDescription: "59-940 Węgliniec",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 200",
      payoutDates: "",
      bonusDetails:
        "Премія 500 – 1500 зл брутто (узнаваньова). Нічні +20%. Надгодини +50/100%.",
      salaryNotes:
        "База: 4806 zł брутто/місяць. Доплата за доїзд 200 – 250 зл.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт (іноді суботи)",
      breakDuration: "15-20 хв",
      canChooseShiftOnStart: false,
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00 (ротація щотижня).",
    },
    accommodation: {
      type: "Безкоштовне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "0",
      details: "Заселення від 01.04.2026.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Самостійний доїзд.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Початковий",
      languageDetails: "Базове розуміння для інструкцій.",
      physicalLoad: "Фізично важка робота в брудному середовищі.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Брудне середовище", "Гума"],
      specificConditionsDetails: "Виробництво гумового грануляту.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Обслуговування виробничих машин, допоміжні роботи, підтримання порядку, заміна ножів у машині.",
    additionalNotes: "Робота сезонна: з квітня до листопада.",
  },
  // Вакансія №29 - Hutchinson Bielsko-Biała (Оновлена)
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Bielsko-Biała Обслуговування машин для виготовлення автомобільних трубок: монтаж та зварювання (Автомобільна промисловість)",
    vacancydescription:
      "Обслуговування машин для виготовлення автомобільних трубок: монтаж та зварювання (Автомобільна промисловість) — Bielsko-Biała",
    category: "Автомобільна промисловість",
    keywords: [
      "Bielsko-Biała",
      "Бєльско-Бяла",
      "акція житло",
      "діти",
      "автопром",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Беремо до 57 років. Початок щопонеділка. АКЦІЯ: перші 2 місяці житло безкоштовно. Можна з дитиною (оплата за дитину 800 наперед).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Bielsko-Biała",
    locationDescription: "Mazańcowice",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Bielsko-Biała",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 240",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Доплата за 4-бригади. Нічні +20%. Доплата за доїзд 3 зл/км. Прання 42 зл. Вихідні +100%.",
      salaryNotes: "База: 27,79 zł брутто/год.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "2/2 або 3/3",
      breakDuration: "2 по 20 хв",
      canChooseShiftOnStart: false,
      description: "06:00–18:00, 18:00–06:00.",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: true,
      withPets: false,
      costRaw: "800 zł/міс",
      details:
        "Перші 2 місяці — БЕЗКОШТОВНО. Хостел 2-4 особи. Депозит 300 зл.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд міським транспортом.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Доплата 470 брутто до ЗП за житло (180 днів). MultiSport, Medicover.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 57,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Мануальні тести на 2-й день.",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Є їдальня.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details: "Депозит за житло 300 зл.",
    },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Обслуговування монтажних та зварювальних машин, робота з труборізними та мийними машинами, пакування, маркування деталей.",
    additionalNotes: "Замовлення на 50 людей. Допомога з картами побиту.",
  },
  // Вакансія №30 - Onnera Palmiry-1
  {
    agencyName: "MANPAWER",
    templateName: "Onnera Palmiry Збірка та монтаж промислових холодильних установок та миючих машин (Виробництво та промисловість)",
    vacancydescription:
      "Збірка та монтаж промислових холодильних установок та миючих машин (Виробництво та промисловість) — Palmiry",
    category: "Виробництво та промисловість",
    keywords: [
      "Palmiry",
      "Пальміри",
      "Czosnów",
      "Варшава",
      "монтер",
      "збірка",
      "електроінструмент",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Набір тільки зі знанням польської мови. Зустріч в офісі Nowy Dwór Mazowiecki.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Palmiry",
    locationDescription: "біля м. Czosnów",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Nowy Dwór Mazowiecki",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails: "Премія від 1-го місяця 500 zł брутто. Надгодини +50/100%.",
      salaryNotes: "4700 zł брутто / місяць.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20–30 хв",
      canChooseShiftOnStart: false,
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00.",
    },
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "300 zł/міс",
      details: "Хостел, 3–4 особи в кімнаті. Повністю укомплектоване.",
    },
    transport: {
      provided: true,
      costRaw: "0",
      details: "Безкоштовний доїзд з міст: Płońsk, Nowy Dwór Mazowiecki.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: true,
      hasEntranceTests: false,
      polishLanguageLevel: "Середній",
      languageDetails: "Обов'язкове знання мови.",
      physicalLoad: "Робота з інструментами (дриль, шуруповерт).",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Теплі виробничі приміщення.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Збірка корпусів пристроїв, монтаж електричних проводів, схем та гідравлічних систем, з'єднання корпусів з пластиковими компонентами, контроль якості.",
    additionalNotes:
      "Робота на лінії в команді по 5–10 осіб. Стабільність та пакет MANPAWERGroup Premium.",
  },
  // Вакансія №31 - Valeo Chrzanów
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Valeo Chrzanów Виробництво автомобільних ліхтарів та освітлювальних приладів: обслуговування пресів та контроль якості (Автомобільна промисловість)",
    vacancydescription:
      "Виробництво автомобільних ліхтарів та освітлювальних приладів: обслуговування пресів та контроль якості (Автомобільна промисловість) — Chrzanów",
    category: "Автомобільна промисловість",
    keywords: [
      "Chrzanów",
      "Хжанув",
      "автопром",
      "фари",
      "контроль якості",
      "оператор пресу",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Офіс: ul. Pilotów 2e, Kraków. Обов'язково хороший зір або окуляри. Готовність до роботи у вихідні.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Chrzanów",
    locationDescription: "50 км від Kraków",
    voivodeship: "Małopolskie",
    country: "Polska",
    checkInCity: "Kraków",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "від 4000 до 4300 zł/міс нетто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Премія VPS Bonus 430 zł брутто. Додаток за 4-бригадну систему 280 zł брутто. Доплата за неділю 30 zł брутто. Еквівалент за прання 34,8 zł.",
      salaryNotes:
        "Основна ставка 4666 zł брутто. Нічні +20%. Надгодини: будні +50%, вихідні +100%.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система (вихідні за графіком)",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      description: "06:00-14:00, 14:00-22:00, 22:00-06:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "200 zł/міс",
      details:
        "Перший місяць — безкоштовно. З 01.10.2025 інформація про відсутність житла (уточнювати).",
    },
    transport: {
      provided: false,
      costRaw: "Власне",
      details: "Пішки (2-3 км) або міським автобусом.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Доплата за власне житло 500 zł брутто. Карти MultiSport, Medicover, страхування.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Не вимагається",
      physicalLoad: "Робота стоячи.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня з автоматами та мікрохвильовками.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Обслуговування пресів (зокрема термопластавтоматів), обладнання для склеювання та автоматичної обробки ліхтарів. Контроль якості продукції на різних етапах виробництва.",
    additionalNotes:
      "Агенція допомагає з виготовленням Карт Побуту (6-9 місяців) та запрошень.",
  },
  // Вакансія №32 - Hutchinson Żywiec 2 (Autoklaw)
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Żywiec Виробництво металевих трубок та гумових елементів для авто: обслуговування автоклавів та печей (Автомобільна промисловість)",
    vacancydescription:
      "Виробництво металевих трубок та гумових елементів для авто: обслуговування автоклавів та печей (Автомобільна промисловість) — Żywiec",
    category: "Автомобільна промисловість",
    keywords: [
      "Żywiec",
      "Живець",
      "автоклав",
      "автопром",
      "оператор машин",
      "пари",
    ],
    contractType: "Umowa o pracę tymczasową",
    forRecruiter: {
      internalNotes:
        "Обов'язковий перегляд відео перед працевлаштуванням. Тести та розмова за адресою ul. Stolarska 23.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Żywiec",
    locationDescription: "ul. Stolarska 23",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Żywiec",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Премія за ефективність до 100 zł брутто. Нічні +20%. Надгодини +50/100%.",
      salaryNotes: "Жінки: 29,30 zł брутто/год. Чоловіки: 32,90 zł брутто/год.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      description: "05:45–13:45, 13:45–21:45, 21:45–05:45",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: true,
      withPets: false,
      costRaw: "800 zł/міс",
      details:
        "Перші 2 місяці — безкоштовно. Потім 800 зл. Оплата за дитину 800 зл наперед.",
    },
    transport: {
      provided: false,
      costRaw: "Власне",
      details: "Міський транспорт. Безкоштовний паркінг.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Доплата за власне житло 470 zł брутто (перші 6 міс). Medicover, MultiSport, Generali.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Мануальні тести та розмова на підприємстві.",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання мови обов'язкове.",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Захисні окуляри"],
      specificConditionsDetails: "Обов'язкове взуття з металевим носком.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є їдальня.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Для жінок: обслуговування машин, гнуття паливних систем, контроль якості. Для чоловіків: обслуговування автоклавів або печей, контроль параметрів процесу, перевірка техстану машин.",
    additionalNotes: "Рішення щодо робочого місця приймається після тестів.",
  },
  // Вакансія №33 - Mondelez Tomaszów Mazowiecki-1
  {
    agencyName: "MANPAWER",
    templateName: "Mondelez Tomaszów Mazowiecki Виробництво круасанів відомого бренду 7DAYS: формування, пакування та контроль якості (Харчова промисловість)",
    vacancydescription:
      "Виробництво круасанів відомого бренду 7DAYS: формування, пакування та контроль якості (Харчова промисловість) — Tomaszów Mazowiecki",
    category: "Харчова промисловість",
    keywords: [
      "Tomaszów Mazowiecki",
      "Томашув Мазовецький",
      "7DAYS",
      "круасани",
      "sanepid",
      "харчове виробництво",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Офіс: ul. Wysoka 31 (білий контейнер). Sanepid можна зробити в Medrom, ul. Partyzantów 4 (коштує 260 зл). Двотижневі договори з продовженням.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Tomaszów Mazowiecki",
    locationDescription: "ul. Wysoka 31",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "Tomaszów Mazowiecki",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Нічна зміна +50%. Вихідні +30%. Надгодини +50/100%. Премія до 5%.",
      salaryNotes:
        "Ставка 27,78 zł брутто/год. Доплата за власне житло 500 зл.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description:
        "4 дні ніч (2 вих), 4 дні день (1 вих), 4 дні ранок (1 вих).",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобуси з Opoczno та прилеглих населених пунктів (Bukowiec, Sławno та ін.).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 55,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка (sanepid) — обов'язкова.",
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Не вимагається",
      physicalLoad: "Ручні роботи, підняття та перестановка лотків.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: true,
      details: "Виготовлення санепід книжки (бл. 260 зл).",
    },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Формування булочок та круасанів, подача та зняття лотків з лінії, пакування готової продукції в картонні коробки, контроль якості.",
    additionalNotes:
      "Робота на основі Umowa o pracę tymczasowa. Тимчасовий договір зараховується до стажу роботи.",
  },
  // Вакансія №34 - Lear Legnica
  {
    agencyName: "MANPAWER",
    templateName: "Lear Legnica Виробництво металевих конструкцій для автомобільних сидінь: монтаж та обслуговування пресів (Автомобільна промисловість)",
    vacancydescription:
      "Виробництво металевих конструкцій для автомобільних сидінь: монтаж та обслуговування пресів (Автомобільна промисловість) — Legnica",
    category: "Автомобільна промисловість",
    keywords: [
      "Legnica",
      "Легниця",
      "автопром",
      "сидіння",
      "оператор пресу",
      "A2",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Обов'язкова польська мова A2. Потрібне CV для клієнта. Для оператора пресів — досвід від 2 років.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Legnica",
    locationDescription: "",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "від 4000 до 4500 zł/міс нетто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails: "Премія 12%. Нічні +20%. Надгодини +50/100%.",
      salaryNotes:
        "Виробництво: 5010 зл брутто. Преси: 5280 зл брутто. Доплата за житло 500 зл брутто.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "06:00-14:00, 14:00-22:00, 22:00-06:00",
    },
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "30 zł/доба",
      details: "Є можливість зняти житло за подобову оплату.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Автобуси з: Lubin, Głogów, Polkowice.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, страхування.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      experienceRequired: true,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Рівень А2 (читання, письмо, розмова).",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Монтаж каркасів сидінь, обслуговування зварювальних столів, лакування деталей. Оператори пресів: експлуатація автоматичних пресів, вимірювання інструментами (циркуль, мікрометр).",
    additionalNotes: "Оплачувані відпустки (2 дні на місяць) та лікарняні.",
  },
  // Вакансія №35 - GKN Oleśnica
  {
    agencyName: "MANPAWER",
    templateName: "GKN Oleśnica Виробництво приводних валів та компонентів трансмісії для автомобілів (Автомобільна промисловість)",
    vacancydescription:
      "Виробництво приводних валів та компонентів трансмісії для автомобілів (Автомобільна промисловість) — Oleśnica",
    category: "Автомобільна промисловість",
    keywords: [
      "Oleśnica",
      "Олешниця",
      "автопром",
      "трансмісія",
      "валі",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Обов'язкове CV для клієнта. Комунікативна польська мова. Виплата бл. 4000 нетто без надгодин.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Oleśnica",
    locationDescription: "",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "бл. 4000 zł/міс нетто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія 200 зл + 200 зл (узнаваньова). Нічні +25%. Надгодини +50/100%.",
      salaryNotes: "Ставка 5213 zł брутто/міс.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "06:00-14:00, 14:00-22:00, 22:00-06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Автобуси з: Twardogóra, Namysłów, Syców.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, страхування.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Експлуатація машин для виробництва піввалів та приводних валів, контроль готової продукції, виконання виробничих планів.",
    additionalNotes:
      "Можливість переходу на прямий контракт із заводом. Один із найбільших виробників у світі.",
  },
  // Вакансія №36 - Gates Legnica-1
  {
    agencyName: "MANPAWER",
    templateName: "Gates Legnica Виробництво високотехнологічних гумових ременів та шлангів для промисловості (Виробництво та промисловість)",
    vacancydescription:
      "Виробництво високотехнологічних гумових ременів та шлангів для промисловості (Виробництво та промисловість) — Legnica",
    category: "Виробництво та промисловість",
    keywords: ["Legnica", "Легниця", "Gates", "гума", "вулканізація", "ремені"],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Потрібне CV для клієнта. Зустріч після погодження клієнтом. Комунікативна польська (або без — уточнювати у консультанта).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Legnica",
    locationDescription: "",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "бл. 4300 zł/міс нетто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія до 570 зл + квартальна до 480 зл брутто. Нічні +20%. Надгодини +50/100%.",
      salaryNotes:
        "Ставка 28.72 - 30,10 zł брутто/год. Доплата за житло 300 зл.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "06:00-14:00, 14:00-22:00, 22:00-06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, страхування.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Робота на верстатах: завантаження матеріалу на рулони, підготовка до вулканізації, ручна обробка та огляд готового продукту, робота з ПК та принтером.",
    additionalNotes:
      "Лідер ринку гумових ременів. Оплачувані відпустки та лікарняні.",
  },
  // Вакансія №37 - Lisner Poznań-1
  {
    agencyName: "MANPAWER",
    templateName: "Lisner Poznań Пакування та сортування готової рибної продукції (Харчова промисловість)",
    vacancydescription:
      "Пакування та сортування готової рибної продукції (Харчова промисловість) — Poznań",
    category: "Харчова промисловість",
    keywords: [
      "Poznań",
      "Познань",
      "риба",
      "пакування",
      "санепід",
      "безкоштовні обіди",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Зустріч на прохідній (Strzeszyńska 38/42) з документом. Потрібна санепід книжка або готовність зробити. Температура 10-14 градусів.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Poznań",
    locationDescription: "ul. Strzeszyńska 38/42",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails: "Нічні +20%. Надгодини +50/100%.",
      salaryNotes: "28.58 zł брутто/год (~4800 брутто/міс) + премія.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "25 хв",
      canChooseShiftOnStart: false,
      description: "05:45-13:45, 13:45-21:45, 21:45-05:45",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобуси з: Gniezno, Wągrowiec, Września, Szamotuły, Czarnków та ін.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовний обід (1 раз) + 3 гарячі напої. MultiSport, Medicover, страхування.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка (sanepid).",
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Не вимагається",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Холодний склад (10-14°C)"],
      specificConditionsDetails:
        "Видається одноразовий захисний одяг та спецвзуття.",
      workwearFree: true,
      foodType: "Обіди",
      foodDetails: "1 безкоштовний обід на зміну.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Фасування та сортування готових рибних паст та салатів у баночки на лінії, транспортування продуктів, змішування інгредієнтів, прибирання робочого місця. Продукція не потребує чищення чи нарізки.",
    additionalNotes:
      "Робота в самому Познані. Пакет переваг MANPAWERGroup Premium.",
  },
  // Вакансія №38 - Chromavis Ciechanów
  {
    agencyName: "MANPAWER",
    templateName: "Chromavis Ciechanów Виробництво декоративної косметики: пакування та обслуговування лінії (Виробництво та промисловість)",
    vacancydescription:
      "Виробництво декоративної косметики: пакування та обслуговування лінії (Виробництво та промисловість) — Ciechanów",
    category: "Виробництво та промисловість",
    keywords: [
      "Ciechanów",
      "Чеханув",
      "косметика",
      "лаки для нігтів",
      "жінки",
      "безкоштовне житло",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки для жінок до 58 років. Обов'язкова санітарна книжка. Заборона біжутерії. Зустріч в офісі ul. Robotnicza 1.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Ciechanów",
    locationDescription: "",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 200",
      payoutDates: "",
      bonusDetails:
        "Премія 400 зл брутто (відвідуваність + продуктивність). Нічні +20%. Надгодини +50%.",
      salaryNotes: "4666 zł брутто / місяць.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description:
        "06:00–14:00, 14:00–22:00, 22:00–06:00. Можливі зміни по 9 год.",
    },
    accommodation: {
      type: "Безкоштовне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "0",
      details: "3-5 осіб в кімнаті. Обладнане технікою.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Організовується залежно від локалізації житла.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Жінки"],
      ageMax: 58,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка (sanepid).",
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Не вимагається",
      physicalLoad: "Фізично легка робота, переважно сидяча.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Заборона біжутерії", "Відсутність палильної зони"],
      specificConditionsDetails:
        "Виробництво косметичних засобів (лаки, змивки).",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Закручування ковпачків, вкладення щіточок у флакони, робота на лінії розливу, пакування готової продукції, обслуговування етикетувальних машин.",
    additionalNotes:
      "Безкоштовне житло поблизу підприємства. Пакет переваг MANPAWERGroup Premium.",
  },
  // Вакансія №39 - WND Rąbień
  {
    agencyName: "MANPAWER",
    templateName: "WND Rąbień Виробництво сучасних віконних систем: комплектація та збірка конструкцій (Виробництво та промисловість)",
    vacancydescription:
      "Виробництво сучасних віконних систем: комплектація та збірка конструкцій (Виробництво та промисловість) — Rąbień",
    category: "Виробництво та промисловість",
    keywords: ["Rąbień", "Робень", "вікна", "ПВХ", "склад", "чоловіки"],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки для чоловіків. Готовність до фізичної праці (профілі, вікна). Навчання 15 днів. Рекрутація через тел. розмову та візит на завод.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Rąbień",
    locationDescription: "ul. Sucha 1/3",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премії до 700 зл брутто (за рівнем кваліфікації) + 400 зл за відвідуваність. Надгодини +50/100%.",
      salaryNotes: "Рівень 1: 4700 зл брутто. Рівень 4: 5400 зл брутто.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "06:00–14:00, 14:00–22:00 (тижнева ротація).",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобуси з: Poddębice, Aleksandrów Łódzki, Łódź та ін. Є парковка.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, PZU.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "Переміщення віконних профілів та конструкцій.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Шум", "Робота на вулиці"],
      specificConditionsDetails:
        "Складські роботи частково виконуються на вулиці незалежно від погоди. Виробництво в шумних умовах.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Склад: доставка профілів на розрізання, комплектація готової продукції, пошук вікон за інструкцією, транспортування до відправки. Виробництво: автоматична збірка стандартних та нестандартних вікон.",
    additionalNotes:
      "Система 4 рівнів розвитку дозволяє швидко збільшити ставку.",
  },
  // Вакансія №40 - Corning Stryków-1
  {
    agencyName: "MANPAWER",
    templateName: "Corning Stryków Виготовлення оптичного кабельного з’єднання: обрізка, спаювання та контроль якості (Виробництво та промисловість)",
    vacancydescription:
      "Виготовлення оптичного кабельного з’єднання: обрізка, спаювання та контроль якості (Виробництво та промисловість) — Stryków",
    category: "Виробництво та промисловість",
    keywords: [
      "Stryków",
      "Стрикув",
      "оптичний кабель",
      "спаювання",
      "контроль якості",
      "житло",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Обов'язкове вміння обслуговувати комп'ютер. Агенція допомагає з картами побиту.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Stryków",
    locationDescription: "Smolice 1e",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Доплата за ніч 6 зл/год брутто. Премія 10% за відвідуваність. Доплата до обідів 10 зл.",
      salaryNotes:
        "33,00 zł брутто/год (після 3 міс — 33,50). Доплата за власне житло 300 зл брутто.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      description: "06:00-14:00, 14:00-22:00, 22:00-06:00",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "320 zł/міс",
      details: "Хостел, 3-4 особи в кімнаті. Всі умови.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобуси з: Łódź, Koluszki, Brzeziny, Zgierz, Łęczyca, Ozorków, Łowicz та ін.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "MultiSport, Medicover, Generali.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Не вимагається",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Доплата до їдальні 10 зл на обід.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Приготування робочого місця, відмірювання, обрізка, спаювання та кріплення проводів до з’єднувальних елементів. Контроль та перевірка якості кабелів з оптичного волокна. Обслуговування ПК.",
    additionalNotes:
      "Стабільне працевлаштування на основі Umowa o pracę. Пакет MANPAWERGroup Premium.",
  },
  // Вакансія №41 - Gillette Łódź-1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Gillette Łódź Обслуговування машин з виробництва станків для гоління, комплектація та пакування готової продукції (Виробництво та промисловість)",
    vacancydescription:
      "Обслуговування машин з виробництва станків для гоління, комплектація та пакування готової продукції (Виробництво та промисловість) — Łódź",
    category: "Виробництво та промисловість",
    keywords: [
      "Łódź",
      "Лодзь",
      "Gillette",
      "станки для гоління",
      "оператор машин",
      "контроль якості",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Вимагається комунікативна польська мова. Досвід роботи на виробництві понад 1 рік. Зустріч в офісі: ul. Kopcińskiego 79C, parter. Заборонено пірсинг та сережки (крім гвоздиків).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łódź",
    locationDescription: "Nowy Józefów",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "Łódź",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Додаток за 4-бригадну систему 700 зл брутто. Премія 100 зл (для 2-3 змін). Доплата за нічні зміни 20%. Роботодавець покриває 60% вартості обідів.",
      salaryNotes:
        "Основна ставка 4806 зл брутто/міс. Надгодини: +50% у будні, +100% у вихідні.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система або Пн-Пт (залежить від замовлення)",
      breakDuration: "1 перерва 30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "4-бригадна: 4 дні ранок (1 вих), 4 дні день (1 вих), 4 дні ніч (2 вих).",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається. Доплати за власне житло немає.",
    },
    transport: {
      provided: false,
      costRaw: "Власне",
      details:
        "Доїзд громадським транспортом (Retkinia -> автобус G1/G2). Є безкоштовний паркінг.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Субсидовані обіди (60%). Картка MultiSport, Medicover, Generali.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Читання, письмо та розмовна мова.",
      physicalLoad: "Робота в теплому приміщенні.",
    },
    // === 8. ВАДРЫХТОЎКА Ў ЕЎРОПУ ===
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    // === 9. СПЕЦЫФІЧНЫЯ ЎМОВЫ І ХАРЧАВАННЕ ===
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Заборона біжутерії", "Зібране волосся"],
      specificConditionsDetails:
        "Обов'язково: взуття з металевим носком, захисні окуляри, беруші. Заборонено розпущене волосся та пірсинг.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Роботодавець покриває 60% вартості обіду.",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Обслуговування машин, що виробляють елементи для засобів особистої гігієни. Контроль безперервної роботи пресформ, комплектація готових виробів, пакування та контроль якості перед відправкою.",
    additionalNotes:
      "Стабільне працевлаштування на основі Umowa o pracę. Пакет MANPAWERGroup Premium.",
  },
  // Вакансія №42 - Lisner Poznań-2
  {
    agencyName: "MANPAWER",
    templateName: "Lisner Poznań Фасування та пакування готової рибної продукції та салатів (Харчова промисловість)",
    vacancydescription:
      "Фасування та пакування готової рибної продукції та салатів (Харчова промисловість) — Poznań",
    category: "Харчова промисловість",
    keywords: [
      "Lisner",
      "Poznań",
      "риба",
      "салати",
      "пакування",
      "харчова промисловість",
      "безкоштовні обіди",
      "Wielkopolskie",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Адреса: Strzeszyńska 38/42, 60-479 Poznań. Потрібна книжечка санепід. Робота в прохолодному приміщенні (10-14°C).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Poznań",
    locationDescription: "ul. Strzeszyńska 38/42, 60-479 Poznań",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4800 зл брутто в місяць (28.58 зл/год брутто)",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія; доплата за нічні зміни +20%; додаток за надгодини +50% у робочі дні та +100% у вихідні.",
      salaryNotes: "Стабільна виплата на карту.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "25 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "I зміна: 05:45 - 13:45; ІІ зміна: 13:45 - 21:45. У період великих замовлень можлива нічна зміна.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний транспорт із міст: Czarnków, Mieleszyn, Gniezno, Wągrowiec, Damasławek, Sieraków, Szamotuły, Wolsztyn, Września.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Карта Multisport, страхування життя, приватне медичне обслуговування.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Книжечка санепід (або готовність до її виготовлення).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad:
        "Робота на лінії пакування, температура 10-14 градусів тепла.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Холодний склад (10-14°C)"],
      specificConditionsDetails:
        "Температура на підприємстві від 10 до 14 градусів тепла. Видається одноразовий одяг (штани, фартух, чепчик, рукавички), який одягається поверх свого, та робоче взуття.",
      workwearFree: true,
      foodType: "Обіди",
      foodDetails:
        "Безкоштовні обіди 1 раз на день і 2 безкоштовні гарячі напої протягом дня. Є їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Фасування та сортування готової рибної продукції (пасти, салати, оселедець). Працівник пакує готову продукцію на лінії в ємності, пластикові коробочки та баночки. До обов'язків також входить прибирання робочого місця, транспортування продуктів та змішування інгредієнтів. Продукція повністю готова, не потребує чищення чи нарізки. На лінії працює від 8-10 осіб.",
    additionalNotes:
      "Стабільна робота від зараз у лідера харчової промисловості. Вільні вихідні та можливість наднормових годин.",
  },
  // Вакансія №43 - Fiege Mszczonów (UDT)
  {
    agencyName: "MANPAWER",
    templateName: "Fiege Mszczonów Логістичний склад: навантаження та розвантаження товарів за допомогою вилочного навантажувача (Склади та логістика)",
    vacancydescription:
      "Логістичний склад: навантаження та розвантаження товарів за допомогою вилочного навантажувача (Склади та логістика) — Mszczonów",
    category: "Склади та логістика",
    keywords: ["Mszczonów", "Мщонув", "Fiege", "UDT", "навантажувач", "склад"],
    contractType: "Umowa zlecenie",
    forRecruiter: {
      internalNotes:
        "Обов'язкова наявність прав UDT. Можна без досвіду, але з правами. Співбесіда на заводі.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Mszczonów",
    locationDescription: "ul. Wiejska 2",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168 - 220",
      payoutDates: "",
      bonusDetails:
        "Бонус до 250 злотих брутто. Доплата за власний транспорт 300 зл.",
      salaryNotes: "Ставка 35,50 злотих брутто/год.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12",
      workDaysWeek: "Пн-Пт (можливі зміни за графіком)",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "6-14; 14-22; 22-6 або 6-18; 18-6.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "300 zł",
      details: "Доплата за власний транспорт — 300 зл.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Діючі права UDT (вилочний навантажувач).",
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Навантаження та розвантаження поставок згідно зі складською документацією, ведення звітності, обслуговування вилочного навантажувача.",
    additionalNotes:
      "Робота в дружній атмосфері. Група Fiege — великий міжнародний логістичний оператор.",
  },
  // Вакансія №44 - Lisner Poznań (Салати)
  {
    agencyName: "MANPAWER",
    templateName: "Lisner Poznań Виробництво та приготування рибних салатів та паст за рецептами (Харчова промисловість)",
    vacancydescription:
      "Виробництво та приготування рибних салатів та паст за рецептами (Харчова промисловість) — Poznań",
    category: "Харчова промисловість",
    keywords: [
      "Poznań",
      "Познань",
      "Lisner",
      "салати",
      "sanepid",
      "харчове виробництво",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Зустріч з консультантом Вікторією на прохідній. Агенція безкоштовно допомагає у виготовленні sanepid.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Poznań",
    locationDescription: "ul. Strzeszyńska 38/42",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Премія за ефективність. Доплати: ніч +20%, будні надгодини +50%, вихідні +100%.",
      salaryNotes: "5000 зл брутто/міс (29,77 зл/год брутто).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "25 хв",
      canChooseShiftOnStart: false,
      description: "05:45 - 13:45; 13:45 - 21:45; 21:45 – 5:45.",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобуси з: Czarnków, Mieleszyn, Gniezno, Wągrowiec, Damasławek, Sieraków, Szamotuły, Wolsztyn, Września.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовні обіди та напої. MultiSport, Medicover, страхування життя.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка (sanepid) — обов'язкова.",
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Не вимагається",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Холодний склад (10-14°C)"],
      specificConditionsDetails:
        "Надається захисний одноразовий одяг та робоче взуття.",
      workwearFree: true,
      foodType: "Обіди",
      foodDetails: "Безкоштовні обіди та гарячі напої.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Приготування салатів і паст за рецептами, поєднання інгредієнтів, сегрегація продуктів, укладання запакованої продукції в коробки або на піддони, доставка упаковки на станції.",
    additionalNotes: "Вільні вихідні. Стабільна робота на Umowa o pracę.",
  },
  // Вакансія №45 - Lisner Poznań-3
  {
    agencyName: "MANPAWER",
    templateName: "Lisner Poznań Працівник виробництва у відділ конфекції (рибна продукція) (Харчова промисловість)",
    vacancydescription:
      "Працівник виробництва у відділ конфекції (рибна продукція) (Харчова промисловість) — Poznań",
    category: "Харчова промисловість",
    keywords: [
      "Lisner",
      "Poznań",
      "рибна продукція",
      "конфекція",
      "етикетування",
      "маркування",
      "холодний склад",
      "безкоштовні обіди",
      "Wielkopolskie",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Відділ конфекції (magazyn konfekcja). Температура 4 градуси. Потрібна книжечка санепід (направляємо безкоштовно). 1 місце для чоловіка та 1 місце для жінки.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Poznań",
    locationDescription: "м. Познань",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "28,58 зл/год брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія в залежності від ефективності цілого відділу; оплата нічних змін +20%.",
      salaryNotes:
        "Надгодини: +50% у робочі дні та +100% у вихідні. Оплачувана відпустка та лікарняні.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт (можливі суботи)",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "05:45 – 13:45, 13:45 – 21:45, 21:45 – 05:45.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний транспорт із найближчих міст: Czarnków, Mieleszyn, Gniezno, Wągrowiec, Damasławek, Sieraków, Szamotuły, Wolsztyn, Września.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Карта Multisport, страхування життя, приватне медичне обслуговування Medicover.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Книжечка санепід (якщо немає, видається направлення на безкоштовні аналізи).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Робота в холодному приміщенні (4°C).",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Холодний склад (4°C)"],
      specificConditionsDetails:
        "Температура на робочому місці 4 градуси тепла. Видається одноразовий одяг (штани, фартух, чепчик, рукавички), який одягається поверх свого, та робоче взуття.",
      workwearFree: true,
      foodType: "Обіди",
      foodDetails:
        "Безкоштовні обіди 1 раз на день і 2 безкоштовні гарячі напої протягом дня. Є їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Етикетування, маркування та перепакування готової рибної продукції (пасти, салати, закуски). Перевірка та контроль якості продукції на відповідність стандартам. Робота з машинами та обладнанням на виробництві. Продукція вже готова та оброблена.",
    additionalNotes:
      "Стабільна робота у лідера харчової промисловості. Допомога з виготовленням санепід книжки.",
  },
  // Вакансія №46 - MAN Trucks Niepołomice-1
  {
    agencyName: "MANPAWER",
    templateName: "MAN Trucks Niepołomice Збірка вантажних автомобілів відомого бренду на сучасному конвеєрі (Автомобільна промисловість)",
    vacancydescription:
      "Збірка вантажних автомобілів відомого бренду на сучасному конвеєрі (Автомобільна промисловість) — Niepołomice",
    category: "Автомобільна промисловість",
    keywords: [
      "Niepołomice",
      "Неполоміце",
      "MAN",
      "збірка авто",
      "вантажівки",
      "чоловіки",
      "B1",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки для чоловіків. Польська B1-B2 обов'язково (кандидат підписує заяву про рівень мови). Потрібне резюме. Перший контракт до серпня (до виробничої перерви).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Niepołomice",
    locationDescription: "біля Кракова",
    voivodeship: "Małopolskie",
    country: "Polska",
    checkInCity: "Niepołomice",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "бл. 7300 zł/міс брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Премія до 15%. Надбавки за відвідування, харчування та прання. Доплата за житло 650 зл брутто (перші 3 міс).",
      salaryNotes:
        "База 6069 зл брутто. Пакет доплат робить загальну суму бл. 7300 брутто.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "6-14, 14-22, 22-6.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається. Перші 3 місяці доплата 650 зл брутто.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Employee Transport безкоштовний для працівників.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Дофінансування харчування. Пакет MANPAWER Group Premium.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Резюме"],
      needsAdditionalDocs: false,
      experienceRequired: true,
      hasEntranceTests: false,
      polishLanguageLevel: "Середній",
      languageDetails: "Комунікативна польська B1/B2 обов'язково.",
      physicalLoad:
        "Робота з електроінструментами та пневматичними викрутками.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Доплата за харчування входить у бонусну частину.",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Збірка деталей автомобіля згідно з інструкціями на конвеєрі (від рами до готового авто). Закручування пневматичними та електроінструментами, монтаж пневматичних та електричних джгутів, використання комп'ютерних систем.",
    additionalNotes:
      "Один із найсучасніших заводів у виробничій мережі відомого бренду вантажівок.",
  },

  // Вакансія №47 - Media Expert Łódź-2
  {
    agencyName: "MANPAWER",
    templateName: "Media Expert Łódź Склад електронної техніки: комплектація, розвантаження та обслуговування сканера (Склади та логістика)",
    vacancydescription:
      "Склад електронної техніки: комплектація, розвантаження та обслуговування сканера (Склади та логістика) — Łódź",
    category: "Склади та логістика",
    keywords: [
      "Media Expert",
      "Łódź",
      "склад",
      "електроніка",
      "сканер",
      "UDT",
      "retrak",
      "чоловіки",
      "комплектація",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки (жінки лише на Zakładowa 90/92). Вимога до зросту: мінімум 1.75 м. Мова А2. Відділ повернень вимагає вільну польську (мова + письмо). Оператор UDT (retrak) — обов'язковий досвід. ВАЖЛИВО: від травня житла та додатка за власне житло не буде.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Łódź",
    locationDescription:
      "Jędrzejowska 45a, Jędrzejowska 43a, Zakładowa 90/92, ul. Józefów 3C",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4900 - 5300 зл брутто/міс",
      studentNetto: "",
      hoursRange: "168-200",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія 400 зл брутто; бонус за відсутність пропусків 300-550 зл брутто; додаток за нічні години 40%.",
      salaryNotes:
        "Ставки за відділами: Загальний — 4900, Заладунка — 5100, Повернення — 4900, UDT — 5300. Надгодини: +50%, +100%. Харчування коштує 2,5 зл.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-10",
      workDaysWeek: "Нд-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "Відділ та графік визначаються на складі.",
      description:
        "2 або 3 зміни. Робота з неділі по п'ятницю. Вихідний у суботу та один день серед тижня.",
    },
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "280 зл/міс",
      details:
        "Житло надається за 280 зл/міс (до травня). 3-4 особи в кімнаті. Дофінансування до власного житла 250 зл брутто (на 6 міс, до травня).",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний автобус для працівників (крім локації Zakładowa 90/92 — туди доїзд самостійний).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, страхування PZU.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "Для операторів — права UDT (retrak).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Початковий (А2)",
      languageDetails:
        "Для відділу повернень — вільна польська (мова та письмо).",
      physicalLoad:
        "Зріст мінімум 1.75 м. Робота з різними габаритами техніки (від телефонів до холодильників).",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Приміщення теплі.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails:
        "Харчування за 2,5 зл. Їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування сканера та комплектація замовлень електронної техніки. Розвантаження і завантаження вантажних автомобілів. Навколоскладські роботи. Робота на різних типах складів: від дрібних гаджетів до великої побутової техніки (холодильники, пральні машини).",
    additionalNotes:
      "Допомога у виготовленні карт побиту та запрошень. Стабільна робота у великій торговельній мережі.",
  },
  // Вакансія №48 - Pro Cars Tychy
  {
    agencyName: "MANPAWER",
    templateName: "Pro Cars Tychy Робота на пресах: формування металевих деталей для автомобільної промисловості (Автомобільна промисловість)",
    vacancydescription:
      "Робота на пресах: формування металевих деталей для автомобільної промисловості (Автомобільна промисловість) — Tychy",
    category: "Автомобільна промисловість",
    keywords: ["Tychy", "Тихи", "автопром", "прес", "металеві деталі", "акорд"],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Чоловіки та пари до 45 років. Робота на акорд (виконання норми). Офіс: Al. Niepodleglości 55, Tychy.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Tychy",
    locationDescription: "ul. Podleska 16",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Tychy",
    salary: {
      baseNetto: "від 4800 zł/міс нетто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "10 числа",
      bonusDetails:
        "Премія за відвідування 300 зл + якість до 500 зл. Квартальна премія 300-600 зл. Субота +60 зл додатково.",
      salaryNotes:
        "Денна ставка за норму 272 зл брутто. Загалом бл. 5000-5300 брутто. Надгодини +50/100%.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Нд (згідно графіка)",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "6-14, 14-22, 22-6.",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, але агентство допомагає знайти.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Самостійний доїзд.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Оплачувана відпустка (2 дні/міс). Карта MultiSport за 103 зл.",
    },
    requirements: {
      gender: ["Чоловіки", "Пари"],
      ageMax: 45,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: false,
      experienceRequired: false,
      hasEntranceTests: false,
      polishLanguageLevel: "Не вимагається",
      physicalLoad: "Робота з металевими деталями.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Робота на пресах: вкладання металевого листа, запуск машини, виймання готової деталі, візуальний контроль якості, пакування в ящики.",
    additionalNotes:
      "Платні лікарняні та відпустка. Беремо громадян України, Білорусі, Молдови.",
  },
  // Вакансія №49 - Nexteer Tychy
  {
    agencyName: "MANPAWER",
    templateName: "Nexteer Tychy Оператор машин на виробництві автомобільних рульових систем (Автомобільна промисловість)",
    vacancydescription:
      "Оператор машин на виробництві автомобільних рульових систем (Автомобільна промисловість) — Tychy",
    category: "Автомобільна промисловість",
    keywords: [
      "Nexteer",
      "Tychy",
      "автомобільна промисловість",
      "рульові системи",
      "оператор машин",
      "збірка",
      "контроль якості",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Знання польської мови на комунікативному рівні (А2). Базова ставка підвищується через місяць. Співфінансування харчування 300 зл/міс.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Tychy",
    locationDescription: "ul. Towarowa 6",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "27 - 28 зл брутто/год",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "Щомісячний бонус до 300 зл; доплата за нічні зміни 20%.",
      salaryNotes:
        "Ставка 27 зл/год, через місяць — 28 зл/год. Оплата надгодин 100%. Співфінансування харчування 300 зл/міс.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "Робота в 3-змінній або 4-бригадній системі.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Зручне розташування — зупинка прямо навпроти підприємства.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Приватне медичне обслуговування, картка MultiSport, групове страхування, професійне навчання, інтеграційні заходи.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Початковий (А2)",
      languageDetails: "Знання польської мови на комунікативному рівні.",
      physicalLoad:
        "Обслуговування машин, компонентна збірка, контроль якості.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails:
        "Циклічні кампанії по зміцненню здоров'я (тести та лікування).",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Співфінансування харчування 300 злотих на місяць.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування машин на виробництві автомобільних рульових систем. Компонентна збірка деталей. Контроль якості готової продукції на відповідність технічним стандартам.",
    additionalNotes:
      "Допомога в отриманні посвідки на проживання (карта побиту). Можливість професійного розвитку.",
  },
  // Вакансія №50 - Gestamp Chocicza Mała (Suwnica)
  {
    agencyName: "MANPAWER",
    templateName: "Gestamp Chocicza Mała Обслуговування кран-балки (сувниці) з рівня підлоги на сучасному автомобільному заводі (Автомобільна промисловість)",
    vacancydescription:
      "Обслуговування кран-балки (сувниці) з рівня підлоги на сучасному автомобільному заводі (Автомобільна промисловість) — Chocicza Mała",
    category: "Автомобільна промисловість",
    keywords: [
      "Chocicza Mała",
      "Września",
      "Gestamp",
      "сувниця",
      "UDT IIS",
      "автопром",
      "безкоштовне житло",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Обов'язкові права UDT IIS (сувниця з рівня підлоги). Комунікативна польська мова. Поселення тільки після розмови.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Chocicza Mała",
    locationDescription: "новий завод поблизу м. Września",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Września",
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Квартальна премія 625 зл брутто. Нічні +20%. Надгодини +50/100%.",
      salaryNotes: "Ставка 4800–5000 злотих брутто/місяць.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      description: "Робота в 3-змінному режимі.",
    },
    accommodation: {
      type: "Безкоштовне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "0",
      details: "Безкоштовне житло надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Доїзд від житла організований.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Пакет MANPAWERGroup: Medicover, MultiSport.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Дійсні UDT-права на обслуговування сувниці (IIS).",
      experienceRequired: true,
      hasEntranceTests: false,
      polishLanguageLevel: "Комунікативний",
      languageDetails: "",
      physicalLoad: "",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: { hasStartExpenses: false, details: "" },
    earlyTerminationLiability: { hasLiability: false, details: "" },
    description:
      "Заміна інструментів на лінії, переналаштування виробничих версій, транспортування інструментів до пресів за допомогою кран-балки (сувниці) з рівня підлоги, контроль техстану обладнання.",
    additionalNotes:
      "Сучасний завод. Можливість переходу на прямий контракт із підприємством.",
  },
  // Вакансія №51 - U Form Bieruń
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "U Form Bieruń Робота на пресах та обслуговування машин на заводі автодеталей (Автомобільна промисловість)",
    vacancydescription:
      "Робота на пресах та обслуговування машин на заводі автодеталей (Автомобільна промисловість) — Bieruń",
    category: "Автомобільна промисловість",
    keywords: [
      "Bieruń",
      "Бєрунь",
      "преси",
      "автомобільна промисловість",
      "штампування",
      "металеві деталі",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes: "Потрібні чоловіки з досвідом на пресах. Новий завод.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Bieruń",
    locationDescription: "ul. Logistyczna 81 (поруч із Тихами)",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "5440 zł брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Щомісячна премія 400 злотих брутто. Нічна надбавка — 20%, понаднормові години — 100%.",
      salaryNotes: "Офіційне працевлаштування на повну ставку.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "Робота у 3 зміни",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Інформація про надання житла відсутня.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details:
        "Зручне розташування — автобусна зупинка прямо під підприємством.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Карта MultiSport, приватна медична допомога, групове страхування PZU, платформа MyBenefit, дисконтна програма MANPAWERGroup Premium.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Робота на пресах, завантаження елементів",
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
      specificNuances: ["Гаряче штампування", "Зварювання"],
      specificConditionsDetails:
        "Гаряче штампування, лазерне різання, дробоструминна обробка та зварювання металевих деталей.",
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
      "Робота на новому заводі з виробництва автодеталей. Обов'язки включають роботу на пресах, лазерне різання, обслуговування машин та обладнання. Працівник завантажує елементи з контейнера та запускає машину.",
    additionalNotes:
      "Допомога в отриманні карт побиту. Можливість професійного розвитку через навчання. Робота для відомих світових автовиробників.",
  },
  // Вакансія №52 - Hitachi Łódź
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Hitachi Łódź Оператор машин на виробництві ізоляції для трансформаторів (Виробництво та промисловість)",
    vacancydescription:
      "Оператор машин на виробництві ізоляції для трансформаторів (Виробництво та промисловість) — Łódź",
    category: "Виробництво та промисловість",
    keywords: [
      "Łódź",
      "Лодзь",
      "Hitachi",
      "оператор машин",
      "штангенциркуль",
      "креслення",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Не вказувати назву підприємства в оголошеннях! Процес: CV -> Офіс (тест + розмова) -> Співбесіда на заводі.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łódź",
    locationDescription: "Bałuty, ul. Aleksandrowska 67/93",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "4800 zł брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Надбавка за нічні зміни 40%, за роботу у вихідний 200%, премії до 500 злотих.",
      salaryNotes:
        "Стабільне працевлаштування, шанс на прямий контракт із заводом.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00-14:00, 14:00-22:00, 22:00-6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Обслуговування в Medicover, карта Multisport, страхування Generali.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Тест в офісі перед співбесідою на заводі",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови обов'язкове",
      physicalLoad:
        "Використання вимірювальних приладів, читання технічних креслень",
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
      specificConditionsDetails: "Дотримання правил охорони праці (BHP).",
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
      "Обслуговування машин та інструментів для виготовлення ізоляції трансформаторів. Використання штангенциркуля для контролю точності, читання базових технічних креслень, контроль якості виробничого процесу.",
    additionalNotes:
      "Допомога у виготовленні карт побиту та запрошень. Навчання та підтримка на всіх етапах.",
  },
  // Вакансія №53 - Hilding Murowana Goślina Production
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Hilding Murowana Goślina Виробництво та монтаж матраців (мануальна робота) (Виробництво та промисловість)",
    vacancydescription: "Виробництво та монтаж матраців (мануальна робота) (Виробництво та промисловість) — Murowana Goślina",
    category: "Виробництво та промисловість",
    keywords: [
      "Murowana Goślina",
      "Poznań",
      "матраци",
      "виробництво",
      "склеювання",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки. Робота до вересня. Офіс у Познані (Głogowska 31/33).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Murowana Goślina",
    locationDescription: "ul. Polna 17 (20 км від Познані)",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "5150 zł брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія за відвідуваність 400 зл (у високий сезон), нічні +20%, надгодини +50/100%, додаток за доїзд до 500 зл брутто.",
      salaryNotes: "Додаток за доїзд залежить від відстані.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "05:30-13:30, 13:30-21:30, 21:30-05:30",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, дофінансування відсутнє.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд самостійний, але є компенсація до 500 зл брутто.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Карта Мультіспорт, приватне страхування Medicover, групова страховка.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Середній",
      languageDetails: "Польська мова на рівні А2",
      physicalLoad: "Мануальна робота, різання, склеювання",
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
      "Виробництво та монтаж матраців. Мануальна робота: різання елементів за розміром, склеювання, обслуговування виробничих машин, забезпечення безперервності виробництва.",
    additionalNotes: "Робота на відомому підприємстві з виготовлення матраців.",
  },
  // Вакансія №54 - Hilding Murowana Goślina Magazynier
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Hilding Murowana Goślina Комірник з посвідченням UDT на склад матраців (Склади та логістика)",
    vacancydescription: "Комірник з посвідченням UDT на склад матраців (Склади та логістика) — Murowana Goślina",
    category: "Склади та логістика",
    keywords: ["Murowana Goślina", "Poznań", "UDT", "склад", "комірник"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки з UDT II категорії. Офіс у Познані (Głogowska 31/33).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Murowana Goślina",
    locationDescription: "ul. Polna 17 (20 км від Познані)",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "6000 zł брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія за відвідуваність 400 зл (у високий сезон), нічні +20%, надгодини +50/100%, додаток за доїзд до 500 зл брутто.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "05:30-13:30, 13:30-21:30, 21:30-05:30",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд самостійний, компенсація до 500 зл брутто.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Карта Мультіспорт, приватне страхування Medicover, групова страховка.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "UDT II категорії",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Середній",
      languageDetails: "Польська мова на рівні А2",
      physicalLoad: "Робота на складі, керування навантажувачем",
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
      "Робота з поставками продукції, внутрішні перевезення на складі, комплектація та відправка товарів, складське обслуговування та облік у системі, підтримка порядку.",
    additionalNotes: "Стабільна робота на великому підприємстві.",
  },
  // Вакансія №55 - ID LOGISTICS Krajków
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "ID LOGISTICS Krajków Складська логістика: формування замовлень та робота з UDT (Склади та логістика)",
    vacancydescription:
      "Складська логістика: формування замовлень та робота з UDT (Склади та логістика) — Krajków",
    category: "Склади та логістика",
    keywords: ["Krajków", "Wrocław", "UDT", "склад", "сканер"],
    contractType: "Umowa zlecenie",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки. Можна без UDT, але з готовністю зробити. Школення 09.06, старт 17.06. Підтримка консультанта MANPAWER.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Krajków",
    locationDescription: "ul. Logistyczna 42 (55-020)",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "31.00 zł/год брутто",
      studentNetto: "",
      hoursRange: "",
      payoutDates: "",
      bonusDetails: "Додаток до житла, додаток на доїзд 300 zł/міс.",
      salaryNotes: "Можливість додаткових оплачуваних понаднормових годин.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00-14:00 / 14:00-22:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "600 zł/міс",
      details: "Житло в Turowie.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Транспорт з багатьох локацій.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "UDT або курс на підйомні візки",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "Підходить для україномовних або англомовних кандидатів",
      physicalLoad: "Обслуговування сканера, приймання та видача товару",
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
      "Формування замовлень відповідно до інструкцій, приймання та видача товару на складі, обслуговування сканера та контроль правильності виконання замовлень, підтримка порядку на робочому місці.",
    additionalNotes:
      "Можливість здобути цінний досвід у логістичній галузі. Тимчасова робота.",
  },
  // Вакансія №56 - Aluplast Nagradowice Warehouse
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Aluplast Nagradowice Працівник складу віконних систем (робота з довгими профілями) (Склади та логістика)",
    vacancydescription:
      "Працівник складу віконних систем (робота з довгими профілями) (Склади та логістика) — Nagradowice",
    category: "Склади та логістика",
    keywords: ["Nagradowice", "Poznań", "Aluplast", "віконні профілі", "склад"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки. Комунікативна польська. Житло шукають (450 зл).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Nagradowice",
    locationDescription: "ul. Profilowa 1",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "5025-5260 zł брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія 15% від з/п, премія за вихідні, нічні +20%, надгодини +50%.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00-14:00, 14:00-22:00, 22:00-6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "450 zł/міс",
      details: "Житло на стадії пошуку. Немає дофінансування до власного.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобус з Познані (багато зупинок: Szymanowskiego, AWF, Rolna тощо).",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Карта Мультіспорт, Medicover, групове страхування.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови обов'язкове",
      physicalLoad: "Робота з нестандартними довгими профілями (до 8 м)",
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
      specificNuances: ["Довгомірні вантажі"],
      specificConditionsDetails:
        "Робота з вузькими пластиковими або алюмінієвими балками до 8 м.",
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
      "Робота на складі віконних систем ПВХ. Завдання: робота з профілями нестандартної довжини (до 8 м), витягування з полиць, завантаження та розвантаження товарів, перевірка запасів.",
    additionalNotes: "Відомий виробник віконних систем ПВХ. Дружня атмосфера.",
  },
  // Вакансія №57 - Aluplast Nagradowice Operator-1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Aluplast Nagradowice Молодший оператор машин (пакування та контроль якості профілів) (Виробництво та промисловість)",
    vacancydescription:
      "Молодший оператор машин (пакування та контроль якості профілів) (Виробництво та промисловість) — Nagradowice",
    category: "Виробництво та промисловість",
    keywords: [
      "Nagradowice",
      "Poznań",
      "оператор",
      "пакування",
      "контроль якості",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки. Досвід роботи при машинах мін. 1 рік. Польська мова обов'язкова.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Nagradowice",
    locationDescription: "ul. Profilowa 1 (або філіал у м. Познань)",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "5740 zł брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія 860 зл брутто, додаток за нічні 311 зл брутто, надгодини +50%.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00-14:00, 14:00-22:00, 22:00-6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Інформація про житло не вказана.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Автобус з Познані.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Карта Мультіспорт, Medicover, групове страхування.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови",
      physicalLoad: "Візуальний огляд, пакування профілів",
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
      "Пакування профілів, планок та додатків згідно з інструкціями. Візуальний огляд виготовлених виробів на наявність подряпин, складок, контроль ваги та довжини. Контроль якості та кількості продукції.",
    additionalNotes: "Виробництво високоякісних віконних систем ПВХ.",
  },
  // Вакансія №58 - Wkręt-Met Częstochowa-1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Wkręt-Met Częstochowa Пакування кріпильної продукції (гвинти, болти) та обслуговування машин (Виробництво та промисловість)",
    vacancydescription:
      "Пакування кріпильної продукції (гвинти, болти) та обслуговування машин (Виробництво та промисловість) — Częstochowa",
    category: "Виробництво та промисловість",
    keywords: ["Częstochowa", "Wrzosowa", "пакування", "гвинти", "болти"],
    contractType: "Umowa zlecenie",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Заборонено вказувати назву підприємства! Чоловіки до 55 років (Україна, Молдова). Офіс: Aleja Wolności 1, Częstochowa. Потрібно знати: рівень польської, готовність до 12 год, чи треба житло.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Częstochowa",
    locationDescription: "Wrzosowa",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "30,50 zł/год брутто",
      studentNetto: "",
      hoursRange: "",
      payoutDates: "",
      bonusDetails: "Доплата за власне житло 330 zł брутто/міс.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "За графіком підприємства",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "Є можливість роботи по 8 годин",
      description: "06:00–18:00, 18:00–06:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "550 zł/міс",
      details: "Житло в м. Częstochowa.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Автобус з Częstochowa та Wrzosowa (багато зупинок).",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Карта MultiSport, Medicover, групове страхування.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 55,
      nationalities: ["Україна", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "Бажано розмовна польська",
      physicalLoad: "Проста мануальна робота, не важка",
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
        "Чисті, сухі приміщення. Наявні роздягальні та санітарні приміщення.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: false,
      details: "Направлення на медогляд після затвердження.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Виготовлення та пакування кріпильної продукції (гвинти, болти, дюбелі). Обслуговування простих виробничих машин, контроль якості продукції, підготовка замовлень до відправки.",
    additionalNotes:
      "Стабільна робота в організованому виробничому середовищі. Допомога у виготовленні карти побуту.",
  },
  // Вакансія №59 - Corning Stryków-2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Corning Stryków Оператор машин на виробництві оптичних кабелів (Виробництво та промисловість)",
    vacancydescription: "Оператор машин на виробництві оптичних кабелів (Виробництво та промисловість) — Stryków",
    category: "Виробництво та промисловість",
    keywords: [
      "Stryków",
      "Стрикув",
      "оптичний кабель",
      "штангенциркуль",
      "4-бригади",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Чоловіки. Польська B1. Потрібне резюме. Перед працевлаштуванням тести (польська + технічні). Через 3 місяці перехід на прямий контракт.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Stryków",
    locationDescription: "Smolice 1e, 95-010",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "33 zł/год брутто",
      studentNetto: "",
      hoursRange: "",
      payoutDates: "",
      bonusDetails:
        "Нічні +6 zł/год брутто, премія за відсутність прогулів +10%, додаток за 4-бригадний графік 700 зл брутто, дофінансування до їдальні 10 зл.",
      salaryNotes: "Доплата за власне житло 300 зл брутто.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "12",
      workDaysWeek: "4-бригадний (2-2-3)",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "Тимчасово може бути 3 зміни по 8 год (Пн-Пт)",
      description: "2 дні 6:00-18:00, 2 вихідних, 3 дні 18:00-6:00 і т.д.",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "320 zł/міс",
      details: "Хостел, 3-4 особи в кімнаті.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Автобус з: Łódź, Koluszki, Brzeziny, Zgierz, Łowicz та інших.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, MultiSport, Generali, дофінансування їдальні.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: true,
      entranceTestsDetails: "Знання польської + технічні тести",
      polishLanguageLevel: "Середній",
      languageDetails: "B1 (читання, мовлення)",
      physicalLoad: "Робота при машинах, намотування продукції",
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
        "Можливість користуватись їдальнею (автомати, мікрохвильовка).",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Дофінансування 10 зл до обіду",
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
      "Виготовлення оптичного кабельного з’єднання. Приготування робочого місця, робота при машинах, допомога в переобладненні, намотування готової продукції згідно зі стандартами якості, робота з комп'ютером та штангенциркулем.",
    additionalNotes: "Світовий лідер у галузі. Допомога з картами побиту.",
  },
  // Вакансія №60 - Hutchinson Łódź-1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Hutchinson Łódź Водій навантажувача (UDT) на виробництво силіконових виробів (Склади та логістика)",
    vacancydescription:
      "Водій навантажувача (UDT) на виробництво силіконових виробів (Склади та логістика) — Łódź",
    category: "Склади та логістика",
    keywords: ["Łódź", "Лодзь", "UDT", "навантажувач", "силіконові вироби"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Чоловіки з UDT та досвідом. Перед працевлаштуванням — екскурсія на завод.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łódź",
    locationDescription: "ul. Niciarniana 49D",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "4900 zł брутто/міс",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Нічні +20%, премія продукційна до 365 брутто, надгодини +50/100%, неділя +200%.",
      salaryNotes:
        "Доплата за власне житло 475 зл брутто (зменшується пропорційно лікарняним).",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "5:45-13:45, 13:45-21:45, 21:45-5:45",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "260 zł/міс",
      details: "Хостел, 3-4 особи в кімнаті.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовно з: Brzeziny, Lipiny, Andrespol, Tomaszów Mazowiecki. В межах Лодзі — самостійно.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, MultiSport, Generali.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Посвідчення UDT",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Обслуговування вантажопідйомника",
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
      specificConditionsDetails: "Можливість користуватись їдальнею.",
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
      "Обслуговування вантажопідйомника (вузка). Транспортування компонентів зі складу в зал виготовлення, перевезення готових і запакованих виробів (силіконові ущільнювачі) на склад готової продукції.",
    additionalNotes: "Допомога з картами побиту та запрошеннями.",
  },
  // Вакансія №61 - Pesa Bydgoszcz Spawacz-Ślusarz
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Pesa Bydgoszcz Зварювальник MAG або слюсар на виробництво потягів та трамваїв (Виробництво та промисловість)",
    vacancydescription:
      "Зварювальник MAG або слюсар на виробництво потягів та трамваїв (Виробництво та промисловість) — Bydgoszcz",
    category: "Виробництво та промисловість",
    keywords: [
      "Bydgoszcz",
      "Бидгощ",
      "зварювальник",
      "слюсар",
      "MAG",
      "потяги",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки з польською мовою. Робота на висоті понад 3 метри. Зварювальникам потрібен сертифікат MAG.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Bydgoszcz",
    locationDescription: "ul. Zygmunta Augusta 11",
    voivodeship: "Kujawsko-Pomorskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "Зварювальник: 33-40 zł/год брутто; Слюсар: 30-36 zł/год брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails: "Премія 400-900 зл брутто. Надгодини +50/100%, нічні +20%.",
      salaryNotes: "Є ювілейні нагороди та різдвяні бонуси.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "Можлива нічна зміна (22-6) тимчасово",
      description: "6:00-14:00, 14:00-22:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, дофінансування відсутнє.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Самостійний доїзд, підприємство в центрі міста.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Приватне мед. обслуговування, страхування життя, співфінансування окулярів, відпочинку, спорту та культури.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Сертифікат MAG (для зварювальників)",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови обов'язкове",
      physicalLoad: "Робота на висоті понад 3 метри, шліфування, зварювання",
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
      specificNuances: ["Робота на висоті", "Шум"],
      specificConditionsDetails:
        "Робота на висоті понад 3 метри. Використання електроінструментів.",
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
      "Робота на найбільшому польському підприємстві з виробництва потягів та трамваїв. Зварювальники виконують MAG-зварювання модулів та конструкцій. Слюсарі займаються складанням модулів за технічною документацією, шліфуванням швів, очищенням конструкцій та підготовкою кузовів до зварювання.",
    additionalNotes:
      "Можливість отримання кредиту на житло від підприємства, професійне та мовне навчання.",
  },
  // Вакансія №62 - Faurecia Legnica Operator
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Faurecia Legnica Оператор виробництва автомобільних крісел (Автомобільна промисловість)",
    vacancydescription: "Оператор виробництва автомобільних крісел (Автомобільна промисловість) — Legnica",
    category: "Автомобільна промисловість",
    keywords: ["Legnica", "Легніца", "автокрісла", "оператор", "виробництво"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Потрібне CV. Перед працевлаштуванням розмова на підприємстві.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Legnica",
    locationDescription: "Gniewomierz 180",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "4850 zł/міс брутто",
      studentNetto: "",
      hoursRange: "168 - 240",
      payoutDates: "",
      bonusDetails: "Премія продукційна 15%, нічні +20%, надгодини +50/100%.",
      salaryNotes: "Близько 40-80 надгодин на місяць.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00-14:00, 14:00-22:00, 22:00-6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Інформація про житло в цій версії вакансії відсутня.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Карта Мультіспорт, Medicover, страхування Generalli.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови обов'язкове",
      physicalLoad: "Робота на виробничій лінії",
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
        "Приміщення теплі. Є їдальня з автоматами та мікрохвильовкою.",
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
      "Робота на підприємстві, що спеціалізується на виготовленні автомобільних крісел. Обов'язки включають обслуговування виробничих машин та ліній, контроль якості компонентів.",
    additionalNotes:
      "Безкоштовна допомога з документами на карту побиту. Оплачувана відпустка та лікарняні.",
  },
  // Вакансія №63 - McCormick Stefanowo-1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "McCormick Stefanowo Пакування та контроль якості на виробництві приправ (Харчова промисловість)",
    vacancydescription: "Пакування та контроль якості на виробництві приправ (Харчова промисловість) — Stefanowo",
    category: "Харчова промисловість",
    keywords: [
      "Stefanowo",
      "Стефаново",
      "Warszawa",
      "приправи",
      "пакування",
      "санепід",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки жінки. Потрібна книжечка санепід (або готовність зробити). Житло наразі не актуальне.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Stefanowo",
    locationDescription: "ul. Malinowa 18/20",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Warszawa",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "28 zł/год брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails: "Премія 10% за 4-бригадну систему, нічні +20%.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "4 дні (22-06), 2 вих; 4 дні (14-22), 1 вих; 4 дні (06-14), 1 вих.",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло на даний момент не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "З міст: Radom, Jedlińsk, Warka, Białobrzegi, Grójec, Tarczyn.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Карта MultiSport, приватне мед. страхування, MyBenefit, MANPAWERGroup Premium.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Книжечка санепід",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови обов'язкове",
      physicalLoad: "Пакування, перевірка термінів придатності",
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
      "Робота на підприємстві з виготовлення приправ. Обов'язки для жінок: пакування приправ, перевірка термінів придатності, контроль якості продукції та обслуговування пакувальних машин.",
    additionalNotes:
      "Довготривала співпраця, оплачувана відпустка, допомога з документами на карту побиту.",
  },
  // Вакансія №64 - BCUBE Niepołomice
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "BCUBE Niepołomice Комірник на логістичний склад (з UDT або без) (Склади та логістика)",
    vacancydescription: "Комірник на логістичний склад (з UDT або без) (Склади та логістика) — Niepołomice",
    category: "Склади та логістика",
    keywords: [
      "Niepołomice",
      "Неполоміце",
      "Kraków",
      "склад",
      "UDT",
      "комірник",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки. Можна з UDT або без. Великий перелік міст для доїзду.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Niepołomice",
    locationDescription: "Логістичний центр",
    voivodeship: "Małopolskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "4700 – 5300 zł/міс брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails: "Премія за відвідуваність, щомісячні бонуси.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "Робота позмінно",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "З міст: Tarnów, Brzesko, Bochnia, Wieliczka, Kraków, Proszowice та ін.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Карта MultiSport, приватна медична опіка, MyBenefit, MANPAWERGroup Premium.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "UDT буде перевагою",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Комплектування, перепакування, облік залишків",
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
      "Робота на логістичному складі. Обов'язки: декомпозиція, перепакування, комплектування матеріалів, облік та контроль залишків, приймання та відправка товарів, якісний та кількісний контроль, догляд за упаковкою.",
    additionalNotes: "Стабільна зарплата, офіційне працевлаштування.",
  },
  // Вакансія №65 - Lear Pruszków 4850
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Lear Pruszków Збирання дрібних деталей інтер’єру авто (сидіння) (Автомобільна промисловість)",
    vacancydescription: "Збирання дрібних деталей інтер’єру авто (сидіння) (Автомобільна промисловість) — Pruszków",
    category: "Автомобільна промисловість",
    keywords: [
      "Pruszków",
      "Прушкув",
      "автомобільні сидіння",
      "монтаж",
      "лютування",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Чоловіки та жінки. Польська А1-А2. Етапи: розмова в офісі -> зустріч у клієнта (тест на мануальність). Консультант: Joanna Lewandowska.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Pruszków",
    locationDescription: "ul. 3 Maja 8",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "4850 zł/міс брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "540 зл премія за відвідуваність, 600 зл щоквартальна премія, нічні +20%.",
      salaryNotes:
        "Середній дохід 4000–4200 зл нетто. Доплата за власне житло 500 зл брутто.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "3-змінний графік",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, але є доплата 500 зл брутто до власного.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "З міст: Żyrardów, Grodzisk Maz., Skierniewice, Brwinów та ін.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Multisport, Medicover, групова страховка, оплачувана відпустка.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Перевірка мануальних здібностей на підприємстві",
      polishLanguageLevel: "Початковий",
      languageDetails: "Польська мова на рівні А1-А2",
      physicalLoad: "Стояча робота, без підіймання важких речей",
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
        "Тихе середовище, без різких запахів, кондиціонери.",
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
      "Робота на провідному підприємстві з виробництва елементів інтер'єру авто. Обов'язки: збирання дрібних деталей (сидіння), лютування, клейка, шиття. Робота стояча, але фізично не важка.",
    additionalNotes:
      "Можливість переходу на прямий контракт через 18 місяців. Програма рекомендацій працівників.",
  },
  // Вакансія №66 - Lear Pruszków 4700
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Lear Pruszków Монтажник елементів салону авто (сидіння) (Автомобільна промисловість)",
    vacancydescription: "Монтажник елементів салону авто (сидіння) (Автомобільна промисловість) — Pruszków",
    category: "Автомобільна промисловість",
    keywords: ["Pruszków", "Прушкув", "монтаж", "автокрісла", "лютування"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Аналогічна вакансії 65, але базова ставка 4700 зл брутто. Консультант: Joanna Lewandowska.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Pruszków",
    locationDescription: "ul. 3 Maja 8",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "4700 zł/міс брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "540 зл премія за відвідуваність, 600 зл щоквартальна премія, нічні +20%.",
      salaryNotes: "Доплата за власне житло 500 зл брутто.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "3 зміни по 8 годин",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, доплата 500 зл брутто.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "З міст: Żyrardów, Skierniewice, Grodzisk Maz. та ін.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Multisport, Medicover, групова страховка.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Тест на мануальність",
      polishLanguageLevel: "Початковий",
      languageDetails: "Польська А1-А2",
      physicalLoad: "Стояча робота",
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
      specificConditionsDetails: "Кондиціоноване приміщення.",
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
      "Збирання дрібних деталей інтер’єру авто (сидіння), лютування, клейка, шиття. Робота в комфортних умовах без різких запахів.",
    additionalNotes: "Стабільність та підтримка на кожному етапі.",
  },
  // Вакансія №67 - Mondelez Tomaszów Mazowiecki-2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Mondelez Tomaszów Mazowiecki Виробництво та пакування круасанів 7DAYS (Харчова промисловість)",
    vacancydescription: "Виробництво та пакування круасанів 7DAYS (Харчова промисловість) — Tomaszów Mazowiecki",
    category: "Харчова промисловість",
    keywords: [
      "Tomaszów Mazowiecki",
      "Томашув Мазовецький",
      "7DAYS",
      "круасани",
      "санепід",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Чоловіки та жінки до 55 років. Потрібен санепід (можна зробити на місці за 260 зл). Офіс: ul. Wysoka 31 (білий контейнер).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Tomaszów Mazowiecki",
    locationDescription: "ul. Wysoka 31",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "Tomaszów Mazowiecki",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "27.78 зл/год брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "до 10 числа",
      bonusDetails:
        "Нічні +50%, вихідні +30%, надгодини +50/100%, премія до 5%.",
      salaryNotes: "Доплата за власне житло 500 злотих.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "4 дні ніч, 2 вих; 4 дні день, 1 вих; 4 дні ранок, 1 вих.",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, але є доплата 500 зл.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "З міст: Opoczno, Piotrków Tryb., Wolbórz та ін.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Медичне страхування PZU, Medicover, Карта Multisport.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 55,
      nationalities: ["Україна", "Молдова", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Книжечка санепід",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Ручна робота, згинання, підняття лотків",
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
      foodType: "Власне",
      foodDetails: "",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details: "260 зл за аналізи санепід (якщо немає своїх)",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Виробництво круасанів відомого бренду. Обов'язки: формування круасанів, подача та зняття лотків з лінії, пакування готової продукції в картонні упаковки, контроль якості та виконання розпоряджень лідера.",
    additionalNotes:
      "Тимчасовий трудовий договір зараховується до стажу роботи. Допомога з реєстрацією PESEL.",
  },
  // Вакансія №68 - Corning Stryków-3
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Corning Stryków Оператор машин на виробництві оптичних кабелів (Виробництво та промисловість)",
    vacancydescription: "Оператор машин на виробництві оптичних кабелів (Виробництво та промисловість) — Stryków",
    category: "Виробництво та промисловість",
    keywords: [
      "Stryków",
      "Стрикув",
      "оптичний кабель",
      "штангенциркуль",
      "4-бригади",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Чоловіки. Польська мова. Досвід при машинах. Тести перед роботою. Швидкий перехід на прямий контракт.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Stryków",
    locationDescription: "m. Stryków",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "33 зл/год брутто",
      studentNetto: "",
      hoursRange: "",
      payoutDates: "",
      bonusDetails:
        "Нічні +6 зл/год брутто, +10% за відсутність прогулів, +700 зл за 4-бригадний графік.",
      salaryNotes: "Доплата за власне житло 300 зл брутто.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "4-бригадна система",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "2 зміни по 12 годин",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "320 зл/міс",
      details: "Хостел або квартира, 3-5 людей в кімнаті.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "З міст: Łódź, Zgierz, Głowno, Łowicz та ін.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Дофінансування до їдальні.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: true,
      entranceTestsDetails: "Технічні тести + польська мова",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови",
      physicalLoad: "Намотування продукції, робота при машинах",
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
      foodType: "Субсидоване",
      foodDetails: "Дофінансування до їдальні",
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
      "Робота на виробництві оптичного кабельного з’єднання. Обов'язки: намотування готової продукції, допомога в переобладнанні машин, обслуговування виробничого обладнання, використання штангенциркуля.",
    additionalNotes: "Швидкий перехід на прямий контракт з підприємством.",
  },
  // Вакансія №69 - Faurecia Legnica 4800 + Housing
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Faurecia Legnica Оператор виробництва автомобільних крісел (з житлом) (Автомобільна промисловість)",
    vacancydescription: "Оператор виробництва автомобільних крісел (з житлом) (Автомобільна промисловість) — Legnica",
    category: "Автомобільна промисловість",
    keywords: ["Legnica", "Легніца", "автокрісла", "житло", "оператор"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Чоловіки та жінки. Потрібне CV. Житло платне (40 зл/доба), кандидати домовляються самі.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Legnica",
    locationDescription: "Gniewomierz 180",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "4800 зл/міс брутто",
      studentNetto: "",
      hoursRange: "168 - 240",
      payoutDates: "",
      bonusDetails:
        "Премія 15%, нічні +20%, вихідні +100%, надгодини +50/100%.",
      salaryNotes: "Близько 40-80 надгодин на місяць.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00-14:00, 14:00-22:00, 22:00-6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "40 зл/доба",
      details: "Хостел. Кандидати самі домовляються про оплату з власником.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Multisport, Medicover, Generalli.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови",
      physicalLoad: "Робота на виробництві",
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
      specificConditionsDetails: "Теплі приміщення, є їдальня.",
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
      "Виготовлення автомобільних крісел. Обслуговування виробничих ліній, монтаж компонентів, контроль якості готової продукції.",
    additionalNotes: "Допомога з картами побиту. Оплачувані відпустки.",
  },

  // Вакансія №70 - Pesa Bydgoszcz-1
  {
    agencyName: "MANPAWER",
    templateName: "Pesa Bydgoszcz Виробництво потягів та трамваїв: зварювальні та слюсарні роботи (Виробництво та промисловість)",
    vacancydescription:
      "Виробництво потягів та трамваїв: зварювальні та слюсарні роботи (Виробництво та промисловість) — Bydgoszcz",
    category: "Виробництво та промисловість",
    keywords: [
      "Pesa",
      "Bydgoszcz",
      "зварювальник",
      "слюсар",
      "MAG",
      "потяги",
      "трамваї",
      "WPS",
      "технічне креслення",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Потрібна комунікативна польська мова. Обов'язкове знання технічного креслення. Робота на висоті понад 3 метри (не повинно бути протипоказань). Для зварювальників потрібен сертифікат MAG.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Bydgoszcz",
    locationDescription: "ul. Zygmunta Augusta 11, 85-082 Bydgoszcz",
    voivodeship: "Kujawsko-pomorskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto:
        "Зварювальник: 33-40 зл/год брутто; Слюсар: 30-36 зл/год брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія для зварювальників 500-900 зл брутто; для слюсарів 400-700 зл брутто. Доплата за нічні зміни +20%.",
      salaryNotes:
        "Надгодини: +50% у робочі дні, +100% у вихідні. Співфінансування окулярів, відпочинку, спортивних та культурних заходів. Ювілейні нагороди, Різдвяні пільги.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "06:00-14:00, 14:00-22:00. Тимчасово може впроваджуватися нічна зміна 22:00-06:00.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, дофінансування до власного житла немає.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details:
        "Доїзд самостійний. Підприємство знаходиться майже в центрі міста.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Приватне мед. обслуговування, страхування життя, професійне та мовне навчання, можливість отримання кредиту на житло, фінансова допомога у складних ситуаціях.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Сертифікат MAG (для зварювальників).",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови на комунікативному рівні.",
      physicalLoad:
        "Відсутність медичних протипоказань до роботи на висоті понад 3 метри. Вміння працювати з електроінструментами (шліфувальна машина).",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Шум"],
      specificConditionsDetails:
        "Робота в цеху з виробництва залізничного транспорту. Видається високоякісний робочий одяг та захисне спорядження.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Є можливість користуватися їдальнею.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Для зварювальників-слюсарів: MAG-зварювання модулів та конструкцій потягів і трамваїв, складання зварних елементів. Для слюсарів: виготовлення конструкційних модулів згідно з технічною документацією, шліфування швів, обрізання кромок, очищення від бризок зварювання, підготовка кузова до зварювання. Робота з інструкціями WPS та технічними кресленнями.",
    additionalNotes:
      "Pesa — найбільший польський виробник залізничного транспорту. Пропонується широкий пакет соціальних пільг та стабільне працевлаштування.",
  },
  // Вакансія №71 - Hitachi Energy Łódź Monter
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Hitachi Energy Łódź Монтаж складових частин промислових трансформаторів (Виробництво та промисловість)",
    vacancydescription: "Монтаж складових частин промислових трансформаторів (Виробництво та промисловість) — Łódź",
    category: "Виробництво та промисловість",
    keywords: [
      "Łódź",
      "Лодзь",
      "Hitachi",
      "монтер",
      "трансформатори",
      "4-бригади",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Треба CV. Тест в офісі, потім екскурсія на завод. Комунікативна польська А2. Можливість отримати UDT за рахунок компанії.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łódź",
    locationDescription: "Bałuty, ul. Aleksandrowska 67/93",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "5760 zł брутто (4800 ставка + 1048 додаток)",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія до 800 зл. Нічні +40%, неділя +80%, надгодини у вихідні +200%.",
      salaryNotes: "Додаток 1048 зл за роботу в 4-х бригадній системі.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "5:30–13:30, 13:30–21:30, 21:30–5:30",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Medicover, Multisport, Generalli. Навчання та отримання посвідчення на вузки.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: true,
      entranceTestsDetails: "Тест в офісі + розмова",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Рівень А2",
      physicalLoad: "Монтаж частин, ручні вантажні роботи",
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
      "Обслуговування машин та інструментів, монтаж складових частин промислових трансформаторів, ручні вантажно-транспортні роботи, дотримання правил техніки безпеки.",
    additionalNotes:
      "Можливість переходу на прямий контракт. Стабільне працевлаштування у відомій міжнародній компанії.",
  },
  // Вакансія №72 - Hitachi Łódź Operator
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Hitachi Łódź Оператор машин на виробництві ізоляції для трансформаторів (Виробництво та промисловість)",
    vacancydescription:
      "Оператор машин на виробництві ізоляції для трансформаторів (Виробництво та промисловість) — Łódź",
    category: "Виробництво та промисловість",
    keywords: [
      "Łódź",
      "Лодзь",
      "Hitachi",
      "оператор",
      "штангенциркуль",
      "креслення",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Треба CV. Тест в офісі. Не вказувати назву заводу в оголошеннях.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łódź",
    locationDescription: "Bałuty, ul. Aleksandrowska 67/93",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "4800 зл брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails: "Премії до 500 зл. Нічні +40%, вихідні +200%.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00-14:00, 14:00-22:00, 22:00-6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, Generalli.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Тест в офісі",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови",
      physicalLoad: "Використання штангенциркуля, читання креслень",
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
      "Обслуговування машин та інструментів, використання вимірювальних приладів (штангенциркуль) для контролю точності, читання базових технічних креслень, дотримання правил охорони праці.",
    additionalNotes:
      "Шанс на працевлаштування напряму на підприємстві. Навчання та підтримка на всіх етапах.",
  },
  // Вакансія №73 - MAN Trucks Niepołomice-2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "MAN Trucks Niepołomice Збірка вантажних автомобілів на конвеєрі (Автомобільна промисловість)",
    vacancydescription: "Збірка вантажних автомобілів на конвеєрі (Автомобільна промисловість) — Niepołomice",
    category: "Автомобільна промисловість",
    keywords: [
      "Niepołomice",
      "Неполоміце",
      "Kraków",
      "MAN",
      "вантажівки",
      "збірка",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки. Польська B1-B2. Потрібне резюме. Контракт до серпня (виробнича перерва). Офіс: Doktora Rudolfa Diesla 5, Niepołomice.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Niepołomice",
    locationDescription: "ul. Doktora Rudolfa Diesla 5",
    voivodeship: "Małopolskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "6069 зл брутто (разом ~7300 брутто)",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія до 15%, надбавки за відвідування, харчування та прання.",
      salaryNotes: "Перші 3 місяці доплата за житло 650 зл брутто.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00-14:00, 14:00-22:00, 22:00-6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details:
        "Житло не надається, але є доплата 650 зл брутто протягом 3 місяців.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Безкоштовний довіз для працівників.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Надбавки за харчування та прання одягу.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Середній",
      languageDetails: "Рівень B1-B2",
      physicalLoad: "Робота з електроінструментами, переміщення деталей",
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
      foodType: "Власне",
      foodDetails: "Є надбавка на харчування",
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
      "Робота на конвеєрі зі збірки вантажівок (NTG та TG). Закручування деталей пневматичними та електроінструментами, монтаж пневматичних та електричних джгутів, складання компонентів рами, використання комп'ютерних систем.",
    additionalNotes:
      "Один з найсучасніших заводів MAN Group. Допомога з картами побиту.",
  },
  // Вакансія №74 - Gates Legnica-2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Gates Legnica Оператор виробництва гумових ременів та шлангів (Виробництво та промисловість)",
    vacancydescription: "Оператор виробництва гумових ременів та шлангів (Виробництво та промисловість) — Legnica",
    category: "Виробництво та промисловість",
    keywords: ["Legnica", "Легніца", "Gates", "гумові ремені", "вулканізація"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Треба CV. Зустріч після згоди заводу. Комунікативна польська (уточнювати у консультанта).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Legnica",
    locationDescription: "Автомобільний завод",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "28.72 - 30.10 зл брутто/год",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія до 570 зл брутто, квартальна премія до 480 зл. Нічні +20%, надгодини +50/100%.",
      salaryNotes:
        "Дофінансування на житло – 300 зл. Виплата близько 4300 нетто без надгодин.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00-14:00, 14:00-22:00, 22:00-6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, але є доплата 300 зл.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Medicover, Multisport, групове страхування. Оплачувана відпустка (2 дні/міс) та лікарняні.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови",
      physicalLoad: "Завантаження продукції в машину, робота з рулонами",
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
      specificNuances: ["Вулканізація"],
      specificConditionsDetails:
        "Робота на верстатах, завантаження продукції, робота з комп'ютером та принтером.",
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
      "Виробництво високотехнологічних гумових ременів та шлангів. Робота на верстатах: накладання матеріалу на рулон, підготовка до вулканізації, огляд готового продукту, робота з комп'ютером.",
    additionalNotes:
      "Лідер ринку. Можливість переходу безпосередньо на контракт із заводом.",
  },
  // Вакансія №75 - Brembo Dąbrowa Górnicza-2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Brembo Dąbrowa Górnicza Виготовлення гальмівних дисків для світових автобрендів (Автомобільна промисловість)",
    vacancydescription:
      "Виготовлення гальмівних дисків для світових автобрендів (Автомобільна промисловість) — Dąbrowa Górnicza",
    category: "Автомобільна промисловість",
    keywords: [
      "Dąbrowa Górnicza",
      "Донброва-Гурніча",
      "Brembo",
      "гальмівні диски",
      "4-бригади",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки. Беремо громадян України, Молдови, Білорусі. Житло та доплати відсутні.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Dąbrowa Górnicza",
    locationDescription: "Виробниче підприємство",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "27 зл брутто/год",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Додаток за 4-бригаду 900 зл, премії 8% та 7%, нічні +20% + 2 зл/год, бон на харчування 630 зл.",
      salaryNotes: "З.П. від 4900 нетто. Багато надгодин (+50/100%).",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "4-бригадна система",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00–14:00, 14:00–22:00, 22:00–6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобус з міст: Sosnowiec, Katowice, Tychy, Bytom, Chorzów та ін.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Бон на харчування 630 зл брутто.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна", "Молдова", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Транспортування контейнерів рохлою, відбір дисків",
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
      specificNuances: ["Шліфування", "Фарбування"],
      specificConditionsDetails:
        "Робота на лінії шліфування та фарбування дисків. Приміщення теплі.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Бон на харчування 630 зл",
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
      "Виготовлення гальмівних дисків. Підготовка та транспортування контейнерів рохлою до машин, які шліфують та фарбують диски. Відбір готових дисків, вкладання в контейнери, контроль якості.",
    additionalNotes:
      "Робота для світових марок автомобілів. Велика кількість надгодин.",
  },
  // Вакансія №76 - BSH Łódź
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "BSH Łódź Монтаж та збірка пральних і сушильних машин Bosch (Виробництво та промисловість)",
    vacancydescription: "Монтаж та збірка пральних і сушильних машин Bosch (Виробництво та промисловість) — Łódź",
    category: "Виробництво та промисловість",
    keywords: ["Łódź", "Лодзь", "Bosch", "BSH", "побутова техніка", "монтаж"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Зараз тільки Філіппіни. Інші нації після 12 серпня. Бонус 2000 зл для нових (по 500/міс). Бонус за рекомендацію 1000 зл. Обов'язкова мінімум 1 субота.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łódź",
    locationDescription: "ul. Jędrzejowska 83 / Lodowa 103 / Papiernicza 1",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "29.00 зл брутто/год (4872 брутто/міс)",
      studentNetto: "",
      hoursRange: "168+",
      payoutDates: "",
      bonusDetails:
        "Премія до 500 зл. Бонус 2000 зл (по 500 за міс без пропусків). Нічні +20%, надгодини +50/100%.",
      salaryNotes:
        "З.П. від 4000 до 4500 нетто. Бонус за суботу 250 зл брутто.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт + суботи",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6:00-14:00, 14:00-22:00, 22:00-6:00",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Автобус з: Łęczyca, Zgierz, Piotrków Tryb., Pabianice та районів Лодзі.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, PZU.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Філіппіни", "Україна", "Молдова", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Робота при лінії, монтаж дрібних приладів",
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
        "Приміщення теплі. Робота в команді 15-16 осіб.",
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
      "Робота на лінії збірки побутової техніки. Монтаж електричних приладів, проводів, схем, гідравлічних систем та корпусу. Перевірка якості та усунення дрібних пошкоджень. Підготовка робочого місця.",
    additionalNotes:
      "Допомога з картами побиту. Бонусна програма для нових працівників.",
  },
  // Вакансія №77 - Hutchinson Łódź-2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Hutchinson Łódź Виготовлення силіконових ущільнювачів для авто та авіації (Автомобільна промисловість)",
    vacancydescription:
      "Виготовлення силіконових ущільнювачів для авто та авіації (Автомобільна промисловість) — Łódź",
    category: "Автомобільна промисловість",
    keywords: ["Łódź", "Лодзь", "Hutchinson", "силікон", "прес-форми"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Чоловіки та жінки. Польська (читання/письмо/мова). Екскурсія + мануальні тести перед роботою. Не вказувати назву в оголошеннях.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łódź",
    locationDescription: "ul. Niciarniana 49D / Lodowa 80/84",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "4730 - 4980 зл брутто/міс",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails: "Премія до 565 зл. Нічні +20%, надгодини +50/100/200%.",
      salaryNotes: "Дофінансування до власного житло 475 зл брутто.",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "5:45–13:45, 13:45–21:45, 21:45–5:45",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "260 зл/міс",
      details: "Хостел, 3-4 особи в кімнаті.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд міським транспортом MPK Łódź.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, Generalli, MANPAWERGroup Premium.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Мануальні тести польською мовою",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Читання, письмо, розмова",
      physicalLoad: "Вирізання деталей, обслуговування прес-форм",
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
      specificConditionsDetails: "Є їдальня з мікрохвильовкою та автоматами.",
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
      "Виготовлення силіконових виробів для авто та авіації. Вирізання деталей та ременів, підготовка матеріалів, обслуговування прес-формувальних машин, контроль якості готової продукції.",
    additionalNotes:
      "Допомога з картами побиту. Безкоштовний паркінг для власних авто.",
  },
  // Вакансія №78 - Kerry Oleśnica-2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Kerry Oleśnica Фасовка спецій та харчових добавок у мішки (Харчова промисловість)",
    vacancydescription: "Фасовка спецій та харчових добавок у мішки (Харчова промисловість) — Oleśnica",
    category: "Харчова промисловість",
    keywords: ["Oleśnica", "Олешниця", "Kerry", "спеції", "фасовка", "санепід"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки. Без мови, без досвіду. Потрібен санепід (допомагаємо). Є 2 вільних місця на житло.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Oleśnica",
    locationDescription: "ul. Energetyczna 13",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "29,80 зл брутто/год",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Надбавка 800 зл за якість та присутність. Нічні +20%, надгодини +50/100%.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "Робота в 3 зміни",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Маємо 2 вільних місця на житло (згідно з заголовком).",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Без дотації на транспорт.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Санітарна книжка",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Фасовка мішків від 10 кг",
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
      specificNuances: ["Запах спецій"],
      specificConditionsDetails:
        "Робота з ароматизаторами та харчовими добавками.",
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
      "Оператор виробництва харчових добавок. Фасовка спецій у мішки вагою від 10 кг, передача готової продукції на склад, підтримання порядку.",
    additionalNotes: "Допомога у виготовленні санітарної книжки.",
  },
  // Вакансія №79 - Lisner Poznań Operator UDT-2
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Lisner Poznań Водій навантажувача (UDT) на склад сировини та упаковки (Склади та логістика)",
    vacancydescription:
      "Водій навантажувача (UDT) на склад сировини та упаковки (Склади та логістика) — Poznań",
    category: "Склади та логістика",
    keywords: ["Poznań", "Познань", "Lisner", "UDT", "навантажувач", "санепід"],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки з UDT та польською мовою. Безкоштовні обіди. Направляємо на санепід безкоштовно.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Poznań",
    locationDescription: "ul. Strzeszyńska 38/42",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "31,87 зл брутто/год",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія за рішенням підприємства. Нічні +20%, надгодини +50/100%.",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "25 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "5:45-13:45, 13:45-21:45, 21:45-5:45",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "З міст: Gniezno, Wągrowiec, Szamotuły, Września та ін.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовні обіди (1 раз) та 2 гарячі напої. Multisport, Medicover.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "UDT + Книжка санепід",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови",
      physicalLoad: "Обслуговування навантажувача",
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
        "Виробництво продуктів харчування (оселедці, салати).",
      workwearFree: true,
      foodType: "Обіди",
      foodDetails: "1 безкоштовний обід на день",
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
      "Приймання товарів за документами, перевірка відповідності поставки, розміщення товару на складі та поповнення запасів згідно з вказівками бригадира. Робота на навантажувачі.",
    additionalNotes:
      "Lisner — лідер у виробництві рибної продукції та салатів. Вільні вихідні.",
  },
  // Вакансія №80 - Lisner Poznań Operator UDT-1
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "MANPAWER",
    templateName: "Lisner Poznań Водій навантажувача (UDT) на склад сировини та упаковки харчового підприємства (Склади та логістика)",
    vacancydescription:
      "Водій навантажувача (UDT) на склад сировини та упаковки харчового підприємства (Склади та логістика) — Poznań",
    category: "Склади та логістика",
    keywords: [
      "Poznań",
      "Познань",
      "UDT",
      "навантажувач",
      "склад",
      "санепід",
      "харчова промисловість",
    ],
    contractType: "Umowa o pracę",
    // === УНУТРАНАЯ ІНФАРМАЦЫЯ (ТОЛЬКІ ДЛЯ РЭКРУТЭРА) ===
    forRecruiter: {
      internalNotes:
        "Тільки чоловіки з UDT та знанням польської мови. Направляємо на санепід безкоштовно. Безкоштовні обіди для персоналу.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Poznań",
    locationDescription: "ul. Strzeszyńska 38/42",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "31,87 зл/год брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "",
      bonusDetails:
        "Премія за рішенням підприємства. Доплата за нічні зміни +20%. Додаток за надгодини +50% (робочі дні), +100% (вихідні).",
      salaryNotes: "",
    },
    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "25 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "I зміна: 5:45-13:45; ІІ: 13:45-21:45; III: 21:45-5:45",
    },
    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "З міст: Czarnków, Mieleszyn, Gniezno, Wągrowiec, Damasławek, Sieraków, Szamotuły, Wolsztyn, Września.",
    },
    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовні обіди (1 раз на день) та 2 гарячі напої. Карта Multisport, страхування життя, приватне медичне обслуговування.",
    },
    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Посвідчення UDT на навантажувачі, книжка санепід",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови обов'язкове",
      physicalLoad: "Обслуговування навантажувача, переміщення товарів",
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
        "Робота на складі сировини та упаковки харчового підприємства.",
      workwearFree: true,
      foodType: "Обіди",
      foodDetails: "1 безкоштовний обід на день + 2 гарячі напої",
    },
    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: false,
      details:
        "Аналізи для санепід книжки безкоштовні за направленням агенції.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Приймання товарів за товарно-транспортними документами, перевірка відповідності документів поставленому товару та його дійсності. Розміщення товару на складі та його поповнення згідно з вказівками бригадира за допомогою навантажувача.",
    additionalNotes:
      "Робота на підприємстві, що є лідером у виробництві рибної продукції та готових салатів. Вільні вихідні, можливість надгодин, стабільне працевлаштування.",
  },
  // Вакансія №81 - Hutchinson Dębica-2
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Zawada Виробництво автомобільних та авіаційних ущільнювачів (Автомобільна промисловість)",
    vacancydescription: "Виробництво автомобільних та авіаційних ущільнювачів (Автомобільна промисловість) — Zawada",
    category: "Автомобільна промисловість",
    keywords: [
      "Hutchinson",
      "Dębica",
      "Zawada",
      "ущільнювачі",
      "автомобільна промисловість",
      "авіаційна промисловість",
      "оператор машин",
      "контроль якості",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Офіс у Дембіці. У публічних оголошеннях не вказувати назву підприємства, вартість транспорту та деталі додатків. Потрібна комунікативна польська мова.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Zawada",
    locationDescription: "Zawada 79N, 39-200 Dębica",
    voivodeship: "Podkarpackie",
    country: "Polska",
    checkInCity: "Dębica",
    salary: {
      baseNetto: "4700 zł brutto/місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом підприємства",
      bonusDetails:
        "+20% за нічні зміни; групова премія 200 зл брутто; надбавка за посаду 20-30 зл брутто/день (при відпрацюванні мін. 6 годин).",
      salaryNotes:
        "Надгодини: +50% у будні, +100% у вихідні (або вихідний в інший день). Доплата за власне житло 475 зл брутто (пропорційно дням).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "Згідно з КЗпП Польщі",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details:
        "Житло не надається. Виплачується додаток 475 зл брутто/місяць за власне житло.",
    },
    transport: {
      provided: true,
      costRaw: "30-64 зл/міс",
      details:
        "Фірмові автобуси з Brzostek (64 зл), Pilzno (36 зл), Ropczyce (30 зл), Wielopole Skrzyńskie (60 зл), Nagoszyn (40 зл). Автобус MKS №17 (роботодавець сплачує 70 зл за квиток).",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Польська мова на комунікативному рівні",
      physicalLoad: "Обслуговування машин, робота на виробничій лінії.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування виробничих машин для виготовлення ущільнювачів. Контроль якості готової продукції на відповідність стандартам. Заповнення необхідної технічної документації.",
    additionalNotes:
      "Робота у лідера автомобільної та авіаційної галузі. Стабільне працевлаштування на основі Umowa o pracę.",
  },
  // Вакансія №82 - Hutchinson Dębica-3
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Zawada Виробництво автомобільних та авіаційних ущільнювачів (Автомобільна промисловість)",
    vacancydescription: "Виробництво автомобільних та авіаційних ущільнювачів (Автомобільна промисловість) — Zawada",
    category: "Автомобільна промисловість",
    keywords: [
      "Hutchinson",
      "Dębica",
      "Zawada",
      "ущільнювачі",
      "автомобільна промисловість",
      "авіаційна промисловість",
      "оператор машин",
      "контроль якості",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Офіс у Дембіці. У публічних оголошеннях не вказувати назву підприємства, вартість транспорту та деталі додатків. Потрібна комунікативна польська мова.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Zawada",
    locationDescription: "Zawada 79N, 39-200 Dębica",
    voivodeship: "Podkarpackie",
    country: "Polska",
    checkInCity: "Dębica",
    salary: {
      baseNetto: "4700 zł brutto/місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом підприємства",
      bonusDetails:
        "+20% за нічні зміни; групова премія 200 зл брутто; надбавка за посаду 20-30 зл брутто/день (при відпрацюванні мін. 6 годин).",
      salaryNotes:
        "Надгодини: +50% у будні, +100% у вихідні (або вихідний в інший день). Доплата за власне житло 475 зл брутто (пропорційно дням).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "Згідно з КЗпП Польщі",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details:
        "Житло не надається. Виплачується додаток 475 зл брутто/місяць за власне житло.",
    },
    transport: {
      provided: true,
      costRaw: "30-64 зл/міс",
      details:
        "Фірмові автобуси з Brzostek (64 зл), Pilzno (36 зл), Ropczyce (30 зл), Wielopole Skrzyńskie (60 зл), Nagoszyn (40 зл). Автобус MKS №17 (роботодавець сплачує 70 зл за квиток).",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Польська мова на комунікативному рівні",
      physicalLoad: "Обслуговування машин, робота на виробничій лінії.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування виробничих машин для виготовлення ущільнювачів. Контроль якості готової продукції на відповідність стандартам. Заповнення необхідної технічної документації.",
    additionalNotes:
      "Робота у лідера автомобільної та авіаційної галузі. Стабільне працевлаштування на основі Umowa o pracę.",
  },
  // Вакансія №83 - Aluplast Nagradowice-1
  {
    agencyName: "MANPAWER",
    templateName: "Aluplast Nagradowice Працівник складу у відділ пакування віконних профілів (Склади та логістика)",
    vacancydescription: "Працівник складу у відділ пакування віконних профілів (Склади та логістика) — Nagradowice",
    category: "Склади та логістика",
    keywords: [
      "Aluplast",
      "Nagradowice",
      "Poznań",
      "віконні профілі",
      "пакування",
      "склад",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Офіс: Poznań, ul. Głogowska 31/33. Етапи: CV -> розмова в офісі -> медогляд -> робота. Не вказувати назву заводу в оголошенні. Потрібна польська мова B1.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Nagradowice",
    locationDescription: "ul. Profilowa 1",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    salary: {
      baseNetto: "5025 zł brutto/місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія 753 зл брутто; додаток за нічні зміни 311 зл брутто.",
      salaryNotes:
        "Надгодини: +50% у робочий день, +100% у вихідний (після набуття досвіду).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний автобус з Poznań (зупинки: Szymanowskiego, Aleje Solidarności, AWF, Uniwersytet Ekonomiczny, os. Jagiellońskie, os. Lecha 1, Szpitalna, Głogowska, Rolna, Falista, Orła Białego 1, Szczepankowo).",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Картка MultiSport, приватне медичне страхування, групове страхування PZU, платформи MyBenefit та MANPAWERGroup Premium зі знижками.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Середній (B1)",
      languageDetails: "Потрібне знання польської мови для комунікації.",
      physicalLoad:
        "Робота з профілями до 8 метрів довжиною, завантаження/розвантаження.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails:
        "Їдальня на території, автомати з кавою/чаєм/снеками, мікрохвильовки.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Робота з віконними профілями ПВХ (пластикові або алюмінієві балки до 8 м). Витягування профілів зі стелажів, підготовка до відправлення, пакування деталей. Завантаження та розвантаження товарів, перевірка рівня запасів та контроль якості продукції.",
    additionalNotes:
      "Стабільна робота у відомій компанії, повний пакет соціальних переваг.",
  },
  // Вакансія №84 - Aluplast Nagradowice-2
  {
    agencyName: "MANPAWER",
    templateName: "Aluplast Nagradowice Працівник складу (відділ пакування віконних систем) (Склади та логістика)",
    vacancydescription: "Працівник складу (відділ пакування віконних систем) (Склади та логістика) — Nagradowice",
    category: "Склади та логістика",
    keywords: [
      "Aluplast",
      "Nagradowice",
      "Poznań",
      "віконні системи",
      "пакування",
      "склад",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Робота в Nagradowice або Poznań. Потрібна польська мова. Не вказувати назву заводу.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Nagradowice",
    locationDescription: "ul. Profilowa 1",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    salary: {
      baseNetto: "5025 zł brutto/місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія 753 зл брутто; додаток за нічні зміни 311 зл брутто.",
      salaryNotes: "Надгодини: +50% у робочий день.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний автобус з Познані (Szymanowskiego, Aleje Solidarności, AWF, Uniwersytet Ekonomiczny, os. Jagiellońskie, os. Lecha 1, Szpitalna, Głogowska, Rolna, Falista, Orła białego 1, Szczepankowo).",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Карта Мультіспорт, приватне мед. обслуговування Medicover, групове страхування.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Чоловіки зі знанням польської мови.",
      physicalLoad:
        "Робота з довгими профілями (до 8 м), витягування з полиць, пакування.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Робота з віконними профілями нестандартної довжини (до 8 м). Витягування балок з полиць, підготовка до доставки, пакування деталей. Завантаження та розвантаження товарів, перевірка запасів, контроль якості та співпраця з іншими відділами.",
    additionalNotes:
      "Підтримка консультанта під час рекрутації, дружня атмосфера.",
  },
  // Вакансія №85 - Pilkington Skierniewice
  {
    agencyName: "MANPAWER",
    templateName: "Pilkington Skierniewice Оператор машини для обробки скла (виробництво склопакетів) (Виробництво та промисловість)",
    vacancydescription:
      "Оператор машини для обробки скла (виробництво склопакетів) (Виробництво та промисловість) — Skierniewice",
    category: "Виробництво та промисловість",
    keywords: [
      "Pilkington",
      "Skierniewice",
      "скло",
      "склопакети",
      "оператор машин",
      "чоловіки",
      "4 бригади",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Офіс: Grodzisk Mazowiecki, ul. Żwirki i Wigury 1A. Рекрутація: розмова в офісі, потім на заводі. Потрібна польська А2. До 60 років.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Skierniewice",
    locationDescription: "ul. Przemysłowa 4, 96-100 Skierniewice",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "Grodzisk Mazowiecki",
    salary: {
      baseNetto: "27 zł/год брутто",
      studentNetto: "",
      hoursRange: "168-180",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Додаток за нічні зміни +6 зл/год; премія 15% (перший місяць), далі групова (~500 зл); надбавка за відвідуваність 500 зл; надбавка за якість 200 зл; доплата за прання 20 зл.",
      salaryNotes:
        "Середня ставка на старті ~32 зл/год брутто, з досвідом ~35 зл/год брутто. Є наднормові години.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "06:00–14:00, 14:00–22:00, 22:00–06:00. Вихідні за графіком (можуть бути серед тижня).",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Довіз відсутній.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails:
        "Посвідчення на вилочний навантажувач (бажано, але не обов'язково).",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails:
        "Перевірка зору, мануальних здібностей, вміння читати креслення/схеми польською мовою.",
      polishLanguageLevel: "Початковий (А2)",
      languageDetails: "Вміння читати креслення та схеми польською мовою.",
      physicalLoad:
        "Робота на виробничій лінії з переробки скла, управління машинами.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Шум"],
      specificConditionsDetails: "Шум у межах норми, приміщення тепле.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Робота при виробництві склопакетів. Управління виробничою лінією, експлуатація машин та обладнання. Первинний контроль якості на етапі виробництва. Підтримання чистоти робочого місця.",
    additionalNotes:
      "Pilkington — частина японської NSG Group, одного з найбільших світових виробників скла.",
  },
  // Вакансія №86 - Lisner Poznań-4
  {
    agencyName: "MANPAWER",
    templateName: "Lisner Poznań Пакувальник готової рибної продукції (Харчова промисловість)",
    vacancydescription: "Пакувальник готової рибної продукції (Харчова промисловість) — Poznań",
    category: "Харчова промисловість",
    keywords: [
      "Lisner",
      "Poznań",
      "рибна продукція",
      "пакування",
      "харчова промисловість",
      "безкоштовні обіди",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Адреса: Poznań, ul. Strzeszyńska 38/42. Контакт: Viktoriia +48 668 895 919. Потрібна книжечка санепід (направляємо безкоштовно). На прохідній мати паспорт.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Poznań",
    locationDescription: "ul. Strzeszyńska 38/42, 60-479 Poznań",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "28.58 zł/год брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "Премія; доплата за нічні зміни +20%.",
      salaryNotes:
        "Близько 4800 зл брутто/місяць + премії. Надгодини: +50% у будні, +100% у вихідні.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "25 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "05:45–13:45, 13:45–21:45, 21:45–05:45. Вільні вихідні.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний транспорт з міст: Czarnków, Mieleszyn, Gniezno, Wągrowiec, Damasławek, Sieraków, Szamotuły, Wolsztyn, Września.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Карта Multisport, страхування життя, приватне медичне обслуговування.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Книжечка санепід (якщо немає, робимо безкоштовно).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Температура 10-14°C. Робота на лінії в групі 8-10 осіб.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Холодний склад (10-14°C)"],
      specificConditionsDetails:
        "Температура 10-14 градусів. Видається одноразовий одяг поверх свого та робоче взуття.",
      workwearFree: true,
      foodType: "Обіди",
      foodDetails:
        "Безкоштовні обіди 1 раз на день та 3 безкоштовні гарячі напої. Їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Фасування та сортування готової рибної продукції (пасти, салати, оселедець). Пакування готового продукту в пластикові коробочки/баночки на лінії. Транспортування продуктів, змішування інгредієнтів, прибирання робочого місця. Продукція не потребує чищення чи нарізки.",
    additionalNotes:
      "Стабільна робота в Познані, можливість наднормових годин.",
  },
  // Вакансія №87 - Weber Zabrze-1
  {
    agencyName: "MANPAWER",
    templateName: "Weber Zabrze Виробництво та монтаж газових, електричних та вугільних грилів (Виробництво та промисловість)",
    vacancydescription:
      "Виробництво та монтаж газових, електричних та вугільних грилів (Виробництво та промисловість) — Zabrze",
    category: "Виробництво та промисловість",
    keywords: [
      "Weber",
      "Zabrze",
      "Gliwice",
      "грилі",
      "монтаж",
      "пакування",
      "чоловіки",
      "B1",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Сезонна робота: січень 2026 – травень 2026. Офіс: Gliwice, ul. Piwna 10. Потрібне резюме польською мовою. Розмова в офісі перед працевлаштуванням.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Zabrze",
    locationDescription: "ul. Guido Henckela Donnersmarcka 19, 41-807 Zabrze",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Gliwice",
    salary: {
      baseNetto: "5000 zł brutto/місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "+20% за нічні зміни; премія 10%; додаток за прання 38 зл брутто/міс.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, доплати немає.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details:
        "Безкоштовного автобусу немає. Доїзд самостійно пішки або міським транспортом.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Обслуговування в Medicover, карта Multisport, страхування Generali.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "Потрібне резюме польською мовою.",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Середній (B1)",
      languageDetails: "Потрібна польська мова на рівні B1.",
      physicalLoad:
        "Ручне переміщення та підвішування елементів на конвеєрі, пакування.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Приміщення теплі.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails:
        "Дофінансування до обідів. Їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Робота на лінії монтування та виробництва грилів. Пакування готових комплектуючих і аксесуарів у картонні коробки. Ручне переміщення та підвішування елементів на конвеєрі. Візуальний контроль якості готових елементів. Дотримання правил охорони праці.",
    additionalNotes:
      "Допомога у виготовленні карт побиту та запрошень. Сезонна робота у світового лідера з виробництва грилів.",
  },
  // Вакансія №88 - ASG Poland Pruszków
  {
    agencyName: "MANPAWER",
    templateName: "ASG Poland Pruszków Ручне виготовлення та пакування брендової упаковки (Виробництво та промисловість)",
    vacancydescription: "Ручне виготовлення та пакування брендової упаковки (Виробництво та промисловість) — Pruszków",
    category: "Виробництво та промисловість",
    keywords: [
      "ASG Poland",
      "Pruszków",
      "упаковка",
      "GPA Global",
      "жінки",
      "ручна робота",
      "Bacardi",
      "Swarovski",
    ],
    contractType: "Umowa zlecenie",
    forRecruiter: {
      internalNotes:
        "Рекрутація для жінок з базовою польською мовою. Робота в системі 4 бригад.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Pruszków",
    locationDescription: "ul. 3 Maja 8, 05-800 Pruszków (Teren MPL)",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "30.6 zł/год брутто",
      studentNetto: "",
      hoursRange: "200-240",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "",
      salaryNotes: "Можливість брати надгодини.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "06:00–18:00, 18:00–06:00. Графік: 2 дні роботи / 2 дні вихідні.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд не надається.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Початковий (А2)",
      languageDetails: "Базова польська мова.",
      physicalLoad: "Легка праця, сидячи або стоячи.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Виконання ручних робіт з виготовлення упаковки для престижних брендів (Bacardi, Swarovski, Lancome тощо). Складання та склеювання коробочок та пакувальних елементів. Контроль якості готової продукції. Підтримка чистоти на робочому місці.",
    additionalNotes:
      "Стабільна робота у міжнародній компанії GPA Global, дружня атмосфера.",
  },
  // Вакансія №89 - Wkręt-Met Częstochowa-2
  {
    agencyName: "MANPAWER",
    templateName: "Wkręt-Met Częstochowa Пакування та контроль якості кріпильної техніки (Виробництво та промисловість)",
    vacancydescription: "Пакування та контроль якості кріпильної техніки (Виробництво та промисловість) — Częstochowa",
    category: "Виробництво та промисловість",
    keywords: [
      "Wkręt-Met",
      "Częstochowa",
      "Wrzosowa",
      "кріплення",
      "пакування",
      "контроль якості",
      "чоловіки",
      "жінки",
    ],
    contractType: "Umowa zlecenie",
    forRecruiter: {
      internalNotes:
        "Офіс: Częstochowa, Al. Wolności 1. Безкоштовна допомога з картами побиту.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Częstochowa",
    locationDescription: "Wrzosowa / Wanaty (згідно з маршрутом автобуса)",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "Częstochowa",
    salary: {
      baseNetto: "30.50 zł/год брутто",
      studentNetto: "",
      hoursRange: "200-240",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "",
      salaryNotes: "Дофінансування до власного житла 330 зл/міс брутто.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "За графіком підприємства",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–18:00, 18:00–06:00.",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "550 зл/міс",
      details:
        "Житло від фірми коштує 550 зл. При власному житлі — доплата 330 зл/міс.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Безкоштовний автобус з Częstochowa, Wrzosowa.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Карта Multisport, Medicover, групове страхування.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Робота стоячи, вимагає уважності та акуратності.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Контроль якості та пакування кріпильної техніки (дюбелі, гвинти, болти). Перевірка етикеток, якості друку, відповідності кольору та кількості продукції. Звірка даних з планшетом. Складання коробок на палети згідно зі стандартами. Підтримання чистоти на робочому місці.",
    additionalNotes:
      "Робота у провідного польського виробника кріпильних систем.",
  },
  // Вакансія №90 - Hutchinson Łódź-3
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Łódź Виробництво гумових ущільнювачів для автомобілів (Автомобільна промисловість)",
    vacancydescription: "Виробництво гумових ущільнювачів для автомобілів (Автомобільна промисловість) — Łódź",
    category: "Автомобільна промисловість",
    keywords: [
      "Hutchinson",
      "Łódź",
      "ущільнювачі",
      "гума",
      "прес-форми",
      "пари",
      "екструзія",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Адреса: ul. Zakładowa 99 або Kurczaki 130. Перед роботою — екскурсія на виробництво. Допомога з картами побиту.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Łódź",
    locationDescription: "ul. Zakładowa 99 / ul. Kurczaki 130",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4350 - 4660 zł brutto/місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "+20% за нічні зміни; премія до 330 зл брутто.",
      salaryNotes:
        "Ставка 4350 (Zakładowa) або 4660 (Kurczaki). Надгодини: +50% будні, +100% субота, +200% неділя/свята. Доплата за власне житло 475 зл брутто (зменшується пропорційно лікарняним).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "05:45–13:45, 13:45–21:45, 21:45–05:45.",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "260 зл/міс",
      details:
        "Хостел, 3-4 особи в кімнаті, всі зручності. При власному житлі — доплата 475 зл брутто.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details:
        "Доїзд самостійно. З міст Łask, Pabianice, Piotrków Trybunalski — платний транспорт.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Обслуговування в Medicover, карта Multisport, страхування PZU.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad:
        "Чоловіки: обслуговування прес-машин (висока температура). Жінки: обробка, контроль якості, пакування.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Запах гуми", "Висока температура"],
      specificConditionsDetails:
        "Робота при високій температурі (біля прес-форм), присутній запах гуми.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування прес-формувальних машин (завантаження деталей, запуск, відбір готових матеріалів). Подальша обробка гумових виробів: чищення, контроль якості, наклеювання кодів та пакування готової продукції.",
    additionalNotes:
      "Можливість роботи для сімейних пар. Стабільне підприємство автомобільної галузі.",
  },
  // Вакансія №91 - Huber+Suhner Polatis Chrzanów
  {
    agencyName: "MANPAWER",
    templateName: "Huber+Suhner Nawojowa Góra Виробництво оптичних перемикачів в електротехнічній галузі (Виробництво та промисловість)",
    vacancydescription:
      "Виробництво оптичних перемикачів в електротехнічній галузі (Виробництво та промисловість) — Nawojowa Góra",
    category: "Виробництво та промисловість",
    keywords: [
      "Huber+Suhner",
      "Nawojowa Góra",
      "Pisary",
      "Chrzanów",
      "оптичні перемикачі",
      "пайка",
      "монтаж",
      "електротехніка",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Офіс: Biblioteka miejska w Chrzanowie. Обов'язкова перевірка, чи працював кандидат тут раніше. Мануальний тест польською мовою. Не вказувати назву заводу в оголошенні.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Nawojowa Góra",
    locationDescription: "Nawojowa Góra / Pisary (заклади поруч)",
    voivodeship: "Małopolskie",
    country: "Polska",
    checkInCity: "Chrzanów",
    salary: {
      baseNetto: "4950 zł брутто/місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "До 10 числа",
      bonusDetails:
        "+10% за другу зміну; +40% за нічні години (для нічного графіка); квартальна премія за відвідуваність ~300 зл брутто.",
      salaryNotes:
        "Робота у вихідні: 35,35–42,42 зл брутто/год. Гнучкі графіки на вибір.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт / Нд-Пт / Сб-Нд",
      breakDuration: "2 перерви по 15 хв",
      canChooseShiftOnStart: true,
      shiftChoiceDetails:
        "Можна обрати: 2 зміни (6-14, 14-22), тільки нічні (22-6) або тільки вихідні.",
      description:
        "Залежить від обраного варіанту: 06:00-14:00, 14:00-22:00, 22:00-06:00.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Безкоштовний транспорт з міст: Trzebinia, Chrzanów.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "картка MultiSport, приватне медичне страхування, групове страхування PZU, MyBenefit, MANPAWERGroup Premium.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails:
        "Мануальний тест польською мовою під час екскурсії.",
      polishLanguageLevel: "Середній (B1)",
      languageDetails: "Знання польської на комунікативному рівні (B1).",
      physicalLoad:
        "Робота переважно сидяча. Робота з дрібними елементами, потрібен хороший зір.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Робота з паяльником.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Автомати з кавою, чаєм, снеками, мікрохвильові печі.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Монтаж елементів оптичних перемикачів згідно з інструкцією. Робота з паяльником. Внесення даних у виробничу систему. Контроль якості готової продукції.",
    additionalNotes:
      "Еластичні години праці до вибору працівника. Стабільне працевлаштування у лідера електротехнічної галузі.",
  },
  // Вакансія №92 - Hutchinson Zakładowa
  {
    agencyName: "MANPAWER",
    templateName: "Hutchinson Łódź Виробництво гумових ущільнювачів для автомобілів (Автомобільна промисловість)",
    vacancydescription: "Виробництво гумових ущільнювачів для автомобілів (Автомобільна промисловість) — Łódź",
    category: "Автомобільна промисловість",
    keywords: [
      "Hutchinson",
      "Łódź",
      "ущільнювачі",
      "гума",
      "прес-форми",
      "пари",
      "автомобільна промисловість",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Адреса: ul. Zakładowa 99 або Kurczaki 130. Перед працевлаштуванням екскурсія. Допомога з картами побиту.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Łódź",
    locationDescription: "ul. Zakładowa 99 / ul. Kurczaki 130",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4350 - 4660 zł брутто/місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "До 10 числа",
      bonusDetails: "+20% за нічні зміни; премія до 330 зл брутто.",
      salaryNotes:
        "Ставка 4350 (Zakładowa) або 4660 (Kurczaki). Надгодини: +50% будні, +100% субота, +200% неділя. Доплата за власне житло 475 зл брутто (пропорційно відсутності лікарняних).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "05:45-13:45; 13:45-21:45; 21:45-5:45.",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "260 зл/міс",
      details:
        "Хостел, 3-4 особи в кімнаті. При власному житлі — доплата 475 зл брутто.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details:
        "Безкоштовного автобуса немає. Платний транспорт з Łask, Pabianice, Piotrków Trybunalski.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, страхування PZU.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad:
        "Чоловіки: обслуговування прес-машин (висока температура). Жінки: обробка, контроль якості, пакування.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Запах гуми", "Висока температура"],
      specificConditionsDetails:
        "Робота при високій температурі біля прес-форм. Запах гуми.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування прес-формувальних машин (завантаження деталей, запуск, відбір матеріалів). Подальша обробка деталей (очищення, контроль якості, пакування). Видрук наклейок з кодами деталей.",
    additionalNotes: "Допомога з картами побиту та запрошеннями.",
  },
  // Вакансія №93 - Allegro Adamów-2
  {
    agencyName: "MANPAWER",
    templateName: "Allegro Adamów Складська робота: збирання та упаковка замовлень (Склади та логістика)",
    vacancydescription: "Складська робота: збирання та упаковка замовлень (Склади та логістика) — Adamów",
    category: "Склади та логістика",
    keywords: [
      "Allegro",
      "Adamów",
      "склад",
      "сканер",
      "пакування",
      "тимчасова робота",
      "Warszawa",
    ],
    contractType: "Umowa zlecenie",
    forRecruiter: {
      internalNotes: "Тимчасова робота. Досвід буде перевагою.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Adamów",
    locationDescription: "Склад Allegro",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "32,00 зл/год брутто",
      studentNetto: "",
      hoursRange: "168-220",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія за продуктивність до 20%; сезонний бонус 1500 зл брутто (за 100% відвідуваність з 10.11 по 23.12).",
      salaryNotes: "Обід за 1 зл.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "Пн-Нд",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Пн-Пт: 6:00-14:00, 14:00-22:00. Сб-Нд: 8:00-16:00 або 12:00-20:00. Можна працювати у вихідні.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний автобус з: Żyrardów, Sochaczew, Skierniewice, Warszawa.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails: "",
      physicalLoad: "Проста складська робота, збирання замовлень.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Обід за 1 зл.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Збирання і упаковка замовлень на складі. Проста складська робота з використанням сканера.",
    additionalNotes:
      "Тимчасова робота з можливістю високого заробітку в сезон.",
  },
  // Вакансія №94 - Weber Zabrze-2
  {
    agencyName: "MANPAWER",
    templateName: "Weber Zabrze Виробництво та монтаж газових, електричних та вугільних грилів (Виробництво та промисловість)",
    vacancydescription:
      "Виробництво та монтаж газових, електричних та вугільних грилів (Виробництво та промисловість) — Zabrze",
    category: "Виробництво та промисловість",
    keywords: [
      "Weber",
      "Zabrze",
      "грилі",
      "монтаж",
      "пакування",
      "чоловіки",
      "B1",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Сезонна робота: вересень 2025 – травень 2026. Потрібне резюме польською мовою. Розмова в офісі перед працевлаштуванням.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Zabrze",
    locationDescription: "ul. Guido Henckela Donnersmarcka 19, 41-807 Zabrze",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "5300 зл. бруттo /міс.",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "+20% за нічні зміни; 10% премія; додаток за прання 38 зл брутто/міс.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00-14:00, 14:00-22:00, 22:00-06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається, додатку немає.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Безкоштовного автобусу немає. Доїзд самостійно.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, страхування Generali.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь", "Молдова"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "Потрібне резюме польською мовою.",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Потрібна польська мова для проходження співбесіди.",
      physicalLoad: "Ручне переміщення та підвішування елементів на конвеєрі.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Приміщення теплі.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails:
        "Дофінансування до обідів. Їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Пакування готових комплектуючих і аксесуарів гриля в картонну коробку. Ручне переміщення та підвішування елементів на конвеєрі. Візуальний контроль готових елементів. Дотримання порядку на робочому місці.",
    additionalNotes: "Допомога з картами побиту та запрошеннями.",
  },
  // Вакансія №95 - Media Expert Łódź-3
  {
    agencyName: "MANPAWER",
    templateName: "Media Expert Łódź Склад електроніки: комплектація та розвантаження (Склади та логістика)",
    vacancydescription: "Склад електроніки: комплектація та розвантаження (Склади та логістика) — Łódź",
    category: "Склади та логістика",
    keywords: [
      "Media Expert",
      "Łódзь",
      "електроніка",
      "склад",
      "сканер",
      "комплектація",
      "чоловіки",
      "жінки",
    ],
    contractType: "Umowa zlecenia",
    forRecruiter: {
      internalNotes:
        "Тест з мови обов'язковий. Три локації: Zakładowa (дрібна техніка, жінки), Jędrzejowska 43a (середня), Jędrzejowska 45a (велика).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Łódź",
    locationDescription: "Jędrzejowska 45a, Jędrzejowska 43a, Zakładowa 90/92",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "34,00 зл/год брутто",
      studentNetto: "",
      hoursRange: "168-220",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Ставка зростає: 37,00 (жовтень), 38,50 (листопад), 40,00 (грудень) за умови виконання положень договору.",
      salaryNotes: "Харчування – 2,5 зл.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-10",
      workDaysWeek: "Нд-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: true,
      shiftChoiceDetails: "Можна вибрати відділ (габарити техніки).",
      description:
        "2 або 3 зміни, робота з неділі по п'ятницю. Вихідний у суботу та один день серед тижня.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний автобус (крім локації Zakładowa 90/92 — туди доїзд самостійний).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, страхування PZU.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails: "Тест з польської мови.",
      polishLanguageLevel: "Комунікативний",
      languageDetails:
        "Потрібне розуміння та спілкування для роботи зі сканером.",
      physicalLoad:
        "Залежить від відділу: від дрібної техніки до холодильників (до 20+ кг).",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Приміщення теплі.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails:
        "Харчування за 2,5 зл. Їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування сканера. Комплектація замовлень електроніки. Розвантаження і завантаження вантажних автомобілів. Навколоскладські роботи. Робота з різними габаритами техніки (від телефонів до холодильників).",
    additionalNotes: "Допомога з картами побиту та запрошеннями.",
  },
  // Вакансія №96 - Faurecia Frames Wałbrzych-1
  {
    agencyName: "MANPAWER",
    templateName: "Faurecia Wałbrzych Монтаж каркасів автомобільних сидінь (Автомобільна промисловість)",
    vacancydescription: "Монтаж каркасів автомобільних сидінь (Автомобільна промисловість) — Wałbrzych",
    category: "Автомобільна промисловість",
    keywords: [
      "Faurecia",
      "Wałbrzych",
      "автомобільні сидіння",
      "монтаж",
      "зварювання",
      "лакерування",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Потрібна комунікативна польська мова. Житло не надається.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Wałbrzych",
    locationDescription: "ul. Jachimowicza 3",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4666 зл./міс. брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "Продукційна премія до 15%; +20% за нічні зміни.",
      salaryNotes: "Надгодини: +50% (Пн-Пт), +100% (вихідні).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається і не дофінансовується.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд самостійний.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Multisport, приватне мед. страхування, групова страховка.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови на комунікативному рівні.",
      physicalLoad:
        "Монтаж деталей, обслуговування зварювальних столів, лакерування.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Монтаж деталей до каркасів сидінь автомобілів. Контроль якості та складання готової продукції. Обслуговування зварювальних столів. Лакерування деталей.",
    additionalNotes: "Безкоштовна допомога з документами на карту побиту.",
  },
  // Вакансія №97 - Faurecia Recliners Wałbrzych-2
  {
    agencyName: "MANPAWER",
    templateName: "Faurecia Wałbrzych Монтаж механізмів регулювання автомобільних сидінь (Автомобільна промисловість)",
    vacancydescription: "Монтаж механізмів регулювання автомобільних сидінь (Автомобільна промисловість) — Wałbrzych",
    category: "Автомобільна промисловість",
    keywords: [
      "Faurecia",
      "Wałbrzych",
      "автомобільна промисловість",
      "механізми сидінь",
      "монтаж",
      "пари",
      "CV",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Потрібне резюме (CV). Комунікативна польська мова. Робота в 4-бригадній системі.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Wałbrzych",
    locationDescription: "ul. Jachimowicza 3",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4666 зл/міс. брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "Премії до 15%; +20% за нічні зміни.",
      salaryNotes: "Надгодини: +50% (Пн-Пт), +100% (вихідні та свята).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "07:00–15:00 / 15:00–23:00 / 23:00–07:00 згідно з графіком.",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Транспорту немає.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовні супи, основні страви за 6-8 зл. Medicover, Multisport, групове страхування.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "Потрібне резюме (CV).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Комунікативна польська мова.",
      physicalLoad: "Робота на виробничій лінії, монтаж дрібних деталей.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Безкоштовні супи, обіди за 6-8 зл.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Монтаж деталей до механізмів регулювання автомобільних сидінь. Контроль якості готової продукції. Робота на виробничій лінії в 3-змінному режимі.",
    additionalNotes: "Допомога в підготовці документів на карту побиту.",
  },
  // Вакансія №98 - Prospekta Nysa-1
  {
    agencyName: "MANPAWER",
    templateName: "Prospekta Nysa Виробництво та пакування желейних цукерок (Харчова промисловість)",
    vacancydescription: "Виробництво та пакування желейних цукерок (Харчова промисловість) — Nysa",
    category: "Харчова промисловість",
    keywords: [
      "Prospekta",
      "Nysa",
      "цукерки",
      "желейки",
      "пакування",
      "харчова промисловість",
      "пари",
    ],
    contractType: "Umowa zlecenie",
    forRecruiter: {
      internalNotes:
        "Книжка санепід обов'язкова (можна зробити в Нисі, чекати 4 дні). Поселення за 5 днів до старту. Стандарт житла високий.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Nysa",
    locationDescription: "Завод желейних цукерок",
    voivodeship: "Opolskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "30,50 зл/год брутто",
      studentNetto: "",
      hoursRange: "168-220",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "",
      salaryNotes: "В середньому 220 годин на місяць.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "Робота по 12 годин у 4-бригадній системі.",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "350 зл/міс",
      details: "Надається житло, вартість 350 зл/міс.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Службового транспорту немає.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Книжка санепід.",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Комунікативний рівень польської мови.",
      physicalLoad:
        "Стояча робота. Чоловіки: перенесення кошиків 10-15 кг. Зріст від 160 см.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Запах солодощів"],
      specificConditionsDetails:
        "Температура +20…+22 °C. Характерний солодкий запах. Заборона штучних вій, нігтів, прикрас.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Для жінок: збір готової продукції, пакування та перенесення коробок, укладання на стелажі. Для чоловіків: перенесення кошиків з желейними цукерками (10–15 кг), допомога у постачанні виробів до лінії.",
    additionalNotes:
      "Перший день – навчання (4 години). Чоловіки з бородою працюють у захисних масках.",
  },
  // Вакансія №99 - Prospekta Nysa-2
  {
    agencyName: "MANPAWER",
    templateName: "Prospekta Nysa Виробництво та пакування желейних цукерок (Харчова промисловість)",
    vacancydescription: "Виробництво та пакування желейних цукерок (Харчова промисловість) — Nysa",
    category: "Харчова промисловість",
    keywords: [
      "Prospekta",
      "Nysa",
      "цукерки",
      "желейки",
      "пакування",
      "харчова промисловість",
      "пари",
    ],
    contractType: "Umowa zlecenie",
    forRecruiter: {
      internalNotes:
        "Книжка санепід обов'язкова (можна зробити в Нисі, чекати 4 дні). Поселення за 5 днів до старту. Житло в 15 хв пішки від роботи.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Nysa",
    locationDescription: "Завод желейних цукерок",
    voivodeship: "Opolskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "30,50 зл/год брутто",
      studentNetto: "",
      hoursRange: "168-220",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "",
      salaryNotes: "В середньому 220 годин на місяць.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "Робота по 12 годин у 4-бригадній системі.",
    },
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "350 зл/міс",
      details:
        "Надається житло, вартість 350 зл/міс. 15 хвилин пішки до праці.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Службового транспорту немає.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "Книжка санепід.",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Комунікативний рівень польської мови.",
      physicalLoad:
        "Стояча робота. Чоловіки: перенесення кошиків 10-15 кг. Зріст від 160 см.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Запах солодощів"],
      specificConditionsDetails:
        "Температура +20…+22 °C. Характерний солодкий запах. Заборона штучних вій, нігтів, прикрас.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Для жінок: збір готової продукції, пакування та перенесення коробок, укладання на стелажі. Для чоловіків: перенесення кошиків з желейними цукерками (10–15 кг), допомога у постачанні виробів до лінії.",
    additionalNotes:
      "Перший день – навчання (4 години). Чоловіки з бородою працюють у захисних масках.",
  },
  // Вакансія №100 - Faurecia Frames Wałbrzych-2
  {
    agencyName: "MANPAWER",
    templateName: "Faurecia Wałbrzych Монтаж каркасів автомобільних сидінь (Автомобільна промисловість)",
    vacancydescription: "Монтаж каркасів автомобільних сидінь (Автомобільна промисловість) — Wałbrzych",
    category: "Автомобільна промисловість",
    keywords: [
      "Faurecia",
      "Wałbrzych",
      "автомобільні сидіння",
      "монтаж",
      "зварювання",
      "лакерування",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Потрібна комунікативна польська мова. Житло не надається.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Wałbrzych",
    locationDescription: "ul. Jachimowicza 3",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4666 зл./міс. брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "Продукційна премія до 15%; +20% за нічні зміни.",
      salaryNotes: "Надгодини: +50% (Пн-Пт), +100% (вихідні).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається і не дофінансовується.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд самостійний.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Multisport, приватне мед. страхування, групова страховка.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови на комунікативному рівні.",
      physicalLoad:
        "Монтаж деталей, обслуговування зварювальних столів, лакерування.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Їдальня з мікрохвильовкою та автоматами.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Монтаж деталей до каркасів сидінь автомобілів. Контроль якості та складання готової продукції. Обслуговування зварювальних столів. Лакерування деталей.",
    additionalNotes: "Безкоштовна допомога з документами на карту побиту.",
  },
  // Вакансія №101 - Faurecia Recliners Wałbrzych-1
  {
    agencyName: "MANPAWER",
    templateName: "Faurecia Wałbrzych Монтаж механізмів регулювання автомобільних сидінь (Автомобільна промисловість)",
    vacancydescription: "Монтаж механізмів регулювання автомобільних сидінь (Автомобільна промисловість) — Wałbrzych",
    category: "Автомобільна промисловість",
    keywords: [
      "Faurecia",
      "Wałbrzych",
      "автомобільна промисловість",
      "механізми сидінь",
      "монтаж",
      "пари",
      "CV",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Потрібне резюме (CV). Комунікативна польська мова. Робота в 4-бригадній системі.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Wałbrzych",
    locationDescription: "ul. Jachimowicza 3",
    voivodeship: "Dolnośląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4666 зл/міс. брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "Премії до 15%; +20% за нічні зміни.",
      salaryNotes: "Надгодини: +50% (Пн-Пт), +100% (вихідні та свята).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "07:00–15:00 / 15:00–23:00 / 23:00–07:00 згідно з графіком.",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Транспорту немає.",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовні супи, основні страви за 6-8 зл. Medicover, Multisport, групове страхування.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "Потрібне резюме (CV).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Комунікативна польська мова.",
      physicalLoad: "Робота на виробничій лінії, монтаж дрібних деталей.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Безкоштовні супи, обіди за 6-8 зл.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Монтаж деталей до механізмів регулювання автомобільних сидінь. Контроль якості готової продукції. Робота на виробничій лінії в 3-змінному режимі.",
    additionalNotes: "Допомога в підготовці документів на карту побиту.",
  },
  // Вакансія №102 - ID Logistic Psary
  {
    agencyName: "MANPAWER",
    templateName: "ID Logistic Psary Склад одягу: упаковка та сортування (Склади та логістика)",
    vacancydescription: "Склад одягу: упаковка та сортування (Склади та логістика) — Psary",
    category: "Склади та логістика",
    keywords: [
      "ID Logistic",
      "Psary",
      "одяг",
      "склад",
      "сканер",
      "упаковка",
      "сортування",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Можна вибрати тип договору (UoP або UZ). Вимагається досвід на складі та польська мова А1.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Psary",
    locationDescription: "ul. Akacjowa 6, 42-512 Psary",
    voivodeship: "Śląskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4666 zł brutto/міс (UoP) або 30,5 zł brutto/h (UZ)",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails: "Премія за результати після першого місяця роботи.",
      salaryNotes: "",
    },
    schedule: {
      shiftsCount: 1,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00 – 14:00.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний транспорт з: Катовіце, Сосновець, Битом, Домброва Гурніча.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Початковий (А1)",
      languageDetails: "Польська мова на рівні А1.",
      physicalLoad: "Приготування робочого місця, упаковка, сортування.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Завдання пов’язані з приготуванням робочого місця, упаковкою і сортуванням одягу, роботою зі сканером.",
    additionalNotes: "Стабільна робота на великому логістичному складі.",
  },
  // Вакансія №103 - Gillette Łódź-2
  {
    agencyName: "MANPAWER",
    templateName: "Gillette Łódź Водій навантажувача (вузковий) на виробництво станків для гоління (Склади та логістика)",
    vacancydescription:
      "Водій навантажувача (вузковий) на виробництво станків для гоління (Склади та логістика) — Łódź",
    category: "Склади та логістика",
    keywords: [
      "Gillette",
      "Łódź",
      "UDT",
      "навантажувач",
      "вузковий",
      "WJO",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Обов'язково: UDT II WJO, MS Office, високий рівень польської. Не вказувати назву Gillette в оголошенні.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Łódź",
    locationDescription: "ul. Nowy Józefów 70",
    voivodeship: "Łódzkie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4666 зл. бруттo /міс.",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "+20% за нічні зміни; додаток за 4-бригадну систему 700 зл брутто.",
      salaryNotes:
        "Надгодини: +50% у будні, +100% у вихідні. Доплата за обіди (60% покриває клієнт).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "4 дні 6-14 (1 вихідний), 4 дні 14-22 (1 вихідний), 4 дні 22-6 (2 вихідних).",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details:
        "Безкоштовного автобуса немає. Доїзд міським транспортом (автобуси G1/G2 від Retkinia).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, страхування Generali.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: true,
      additionalDocsDetails: "UDT II WJO (обов'язково).",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Середній (B1)",
      languageDetails: "Знання польської мови на високому рівні.",
      physicalLoad:
        "Обслуговування вантажопідйомника, транспортування компонентів.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Шум"],
      specificConditionsDetails:
        "Обов'язково: взуття з металевим носком, окуляри, беруші. Заборона біжутерії (крім гвоздиків), пірсингу, розпущеного волосся.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Дофінансування 60% вартості обідів.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування вантажопідйомника. Транспортування компонентів зі складу в зал виготовлення продукції. Транспортування готових і запакованих виробів на склад готових виробів. Робота з комп'ютером (MS Office).",
    additionalNotes: "Допомога з документами на карту побиту.",
  },
  // Вакансія №104 - Mahle Krotoszyn-2
  {
    agencyName: "MANPAWER",
    templateName: "Mahle Krotoszyn Оператор машин з виготовлення автомобільних деталей (Автомобільна промисловість)",
    vacancydescription: "Оператор машин з виготовлення автомобільних деталей (Автомобільна промисловість) — Krotoszyn",
    category: "Автомобільна промисловість",
    keywords: [
      "Mahle",
      "Krotoszyn",
      "автодеталі",
      "оператор машин",
      "математичний тест",
      "пари",
      "4 бригади",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Екскурсія + розмова + математичний тест польською мовою. Потрібне резюме польською. Житло не надається.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Krotoszyn",
    locationDescription: "ul. Mahle 6",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "",
    salary: {
      baseNetto: "4400 зл брутто",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "До 10 числа",
      bonusDetails:
        "Премія 10%; +20% за нічні зміни; бонус 75 зл брутто за роботу в Сб/Нд по графіку.",
      salaryNotes: "Надгодини +100% (тільки у вихідний за графіком).",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "6-14, 14-22, 22-6. Графік: 2 ранки, 2 дні, 2 ночі, 2 вихідних.",
    },
    accommodation: {
      type: "Власне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "50 зл",
      details:
        "Автобус з міст: Jarocin, Koźmin, Ostrów, Kobylin, Milicz, Zduny, Pleszew, Kobierno, Odolanów, Sulmierzyce.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, групова страховка.",
    },
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 60,
      nationalities: ["Україна", "Молдова", "Білорусь", "Грузія", "Вірменія"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: true,
      entranceTestsDetails:
        "Математичний тест польською мовою (читання та письмо).",
      polishLanguageLevel: "Початковий (А2)",
      languageDetails:
        "Потрібно вміти читати та писати польською на базовому рівні.",
      physicalLoad: "Робота стоячи, контроль кількох машин одночасно.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Їдальня, автомати, мікрохвильовка.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Робота при машинах, які виготовляють автомобільні деталі. Контроль роботи обладнання, візуальний огляд продукції. Робота стоячи з необхідністю переміщення між машинами.",
    additionalNotes:
      "Можливість переходу на прямий контракт із заводом у майбутньому.",
  },
  // Вакансія №105 - Aluplast Nagradowice (Production)
  {
    agencyName: "MANPAWER",
    templateName: "Aluplast Nagradowice Працівник виробництва віконних систем ПВХ (Виробництво та промисловість)",
    vacancydescription: "Працівник виробництва віконних систем ПВХ (Виробництво та промисловість) — Nagradowice",
    category: "Виробництво та промисловість",
    keywords: [
      "Aluplast",
      "Nagradowice",
      "Poznań",
      "віконні системи",
      "упаковка",
      "контроль якості",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes: "Потрібна польська мова. Надається житло (450 зл).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Nagradowice",
    locationDescription: "ul. Profilowa 1",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    salary: {
      baseNetto: "4785-5025 зл брутто в місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія 15% від з/п; премія за роботу у вихідні; +20% за нічні зміни.",
      salaryNotes: "Надгодини +50% у робочий день.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6-14, 14-22, 22-6.",
    },
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "450 зл",
      details: "Надається житло за 450 зл. Дофінансування до власного немає.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний автобус з Познані (Szymanowskiego, Aleje Solidarności, AWF, os. Jagiellońskie та ін.).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, групове страхування.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Чоловіки зі знанням польської мови.",
      physicalLoad:
        "Упаковка, заміна матеріалів на лінії, візуальний огляд профілів.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Упаковка згідно з інструкціями. Заміна та налаштування виробничих матеріалів на лінії для безперервності виробництва. Візуальний огляд виготовлених профілів (подряпини, складки, вага та довжина).",
    additionalNotes: "Підтримка консультанта під час рекрутації.",
  },
  // Вакансія №106 - Aluplast Nagradowice (Junior Operator)
  {
    agencyName: "MANPAWER",
    templateName: "Aluplast Nagradowice Молодший оператор машин (виробництво віконних систем) (Виробництво та промисловість)",
    vacancydescription: "Молодший оператор машин (виробництво віконних систем) (Виробництво та промисловість) — Nagradowice",
    category: "Виробництво та промисловість",
    keywords: [
      "Aluplast",
      "Nagradowice",
      "Poznań",
      "оператор машин",
      "досвід",
      "віконні системи",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Обов'язково: досвід роботи при машинах мін. 1 рік. Знання польської мови.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Nagradowice",
    locationDescription: "ul. Profilowa 1",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    salary: {
      baseNetto: "5740 зл брутто в місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія 860 зл брутто; додаток за нічні зміни 311 зл брутто.",
      salaryNotes: "Надгодини +50% у робочий день.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "6-14, 14-22, 22-6.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не вказано (власне).",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний автобус з Познані (Szymanowskiego, Aleje Solidarności, AWF та ін.).",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, групове страхування.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails: "Знання польської мови.",
      physicalLoad:
        "Обслуговування машин, упаковка профілів, контроль якості та кількості.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Упаковка згідно з інструкціями (профілі, планки). Співпраця з іншими працівниками. Візуальний огляд виготовлених профілів, контроль якості та кількості виготовленої продукції.",
    additionalNotes: "Робота у філіалі в Наградовіце або Познані.",
  },
  // Вакансія №107 - Colquimica Plewiska
  {
    agencyName: "MANPAWER",
    templateName: "Colquimica Plewiska Оператор виробництва промислових клеїв (Виробництво та промисловість)",
    vacancydescription: "Оператор виробництва промислових клеїв (Виробництво та промисловість) — Plewiska",
    category: "Виробництво та промисловість",
    keywords: [
      "Colquimica",
      "Plewiska",
      "Poznań",
      "клеї",
      "англійська мова",
      "оператор",
      "чоловіки",
      "4 бригади",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Працевлаштування напряму до клієнта. Обов'язкове знання англійської мови. Потрібне резюме. Не вказувати назву Colquimica в оголошенні.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Plewiska",
    locationDescription: "ul. Szkolna 30, 62-064 Plewiska",
    voivodeship: "Wielkopolskie",
    country: "Polska",
    checkInCity: "Poznań",
    salary: {
      baseNetto: "5500–5800 зл брутто / місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Стартова премія 550 зл брутто; робота у вихідні +50 зл/день; поповнення карти Pluxee 350 зл/місяць.",
      salaryNotes: "Обід за 1 зл.",
    },
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "Система 4 бригади",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "3 дні роботи (07:00–19:00), 3 дні вихідні, 3 дні роботи (19:00–07:00), 3 дні вихідні.",
    },
    accommodation: {
      type: "Власне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "Житло не надається.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details:
        "Безкоштовний транспорт з Познані (Rondo Rataje → Poznań Główny → вул. Głogowska → Plewiska).",
    },
    employerCompensations: {
      hasCompensations: true,
      details:
        "Medicover, Multisport, групове страхування, lunch-карта, професійні навчання.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "Потрібне резюме (CV).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не вимагається",
      languageDetails:
        "Обов’язкове знання англійської мови (комунікативний рівень).",
      physicalLoad: "Можливе перенесення вантажів до 20 кг.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails:
        "Сучасне автоматизоване виробництво. Теплі приміщення.",
      workwearFree: true,
      foodType: "Субсидоване",
      foodDetails: "Обід для працівника коштує 1 зл.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування нескладних виробничих машин. Контроль якості готової продукції (промислові клеї). Пакування продукції, передача на склад. Робота з внутрішніми комп’ютерними системами та виробничою звітністю.",
    additionalNotes: "Пряме працевлаштування до міжнародної компанії.",
  },
  // Вакансія №108 - Mueller Grudziądz
  {
    agencyName: "MANPAWER",
    templateName: "Mueller Biały Bór Обслуговування машин з виробництва свічок (Виробництво та промисловість)",
    vacancydescription: "Обслуговування машин з виробництва свічок (Виробництво та промисловість) — Biały Bór",
    category: "Виробництво та промисловість",
    keywords: [
      "Mueller",
      "Grudziądz",
      "Biały Bór",
      "свічки",
      "фізична робота",
      "чоловіки",
      "50кг",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Фізично важка робота (пакети 50 кг). Етапи: CV -> розмова з консультантом -> розмова з клієнтом + екскурсія.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Biały Bór",
    locationDescription: "Biały Bór II 211, 86-302 Biały Bór (біля Grudziądz)",
    voivodeship: "Kujawsko-pomorskie",
    country: "Polska",
    checkInCity: "Grudziądz",
    salary: {
      baseNetto: "5088 злотих брутто/місяць",
      studentNetto: "",
      hoursRange: "168-240",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія до 10% за продуктивність (після 2 міс); надбавка за нічні зміни 25%.",
      salaryNotes: "Максимум 60 годин на тиждень.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "Згідно з КЗпП",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "3 зміни по 8 годин.",
    },
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "400 PLN",
      details: "Можливе проживання з доплатою працівника до 400 PLN.",
    },
    transport: {
      provided: false,
      costRaw: "",
      details: "Доїзд не надається.",
    },
    employerCompensations: {
      hasCompensations: false,
      details: "",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Початковий (А2)",
      languageDetails: "Польська мова на комунікативному рівні (А2).",
      physicalLoad:
        "Важка фізична робота: подача сировини (пакети 50 кг) до машини поштучно кілька разів на день.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: true,
      specificNuances: ["Запилення"],
      specificConditionsDetails: "Легке запилення у відділі, тепло.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування виробничих машин. Подача сировини для виробництва свічок до машини (пакети вагою 50 кг, які закидаються поштучно). Контроль за роботою машин, підтримання порядку, виконання дрібного ремонту за потреби.",
    additionalNotes: "Стабільне працевлаштування на основі Umowa o pracę.",
  },
  // Вакансія №109 - Onnera Palmiry-2
  {
    agencyName: "MANPAWER",
    templateName: "Onnera Palmiry Оператор штампувального верстату (виробництво миючих машин) (Виробництво та промисловість)",
    vacancydescription:
      "Оператор штампувального верстату (виробництво миючих машин) (Виробництво та промисловість) — Palmiry",
    category: "Виробництво та промисловість",
    keywords: [
      "Onnera",
      "Palmiry",
      "Czosnów",
      "Варшава",
      "метал",
      "штампування",
      "оператор",
      "чоловіки",
    ],
    contractType: "Umowa o pracę",
    forRecruiter: {
      internalNotes:
        "Офіс: Nowy Dwór Mazowiecki, ul. Przejazd 7. Потрібна польська мова. Не вказувати назву Onnera в оголошенні.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },
    location: "Palmiry",
    locationDescription: "Palmiry (біля Czosnów, поблизу Варшави)",
    voivodeship: "Mazowieckie",
    country: "Polska",
    checkInCity: "Nowy Dwór Mazowiecki",
    salary: {
      baseNetto: "5200 zł брутто / місяць",
      studentNetto: "",
      hoursRange: "168",
      payoutDates: "Згідно з регламентом",
      bonusDetails:
        "Премія від 1-го місяця — 500 zł брутто; додаткові нагороди за рішенням керівника.",
      salaryNotes: "Надгодини: +50% у будні, +100% у вихідні.",
    },
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт",
      breakDuration: "20-30 хв",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "06:00–14:00, 14:00–22:00, 22:00–06:00.",
    },
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "300 zł / місяць",
      details: "Хостел, 3–4 особи в кімнаті, повністю укомплектований.",
    },
    transport: {
      provided: true,
      costRaw: "Безкоштовно",
      details: "Безкоштовний доїзд з: Płońsk, Nowy Dwór Mazowiecki.",
    },
    employerCompensations: {
      hasCompensations: true,
      details: "Medicover, Multisport, групове страхування PZU, MyBenefit.",
    },
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побуту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Комунікативний",
      languageDetails:
        "Потрібне знання польської мови для налаштування програм верстату.",
      physicalLoad:
        "Завантаження листів металу, вирізання деталей, робота стоячи.",
    },
    businessTrip: {
      isBusinessTrip: false,
      requiresPolishExperience: false,
      requiredDocuments: [],
      tripDetails: "",
    },
    conditions: {
      hasSpecificConditions: false,
      specificNuances: [],
      specificConditionsDetails: "Теплі виробничі приміщення.",
      workwearFree: true,
      foodType: "Власне",
      foodDetails: "Їдальня, автомати, мікрохвильовка.",
    },
    startExpenses: {
      hasStartExpenses: false,
      details: "",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },
    description:
      "Обслуговування штампувального верстату для листового металу. Завантаження листів металу у верстат, встановлення інструментів. Налаштування програми згідно з виробничим замовленням. Вирізання деталей та розміщення їх на піддонах.",
    additionalNotes: "Допомога в підготовці документів на карту побиту.",
  },
];
module.exports = manpawerTemplates;
