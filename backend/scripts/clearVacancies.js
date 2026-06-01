const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Vacancy = require("../models/Vacancy");
const SyncHistory = require("../models/SyncHistory");
const SheetSource = require("../models/SheetSource");
const Counter = require("../models/Counter");

async function nuclearCleanup() {
  try {
    console.log("🔌 Падключэнне да MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Падключана.");

    // 1. Выдаляем вакансіі
    const vacResult = await Vacancy.deleteMany({});
    console.log(`🗑 Выдалена вакансій: ${vacResult.deletedCount}`);

    // 2. Выдаляем гісторыю
    const histResult = await SyncHistory.deleteMany({});
    console.log(`🗑 Выдалена запісаў гісторыі: ${histResult.deletedCount}`);

    // 3. Скідваем хэшы ў крыніцах (каб сінхранізацыя пачалася з нуля)
    const sheetResult = await SheetSource.updateMany(
      {},
      { $set: { processedHashes: [], columnMap: {} } },
    );
    console.log(
      `🔄 Скінуты хэшы ў ${sheetResult.modifiedCount} крыніцах табліц.`,
    );

    // 4. Скідваем лічыльнік VAC-кодаў
    await Counter.findOneAndUpdate(
      { name: "vacancy" },
      { $set: { seq: 0 } },
      { upsert: true },
    );
    console.log("🔢 Лічыльнік VAC-кодаў скінуты на 0.");

    console.log("\n✨ БАЗА ГАТОВА ДА ЧЫСТАГА ПЕРАЗАПУСКУ v3.0!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка падчас ачысткі:", err.message);
    process.exit(1);
  }
}

nuclearCleanup();
