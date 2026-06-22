const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const airtableService = require("../services/airtable.service");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Падключана да базы для сінхранізацыі Airtable...");

    await airtableService.syncAirtable();

    console.log("\n✅ Сінхранізацыя завершана.");
  } catch (err) {
    console.error("❌ Памылка:", err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

run();