// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { Telegraf } = require("telegraf"); // 1. Падключаем Telegraf

// Мадэлі дадзеных
const Vacancy = require("./models/Vacancy");
const Template = require("./models/Template");

// Імпарт знешняй канфігурацыі Swagger
const swaggerDefinition = require("./swaggerConfig");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- НАЛАДА TELEGRAM БОТА ---
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

// Функцыя для прыгожага фармаціравання і адпраўкі ў ТГ
const sendToTelegram = async (vacancy) => {
  const message = `
🌟 *${vacancy.title}*

📍 *Горад:* ${vacancy.location}
🏢 *Агенцыя:* ${vacancy.agencyName || "Не пазначана"}

📝 *Апісанне:*
${vacancy.description || "Апісанне будзе дададзена пазней..."}

---
💬 *З чата:* _${vacancy.rawText || ""}_
  `;

  try {
    await bot.telegram.sendMessage(CHANNEL_ID, message, {
      parse_mode: "Markdown",
    });
    console.log("✅ Вакансія адпраўлена ў Telegram канал");
  } catch (err) {
    console.error("❌ Памылка адпраўкі ў Telegram:", err.message);
  }
};

// Налада Swagger UI
const specs = swaggerJsdoc({ swaggerDefinition, apis: [] });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Падключэнне да MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Паспяхова падключана да MongoDB Atlas!"))
  .catch((err) => console.error("❌ Памылка падключэння да базы:", err));

// --- МАРШРУТЫ ДЛЯ ВАКАНСІЙ (VACANCIES) ---

app.post("/api/vacancies/auto", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ message: "Тэкст пусты" });

    const templates = await Template.find();

    let foundTemplate = templates.find((t) =>
      t.keywords.some((word) =>
        rawText.toLowerCase().includes(word.toLowerCase())
      )
    );

    let vacancyData;

    if (foundTemplate) {
      vacancyData = {
        title: foundTemplate.title,
        location: foundTemplate.location,
        agencyName: foundTemplate.agencyName,
        description: foundTemplate.description,
        rawText: rawText,
        status: "active",
      };
      console.log(`✅ Знойдзены шаблон: ${foundTemplate.templateName}`);
    } else {
      vacancyData = {
        title: "Новая вакансія (патрэбна ўдакладненне)",
        location: "Не вызначана",
        rawText: rawText,
        status: "active",
      };
      console.log("⚠️ Шаблон не знойдзены");
    }

    const newVacancy = new Vacancy(vacancyData);
    const savedVacancy = await newVacancy.save();

    // 2. Аўтаматычная адпраўка ў канал
    await sendToTelegram(savedVacancy);

    res.status(201).json(savedVacancy);
  } catch (err) {
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

    // 3. Адпраўка ў канал пры ручным стварэнні
    await sendToTelegram(savedVacancy);

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

// --- МАРШРУТЫ ДЛЯ ШАБЛОНАЎ (TEMPLATES) ---

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
  res.send(
    "Бекенд працуе! Дакументацыя тут: <a href='/api-docs'>/api-docs</a>"
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запушчаны: http://localhost:${PORT}`);
  console.log(`📜 Swagger даступны: http://localhost:${PORT}/api-docs`);
});

// 4. Запуск бота
bot.launch();
