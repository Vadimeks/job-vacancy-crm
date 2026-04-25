// backend/scripts/clearVacancies.js
const mongoose = require("mongoose");
require("dotenv").config();
const Vacancy = require("../models/Vacancy");

async function clearDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Vacancy.deleteMany({});
    console.log(`🗑 Выдалена вакансій: ${result.deletedCount}`);

    console.log("✨ База вакансій ачышчана!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
    process.exit(1);
  }
}

clearDB();
