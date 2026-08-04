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
const { registerCandidateBotHandlers } = require("./services/telegramCandidateBot.service"); // 👈 ДАДАЦЬ ГЭТА
const { router: vacanciesRouter, retryPendingVacancies } = require("./routes/vacancies");
const { syncAllSheets } = require("./services/sheets.service");
const { syncAllTrelloBoards } = require("./services/trello.service");
const { syncAirtable } = require("./services/airtable.service");

const inboxRouter = require("./routes/inbox");
const templatesRouter = require("./routes/templates");
const { router: candidatesRouter } = require("./routes/candidates"); 
const applyRouter = require("./routes/apply");

const CronLog = require("./models/CronLog");

const app = express();
// 👈 ГЛАБАЛЬНЫ ПРАГРЭС СІНХРАНІЗАЦЫІ
global.syncProgress = { current: 0, total: 0, status: 'idle', agency: null };
global.stopSyncRequested = false;
global.isManualActionInProgress = false; // 👈 ДАДАДЗЕНА: прыярытэт ручных дзеянняў (reparse, publish і г.д.)
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
app.use("/api/sync", require("./routes/sync")); // 👈 ДАДАДЗЕНА: ручны запуск сканавання
// Падключэнне да БД
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    syncCountersWithDatabase(); // 👈 ВЫПРАЎЛЕНА: сінхранізуем лічыльнікі пры старце (v8.21)
  })
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
  
  // 1. Атамарная блакіроўка ў БД (v8.16 - з апрацоўкай E11000)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    let lock;
    try {
      lock = await SyncState.findOneAndUpdate(
        { 
          key: "circular_sync_position",
          $or: [
            { isRunning: false },
            { lockedAt: { $lt: oneHourAgo } }
          ]
        },
        { isRunning: true, lockedAt: new Date() },
        { new: true, upsert: true }
      );
    } catch (e) {
      if (e.code === 11000) {
        console.log("⏳ [Sync] Паралельны працэс ужо стварыў замок. Пропуск.");
        return;
      }
      throw e;
    }

    // 👈 ВЫПРАЎЛЕНА: Калі lock === null, значыць дакумент не знайшоўся па ўмовах (isRunning: false або stale)
    // Гэта значыць, што зараз нехта іншы ўжо трымае актыўны замок.
    if (!lock) {
      if (!forceRun) {
        const current = await SyncState.findOne({ key: "circular_sync_position" });
        console.log(`⏳ [Sync] Заблакавана ў БД. Замок пастаўлены: ${current?.lockedAt?.toLocaleString() || 'невядома'}. Пропуск.`);
        return;
      }
    }
    
    console.log("🔓 [Sync] Замок атрыманы, пачынаем працу.");

    global.isSyncRunning = true; // Пакідаем для сумяшчальнасці з лакальнымі праверкамі
 if (global.isChatProcessing) {
      console.log(`⏳ [Sync] Канвеер чатаў заняты. Чакаем завяршэння (макс. 2 хвіліны)...`);
      const waitResult = await Promise.race([
        new Promise(resolve => {
          const check = setInterval(() => {
            if (!global.isChatProcessing) { clearInterval(check); resolve("done"); }
          }, 5000);
        }),
        new Promise(resolve => setTimeout(() => resolve("timeout"), 2 * 60 * 1000))
      ]);
      if (waitResult === "timeout") {
        console.warn(`⚠️ [Sync] Таймаўт. Скідаем флаг і працягваем.`);
        global.isChatProcessing = false;
      } else {
        console.log(`✅ [Sync] Канвеер вызвалены. Працягваем.`);
      }
    }

   // 0. ПРЫЯРЫТЭТ: Калі рэкрутэр зараз нешта робіць уручную — аўтаматыка нават не спрабуе пачаць
    if (global.isManualActionInProgress && !forceRun) {
      console.log("⏳ [Sync] Аўтаматыка чакае: рэкрутэр выконвае ручную аперацыю...");
      return;
    }

    // 1. Чытаем стан і правяраем чаргу
    const syncState = await SyncState.findOne({ key: "circular_sync_position" });
    const hasPendingAi = await Vacancy.exists({ status: "pending_ai" });
    const isCircleIncomplete = syncState && syncState.isComplete === false;

   // 2. Логіка штодзённага запуску (пасля 07:00) (v7.7.1)
    const now = new Date();
    const currentHour = now.getHours();
    const lastFinish = syncState?.lastFullCircleAt ? new Date(syncState.lastFullCircleAt) : new Date(0);
    
    const isToday = lastFinish.toDateString() === now.toDateString();
    const wasDoneToday = isToday && syncState?.isComplete;

    // Новае кола пачынаем толькі пасля 7 раніцы і толькі калі сёння яшчэ не завяршалі поўнае кола
    const isTimeForNewCircle = currentHour >= 7 && !wasDoneToday;

    // 🛡️ ВЫЗНАЧАЕМ, ЦІ ТРЭБА ЗАПУСК (v7.7.1 - Чысты код без дубляў)
    let shouldRun = false;
    let reason = "";

    if (forceRun) { 
      reason = "Прымусовы запуск"; 
      shouldRun = true; 
    } else if (hasPendingAi) { 
      reason = "Ёсць неапрацаваныя вакансіі (pending_ai)"; 
      shouldRun = true; 
    } else if (isCircleIncomplete) { 
      reason = "Мінулае кола не завершана (рэтрай)"; 
      shouldRun = true; 
    } else if (isTimeForNewCircle) { 
      reason = "Час штодзённага сканавання (пасля 07:00)"; 
      shouldRun = true; 
    }

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
     // 2.5. ПРЫЯРЫТЭТ: Калі ёсць pending_ai — спачатку разграбаем іх!
    if (hasPendingAi) {
      console.log("🧹 [Sync] Знойдзены вакансіі ў чарзе. Запуск даапрацоўкі...");
      await retryPendingVacancies();
      // Калі мы толькі што разграбалі чаргу, не трэба адразу ісці ў табліцы, 
      // дамо AI адпачыць да наступнага цыкла watchdog.
      if (!forceRun) {
        console.log("✅ [Sync] Чаргу апрацавана. Спыняем бягучы цыкл.");
        global.isSyncRunning = false;
        return;
      }
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
  } finally {
    global.isSyncRunning = false;
    // 👈 ВЫЗВАЛЯЕМ ЗАМОК У БД (v8.15)
    await SyncState.findOneAndUpdate(
      { key: "circular_sync_position" },
      { isRunning: false }
    );
  }
} 
// Правяраем стан канвеера кожныя 10 хвілін - ЗАКАМЕНТАВАНА КАБ СІНХРАНІЗАВАЦЬ УРУЧНУЮ
cron.schedule("*/10 * * * *", async () => {
  console.log("🔍 [Watchdog] Праверка чаргі і стану сінхранізацыі...");
  await runSyncWithInsurance();
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
   registerCandidateBotHandlers(); // 👈 ДАДАЦЬ ГЭТА (строга перад startBot)
  startBot();
  startUserbot();

  // 👈 АДКЛЮЧАНА: аўтасканаванне пераведзена на ручны рэжым
  // runSyncWithInsurance();
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
// 👈 ДАДАДЗЕНА: Сінхранізацыя лічыльнікаў з рэальнымі дадзенымі (v8.21)
// Гэта патрэбна, каб пасля пераходу на $inc сістэма не пачала лічыць з 1.
async function syncCountersWithDatabase() {
  const Vacancy = require("./models/Vacancy");
  const Candidate = require("./models/Candidate"); // 👈 ДАДАДЗЕНА
  const Counter = require("./models/Counter");

  try {
    // 1. Сінхранізацыя для вакансій
    const lastVac = await Vacancy.findOne({}, { vacancyCode: 1 }).sort({ createdAt: -1 });
    if (lastVac && lastVac.vacancyCode) {
      const lastNum = parseInt(lastVac.vacancyCode.replace("VAC-", ""), 10);
      if (!isNaN(lastNum)) {
        await Counter.findOneAndUpdate({ name: "vacancy" }, { $set: { seq: lastNum } }, { upsert: true });
        console.log(`📊 [Init] Лічыльнік вакансій сінхранізаваны на: ${lastNum}`);
      }
    }

    // 2. Сінхранізацыя для кандыдатаў (v8.21)
    const lastCan = await Candidate.findOne({}, { candidateCode: 1 }).sort({ createdAt: -1 });
    if (lastCan && lastCan.candidateCode) {
      const lastNum = parseInt(lastCan.candidateCode.replace("CAN-", ""), 10);
      if (!isNaN(lastNum)) {
        await Counter.findOneAndUpdate({ name: "candidate" }, { $set: { seq: lastNum } }, { upsert: true });
        console.log(`📊 [Init] Лічыльнік кандыдатаў сінхранізаваны на: ${lastNum}`);
      }
    }
  } catch (err) {
    console.error("❌ [Init] Памылка сінхранізацыі лічыльнікаў:", err.message);
  }
}