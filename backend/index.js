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

    console.log(`✅ Whitelisted TG: ${agency} [${chatTitle}]`);

    const classification = await classifyMessage(text, chatTitle);
    const finalAgency =
      classification.agency === "UNKNOWN" ? agency : classification.agency;

    if (
      classification.category === "FULL_VACANCY" &&
      classification.confidence > 0.7
    ) {
      await processVacancyMessage(text, chatTitle, finalAgency);
    } else {
      // ЗАЎСЁДЫ захоўваем у Inbox, калі чат у вайтлісце, нават калі AI кажа NOISE
      const categoryMap = {
        UPDATE: "update",
        FULL_VACANCY: "vacancy",
        RECRUITER_INFO: "info",
        NOISE: "chat",
      };

      await new UnprocessedMessage({
        sender: chatTitle,
        agencyName: finalAgency,
        text: classification.translatedText || text,
        source: "telegram",
        category: categoryMap[classification.category] || "chat",
      }).save();

      console.log(`📥 Saved to Inbox from whitelisted chat: ${chatTitle}`);
    }
  } catch (err) {
    console.error("❌ TG Error:", err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  startBot();
  startUserbot().catch((e) => console.error("Userbot Error:", e.message));
});
