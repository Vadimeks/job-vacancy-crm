// backend/data/templates/folga-milanowek.js
const folgaTemplates = [
  {
    agencyName: "FOLGA",
    templateName: "MILANÓWEK Grodzisk - Пакування солодощів",
    keywords: [
      "FOLGA",
      "Milanówek",
      "Гродзіск",
      "пакування",
      "кондитерське виробництво",
      "солодощі",
    ],

    title: "MILANÓWEK Grodzisk: Пакування солодощів",
    location: "Grodzisk Mazowiecki",
    country: "Польща",

    salary: {
      base: "30,50 zł брутто/год (24,63 zł нетто до 30 000 zł доходу)",
      student: "30,50 zł нетто/год (студенти до 26 років)",
      monthly: "Середня ЗП ~5100 zł брутто/місяць",
      bonus:
        "Доплата 1–3 zł нетто за роботу з машинами; премії Medicover Sport",
      notes:
        "Після 30 000 zł доходу ставка 22,03 zł нетто. Аванси через Flexee.",
    },

    schedule: {
      shifts:
        "3 зміни по 8–12 годин або система 4 бригад (4 робочі / 1 вихідний)",
      hours: "Середньо 170 годин/місяць",
      details: "Перерва 15 хв оплачувана; графік визначається підприємством.",
    },

    description:
      "Фасування цукерок; упаковка до 10–15 кг; розміщення товару на палетах; контроль якості; обмотування палет стретч-плівкою; чоловіки іноді працюють на підготовці сумішей.",

    accommodation: {
      available: true,
      cost: "100 zł/місяць (утримується із зарплати)",
      details: "Кімнати по 2–4 особи, окремо для пар. Wi-Fi, постіль, кухня.",
      deposit: "",
    },

    transport: {
      provided: false,
      cost: "пішки (до 2,5 км)",
      details: "Житло поруч із роботою; для пар — 20 хв їзди.",
    },

    requirements: {
      gender: "жінки та чоловіки",
      age: "до 55 років",
      nationalities: ["Україна", "Молдова", "Білорусь"],
      docs: ["санепід"],
      physical: "Хороша фізична форма; уважність; дотримання санітарних норм.",
    },

    conditions: {
      temperature: "+20–24°C",
      workwear:
        "Роботодавець надає безкоштовно (шапка, фартух, футболка, штани, взуття, рукавички).",
      food: "Їдальня, автомати з перекусами.",
      notes: "Адреса: ul. J. Słowackiego 25, 05-825 Grodzisk Mazowiecki.",
    },

    contractType: "Umowa zlecenie",

    additionalNotes:
      "Санітарна книжка: 420 zł (або 220 zł при наявності власної). Легалізація після 2 місяців роботи. Аванси через Flexee.",
  },
];
module.exports = folgaTemplates;
