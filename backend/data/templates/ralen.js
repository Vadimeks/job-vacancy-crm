// backend/data/templates/ralen.js

const ralenTemplates = [
  // === 1. PORTA KMI Ełk ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "PORTA KMI Ełk - Виробництво металевих та дерев'яних дверей",
    vacancydescription:
      "Виробництво металевих та дерев'яних дверей (Помічник на виробництво дверей і рам)",
    category:
      "⚙️ Виробництво і прамысловасть / Деревообробка та меблева промисловість",
    keywords: [
      "RALEN",
      "PORTA KMI",
      "Porta",
      "Ełk",
      "Елк",
      "двері",
      "дерев'яні двері",
      "металеві двері",
      "Білосток",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Ełk",
    locationDescription:
      "Ełk, 19-300 (Вармінсько-Мазурське воєводство, близько до Білостока)",
    voivodeship: "Вармінсько-Мазурське",
    country: "Польща",
    checkInCity: "Ełk",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.50 zł/год (за законом Polski Ład)",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років); 25.50 zł/год для молоді до 26 років без статусу студента.",
      hoursRange: "180–240 годин на місяць",
      payoutDates: "До 15 числа наступного місяця на розрахунковий рахунок.",
      bonusDetails:
        "+1 PLN NETTO за кожну відпрацьовану годину за умови, якщо кандидат відпрацював повний місяць без пропусків. Доплата за своє житло 300 PLN брутто / місяць після відпрацьованих 6 місяців. Премії за виробіток понад 230 годин.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12",
      workDaysWeek: "Пн–Пт (субота за потребою)",
      breakDuration: "Визначається внутрішнім розпорядком заводу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Дві-три зміни: 06:00-14:00 + дод. години; 14:00-22:00 + дод. години; на деяких відділах є нічні зміни 22:00-06:00. Робота по 8-10 годин, за потреби підприємства — по 12 годин. СУБОТА може бути робоча (потрібно попередити бригадира у п'ятницю про бажання вийти). Неділя — вихідний.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "450 zł нетто/місяць",
      details:
        "Проживання вираховується з заробітної плати. Житло в спальному районі біля озера.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Доїзд до роботи міським автобусом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Доплата за своє житло 300 PLN брутто після 6 місяців роботи.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна", "Білорусь"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "A1",
      languageDetails: "Комунікативне знання польської мови.",

      physicalLoad:
        "Досвід фізичної роботи, готовність до нічних змін, відсутність шкідливих звичок. Вітається досвід роботи на верстатах і пресах з обробки металу.",
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
      specificNuances: ["Шум"],
      specificConditionsDetails:
        "На окремих ділянках (наприклад, шліфування в цеху металевих дверей) на період навчання пропонується 8 робочих годин з наступним переходом на 10-12 годинні зміни. Період навчання від 1 тижня (оцінюється бригадиром). На підприємстві немає різких запахів. Немає великих норм.",
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
        "Робочий одяг надається безкоштовно (взуття, штани, футболка), але при умові відпрацювання мінімум 2,5 місяці. В іншому випадку з зарплати буде утримано 500 zł.",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Зварювальні роботи; шліфувальні роботи; допоміжні роботи при виробництві дверей та дверних рам; подача виробничих елементів операторам машин; збірка готових елементів; упаковка готових виробів та елементів; ручна транспортування виробів по заводу.",
    additionalNotes:
      "Переваги вакансії: Екологічно чистий район, курортне місто. Житло в спальному районі та біля озера. Офіс агентства знаходиться в місті Ełk. Велике, стабільне підприємство.",
  },

  // === 2. ADLER Bielsko-Biała (Пусты шаблон для будучай фільтрацыі) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName:
      "ADLER Bielsko-Biała - Виробництво шумоізоляції для автомобілів",
    vacancydescription: "Виробництво шумоізоляції для автомобілів",
    category:
      "⚙️ Виробництво і прамысловасть / Автомобільна промисловість (Automotive)",
    keywords: [
      "RALEN",
      "ADLER",
      "Bielsko-Biała",
      "Бєльсько-Бяла",
      "шумоізоляція",
      "автомобілі",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "Шаблон створено пустим для подальшої фільтрації по локації Bielsko-Biała. Повний опис вакансії очікується.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Bielsko-Biała",
    locationDescription: "Bielsko-Biała",
    voivodeship: "Сілезьке",
    country: "Польща",
    checkInCity: "Bielsko-Biała",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "",
      studentNetto: "",
      hoursRange: "",
      payoutDates: "",
      bonusDetails: "",
      salaryNotes: "",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 0,
      hoursPerShift: "",
      workDaysWeek: "",
      breakDuration: "",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description: "",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "",
      details: "",
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
      ageMax: 0,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: false,
      entranceTestsDetails: "",
      polishLanguageLevel: "Не потрібна",
      languageDetails: "",
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
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description: "Детальний опис вакансії очікується.",
    additionalNotes: "",
  },

  // === 3. SCANFI Mysłowice (Поўны па апісанні) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "SCANFI Mysłowice - Оператор листозгинального верстата CNC",
    vacancydescription:
      "Виробництво банкоматів, пральних машин, медичного обладнання (Оператор CNC)",
    category:
      "⚙️ Виробництво і прамысловасть / Металообробка та машинобудування",
    keywords: [
      "RALEN",
      "SCANFI",
      "Mysłowice",
      "Мислювіце",
      "CNC",
      "листозгинальний",
      "Катовіце",
      "Katowice",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Mysłowice",
    locationDescription: "Mysłowice (13 км від Katowice)",
    voivodeship: "Сілезьке",
    country: "Польща",
    checkInCity: "Katowice",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26.00–30.00 zł/год (за законом Polski Ład)",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "180–220 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails:
        "+1 PLN/год — доплата за власне житло. Ставка визначається за результатами співбесіди (залежно від досвіду кандидата).",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн–Пт (субота за бажанням)",
      breakDuration: "Визначається внутрішнім розпорядком заводу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота по 8 годин з Пн по Пт. Три зміни (початок зміни встановлює підприємство): 1 зміна: з 5:30 - 13:30 або 6:00 - 14:00; 2 зміна: з 13:30 - 21:30 або 14:00 - 22:00; 3 зміна: з 21:30 - 5:30 або 22:00 - 6:00. За бажанням можна працювати в суботу, а також брати додаткові години.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł в добу (вираховується із зарплати)",
      details:
        "Проживання надається. Необхідно мати власну постільну білизну та посуд (не надаються).",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details:
        "Хороша транспортна розв’язка з найближчих міст і зупинка в пішій доступності ад завода.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Раз на рік підвищення кваліфікації. Можливість кар'єрного росту (бригадир, карщик, налагоджувальник). Лояльне ставлення до співробітників.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Обов'язкове резюме (CV) польською мовою для проходження співбесіди.",
      experienceRequired: true,
      hasEntranceTests: true,
      entranceTestsDetails:
        "Перед працевлаштуванням кандидати проходять обов'язкове співбесіду на підприємстві польською мовою.",

      polishLanguageLevel: "B1",
      languageDetails:
        "Комунікативна польська мова (для проходження співбесіды).",

      physicalLoad:
        "Управління листозгинальними верстатами CNC, налаштування та робота за технічними кресленнями. Контроль якості готових виробів.",
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
      details:
        "Робочий одяг платний, ціна залежить від закупівельної вартості.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Управління листозгинальними верстатами CNC; Налаштування та робота на верстатах для точної згинання металевих листів за технічними кресленнями; Оптимізація процесів згинання та мінімізація відходів; Контроль якості готових виробів (відповідність розмірам і специфікаціям бригадира); Обслуговування та регулярне технічне забезпечення верстатів.",
    additionalNotes:
      "Плюси вакансії: 13 км від Катовіце, високий заробіток, легка та цікава робота для чоловікаў, щорічне підвищення кваліфікацыі.",
  },

  // === 4. ШВАЧКИ Ełk ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "ШВАЧКИ Ełk - Швейне виробництво (пошиття костюмів)",
    vacancydescription:
      "Швейне виробництво (пошиття чоловічих костюмів). Робота для швачок",
    category:
      "⚙️ Виробництво і прамысловасть / Легка промисловість та текстиль",
    keywords: [
      "RALEN",
      "швачки",
      "швачка",
      "шиття",
      "Ełk",
      "Елк",
      "костюми",
      "швейне виробництво",
      "Білосток",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Ełk",
    locationDescription:
      "Ełk (100 км від Білостока), Вармінсько-Мазурське воєводство",
    voivodeship: "Вармінсько-Мазурське",
    country: "Польща",
    checkInCity: "Ełk",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "Перші 2 дні (навчання) — 28.00 zł/год. Далі зарплата розраховується по виробітку (акордна система).",
      studentNetto: "30.50 zł/год (студенти до 26 років зі статусом студента).",
      hoursRange: "180–220 годин на місяць",
      payoutDates: "До 15 числа наступного місяця на банківський рахунок.",
      bonusDetails:
        "В день по виробітку виходить приблизно 200–250 зл. Щомісячна зарплата становить від 4000 до 5300 зл нетто.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Доплати за власне житло немає.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 1,
      hoursPerShift: "8",
      workDaysWeek: "Пн–Пт (субота за бажанням при великих обсягах)",
      breakDuration: "Дві перерви: з 09:00-09:15 та 12:00-12:05.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота в 1 зміну: Пн-Пт з 06:00 до 14:00. Робота без нічних змін. При великому обсязі роботи можливі понаднормові години та робочі суботи.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "Перший місяць — 600 zł/міс. Далі — близько 750 zł/міс.",
      details:
        "Житло надається агентством (утримується з зарплати). Доплати за своє житло немає.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Транспорт для доїзду не вказаний.",
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
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: true,
      hasEntranceTests: true,
      entranceTestsDetails:
        "Перед працевлаштуванням проводиться обов'язкова співбесіда.",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Без знання польської мови.",

      physicalLoad:
        "Досвід роботи на швейному виробництві обов'язковий. Уміння виконувати конкретні операції якісно і точно. Уважність, акуратність, робота в команді.",
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
      specificNuances: ["Обмеження використання телефонів"],
      specificConditionsDetails:
        "Робота сидячи на сучасному виробництві з хорошими умовами. Використання телефонів і навушників можливе виключно під час перерви.",
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
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Історія бренду почалася в 1992 році. Пошиття одягу для чоловіків, які цінують елегантність і найвищу якість. Щомісяця відшивається 5000 костюмів для мережі з 84 магазинів у Польщі. Робота поопераційна (кожен працівник виконує окрему операцію). Приклади операцій: пошив рукавів; вшивання блискавок; вшивання кишень; пришивання ґудзиків; пришивання етикеток; підгин та підшив низу штанів; пришивання поясної стрічки; з'єднання основних деталей виробу. Робочий одяг: своя змінна одежа.",
    additionalNotes:
      "Переваги вакансії: робота без нічних змін, висока заробітна плата, без знання польської мови, робота на сучасному виробництві з хорошими умовами, курортне місто з розвиненою інфраструктурою та всім необхідним для життя.",
  },

  // === 5. Мясокомбинат Łuków ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "М'ЯСОКОМБІНАТ Łuków - Забій, обвалка, заморозка",
    vacancydescription:
      "М'ясокомбінат (Забій, обвалка, заморозка. Виробництво ковбасних виробів та консервів)",
    category: "⚙️ Виробництво і прамысловасть / М'ясокомбінати та рибзаводи",
    keywords: [
      "RALEN",
      "м'ясокомбінат",
      "мясокомбинат",
      "Łuków",
      "Луків",
      "м'ясо",
      "забій",
      "обвалка",
      "Люблін",
      "Warszawa",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łuków",
    locationDescription:
      "Łuków (місто в Люблінському воєводстві, 100 км від Варшави)",
    voivodeship: "Люблінське",
    country: "Польща",
    checkInCity: "Łuków",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "29.00 zł/год (Відділ розробки)",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "200–220 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails: "+1 zł/год — доплата за власне житло.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "Понеділок - Субота",
      breakDuration: "8-годинний робочий день — 20 хвилин перерва.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у денні зміни (нічні можуть бути тільки при гострій виробничій необхідності). 1 зміна: 06:00 - 14:00; 2 зміна: 14:00 - 22:00. Основна зміна 8 годин, є доп.години — можна працювати по 10-12 годин.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł / добу (утримується із зарплати)",
      details:
        "При заселенні потрібно мати своє постільне білизну; ковдри та подушки надаються. Є доплата за власне житло +1 zł/год.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details: "Доїзд до роботи місцевим транспортом безкоштовно.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безлімітний безкоштовний обід (чай, кава, вода; суп, 2 гарячих страви та м'ясна нарізка).",
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

      polishLanguageLevel: "A1",
      languageDetails:
        "Для складу живої худоби та відділу відвантаження потрібна розмовна польська (або англійська для відвантаження).",

      physicalLoad:
        "Відділ живої худоби (тільки чоловіки): вивантаження з машин, перегін у бокси, контроль стану. Відділ експедиції (чоловіки, зріст бажано від 170-175 см): підготовка продукції, перевірка якості, сортування, комплектація (сканери/накладні), переміщення ящиків і палет, обмотка плівкою. Жінка-вагівник: зважування худоби перед забоєм, робота з комп'ютером, реєстрація транспорту, оформлення документів. Бажання працювати мінімум 3 місяці.",
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
      specificNuances: ["Холод (+4 до +8 ℃)", "Запах"],
      specificConditionsDetails:
        "Температура на виробництві: від +4 до +8 ℃. Мясокомбінат Łuków є одним із найстаріших виробників ковбасних виробів і консерв в Польщі (початок діяльності — 1973 рік).",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails:
        "Безлімітний безкоштовний обід (чай, кава, вода; суп, 2 гарячих страви та м'ясна нарізка).",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Вартість оформлення санепід книжки 150 zł (вираховується із зарплати, фірма допомагає зареєструватися на найближчу дату).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Жінка-вагівник: зважування свиней або великої рогатої худоби перед забоєм; робота з комп'ютерною системою ваг; реєстрація транспорту; оформлення документації. Pracownik Magazynu Żywca (тільки чоловіки): вивантаження тварин з машин; перегін тварин в бокси, контроль за їх станом. Pracownik na Dział Ekspedyції (тільки чоловіки): прийом готових виробів, перевірка якості, сортування; комплектація замовлень за накладними (використання сканерів); переміщення ящиків і палет, формування палет і обмотка стретч-плівкою, погрузка. Робочий одяг (жилет, білі штани, білий халат, сеточка, маска) видається та прасується підприємством.",
    additionalNotes: "Адреса підприємства: Łuków, Люблінське воєводство.",
  },

  // === 6. АРМАТУРА Radom ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "АРМАТУРА Radom - Виробництво арматурних каркасів",
    vacancydescription:
      "Виробництво арматурних каркасів та сіток (Обробка арматурних прутків на ЧПУ-машинах)",
    category:
      "⚙️ Виробництво і прамысловасть / Металообробка та машинобудування",
    keywords: [
      "RALEN",
      "арматура",
      "Radom",
      "Радом",
      "арматурні каркаси",
      "зварювання",
      "Warszawa",
      "ЧПУ",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Radom",
    locationDescription: "Radom (100 км від Варшави)",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Radom",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.00 zł/год (за законом Polski Ład)",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "200–240 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails:
        "+1 PLN/год — доплата за власне житло. Можливість брати додаткові години за бажанням.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-12",
      workDaysWeek:
        "Пн–Нд (вихідні плаваючі, робота в суботу та неділю можлива)",
      breakDuration:
        "При 12-годинній зміні: 2 перерви по 15 хвилин. При 8-годинній зміні: 1 перерва — 15 хвилин.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 або 3 зміни (встановлює підприємство). 2 зміни: 06:00-18:00 та 18:00-06:00 (по 12 год). 3 зміни: 06:00-14:00, 14:00-22:00, 22:00-06:00 (по 8 год). Субота: 06:00-18:00. Неділя: максимум 8 робочих годин. Є можливість брати додаткові години.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł в добу (вираховується із зарплати)",
      details:
        "Житло надається. При заселенні потрібно мати своє постільне білизну, ковдри та подушки надаються. Є доплата за власне житло +1 zł/год.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Доїзд до роботи пішки або громадським транспортом.",
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
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails:
        "Знання польської мови не вимагається (але бажано розуміння для читання технічних планів виробництва).",

      physicalLoad:
        "Досвід фізичної роботи. Бажання працювати мінімум 3 місяці. Робота з металом вимагає суворих норм безпеки: захисні окуляри, рукавички.",
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
      specificNuances: ["Шум", "Пил"],
      specificConditionsDetails:
        "Робота на виробництві арматурних каркасів. Оператор контролює процес зварювання, позиціонування прутків, подачу проволоки/електрода. Вимагає суворого дотримання нормативів BHP (охорона праці).",
      workwearFree: false,
      foodType: "За свій рахунок",
      foodDetails: "",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Робочий одяг платний, ціна залежить від закупівельної вартості.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Обробка арматурних прутків: різання, гнуття, правлення прутків на цифрових / ЧПУ-машинах. Зварювання та збірка арматурних каркасів і сіток: автоматизовані або напівавтоматичні зварювальні станції. Контроль якості продукції: відповідність розмірів, замір довжини, діаметра, кутів згину, міцність швів, ведення документації. Налаштування та калібрування машин перед серією виробництва (швидкість різання, кут вигину, сила зварки). Просте технічне обслуговування (очистка місця, змазка, заміна зношених елементів). Робота з панелями управління і пультами. Взаємодія з логістикою і складом (передача заготовок і готових сіток).",
    additionalNotes: "Адреса підприємства: Radom, Мазовецьке воєводство.",
  },

  // === 7. GODZINÓWKA Wyszków ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "GODZINÓWKA Wyszków - Оптовий склад супермаркету",
    vacancydescription:
      "Оптовий склад продовольчих товарів популярного супермаркету (Збір замовлення)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "RALEN",
      "GODZINÓWKA",
      "Wyszków",
      "Вишкув",
      "склад",
      "супермаркет",
      "електропогрузчик",
      "Warszawa",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "Робота для чоловіків без досвіду роботи, але з великим бажанням заробити.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Wyszków",
    locationDescription: "Wyszków (60 км від Варшави, Мазовецьке воєводство)",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Wyszków",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "26.00 zł/год (базова 24.50 zł/год + 1.50 zł/год надбавка за законом Polski Ład) — для 1-го та 2-го місяців.",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "200–220 годин на місяць",
      payoutDates: "До 15-го числа наступного місяця.",
      bonusDetails:
        "З 3-го місяця перехід на аккорд (відрядна система) + додаткові премії від виробітку (встановлена норма завантажених коробок дозволяє заробляти більше). На руки в місяць до 10 000 PLN нетто. Доплата за проживання на своєму житлі — 300 zł brutto/міс.",
      salaryNotes:
        "Перші 4 тижні — випробувальний термін на погодинній ставці, після чого переводять на аккорд.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-10",
      workDaysWeek: "Плаваючий графік (6 днів на тиждень, 1 вихідний)",
      breakDuration: "30 хвилин (працівник розподіляє самостійно).",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 3 зміни: 06:00-14:00, 14:00-22:00, 22:00-06:00. Робочих годин 200–220 на місяць (додаткові години залежать від замовлень). Графік ковзний, доводиться працівнику за тиждень.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "500 zł / місяць",
      details:
        "Проживання надається у хостелі (утримується з зарплати). Відстань до роботи близько 3 км. Є доплата за власне житло 300 zł brutto/міс.",
    },
    transport: {
      provided: false,
      costRaw: "150 zł за бензин (якщо авто) або пішки",
      details:
        "Є службові машини: працівники домовляються між собою і скидаються на бензин по 150 зл. Якщо такий варіант не підходить — дістаються до роботи пішки (~3 км).",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Повноцінний гарячий безкоштовний обід (шведський стіл), безкоштовна мінеральна вода, безкоштовны масаж спини (кабінет на складі). Отримання сертифікату на електропогрузчик.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки"],
      ageMax: 60,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: true,
      additionalDocsDetails:
        "Потрібна санепідкнижка польського зразка (вартість 150 zł) та сертифікат на електропогрузчик (при відсутності — допомога в отриманні за 100 zł).",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails:
        "Знання мови не обов'язкове (але корисне для голосового сканера).",

      physicalLoad:
        "Збір замовлень за допомогою сканера в режимі аудіозв'язку (через навушники), навантаження дрібних партій на палети, управління електропогрузчиком, обмотка плівкою. Бажання працювати мінімум 6 місяців.",
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
      specificNuances: ["Холод у деяких зонах"],
      specificConditionsDetails:
        "Склад розділений на відділи: овочі, молочка, сухий склад, побутова хімія, курка, заморозка тощо. Температура в залежності від відділу до +18. Помірне фізичне навантаження.",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails:
        "Гарячий обід по типу шведського столу: перше, друге, 4-8 салатів, компот або чай. Надається вдень з 10:00-12:00 і вночі з 2:00-4:00.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Оформлення санепідкнижки (150 zł з зарплати). Навчання та сертифікат на електропогрузчик (100 zł з першої зарплати, якщо немає).",
    },
    earlyTerminationLiability: {
      hasLiability: true,
      details:
        "Робочий одяг (флісова товстовка, комбінезон, термобілизна, каска, взуття) надається безкоштовно за умови відпрацювання 2,5 місяців. У іншому випадку утримується 500 zł з зарплати.",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Збір замовлень за допомогою сканера в режимі аудіозв'язку (отримання голосових команд через навушники і підтвердження голосом позицій); навантаження дрібних партій товарів на палети; управління електропогрузчиком; обмотка плівкою палети з зібраним замовленням і транспортування в вказане місце для подальшої погрузки.",
    additionalNotes:
      "Адреса складу: Wyszków, Leśna 33. Підтримка бригадира під час навчання на місці і в хостелі. Допомога в легалізації (отримання карти побиту).",
  },

  // === 8. Кладовщик Nowy Dwór ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "Кладовщик Nowy Dwór - Холодний склад харчових продуктів",
    vacancydescription:
      "Холодний склад харчових продуктів (Комплектувальник замовлень / Завантаження-розвантаження фур)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "RALEN",
      "Nowy Dwór",
      "Новий Двір",
      "холодний склад",
      "харчові продукти",
      "комплектувальник",
      "Warszawa",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "Компанія є провідним логістичним оператором у Польщі, що спеціалізується на продуктах харчування з контрольованою температурою.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Nowy Dwór Mazowiecki",
    locationDescription:
      "Nowy Dwór Mazowiecki (30 км від Варшави, Мазовецьке воєводство)",
    voivodeship: "Мазовецьке",
    country: "Польща",
    checkInCity: "Nowy Dwór Mazowiecki",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26.00 zł/год (перший місяць).",
      studentNetto:
        "31.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "240–260 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails:
        "+1 PLN/год — доплата за власне житло. З другого місяця перехід на акордну систему (можна заробити значно більше).",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek:
        "Пн-Пт (виробництво працює 7 днів на тиждень, можливі робочі вихідні за потреби)",
      breakDuration:
        "Кожні 2 години — перерва 15 хвилин. Усі перерви оплачувані (сумарно 1.5 години за зміну)!",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота з понеділка по п'ятницю по 12 годин на день. Оплачувані перерви кожні дві години.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "19 zł / добу (вираховується із заробітної плати)",
      details:
        "Житло надається. При заселенні потрібно мати власну постільну білизну. Ковдри та подушки надаються. Є доплата за власне житло +1 zł/год.",
    },
    transport: {
      provided: false,
      costRaw: "~100 zł на бензин або квиток на транспорт",
      details:
        "Доїзд автомобілем — працівники скидаються на бензин по 100 зл. Або місцевим транспортом за власний рахунок.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Надається безкоштовний обід на зміні.",
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
      languageDetails:
        "Знання мови не вимагається (але корисне для голосового сканера Voice).",

      physicalLoad:
        "Комплектування замовлень за допомогою сканера Voice, навантаження/розвантаження товару. Розвантаження фур на спеціальному візку (права УДТ не потрібні). Бажання працювати тривалий період часу.",
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
      specificNuances: ["Холод (-22 ℃)"],
      specificConditionsDetails:
        "Робота при температурі -22 ℃ (відчувається менше, в русі людям тепло і немає дискомфорту). Робота в холодній зоні суворо регламентована: є чергування з теплими приміщеннями, обов'язкові перерви для обігріву та гарячі напої.",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails: "Надається безкоштовний обід.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Оформлення санепідкнижки — 150 zł (вираховується із зарплати, якщо немає своєї).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Комплектувальник: збір товарів (замовлень) за допомогою сканера Voice в режимі аудіозв'язку (отримання команд через навушники і підтвердження голосом); робота з системою Voice; погрузка / розвантаження товару; прийом, розміщення і видача продукції з допомогою погрузчика. Завантаження/розвантаження фур: робота на спеціальному візку (права УДТ не потрібні), завантаження/розвантаження палет у фуру та підтвердження дії на сканері. Кожному безкоштовно видається сучасна спецодяг для низьких температур (термокомплекти, утеплені черевики, рукавички, балаклава).",
    additionalNotes: "Адреса підприємства: Nowy Dwór Mazowiecki.",
  },

  // === 9. БЕТОННІ ВИРОБИ Łódź ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName:
      "БЕТОННІ ВИРОБИ Łódź - Виробництво бетонних плит для побутової техніки",
    vacancydescription:
      "Виробництво противаг (бетонних плит) для побутової техніки за технологією ECOHEAVY+",
    category:
      "⚙️ Виробництво і прамысловасть / Виробництво будматеріалів та ЗБВ",
    keywords: [
      "RALEN",
      "бетонні вироби",
      "бетон",
      "Łódź",
      "Лодзь",
      "противаги",
      "ECOHEAVY",
      "побутова техніка",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "Найбільший польський виробник і постачальник противаг для виробників побутової техніки. Сучасне, автоматизоване підприємство.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łódź",
    locationDescription: "Łódź (Лодзь, Польща)",
    voivodeship: "Лодзинське",
    country: "Польща",
    checkInCity: "Łódź",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "Виробничий працівник: 23,50 zł/год (за 8 год), 28,00 zł/год (додаткові год). Оператор машин: 24,50 zł/год (за 8 год), 29,00 zł/год (додаткові год).",
      studentNetto:
        "Виробничий працівник (студенти до 26 р.): 30,50 zł/год (за 8 год), 34,50 zł/год (додаткові год). Оператор машин (студенти до 26 р.): 30,50 zł/год (за 8 год), 34,10 zł/год (додаткові год).",
      hoursRange: "168–200 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails:
        "Доплати за власне житло немає. Ставки вказані згідно із законом Polski Ład.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт (субота за бажанням/потребою)",
      breakDuration: "Визначається внутрішнім розпорядком заводу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота тільки в денні зміни (у 2 зміни): з 06:00 - 14:00, з 14:00 - 22:00. Зміна 8 годин + додаткові години (при узгодженні). В місяць виходить 168 - 200 годин.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Безкоштовне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "0 zł (надається безкоштовно)",
      details:
        "Житло надається безкоштовно. При заселенні потрібно мати власну постільну білизну. Ковдри та подушки надаються. Доплати за власне житло немає.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Транспорт для доїзду не вказаний.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Можливість кар'єрного росту (бригадир, карщик, налагоджувальник). Безкоштовне житло.",
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
      languageDetails: "Знання мови не обов'язкове.",

      physicalLoad:
        "Хороша фізична форма. Робочі процеси автоматизовані, важку роботу допомагає виконувати техніка (лебідки). У жінок вага противаг максимум 2кг, 4кг, 6кг. Бажання працювати мінімум 3 місяці.",
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
      details:
        "Перші 2 тижні співробітники працюють у своєму одязі, далі надається платно (сума утримується з зарплати та залежить ад комплекту).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Умови для чоловіків: Робота в команді по 5-8 чоловік. Обслуговування машини, яка розливає і подає бетон у форми; готове форми лебідкою переносяться на ленту; вкручування шпильок і закручування гайок для закріплення форми; перенесення готової форми лебідкою на піддон; викручування шпильок та витягування готової продукції після затвердіння. Умови для жінок: заповнення форм бетонним розчином, складування та сортування готової продукції, перевірка якості готової продукції, обслуговування машини (вага виробів максимум 2-6 кг).",
    additionalNotes:
      "Переваги вакансії: тільки денні зміни, безкоштовне житло, місто з розвиненою інфраструктурою, сучасне автоматизоване підприємство.",
  },

  // === 10. JAN BIELIESZ Cieszyn (Ковбаси) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "JAN BIELIESZ Cieszyn - Виробництво ковбасної продукції",
    vacancydescription:
      "Сімейне виробництво ковбасних виробів (без забою). Виготовлення ковбас, делікатесів",
    category: "⚙️ Виробництво і прамысловасть / М'ясокомбінати та рибзаводи",
    keywords: [
      "RALEN",
      "JAN BIELIESZ",
      "Jan Bieliesz",
      "Cieszyn",
      "Тешин",
      "ковбаси",
      "м'ясо",
      "експедиція",
      "Катовіце",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "На підприємстві немає забою (немає різкого запаху). Приїжджає вже розібране м'ясо.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Cieszyn",
    locationDescription:
      "Cieszyn (недалеко від кордону з Чехією, 100 метрів від Чехії)",
    voivodeship: "Сілезьке",
    country: "Польща",
    checkInCity: "Cieszyn",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.00 zł/год (за законом Polski Ład).",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "180–220 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails:
        "+1 PLN/год — доплата за власне житло. Додаткові години призначаються індивідуально.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "Пн-Пт (субота за потреби)",
      breakDuration: "Визначається внутрішнім розпорядком заводу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Денні зміни: з 06:00 - 14:00 та з 14:00 - 22:00. Основні зміни 5 днів на тиждень по 8 годин. Додаткові години призначаються індивідуально.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł в добу (вираховується із зарплати)",
      details:
        "Хороші умови, 2-місні кімнати. При заселенні потрібно мати свою постільну білизну; ковдри та подушки надаються. Є доплата за власне житло +1 zł/год.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details:
        "Надається службова машина та безкоштовне паливо для доїзду на роботу (близько 10 км від житла).",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Безкоштовний сніданок та повноцінний гарячий обід.",
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
      languageDetails:
        "Для цеху виробництва польська мова не потрібна. Для складу (експедиції) — потрібно розуміти польську, щоб читати накладні.",

      physicalLoad:
        "Готовність да роботи стоячи. Робота на складі (експедиція) передбачає підняття коробок вагою да 20 кг.",
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
      specificNuances: ["Холод (+4 до +14°C)"],
      specificConditionsDetails:
        "Виробництво ковбасної продукції: температура +8...+14°C. Експедиція (склад): температура +4...+8°C (не морозилка).",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails:
        "На підприємстві надається безкоштовний сніданок та повноцінний обід.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Оформлення санепідкнижки — 150 zł (утримується із зарплати, фірма допомагае зареєструватися).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Виготовлення ковбасної продукції (Cieszyn): прийняття м'яса, переміщення, вкладання в машини; подача компонентів у машини (завантаження фаршу/м'яса); зважування готової продукції на штанги, візуальний контроль; пакування (перевірка пачок на герметичність). Експедиція (склад): комплектація товарів за накладною, пакування товару, розподіл палет, транспортування на склад і навантаження коробок у фуру (вага коробок до 20 кг). Робочий одяг видається безкоштовно.",
    additionalNotes:
      "Адреса підприємства: Cieszyn. Плюси вакансії: невелике сімейне виробництво, комфортна температура, безкоштовний обід.",
  },

  // === 11. JAN BIELIESZ Goleszów (Варэнікі) ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "JAN BIELIESZ Goleszów - Виробництво вареників та пельменів",
    vacancydescription: "Сімейне виробництво вареників, пельменів та локшини.",
    category: "⚙️ Виробництво і прамысловасть / Гатові страви / кейтэрынг",
    keywords: [
      "RALEN",
      "JAN BIELIESZ",
      "Jan Bieliesz",
      "Goleszów",
      "Голешув",
      "вареники",
      "пельмені",
      "тісто",
      "Катовіце",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes: "Автоматизоване виробництво виробів з тіста.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Goleszów",
    locationDescription:
      "Goleszów (недалеко від кордону з Чехією, 100 метрів від Чехії)",
    voivodeship: "Сілезьке",
    country: "Польща",
    checkInCity: "Goleszów",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.00 zł/год (за законом Polski Ład).",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "180–220 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails:
        "+1 PLN/год — доплата за власне житло. Додаткові години призначаються індивідуально.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-12",
      workDaysWeek: "Пн-Пт (субота за потреби)",
      breakDuration: "Визначається внутрішнім розпорядком заводу",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Денні зміни: з 06:00 - 14:00 та з 14:00 - 22:00. Основні зміни 5 днів на тиждень по 8 годин. Додаткові години призначаються індивідуально.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł в добу (вираховується із зарплати)",
      details:
        "Хороші умови, 2-місні кімнати. Пры заселенні потрібно мати свою постільну білизну; ковдри та подушки надаються. Є доплата за власне житло +1 zł/год.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details: "Піша доступність — 80 метрів від житла до заводу.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "Безкоштовний сніданок та повноцінний гарячий обід.",
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
        "Готовність да роботи стоячи. Для чоловіків: необхідна хороша фізична форма (підняття мішків вагою 25 кг з борошном/крохмалем для засипання в машину).",
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
      specificNuances: ["Тепла температура (+14...+20°C)"],
      specificConditionsDetails:
        "Виробництво вареників, пельменів, лапші: комфортна температура +14...+20°C.",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails:
        "На підприємстві надається безкоштовний сніданок та повноцінний обід.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Оформлення санепідкнижки — 150 zł (утримується із зарплати, фірма допомагае зареєструватися).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Виготовлення вареників, пельменів, локшини (Goleszów): завантаження машин сировиною (тісто і фарш); накладання начинки на стрічку тіста (автоматичний процес); загортання смуги тіста; штампування пельменів за допомогою форми; контроль форми вареників; пакування, наклейка етикеток. Для чоловіків: засипання мішків (25 кг) у тістоміс. Робочий одяг видається безкоштовна.",
    additionalNotes:
      "Адреса підприємства: Goleszów. Плюси вакансії: невяліке сімейне виробництво, комфортна температура, безкоштовний обід.",
  },

  // === 12. ПАКУВАННЯ ОБІДІВ Gądki ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "ПАКУВАННЯ ОБІДІВ Gądki - Виробництво готових обідів",
    vacancydescription:
      "Виробництво та видача готових обідів (Допомога на кухні, видача страв)",
    category: "⚙️ Виробництво і прамысловасть / Гатові страви / кейтэрынг",
    keywords: [
      "RALEN",
      "пакування обідів",
      "Gądki",
      "Гондки",
      "обіди",
      "кухня",
      "Poznań",
      "Познань",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "Робота передбачає як фізичну допомогу на кухні та складі, так і роботу на видачі страв (для кандидатів зі знанням мови).",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Gądki",
    locationDescription: "Gądki (15 км від Познані, Великопольське воєводство)",
    voivodeship: "Великопольське",
    country: "Польща",
    checkInCity: "Poznań",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "25.00 zł/год (ставка згідно із законом Polski Ład).",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "Мінімум 200 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails: "+1 PLN/год — доплата за власне житло.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8-10",
      workDaysWeek: "Пн-Нд (згідно з графіком підприємства)",
      breakDuration: "Визначається внутрішнім розпорядком підприємства",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Основні зміни — вечірні/нічні: з 21:00 до 05:00. Тривалість зміни 8–10 годин. Можливі додаткові денні зміни при збільшенні обсягу замовлень. В місяць мінімум 200 годин.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł в добу (вираховується із зарплати)",
      details:
        "Проживання надається. При заселенні потрібно мати свою постільну білизну; ковдри та подушки надаються. Є доплата за власне житло +1 zł/год.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Транспорт для доїзду не вказаний.",
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

      polishLanguageLevel: "A1",
      languageDetails:
        "Комунікативна польська мова бажана. Для видачі страв — обов'язкова. Англійська мова також розглядається.",

      physicalLoad:
        "Готовність до фізичної роботи (перенесення коробок, каструль і контейнерів з готовими стравами вагою близько 15 кг). Відповідальність, акуратність, вміння працювати в команді.",
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
      hasStartExpenses: true,
      details:
        "Оформлення санепідкнижки — 150 zł (утримується із зарплати, фірма допомагає зареєструватися).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Розвантаження поставок: допомога при прийомі товару, перенесення коробок, контейнерів і каструль з готовими стравами (вага ~15 кг), організація та розміщення продукції на складі/кухні. Підготовка страв: виконання простих кухонних робіт, первинна обробка продуктів, підготовка напівфабрикатів і допомога кухарям. Робота на мийці: миття кухонного посуду, гастроємностей, інвентаря, підтримання чистоти в зоні мийки згідно з санітарними нормами. Підтримання порядку: прибирання робочих місць, розстановка товару та інвентаря, загальна допомога на кухні і в підсобних приміщеннях. Опціонально (видача готових страв): видача обідів співробітникам підприємств (потрібна польська мова), контакт з клієнтами, робота в точці видачі. Робочий одяг надається.",
    additionalNotes:
      "Адреса підприємства: Gądki (біля Познані), Великопольське воєводство.",
  },

  // === 13. ANIMEX Kutno ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "ANIMEX Kutno - Виробник м'яса та м'ясопродуктів",
    vacancydescription:
      "Виробництво м'яса та м'ясопродуктів (Робота на друкуючих та пакувальних машинах)",
    category: "⚙️ Виробництво і прамысловасть / М'ясокомбінати та рибзаводи",
    keywords: [
      "RALEN",
      "ANIMEX",
      "Kutno",
      "Кутно",
      "м'ясо",
      "м'ясопродукти",
      "Krakus",
      "Morliny",
      "Berlinki",
      "Łódź",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "Найбільший польський виробник м'яса і м'ясопродуктів (бренди Krakus, Morliny, Berlinki та ін.). Філія спеціалізується на переробці свинини, виробництві м'ясних виробів та делікатесів.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Kutno",
    locationDescription: "Kutno (70 км від Лодзі, Лодзинське воєводство)",
    voivodeship: "Лодзинське",
    country: "Польща",
    checkInCity: "Kutno",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26.00 zł/год (ставка згідно із законом Polski Ład).",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "200–220 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails: "Додаткові години до 10 годин на день за погодженням.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися. Доплати за власне житло немає.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8-10",
      workDaysWeek: "Понеділок - Субота",
      breakDuration: "8-годинний робочий день — 20 хвилин перерва.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 3 зміни: 1 зміна: 06:00 - 14:00; 2 зміна: 14:00 - 22:00; 3 зміна: 22:00 - 6:00. Основна зміна 8 годин, є можливість брати додаткові години (працювати по 10 годин). У місяць виходить 200–220 годин. Нічні зміни можливі тільки при гострій виробничій необхідності.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł / добу (вираховується із зарплати)",
      details:
        "Житло надається. При заселенні потрібно мати власну постільну білизну; ковдри та подушки надаються.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Місцевим транспортом за свій рахунок або довіз.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details: "На підприємстві надається безкоштовний обід.",
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

      polishLanguageLevel: "A2",
      languageDetails:
        "Комунікативна польська мова (від А2) — вміння читати технічні інструкції.",

      physicalLoad:
        "Підготовка та запуск машини, налаштування обладнання під потрібний продукт, робота на печатних та пакувальних машинах (контроль друку, етикеток, дат, кодів). Дрібний догляд за обладнанням (заміна рулонів). Робота за якісними нормами харчового виробництва.",
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
      specificNuances: ["Холод (+6 до +10 ℃)", "Запах"],
      specificConditionsDetails:
        "Температура на виробництві: від +6 до +10 ℃. Прання робочого одягу після робочого дня здійснюється за рахунок підприємства.",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails: "На підприємстві надається безкоштовний обід.",
    },

    // === 10. ВЫДАТКІ НА СТАРЦЕ І АДКАЗНАСЦЬ ===
    startExpenses: {
      hasStartExpenses: true,
      details:
        "Оформлення санепідкнижки — 150 zł (утримується із зарплати, фірма допомагає зареєструватися).",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "Підготовка та запуск машини: перевірка працездатності обладнання перед зміною, налаштування під потрібний продукт (вага, розмір упаковки, вид етикетки), перевірка наявності матеріалів (плівка, упаковка). Робота на печатних та пакувальних машинах: контроль друку дат і кодів, зміна написів на етикетках при зміні партії, контроль рівності наклейки. Контроль якості та безпеки: перевірка на брак, дотримання правил гігієни. У разі поломок — виклик механіка. Догляд за обладнанням: зміна рулонів етикеток і плівки, підтягування стрічки, чистка машини. Робочий одяг (жилет, білі штани, білий халат, сеточка, шапка та маска) видається підприємством.",
    additionalNotes: "Адреса підприємства: Kutno, Лодзинське воєводство.",
  },

  // === 14. MIELEWCZYK Dzierżążno ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "MIELEWCZYK Dzierżążno - Куряче виробництво (розділ)",
    vacancydescription:
      "Куряче виробництво (виробничий працівник на розділ та пакування птиці)",
    category: "⚙️ Виробництво і прамысловасть / М'ясокомбінати та рибзаводи",
    keywords: [
      "RALEN",
      "MIELEWCZYK",
      "Dzierżążno",
      "Дзержонжно",
      "кури",
      "куряче виробництво",
      "Gdańsk",
      "Гданськ",
      "розділ",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "Суворе обмеження за віком — до 50 років включно! Початок роботи протягом 3-5 днів після прибуття.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Dzierżążno",
    locationDescription:
      "Dzierżążno (28 км від Гданська, Поморське воєводство)",
    voivodeship: "Поморське",
    country: "Польща",
    checkInCity: "Gdańsk / Dzierżążno",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "Гарантована ставка: 25.04 zł/год. Для тих, хто відпрацював 1 повний місяць і добре працює: 26.65 zł/год.",
      studentNetto:
        "Стартова ставка для студентів: 31.00 zł/год. Після 1 повного місяця успішної роботи: 33.00 zł/год.",
      hoursRange: "240–260 годин на місяць",
      payoutDates: "Регулярно, з 15 по 20 число кожного місяця.",
      bonusDetails:
        "На процесі Żywiec (розвантаження живої птиці) робота за акордною системою (від виробітку).",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "12",
      workDaysWeek: "5-6 днів на тиждень",
      breakDuration:
        "Визначається внутрішнім розпорядком заводу (оплачувані перерви).",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у дві зміни по 12 годин: перша зміна з 03:00 - 15:00, друга зміна з 05:00 – 17:00. Працюють 5-6 днів на тиждень з оплачуваними перервами.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "550 zł на місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки, обладнані всіма необхідними зручностями. Постільну білизну та посуд потрібно мати власні.",
    },
    transport: {
      provided: false,
      costRaw: "за власний рахунок",
      details: "Транспорт для доїзду не вказаний.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Надається безкоштовне харчування. Медичний огляд за рахунок фірми.",
    },

    // === 7. ПАТРАБАВАННІ І КАНДЫДАТЫ ===
    requirements: {
      gender: ["Чоловіки", "Жінки", "Пари"],
      ageMax: 50,
      nationalities: ["Україна"],
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання мови не обов'язкове.",

      physicalLoad:
        "Робота на ногах у холодному приміщенні. На процесі Żywiec — фізично інтенсивна робота (вивантаження кліток, підвішування живої птиці на гаки). На інших процесах — сортування, пакування, контроль якості.",
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
      specificNuances: ["Холод (+5...+8°C)", "Запах"],
      specificConditionsDetails:
        "Температура в приміщенні: від +5°C до +8°C. Робочий одяг, взуття та рукавички надаються безкоштовна за рахунок фірми.",
      workwearFree: true,
      foodType: "Безкоштовно",
      foodDetails: "На підприємстві надається безкоштовне харчування.",
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
      "Żywiec: вивантаження палет з клітками, транспортування та вивантаження кліток на лінію, діставання курей з кліток та підвішування їх на гаки (акордна система). Kontrola: контроль автоматизованих ліній. Patroszenie: очищення курки від нутрощів та розподіл їх на різні частини (сортування печінки, шлунків, сердець). Чистий цех (Zawieszenie): підвішування вже чистої тушки на гаки. Część świeża: обрізання ніжок та крилець, сортування м’яса. Kontrola jakośći: контроль обробленого м'яса на наявність жилок. Pakowanie: пакування частин в контейнери. Wysyłka: навантаження контейнерів на палети та завантаження палет у фури.",
    additionalNotes: "Адреса підприємства: Dzierżążno, Поморське воєводство.",
  },

  // === 15. FIEGE Łozienica ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "FIEGE Łozienica - Склад німецького інтернет-магазину",
    vacancydescription:
      "Склад німецького інтернет-магазину (Комплектація, сортування та відвантаження товарів)",
    category: "⚙️ Виробництво і прамысловасть / Логістика, склади та пакування",
    keywords: [
      "RALEN",
      "FIEGE",
      "Lozienica",
      "Лозієниця",
      "інтернет-магазин",
      "склад",
      "Szczecin",
      "Щецін",
    ],
    contractType: "Umowa o pracę",

    forRecruiter: {
      internalNotes:
        "Офіційне працевлаштування по Umowa o pracę. Початок роботи протягом 5–7 днів після прибуття.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Łozienica",
    locationDescription:
      "Łozienica (35 км від м. Щецін, проживання у м. Щецін)",
    voivodeship: "Західнопоморське",
    country: "Польща",
    checkInCity: "Szczecin",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "29,40 zł/год брутто (гарантована базова ставка).",
      studentNetto:
        "На Umowa o pracę студенти платять податки на загальних підставах (якщо немає спеціальних умов від агенції).",
      hoursRange: "168–180 годин на місяць",
      payoutDates: "Регулярно, 10 числа кожного місяця на банківський рахунок.",
      bonusDetails:
        "+15% премія за відвідуваність та ефективність роботи. +100% оплата праці у святкові та вихідні дні.",
      salaryNotes:
        "Доплата за власне житло не вказана. Ставки брутто розраховуються в нетто відповідно до податкової системи Польщі для Umowa o pracę.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 2,
      hoursPerShift: "8",
      workDaysWeek: "5 днів на тиждень",
      breakDuration:
        "Оплачувана перерва згідно з Кодексом праці (Kodeks Pracy).",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 2 зміни по 8 годин: перша зміна 06:00–14:15, друга зміна 14:15–22:30. Працюють 5 днів на тиждень, оплачувана перерва включена в робочий час.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "450 zł на місяць (вираховується із зарплати)",
      details:
        "Комфортні будинки обладнані всіма зручностями. Проживання у м. Щецін (Szczecin). Постільну білизну та посуд необхідно мати власні.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details: "Надається безкоштовний доїзд з м. Щецін службовим транспортом.",
    },

    // === 6. КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ ===
    employerCompensations: {
      hasCompensations: true,
      details:
        "Безкоштовні напої на території складу, безкоштовний обід 2 рази на тиждень, безкоштовні фрукти 2 рази на тиждень.",
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
      languageDetails: "Знання мови не обов'язкове.",

      physicalLoad:
        "Робота на ногах, робота зі сканером, пакування та укладання пакувань на палети. Помірне фізичне навантаження.",
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
      specificNuances: ["Комфортна температура (+20...+22°C)"],
      specificConditionsDetails:
        "Температура в приміщенні: +20°C … +22°C. Робочий одяг надається за рахунок фірми.",
      workwearFree: true,
      foodType: "Частково безкоштовно",
      foodDetails:
        "Безкоштовний обід 2 рази на тиждень, фрукти 2 рази на тиждень, напої на території постійно.",
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
      "Rozładunek — розвантаження фур за допомогою електронавантажувача, передача товару на палетах у зону прийому. RCV — приймання товару, сканування етикеток, маркування Qlku, внесення в систему та складання у вузки. Sort — сортування товару. Ручне сортування: у П-подібних коробах, сканування й розподіл за містами. Автоматичне сортування: лінія транспортує й розподіляє речі у коробки, працівник контролює заповнення та закриває їх. Wysyłka — складання коробів на палети за напрямками, фіксація, завантаження у фури. Робота зі сканером, укладання та контроль пакувань.",
    additionalNotes:
      "Адреса підприємства: Łozienica (біля Щеціна), Західнопоморське воєводство.",
  },

  // === 16. ORZEŁ Poniatowa ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName: "ORZEŁ Poniatowa - Виробництво гранулята (переробка шин)",
    vacancydescription:
      "Екологічна переробка використаних шин (Виробництво гумової крихти, вилучення брухту та корду)",
    category:
      "⚙️ Виробництво і прамысловасть / Екологія, утилізацыя та переробка сміття",
    keywords: [
      "RALEN",
      "ORZEŁ",
      "Poniatowa",
      "Поніатова",
      "гранулят",
      "переробка шин",
      "гумова крихта",
      "SBR",
      "Lublin",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "Завод спеціалізується на екологічній переробці шин у гумову крихту (фракції SBR), вилученні металевого брухту та текстильного корду.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Poniatowa",
    locationDescription: "Poniatowa (40 км від Любліна, Люблінське воєводство)",
    voivodeship: "Люблінське",
    country: "Польща",
    checkInCity: "Poniatowa / Lublin",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto: "26.00 zł/год (ставка згідно із законом Polski Ład).",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "Приблизно 200 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails:
        "+1 PLN/год — доплата за власне житло. Є можливість брати додаткові години.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Змінний графік (включаючи вихідні дні)",
      breakDuration: "Перерва: 15 хвилин кожні 4 години.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Змінний графік 4-бригадної системи: 2 дні ранкові зміни (07:00–15:00) – 2 дні вечірні (15:00–23:00) – 2 дні нічні (23:00–07:00) – 2 дні вихідні. Основна зміна 8 годин, є можливість брати додаткові години. Близько 200 годин на місяць.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: false,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł в добу (вираховується із зарплати)",
      details:
        "Житло надається. При заселенні потрібно мати власну постільну білизну; ковдри та подушки надаються. Є доплата за власне житло +1 zł/год.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно",
      details: "Надається службовий автомобіль для доїзду на роботу.",
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
      standardDocs: ["PESEL UKR", "Віза", "Карта побиту"],
      needsAdditionalDocs: false,
      additionalDocsDetails: "",
      experienceRequired: false,
      hasEntranceTests: false,
      entranceTestsDetails: "",

      polishLanguageLevel: "Не потрібна",
      languageDetails: "Знання польської мови не вимагається.",

      physicalLoad:
        "Сортування та транспортування шин у цехах. Бажання працювати мінімум 3 місяці. Додатковим плюсом буде наявність водійського посвідчення.",
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
      specificNuances: ["Запах гуми", "Шум", "Заборона куріння"],
      specificConditionsDetails:
        "Присутній легкий запах гуми. На виробництві надаються спеціальні навушники (шумне підприємство). На всій території підприємства суворо заборонено палити (немає місць для куріння).",
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
      "Управління та обслуговування виробничої лінії: контроль процесу переробки використаних шин. Робота на навантажувачі: транспортування сировини та готової продукції. Технічне обслуговування обладнання. Сортування та транспортування шин у цехах. Робочий одяг надається підприємством безкоштовно.",
    additionalNotes: "Адреса підприємства: Poniatowa, Люблінське воєводство.",
  },

  // === 17. MAFLOW Chełmek ===
  {
    // === 1. СІСТЭМНЫЯ ПАЛІ (Групаванне і пошук) ===
    agencyName: "RALEN",
    templateName:
      "MAFLOW Chełmek - Виробництво шлангів для кондиціонерів автомобілів",
    vacancydescription:
      "Автомобільне виробництво (Виробництво шлангів для систем кондиціонування авто: Jaguar, Land Rover, Volvo, BMW, VW та ін.)",
    category:
      "⚙️ Виробництво і прамысловасть / Автомобільна промисловість (Automotive)",
    keywords: [
      "RALEN",
      "MAFLOW",
      "Chełmek",
      "Хелмек",
      "шланги",
      "кондиціонери",
      "Jaguar",
      "BMW",
      "Volvo",
      "Катовіце",
    ],
    contractType: "Umowa zlecenie",

    forRecruiter: {
      internalNotes:
        "Підприємство є лідером у виробництві гумових шлангів для кондиціонування авто. Замовники: Jaguar, Land Rover, Volvo, BMW, VW Group, Renault, Nissan, Peugeot Citroën.",
      hideAgencyNameForCandidate: true,
      hideEnterpriseNameForCandidate: true,
    },

    // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
    location: "Chełmek",
    locationDescription:
      "Chełmek (30 км від Катовіце, Малопольське воєводство)",
    voivodeship: "Малопольське",
    country: "Польща",
    checkInCity: "Chełmek / Katowice",

    // === 3. ФІНАНСЫ ===
    salary: {
      baseNetto:
        "Chełmek 1 (чоловіки та жінки): 24.00 zł/год. Chełmek 2 (чоловіки): 27.00 zł/год. Ставки згідно із законом Polski Ład.",
      studentNetto:
        "30.50 zł/год (для студентів до 26 років зі статусом студента).",
      hoursRange: "180–220 годин на місяць",
      payoutDates: "З 15 по 18 число наступного місяця на банківський рахунок.",
      bonusDetails:
        "+1 PLN/год — доплата за власне житло. Додаткові години та робочі суботи за погодженням.",
      salaryNotes:
        "У 2025/2026 р. після перевищення ліміту доходу в 30 000 зл брутто ставка нетто може зменшуватися.",
    },

    // === 4. ГРАФІК ===
    schedule: {
      shiftsCount: 3,
      hoursPerShift: "8",
      workDaysWeek: "Пн-Пт (суботи за погодженням)",
      breakDuration:
        "Кожні 2 години — 5 хвилин перерва. Раз на 4 години — 20 хвилин повноцінний перерва.",
      canChooseShiftOnStart: false,
      shiftChoiceDetails: "",
      description:
        "Робота у 3 зміни по 8 годин: 06:00-14:00, 14:00-22:00, 22:00-06:00. Можливі додаткові години та робочі суботи за погодженням з підприємством.",
    },

    // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
    accommodation: {
      type: "Платне",
      forCouples: true,
      withChildren: false,
      withPets: false,
      costRaw: "18 zł в добу (вираховується із заробітної плати)",
      details:
        "Окремі кімнати для сімейних пар! При заселенні потрібно мати свою постільну білизну; ковдри та подушки надаються. Є доплата за власне житло +1 zł/год.",
    },
    transport: {
      provided: true,
      costRaw: "безкоштовно (пішки)",
      details:
        "Транспорт не потрібен — житло знаходиться в пішій доступності від підприємства.",
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
      languageDetails:
        "Знання мови не обов'язкове (всі інструкції перекладені українською мовою).",

      physicalLoad:
        "Досвід фізичної роботи. Бажання працювати мінімум 3 місяці. На Chełmek 2 робота потребує швидкого руху рук та невеликих зусиль.",
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
      details:
        "Робочий одяг платний, ціна залежить від закупівельної вартості.",
    },
    earlyTerminationLiability: {
      hasLiability: false,
      details: "",
    },

    // === 11. АПІСАННЕ ПРАЦЭСАЎ І НАТАТКІ ===
    description:
      "CHEŁMEK 1 (Чоловіки та Жінки): Робота на виробничих машинах (нескладні повторювані автоматизовані процеси); монтаж металевих трубок (закласти трубку в прес/машину, натиснути кнопку, перевірити на дефекти); візуальний контроль якості і маркування; ведення документації (інструкції польською та українською мовами). Робота в помірному темпі. CHEŁMEK 2 (Чоловіки): Робота в команді 4-6 осіб. Обслуговування автоклава для формування гумових трубок. Оператори вкладають трубки у форми за шаблоном і поміщають у машину на 20 хв (вплив температури і тиску). Поки одна форма в машині, команда знімає готову продукцію з іншої форми.",
    additionalNotes:
      "Адреса підприємства: Chełmek, Малопольське воєводство. Окремі кімнати для пар, житло поруч з роботою.",
  },
];

module.exports = ralenTemplates;
