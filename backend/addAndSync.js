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
const TrelloSource = require("./models/TrelloSource");
const trelloService = require("./services/trello.service");
// 3. ТОЛЬКІ ЗАРАЗ ЗАГРУЖАЕМ МОДУЛІ
const mongoose = require("mongoose");
const SheetSource = require("./models/SheetSource");
const sheetsService = require("./services/sheets.service");

const CONFIG = {
  spreadsheetId: "13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8",
  sheetName: "Польша",
  agencyName: "INTRASERVICE",
};
// КАНФІГУРАЦЫЯ: Калі хочаш апрацаваць УСЕ табліцы — пакінь null.
// Калі адну канкрэтную — упішы яе spreadsheetId.

// const TARGET_SHEET_ID = "13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8";
// const TARGET_SHEET_NAME = "Польша";
// const TARGET_AGENCY_NAME = "INTRASERVICE";
//---
// const TARGET_SHEET_ID = "13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8";
// const TARGET_SHEET_NAME = "Голандія";
// const TARGET_AGENCY_NAME = "INTRASERVICE";
//---
// const TARGET_SHEET_ID = "13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8";
// const TARGET_SHEET_NAME = "Opiekunki";
// const TARGET_AGENCY_NAME = "INTRASERVICE";
//---
// const TARGET_SHEET_ID = "1qASi88Ihwdw3LpFLQECg-7YSGuv07lZ4pMqFNyTgk8E";
// const TARGET_SHEET_NAME = "Вакансии 2026";
// const TARGET_AGENCY_NAME = "RALEN";
//---
// const TARGET_SHEET_ID = "1hzA99T1oYP64BvIGww6zdZcs4iJjJQT80hm1LZimMiQ";
// const TARGET_SHEET_NAME = "Вакансии";
// const TARGET_AGENCY_NAME = "MRÓWKI";
//---
const TARGET_SHEET_ID = "1ajkfjO8v5FcaNl-NDydc_NwihGgFlvdEkh38ouPwmj4";
const TARGET_SHEET_NAME = "WEEK 23";
const TARGET_AGENCY_NAME = "OTTO";
//---
// const TARGET_SHEET_ID = "18x5KvkUglitqcpr69F0q6z08vfF2BTnjYBlRdMtv8bA";
// const TARGET_SHEET_NAME = "vekos";
// const TARGET_AGENCY_NAME = "VEKOS";
//---
// const TARGET_SHEET_ID = "1-tUarxzFET_NOSp5n0LDvgoUxIKM80iGM8Taear2WyM";
// const TARGET_SHEET_NAME = "Вакансії";
// const TARGET_AGENCY_NAME = "BISAR";
//---
// const TARGET_SHEET_ID = "1-qVX4cW1G8oIPiDZjEYG_0nhNOTYY2iI0k8sp-gguko";
// const TARGET_SHEET_NAME = "Лист1";
// const TARGET_AGENCY_NAME = "WORK&HUMAN";
//---
// Калі хочаш апрацаваць УСЕ табліцы — пастаў null
// const TARGET_SHEET_ID = null;
// const TARGET_SHEET_NAME = "";
// const TARGET_AGENCY_NAME = "";

async function run() {
  try {
    console.log("🔌 Падключэнне да MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Падключана.");

    if (TARGET_SHEET_ID) {
      // Апрацоўка адной канкрэтнай табліцы
      let source = await SheetSource.findOne({
        spreadsheetId: TARGET_SHEET_ID,
        sheetName: TARGET_SHEET_NAME,
        agencyName: TARGET_AGENCY_NAME,
      });

      if (!source) {
        console.log(
          `📝 Дадаем новую крыніцу для тэсту (${TARGET_AGENCY_NAME})...`,
        );
        source = new SheetSource({
          spreadsheetId: TARGET_SHEET_ID,
          sheetName: TARGET_SHEET_NAME,
          agencyName: TARGET_AGENCY_NAME, // 👈 Замянілі "VEKOS" на зменную
        });
        await source.save();
      }

      // Прымусовы скід для тэсту (раскаментуй калі трэба)
      source.columnMap = {}; // Скід маппінгу для паўторнага AI-аналізу загалоўкаў
      // source.processedHashes = []; // ⚠️ ТОЛЬКІ ДЛЯ ПОЎНАГА ПЕРАСКАНАВАННЯ - НЕ ЎКЛЮЧАЦЬ У ПРАДАКШНЕ
      await source.save();

      console.log(
        `🚀 Запуск сінхранізацыі толькі для: ${TARGET_SHEET_NAME}...`,
      );
      await sheetsService.syncSheetVacancies(source._id);
    } else {
      // Апрацоўка ўсіх актыўных табліц
      await sheetsService.syncAllSheets();
      // Унутры функцыі run() пасля апрацоўкі Sheets:
      console.log("🚀 Запуск сінхранізацыі Trello...");
      await trelloService.syncAllTrelloBoards();
    }

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
