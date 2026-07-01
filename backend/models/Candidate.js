const mongoose = require("mongoose");

// Сінхранізуем сферы з катэгорыямі з шаблона вакансіі
const SPHERES = [
  "Склади та логістика",
  "Харчова промисловість",
  "Автомобільна промисловість",
  "Виробництво та промисловість",
  "Будівництво",
  "Сільське господарство",
  "Торгівля та послуги",
  "Різне",
];

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactType: {
      type: String,
      enum: ["telegram", "viber", "phone"],
      required: true,
    },
    telegram: String,
    phone: String,
    nationality: { type: String, default: "Україна" },
    currentLocation: String, // Горад, дзе зараз знаходзіцца
    age: Number,
    // Пашыраем гендэр для адпаведнасці шаблону (для пар)
    gender: { type: String, enum: ["Чоловіки", "Жінки", "Пари", "Сім'ї"] },

    // Мовы з узроўнямі для дакладнага матчынгу з вакансіяй
    languages: [
      {
        name: { type: String, default: "Польська" },
        level: { type: String, default: "Не вимагається" }, // "Не вимагається", "A2", "B1" і г.д.
      },
    ],
    // Дадаць перад jobPreferences:
    qualifications: {
      manualSkills: { type: Boolean, default: false }, // Ці гатовы да тэстаў на спрыт
      physicalEndurance: { type: Boolean, default: false }, // Ці гатовы да 15-20 км/змену
      healthRestrictions: {
        eyeSight: { type: String, default: "Normal" }, // Зрок (напр. "Окуляри - OK")
        allergies: [String], // Алергіі на пахі, спецыі і г.д.
        temperatureTolerance: [String], // "Холод", "Спека"
      },
      hasDrivingLicense: { type: Boolean, default: false },
      udtCategories: [String], // Катэгорыі навантажувачаў (напр. "WJO II")
    },
    jobPreferences: {
      location: { type: [String], default: [] }, // 👈 ЗМЕНА: масіў рэгіёнаў/ваяводстваў (было: String)
      locationFlexible: { type: Boolean, default: false },
      locationRadius: { type: Boolean, default: false },
      spheres: [{ type: String }], // Будзе захоўваць назвы катэгорый з вакансій
      schedule: [String],
      scheduleTypes: [String],
      wantsOvertime: { type: Boolean, default: true },
      contractType: { type: String, default: "any" }, // "Umowa zlecenie", "Umowa o pracę", "any"
      needsAccommodation: { type: Boolean, default: true },
      travelGroup: {
        type: String,
        enum: ["alone", "couple", "family"],
        default: "alone",
      },
      readyDate: String,
      notes: String,
    },

    documents: {
      // 1. Зручныя Boolean палі для хуткіх "галачак" у форме
      hasPeselUkr: { type: Boolean, default: false },
      hasVisa: { type: Boolean, default: false },
      hasKartaPobytu: { type: Boolean, default: false },
      hasSanepid: { type: Boolean, default: false },
      hasUDT: { type: Boolean, default: false },
      residencyCertificate: { type: Boolean, default: false }, // Даведка рэзідэнта

      // 2. Масіў тэгаў для СІНКХРАНІЗАЦЫІ з Vacancy.requirements.standardDocs
      // Сюды аўтаматычна (праз middleware) або ўручную будуць дублявацца назвы:
      // ["PESEL UKR", "Віза", "Книжка санепід", "UDT"]
      activeDocs: { type: [String], default: [] },

      // 3. Тэрміны і файлы
      visaExpiry: { type: Date },
      other: [String], // Любыя іншыя заўвагі па дакументах
      files: [String], // Спасылкі на фота/сканы
    },

    status: {
      type: String,
      enum: ["new", "active", "waiting", "employed", "left", "blacklist"],
      default: "new",
    },
    blacklistReason: String,

    // Гісторыя водгукаў
    appliedVacancies: [
      {
        vacancyId: { type: mongoose.Schema.Types.ObjectId, ref: "Vacancy" },
        appliedAt: { type: Date, default: Date.now },
        type: { type: String, enum: ["want_work", "want_info"] },
      },
    ],

    currentVacancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vacancy",
      default: null,
    },

    notes: String,
    history: [
      {
        date: { type: Date, default: Date.now },
        type: String,
        text: String,
      },
    ],

    source: {
      type: String,
      enum: ["site", "telegram_bot", "manual", "referral"],
      default: "manual",
    },

    // 👇 ДАДАНА: палі для Telegram-бота кандыдатаў
    telegramId: { type: String, default: null },   // Унікальны ID карыстальніка ў Telegram
    chatId: { type: String, default: null },        // ID чата для адпраўкі паведамленняў (String, не Number — JS не цягне вялікія int)
    subscribedToVacancies: { type: Boolean, default: false }, // Галачка "атрымліваць падыходзячыя вакансіі"
    additionalNotesTags: { type: [String], default: [] },     // Тэгі, здабытыя AI з вольнага тэксту кандыдата
  },
  { timestamps: true },
);
// 👇 ДАДАНА: індэксы для хуткага пошуку па Telegram
candidateSchema.index({ telegramId: 1 }, { unique: true, sparse: true }); // sparse — дазваляе null, але забяспечвае унікальнасць для bot-кандыдатаў
candidateSchema.index({ chatId: 1 });
module.exports = mongoose.model("Candidate", candidateSchema);
