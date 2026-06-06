const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const SheetSource = require("./models/SheetSource");

const SOURCES = [
  {
    agency: "INTRASERVICE",
    spreadsheetId: "13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8",
    sheetName: "Польша",
  },
  {
    agency: "INTRASERVICE",
    spreadsheetId: "13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8",
    sheetName: "Голандія",
  },
  {
    agency: "INTRASERVICE",
    spreadsheetId: "13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8",
    sheetName: "Opiekunki",
  },
  {
    agency: "RALEN",
    spreadsheetId: "1qASi88Ihwdw3LpFLQECg-7YSGuv07lZ4pMqFNyTgk8E",
    sheetName: "Вакансии 2026",
  },
  {
    agency: "MRÓWKI",
    spreadsheetId: "1hzA99T1oYP64BvIGww6zdZcs4iJjJQT80hm1LZimMiQ",
    sheetName: "Вакансии",
  },
  {
    agency: "OTTO",
    spreadsheetId: "1ajkfjO8v5FcaNl-NDydc_NwihGgFlvdEkh38ouPwmj4",
    sheetName: "WEEK 23",
  },
  {
    agency: "VEKOS",
    spreadsheetId: "18x5KvkUglitqcpr69F0q6z08vfF2BTnjYBlRdMtv8bA",
    sheetName: "vekos",
  },
  {
    agency: "BISAR",
    spreadsheetId: "1-tUarxzFET_NOSp5n0LDvgoUxIKM80iGM8Taear2WyM",
    sheetName: "Вакансії",
  },
  {
    agency: "WORK&HUMAN",
    spreadsheetId: "1-qVX4cW1G8oIPiDZjEYG_0nhNOTYY2iI0k8sp-gguko",
    sheetName: "Лист1",
  },
];

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Падключана да MongoDB для ачысткі...");

    const allInDb = await SheetSource.find({});
    console.log(`🔎 Знойдзена ў базе: ${allInDb.length} крыніц.`);

    let deletedCount = 0;

    for (const doc of allInDb) {
      const isValid = SOURCES.some(
        (s) =>
          s.spreadsheetId === doc.spreadsheetId &&
          s.sheetName === doc.sheetName,
      );

      if (!isValid) {
        console.log(
          `🗑️ Выдаляем лішняе: ${doc.agencyName} -> ${doc.sheetName} (_id: ${doc._id})`,
        );
        await SheetSource.findByIdAndDelete(doc._id);
        deletedCount++;
      }
    }

    console.log(
      `✅ Ачыстка завершана. Выдалена: ${deletedCount}. Засталося: ${allInDb.length - deletedCount}`,
    );

    // Скідваем лагі крона, каб наступны запуск быў "чыстым"
    const CronLog = mongoose.model(
      "CronLog",
      new mongoose.Schema({ taskName: String, lastRun: Date }),
    );
    await CronLog.deleteMany({ taskName: "sheets-sync" });
    console.log("🧹 Лог сінхранізацыі скінуты.");
  } catch (err) {
    console.error("❌ Памылка:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

cleanup();
