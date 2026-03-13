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
const swaggerDefinition = require("./swaggerConfig");

const app = express();
app.use(cors());
app.use(express.json());

// --- НАЛАДА TELEGRAM БОТА ---
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

// ID чатаў агенцый, якія слухаем (з .env)
// Фармат у .env: AGENCY_CHAT_IDS=-1001234567890,-1009876543210
const AGENCY_CHAT_IDS = process.env.AGENCY_CHAT_IDS
  ? process.env.AGENCY_CHAT_IDS.split(",").map((id) => id.trim())
  : [];

// --- ФУНКЦЫЯ АДПРАЎКІ Ў TELEGRAM ---
// Цяпер прымае гатовы тэкст, а не збірае яго сама
const sendToTelegram = async (postText) => {
  try {
    await bot.telegram.sendMessage(CHANNEL_ID, postText, {
      parse_mode: "Markdown",
    });
    console.log("✅ Вакансія адпраўлена ў Telegram-канал");
  } catch (err) {
    // Калі Markdown зламаўся — адпраўляем без фарматавання
    console.warn("⚠️ Markdown памылка, адпраўляем як plain text...");
    try {
      await bot.telegram.sendMessage(CHANNEL_ID, postText);
      console.log("✅ Адпраўлена як plain text");
    } catch (err2) {
      console.error("❌ Памылка адпраўкі ў Telegram:", err2.message);
    }
  }
};

// --- АСНОЎНАЯ ФУНКЦЫЯ АПРАЦОЎКІ ПАВЕДАМЛЕННЯ ---
// Выкарыстоўваецца і ботам, і API эндпоінтам
const processVacancyMessage = async (rawText) => {
  // 1. Загружаем усе шаблоны
  const templates = await Template.find();

  if (templates.length === 0) {
    console.warn("⚠️ Шаблоны не знойдзены ў базе");
  }

  // 2. Вызначаем шаблон
  const template = await aiService.identifyTemplate(rawText, templates);

  let vacancyData;

  if (template) {
    // 3а. Ёсць шаблон — мержуем
    vacancyData = await aiService.mergeWithTemplate(rawText, template);
    vacancyData.agencyName = template.agencyName;
    vacancyData.templateId = template._id;
  } else {
    // 3б. Няма шаблона — парсім як раней (fallback)
    console.log("⚠️ Шаблон не знойдзены, выкарыстоўваем fallback парсінг...");
    vacancyData = await aiService.parseVacancyWithAI(rawText);
  }

  // 4. Фарматуем Telegram-пост
  const postText = await aiService.formatTelegramPost(vacancyData);

  // 5. Захоўваем вакансію ў базу
  const newVacancy = new Vacancy({
    title: vacancyData.title || "Новая вакансія",
    agencyName: vacancyData.agencyName || "Manual",
    location: vacancyData.location || "Не вызначана",
    salary: vacancyData.salary || {},
    schedule: vacancyData.schedule?.shifts || vacancyData.schedule || "",
    description: vacancyData.description || "",
    accommodation: vacancyData.accommodation || {},
    transport: vacancyData.transport?.details || vacancyData.transport || "",
    requirements: vacancyData.requirements || {},
    rawText: rawText,
    telegramPost: postText,
    status: "active",
  });

  const savedVacancy = await newVacancy.save();

  // 6. Адпраўляем у канал
  await sendToTelegram(postText);

  return savedVacancy;
};

// --- БОТ: СЛУХАННЕ ЧАТАЎ АГЕНЦЫЙ ---
bot.on("message", async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const text = ctx.message.text;

  // Ігнаруем калі гэта не чат агенцыі
  if (!AGENCY_CHAT_IDS.includes(chatId)) return;

  // Ігнаруем кароткія паведамленні (менш за 10 сімвалаў)
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

// Аўтаматычнае стварэнне (праз API, напрыклад з Postman або фронта)
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
    const newVacancy = new Vacancy(req.body);
    const savedVacancy = await newVacancy.save();
    // Ручнае стварэнне — фарматуем і адпраўляем
    const postText = await aiService.formatTelegramPost(savedVacancy);
    await sendToTelegram(postText);
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

app.get("/", (req, res) => {
  res.send("Бекенд працуе! Дакументацыя: <a href='/api-docs'>/api-docs</a>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер: http://localhost:${PORT}`);
  console.log(`📜 Swagger: http://localhost:${PORT}/api-docs`);
});

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
