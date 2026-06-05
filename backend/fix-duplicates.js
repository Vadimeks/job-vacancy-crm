const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Vacancy = require("./models/Vacancy");
const CronLog = require("./models/CronLog");

const KNOWN_AGENCIES = [
  "APOLO",
  "BISAR",
  "EST",
  "EWL",
  "FOLGA",
  "FWS",
  "GLOBAL",
  "INTRASERVICE",
  "KONO",
  "KREON",
  "MANPOWER",
  "MRÓWKI",
  "NIDEN",
  "OTTO",
  "PERSONEL SERVICE",
  "PROGRES",
  "RALEN",
  "SG",
  "SOLANO",
  "STAFF POWER",
  "VEKOS",
  "WORK&HUMAN",
];

async function runFix() {
  try {
    console.log("🔌 Падключэнне да MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Падключана.");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Знаходзім усе новыя вакансіі (створаныя сёння)
    const newVacancies = await Vacancy.find({ createdAt: { $gte: today } });
    console.log(`🔍 Знойдзена сённяшніх вакансій: ${newVacancies.length}`);

    let deletedCount = 0;

    for (const fresh of newVacancies) {
      // Шукаем старыя дублікаты (створаныя ДА сёння)
      // ВАЖНА: Выкарыстоўваем Regex для ігнаравання рэгістра (v4.3)
      const result = await Vacancy.deleteMany({
        _id: { $ne: fresh._id },
        agencyName: fresh.agencyName,
        location: { $regex: new RegExp(`^${fresh.location}$`, "i") },
        vacancydescription: {
          $regex: new RegExp(`^${fresh.vacancydescription}$`, "i"),
        },
        createdAt: { $lt: today },
      });

      if (result.deletedCount > 0) {
        console.log(
          `🗑️ Выдалена старых дубляў для: ${fresh.vacancydescription} (${result.deletedCount} шт.)`,
        );
        deletedCount += result.deletedCount;
      }
    }

    console.log(`\n✅ Агулам выдалена старых дублікатаў: ${deletedCount}`);

    // 2. Выпраўляем sourceType для ўсіх астатніх
    const fixResult = await Vacancy.updateMany(
      {
        agencyName: { $in: KNOWN_AGENCIES },
        sourceType: { $ne: "spreadsheet" },
      },
      { $set: { sourceType: "spreadsheet" } },
    );
    console.log(
      `📝 Абноўлена іконак для астатніх вакансій: ${fixResult.modifiedCount}`,
    );

    // 3. Скідваем лог сінхранізацыі
    await CronLog.deleteOne({ taskName: "sheets-sync" });
    console.log("🧹 Лог сінхранізацыі скінуты.");

    console.log("\n🏁 Ачыстка завершана!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
    process.exit(1);
  }
}

runFix();
