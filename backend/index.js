// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = require("./swaggerConfig");
const { bot, startBot } = require("./services/telegram.service");
const {
  router: vacanciesRouter,
  processVacancyMessage,
} = require("./routes/vacancies");
const candidatesRouter = require("./routes/candidates");
const templatesRouter = require("./routes/templates");
const applyRouter = require("./routes/apply");

const AGENCY_CHAT_IDS = process.env.AGENCY_CHAT_IDS
  ? process.env.AGENCY_CHAT_IDS.split(",").map((id) => id.trim())
  : [];

const app = express();
app.use(cors());
app.use(express.json());

// --- SWAGGER ---
const specs = swaggerJsdoc({ swaggerDefinition, apis: [] });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// --- МАРШРУТЫ ---
app.use("/api/vacancies", vacanciesRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/apply", applyRouter);

app.get("/", (req, res) => {
  res.send("Бекенд працуе! Дакументацыя: <a href='/api-docs'>/api-docs</a>");
});

// --- ПАДКЛЮЧЭННЕ ДА MONGODB ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Падключана да MongoDB Atlas!"))
  .catch((err) => console.error("❌ Памылка падключэння:", err));

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
      console.error("⏱️ Rate limit. Паўтарыце пазней.");
    } else {
      console.error("❌ Памылка апрацоўкі паведамлення:", err.message);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер: http://localhost:${PORT}`);
  console.log(`📜 Swagger: http://localhost:${PORT}/api-docs`);
});

startBot();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
