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
    if (global.isChatProcessing) {
  console.log(`⏳ [Sync] Канвеер чатаў заняты. Чакаем завяршэння (макс. 2 хвіліны)...`);
  // 👈 ЗМЕНА: дадаем таймаўт 2 хвіліны, каб не вісець вечна калі флаг не скінуўся
  const waitResult = await Promise.race([
    new Promise(resolve => {
      const check = setInterval(() => {
        if (!global.isChatProcessing) {
          clearInterval(check);
          resolve("done");
        }
      }, 5000);
    }),
    new Promise(resolve => setTimeout(() => resolve("timeout"), 2 * 60 * 1000))
  ]);

  if (waitResult === "timeout") {
    console.warn(`⚠️ [Sync] Чаканне скончылася таймаўтам. Скідаем флаг і працягваем.`);
    global.isChatProcessing = false; // 👈 Прымусовы скід завіслага флага
  } else {
    console.log(`✅ [Sync] Канвеер чатаў вызвалены. Працягваем сінхранізацыю.`);
  }
}

    // 1. Чытаем стан і правяраем чаргу
    const syncState = await SyncState.findOne({ key: "circular_sync_position" });
    const hasPendingAi = await Vacancy.exists({ status: "pending_ai" });
    const isCircleIncomplete = syncState && syncState.isComplete === false;

    // Вылічаем, ці пара пачынаць новае кола (4 гадзіны ад апошняга поўнага фінішу)
    const lastFinish = syncState?.lastFullCircleAt ? new Date(syncState.lastFullCircleAt) : new Date(0);
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const isTimeForNewCircle = lastFinish < fourHoursAgo;

    // 🛡️ ВЫЗНАЧАЕМ, ЦІ ТРЭБА ЗАПУСК
    let shouldRun = false;
    let reason = "";

    if (forceRun) { reason = "Прымусовы запуск"; shouldRun = true; }
    else if (hasPendingAi) { reason = "Ёсць неапрацаваныя вакансіі (pending_ai)"; shouldRun = true; }
    else if (isCircleIncomplete) { reason = "Мінулае кола не завершана"; shouldRun = true; }
    else if (isTimeForNewCircle) { reason = "Прайшло 4 гадзіны, пара пачынаць новае кола"; shouldRun = true; }

    if (!shouldRun) return; // Ціха выходзім, калі рабіць няма чаго

    console.log(`⏰ [Sync] Трыгер: ${reason}. Пачынаем працу...`);

    // Калі пачынаем менавіта НОВАЕ кола — чысцім спіс апрацаваных
    if (isTimeForNewCircle && !isCircleIncomplete && !hasPendingAi) {
      await SyncState.findOneAndUpdate(
        { key: "circular_sync_position" },
        { isComplete: false, processedInCircle: [], lastIndex: 0 },
        { upsert: true }
      );
      console.log("🔄 [Sync] Спіс крыніц ачышчаны для новага кола.");
    }
    
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
      await SyncState.findOneAndUpdate(
        { key: "circular_sync_position" },
        { 
          isComplete: true, 
          lastFullCircleAt: new Date(), // Фіксуем час поўнага поспеху
          lastIndex: 0 
        },
        { upsert: true }
      );
      console.log("✅ [Sync] Кола завершана паспяхова. Наступны поўны запуск праз 4 гадзіны.");
    } else {
      console.log("⚠️ [Sync] Кола перарвана памылкай AI. Watchdog паспрабуе яшчэ раз праз 10 хвілін.");
    }
  } catch (err) {
    console.error("❌ [Sync] Памылка канвеера:", err.message);
  }
}
// Правяраем стан канвеера кожныя 10 хвілін
cron.schedule("*/10 * * * *", async () => {
  console.log("🔍 [Watchdog] Праверка чаргі і стану сінхранізацыі...");
  await runSyncWithInsurance();
})

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