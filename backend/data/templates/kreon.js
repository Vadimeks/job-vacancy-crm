// backend/data/templates/kreon.js
const kreonTemplates = [
  {
    agencyName: "KREON",
    templateName: "STADLER Siedlce - Виробництво вагонів та потягів",
    keywords: ["Stadler", "Siedlce", "Седльце", "монтаж", "вагони", "поїзди"],

    title: "STADLER Siedlce: Монтаж вагонів та потягів",
    location: "Siedlce",
    country: "Польща",

    salary: {
      base: "28–35 zł нетто/год залежно від досвіду",
      student: "33–40 zł нетто/год (студенти до 26 років)",
      monthly: "",
      bonus: "",
      notes: "Ставка залежыць ад спецыялізацыі: механіка, электрыка, клеяж.",
    },

    schedule: {
      shifts: "2 зміни: 05:45–14:00, 14:00–22:15",
      hours: "8–10 годин/день",
      details: "Пн–Пт, суботы за жаданнем, нядзеля выходны.",
    },

    description:
      "Механічны мантаж; электрамантаж; клеяж; падрыхтоўка паверхняў да фарбавання; праца з інструментамі; кантроль якасці.",

    accommodation: {
      available: true,
      cost: "600 zł/місяць",
      details: "Жытло побач з заводам.",
      deposit: "",
    },

    transport: {
      provided: false,
      cost: "",
      details: "",
    },

    requirements: {
      gender: "жінкі і мужчыны",
      age: "20–55 гадоў",
      nationalities: ["Україна", "Молдова", "Білорусь"],
      docs: ["CV"],
      physical: "Досвід у мантажы, праца з інструментамі, польская мова A2–B1.",
    },

    conditions: {
      temperature: "Нармальныя ўмовы, магчыма пыл/запах фарбы",
      workwear: "Робочая форма выдаецца",
      food: "",
      notes: "Umowa zlecenie, медагляд 200 zł (вяртаецца пасля 3 мес.).",
    },

    contractType: "Umowa zlecenie",
    additionalNotes: "Аванс пасля 1 тыдня, зарплата 20–25 чысла.",
  },
];
module.exports = kreonTemplates;
