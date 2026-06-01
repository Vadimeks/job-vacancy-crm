// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");
const { startBot } = require("./services/telegram.service");
const { router: vacanciesRouter } = require("./routes/vacancies");
const inboxRouter = require("./routes/inbox");
const templatesRouter = require("./routes/templates");
const candidatesRouter = require("./routes/candidates");
const applyRouter = require("./routes/apply");
const cron = require("node-cron");
const { syncAllSheets } = require("./services/sheets.service");
const app = express();
const CronLog = require("./models/CronLog");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Апрацоўка бітых JSON (ахова ад MacroDroid)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("⚠️ Атрыманы біты JSON. Ігнаруем.");
    return res.status(200).json({ status: "error_bad_json_ignored" });
  }
  next();
});

// Маршруты
app.use("/api/vacancies", vacanciesRouter);
app.use("/api/inbox", inboxRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/apply", applyRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"));
// --- БЛОК РАЗУМНАЙ СІНХРАНІЗАЦЫІ (CRON + INSURANCE) ---

/**
 * Функцыя-абгортка, якая гарантуе, што сінхранізацыя выканаецца толькі 1 раз на суткі,
 * нават калі сервер перазагружаўся або дэплоіўся.
 */
async function runSyncWithInsurance() {
  const taskName = "sheets-sync";
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Скідваем час да пачатку сутак для параўнання

  try {
    // Шукаем запіс аб апошнім запуску гэтай задачы
    const log = await CronLog.findOne({ taskName });

    if (log && log.lastRun >= today) {
      console.log(
        `🛡️ INSURANCE: Сінхранізацыя за сёння (${today.toLocaleDateString()}) ужо была выканана. Пропуск.`,
      );
      return;
    }

    console.log("⏰ CRON/STARTUP: Пачатак штодзённай сінхранізацыі табліц...");

    // Выклік асноўнага сэрвісу
    await syncAllSheets();

    // Фіксуем паспяховы запуск у базе
    await CronLog.findOneAndUpdate(
      { taskName },
      { lastRun: new Date() },
      { upsert: true, new: true },
    );

    console.log(
      "✅ CRON/STARTUP: Сінхранізацыя завершана і зафіксавана ў базе.",
    );
  } catch (err) {
    console.error(
      "❌ INSURANCE ERROR: Памылка падчас выканання сінхранізацыі:",
      err.message,
    );
  }
}

// Запуск Cron кожную раніцу а 05:00 UTC (08:00 па Кіеве)
cron.schedule("0 5 * * *", async () => {
  console.log("⏰ CRON: Трыгер спрацаваў (05:00 UTC).");
  await runSyncWithInsurance();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  startBot();
  startUserbot();

  // Разумная страхоўка пры старце:
  // Калі сервер падняўся пасля дэплою і сёння яшчэ не было сінхранізацыі — яна запусціцца.
  // Калі ўжо была — функцыя проста выведзе лог і нічога не прадублюе.
  // runSyncWithInsurance();
});

// --- ЗАПУСК USERBOT У ДОЧАРНЫМ ПРАЦЭСЕ ---
// Чаму child_process, а не просты require():
//   userbot.js мае ўласны `await new Promise(() => {})` у канцы (бясконца),
//   і `process.exit(1)` пры крытычнай памылцы — гэта заб'е ўвесь сервер,
//   калі запускаць яго ўнутры таго ж працэсу.
//   Дочарны працэс ізаляваны: яго крах не закранае Express.
function startUserbot() {
  if (!process.env.TELEGRAM_SESSION) {
    console.log("ℹ️ TELEGRAM_SESSION не задана — userbot не запускаецца.");
    return;
  }

  const userbotPath = path.join(__dirname, "userbot.js");

  function spawnUserbot() {
    console.log("🤖 Запуск Telegram userbot (child process)...");
    const child = spawn(process.execPath, [userbotPath], {
      env: process.env,
      stdio: "inherit",
    });

    child.on("exit", (code, signal) => {
      if (signal === "SIGTERM" || signal === "SIGKILL") {
        console.log("🛑 Userbot спынены. Не перазапускаем.");
        return;
      }
      console.warn(
        `⚠️ Userbot завяршыўся (код: ${code}). Перазапуск праз 10с...`,
      );
      setTimeout(spawnUserbot, 10_000);
    });

    child.on("error", (err) => {
      console.error("❌ Памылка запуску userbot:", err.message);
      setTimeout(spawnUserbot, 10_000);
    });
  }

  spawnUserbot();
}
