require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const Vacancy = require("./models/Vacancy");

const app = express();
app.use(cors());
app.use(express.json());

// Настройка Swagger праз аб'ект (без рызыкоўных каментароў)
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Vacancy App API",
    version: "1.0.0",
    description: "API для кіравання вакансіямі",
  },
  servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
  paths: {
    "/api/vacancies": {
      get: {
        summary: "Атрымаць усе вакансіі",
        responses: { 200: { description: "Спіс атрыманы" } },
      },
      post: {
        summary: "Стварыць вакансію",
        responses: { 201: { description: "Створана" } },
      },
    },
    "/api/vacancies/{id}": {
      put: {
        summary: "Абнавіць вакансію",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Абноўлена" } },
      },
      delete: {
        summary: "Выдаліць вакансію",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Выдалена" } },
      },
    },
  },
};

const specs = swaggerJsdoc({ swaggerDefinition, apis: [] });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Падключэнне да MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Паспяхова падключана да MongoDB Atlas!"))
  .catch((err) => console.error("❌ Памылка падключэння да базы:", err));

// --- МАРШРУТЫ ---

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
    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedVacancy);
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

app.get("/", (req, res) => {
  res.send("Бекенд працуе! Дакументацыя: /api-docs");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер: http://localhost:${PORT}`);
  console.log(`📜 Swagger: http://localhost:${PORT}/api-docs`);
});
