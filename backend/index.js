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

const app = express();

// Налады мідлвараў
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Апрацоўка памылак парсінгу JSON (ахова ад бітых даных MacroDroid)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("⚠️ Атрыманы біты JSON. Ігнаруем памылку і працягваем.");
    return res.status(200).json({ status: "error_bad_json_ignored" });
  }
  next();
});

// Роўты
app.use("/api/vacancies", vacanciesRouter);
app.use("/api/inbox", inboxRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  startBot(); // Запускаем афіцыйнага бота для апавяшчэнняў
  startUserbot(); // Запускаем Telegram userbot у дочарным працэсе
});

// --- ЗАПУСК USERBOT У ДОЧАРНЫМ ПРАЦЭСЕ ---
// Чаму child_process, а не просты require():
//   userbot.js мае ўласны `await new Promise(() => {})` у канцы (бясконца),
//   і `process.exit(1)` пры крытычнай памылцы — гэта заб'е ўвесь сервер,
//   калі запускаць яго ўнутры таго ж працэсу.
//   Дочарны працэс ізаляваны: яго крах не закранае Express.
function startUserbot() {
  // Калі зменная не задана — маўчым (Render worker ці лакальны дэв без TG)
  if (!process.env.TELEGRAM_SESSION) {
    console.log("ℹ️ TELEGRAM_SESSION не задана — userbot не запускаецца.");
    return;
  }

  const userbotPath = path.join(__dirname, "userbot.js");

  function spawnUserbot() {
    console.log("🤖 Запуск Telegram userbot (child process)...");

    const child = spawn(process.execPath, [userbotPath], {
      env: process.env, // Перадаём усе env-зменныя
      stdio: "inherit", // Логі юзербота → той жа stdout (Render іх убачыць)
    });

    child.on("exit", (code, signal) => {
      // Перазапуск пры любым сканчэнні (апроч ручнога kill)
      if (signal === "SIGTERM" || signal === "SIGKILL") {
        console.log("🛑 Userbot спынены (SIGTERM/SIGKILL). Не перазапускаем.");
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
