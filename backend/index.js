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

    const candidates = await Candidate.find({
      status: { $in: ["new", "active", "waiting"] },
    });

    if (candidates.length === 0) {
      console.log("ℹ️ Няма кандыдатаў");
      return [];
    }

    const matched = [];

    for (const candidate of candidates) {
      const prefs = candidate.jobPreferences;

      // --- HARD FILTERS (абавязковыя) ---

      // Гендар
      if (vacancy.requirements?.gender && candidate.gender) {
        const vacGender = vacancy.requirements.gender.toLowerCase();
        const isFemale =
          vacGender.includes("жінк") ||
          vacGender.includes("женщ") ||
          vacGender.includes("female");
        const isMale =
          vacGender.includes("чолов") ||
          vacGender.includes("мужч") ||
          vacGender.includes("male");
        const isBoth =
          vacGender.includes("будь") ||
          vacGender.includes("any") ||
          (!isFemale && !isMale);
        if (!isBoth) {
          if (isFemale && candidate.gender !== "female") continue;
          if (isMale && candidate.gender !== "male") continue;
        }
      }

      // Узрост
      if (vacancy.requirements?.ageMax && candidate.age) {
        if (candidate.age > vacancy.requirements.ageMax) continue;
      }
      if (vacancy.requirements?.ageMin && candidate.age) {
        if (candidate.age < vacancy.requirements.ageMin) continue;
      }

      // Нацыянальнасць
      if (
        vacancy.requirements?.nationalities?.length > 0 &&
        candidate.nationality
      ) {
        const allowed = vacancy.requirements.nationalities.map((n) =>
          n.toLowerCase(),
        );
        if (!allowed.includes(candidate.nationality.toLowerCase())) continue;
      }

      // Жытло (калі кандыдат патрабуе — вакансія павінна мець)
      if (prefs?.needsAccommodation && !vacancy.accommodation?.available)
        continue;

      // Дакументы (калі вакансія патрабуе — кандыдат павінен мець)
      if (vacancy.requirements?.docs?.length > 0) {
        const requiredDocs = vacancy.requirements.docs.map((d) =>
          d.toLowerCase(),
        );
        if (
          requiredDocs.some((d) => d.includes("санеп") || d.includes("sanep"))
        ) {
          if (!candidate.documents?.hasSanepid) continue;
        }
        if (requiredDocs.some((d) => d.includes("udt"))) {
          if (!candidate.documents?.hasUDT) continue;
        }
      }

      // --- SOFT FILTERS (балы) ---
      let score = 0;

      // Лакацыя (25 балаў)
      if (prefs?.locationFlexible) {
        score += 25;
      } else if (prefs?.locationRadius) {
        score += 15; // радыус 100км — частковае супадзенне
      } else if (prefs?.location && vacancy.location) {
        const candLoc = prefs.location.toLowerCase();
        const vacLoc = vacancy.location.toLowerCase();
        if (vacLoc.includes(candLoc) || candLoc.includes(vacLoc)) {
          score += 25;
        }
      }

      // Сфера (20 балаў)
      if (vacancy.sphere && prefs?.spheres?.length > 0) {
        if (prefs.spheres.includes(vacancy.sphere)) score += 20;
      } else {
        score += 10; // калі не пазначана — нейтральна
      }

      // Тып дагавора (15 балаў)
      if (vacancy.contractType && prefs?.contractType) {
        if (
          prefs.contractType === "any" ||
          prefs.contractType === vacancy.contractType
        ) {
          score += 15;
        }
      } else {
        score += 10;
      }

      // Графік змен (15 балаў)
      if (prefs?.schedule?.length > 0 && vacancy.schedule?.shifts) {
        const shifts = vacancy.schedule.shifts;
        const hasMatch =
          (shifts.includes("1") && prefs.schedule.includes("1_shift")) ||
          (shifts.includes("2") && prefs.schedule.includes("2_shifts")) ||
          (shifts.includes("3") && prefs.schedule.includes("3_shifts"));
        if (hasMatch) score += 15;
        else score += 5;
      } else {
        score += 10;
      }

      // Надгадзіны (10 балаў)
      if (vacancy.overtimeAvailable && prefs?.wantsOvertime) {
        score += 10;
      } else if (!vacancy.overtimeAvailable && !prefs?.wantsOvertime) {
        score += 10;
      } else {
        score += 5;
      }

      // Тып групы (10 балаў)
      if (prefs?.travelGroup) {
        if (vacancy.accommodation?.details) {
          const details = vacancy.accommodation.details.toLowerCase();
          if (prefs.travelGroup === "couple" && details.includes("пар"))
            score += 10;
          else if (prefs.travelGroup === "alone") score += 10;
          else score += 5;
        } else {
          score += 7;
        }
      } else {
        score += 7;
      }

      // Мовы (5 балаў)
      if (vacancy.requirements?.languages?.length > 0) {
        if (vacancy.requirements.languageLevel === "не патрабуецца") {
          score += 5;
        } else if (candidate.languages?.length > 0) {
          const hasLang = vacancy.requirements.languages.some((l) =>
            candidate.languages
              .map((cl) => cl.toLowerCase())
              .includes(l.toLowerCase()),
          );
          if (hasLang) score += 5;
        }
      } else {
        score += 5;
      }

      // Парог 60 балаў з 100
      if (score >= 60) {
        matched.push({ ...candidate.toObject(), matchScore: score });
      }
    }

    matched.sort((a, b) => b.matchScore - a.matchScore);
    console.log(`✅ Знойдзена ${matched.length} падыходзячых кандыдатаў`);
    return matched;
  } catch (err) {
    console.error("❌ Памылка матчынгу:", err.message);
    return [];
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
      // --- HARD FILTERS ---

      // Гендар
      if (vacancy.requirements?.gender && candidate.gender) {
        const vacGender = vacancy.requirements.gender.toLowerCase();
        const isFemale =
          vacGender.includes("жінк") || vacGender.includes("female");
        const isMale =
          vacGender.includes("чолов") || vacGender.includes("male");
        const isBoth = !isFemale && !isMale;
        if (!isBoth) {
          if (isFemale && candidate.gender !== "female") continue;
          if (isMale && candidate.gender !== "male") continue;
        }
      }

      // Узрост
      if (vacancy.requirements?.ageMax && candidate.age) {
        if (candidate.age > vacancy.requirements.ageMax) continue;
      }

      // Нацыянальнасць
      if (
        vacancy.requirements?.nationalities?.length > 0 &&
        candidate.nationality
      ) {
        const allowed = vacancy.requirements.nationalities.map((n) =>
          n.toLowerCase(),
        );
        if (!allowed.includes(candidate.nationality.toLowerCase())) continue;
      }

      // Жытло
      if (prefs?.needsAccommodation && !vacancy.accommodation?.available)
        continue;

      // Дакументы
      if (vacancy.requirements?.docs?.length > 0) {
        const requiredDocs = vacancy.requirements.docs.map((d) =>
          d.toLowerCase(),
        );
        if (
          requiredDocs.some((d) => d.includes("санеп") || d.includes("sanep"))
        ) {
          if (!candidate.documents?.hasSanepid) continue;
        }
        if (requiredDocs.some((d) => d.includes("udt"))) {
          if (!candidate.documents?.hasUDT) continue;
        }
      }

      // --- SOFT FILTERS ---
      let score = 0;

      // Лакацыя (25)
      if (prefs?.locationFlexible) score += 25;
      else if (prefs?.locationRadius) score += 15;
      else if (prefs?.location && vacancy.location) {
        const candLoc = prefs.location.toLowerCase();
        const vacLoc = vacancy.location.toLowerCase();
        if (vacLoc.includes(candLoc) || candLoc.includes(vacLoc)) score += 25;
      }

      // Сфера (20)
      if (vacancy.sphere && prefs?.spheres?.length > 0) {
        if (prefs.spheres.includes(vacancy.sphere)) score += 20;
      } else score += 10;

      // Дагавор (15)
      if (vacancy.contractType && prefs?.contractType) {
        if (
          prefs.contractType === "any" ||
          prefs.contractType === vacancy.contractType
        )
          score += 15;
      } else score += 10;

      // Графік (15)
      if (prefs?.schedule?.length > 0 && vacancy.schedule?.shifts) {
        const shifts = vacancy.schedule.shifts;
        const hasMatch =
          (shifts.includes("1") && prefs.schedule.includes("1_shift")) ||
          (shifts.includes("2") && prefs.schedule.includes("2_shifts")) ||
          (shifts.includes("3") && prefs.schedule.includes("3_shifts"));
        if (hasMatch) score += 15;
        else score += 5;
      } else score += 10;

      // Надгадзіны (10)
      if (vacancy.overtimeAvailable && prefs?.wantsOvertime) score += 10;
      else if (!vacancy.overtimeAvailable && !prefs?.wantsOvertime) score += 10;
      else score += 5;

      // Група (10)
      if (prefs?.travelGroup) {
        if (vacancy.accommodation?.details) {
          const details = vacancy.accommodation.details.toLowerCase();
          if (prefs.travelGroup === "couple" && details.includes("пар"))
            score += 10;
          else if (prefs.travelGroup === "alone") score += 10;
          else score += 5;
        } else score += 7;
      } else score += 7;

      // Мовы (5)
      if (vacancy.requirements?.languages?.length > 0) {
        if (vacancy.requirements.languageLevel === "не патрабуецца") score += 5;
        else if (candidate.languages?.length > 0) {
          const hasLang = vacancy.requirements.languages.some((l) =>
            candidate.languages
              .map((cl) => cl.toLowerCase())
              .includes(l.toLowerCase()),
          );
          if (hasLang) score += 5;
        }
      } else score += 5;

      if (score >= 60) {
        matched.push({ ...vacancy.toObject(), matchScore: score });
      }
    }

    matched.sort((a, b) => b.matchScore - a.matchScore);
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Матчынг: падыходзячыя кандыдаты для вакансіі
app.get("/api/vacancies/:id/match-candidates", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ message: "Не знойдзена" });
    const matched = await matchCandidatesForVacancy(vacancy);
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
