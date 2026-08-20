// scripts/exportManpower.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Vacancy = require('../models/Vacancy'); // Правер шлях да мадэлі

async function exportManpower() {
  try {
    console.log("🚀 Падключэнне да БД...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("🔍 Пошук вакансій MANPOWER...");
    const vacancies = await Vacancy.find({ agencyName: "MANPOWER" });
    
    const data = vacancies.map(v => ({
      vacancyCode: v.vacancyCode,
      status: v.status,
      vacancydescription: v.vacancydescription,
      location: v.location,
      brand: v.brand,
      airtableId: v.airtableId,
      rawText: v.rawText
    }));

    const filePath = path.join(process.cwd(), 'manpower_export.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Экспарт завершаны! Захавана ${data.length} запісаў.`);
    console.log(`📄 Файл: ${filePath}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
    process.exit(1);
  }
}

exportManpower();