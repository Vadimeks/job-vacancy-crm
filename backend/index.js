// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { bot, startBot } = require("./services/telegram.service");
const { startUserbot } = require("./userbot");
const {
  router: vacanciesRouter,
  processVacancyMessage,
} = require("./routes/vacancies");
const inboxRouter = require("./routes/inbox");
const { classifyMessage } = require("./services/classifier.service");
const UnprocessedMessage = require("./models/UnprocessedMessage");
const {
  shouldIgnoreMessage,
  getWhitelistedAgency,
} = require("./utils/messageFilters");
const { classifyWithGemini } = require("./services/gemini.service");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/vacancies", vacanciesRouter);
app.use("/api/inbox", inboxRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"));

bot.on("message", async (ctx) => {
  try {
    const chatTitle = ctx.chat.title || "";
    const text = ctx.message.text || "";

    const agency = getWhitelistedAgency(chatTitle);
    if (!agency) return;
    if (shouldIgnoreMessage(text)) return;

    console.log(`🔍 Gemini аналізуе паведамленне з TG: ${chatTitle}`);

    // ВЫКАРЫСТОЎВАЕМ GEMINI ЗАМЕСТ GROQ ДЛЯ КЛАСІФІКАЦЫІ
    const classification = await classifyWithGemini(text);

    if (classification.category === "NOISE") return;

    if (classification.category === "FULL_VACANCY") {
      // Калі гэта вакансія — запускаем асноўны працэс (Groq унутры)
      await processVacancyMessage(text, chatTitle, agency);
    } else {
      // Усё астатняе (UPDATE, INFO) — у Інбокс
      const categoryMap = { UPDATE: "update", RECRUITER_INFO: "info" };
      await new UnprocessedMessage({
        sender: chatTitle,
        agencyName: agency,
        text: classification.translatedText || text,
        source: "telegram",
        category: categoryMap[classification.category] || "chat",
      }).save();
    }
  } catch (err) {
    console.error("❌ TG Pipeline Error:", err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  startBot();
  startUserbot().catch((e) => console.error("Userbot Error:", e.message));
});
