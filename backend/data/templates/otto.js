// backend/data/templates/otto.js
const ottoTemplates = [
  // 1
  {
    agencyName: "OTTO",
    templateName: "HUTCHINSON Żywiec - Виробництво паливних систем та кабелів",
    keywords: [
      "HUTCHINSON",
      "Żywiec",
      "Живець",
      "Katowice",
      "паливні системи",
      "кабелі",
      "hutchinson żywiec",
      "Leśnianka",
    ],
    title:
      "HUTCHINSON Żywiec: Виробництво паливних систем та кабелів для автомобілів",
    location: "Żywiec",
    country: "Польща",
    salary: {
      base: "27,78 zł брутто/год",
      student: "",
      monthly:
        "~3 600 zł нетто мінімум, ~4 500 zł нетто середня (з 1 Сб+Нд), 5 500+ zł нетто максимум",
      bonus: "Премія за власне житло до 477 zł брутто/міс.",
      notes: "Можливість переходу під сам завод.",
    },
    schedule: {
      shifts: "3 зміни по 8 годин: 05:50–13:50, 13:50–21:50, 21:50–05:50",
      hours: "",
      details:
        "Перерва 20 хв після 3,5–4 год роботи. Можливість 12-год змін або вихідних — лише за згодою керівника.",
    },
    description:
      "Монтаж компонентів; Обслуговування машин; Виконання інших виробничих завдань за вказівкою керівника.",
    accommodation: {
      available: true,
      cost: "400 zł/місяць (відраховується із зарплати)",
      details: "До роботи 10–15 хвилин пішки або транспортом.",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Громадський транспорт або пішки.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical:
        "Перед стартом — тест на мануальні здібності/спритність та зір.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Є столова з недорогими обідами.",
      notes: "Адреса: Żywiec, ul. Leśnianka 73.",
    },
    contractType: "Umowa o pracę",
    additionalNotes:
      "Можливість продовження документів та виготовлення карти побиту.",
  },

  // 2
  {
    agencyName: "OTTO",
    templateName: "GASA Głuchowo - Склад інтернет-магазину",
    keywords: [
      "GASA",
      "Głuchowo",
      "Глухово",
      "Poznań",
      "Познань",
      "інтернет-магазин",
      "gasa",
      "Rosnowska",
      "кур'єрські відправлення",
    ],
    title: "GASA Głuchowo: Склад інтернет-магазину (кур'єрські відправлення)",
    location: "Głuchowo (Познань)",
    country: "Польща",
    salary: {
      base: "32,00 zł брутто/год",
      student: "32,00 zł нетто/год (студенти до 26 років — brutto=netto)",
      monthly: "~3 800–4 200 zł нетто. Студенти: ~5 376 zł нетто",
      bonus:
        "Премія 100% відвідуваності (листопад–грудень): 650 zł брутто/міс (1 300 zł за 2 міс.).",
      notes: "Щотижневі виплати.",
    },
    schedule: {
      shifts:
        "Зміна пообідня: Пн 12:00–22:00, Вт–Ср 13:30–21:30, Чт–Пт 13:30–20:30. Зміна нічна: Пн 00:00–10:00, Вт–Ср 02:30–10:30, Чт 02:30–09:30, Пт 02:30–10:30",
      hours: "Пн–Пт, 2 зміни",
      details:
        "У свята не працюємо. Перший день — навчання під наглядом досвідченого працівника.",
    },
    description:
      "Сортування, завантаження та розвантаження товару; Комплектація замовлень.",
    accommodation: {
      available: false,
      cost: "Тільки власне житло (доплат немає)",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "Організований транспорт: Dworzec Górczyn Poznań → Rosnowska 8, Głuchowo.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical:
        "Обов'язкове знання польської мови (розуміти/відповідати). Фізична витривалість.",
    },
    conditions: {
      temperature: "",
      workwear: "Робочий одяг надається.",
      food: "",
      notes:
        "Адреса роботи: Głuchowo, ul. Rosnowska 8. Оформлення: Okólna 26, Poznań.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes:
      "Карта Multisport та LuxMed. Можливе продовження документів/оформлення карти побиту. Перед початком роботи — розмова з роботодавцем, потрібне CV.",
  },

  // 3
  {
    agencyName: "OTTO",
    templateName: "IL COSMETICS Ciechanów - Виробництво косметики",
    keywords: [
      "IL COSMETICS",
      "Ciechanów",
      "Цєханув",
      "Warszawa",
      "Варшава",
      "косметика",
      "лак для нігтів",
      "il cosmetics",
      "Tysiąclecia",
    ],
    title:
      "IL COSMETICS Ciechanów: Виробництво косметики (пакування, ручні роботи)",
    location: "Ciechanów",
    country: "Польща",
    salary: {
      base: "30,50 zł брутто/год",
      student: "",
      monthly: "~5 200 zł нетто. Студенти: ~7 300 zł нетто",
      bonus: "Премія до 400 zł брутто/місяць. Бонуси за рекомендацію знайомих.",
      notes: "Щотижневі аванси.",
    },
    schedule: {
      shifts: "2 зміни по 12 годин: 06:00–18:00, 18:00–06:00",
      hours: "Пн–Пт",
      details: "",
    },
    description:
      "Допоміжні роботи на виробничій лінії; Пакування косметики; Ручні роботи: закручування пляшок з лаком для нігтів, вставлення щіточок у пляшки; Прибирання виробничих ліній. На лінії присутній характерний запах.",
    accommodation: {
      available: false,
      cost: "Тільки власне житло",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Самостійний доїзд.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["санепід"],
      physical:
        "Гарні мануальні навички. Відсутність алергії. Санітарна книжка (Sanepid) або готовність її оформити.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Адреса: Ciechanów, Tysiąclecia 8C.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "Медичне страхування LuxMed, карти Multisport.",
  },

  // 4
  {
    agencyName: "OTTO",
    templateName: "KABAT Budzyń - Виробництво гумових виробів",
    keywords: [
      "KABAT",
      "Budzyń",
      "Будзинь",
      "Poznań",
      "Познань",
      "гумові вироби",
      "шини",
      "профілі",
      "kabat",
    ],
    title:
      "KABAT Budzyń: Виробництво гумових виробів (шини, профілі, технічна гума)",
    location: "Budzyń (60 км від Познані)",
    country: "Польща",
    salary: {
      base: "24,40 zł/год + премії та бонуси",
      student: "",
      monthly: "4 000 zł нетто мінімум, 4 800 zł середня, 5 200 zł максимум",
      bonus:
        "25% за відсутність лікарняних та прогулів; KAIZEN-бонус 50–200 zł; Бони на їдальню 3×15 zł; Річна премія за відвідуваність; Щорічна оцінка → можливість підвищення ставки.",
      notes:
        "Щотижневі виплати. Еквівалент відпустки виплачується щомісяця для покриття витрат на житло.",
    },
    schedule: {
      shifts: "Система 4 бригад",
      hours: "",
      details: "Стабільна робота, сучасне виробництво.",
    },
    description:
      "Робота на виробничій лінії — обслуговування машин та обладнання; Поточний контроль якості готової продукції. Присутній характерний запах гуми у приміщенні.",
    accommodation: {
      available: true,
      cost: "650 zł/місяць",
      details:
        "У разі навмисних пошкоджень або алкогольних інцидентів — утримується вся сума.",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Роботодавець не забезпечує доїздом.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical:
        "Польська мова мінімум B1. Добрий слух — обов'язковий (проводиться аудіометрія). Короткий опис досвіду або CV — обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Дофінансування харчування — обід або сніданок за 2 zł.",
      notes: "",
    },
    contractType: "Umowa o pracę",
    additionalNotes:
      "Карта Multisport та медичний пакет LuxMed. Можливість оформлення карти побиту.",
  },

  // 5
  {
    agencyName: "OTTO",
    templateName: "ZARA Swarzędz - Склад брендового одягу",
    keywords: [
      "ZARA",
      "Swarzędz",
      "Свожендз",
      "Poznań",
      "Познань",
      "брендовий одяг",
      "zara",
      "pick",
    ],
    title: "ZARA Swarzędz: Склад брендового одягу (комплектація замовлень)",
    location: "Swarzędz (15 км від Познані)",
    country: "Польща",
    salary: {
      base: "30,50 zł брутто/год (невиконання норми) — до 34,50 zł брутто/год (норма 3)",
      student: "Брутто = нетто (студенти до 26 років)",
      monthly: "Середня 4 800–6 100 zł нетто. Студенти до 8 500 zł нетто",
      bonus:
        "Премії: за свята до 150 zł, за виконання норм 1–3 zł/год, за відвідуваність до 100 zł, за продажі 500 zł.",
      notes: "",
    },
    schedule: {
      shifts:
        "3 зміни по 8 або 12 год: 06:00–18:00, 10:00–22:00, 18:00–06:00. У сезон тільки по 12 год",
      hours: "",
      details: "Перерва 30 хв.",
    },
    description:
      "PICK: робота зі сканером (додавання кодів, збір замовлень); Пакування і підготовка товару до відправки (комплектування, приклеювання штрих-кодів); Лічба товарів на складі (перевірка, підрахунок); Робота з автоматичними роботами.",
    accommodation: {
      available: true,
      cost: "600 zł/місяць. Доплата за власне житло 250 zł нетто",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "Безкоштовний автобус з Września, Obłaczkowo, Poznań.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Без медоглядів. Фітнес для працівників.",
    },
    conditions: {
      temperature: "",
      workwear: "Власний одяг. Видається футболка і теплий фліс.",
      food: "Є їдальня з автоматами і місце для розігріву їжі.",
      notes: "",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "Карта Multisport та медичний пакет LuxMed.",
  },

  // 6
  {
    agencyName: "OTTO",
    templateName: "ZALANDO Świebodzin - Склад одягу та взуття",
    keywords: [
      "ZALANDO",
      "Świebodzin",
      "Свєбодзін",
      "Poznań",
      "ASOS",
      "повернення",
      "zalando",
      "одяг",
      "взуття",
    ],
    title: "ZALANDO Świebodzin: Склад одягу та взуття (нове та повернення)",
    location: "Świebodzin (100 км від Познані)",
    country: "Польща",
    salary: {
      base: "30,50 zł брутто (22,20–26,30 zł нетто)",
      student: "30,50 zł нетто (студенти до 26 років — brutto=netto)",
      monthly: "3 700–4 400 zł нетто. Студенти до 15 000 zł нетто з преміями",
      bonus:
        "Надбавки за норму: 50 од/год — 150 zł, 55 од/год — 1 200 zł, кожні +5 од понад 55 — +500 zł, 65 од/год — 2 200 zł брутто.",
      notes: "БЕЗ НІЧНИХ ЗМІН. Smart Lunch — обід за 1 zł.",
    },
    schedule: {
      shifts:
        "2 зміни по 8–10 год: 06:00–14:00, 14:00–22:00. По бажанню по 12 год",
      hours: "6 днів на тиждень",
      details:
        "Перерва 30 хв (15 хв неоплачувані). У перший день — тренінг з охорони праці + навчання. Через 2–3 дні — простий іспит (навчання українською мовою).",
    },
    description:
      "Пакування та сортування нового одягу та взуття; Обробка онлайн-повернень — перевірка одягу на чистоту та пошкодження; Сканування етикеток та внесення причин повернення в комп'ютер.",
    accommodation: {
      available: true,
      cost: "30 zł/доба (3–4-місні кімнати). До початку роботи оплата самостійна",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "пішки",
      details: "До роботи 20 хвилин пішки.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Обов'язкове знання роботи з КОМП'ЮТЕРОМ І СМАРТФОНОМ. Потрібні свої спортивні штани, зручне взуття без фірмових написів.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Безкоштовні фрукти тричі на тиждень. Автомати з гарячими напоями, супами, бутербродами.",
      notes: "Продовження побиту: Karta Pobytu.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },

  // 7
  {
    agencyName: "OTTO",
    templateName: "DHL Warszawa - Сортування поштових посилок",
    keywords: [
      "DHL",
      "Warszawa",
      "Варшава",
      "dhl warszawa",
      "посилки",
      "сортування",
      "Osmańska",
    ],
    title: "DHL Warszawa: Сортування поштових посилок",
    location: "Warszawa",
    country: "Польща",
    salary: {
      base: "34,00 zł брутто/год (день), 37,70 zł брутто/год (ніч)",
      student: "Брутто = нетто (студенти до 26 років)",
      monthly: "3 800–5 000 zł нетто. Студенти: 5 000–7 000 zł нетто",
      bonus: "",
      notes: "",
    },
    schedule: {
      shifts:
        "2 зміни по 8 год: 14:00–23:00 або 15:00–23:00 / 23:00–06:00 або 07:00",
      hours: "",
      details:
        "Тиждень денна / тиждень нічна. Можливі надгодини зі згоди бригадира.",
    },
    description:
      "Обслуговування навантажувачів; Сортування посилок; Завантаження та розвантаження посилок; Робота зі сканером; Складські роботи; Комплектування замовлень.",
    accommodation: {
      available: false,
      cost: "Тільки власне житло",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Адреса: ul. Osmańska 2, 02-823 Warszawa.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },

  // 8
  {
    agencyName: "OTTO",
    templateName: "DHL Głuchowo - Сортування поштових посилок",
    keywords: [
      "DHL",
      "Głuchowo",
      "Глухово",
      "Poznań",
      "Познань",
      "dhl głuchowo",
      "посилки",
      "Komornicka",
    ],
    title: "DHL Głuchowo: Сортування поштових посилок (Познань)",
    location: "Głuchowo (Познань)",
    country: "Польща",
    salary: {
      base: "34,00 zł брутто/год",
      student: "",
      monthly: "4 100–4 300 zł нетто. Студенти до 5 800 zł нетто",
      bonus: "",
      notes: "Аванс вже через тиждень роботи.",
    },
    schedule: {
      shifts: "1 зміна по 8 год: 13:30–21:30",
      hours: "Пн–Пт",
      details: "Без нічних змін.",
    },
    description:
      "Фізична робота на складі з кур'єрськими відправленнями; Комплектація замовлень; Розвантаження та завантаження товарів.",
    accommodation: {
      available: false,
      cost: "Власний порядок",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical: "Обов'язкове комунікативне знання польської мови.",
    },
    conditions: {
      temperature: "",
      workwear: "Робочий одяг видається.",
      food: "",
      notes: "Адреса: Głuchowo, ul. Komornicka 1.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes:
      "Карта Multisport та медичний пакет LuxMed. Можливе подовження документів та оформлення карти побиту.",
  },

  // 9
  {
    agencyName: "OTTO",
    templateName: "HUTCHINSON Łódź - Виробництво трансмісійних ременів",
    keywords: [
      "HUTCHINSON",
      "Łódź",
      "Лодзь",
      "трансмісійні ремені",
      "hutchinson łódź",
      "Zakładowa",
    ],
    title: "HUTCHINSON Łódź: Виробництво трансмісійних ременів",
    location: "Łódź",
    country: "Польща",
    salary: {
      base: "4 780 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні зміни; +50% надгодини у будні; +100% вихідний день; +200% неділя та свята. Групова премія до 200 zł. Премія за пропозиції покращень 10 zł нетто/бал.",
      notes: "Оплачувана відпустка та лікарняні.",
    },
    schedule: {
      shifts: "",
      hours: "",
      details:
        "Робота стояча. Обслуговування однієї конфекційної машини в автоматичному циклі.",
    },
    description:
      "Нанесення шарів гуми; Контроль намотування кабелю/шнура, просоченого клеєм; Нанесення зовнішнього шару гуми; Підготовка матеріалів; Контроль параметрів роботи на моніторі; Маркування готових виробів; Підтримання чистоти робочого місця та стану обладнання.",
    accommodation: {
      available: false,
      cost: "Тільки власне житло",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "Службові автобуси з Łask, Pabianice (Kurczaki/Zakładowa), Piotrków Trybunalski (Zakładowa).",
    },
    requirements: {
      gender: "чоловіки",
      age: "до 178 см зросту, праворукі",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical:
        "Уважність, відповідальність, точність, дисципліна, вміння організувати роботу.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Адреса: ul. Zakładowa 99, 92-402 Łódź.",
    },
    contractType: "Umowa o pracę",
    additionalNotes:
      "Карта Multisport та медичний пакет LuxMed. Можливе продовження документів (карта побиту).",
  },

  // 10
  {
    agencyName: "OTTO",
    templateName: "LUMBERG Świebodzin - Виробництво електронних компонентів",
    keywords: [
      "LUMBERG",
      "Świebodzin",
      "Свєбодзін",
      "Poznań",
      "електронні компоненти",
      "lumberg",
      "Sobieskiego",
    ],
    title:
      "LUMBERG Świebodzin: Виробництво електронних компонентів для побутової техніки та автомобілів",
    location: "Świebodzin",
    country: "Польща",
    salary: {
      base: "4 806 zł брутто/місяць + 15% премії (нетто середньо 4 500–4 900 zł)",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні зміни; +50% надгодини; +100% вікенди та свята; 250 zł після 3 міс. (премія за відвідуваність); Середньомісячна авторитетна премія 300–800 zł.",
      notes:
        "Аванс після першого відпрацьованого тижня. Оплачувані відпустки та лікарняні.",
    },
    schedule: {
      shifts: "3 зміни по 8 год: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details:
        "Жінки — сидяча робота, чоловіки — стояча. Взимку в цеху тепло, влітку кондиціонер.",
    },
    description:
      "Ручна збірка електрообладнання та деталей для джерел енергії; Скручування, монтаж різних проводів; Робота з електричними блоками; Збірка на робочому місці (не на стрічці).",
    accommodation: {
      available: false,
      cost: "Тільки власне житло",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "Робітничий транспорт з Sulechów і Lubrza. По Свебодзіні — самостійно 20–30 хв.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Наявність номеру PESEL. Добре володіти польською мовою. Перед початком роботи — рекрутаційна розмова з роботодавцем.",
    },
    conditions: {
      temperature: "тепло взимку, кондиціонер влітку",
      workwear: "",
      food: "Автомати з кавою, чаєм, напоями та закусками за акційними цінами. Холодильники та мікрохвильовки.",
      notes: "Адреса: Świebodzin 66-200, Sobieskiego 20B.",
    },
    contractType: "Umowa o pracę",
    additionalNotes:
      "Продовження побиту — Karta pobytu. Святкові подарунки та спеціальні заходи.",
  },

  // 11
  {
    agencyName: "OTTO",
    templateName: "ITR Mysłowice - Виробництво гідравлічних компонентів",
    keywords: [
      "ITR",
      "Mysłowice",
      "Мислювіце",
      "Katowice",
      "гідравліка",
      "шланги",
      "itr",
      "Brzezińska",
      "TaPL",
    ],
    title:
      "ITR Mysłowice: Виробництво гідравлічних компонентів (шланги, з'єднання)",
    location: "Mysłowice",
    country: "Польща",
    salary: {
      base: "4 566 zł брутто + 100 zł бонус за відвідуваність + до 250 zł премія (допоміжні роботи)",
      student: "",
      monthly: "~4 000 zł нетто середня",
      bonus:
        "Відділ TaPL: стартова ставка 5 000 zł + 300 zł, після 3 міс. 5 200 zł + 300 zł, після 6 міс. 5 400 zł + 300 zł. +20% нічна зміна; +50%/+100% понаднормові; +100% 6–7 день тижня. До 189 zł відшкодування за проїзні.",
      notes: "Аванс вже через тиждень роботи. Безкоштовний медогляд.",
    },
    schedule: {
      shifts: "3 зміни по 8 год",
      hours: "Пн–Пт",
      details: "Перерва 15 хв.",
    },
    description:
      "Допоміжні роботи: ручний монтаж, автоматичний монтаж, робота з вигинаркою; Підготовка матеріалів для наступного циклу; Контроль параметрів на моніторі; Маркування готової продукції. Відділ TaPL: обслуговування та контроль роботи напівавтоматичних металообробних машин; Контроль якості деталей; Робота з простим технічним рисунком.",
    accommodation: {
      available: true,
      cost: "451 zł/місяць. Доплата за власне житло 415 zł",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Міський транспорт 20–50 хв.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Базове знання польської мови (можна з акцентом, але добре розуміти і читати). Відділ TaPL: базове знання технічного рисунка, вміння рахувати. Робота у шумному середовищі (навушники та окуляри).",
    },
    conditions: {
      temperature: "",
      workwear: "Роботодавець надає робочий одяг та взуття.",
      food: "Є їдальня, де можна розігріти свій обід.",
      notes: "Адреса: Mysłowice, вул. Brzezińska 50.",
    },
    contractType: "Umowa o pracę",
    additionalNotes:
      "Карта Multisport та медичний пакет LuxMed. 5 zł/день на карту Sodexo.",
  },

  // 12
  {
    agencyName: "OTTO",
    templateName: "JYSK DC Radomsko - Склад товарів для дому",
    keywords: [
      "JYSK",
      "Radomsko",
      "Радомсько",
      "Łódź",
      "Лодзь",
      "товари для дому",
      "jysk",
      "Duńska",
      "Piotrków Trybunalski",
    ],
    title: "JYSK DC Radomsko: Склад товарів для дому",
    location: "Radomsko / Piotrków Trybunalski",
    country: "Польща",
    salary: {
      base: "30,60 zł брутто/год + 25% премія",
      student: "+1 zł/год вища ставка для працівників до 26 років",
      monthly: "3 800 zł нетто мінімум, 4 500 zł середня, 6 500 zł максимум",
      bonus: "+20% нічний час; +100% неділя та свята; +50% понаднормовий час.",
      notes: "Щотижневі аванси. Оплачувана відпустка та лікарняні.",
    },
    schedule: {
      shifts: "3 зміни: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Надгодини можливі. Міський автобус курсує на всі 3 зміни.",
    },
    description:
      "Прийом товару; Комплектування на піддони; Завантаження товару; Робота зі сканером; Всі працівники працюють на навантажувачах (до 30 см). Особи з порушенням зору мають мати окуляри.",
    accommodation: {
      available: true,
      cost: "БЕЗКОШТОВНО (305 zł комунальні послуги)",
      details: "Radomsko.",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Міський автобус курсує на 3 зміни.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "За 8 zł обіди (перше + друге). Кава/чай безкоштовні. Роботодавець дофінансовує 17 zł.",
      notes:
        "Адреси: ul. Duńska 22, Radomsko або Logistyczna 22, Piotrków Trybunalski.",
    },
    contractType: "Umowa o pracę",
    additionalNotes:
      "Продовження легалізації / karta pobytu. Святкові сніданок/вечеря, солодкі подарунки на День Святого Миколая.",
  },

  // 13
  {
    agencyName: "OTTO",
    templateName: "SAINT GOBAIN Żary - Виробництво автомобільного скла",
    keywords: [
      "SAINT GOBAIN",
      "Saint Gobain",
      "Żary",
      "Жари",
      "Zielona Góra",
      "скло",
      "шиби",
      "saint gobain",
      "Jaroszowiec",
    ],
    title: "SAINT GOBAIN Żary: Виробництво автомобільного скла",
    location: "Jaroszowiec (34 км від Домброви Гурнічої, 45 км від Катовіце)",
    country: "Польща",
    salary: {
      base: "28,70 zł брутто/год",
      student: "",
      monthly: "",
      bonus:
        "Виробнича премія 0–1 000 zł; +20% нічні; +100 zł (Сб) / +200 zł (Нд) за вихідні; +100% надгодини; Річна премія (пропорційно). Доплати за доїзд 84–752 zł залежно від відстані.",
      notes: "Аванс після першого відпрацьованого тижня.",
    },
    schedule: {
      shifts: "3 зміни: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "Пн–Пт",
      details: "",
    },
    description:
      "Підготовка, різання, обробка та пакування скляних виробів; Контроль якості; Підтримання порядку на робочому місці; Дотримання норм BHP.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "84–752 zł/місяць (залежно від відстані)",
      details: "Доплати за доїзд залежно від відстані.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical: "",
    },
    conditions: {
      temperature: "",
      workwear: "Безкоштовно надається робочий одяг.",
      food: "",
      notes: "Адреса: Jaroszowiec, Kolejowa 1.",
    },
    contractType: "Umowa o pracę",
    additionalNotes:
      "Договір до 18 місяців. Medicover від 0 zł. Програма «Znam Polecam» — бонуси за рекомендацію.",
  },

  // 14
  {
    agencyName: "OTTO",
    templateName: "TIFS Żywiec - Виробництво паливних систем та кабелів",
    keywords: [
      "TIFS",
      "Żywiec",
      "Живець",
      "Bielsko-Biała",
      "паливні системи",
      "кабелі",
      "tifs",
      "Leśnianka",
    ],
    title:
      "TIFS Żywiec: Виробництво паливних систем та кабелів для автомобілів",
    location: "Żywiec",
    country: "Польща",
    salary: {
      base: "27,78 zł брутто/год",
      student: "",
      monthly:
        "~3 600 zł нетто мінімум, ~4 500 zł нетто середня, 5 500+ zł нетто максимум",
      bonus: "Премія за власне житло до 477 zł брутто/міс.",
      notes: "Можливість переходу під сам завод.",
    },
    schedule: {
      shifts: "3 зміни по 8 год: 05:50–13:50, 13:50–21:50, 21:50–05:50",
      hours: "",
      details:
        "Перерва 20 хв після 3,5–4 год роботи. Можливість 12-год змін або вихідних — лише за згодою керівника.",
    },
    description:
      "Монтаж компонентів; Обслуговування машин; Виконання інших виробничих завдань за вказівкою керівника.",
    accommodation: {
      available: true,
      cost: "400 zł/місяць",
      details: "До роботи 10–15 хвилин пішки або транспортом.",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Громадський транспорт або пішки.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Перед стартом — тест на мануальні здібності/спритність та зір.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Є столова з недорогими обідами.",
      notes: "Адреса: Żywiec, ul. Leśnianka 73.",
    },
    contractType: "Umowa o pracę",
    additionalNotes:
      "Можливість продовження документів та виготовлення карти побиту.",
  },

  // 15
  {
    agencyName: "OTTO",
    templateName: "DPD Kowale - Логістичний склад",
    keywords: [
      "DPD",
      "Kowale",
      "Коваль",
      "Gdańsk",
      "Гданськ",
      "посилки",
      "dpd kowale",
      "Starowiejska",
      "Тріймісто",
    ],
    title: "DPD Kowale: Логістичний склад (Тройміст/Гданськ)",
    location: "Kowale (околиці Гданська)",
    country: "Польща",
    salary: {
      base: "34,00 zł брутто/год (день), 37,70 zł брутто/год (ніч)",
      student: "",
      monthly: "",
      bonus: "+300 zł премія за відвідуваність.",
      notes: "Аванс.",
    },
    schedule: {
      shifts: "Тільки суботи: 1 зміна 03:00–09:00 або 10:00",
      hours: "",
      details: "",
    },
    description:
      "Комплектування замовлень; Обслуговування навантажувачів; Сортування посилок; Завантаження та розвантаження посилок; Робота зі сканером; Складські роботи.",
    accommodation: {
      available: false,
      cost: "Тільки власне житло",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Немає службового транспорту.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Знання мови не вимагається.",
    },
    conditions: {
      temperature: "",
      workwear: "Робочий одяг видається.",
      food: "",
      notes: "Адреса: Starowiejska 35, Kowale 80-180. БЕЗ МЕДОГЛЯДІВ.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "Карта Multisport та медичний пакет LuxMed.",
  },

  // 16
  {
    agencyName: "OTTO",
    templateName: "DPD Szczecin - Логістичний склад",
    keywords: [
      "DPD",
      "Szczecin",
      "Щецін",
      "dpd szczecin",
      "посилки",
      "Przecław",
      "Kasztanowa",
    ],
    title: "DPD Szczecin: Логістичний склад (Szczecin Parcel)",
    location: "Przecław (поблизу Щецина)",
    country: "Польща",
    salary: {
      base: "34,00 zł брутто/год (день), 37,70 zł брутто/год (ніч 22:00–06:00)",
      student: "",
      monthly: "2 100–2 300 zł нетто (4 год/день). Студенти: 2 750 zł нетто",
      bonus: "",
      notes: "Щотижневі виплати. Немає доплати за власне житло.",
    },
    schedule: {
      shifts: "Вт–Пт: 04:00–10:00. Сб: 06:00–11:00",
      hours: "Вівторок–субота",
      details: "Повторювані операції (щодня подібна робота, без ротацій).",
    },
    description:
      "Фізична робота на складі кур'єрських відправлень; Сортування посилок; Завантаження/розвантаження товарів.",
    accommodation: {
      available: false,
      cost: "Немає житла та доплат за власне",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Транспорт не організовано.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical: "Комунікативна польська мова.",
    },
    conditions: {
      temperature: "чисто, без запахів і шкідливих речовин",
      workwear: "Робочий одяг видається.",
      food: "",
      notes: "Адреса: Aleja Kasztanowa 12, Przecław.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes:
      "Карта Multisport та LuxMed. Можливість продовження документів/карти побиту. Рекрутація: надсилаєте CV → передаємо до DHL → клієнт вирішує запросити.",
  },

  // 17
  {
    agencyName: "OTTO",
    templateName:
      "FRONERI Mielec - Виробництво морозива та заморожених продуктів",
    keywords: [
      "FRONERI",
      "Mielec",
      "Мєлєц",
      "Kraków",
      "Краків",
      "морозиво",
      "заморожені продукти",
      "froneri",
      "Wojska Polskiego",
    ],
    title: "FRONERI Mielec: Виробництво морозива та заморожених продуктів",
    location: "Mielec",
    country: "Польща",
    salary: {
      base: "31,40 zł брутто/год + премія до 20%",
      student: "",
      monthly: "",
      bonus:
        "Доплата за власне житло до 550 zł брутто/міс. Регенераційний обід 18 zł.",
      notes: "Щотижневі виплати. Виплата ЗП до 10-го робочого дня місяця.",
    },
    schedule: {
      shifts: "3 зміни: 06:45–14:45, 14:45–22:45, 22:45–06:45",
      hours: "",
      details:
        "Перерва 20 хв. У сезон можливе 7 днів на тиждень. За потреби — робота по 12 год.",
    },
    description:
      "Прості складські роботи при пакуванні продукції; Палетизація готових виробів; Періодична робота в холодильній камері при температурі до -22°C (надається термобілизна та доплата на гарячі страви).",
    accommodation: {
      available: true,
      cost: "Розрахунок безпосередньо з компанією-хостелом",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["санепід"],
      physical:
        "Дійсна санітарна книжка (Sanepid). Українські результати санепід — допуск до роботи макс. на 1 міс., потім обстеження в Польщі. Витрати на оформлення санітарної книжки покриває працівник.",
    },
    conditions: {
      temperature: "до -22°C (холодильна камера), надається термобілизна",
      workwear: "",
      food: "Регенераційний обід 18 zł.",
      notes: "Адреса: ul. Wojska Polskiego 3, 39-300 Mielec.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes:
      "ЗАБОРОНЕНО: мобільні телефони, скляний та керамічний посуд, прикраси. Для жінок: заборонені нарощені вії, нігті, яскравий макіяж. Заборонені сильні парфуми. Карта Multisport та LuxMed.",
  },

  // 18
  {
    agencyName: "OTTO",
    templateName: "MAKRO Brwinów - Центр дистрибуції MAKRO",
    keywords: [
      "MAKRO",
      "Brwinów",
      "Брвінув",
      "Warszawa",
      "Варшава",
      "макро",
      "дистрибуція",
      "makro",
      "Moszna",
    ],
    title: "MAKRO Brwinów: Центр дистрибуції для магазинів MAKRO в Польщі",
    location: "Brwinów",
    country: "Польща",
    salary: {
      base: "32,50 zł брутто/год (день), 37,50 zł брутто/год (ніч)",
      student: "Брутто = нетто (студенти до ~5 500 zł нетто/міс)",
      monthly: "~3 800–4 500 zł нетто",
      bonus: "Премія за продуктивність 300 zł.",
      notes: "Щотижневі виплати. Umowa zlecenia БЕЗ надгодин.",
    },
    schedule: {
      shifts:
        "Відділ консолідації: 3 зміни. Відділ відправки: 2 зміни. Можливі Сб 06:00–14:15 та Нд 21:45–06:00",
      hours: "",
      details: "",
    },
    description:
      "Завантаження/розвантаження товару; Сортування продукції; Забезпечення та фіксація товару; Комплектація та пакування; Робота зі сканером та комп'ютером (відділ відправки).",
    accommodation: {
      available: false,
      cost: "Тільки власне житло",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "Безкоштовний транспорт (до 30 хв.).",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["санепід"],
      physical:
        "Відповідальність та залученість. Готовність до нічних змін та вихідних. Фізична витривалість (робота стоячи до 8 годин).",
    },
    conditions: {
      temperature: "",
      workwear: "Робочий одяг надається роботодавцем.",
      food: "",
      notes:
        "Адреса: ul. Moszna Parcela 29, Brwinów. Санепід ~250 zł — Варшава, ul. Żelazna 79.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "Карта Multisport та LuxMed.",
  },

  // 19
  {
    agencyName: "OTTO",
    templateName: "DHL Emilianów - Логістичний склад",
    keywords: [
      "DHL",
      "Emilianów",
      "Еміліанув",
      "Warszawa",
      "Варшава",
      "dhl emilianów",
      "посилки",
      "Węgrzyna",
      "Słupno",
    ],
    title: "DHL Emilianów: Курьєрсько-логістичний склад (Варшава)",
    location: "Emilianów",
    country: "Польща",
    salary: {
      base: "32,00 zł брутто/год (день), 37,70 zł брутто/год (ніч з 22:00 до 06:00)",
      student: "",
      monthly: "4 800–5 300 zł нетто. Студенти: 5 000–8 300 zł нетто",
      bonus: "",
      notes: "Без медоглядів. Щотижневі виплати.",
    },
    schedule: {
      shifts:
        "Денні: 14:00–22:00 або 14:00–23:00. Нічні: 22:00–06:00 або 23:00–07:00. Також можливо 19:00–06:00",
      hours: "Пн–Пт",
      details: "Можливість працювати більше годин.",
    },
    description:
      "Фізична робота: завантаження/розвантаження товарів; Робота зі сканером; Комплектування замовлень; Прибирання робочого місця.",
    accommodation: {
      available: true,
      cost: "850 zł/місяць за рахунок працівника наперед (хостел)",
      details: "Або власне житло.",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "Безкоштовний службовий автобус з хостелу Słupno (ul. Sadowa 8) та з Варшави від ст. метро «Dworzec Wileński».",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Бажано базове знання польської мови.",
    },
    conditions: {
      temperature: "",
      workwear: "Роботодавець забезпечує робочим взуттям, одяг власний.",
      food: "",
      notes: "Адреса: Ul. Komandora Wiktora Węgrzyna 5, Emilianów 05-250.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },

  // 20
  {
    agencyName: "OTTO",
    templateName: "TATRA Garwolin - Виробництво косметики",
    keywords: [
      "TATRA",
      "Garwolin",
      "Гарволін",
      "Warszawa",
      "Варшава",
      "косметика",
      "пакування",
      "tatra",
      "Lwowski",
    ],
    title: "TATRA Garwolin: Виробництво та пакування косметики",
    location: "Garwolin (50 км від центру Варшави)",
    country: "Польща",
    salary: {
      base: "31,40 zł брутто/год (день), 32,40 zł брутто/год (ніч)",
      student: "Брутто = нетто (студенти до 26 років)",
      monthly: "3 500–4 800 zł нетто (168–240 год/міс)",
      bonus: "",
      notes: "",
    },
    schedule: {
      shifts: "2 зміни по 12 год: 06:00–18:00, 18:00–06:00",
      hours: "168–240 год/міс, Пн–Пт",
      details: "Перерва 30 хв + додаткова 15 хв. Робота постійна, без ротації.",
    },
    description:
      "Виробництво та пакування косметики; Робота на лінії: наклеювання етикеток, пакування продукції. Навчання BHP та на місці (з перекладом укр.).",
    accommodation: {
      available: false,
      cost: "Тільки власне житло (без доплат)",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Самостійний доїзд.",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Досвід не потрібен. Готовність працювати стоячи. PESEL (без нього старт може затриматися). Хороший зір, брак алергії на косметику.",
    },
    conditions: {
      temperature: "взимку тепло, влітку вентиляція",
      workwear: "",
      food: "",
      notes: "Адреса: Trakt Lwowski 155, 08-400 Garwolin.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "Допомога з легалізацією та картою побиту.",
  },

  // 21
  {
    agencyName: "OTTO",
    templateName: "CTDI Sękocin - Ремонт електрообладнання",
    keywords: [
      "CTDI",
      "Sękocin",
      "Секоцін",
      "Warszawa",
      "Варшава",
      "ремонт",
      "електрообладнання",
      "ctdi",
      "Logistyczna",
    ],
    title: "CTDI Sękocin: Сервіс з ремонту електрообладнання",
    location: "Sękocin Stary (Варшава)",
    country: "Польща",
    salary: {
      base: "від 31,40 zł брутто/год і вище (залежно від досвіду)",
      student: "",
      monthly: "~4 300 zł нетто і вище. Студенти до 6 100 zł нетто",
      bonus: "Компенсація за власне житло 243,20 zł брутто.",
      notes: "",
    },
    schedule: {
      shifts: "2 зміни по 8 год: 06:00–14:00, 14:00–22:00",
      hours: "Пн–Пт",
      details: "Перерва 20 хв. БЕЗ НІЧНИХ ЗМІН. 80% сидячої роботи.",
    },
    description:
      "Заміна паяних, механічних та електронних компонентів; Діагностика несправностей; Перевірка за серійним номером; Запис в базу даних; Диспетчеризація обладнання.",
    accommodation: {
      available: false,
      cost: "Тільки власне житло (компенсація 243,20 zł брутто)",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "без вікових обмежень",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Польська мова — базова/хороша. Бажана технічна освіта або досвід ремонту техніки + навички роботи на комп'ютері. Без медогляду.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Адреса: Sękocin Stary, ul. Logistyczna 7.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes:
      "Запрошуємо на мануальні тести та екскурсію закладом. Без медоглядів.",
  },

  // 22
  {
    agencyName: "OTTO",
    templateName: "DHL Brwinów - Сортування поштових посилок",
    keywords: [
      "DHL",
      "Brwinów",
      "Брвінув",
      "Warszawa",
      "Варшава",
      "dhl brwinów",
      "посилки",
      "Jutrzenki",
      "Pruszków",
      "KOSZAJEC",
    ],
    title: "DHL Brwinów: Сортування поштових посилок (Околиці Варшави)",
    location: "Brwinów (7 км від Pruszków)",
    country: "Польща",
    salary: {
      base: "32,00 zł брутто/год (день), 37,70 zł брутто/год (ніч)",
      student: "Брутто = нетто (студенти до 26 років)",
      monthly: "3 800–5 000 zł нетто. Студенти: 5 000–7 000 zł нетто",
      bonus: "",
      notes: "Щотижневі виплати. Без медоглядів.",
    },
    schedule: {
      shifts:
        "2 зміни: 15:30–23:30, 23:30–06:00. Пн зміна починається о 14:30. Також ранкові: 06:00–14:00",
      hours: "Пн–Пт",
      details: "",
    },
    description:
      "Сортування посилок; Завантаження та розвантаження посилок; Робота зі сканером; Складські роботи; Комплектування замовлень.",
    accommodation: {
      available: true,
      cost: "850 zł/місяць (хостел у Прушкові, оплата готівкою при заселенні)",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "Службовий автобус з Прушкува та з Варшави (Metro Wilanowska).",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "",
    },
    conditions: {
      temperature: "",
      workwear: "Роботодавець забезпечує робочим взуттям, одяг власний.",
      food: "",
      notes: "Адреса: Moszna Parcela 05-840, Jutrzenki 6.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes:
      "Карта Multisport та медичний пакет LuxMed. Перед початком праці — екскурсія (щодня 16–18 год).",
  },

  // 23
  {
    agencyName: "OTTO",
    templateName: "TREND GLASS Radom - Виробництво скляного посуду",
    keywords: [
      "TREND GLASS",
      "Trend Glass",
      "Radom",
      "Радом",
      "Warszawa",
      "Варшава",
      "скло",
      "вази",
      "склянки",
      "trend glass",
      "Fołtyn",
    ],
    title: "TREND GLASS Radom: Виробництво скляного посуду та скляної тари",
    location: "Radom (100 км від Варшави)",
    country: "Польща",
    salary: {
      base: "31,40 zł брутто/год",
      student: "31,40 zł нетто/год (студенти до 26 років — brutto=netto)",
      monthly: "",
      bonus:
        "Компенсація за власне житло 400–450 zł або від фірми 300 zł (оплата до початку праці самостійна по 30–50 zł/доба).",
      notes: "Щотижневі аванси.",
    },
    schedule: {
      shifts: "3 зміни: 05:25–13:25, 13:25–21:25, 21:25–05:25",
      hours: "Пн–Пт, субота та неділя — вихідні",
      details: "У разі потреби можуть переводити на інші відділи.",
    },
    description:
      "Пакування готової скляної продукції; Контроль якості продукції; Маркування та підготовка товару до відправки; Підтримання порядку на робочому місці; Співпраця з іншими відділами в процесі пакування. Робота стояча.",
    accommodation: {
      available: true,
      cost: "300 zł/місяць від фірми або 400–450 zł компенсація за власне",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Міський транспорт ~30 хв (автобус №10 або №17).",
    },
    requirements: {
      gender: "жінки та чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Мануальні тести при зустрічі з координаторами (перевірка уважності та здатності до якісної роботи). Робота фізично не важка, стояча.",
    },
    conditions: {
      temperature: "",
      workwear: "Футболки, фліс, захисне взуття.",
      food: "Є столова з автоматами (канапки, шоколадні батончики, суп) та холодильниками для своїх обідів. Місце для паління.",
      notes: "Адреса: Marii Fołtyn 11, 26-615 Radom.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes:
      "Карта Multisport та медичний пакет LuxMed. Робота постійна, не сезонна.",
  },
];

module.exports = ottoTemplates;
