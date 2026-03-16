// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { Telegraf } = require("telegraf");
const aiService = require("./services/ai.service");

const Vacancy = require("./models/Vacancy");
const Template = require("./models/Template");
const Candidate = require("./models/Candidate");
const swaggerDefinition = require("./swaggerConfig");

const app = express();
app.use(cors());
app.use(express.json());

// --- НАЛАДА TELEGRAM БОТА ---
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const RECRUITER_CHAT_ID = process.env.RECRUITER_CHAT_ID; // асабісты чат рэкрутэра

const AGENCY_CHAT_IDS = process.env.AGENCY_CHAT_IDS
  ? process.env.AGENCY_CHAT_IDS.split(",").map((id) => id.trim())
  : [];

// --- ГЕНЕРАЦЫЯ НУМАРА ВАКАНСІІ ---
async function generateVacancyCode() {
  const count = await Vacancy.countDocuments();
  const num = String(count + 1).padStart(4, "0");
  return `VAC-${num}`;
}

// --- ФУНКЦЫЯ АДПРАЎКІ Ў TELEGRAM ---
const sendToTelegram = async (postText) => {
  try {
    await bot.telegram.sendMessage(CHANNEL_ID, postText, {
      parse_mode: "Markdown",
    });
    console.log("✅ Вакансія адпраўлена ў Telegram-канал");
  } catch (err) {
    console.warn("⚠️ Markdown памылка, адпраўляем як plain text...");
    try {
      await bot.telegram.sendMessage(CHANNEL_ID, postText);
      console.log("✅ Адпраўлена як plain text");
    } catch (err2) {
      console.error("❌ Памылка адпраўкі ў Telegram:", err2.message);
    }
  }
};

