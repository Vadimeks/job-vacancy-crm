// backend/data/templates/progres.js
const progresTemplates = [
  {
    agencyName: "PROGRES",
    templateName: "LPP Pruszcz Gdański - Склад нового одягу",
    keywords: ["LPP", "Pruszcz Gdański", "Гданськ", "одяг", "e-commerce"],

    title: "LPP Pruszcz Gdański: Склад нового одягу",
    location: "Pruszcz Gdański",
    country: "Польща",

    salary: {
      base: "31,40 zł брутто/год",
      student: "31,40 zł нетто/год",
      monthly: "",
      bonus: "Премії 100–1000 zł; бонус -25% у крамах LPP",
      notes: "25,36 zł нетто з PIT-2; 22,36 zł без PIT-2.",
    },

    schedule: {
      shifts: "2 змены па 12 годин",
      hours: "5–6 дзён на тыдзень",
      details: "06:00–18:00, 18:00–04:00/06:00",
    },

    description:
      "Зняцце кліпсаў; камплектацыя заказаў са сканерам; пакоўка інтернет-заказаў; сканаванне штрых-кодаў.",

    accommodation: {
      available: true,
      cost: "500 zł/місяць",
      details: "Жытло 1–2 км ад складу, 2–4 чалавекі ў пакоі, інтэрнэт.",
      deposit: "",
    },

    transport: {
      provided: true,
      cost: "130 zł/місяць",
      details: "Аўтобус ад працадаўцы.",
    },

    requirements: {
      gender: "жінкі, мужчыны, пары",
      age: "18–55 гадоў",
      nationalities: ["Україна", "Молдова", "Білорусь"],
      docs: [],
      physical: "Без спецыяльных патрабаванняў.",
    },

    conditions: {
      temperature: "Нармальныя ўмовы",
      workwear: "Жылетка выдаецца, штаны і абутак свае",
      food: "",
      notes: "Umowa zlecenie",
    },

    contractType: "Umowa zlecenie",
    additionalNotes: "",
  },
];
module.exports = progresTemplates;
