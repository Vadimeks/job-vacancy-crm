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
    // 1. У пачатак схемы (пасля name) дадай:
    candidateCode: { type: String, unique: true, sparse: true },
    isDuplicate: { type: Boolean, default: false },
    linkedDuplicateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", default: null },
    duplicateFields: [String], 

// 2. Знайдзі блок history і замяні яго (дадаем ролю: bot/user/system):
    history: [
      {
        date: { type: Date, default: Date.now },
        type: { type: String, default: "note" }, // note, chat_question, chat_answer
        role: { type: String, enum: ["bot", "user", "system", "recruiter"], default: "user" },
        text: String,
      },
    ],
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

   // 👈 ВЫДАЛЕНА: каранёвы блок languages[] — замененны на jobPreferences.polishLanguageLevel (адно значэнне, ідэнтычна Vacancy.requirements.polishLanguageLevel)
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
      voivodeship: { type: [String], default: [] }, // 👈 ЗМЕНЕНА: было "location" — перайменавана для ідэнтычнасці з Vacancy.voivodeship
      locationFlexible: { type: Boolean, default: false }, // без змен
      locationNotes: { type: String, default: "" }, // 👈 НОВАЕ: вольны тэкст для дадатковага AI-матчынгу па лакацыі
      // 👈 ВЫДАЛЕНА: locationRadius (мёртвае поле, не выкарыстоўвалася)
      spheres: [{ type: String }], // без змен — Будзе захоўваць назвы катэгорый з вакансій
      // 👈 ВЫДАЛЕНА: schedule (замененa на hoursRange ніжэй)
      // 👈 ВЫДАЛЕНА: scheduleTypes (мёртвае поле, не выкарыстоўвалася)
      // 👈 ВЫДАЛЕНА: wantsOvertime (не мае аналага ў вакансіях, выдалена паводле дамоўленасці)
      contractType: { type: String, default: "any" }, // без змен
      accommodation: { // 👈 НОВАЕ: структураваны аб'ект замест needsAccommodation, сіметрычны Vacancy.accommodation
        needed: { type: Boolean, default: true },
        forCouples: { type: Boolean, default: false },
        withChildren: { type: Boolean, default: false },
        freeOnly: { type: Boolean, default: false }, // патрэбна менавіта бясплатнае жытло
      },
      // 👈 ВЫДАЛЕНА: travelGroup (enum alone/couple/family) — замененa на gender-логіку ў matching.service.js
      transport: { // 👈 НОВАЕ: сіметрычна Vacancy.transport, толькі сцяг "патрэбен давоз"
        needed: { type: Boolean, default: false },
      },
      polishLanguageLevel: { type: String, default: "Не вимагається" }, // 👈 НОВАЕ: замест каранёвага languages[], ідэнтычна Vacancy.requirements.polishLanguageLevel
      onlyDayShifts: { type: Boolean, default: false }, // 👈 НОВАЕ: сіметрычна Vacancy.schedule.onlyDayShifts
      hoursRange: { type: [String], default: [] }, // 👈 НОВАЕ: замена schedule, значэнні MD.HOURS_RANGE_OPTIONS (low/mid/high/unknown)
      nuances: { type: [String], default: [] }, // 👈 НОВАЕ: выбраныя нюансы з фіксаванага спісу (MD.CHECKLIST_ITEMS)
      nuancesNotes: { type: String, default: "" }, // 👈 НОВАЕ: вольны тэкст для дадатковых нюансаў, якіх няма ў спісе
      readyDate: { type: Date, default: null }, // 👈 ЗМЕНЕНА: было String — цяпер Date (date-picker на фронце)
      readyDateNotes: { type: String, default: "" }, // 👈 НОВАЕ: удакладненне па даце гатоўнасці
      notes: { type: String, default: "" }, // без змен
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
    

    source: {
      type: String,
      enum: ["site", "telegram_bot", "trello", "manual", "other"], // 👈 ВЫПРАЎЛЕНА: выдалены referral, дададзены trello і other
      default: "manual",
    },

    // 👇 ДАДАНА: палі для Telegram-бота кандыдатаў
    telegramId: { type: String, default: null },   // Унікальны ID карыстальніка ў Telegram
    chatId: { type: String, default: null },        // ID чата для адпраўкі паведамленняў (String, не Number — JS не цягне вялікія int)
    subscribedToVacancies: { type: Boolean, default: false }, // Галачка "атрымліваць падыходзячыя вакансіі"
    additionalNotesTags: { type: [String], default: [] },     // Тэгі, здабытыя AI з вольнага тэксту кандыдата
    // 👈 ДАДАДЗЕНА: Гісторыя змен профілю (v7.4)
    profileHistory: [
      {
        updatedAt: { type: Date, default: Date.now },
        jobPreferences: Object, // Копія пажаданняў да змены
        source: { type: String, enum: ["user", "recruiter", "auto"], default: "user" }
      }
    ],
  },
  
  { timestamps: true },
);
// 👇 ДАДАНА: індэксы для хуткага пошуку па Telegram
candidateSchema.index({ telegramId: 1 }, { unique: true, sparse: true }); // sparse — дазваляе null, але забяспечвае унікальнасць для bot-кандыдатаў
candidateSchema.index({ chatId: 1 });
module.exports = mongoose.model("Candidate", candidateSchema);
