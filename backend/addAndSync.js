const path = require("path");
const fs = require("fs");

// 1. СПРАБУЕМ ЗНАЙСЦІ .env ДА ЗАГРУЗКІ СЭРВІСАЎ
const envPaths = [
  path.join(__dirname, ".env"), // у папцы backend/
  path.join(__dirname, "../.env"), // у корані праекта
];

let envFound = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
    console.log(`✅ .env загружаны з: ${envPath}`);
    envFound = true;
    break;
  }
}

if (!envFound) {
  console.error(
    "❌ ПАМЫЛКА: Файл .env не знойдзены. Пераканайся, што ён ёсць у /backend або ў корані.",
  );
  process.exit(1);
}

// 2. ПРАВЕРКА КЛЮЧОЎ ПЕРАД ЗАГРУЗКАЙ МОДУЛЯЎ
if (!process.env.GROQ_API_KEY || !process.env.MONGODB_URI) {
  console.error("❌ ПАМЫЛКА: У .env адсутнічае GROQ_API_KEY або MONGODB_URI");
  console.log(
    "Даступныя зменныя:",
    Object.keys(process.env).filter((k) => !k.includes("npm_")),
  );
  process.exit(1);
}

// 3. ТОЛЬКІ ЗАРАЗ ЗАГРУЖАЕМ МОДУЛІ
const mongoose = require("mongoose");
const SheetSource = require("./models/SheetSource");
const sheetsService = require("./services/sheets.service");

const CONFIG = {
  spreadsheetId: "13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8",
  sheetName: "Польша",
  agencyName: "INTRASERVICE",
};

async function run() {
  try {
    console.log("🔌 Падключэнне да MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Падключана.");

    let source = await SheetSource.findOne({
      spreadsheetId: CONFIG.spreadsheetId,
      sheetName: CONFIG.sheetName,
    });

    if (!source) {
      source = new SheetSource(CONFIG);
      await source.save();
      console.log(`📝 Крыніца "${CONFIG.sheetName}" дададзена ў базу.`);
    } else {
      console.log(`ℹ️ Крыніца "${CONFIG.sheetName}" ужо ёсць у базе.`);

      // 1. Скідваем мапінг слупкоў (каб AI праверыў іх зноў)
      source.columnMap = {};

      // 2. АЧЫШЧАЕМ ГІСТОРЫЮ ХЭШАЎ (каб прайсці па ўсіх радках зноў)
      source.processedHashes = [];

      await source.save();
      console.log("🧹 Гісторыя апрацоўкі і мапінг слупкоў ачышчаны.");
    }

    console.log(`🚀 Запуск сінхранізацыі для ${CONFIG.agencyName}...`);
    await sheetsService.syncSheetVacancies(source._id);

    console.log("🏁 Працэдура завершана.");
  } catch (err) {
    console.error("❌ Памылка падчас выканання:", err.message);
    if (err.stack) console.error(err.stack);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

run();
