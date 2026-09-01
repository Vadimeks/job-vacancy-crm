// scripts/findShortVacancies.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Vacancy = require('../models/Vacancy');

async function findShortVacancies() {
  try {
    console.log("🚀 Падключэнне да БД...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("🔍 Пошук вакансій з originalText < 350 сімвалаў...");
    // Бяром усе, потым фільтруем даўжыню ў JS (Mongo не ўмее $strLenCP у query напрамую для sort/filter зручна)
    const all = await Vacancy.find(
      { status: { $in: ["active", "pending_ai", "closed", "archived"] } },
      { vacancyCode: 1, agencyName: 1, sourceType: 1, status: 1, vacancydescription: 1, originalText: 1 }
    );

    const short = all
      .filter(v => (v.originalText || "").length < 350)
      .map(v => ({
        vacancyCode: v.vacancyCode || null,
        agencyName: v.agencyName,
        sourceType: v.sourceType,
        status: v.status,
        length: (v.originalText || "").length,
        vacancydescription: v.vacancydescription,
        originalText: v.originalText,
      }))
      .sort((a, b) => a.length - b.length);

    const filePath = path.join(process.cwd(), 'short_vacancies.json');
    fs.writeFileSync(filePath, JSON.stringify(short, null, 2));

    console.log(`✅ Знойдзена: ${short.length} з ${all.length} усяго.`);
    console.log(`📄 Файл: ${filePath}`);

    // Кароткая статыстыка па агенцыях у кансоль
    const byAgency = {};
    short.forEach(v => { byAgency[v.agencyName] = (byAgency[v.agencyName] || 0) + 1; });
    console.log("📊 Па агенцыях:", byAgency);

    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
    process.exit(1);
  }
}

findShortVacancies();