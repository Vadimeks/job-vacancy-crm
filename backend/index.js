require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Мадэлі дадзеных
const Vacancy = require("./models/Vacancy");
const Template = require("./models/Template");

// Імпарт знешняй канфігурацыі Swagger
const swaggerDefinition = require("./swaggerConfig");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Налада Swagger UI
const specs = swaggerJsdoc({ swaggerDefinition, apis: [] });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Падключэнне да MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Паспяхова падключана да MongoDB Atlas!"))
  .catch((err) => console.error("❌ Памылка падключэння да базы:", err));

// --- МАРШРУТЫ ДЛЯ ВАКАНСІЙ (VACANCIES) ---
// Роут для аўтаматычнага стварэння вакансіі праз Агента
app.post("/api/vacancies/auto", async (req, res) => {
  try {
    const { rawText } = req.body; // Атрымліваем тэкст з чата
    if (!rawText) return res.status(400).json({ message: "Тэкст пусты" });

    // 1. Бярэм усе шаблоны з базы
    const templates = await Template.find();

    // 2. Шукаем прыдатны шаблон па keywords
    let foundTemplate = templates.find((t) =>
      t.keywords.some((word) =>
        rawText.toLowerCase().includes(word.toLowerCase())
      )
    );

    let vacancyData;

    if (foundTemplate) {
      // 3. Калі шаблон знойдзены — злучаем дадзеныя
      vacancyData = {
        title: foundTemplate.title,
        location: foundTemplate.location,
        agencyName: foundTemplate.agencyName,
        description: foundTemplate.description,
        rawText: rawText, // захоўваем арыгінал на ўсялякі выпадак
        status: "active",
      };
      console.log(`✅ Знойдзены шаблон: ${foundTemplate.templateName}`);
    } else {
      // 4. Калі не знойдзены — ствараем "пустую" вакансію толькі з тэкстам
      vacancyData = {
        title: "Новая вакансія (патрэбна ўдакладненне)",
        location: "Не вызначана",
        rawText: rawText,
        status: "active",
      };
      console.log("⚠️ Шаблон не знойдзены, створана агульная вакансія");
    }

    const newVacancy = new Vacancy(vacancyData);
    const savedVacancy = await newVacancy.save();
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
    // Выпраўлена: цяпер выкарыстоўваецца мадэль Template
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

// Галоўная старонка
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
