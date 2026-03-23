// backend/data/templates/vekos.js
const vekosTemplates = [
  {
    agencyName: "VEKOS",
    templateName: "HELIO Sochaczew - Упаковка готової продукції",
    keywords: [
      "HELIO",
      "Sochaczew",
      "Сохачэў",
      "упаковка",
      "сухофрукти",
      "горішки",
    ],

    title: "HELIO Sochaczew: Упаковка готової продукції",
    location: "Sochaczew",
    country: "Польща",

    salary: {
      base: "24,63 zł нетто/год",
      student: "30,50 zł нетто/год (студэнты да 26 гадоў)",
      monthly: "",
      bonus: "+2 zł нетто на працэсе леї (засыпанне сыравіны ў машыны)",
      notes: "",
    },

    schedule: {
      shifts: "2 змены: 06:00–18:00, 18:00–06:00",
      hours: "5–6 дзён на тыдзень",
      details: "Выходны па ўзгадненні з каардынатарам.",
    },

    description:
      "Упаковка сухафруктаў і арэхаў; зборка картонных упаковак; наклейванне стыкераў; кантроль якасці; праца на працэсе леї (засыпанне сыравіны ў машыны).",

    accommodation: {
      available: true,
      cost: "600 zł/місяць (утрымліваецца з зарплаты)",
      details: "Жытло з усімі ўмовамі: інтэрнэт, душ, кухня, пральная машына.",
      deposit: "",
    },

    transport: {
      provided: false,
      cost: "",
      details: "",
    },

    requirements: {
      gender: "жінкі і мужчыны",
      age: "да 50 гадоў",
      nationalities: ["Україна", "Молдова", "Білорусь"],
      docs: ["санепід"],
      physical:
        "Добрая фізічная форма; забаронены манікюр, накладныя вейкі і ўпрыгожанні.",
    },

    conditions: {
      temperature: "20°C у цэху",
      workwear: "Халат, шапочка, абутак — бясплатна",
      food: "Ёсць сталовая з чайнікам і халадзільнікам",
      notes: "Кошт санітарнай кніжкі 200 zł утрымліваецца з першай зарплаты.",
    },

    contractType: "Umowa zlecenie",

    additionalNotes: "Кампенсацыя за сваё жыллё — 300 zł.",
  },
];
module.exports = vekosTemplates;