// --- ФУНКЦЫЯ АПАВЯШЧЭННЯ РЭКРУТЭРА ---
const notifyRecruiter = async (text) => {
  if (!RECRUITER_CHAT_ID) return;
  try {
    await bot.telegram.sendMessage(RECRUITER_CHAT_ID, text, {
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error("❌ Памылка апавяшчэння рэкрутэра:", err.message);
  }
};

// --- МАТЧЫНГ КАНДЫДАТАЎ ДЛЯ ВАКАНСІІ ---
const matchCandidatesForVacancy = async (vacancy) => {
  try {
    console.log(`🔍 Матчынг кандыдатаў для вакансіі ${vacancy.vacancyCode}...`);

    // Бярэм толькі кандыдатаў у статусе waiting
    const waitingCandidates = await Candidate.find({ status: "waiting" });

    if (waitingCandidates.length === 0) {
      console.log("ℹ️ Няма кандыдатаў у статусе waiting");
      return;
    }

    const matched = [];

    for (const candidate of waitingCandidates) {
      const prefs = candidate.jobPreferences;
      let score = 0;

      // Праверка гендару
      if (vacancy.requirements?.gender && candidate.gender) {
        const vacGender = vacancy.requirements.gender.toLowerCase();
        const candGender = candidate.gender === "female" ? "жінки" : "чоловіки";
        if (vacGender.includes(candGender) || vacGender.includes("будь-який")) {
          score += 3;
        } else {
          continue; // Гендар не супадае — прапускаем
        }
      }

      // Праверка лакацыі
      if (prefs?.locationFlexible) {
        score += 2;
      } else if (prefs?.location && vacancy.location) {
        if (
          vacancy.location
            .toLowerCase()
            .includes(prefs.location.toLowerCase()) ||
          prefs.location.toLowerCase().includes(vacancy.location.toLowerCase())
        ) {
          score += 2;
        }
      }

      // Праверка жытла
      if (prefs?.needsAccommodation && vacancy.accommodation?.available) {
        score += 1;
      }

      // Праверка графіка
      if (prefs?.schedule?.length > 0 && vacancy.schedule?.shifts) {
        const shifts = vacancy.schedule.shifts;
        if (
          (shifts.includes("1") && prefs.schedule.includes("1_shift")) ||
          (shifts.includes("2") && prefs.schedule.includes("2_shifts")) ||
          (shifts.includes("3") && prefs.schedule.includes("3_shifts"))
        ) {
          score += 1;
        }
      }

      if (score >= 3) {
        matched.push({ candidate, score });
      }
    }

    if (matched.length === 0) {
      console.log("ℹ️ Падыходзячых кандыдатаў не знойдзена");
      return;
    }

    // Сартуем па score
    matched.sort((a, b) => b.score - a.score);

    console.log(`✅ Знойдзена ${matched.length} падыходзячых кандыдатаў`);

    // Фармуем паведамленне для рэкрутэра
    let recruiterMsg = `🎯 *Новая вакансія ${vacancy.vacancyCode} — знойдзены кандыдаты!*\n\n`;
    recruiterMsg += `📋 *${vacancy.title}* (${vacancy.location})\n\n`;
    recruiterMsg += `👥 *Падыходзячыя кандыдаты (${matched.length}):*\n`;

    for (const { candidate, score } of matched) {
      recruiterMsg += `\n• *${candidate.name}* (${candidate.nationality || "—"}, ${candidate.currentLocation || "—"})`;
      recruiterMsg += `\n  📞 ${candidate.contactType}: ${candidate.telegram || candidate.phone || "—"}`;
      recruiterMsg += `\n  ⭐ Супадзенне: ${score} балаў\n`;
    }

    await notifyRecruiter(recruiterMsg);
  } catch (err) {
    console.error("❌ Памылка матчынгу:", err.message);
  }
};

// --- АСНОЎНАЯ ФУНКЦЫЯ АПРАЦОЎКІ ПАВЕДАМЛЕННЯ ---
const processVacancyMessage = async (rawText) => {
  const templates = await Template.find();

  if (templates.length === 0) {
    console.warn("⚠️ Шаблоны не знойдзены ў базе");
  }

  const template = await aiService.identifyTemplate(rawText, templates);

  let vacancyData;

  if (template) {
    vacancyData = await aiService.mergeWithTemplate(rawText, template);
    vacancyData.agencyName = template.agencyName;
    vacancyData.templateId = template._id;
  } else {
    console.log("⚠️ Шаблон не знойдзены, выкарыстоўваем fallback парсінг...");
    vacancyData = await aiService.parseVacancyWithAI(rawText);
  }

  const postText = await aiService.formatTelegramPost(vacancyData);
  const vacancyCode = await generateVacancyCode();

  const newVacancy = new Vacancy({
    vacancyCode,
    title: vacancyData.title || "Новая вакансія",
    agencyName: vacancyData.agencyName || "Manual",
    location: vacancyData.location || "Не вызначана",
    salary: vacancyData.salary || {},
    schedule: vacancyData.schedule || {},
    description: vacancyData.description || "",
    accommodation: vacancyData.accommodation || {},
    transport: vacancyData.transport || {},
    requirements: vacancyData.requirements || {},
    rawText: rawText,
    telegramPost: postText,
    status: "active",
  });

  const savedVacancy = await newVacancy.save();

  // Адпраўляем у канал
  await sendToTelegram(postText);

  // Запускаем матчынг аўтаматычна
  await matchCandidatesForVacancy(savedVacancy);

  return savedVacancy;
};

// --- БОТ: СЛУХАННЕ ЧАТАЎ АГЕНЦЫЙ ---
bot.on("message", async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const text = ctx.message.text;

  if (!AGENCY_CHAT_IDS.includes(chatId)) return;
  if (!text || text.length < 10) return;

  console.log(
    `📨 Новае паведамленне з чата агенцыі [${chatId}]: ${text.substring(0, 50)}...`,
  );

  try {
    await processVacancyMessage(text);
  } catch (err) {
    if (err.message === "RATE_LIMIT") {
      console.error("⏱️ Rate limit Gemini. Паўтарыце пазней.");
    } else {
      console.error("❌ Памылка апрацоўкі паведамлення:", err.message);
    }
  }
});

// --- SWAGGER ---
const specs = swaggerJsdoc({ swaggerDefinition, apis: [] });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// --- ПАДКЛЮЧЭННЕ ДА MONGODB ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Падключана да MongoDB Atlas!"))
  .catch((err) => console.error("❌ Памылка падключэння:", err));

// --- МАРШРУТЫ ВАКАНСІЙ ---

app.post("/api/vacancies/auto", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ message: "Тэкст пусты" });
    const savedVacancy = await processVacancyMessage(rawText);
    res.status(201).json(savedVacancy);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/vacancies", async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/vacancies", async (req, res) => {
  try {
    const vacancyCode = await generateVacancyCode();
    const newVacancy = new Vacancy({ ...req.body, vacancyCode });
    const savedVacancy = await newVacancy.save();
    const postText = await aiService.formatTelegramPost(savedVacancy);
    await sendToTelegram(postText);
    await matchCandidatesForVacancy(savedVacancy);
    res.status(201).json(savedVacancy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/vacancies/:id", async (req, res) => {
  try {
    const updated = await Vacancy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/vacancies/:id", async (req, res) => {
  try {
    await Vacancy.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Вакансія выдалена" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- МАРШРУТЫ ШАБЛОНАЎ ---

app.get("/api/templates", async (req, res) => {
  try {
    const templates = await Template.find().sort({ agencyName: 1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/templates", async (req, res) => {
  try {
    const newTemplate = new Template(req.body);
    const savedTemplate = await newTemplate.save();
    res.status(201).json(savedTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/templates/:id", async (req, res) => {
  try {
    const updated = await Template.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/templates/:id", async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Шаблон выдалены" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- МАРШРУТЫ КАНДЫДАТАЎ ---

// Атрымаць усіх кандыдатаў (з фільтрам па статусу)
app.get("/api/candidates", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.gender) filter.gender = req.query.gender;
    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Атрымаць аднаго кандыдата
app.get("/api/candidates/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate("appliedVacancies.vacancyId")
      .populate("currentVacancy");
    if (!candidate) return res.status(404).json({ message: "Не знойдзена" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Стварыць кандыдата (ручное або з формы)
app.post("/api/candidates", async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const saved = await newCandidate.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Абнавіць кандыдата
app.put("/api/candidates/:id", async (req, res) => {
  try {
    const updated = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Дадаць нататку ў гісторыю кандыдата
app.post("/api/candidates/:id/history", async (req, res) => {
  try {
    const { type, text } = req.body;
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Не знойдзена" });
    candidate.history.push({ type, text, date: new Date() });
    await candidate.save();
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Выдаліць кандыдата
app.delete("/api/candidates/:id", async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Кандыдат выдалены" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Матчынг: падыходзячыя вакансіі для кандыдата
app.get("/api/candidates/:id/match-vacancies", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Не знойдзена" });

    const vacancies = await Vacancy.find({ status: "active" });
    const prefs = candidate.jobPreferences;
    const matched = [];

    for (const vacancy of vacancies) {
      let score = 0;

      // Гендар
      if (vacancy.requirements?.gender && candidate.gender) {
        const vacGender = vacancy.requirements.gender.toLowerCase();
        const candGender = candidate.gender === "female" ? "жінки" : "чоловіки";
        if (vacGender.includes(candGender) || vacGender.includes("будь-який")) {
          score += 3;
        } else {
          continue;
        }
      }

      // Лакацыя
      if (prefs?.locationFlexible) {
        score += 2;
      } else if (prefs?.location && vacancy.location) {
        if (
          vacancy.location.toLowerCase().includes(prefs.location.toLowerCase())
        ) {
          score += 2;
        }
      }

      // Жытло
      if (prefs?.needsAccommodation && vacancy.accommodation?.available) {
        score += 1;
      }

      if (score >= 2) {
        matched.push({ vacancy, score });
      }
    }

    matched.sort((a, b) => b.score - a.score);
    res.json(
      matched.map((m) => ({ ...m.vacancy.toObject(), matchScore: m.score })),
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Матчынг: падыходзячыя кандыдаты для вакансіі
app.get("/api/vacancies/:id/match-candidates", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ message: "Не знойдзена" });

    const candidates = await Candidate.find({
      status: { $in: ["new", "active", "waiting"] },
    });
    const matched = [];

    for (const candidate of candidates) {
      const prefs = candidate.jobPreferences;
      let score = 0;

      // Гендар
      if (vacancy.requirements?.gender && candidate.gender) {
        const vacGender = vacancy.requirements.gender.toLowerCase();
        const candGender = candidate.gender === "female" ? "жінки" : "чоловіки";
        if (vacGender.includes(candGender) || vacGender.includes("будь-який")) {
          score += 3;
        } else {
          continue;
        }
      }

      // Лакацыя
      if (prefs?.locationFlexible) {
        score += 2;
      } else if (prefs?.location && vacancy.location) {
        if (
          vacancy.location
            .toLowerCase()
            .includes(prefs.location.toLowerCase()) ||
          prefs.location.toLowerCase().includes(vacancy.location.toLowerCase())
        ) {
          score += 2;
        }
      }

      // Жытло
      if (prefs?.needsAccommodation && vacancy.accommodation?.available) {
        score += 1;
      }

      // Графік
      if (prefs?.schedule?.length > 0 && vacancy.schedule?.shifts) {
        const shifts = vacancy.schedule.shifts;
        if (
          (shifts.includes("1") && prefs.schedule.includes("1_shift")) ||
          (shifts.includes("2") && prefs.schedule.includes("2_shifts")) ||
          (shifts.includes("3") && prefs.schedule.includes("3_shifts"))
        ) {
          score += 1;
        }
      }

      if (score >= 2) {
        matched.push({
          ...candidate.toObject(),
          matchScore: score,
        });
      }
    }

    matched.sort((a, b) => b.matchScore - a.matchScore);
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Публічная заяўка з сайта/бота
app.post("/api/apply", async (req, res) => {
  try {
    const { vacancyId, name, contactType, telegram, phone, ...rest } = req.body;

    // Захоўваем кандыдата
    const candidate = new Candidate({
      name,
      contactType,
      telegram,
      phone,
      source: "site",
      status: "new",
      ...rest,
    });

    if (vacancyId) {
      candidate.appliedVacancies.push({
        vacancyId,
        appliedAt: new Date(),
        type: req.body.applyType || "want_work",
      });
    }

    const saved = await candidate.save();

    // Знаходзім вакансію для паведамлення
    let vacancyInfo = "";
    if (vacancyId) {
      const vacancy = await Vacancy.findById(vacancyId);
      if (vacancy) {
        vacancyInfo = `\n📋 Вакансія: *${vacancy.title}* (${vacancy.vacancyCode || vacancy._id})`;
      }
    }

    // Апавяшчаем рэкрутэра
    const applyType =
      req.body.applyType === "want_info"
        ? "Хоча дазнацца дэталі"
        : "Хоча тут працаваць";
    const msg = `
🔔 *Новая заяўка!* (${applyType})${vacancyInfo}

👤 *${name}*
📞 ${contactType}: ${telegram || phone || "—"}
🌍 Нацыянальнасць: ${rest.nationality || "—"}
📍 Знаходзіцца: ${rest.currentLocation || "—"}
🎂 Узрост: ${rest.age || "—"}
    `;

    await notifyRecruiter(msg);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Бекенд працуе! Дакументацыя: <a href='/api-docs'>/api-docs</a>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер: http://localhost:${PORT}`);
  console.log(`📜 Swagger: http://localhost:${PORT}/api-docs`);
});

bot.telegram
  .deleteWebhook({ drop_pending_updates: true })
  .then(() => bot.launch())
  .then(() => console.log("✅ Бот запушчаны"))
  .catch((err) => console.error("❌ Памылка запуску бота:", err.message));
