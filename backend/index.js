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
// Запуск сінхранізацыі кожную раніцу а 07:00
cron.schedule("0 7 * * *", async () => {
  console.log("⏰ CRON: Пачатак штодзённай сінхранізацыі табліц...");
  try {
    await syncAllSheets();
    console.log("✅ CRON: Сінхранізацыя завершана паспяхова.");
  } catch (err) {
    console.error("❌ CRON: Памылка сінхранізацыі:", err.message);
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  startBot();
  startUserbot();
  // 🧪 Тэставы запуск сінхранізацыі праз 10 секунд пасля старту (толькі для праверкі дэплою)
  // setTimeout(() => {
  //   console.log("🚀 Тэставы запуск сінхранізацыі табліц...");
  //   syncAllSheets().catch((err) =>
  //     console.error("❌ Памылка тэставага запуску:", err.message),
  //   );
  // }, 10000);
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
