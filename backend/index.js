// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");
const cron = require("node-cron");

// Сэрвісы і Роўты
const { startBot } = require("./services/telegram.service");
const { router: vacanciesRouter, retryPendingVacancies } = require("./routes/vacancies");
const { syncAllSheets } = require("./services/sheets.service");
const { syncAllTrelloBoards } = require("./services/trello.service");
const { syncAirtable } = require("./services/airtable.service");

const inboxRouter = require("./routes/inbox");
const templatesRouter = require("./routes/templates");
const candidatesRouter = require("./routes/candidates");
const applyRouter = require("./routes/apply");

const CronLog = require("./models/CronLog");

const app = express();
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

// Маршруты API
app.use("/api/vacancies", vacanciesRouter);
app.use("/api/inbox", inboxRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/apply", applyRouter);

// Падключэнне да БД
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- БЛОК РАЗУМНАЙ СІНХРАНІЗАЦЫІ (CRON + INSURANCE) ---

/**
 * Функцыя-абгортка для паслядоўнай сінхранізацыі ўсіх крыніц
 */
async function runSyncWithInsurance() {
  const taskName = "global-sync"; 

  try {
    const log = await CronLog.findOne({ taskName });
    // Дазваляем запуск, калі прайшло больш за 3.5 гадзіны (для цыкла ў 4 гадзіны)
    const cooldownPeriod = new Date(Date.now() - 3.5 * 60 * 60 * 1000);

    if (log && log.lastRun >= cooldownPeriod) {
      console.log(`🛡️ INSURANCE: Сінхранізацыя ўжо была нядаўна. Пропуск.`);
      return;
    }

    console.log("⏰ [Sync] Пачатак поўнай паслядоўнай сінхранізацыі...");

    // 1. Спачатку чысцім чаргу (pending_ai) — даціскаем тое, што не зрабіў Lite
    await retryPendingVacancies();
    
    // 2. Google Sheets
    console.log("📊 Сканаванне Google Sheets...");
    await syncAllSheets();
    
    // 3. Trello
    console.log("🗂️ Сканаванне Trello...");
    await syncAllTrelloBoards();

    // 4. Airtable
    console.log("💎 Сканаванне Airtable...");
    await syncAirtable();

    // Запісваем час паспяховага завяршэння
    await CronLog.findOneAndUpdate(
      { taskName },
      { lastRun: new Date() },
      { upsert: true, new: true }
    );

    console.log("✅ [Sync] Усе крыніцы паспяхова апрацаваны.");
  } catch (err) {
    console.error("❌ [Sync] Памылка падчас глабальнай сінхранізацыі:", err.message);
  }
}

// Запуск Cron кожныя 4 гадзіны (00:00, 04:00, 08:00 і г.д. па UTC)
cron.schedule("0 */4 * * *", async () => {
  console.log("⏰ CRON: Трыгер спрацаваў (цыкл 4 гадзіны).");
  await runSyncWithInsurance();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  startBot();
  startUserbot();

  // Запуск пры старце (з улікам INSURANCE)
  runSyncWithInsurance();
});

// --- ЗАПУСК USERBOT У ДОЧАРНЫМ ПРАЦЭСЕ ---
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
        console.log("🛑 Userbot спынены.");
        return;
      }
      console.warn(`⚠️ Userbot завяршыўся (код: ${code}). Перазапуск праз 10с...`);
      setTimeout(spawnUserbot, 10000);
    });

    child.on("error", (err) => {
      console.error("❌ Памылка запуску userbot:", err.message);
      setTimeout(spawnUserbot, 10000);
    });
  }

  spawnUserbot();
}