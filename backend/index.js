// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = require("./swaggerConfig");
const { bot, startBot } = require("./services/telegram.service");
const { startUserbot } = require("./userbot");
const {
  router: vacanciesRouter,
  processVacancyMessage,
} = require("./routes/vacancies");
const candidatesRouter = require("./routes/candidates");
const templatesRouter = require("./routes/templates");
const applyRouter = require("./routes/apply");
const rawMessagesRouter = require("./routes/rawMessages");
const inboxRouter = require("./routes/inbox");
const { classifyMessage } = require("./services/classifier.service");
const UnprocessedMessage = require("./models/UnprocessedMessage");

const AGENCY_CHAT_IDS = process.env.AGENCY_CHAT_IDS
  ? process.env.AGENCY_CHAT_IDS.split(",").map((id) => id.trim())
  : [];

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// --- SWAGGER ---
const specs = swaggerJsdoc({ swaggerDefinition, apis: [] });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// --- МАРШРУТЫ ---
app.use("/api/vacancies", vacanciesRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/apply", applyRouter);
app.use("/api/raw-messages", rawMessagesRouter);
app.use("/api/inbox", inboxRouter);

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
  const chatTitle = ctx.chat.title || "Telegram Chat";
  const text = ctx.message.text;

  if (!AGENCY_CHAT_IDS.includes(chatId)) return;
  if (!text || text.length < 10) return;

  console.log(`📨 New TG message from [${chatTitle}]`);

  try {
    // 1. AI Класіфікацыя
    const classification = await classifyMessage(text, chatTitle);

    if (
      classification.category === "FULL_VACANCY" &&
      classification.confidence > 0.7
    ) {
      // Аўтаматычны парсінг
      await processVacancyMessage(text, chatTitle, classification.agency);
    } else if (
      classification.category !== "NOISE" ||
      classification.confidence < 0.8
    ) {
      // Усё астатняе (акрамя відавочнага спаму) — у Пясочніцу
      const categoryMap = {
        UPDATE: "update",
        FULL_VACANCY: "vacancy",
        NOISE: "chat",
      };
      await new UnprocessedMessage({
        sender: chatTitle,
        agencyName: classification.agency,
        text,
        source: "telegram",
        category: categoryMap[classification.category] || "chat",
      }).save();
      console.log(`📥 TG message moved to Inbox [${classification.category}]`);
    }
  } catch (err) {
    console.error("❌ TG processing error:", err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер: http://localhost:${PORT}`);
  console.log(`📜 Swagger: http://localhost:${PORT}/api-docs`);

  // Запускаем афіцыйнага бота
  startBot();

  // Запускаем юзербота
  startUserbot().catch((err) => {
    console.error("❌ Памылка запуску Userbot:", err.message);
  });
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
