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
async function runSyncWithInsurance(forceRun = false) {
  const taskName = "global-sync";
  const SyncState = require("./models/SyncState");
  const Vacancy = require("./models/Vacancy");

  try {
    // 👈 ЗМЕНА: мяккі замок замест жорсткага return
    // Сінхранізацыя стартуе заўсёды, але чакае калі канвеер чатаў заняты
    if (global.isChatProcessing) {
      console.log(`⏳ [Sync] Канвеер чатаў заняты. Чакаем завяршэння...`);
      await new Promise(resolve => {
        const check = setInterval(() => {
          if (!global.isChatProcessing) {
            clearInterval(check);
            resolve();
          }
        }, 5000);
      });
      console.log(`✅ [Sync] Канвеер чатаў вызвалены. Працягваем сінхранізацыю.`);
    }

     // 👈 ДАДАДЗЕНА: праверка ці трэба прымусовы запуск
    const syncState = await SyncState.findOne({ key: "circular_sync_position" });
    const hasPendingAi = await Vacancy.exists({ status: "pending_ai" });
    const prevCircleIncomplete = syncState && syncState.isComplete === false;

    const log = await CronLog.findOne({ taskName });
    const cooldownPeriod = new Date(Date.now() - 3.5 * 60 * 60 * 1000);

    // 👈 ДАДАДЗЕНА: прымусовы запуск калі папярэдняе кола не завершана або ёсць pending_ai
    if (!forceRun && log && log.lastRun >= cooldownPeriod) {
      if (prevCircleIncomplete || hasPendingAi) {
        console.log(`⚠️ [Sync] Cooldown актыўны, але кола не завершана або ёсць pending_ai. Прымусовы запуск.`);
      } else {
        console.log(`🛡️ INSURANCE: Сінхранізацыя ўжо была нядаўна. Пропуск.`);
        return;
      }
    }

    console.log("⏰ [Sync] Пачатак цыклічнага канвеера...");

    // 👈 ДАДАДЗЕНА: адзначаем кола як незавершанае ў пачатку
    await SyncState.findOneAndUpdate(
      { key: "circular_sync_position" },
      { isComplete: false },
      { upsert: true }
    );

    // 2. ПРЫЯРЫТЭТ 2: Дапрацоўка "даўгоў" (pending_ai)
    // Гэта заўсёды ідзе першым, каб вызваліць чаргу
    await retryPendingVacancies();
    
   // 3. ПРЫЯРЫТЭТ 3: Цыклічная сінхранізацыя крыніц (Кола)
    console.log("📊 Сканаванне Google Sheets...");
    const sheetsResult = await syncAllSheets();
    if (sheetsResult === "STOP_ALL") return; // 👈 Спыняем усё кола адразу

    console.log("🗂️ Сканаванне Trello...");
    const trelloResult = await syncAllTrelloBoards();
    if (trelloResult === "STOP_ALL") return; // 👈 Спыняем усё кола адразу

    console.log("💎 Сканаванне Airtable...");
    const airtableResult = await syncAirtable();
    if (airtableResult === "STOP_ALL") return; // 👈 Спыняем усё кола адразу

    // 👈 ЗМЕНА: CronLog і isComplete пішацца толькі пры поўным паспяховым завяршэнні
    const finalSyncState = await SyncState.findOne({ key: "circular_sync_position" });
    const allModelsWorked = finalSyncState && finalSyncState.lastIndex === 0;

    if (allModelsWorked) {
      await CronLog.findOneAndUpdate(
        { taskName },
        { lastRun: new Date() },
        { upsert: true, new: true }
      );
      await SyncState.findOneAndUpdate(
        { key: "circular_sync_position" },
        { isComplete: true },
        { upsert: true }
      );
      console.log("✅ [Sync] Кола завершана паспяхова.");
    } else {
      console.log("⚠️ [Sync] Кола завершана з памылкамі. CronLog не запісаны — паўторны запуск адбудзецца хутчэй.");
    }
  } catch (err) {
    console.error("❌ [Sync] Памылка канвеера:", err.message);
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