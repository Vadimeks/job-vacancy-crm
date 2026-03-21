// backend/data/templates/manpawer.js
// 109 вакансій → 46 унікальних шаблонів (дублі аб'єднані)
const manpawerTemplates = [
  // 1 — HUTCHINSON Bielsko-Biała
  {
    agencyName: "MANPAWER",
    templateName:
      "HUTCHINSON Bielsko-Biała - Виробництво гумових шлангів для кондиціонерів",
    keywords: [
      "HUTCHINSON",
      "Bielsko-Biała",
      "Bielsko",
      "Mazańcowice",
      "гумові шланги",
      "кондиціонери",
      "hutchinson bb",
    ],
    title:
      "HUTCHINSON Bielsko-Biała: Виробництво гумових шлангів для кондиціонерів",
    location: "Bielsko-Biała (Mazańcowice)",
    country: "Польща",
    salary: {
      base: "27,79 zł брутто/год",
      student: "",
      monthly: "3 800–4 300 zł нетто",
      bonus:
        "+20% нічні; +100% вихідні надгодини; +3 zł/км доїзд; +42 zł прання; +50 zł за роботу мін. 4 год у вихідний. Доплата від роботодавця 470 zł брутто протягом 180 днів.",
      notes: "Виплата до 10 числа. Перші 2 місяці — житло безкоштовно.",
    },
    schedule: {
      shifts:
        "4-бригадна система, 2 зміни по 12 годин: 06:00–18:00, 18:00–06:00",
      hours: "2 дні роботи / 2 вихідних або 3 дні / 3 вихідні",
      details:
        "Перерви: 2×20 хв. Всі працівники проходять мануальні тести на 2-й день роботи.",
    },
    description:
      "Обслуговування машин монтажу; Обслуговування автоматичних зварювальних машин (зварювання двох елементів, відбір деталей, видрук наклейки з кодом); Робота при труборізних машинах, формувальних машинах та мийках для знежирення труб.",
    accommodation: {
      available: true,
      cost: "800 zł/місяць (60–180 день). Перші 2 місяці — безкоштовно",
      details:
        "Хостел, кімнати 2–4 особи, повністю укомплектоване. При поселенні з дитиною — 800 zł депозит.",
      deposit: "300 zł при поселенні",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details:
        "Міський транспорт. Агенція підбирає житло поблизу підприємства.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "до 57 років",
      nationalities: ["Україна"],
      docs: [],
      physical: "Відсутність протипоказань до роботи оператором машин.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "Адреса: Bielsko-Biała, Mazańcowice.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 2 — HUTCHINSON Żywiec 2
  {
    agencyName: "MANPAWER",
    templateName:
      "HUTCHINSON Żywiec 2 - Виробництво гумових/пластикових шлангів (автоклав)",
    keywords: [
      "HUTCHINSON",
      "Żywiec",
      "Żywiec 2",
      "автоклав",
      "autoklaw",
      "шланги",
      "hutchinson żywiec",
      "Stolarska",
    ],
    title:
      "HUTCHINSON Żywiec 2: Виробництво гумових/пластикових шлангів для автомобілів",
    location: "Żywiec",
    country: "Польща",
    salary: {
      base: "Оператор автоклава: 32,90 zł брутто/год. Оператор машини: 29,30 zł брутто/год",
      student: "",
      monthly: "3 500–4 000 zł нетто",
      bonus:
        "+20% нічні; до 100 zł брутто премія за ефективність. Бонус за рекомендацію 550 zł брутто (після 3 міс.). Перші 2 місяці — житло безкоштовно. Доплата від роботодавця 470 zł брутто протягом 180 днів.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни по 8 годин: 05:45–13:45, 13:45–21:45, 21:45–05:45",
      hours: "Пн–Пт",
      details:
        "Мануальні тести перед початком роботи. +50% надгодини будні, +100% субота.",
    },
    description:
      "Для чоловіків (автоклав/піч): обслуговування автоклаву або печі; контроль параметрів виробничого процесу; контроль якості; перевірка технічного стану машин. Для жінок (оператор машин): обслуговування виробничих машин; формування паливних систем; візуальний контроль якості; перевірка робочого місця після попередньої зміни.",
    accommodation: {
      available: true,
      cost: "Перші 2 місяці — безкоштовно. Далі 800 zł/місяць (до 6 місяців). При власному житлі — доплата 470 zł брутто",
      details: "2–4 особи в кімнаті. При поселенні з дитиною — 800 zł наперед.",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details:
        "Міський транспорт. Безкоштовний паркінг для авто, велосипедів, самокатів.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "до 45 років",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Комунікативна польська мова. Фізична підготовка. Захисне взуття з металевим носком та захисні окуляри — обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear:
        "Захисне взуття з металевим носком та захисні окуляри — обов'язково.",
      food: "Їдальня: автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "Адреса: Żywiec, ul. Stolarska 23.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 3 — HUTCHINSON Żywiec 1 (тільки жінки)
  {
    agencyName: "MANPAWER",
    templateName: "HUTCHINSON Żywiec 1 - Формування паливних систем",
    keywords: [
      "HUTCHINSON",
      "Żywiec 1",
      "Żywiec",
      "паливні системи",
      "hutchinson żywiec 1",
      "Leśnianka",
    ],
    title: "HUTCHINSON Żywiec 1: Формування паливних систем",
    location: "Żywiec",
    country: "Польща",
    salary: {
      base: "28,61 zł брутто/год",
      student: "",
      monthly: "",
      bonus: "+20% нічні; премія до 100 zł брутто.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни по 8 годин: 05:45–13:45, 13:45–21:45, 21:45–05:45",
      hours: "Пн–Пт",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Обслуговування виробничих машин; Контроль якості готових елементів та компонентів; Перевірка робочого місця після попередньої зміни.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Захисне взуття з металевим носком та захисні окуляри — обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear:
        "Захисне взуття з металевим носком та захисні окуляри — обов'язково.",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "Адреса: Żywiec, ul. Leśnianka 73.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 4 — HUTCHINSON Dębica
  {
    agencyName: "MANPAWER",
    templateName:
      "HUTCHINSON Dębica - Виробництво силіконових виробів та ущільнювачів",
    keywords: [
      "HUTCHINSON",
      "Dębica",
      "Zawada",
      "силіконові вироби",
      "ущільнювачі",
      "hutchinson dębica",
    ],
    title: "HUTCHINSON Dębica: Виробництво силіконових виробів та ущільнювачів",
    location: "Zawada (Dębica)",
    country: "Польща",
    salary: {
      base: "4 806 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні; премія групова 200 zł; надбавка за посаду 20–30 zł/день (мін. 6 год). +50% надгодини будні, +100% субота/неділя.",
      notes: "Доплата за власне житло 475 zł брутто/місяць.",
    },
    schedule: {
      shifts: "3 зміни по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "Пн–Пт",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Вирізання силіконових деталей та ременів; Підготовка матеріалів для виробництва; Обслуговування прес-формувальних машин; Контроль якості готової продукції.",
    accommodation: {
      available: false,
      cost: "Доплата 475 zł брутто/місяць до власного житла",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "30–64 zł/місяць (залежно від маршруту)",
      details:
        "Транспорт від роботодавця: Brzostek, Pilzno, Ropczyce, Wielopole Skrzyńskie, Nagoszyn. Автобус MKS №17 (Дембіца–Завада) — роботодавець сплачує 70 zł за місячний квиток.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Комунікативна польська мова.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "Адреса: Zawada 79N, 39-200 Dębica.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 5 — HUTCHINSON Łódź Niciarniana
  {
    agencyName: "MANPAWER",
    templateName:
      "HUTCHINSON Łódź Niciarniana - Виробництво силіконових виробів",
    keywords: [
      "HUTCHINSON",
      "Łódź",
      "Niciarniana",
      "Lodowa",
      "силікон",
      "hutchinson łódź",
    ],
    title:
      "HUTCHINSON Łódź Niciarniana: Виробництво силіконових виробів та ущільнювачів",
    location: "Łódź",
    country: "Польща",
    salary: {
      base: "4 730–4 980 zł брутто/місяць (залежно від посади)",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні; премія до 265–565 zł брутто. +50% надгодини будні, +100% субота, +200% неділя.",
      notes: "Дофінансування до власного житла 475 zł брутто.",
    },
    schedule: {
      shifts: "3 зміни по 8 годин: 05:45–13:45, 13:45–21:45, 21:45–05:45",
      hours: "Пн–Пт",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Вирізання силіконових деталей та ременів; Підготовка матеріалів для виробництва; Обслуговування прес-формувальних машин; Контроль якості готової продукції.",
    accommodation: {
      available: true,
      cost: "260 zł/місяць (хостел, 3–4 особи)",
      details:
        "Дофінансування до власного 475 zł брутто (зменшується пропорційно при лікарняних).",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Міський транспорт MPK Łódź.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Перед працевлаштуванням — екскурсія та мануальний тест.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "Адреса: Niciarniana 49D або Lodowa 80/84, Łódź.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 6 — McCORMICK Stefanowo
  {
    agencyName: "MANPAWER",
    templateName: "McCORMICK Stefanowo - Виробництво приправ та спецій",
    keywords: [
      "McCormick",
      "Stefanowo",
      "Malinowa",
      "приправи",
      "спеції",
      "mccormick",
    ],
    title: "McCORMICK Stefanowo: Виробництво приправ та спецій",
    location: "Stefanowo",
    country: "Польща",
    salary: {
      base: "34,00 zł/год брутто (без UDT); 37,50 zł/год брутто (з UDT)",
      student: "",
      monthly: "",
      bonus: "+20% нічні. +100% надгодини (тільки субота).",
      notes: "Санепід обов'язково. CV обов'язково.",
    },
    schedule: {
      shifts: "3 зміни по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "Пн–Пт",
      details: "Надгодини лише в суботу: 06:00–14:00 або 08:00–16:00.",
    },
    description:
      "Подача продукції до машини; Зважування спецій; Керування вузком з підйомом до 30 см; (з UDT) робота з боковими та фронтальними вузками; Контроль виробничого процесу; Пакування приправ; Контроль термінів придатності; Контроль якості.",
    accommodation: {
      available: true,
      cost: "350–400 zł/місяць",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "З: Radom, Jedlińsk, Warka, Białobrzegi, Grójec, Tarczyn.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: ["санепід", "CV"],
      physical: "Польська мова рівень B1. Санепід обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Адреса: Malinowa 18/20, 05-552 Stefanowo.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 7 — MONDELEZ Płońsk
  {
    agencyName: "MANPAWER",
    templateName: "MONDELEZ Płońsk - Виробництво кондитерської продукції",
    keywords: [
      "Mondelez",
      "Płońsk",
      "Lubisie",
      "Delicje",
      "кондитерська",
      "mondelez płońsk",
    ],
    title: "MONDELEZ Płońsk: Виробництво кондитерської продукції",
    location: "Płońsk",
    country: "Польща",
    salary: {
      base: "27,70–30,11 zł/год брутто (залежно від місяця)",
      student: "",
      monthly: "",
      bonus:
        "+8 zł за нічну годину; +130 zł за роботу в неділю; квартальна премія до 10%; картка Sodexo +2 zł за відпрацьований день (з 2-го місяця).",
      notes: "Sanepid обов'язково.",
    },
    schedule: {
      shifts:
        "3 зміни по 8 годин або 2 зміни по 8 годин: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Графік формує підприємство.",
    },
    description:
      "Збір готової продукції з лінії; Фасування продукції в дрібні пакети та картонні коробки; Маркування; Контроль якості упакованої продукції; Підтримання порядку на робочому місці.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З: Czerwińsk, Wyszogród, Gościmin, Nowe Miasto, Radzanowo, Drobin, Płock, Glinojeck, Raciąż та ін.",
    },
    requirements: {
      gender: "жінки",
      age: "",
      nationalities: ["Україна"],
      docs: ["санепід"],
      physical: "Досвід роботи на виробництві. Комунікативна польська мова.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "",
    },
    contractType: "Umowa o pracę tymczasową",
    additionalNotes: "",
  },

  // 8 — MONDELEZ Cieszyn
  {
    agencyName: "MANPAWER",
    templateName: "MONDELEZ Cieszyn - Виробництво вафельних батончиків",
    keywords: [
      "Mondelez",
      "Cieszyn",
      "Цєшин",
      "вафельні батончики",
      "mondelez cieszyn",
    ],
    title: "MONDELEZ Cieszyn: Виробництво вафельних батончиків",
    location: "Cieszyn",
    country: "Польща",
    salary: {
      base: "28,61 zł брутто/год. Після 3 міс. — 29,76 zł. Після 6 міс. — 30,51 zł",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні; +132 zł за роботу в неділю; +100% вихідний день; +10% премія після повного місяця.",
      notes: "Підприємство покриває витрати на санепід.",
    },
    schedule: {
      shifts:
        "4-бригадна система, 2 зміни по 12 годин: I зміна 06:00–18:00, II зміна 18:00–06:00",
      hours: "2 дні роботи / 2 дні вихідних",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Збір готової кондитерської продукції з виробничої лінії; Фасування в дрібні пакети та картонні коробки; Маркування; Контроль якості упакованої продукції; Підтримання порядку на робочому місці.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Пішки або громадський транспорт.",
    },
    requirements: {
      gender: "жінки",
      age: "",
      nationalities: ["Україна", "Молдова", "Білорусь"],
      docs: ["санепід"],
      physical:
        "Комунікативна польська мова. Досвід роботи на виробництві — перевага.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 9 — MONDELEZ Tomaszów Mazowiecki
  {
    agencyName: "MANPAWER",
    templateName:
      "MONDELEZ Tomaszów Mazowiecki - Виробництво круасанів (7DAYS)",
    keywords: [
      "Mondelez",
      "Tomaszów Mazowiecki",
      "Chipita",
      "7DAYS",
      "круасани",
      "mondelez tomaszów",
      "Wysoka",
    ],
    title: "MONDELEZ Tomaszów Mazowiecki: Виробництво круасанів 7DAYS",
    location: "Tomaszów Mazowiecki",
    country: "Польща",
    salary: {
      base: "27,78 zł/год брутто",
      student: "",
      monthly: "",
      bonus:
        "+50% нічна зміна; +30% вихідні; надгодини +50%/+100%; премія до 5%. Доплата 500 zł за власне житло.",
      notes: "Виплата до 10 числа. Санепід обов'язково.",
    },
    schedule: {
      shifts:
        "4-бригадна система: 4 дні III зміна (22:00–06:00) / 2 вихідні, 4 дні II зміна (14:00–22:00) / 1 вихідний, 4 дні I зміна (06:00–14:00) / 1 вихідний",
      hours: "",
      details: "Двотижневий договір.",
    },
    description:
      "Формування круасанів/булочок; Подача лотків на виробничу лінію та зняття лотків; Пакування круасанів/рулетів у картонну упаковку; Загальні виробничі ручні роботи.",
    accommodation: {
      available: false,
      cost: "Доплата 500 zł за власне житло",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З: Opoczno, Sławno, Olszowiec, Szadkowice, Piotrków Trybunalski та ін.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "до 55 років",
      nationalities: ["Україна", "Молдова", "Білорусь"],
      docs: ["санепід"],
      physical: "Санепід обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Адреса: Tomaszów Mazowiecki, ul. Wysoka 31.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 10 — ALLEGRO Adamów
  {
    agencyName: "MANPAWER",
    templateName: "ALLEGRO Adamów - Логістичний склад інтернет-магазину",
    keywords: [
      "Allegro",
      "Adamów",
      "склад",
      "e-commerce",
      "allegro",
      "Żyrardów",
    ],
    title: "ALLEGRO Adamów: Логістичний склад інтернет-магазину",
    location: "Adamów",
    country: "Польща",
    salary: {
      base: "32,00 zł брутто/год + до 20% премія за продуктивність",
      student: "",
      monthly: "",
      bonus: "Сезонний бонус 1 000–1 500 zł брутто за 100% відвідуваність.",
      notes: "Обід за 1 zł.",
    },
    schedule: {
      shifts:
        "Пн–Пт: 06:00–14:00, 14:00–22:00. Сб: 08:00–16:00. Нд: 08:00–16:00 або 12:00–20:00",
      hours: "8–12 годин",
      details: "Можлива робота у вихідні. У сезон — більше годин.",
    },
    description:
      "Збирання (комплектація) замовлень на складі; Пакування товарів; Робота зі сканером; Прості складські роботи.",
    accommodation: {
      available: true,
      cost: "безкоштовно",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З: Żyrardów, Sochaczew, Skierniewice, Warszawa, Brwinów, Grodzisk, Piastów та ін.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Досвід роботи на складі або зі сканером — перевага.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Їдальня: обід за 1 zł, автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },

  // 11 — MEDIA EXPERT Łódź
  {
    agencyName: "MANPAWER",
    templateName: "MEDIA EXPERT Łódź - Склад електронної техніки",
    keywords: [
      "Media Expert",
      "Łódź",
      "електроніка",
      "склад",
      "media expert",
      "Jędrzejowska",
      "Zakładowa",
    ],
    title: "MEDIA EXPERT Łódź: Склад електронної техніки",
    location: "Łódź",
    country: "Польща",
    salary: {
      base: "4 900–5 300 zł брутто/місяць (залежно від відділу та UoP). Umowa zlecenie: 34,00 zł брутто/год (зростає до 40 zł в грудні)",
      student: "",
      monthly: "",
      bonus:
        "Премія 100–550 zł + за відвідуваність 300–400 zł. +40% нічні. +50% надгодини будні, +100% вихідні.",
      notes: "",
    },
    schedule: {
      shifts: "2–3 зміни по 8–10 год",
      hours: "5 днів на тиждень",
      details:
        "Перерва 20–30 хв. Три склади: малі (Zakładowa 90/92), середні (Jędrzejowska 43a), великі (Jędrzejowska 45a).",
    },
    description:
      "Обслуговування сканера; Комплектація замовлень; Розвантаження та завантаження вантажних автомобілів; Складські роботи.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "Безкоштовний автобус (крім Zakładowa 90/92 — доїзд самостійний).",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Польська мова — вільне спілкування та розуміння.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: харчування 2,5 zł.",
      notes: "Адреса: Jędrzejowska 43a/45a або Zakładowa 90/92, Łódź.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 12 — BREMBO Częstochowa
  {
    agencyName: "MANPAWER",
    templateName: "BREMBO Częstochowa - Виробництво гальмівних систем",
    keywords: [
      "Brembo",
      "Częstochowa",
      "гальмівні",
      "супорти",
      "brembo",
      "Dekabrystów",
    ],
    title: "BREMBO Częstochowa: Виробництво гальмівних систем та компонентів",
    location: "Częstochowa",
    country: "Польща",
    salary: {
      base: "24,00 zł брутто/год (після 3 міс. — 25,60 zł)",
      student: "",
      monthly: "4 132 zł брутто (168 год/міс)",
      bonus:
        "+20% нічні (~230 zł) + 1 zł/нічну год; 8% від базової; 630 zł за 4-бригадну систему; 7% продукційна. +50% надгодини будні, +100% вихідні.",
      notes: "",
    },
    schedule: {
      shifts:
        "4-бригадна система: 3 зміни по 8 год — 4 дні 06:00–14:00 / 1 вихідний, 4 дні 14:00–22:00 / 1 вихідний, 4 дні 22:00–06:00 / 2 вихідні",
      hours: "",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Монтаж: збірка компонентів гальмівних супортів; контроль якості; пакування; введення даних. Цинкування: обслуговування лінії цинкування; розміщення деталей на підвіски; візуальний контроль. Обробка: обробка деталей на верстатах ЧПУ; обслуговування верстатів; упаковка.",
    accommodation: {
      available: false,
      cost: "~1 000 zł/місяць (самостійний пошук)",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details:
        "Автобуси 15, 22, 24. Трамвай до зупинки Hala Polonia + 5 хв пішки.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical:
        "Комунікативна польська мова. Досвід роботи на виробництві. Вміння користуватися штангенциркулем. Основи технічного рисунка.",
    },
    conditions: {
      temperature: "тепло, комфортно",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "Адреса: Dekabrystów 67, 42-218 Częstochowa.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 13 — LANTMÄNNEN
  {
    agencyName: "MANPAWER",
    templateName:
      "LANTMÄNNEN Stanisławów Pierwszy - Пакувальник хлібобулочних виробів",
    keywords: [
      "Lantmännen",
      "Stanisławów Pierwszy",
      "хліб",
      "пакувальник",
      "lantmannen",
      "Nieporęt",
    ],
    title: "LANTMÄNNEN Stanisławów Pierwszy: Пакувальник хлібобулочних виробів",
    location: "Stanisławów Pierwszy (gmina Nieporęt)",
    country: "Польща",
    salary: {
      base: "5 966 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus: "+20% нічні; премія до 10% після 3 місяців.",
      notes: "Санепід або готовність оформити.",
    },
    schedule: {
      shifts:
        "4-бригадна система: 4 дні 06:00–14:00 / 1 вихідний, 4 дні 14:00–22:00 / 1 вихідний, 4 дні 22:00–06:00 / 2 вихідні",
      hours: "",
      details: "Вихідні можуть припадати на будні, суботу або неділю.",
    },
    description:
      "Пакування готової продукції; Підготовка товару до відправлення (палетування); Доставка сировини до виробничої лінії; Допомога при виробничій лінії; Підтримання порядку.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Самостійний доїзд.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: ["санепід"],
      physical:
        "Комунікативна польська мова. Готовність до 4-бригадного графіку. Санепід або готовність оформити.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "Адреса: Stanisławów Pierwszy (gmina Nieporęt).",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 14 — MAHLE Krotoszyn
  {
    agencyName: "MANPAWER",
    templateName: "MAHLE Krotoszyn - Виробництво автомобільних деталей",
    keywords: [
      "Mahle",
      "Krotoszyn",
      "автомобільні деталі",
      "mahle",
      "Jarocin",
      "Ostrów",
    ],
    title:
      "MAHLE Krotoszyn: Виробництво автомобільних деталей (оператор машин)",
    location: "Krotoszyn",
    country: "Польща",
    salary: {
      base: "4 400 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+10% від ставки; +20% нічні; +75 zł за суботу/неділю; +100% надгодини у вихідні. Виплата до 10 числа.",
      notes: "Транспорт 50 zł/міс.",
    },
    schedule: {
      shifts:
        "4-бригадна система: 3 зміни по 8 год (6 робочих / 2 вихідних): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Контроль роботи кількох машин одночасно; Контроль процесу виробництва; Робота стоячи з переміщенням між машинами; Дотримання стандартів якості.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "50 zł/місяць",
      details:
        "З: Jarocin, Koźmin, Ostrów, Kobylin, Milicz, Zduny, Pleszew, Odolanów, Sulmierzyce.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна", "Молдова", "Білорусь", "Грузія", "Вірменія"],
      docs: ["CV"],
      physical:
        "Польська мова — читання та письмо (мінімум базовий рівень). CV обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "Адреса: Krotoszyn, ul. Mahle 6.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 15 — GESTAMP Wrocław UDT
  {
    agencyName: "MANPAWER",
    templateName: "GESTAMP Wrocław - Оператор навантажувача UDT / Milk-run",
    keywords: [
      "Gestamp",
      "Wrocław",
      "UDT",
      "milk-run",
      "навантажувач",
      "gestamp wrocław",
      "Kwiatkowskiego",
    ],
    title: "GESTAMP Wrocław: Оператор навантажувача UDT / Milk-run",
    location: "Wrocław",
    country: "Польща",
    salary: {
      base: "4 800 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "Щомісячна премія до 800 zł брутто. Дофінансування доїзду до 186 zł брутто.",
      notes: "",
    },
    schedule: {
      shifts:
        "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00 або 2 зміни по 12 год (4-бригадна)",
      hours: "",
      details: "",
    },
    description:
      "Транспортування компонентів між складом і виробництвом; Завантаження та розвантаження вантажівок; Обслуговування вилочних навантажувачів (газових або електричних); Заміна газових балонів; Робота з комп'ютером, друк етикеток із SAP. Milk-run: транспортування ящиків до 20–25 кг.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Поруч зупинка автобуса N319.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["UDT"],
      physical:
        "Оператор навантажувача: чинний дозвіл UDT (включно із заміною газових балонів); досвід роботи на газових або електричних навантажувачах. Milk-run: польські права категорії B.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "Обов'язкові робочий одяг та засоби індивідуального захисту.",
      food: "Їдальня: автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "Адреса: ul. Kwiatkowskiego 3, Wrocław.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 16 — GESTAMP Wrocław виробництво
  {
    agencyName: "MANPAWER",
    templateName: "GESTAMP Wrocław - Працівник виробничої лінії",
    keywords: [
      "Gestamp",
      "Wrocław",
      "виробнича лінія",
      "gestamp wrocław виробництво",
      "Kwiatkowskiego",
      "автомобільні компоненти",
    ],
    title: "GESTAMP Wrocław: Працівник автоматизованої виробничої лінії",
    location: "Wrocław",
    country: "Польща",
    salary: {
      base: "30,50 zł/год брутто",
      student: "",
      monthly: "",
      bonus:
        "Премія до 800 zł брутто. +30 zł на каву та солодощі. +130 zł карта SmartLunch. Дофінансування доїзду до 186 zł брутто.",
      notes: "",
    },
    schedule: {
      shifts:
        "3 зміни по 8 год (Пн–Пт) або 2 зміни по 12 год (4-бригадна). Графік видається на кілька місяців вперед",
      hours: "Зазвичай: 4 робочі / кілька вихідних",
      details: "",
    },
    description:
      "Пакування автомобільних деталей; Контроль якості продукції; Виготовлення та обробка деталей; Обслуговування виробничих машин.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Громадський транспорт (автобус N319).",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Комунікативна польська мова.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "Адреса: Kwiatkowskiego 3, Wrocław.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },

  // 17 — GESTAMP Września
  {
    agencyName: "MANPAWER",
    templateName:
      "GESTAMP Września - Виробництво металевих компонентів для авто",
    keywords: [
      "Gestamp",
      "Września",
      "Chocicza Mała",
      "gestamp września",
      "металеві компоненти",
      "UDT",
    ],
    title:
      "GESTAMP Września (Chocicza Mała): Виробництво металевих компонентів для авто",
    location: "Chocicza Mała (м. Września)",
    country: "Польща",
    salary: {
      base: "Оператор виробництва: 27,77 zł/год (5 040 zł брутто/міс). Оператор якості: 30,00 zł/год. Оператор UDT: 30,25 zł/год (5 082 zł брутто/міс)",
      student: "",
      monthly: "",
      bonus:
        "Квартальна премія 450 zł. +20% нічні. +50% надгодини будні, +100% вихідні.",
      notes: "Безкоштовне житло.",
    },
    schedule: {
      shifts:
        "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00 або 4-бригадна (за потребою)",
      hours: "",
      details: "",
    },
    description:
      "Оператор виробництва: зняття пресованих елементів кузова з конвеєра; очисні роботи; підрахунок деталей. Оператор якості: обслуговування зварювальної камери; контроль якості; заповнення документації; робота з комп'ютером. Оператор UDT: транспортування компонентів; завантаження/розвантаження; складський облік.",
    accommodation: {
      available: true,
      cost: "безкоштовно",
      details: "Хостел Alfa Marina. Поселення організовує агенція.",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["UDT"],
      physical:
        "Комунікативна польська мова (А2). Для оператора UDT — чинний сертифікат UDT.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 18 — KERRY Oleśnica
  {
    agencyName: "MANPAWER",
    templateName:
      "KERRY Oleśnica - Виробництво ароматизаторів та харчових добавок",
    keywords: [
      "Kerry",
      "Oleśnica",
      "ароматизатори",
      "харчові добавки",
      "kerry",
      "Energetyczna",
    ],
    title: "KERRY Oleśnica: Виробництво ароматизаторів та харчових добавок",
    location: "Oleśnica",
    country: "Польща",
    salary: {
      base: "31,50 zł брутто/год",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні; бонус за присутність, продуктивність та якість 800 zł брутто. +50% надгодини будні, +100% вихідні.",
      notes: "Санепід обов'язково.",
    },
    schedule: {
      shifts: "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "",
    },
    description:
      "Підготовка сировини: змішування панірування, спецій та смакових добавок; Обслуговування виробничих процесів на лінії; Пакування готової продукції (контейнери 10–20 кг); Фасовка спецій у мішки від 10 кг; Передача на склад.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "320 zł/місяць (службовий) або дофінансування до власного",
      details: "З: Namysłów, Twardogóra, Syców, Międzybórz, Bierutów.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["санепід", "CV"],
      physical: "Санепід обов'язково. CV обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear: "Обов'язкові робочий та захисний одяг.",
      food: "",
      notes: "Адреса: Oleśnica, ul. Energetyczna 13.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 19 — FAURECIA Grójec
  {
    agencyName: "MANPAWER",
    templateName: "FAURECIA Grójec - Виробництво каркасів автомобільних сидінь",
    keywords: [
      "Faurecia",
      "Grójec",
      "сидіння",
      "автомобільні",
      "faurecia grójec",
      "Radom",
    ],
    title:
      "FAURECIA Grójec: Виробництво напрямних та каркасів автомобільних сидінь",
    location: "Grójec",
    country: "Польща",
    salary: {
      base: "4 806 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні; продуктивна премія до 15%. +50% надгодини будні, +100% вихідні.",
      notes: "Транспорт платний залежно від локації.",
    },
    schedule: {
      shifts: "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Обслуговування машин на виробничій лінії; Виробництво напрямних для автомобільних сидінь; Контроль процесу виробництва.",
    accommodation: {
      available: true,
      cost: "300 zł/місяць (м. Radom, доїзд ~1,5 год)",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "платний (залежно від локації)",
      details:
        "З: Radom, Wyśmierzyce, Białobrzegi, Falęcice, Sucha, Stanisławów, Warka.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Можна без знання мови та досвіду.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 20 — HITACHI Łódź
  {
    agencyName: "MANPAWER",
    templateName:
      "HITACHI Łódź - Виготовлення ізоляційних матеріалів (оператор/столяр)",
    keywords: [
      "Hitachi",
      "Łódź",
      "ізоляційні матеріали",
      "трансформатори",
      "hitachi",
      "Aleksandrowska",
    ],
    title:
      "HITACHI Łódź: Виготовлення ізоляційних матеріалів для трансформаторів",
    location: "Łódź",
    country: "Польща",
    salary: {
      base: "Оператор машин: 4 266 zł брутто/місяць. Magazynier UDT: 4 900 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні; продукційна премія до 365 zł брутто. +50% надгодини будні, +100% субота, +200% неділя та свята.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни по 8 год (Пн–Пт): 05:45–13:45, 13:45–21:45, 21:45–05:45",
      hours: "",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Оператор машин: обслуговування виробничих верстатів та інструментів; контроль точності за допомогою штангенциркуля; підготовка матеріалів; маркування готової продукції. Magazynier UDT: обслуговування вантажопідйомника; транспортування зі складу у виробничий зал та назад.",
    accommodation: {
      available: true,
      cost: "260 zł/місяць (хостел, 3–4 особи)",
      details: "Дофінансування до власного 475 zł брутто.",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Міський транспорт.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["UDT"],
      physical: "Для Magazynier: чинні права UDT на вилочний навантажувач.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "Адреса: Łódź, ul. Aleksandrowska 67/93.",
    },
    contractType: "Umowa o pracę tymczasową",
    additionalNotes: "",
  },

  // 21 — ONNERA Palmiry
  {
    agencyName: "MANPAWER",
    templateName:
      "ONNERA Palmiry - Виробництво миючих машин та холодильного обладнання",
    keywords: [
      "Onnera",
      "Palmiry",
      "Czosnów",
      "миючі машини",
      "onnera",
      "Płońsk",
    ],
    title:
      "ONNERA Palmiry: Виробництво миючих машин та промислових холодильних установок",
    location: "Palmiry (поблизу Варшави)",
    country: "Польща",
    salary: {
      base: "5 200 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "Премія від 1-го місяця 500 zł брутто. +50% надгодини будні, +100% вихідні.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни по 8 год: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перерва 20–30 хв. Комунікативна польська мова — обов'язково.",
    },
    description:
      "Обслуговування штампувального верстату для листового металу; Завантаження листів металу у верстат; Встановлення необхідних інструментів; Налаштування програми за виробничим замовленням; Вирізання деталей та розміщення на піддонах.",
    accommodation: {
      available: true,
      cost: "300 zł/місяць (хостел, 3–4 особи)",
      details: "Повністю укомплектоване.",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "З: Płońsk, Nowy Dwór Mazowiecki.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Комунікативна польська мова — обов'язково.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: кава, чай, снеки, мікрохвильовки.",
      notes: "Адреса: Palmiry (біля Czosnów, поблизу Варшави).",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 22 — VALEO Chrzanów
  {
    agencyName: "MANPAWER",
    templateName: "VALEO Chrzanów - Виробництво автомобільних фар",
    keywords: ["Valeo", "Chrzanów", "фари", "автомобільні", "valeo", "Kraków"],
    title:
      "VALEO Chrzanów: Виробництво автомобільних фар та освітлювальних приладів",
    location: "Chrzanów (50 км від Кракова)",
    country: "Польща",
    salary: {
      base: "4 666 zł брутто/місяць",
      student: "",
      monthly: "4 000–4 300 zł нетто",
      bonus:
        "+20% нічні; +430 zł брутто VPS Bonus; +280 zł за 4-бригадну систему; +30 zł за роботу в неділю; +34,8 zł за прання. +50% надгодини будні, +100% вихідні.",
      notes:
        "Перший місяць — житло безкоштовно, потім 200 zł. Дофінансування до власного 500 zł брутто.",
    },
    schedule: {
      shifts:
        "4-бригадна система: 3 зміни по 8 год: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details:
        "Перерва 20–30 хв. Вихідний може бути як в суботу, неділю, так і серед тижня.",
    },
    description:
      "Обслуговування пресів (втрискарочних); Обслуговування обладнання для склеювання та автоматичної обробки ліхтарів; Контроль якості на різних етапах виробництва.",
    accommodation: {
      available: true,
      cost: "Перший місяць — безкоштовно, потім 200 zł/місяць. Дофінансування до власного 500 zł брутто",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Пішки (2–3 км) або міський транспорт.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Хороший зір або окуляри — обов'язково. Готовність виходити у вихідний день.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 23 — GKN Oleśnica
  {
    agencyName: "MANPAWER",
    templateName:
      "GKN Oleśnica - Виробництво автомобільних компонентів трансмісії",
    keywords: ["GKN", "Oleśnica", "трансмісія", "піввали", "gkn", "Twardogóra"],
    title: "GKN Oleśnica: Виробництво автомобільних компонентів трансмісії",
    location: "Oleśnica",
    country: "Польща",
    salary: {
      base: "5 213 zł брутто/місяць",
      student: "",
      monthly: "~4 000 zł нетто",
      bonus:
        "+200 zł брутто + 200 zł uznaniowa. +25% нічні. +50% надгодини будні, +100% вихідні.",
      notes: "CV до клієнта обов'язково.",
    },
    schedule: {
      shifts: "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "",
    },
    description:
      "Виробництво піввалів, приводних валів та компонентів; Експлуатація машин та обладнання; Контроль готової продукції; Виконання виробничих планів.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "З: Twardogóra, Namysłów, Syców.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical: "Комунікативна польська мова обов'язково. CV до клієнта.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Адреса: Oleśnica.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 24 — GATES Legnica
  {
    agencyName: "MANPAWER",
    templateName: "GATES Legnica - Виробництво гумових ременів та шлангів",
    keywords: ["Gates", "Legnica", "гумові ремені", "шланги", "gates", "Lubin"],
    title: "GATES Legnica: Виробництво гумових ременів та шлангів",
    location: "Legnica",
    country: "Польща",
    salary: {
      base: "28,72–30,10 zł/год брутто",
      student: "",
      monthly: "~4 300 zł нетто",
      bonus:
        "До 570 zł щомісяця + квартальна до 480 zł. +20% нічні. +50% надгодини будні, +100% вихідні. Дофінансування на житло 300 zł.",
      notes: "CV до клієнта.",
    },
    schedule: {
      shifts: "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "",
    },
    description:
      "Робота на верстатах: завантаження продукції в машину; Накладання матеріалу на рулон для вулканізації; Ручна робота та огляд готового продукту; Робота на комп'ютері та принтері.",
    accommodation: {
      available: false,
      cost: "Дофінансування 300 zł",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical: "CV до клієнта.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Місто: Legnica.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 25 — LISNER Poznań пакувальник
  {
    agencyName: "MANPAWER",
    templateName: "LISNER Poznań - Пакування рибної продукції",
    keywords: [
      "Lisner",
      "Poznań",
      "рибна продукція",
      "пакувальник",
      "lisner",
      "Strzeszyńska",
      "салати",
    ],
    title: "LISNER Poznań: Пакування рибної продукції (пасти, салати, закуски)",
    location: "Poznań",
    country: "Польща",
    salary: {
      base: "28,58–29,77 zł/год брутто (~4 800–5 000 zł брутто/місяць)",
      student: "",
      monthly: "",
      bonus: "+20% нічні; +50% надгодини будні; +100% вихідні.",
      notes: "Санепід або готовність оформити. Вільні вихідні.",
    },
    schedule: {
      shifts:
        "2–3 зміни по 8 год (Пн–Пт): I зміна 05:45–13:45, II 13:45–21:45, III 21:45–05:45",
      hours: "",
      details: "Перерва 25 хв. Можливі робочі суботи у великий сезон.",
    },
    description:
      "Фасування, сортування готової рибної продукції (пасти, салати, закуски); Приготування салатів та паст за рецептами; Роботи з інгредієнтами; Укладання запакованої продукції в коробки або на піддони; Прибирання; Транспортування продуктів.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З: Czarnków, Mieleszyn, Gniezno, Wągrowiec, Damasławek, Sieraków, Szamotuły, Wolsztyn, Września.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: ["санепід"],
      physical:
        "Досвід не потрібен. Санепід або готовність оформити. Температура на робочому місці 4–14°C.",
    },
    conditions: {
      temperature: "4–14°C",
      workwear:
        "Одноразовий одяг поверх свого (штани, фартух, чепчик, рукавички). Робоче взуття.",
      food: "Безкоштовні обіди 1 раз на день та 2–3 гарячих напої. Їдальня: автомати, мікрохвильовки.",
      notes: "Адреса: Strzeszyńska 38/42, 60-479 Poznań.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 26 — LISNER Poznań оператор вузка
  {
    agencyName: "MANPAWER",
    templateName: "LISNER Poznań - Оператор вилочного навантажувача (склад)",
    keywords: [
      "Lisner",
      "Poznań",
      "оператор вузка",
      "UDT",
      "lisner оператор",
      "Strzeszyńska",
      "склад",
    ],
    title:
      "LISNER Poznań: Оператор вилочного навантажувача (склад сировини та пакування)",
    location: "Poznań",
    country: "Польща",
    salary: {
      base: "31,87 zł/год брутто + премія за рішенням підприємства",
      student: "",
      monthly: "",
      bonus: "+20% нічні; +50% надгодини будні; +100% вихідні.",
      notes: "UDT та санепід обов'язково.",
    },
    schedule: {
      shifts:
        "2–3 зміни (Пн–Пт): I зміна 05:45–13:45, II 13:45–21:45, III 21:45–05:45",
      hours: "",
      details: "Перерва 25 хв. Вільні вихідні.",
    },
    description:
      "Приймання товарів за товарно-транспортними документами; Перевірка відповідності документів поставленому товару; Перевірка дійсності поставленого товару; Розміщення товару на складі та його поповнення.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З: Czarnków, Mieleszyn, Gniezno, Wągrowiec, Damasławek, Sieraków, Szamotuły, Wolsztyn, Września.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["UDT", "санепід"],
      physical: "Польська мова. UDT (Uprawnienia na Wózki Widłowe). Санепід.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Безкоштовні обіди 1 раз на день та 2 гарячих напої.",
      notes: "Адреса: Strzeszyńska 38/42, 60-479 Poznań.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 27 — CHROMAVIS Ciechanów
  {
    agencyName: "MANPAWER",
    templateName:
      "CHROMAVIS Ciechanów - Виробництво лаків для нігтів та косметики",
    keywords: [
      "Chromavis",
      "Ciechanów",
      "лак для нігтів",
      "косметика",
      "chromavis",
      "Robotnicza",
    ],
    title:
      "CHROMAVIS Ciechanów: Виробництво лаків для нігтів та засобів для нігтів",
    location: "Ciechanów",
    country: "Польща",
    salary: {
      base: "4 666 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні; +400 zł брутто (премія за частоту та продуктивність). +50% надгодини.",
      notes: "Санепід або готовність оформити.",
    },
    schedule: {
      shifts: "3 зміни (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details:
        "Можливість 9-годинних змін (+50% за надгодини). У сезон — можливі робочі суботи.",
    },
    description:
      "Закручування ковпачків; Вкладення щіточок у флакони; Робота на лінії розливу продукції; Пакування готової продукції; Обслуговування етикетувальних машин.",
    accommodation: {
      available: true,
      cost: "безкоштовно",
      details: "Кімнати 3–5 осіб. Повністю укомплектоване.",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Залежно від локалізації житла.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: ["санепід"],
      physical:
        "Санепід або готовність оформити. Заборонено носіння біжутерії. Переважно сидяча робота.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 28 — CORNING Stryków
  {
    agencyName: "MANPAWER",
    templateName:
      "CORNING Stryków - Виробництво оптичного кабельного з'єднання",
    keywords: [
      "Corning",
      "Stryków",
      "оптичний кабель",
      "corning",
      "Łódź",
      "Zgierz",
    ],
    title: "CORNING Stryków: Виробництво оптичного кабельного з'єднання",
    location: "Stryków",
    country: "Польща",
    salary: {
      base: "33,00 zł брутто/год",
      student: "",
      monthly: "",
      bonus:
        "+6 zł/год нічні; +10% за відсутність прогулів; +700 zł за 4-бригадний графік. Дофінансування їдальні 10 zł. Дофінансування до власного житла 300 zł. +50% надгодини будні, +100% вихідні.",
      notes: "Через 3 місяці — перехід напряму на підприємство.",
    },
    schedule: {
      shifts:
        "4-бригадний по 12 год (2-2-3): 2 дні 06:00–18:00 / 2 вихідні / 3 дні 18:00–06:00 / 2 вихідні / 2 дні 06:00–18:00 / 3 вихідні",
      hours: "",
      details: "Тимчасово можлива 3 зміни по 8 год (Пн–Пт).",
    },
    description:
      "Підготовка робочого місця; Намотування готової продукції за стандартами якості; Допомога в переобладнанні виробничої машини; Виконання виробничих замовлень за інструкціями; Прибирання робочого місця.",
    accommodation: {
      available: true,
      cost: "320 zł/місяць (хостел, 3–4 особи)",
      details: "Дофінансування до власного 300 zł брутто.",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З: Łódź, Koluszki, Brzeziny, Konstantynów Łódzki, Zgierz, Łęczyca, Ozorków, Łowicz, Głowno.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical:
        "Польська мова рівень B1. Вміння користуватися штангенциркулем та комп'ютером. CV обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "Адреса: Corning Smolice 1e, 95-010 Stryków.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 29 — GILLETTE Łódź
  {
    agencyName: "MANPAWER",
    templateName: "GILLETTE Łódź - Виробництво елементів станків для гоління",
    keywords: [
      "Gillette",
      "Łódź",
      "станки для гоління",
      "gillette",
      "Nowy Józefów",
    ],
    title: "GILLETTE Łódź: Виробництво елементів станків для гоління",
    location: "Łódź",
    country: "Польща",
    salary: {
      base: "4 806 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні; +700 zł за 4-бригадну систему; +100 zł (2-3 зміни). Дофінансування обідів 60% від роботодавця. +50% надгодини будні, +100% вихідні.",
      notes: "",
    },
    schedule: {
      shifts:
        "Варіант 1: 4-бригадна, 3 зміни по 8 год. Варіант 2: 2–3 зміни по 8 год (Пн–Пт)",
      hours: "",
      details:
        "Перерва 30 хв. Взуття з металевим носком, захисні окуляри, беруші — обов'язково. Заборонені розпущене волосся, пірсинг.",
    },
    description:
      "Обслуговування машин для виробництва елементів станків для гоління; Пильнування безперервної роботи машин; Комплектація виробів; Пакування готової продукції; Контроль якості.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Трамвай або автобус MPK Łódź. Безкоштовний паркінг.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Комунікативна польська мова. Досвід роботи на виробництві понад 1 рік.",
    },
    conditions: {
      temperature: "тепло",
      workwear:
        "Взуття з металевим носком, захисні окуляри, беруші — обов'язково.",
      food: "Їдальня: автомати, мікрохвильовки. 40% вартості обіду сплачує працівник.",
      notes: "Адреса: Nowy Józefów 70, Łódź.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 30 — FIEGE Mszczonów
  {
    agencyName: "MANPAWER",
    templateName: "FIEGE Mszczonów - Логістичний склад (оператор UDT)",
    keywords: ["Fiege", "Mszczonów", "логістика", "UDT", "fiege", "Wiejska"],
    title:
      "FIEGE Mszczonów: Логістичний склад (оператор вилочного навантажувача UDT)",
    location: "Mszczonów",
    country: "Польща",
    salary: {
      base: "35,50 zł брутто/год",
      student: "",
      monthly: "",
      bonus: "До 250 zł брутто. Доплата за власний транспорт 300 zł.",
      notes: "",
    },
    schedule: {
      shifts:
        "2 зміни по 8 год або 12 год: 06:00–14:00 / 14:00–22:00 / 22:00–06:00 або 06:00–18:00 / 18:00–06:00",
      hours: "",
      details: "",
    },
    description:
      "Навантаження та розвантаження поставок за складською документацією; Ведення складської документації; Обслуговування вилочного навантажувача.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "300 zł/місяць (доплата за власний транспорт)",
      details: "",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["UDT"],
      physical:
        "Права UDT на вилочний навантажувач. Акуратність, сумлінність, надійність.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Адреса: FIEGE sp. z.o.o., Wiejska 2, Mszczonów.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },

  // 31 — MAN TRUCKS Niepołomice
  {
    agencyName: "MANPAWER",
    templateName: "MAN TRUCKS Niepołomice - Збірка вантажівок",
    keywords: [
      "MAN Trucks",
      "MAN",
      "Niepołomice",
      "вантажівки",
      "man trucks",
      "Kraków",
    ],
    title: "MAN TRUCKS Niepołomice: Збірка вантажівок NTG та TG",
    location: "Niepołomice (поблизу Кракова)",
    country: "Польща",
    salary: {
      base: "6 069 zł брутто/місяць",
      student: "",
      monthly: "~7 300 zł брутто (з преміями та надбавками)",
      bonus:
        "Премія до 15% + надбавки за відвідування, харчування та прання. Перші 3 місяці — доплата за житло 650 zł брутто.",
      notes: "Польська мова B1–B2 обов'язково. CV обов'язково.",
    },
    schedule: {
      shifts: "3 зміни (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перший контракт до серпня (виробнича перерва).",
    },
    description:
      "Збірка деталей автомобіля на конвеєрі; Закручування пневматичними викрутками та ручними ключами; Ручне переміщення зібраних деталей; Збірка пневматичної системи; Монтаж пневматичних та електричних джгутів; Складання компонентів рами; Використання комп'ютерних систем.",
    accommodation: {
      available: false,
      cost: "Доплата 650 zł брутто перші 3 місяці",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "Employee Transport для працівників.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical: "Польська мова рівень B1–B2 — обов'язково. CV обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 32 — LEAR Legnica
  {
    agencyName: "MANPAWER",
    templateName:
      "LEAR Legnica - Виробництво металевих конструкцій для автомобільних сидінь",
    keywords: [
      "Lear",
      "Legnica",
      "автомобільні сидіння",
      "lear legnica",
      "Lubin",
      "Głogów",
      "преси",
    ],
    title:
      "LEAR Legnica: Виробництво металевих конструкцій для автомобільних сидінь",
    location: "Legnica",
    country: "Польща",
    salary: {
      base: "Оператор виробництва: 5 010 zł брутто + 12% премія. Оператор пресів: 5 280 zł брутто + до 12% премія",
      student: "",
      monthly: "4 000–4 500 zł нетто",
      bonus:
        "+20% нічні. +50% надгодини будні, +100% вихідні. Дофінансування на житло 500 zł брутто.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "",
    },
    description:
      "Оператор виробництва: монтаж деталей до каркасів сидіння; контроль якості; обслуговування зварювальних столів; лакерування деталей. Оператор пресів: експлуатація автоматичних та трансферних пресів; контрольні вимірювання (циркуль, висотомір, мікрометр).",
    accommodation: {
      available: false,
      cost: "Дофінансування 500 zł брутто. Є можливість зняти житло за 30 zł/добу",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "З: Lubin, Głogów, Polkowice.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical:
        "Комунікативна польська. CV обов'язково. Для оператора пресів: досвід мін. 2 роки, основи технічного рисунка.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Місто: Legnica.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 33 — LEAR Pruszków
  {
    agencyName: "MANPAWER",
    templateName: "LEAR Pruszków - Збірка деталей інтер'єру автомобілів",
    keywords: [
      "Lear",
      "Pruszków",
      "інтер'єр авто",
      "lear pruszków",
      "Żyrardów",
      "Grodzisk",
      "3 Maja",
    ],
    title: "LEAR Pruszków: Збірка деталей інтер'єру автомобілів (сидіння)",
    location: "Pruszków",
    country: "Польща",
    salary: {
      base: "4 700–4 850 zł брутто/місяць",
      student: "",
      monthly: "4 000–4 200 zł нетто",
      bonus:
        "540 zł — премія за відвідуваність; 600 zł — щоквартальна премія. +20% нічні. Доплата до власного житла 500 zł брутто. Програма рекомендацій 500 zł.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перерва 20 хв. Тихе середовище, кондиціонери та вентилятори.",
    },
    description:
      "Збирання дрібних деталей інтер'єру авто (сидіння); Лютування, клейка, шиття.",
    accommodation: {
      available: false,
      cost: "Доплата до власного 500 zł брутто",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З: Żyrardów, Międzyborów, Jaktorów, Grodzisk Mazowiecki, Milanówek, Brwinów, Skierniewice, Płochocin.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical: "Польська мова рівень A1–A2. Без підняття важких речей.",
    },
    conditions: {
      temperature: "тихо, без різких запахів",
      workwear: "",
      food: "",
      notes: "Адреса: ul. 3 Maja 8, 05-800 Pruszków.",
    },
    contractType: "Umowa o pracę",
    additionalNotes:
      "1-й договір на 1 місяць, 2-й на 3 місяці, 3-й до 18 місяців. Можливий прямий контракт після 18 міс.",
  },

  // 34 — SFC Częstochowa
  {
    agencyName: "MANPAWER",
    templateName: "SFC Częstochowa - Виробництво гумових автозапчастин",
    keywords: [
      "SFC",
      "Częstochowa",
      "гумові автозапчастини",
      "автоклав",
      "sfc",
      "Legionów",
    ],
    title:
      "SFC Częstochowa: Виробництво гумових автозапчастин (автоклав, монтаж)",
    location: "Częstochowa",
    country: "Польща",
    salary: {
      base: "Автоклав: 35,00 zł брутто + 5,72 zł за нічну год. Монтаж: 30,50 zł брутто + 5,50 zł за нічну год",
      student: "",
      monthly: "",
      bonus:
        "Вихідний день: 62,64 zł/год брутто. +50% надгодини будні, +100% вихідні.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Автоклав: монтаж деталей у спеціальне обрамлення (штифт); обслуговування парових контейнерів під тиском; візуальний контроль якості. Монтаж: складання компонентів (затискачів, фітингів, ковпачків) для автомобільних проводів; робота на складальних машинах; пакування готової продукції.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Міський автобус 11, зупинка Legionów.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна", "Білорусь", "Молдова"],
      docs: [],
      physical:
        "Фізично важка робота (автоклав). Робота при високій температурі.",
    },
    conditions: {
      temperature: "висока (автоклав, особливо влітку)",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "Адреса: Legionów 244, 42-202 Częstochowa.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "З собою потрібен навісний замок для шафки.",
  },

  // 35 — BREMBO Dąbrowa Górnicza
  {
    agencyName: "MANPAWER",
    templateName: "BREMBO Dąbrowa Górnicza - Виробництво гальмівних дисків",
    keywords: [
      "Brembo",
      "Dąbrowa Górnicza",
      "гальмівні диски",
      "brembo dąbrowa",
      "Katowice",
    ],
    title:
      "BREMBO Dąbrowa Górnicza: Виробництво гальмівних дисків для автомобілів",
    location: "Dąbrowa Górnicza",
    country: "Польща",
    salary: {
      base: "27,00 zł брутто/год",
      student: "",
      monthly: "",
      bonus:
        "+900 zł за 4-бригадну систему; 8% (~362 zł); виробнича 7% (~300 zł); +20% нічні (~320 zł) + 2 zł/нічну год; бон на харчування 630 zł. +50% надгодини будні, +100% вихідні.",
      notes: "",
    },
    schedule: {
      shifts:
        "4-бригадна система: 3 зміни (Пн–Нд): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перерва 20–30 хв. Велика кількість надгодин.",
    },
    description:
      "Робота на виробничій лінії (бригада 4–8 осіб); Підготовка та транспортування контейнерів рохлею; Обслуговування процесу шліфування, очищення та фарбування гальмівних дисків; Відбір готової продукції після фарбування; Укладання дисків та транспортування на склад; Контроль якості.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З: Dąbrowa Górnicza, Będzin, Czeladź, Sosnowiec, Myszków, Zawiercie, Katowice, Tychy та ін.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна", "Білорусь", "Молдова"],
      docs: [],
      physical: "Фізично важка робота.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "Місто: Dąbrowa Górnicza.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 36 — BOSCH/BSH Łódź
  {
    agencyName: "MANPAWER",
    templateName:
      "BOSCH/BSH Łódź - Монтаж та обслуговування пральних і сушильних машин",
    keywords: [
      "BOSCH",
      "BSH",
      "Łódź",
      "пральні машини",
      "bosch",
      "bsh",
      "Jędrzejowska",
      "Lodowa",
    ],
    title:
      "BOSCH/BSH Łódź: Монтаж та обслуговування пральних і сушильних машин",
    location: "Łódź",
    country: "Польща",
    salary: {
      base: "29,00 zł брутто/год (33,00 zł для UDT)",
      student: "",
      monthly: "~4 872 zł брутто (або 5 544 zł для UDT)",
      bonus:
        "+20% нічні; до 500 zł премія. 1 обов'язкова субота: або вихідний + 150/250 zł, або +100% раз на квартал. +50% надгодини будні, +100% вихідні. Бонус нових працівників 2 000 zł (01.06–31.10.2025). Бонус «Порекомендуй знайомого» 1 000 zł.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перерви: 20 хв обідня + 2×5 хв.",
    },
    description:
      "Обслуговування вантажопідйомника (UDT); Транспортування компонентів зі складу у виробничий зал та назад; Прийом товару; Перевірка відповідності документам; Збір та сортування порожніх ящиків. Монтаж електричних приладів, проводів, гідравлічних систем; контроль якості.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З: Grabów, Łęczyca, Ozorków, Zgierz, Piotrków Trybunalski, Zduńska Wola, Łask, Pabianice, Koluszki, Brzeziny та з районів Łodź.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна", "Білорусь", "Молдова"],
      docs: ["UDT"],
      physical:
        "Для UDT — права IWJO I, WJO II + досвід retrak. Комунікативна польська мова.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "Адреси: Jędrzejowska/Lodowa/Papiernicza, Łódź.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 37 — ALUPLAST Nagradowice
  {
    agencyName: "MANPAWER",
    templateName:
      "ALUPLAST Nagradowice - Виробництво та складування віконних систем ПВХ",
    keywords: [
      "Aluplast",
      "Nagradowice",
      "Poznań",
      "вікна",
      "ПВХ",
      "aluplast",
      "Profilowa",
    ],
    title:
      "ALUPLAST Nagradowice: Виробництво та складування віконних систем ПВХ",
    location: "Nagradowice (Poznań)",
    country: "Польща",
    salary: {
      base: "Складальник: 5 025–5 260 zł брутто/міс. Молодший оператор: 5 740 zł брутто/міс + 860 zł премія",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні (складальник). +311 zł нічні (оператор). +50% надгодини будні. Доплата за вихідні.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "",
    },
    description:
      "Складальник: робота з віконними профілями до 8 м; завантаження та розвантаження; перевірка рівня запасів. Молодший оператор: упаковка профілів, планок та додатків; візуальний огляд (подряпини, складки, вага, довжина); контроль якості та кількості.",
    accommodation: {
      available: true,
      cost: "450 zł/місяць",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З Познані. Зупинки: Szymanowskiego, Aleje Solidarności, AWF, Uniwersytet Ekonomiczny, os. Jagiellońskie, os. Lecha 1, Szpitalna, Głogowska та ін.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Комунікативна польська мова. Для молодшого оператора — досвід при машинах мін. 1 рік.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "Адреса: Profilowa 1, Nagradowice. Є філіал в м. Poznań.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 38 — WKRĘT-MET Częstochowa
  {
    agencyName: "MANPAWER",
    templateName: "WKRĘT-MET Częstochowa - Виробництво кріпильної продукції",
    keywords: [
      "Wkręt-Met",
      "Częstochowa",
      "Wrzosowa",
      "кріплення",
      "гвинти",
      "wkręt-met",
    ],
    title:
      "WKRĘT-MET Częstochowa/Wrzosowa: Виробництво та пакування кріпильної продукції",
    location: "Częstochowa / Wrzosowa",
    country: "Польща",
    salary: {
      base: "30,50 zł брутто/год",
      student: "",
      monthly: "",
      bonus: "Доплата 330 zł брутто за відмову від житла.",
      notes: "",
    },
    schedule: {
      shifts:
        "2 зміни по 12 годин: 06:00–18:00, 18:00–06:00 (є також 8-годинний варіант)",
      hours: "",
      details: "",
    },
    description:
      "Проста мануальна робота; Обслуговування простих виробничих машин; Пакування готової продукції (гвинти, болти, дюбелі); Контроль якості продукції; Підготовка замовлень до відправки.",
    accommodation: {
      available: true,
      cost: "550 zł/місяць (м. Częstochowa)",
      details: "Доплата 330 zł за відмову від житла.",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З Częstochowa та Wrzosowa. Зупинки: Pętla Fieldorfa Nila, Al. Wyzwolenia/Baczyńskiego, Promenada Niemena, Hala Polonia та ін.",
    },
    requirements: {
      gender: "чоловіки",
      age: "до 55 років",
      nationalities: ["Україна", "Молдова"],
      docs: [],
      physical: "Робота не важка, мануальна, без вимоги досвіду.",
    },
    conditions: {
      temperature: "",
      workwear: "Надається роботодавцем.",
      food: "",
      notes: "",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },

  // 39 — FAURECIA Wałbrzych
  {
    agencyName: "MANPAWER",
    templateName:
      "FAURECIA Wałbrzych - Виробництво автомобільних сидінь (Frames та Recliners)",
    keywords: [
      "Faurecia",
      "Wałbrzych",
      "сидіння",
      "faurecia wałbrzych",
      "Forvia",
      "Jachimowicza",
    ],
    title: "FAURECIA Wałbrzych: Виробництво автомобільних сидінь",
    location: "Wałbrzych",
    country: "Польща",
    salary: {
      base: "4 666 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+100% вихідні та свята; +20% нічні; +50% надгодини (Пн–Пт); продукційна премія до 15%.",
      notes: "",
    },
    schedule: {
      shifts:
        "3 зміни по 8 год: Frames 06:00–14:00/14:00–22:00/22:00–06:00. Recliners: 07:00–15:00/15:00–23:00/23:00–07:00",
      hours: "",
      details: "Перерва 20–30 хв.",
    },
    description:
      "Frames: монтаж деталей до каркасів сидінь автомобілів; контроль якості та складання; обслуговування зварювальних столів; лакерування деталей. Recliners: монтаж деталей до механізмів регулювання сидінь; контроль якості; робота на виробничій лінії.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical: "Комунікативна польська мова. CV обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear: "Безкоштовний робочий одяг (Recliners).",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки. Recliners: безкоштовні супи, основні страви 6–8 zł.",
      notes: "Адреса: Wałbrzych, ul. Jachimowicza 3.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 40 — FAURECIA Legnica
  {
    agencyName: "MANPAWER",
    templateName: "FAURECIA Legnica - Виробництво автомобільних крісел",
    keywords: [
      "Faurecia",
      "Legnica",
      "автомобільні крісла",
      "faurecia legnica",
      "Gniewomierz",
    ],
    title: "FAURECIA Legnica: Виробництво автомобільних крісел",
    location: "Legnica",
    country: "Польща",
    salary: {
      base: "4 800 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+100% вихідні; +20% нічні; +50% надгодини (Пн–Пт); продуктивна премія 15%.",
      notes: "",
    },
    schedule: {
      shifts: "3 зміни по 8 год: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перерва 20–30 хв. ~40–80 надгодин на місяць.",
    },
    description:
      "Виробництво автомобільних крісел; Прості виробничі роботи на лінії.",
    accommodation: {
      available: true,
      cost: "40 zł/добу (хостел, самостійна домовленість)",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical:
        "Комунікативна польська мова. Досвід роботи на виробництві. CV обов'язково.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки.",
      notes: "Адреса: Legnica, Gniewomierz 180.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 41 — WEBER Zabrze
  {
    agencyName: "MANPAWER",
    templateName:
      "WEBER Zabrze - Виробництво газових, електричних та вугільних грилів",
    keywords: ["Weber", "Zabrze", "грилі", "weber", "Donnersmarcka"],
    title: "WEBER Zabrze: Виробництво газових, електричних та вугільних грилів",
    location: "Zabrze",
    country: "Польща",
    salary: {
      base: "5 300 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "+20% нічні; +10% премія; +38 zł прання. Дофінансування обідів. +50% надгодини будні, +100% вихідні.",
      notes: "Сезонна робота: вересень 2025 — квітень/травень 2026.",
    },
    schedule: {
      shifts: "3 зміни по 8 год: 06:00–14:00, 14:00–22:00, 22:00–06:00",
      hours: "",
      details: "Перерва 30 хв.",
    },
    description:
      "Пакування готових комплектуючих і аксесуарів гриля в картонну коробку; Ручне переміщення та підвішування елементів на конвеєрі; Візуальний контроль готових елементів; Дотримання правил охорони праці.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Міський транспорт або пішки.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна", "Білорусь", "Молдова"],
      docs: ["CV"],
      physical: "Польська мова рівень B1. Резюме польською обов'язково.",
    },
    conditions: {
      temperature: "тепло",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, солодощами, мікрохвильовки. Дофінансування обідів.",
      notes: "Адреса: Guido Henckela Donnersmarcka 19, 41-807 Zabrze.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 42 — PROSPEKTA Nysa
  {
    agencyName: "MANPAWER",
    templateName: "PROSPEKTA Nysa - Виробництво желейних цукерок",
    keywords: ["Prospekta", "Nysa", "желейні цукерки", "prospekta"],
    title: "PROSPEKTA Nysa: Виробництво желейних цукерок",
    location: "Nysa",
    country: "Польща",
    salary: {
      base: "30,50 zł/год брутто",
      student: "",
      monthly: "220 годин/місяць (мінімум 168 год)",
      bonus: "",
      notes: "Санепід обов'язково.",
    },
    schedule: {
      shifts: "4-бригадна система по 12 годин",
      hours: "220 год/місяць (мін. 168 год)",
      details: "Характерний солодкий запах у цеху. Температура +20–22°C.",
    },
    description:
      "Для жінок: збір готової продукції; пакування та перенесення коробок; укладання на стелажі. Для чоловіків: перенесення кошиків з желейними цукерками (10–15 кг); допомога у постачанні виробів до лінії.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "від 160 см зросту",
      nationalities: ["Україна"],
      docs: ["санепід"],
      physical:
        "Комунікативна польська мова. Санепід або готовність оформити. Відсутність штучних вій, нігтів, прикрас.",
    },
    conditions: {
      temperature: "+20–22°C",
      workwear: "Надається: взуття, фартух, шапочка, маска, рукавички.",
      food: "",
      notes: "Місто: Nysa.",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },

  // 43 — COLQUIMICA Plewiska
  {
    agencyName: "MANPAWER",
    templateName: "COLQUIMICA Plewiska - Виробництво промислових клеїв",
    keywords: [
      "Colquimica",
      "Plewiska",
      "клеї",
      "промислові",
      "colquimica",
      "Poznań",
      "Szkolna",
    ],
    title: "COLQUIMICA Plewiska: Виробництво промислових клеїв",
    location: "Plewiska (Poznań)",
    country: "Польща",
    salary: {
      base: "5 500–5 800 zł брутто/місяць",
      student: "",
      monthly: "",
      bonus:
        "Стартова премія 550 zł брутто/міс; +50 zł за кожен вихідний день. Карта Pluxee 350 zł/міс.",
      notes:
        "Англійська мова обов'язково. CV обов'язково. Працевлаштування напряму.",
    },
    schedule: {
      shifts:
        "4-бригадна система: 3 дні 07:00–19:00 / 3 вихідні / 3 дні 19:00–07:00 / 3 вихідні",
      hours: "",
      details: "Обід за 1 zł (дофінансування).",
    },
    description:
      "Обслуговування нескладних виробничих машин; Контроль якості готової продукції; Пакування продукції, передача на склад, підготовка до відправлення; Робота з внутрішніми комп'ютерними системами та виробничою звітністю; Перенесення вантажів до 20 кг.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "З Познані: Rondo Rataje → Poznań Główny → ul. Głogowska → Plewiska.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical:
        "Знання англійської мови (комунікативний рівень) — обов'язково. Готовність до 4-бригадного графіку по 12 годин. CV обов'язково.",
    },
    conditions: {
      temperature: "тепло, сучасне виробництво",
      workwear: "",
      food: "Їдальня: обід за 1 zł.",
      notes: "Адреса: ul. Szkolna 30, 62-064 Plewiska.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 44 — PESA Bydgoszcz
  {
    agencyName: "MANPAWER",
    templateName:
      "PESA Bydgoszcz - Зварювальник/Слюсар (виробництво поїздів та трамваїв)",
    keywords: [
      "PESA",
      "Bydgoszcz",
      "зварювальник",
      "слюсар",
      "pesa",
      "Zygmunta Augusta",
      "трамваї",
    ],
    title:
      "PESA Bydgoszcz: Зварювальник/Слюсар (виробництво поїздів та трамваїв)",
    location: "Bydgoszcz",
    country: "Польща",
    salary: {
      base: "Зварювальник-слюсар: 33–40 zł/год брутто + 500–900 zł брутто премія. Слюсар: 30–36 zł/год брутто + 400–700 zł брутто премія",
      student: "",
      monthly: "",
      bonus:
        "+50% надгодини будні, +100% вихідні. +20% нічні (коли впроваджують).",
      notes: "",
    },
    schedule: {
      shifts: "2 зміни по 8 год (Пн–Пт): 06:00–14:00, 14:00–22:00",
      hours: "",
      details: "При великих замовленнях можлива нічна зміна — тимчасово.",
    },
    description:
      "Зварювальник-слюсар: MAG-зварювання модулів та конструкцій; складання зварних елементів у конструкціях. Слюсар: складання та виготовлення конструкційних модулів за технічною документацією; шліфування зварних швів; обрізання кромок; очищення від бризок; підготовка до зварювання.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "Підприємство майже в центрі міста.",
    },
    requirements: {
      gender: "чоловіки",
      age: "",
      nationalities: ["Україна"],
      docs: ["CV"],
      physical: "Комунікативна польська мова. CV обов'язково.",
    },
    conditions: {
      temperature: "",
      workwear: "Високоякісний робочий одяг та захисне спорядження.",
      food: "",
      notes: "Адреса: Zygmunta Augusta 11, 85-082 Bydgoszcz.",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 45 — HUBER+SUHNER Nawojowa Góra
  {
    agencyName: "MANPAWER",
    templateName:
      "HUBER+SUHNER Nawojowa Góra - Монтаж елементів оптичних перемикачів",
    keywords: [
      "Huber+Suhner",
      "Nawojowa Góra",
      "Pisary",
      "Chrzanów",
      "оптичні перемикачі",
      "Trzebinia",
    ],
    title:
      "HUBER+SUHNER Nawojowa Góra/Pisary: Монтаж елементів оптичних перемикачів",
    location: "Nawojowa Góra / Pisary (поблизу Chrzanów)",
    country: "Польща",
    salary: {
      base: "Повна зайнятість (2 зміни): 4 950 zł брутто/міс + 10% за другу зміну. Нічні: 4 950 zł + 40% за нічні. Вихідні: 35,35–42,42 zł/год брутто",
      student: "",
      monthly: "",
      bonus: "Квартальна премія ~300 zł брутто (за відвідуваність).",
      notes: "Гнучкий вибір графіку.",
    },
    schedule: {
      shifts:
        "На вибір: 1) 2 зміни (Пн–Пт): 06:00–14:00, 14:00–22:00. 2) Тільки нічні (Нд–Пт): 22:00–06:00. 3) Тільки вихідні: Сб–Нд 06:00–14:00 або 14:00–22:00",
      hours: "",
      details:
        "Перерви: 2×15 хв. Переважно сидяча робота. Хороший зір — обов'язково.",
    },
    description:
      "Монтаж елементів оптичних перемикачів за інструкцією; Робота з паяльником; Внесення даних у виробничу систему; Контроль якості готової продукції.",
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },
    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "З Trzebinia та Chrzanów.",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Комунікативна польська мова — обов'язково. Хороший зір (робота з дрібними елементами).",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "2 локації: Nawojowa Góra та Pisary (~1,5–2 км між ними).",
    },
    contractType: "Umowa o pracę",
    additionalNotes: "",
  },

  // 46 — EUROCOMFORT Leszno (з файла, шаблон 14)
  {
    agencyName: "MANPAWER",
    templateName:
      "EUROCOMFORT Leszno - Виробництво матраців, подушок та ковдр (IKEA)",
    keywords: [
      "Eurocomfort",
      "Euroline",
      "Leszno",
      "Лєшно",
      "матраци",
      "IKEA",
      "eurocomfort",
      "Spółdzielcza",
    ],
    title: "EUROCOMFORT Leszno: Виробництво матраців, подушок та ковдр (IKEA)",
    location: "Leszno",
    country: "Польща",
    salary: {
      base: "Виробництво: 30,50–35 zł брутто/год. Склад/розвантаження: 32–35 zł брутто/год. Швачка: 32 zł брутто/год. Склад: 30,50 zł брутто/год",
      student: "",
      monthly: "",
      bonus: "Премія за ефективність 200–500 zł брутто/місяць.",
      notes: "",
    },
    schedule: {
      shifts: "2 зміни по 12 годин (Пн–Пт): 06:00–18:00, 18:00–06:00",
      hours: "",
      details: "Перерви: 2×20 хв.",
    },
    description:
      "Виробництво матраців: з'єднання та склеювання елементів; одягання матраців у чохли; прості операції стьобання; контроль якості; пакування. Склад/розвантаження (OWW): приймання та розвантаження товарів; робота на навантажувачі. Швачка: пошиття ковдр методом відстрочки та обробки країв; стьобання та окантування виробів. Склад: сканування товару; розміщення продукції на складі.",
    accommodation: {
      available: true,
      cost: "500 zł/місяць",
      details: "",
      deposit: "",
    },
    transport: {
      provided: false,
      cost: "за власний рахунок",
      details: "",
    },
    requirements: {
      gender: "чоловіки, жінки",
      age: "",
      nationalities: ["Україна"],
      docs: [],
      physical:
        "Польська, українська, російська, англійська або іспанська — добре говорити хоча б однією. Для швачки: досвід стьобання або окантовки. Для OWW: UDT II категорії.",
    },
    conditions: {
      temperature: "",
      workwear: "",
      food: "Їдальня: автомати з кавою, чаєм, снеками, мікрохвильовки.",
      notes: "Адреса: Leszno, ul. Spółdzielcza 49 (вхід P3).",
    },
    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },
];

module.exports = manpawerTemplates;
