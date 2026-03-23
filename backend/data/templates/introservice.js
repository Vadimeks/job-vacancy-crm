const introserviceTemplates = [
  {
    // ── ІДЕНТИФІКАЦІЯ ──────────────────────────────────────────
    agencyName: "INTROSERVICE",
    templateName: "INTROSERVICE-empty",

    keywords: [],

    // ── ОСНОВНЕ ────────────────────────────────────────────────
    title: "",
    location: "",
    country: "",

    // ── ОПЛАТА ─────────────────────────────────────────────────
    salary: {
      base: "",
      student: "",
      monthly: "",
      bonus: "",
      notes: "",
    },

    // ── ГРАФІК ─────────────────────────────────────────────────
    schedule: {
      shifts: "",
      hours: "",
      details: "",
    },

    // ── ОПИС РОБОТИ ────────────────────────────────────────────
    description: "",

    // ── ПРОЖИВАННЯ ─────────────────────────────────────────────
    accommodation: {
      available: false,
      cost: "",
      details: "",
      deposit: "",
    },

    // ── ТРАНСПОРТ ──────────────────────────────────────────────
    transport: {
      provided: false,
      cost: "",
      details: "",
    },

    // ── ВИМОГИ ─────────────────────────────────────────────────
    requirements: {
      gender: "",
      age: "",
      nationalities: [],
      docs: [],
      physical: "",
    },

    // ── УМОВИ ПРАЦІ ────────────────────────────────────────────
    conditions: {
      temperature: "",
      workwear: "",
      food: "",
      notes: "",
    },

    // ── ДОГОВІР ────────────────────────────────────────────────
    contractType: "",

    // ── ДОДАТКОВА ІНФОРМАЦІЯ ───────────────────────────────────
    additionalNotes: "",
  },
];
module.exports = introserviceTemplates;
