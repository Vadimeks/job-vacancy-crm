// backend/scripts/dbMassReparse.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Vacancy = require("../models/Vacancy");
const { processVacancyMessage } = require("../routes/vacancies");
const { enrichTextWithDocs } = require("../services/gemini.service");

const OUTPUT_DIR = path.join(__dirname, "output");
const startIndex = process.argv[2] ? parseInt(process.argv[2]) - 1 : 0;

function getLatestAuditFile() {
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith("audit-clean-") && f.endsWith(".json"));
  return files.length ? path.join(OUTPUT_DIR, files.sort().reverse()[0]) : null;
}

async function runMassReparse() {
  try {
    const auditFile = getLatestAuditFile();
    if (!auditFile) return console.error("❌ Файл аўдыту не знойдзены.");
    const audit = JSON.parse(fs.readFileSync(auditFile, "utf8"));
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const list = audit.toFix_LocationIssues;
    console.log(`🚀 У спісе: ${list.length}. Пачынаем з: ${startIndex + 1}`);

    for (let i = startIndex; i < list.length; i++) {
      const v = await Vacancy.findById(list[i]._id);
      if (!v) continue;
      console.log(`\n[${i + 1}/${list.length}] Рэпарсінг ${v.vacancyCode}...`);
      try {
        const originalStatus = v.status;
        await Vacancy.findByIdAndUpdate(v._id, { status: "pending_ai" });
        const enriched = await enrichTextWithDocs(v.originalText || v.rawText);
        const result = await processVacancyMessage(enriched, v.sender, v.agencyName, v.originalText, v.isTruncated, v.parsingResultType, v.sourceHash, v.sheetName, v._id, v.sourceType, true);

        if (result?.error) {
          await Vacancy.findByIdAndUpdate(v._id, { status: originalStatus });
          if (result.error.includes("429") || result.error.includes("COOLDOWN")) {
            console.log(`🛑 Ліміты. Працяг з нумара: ${i + 1}`); break;
          }
          console.log(`  ⏭️ Пропуск цяжкай вакансіі (JSON error).`); continue;
        }
        const upd = await Vacancy.findById(v._id);
        console.log(`  ✅ ГАТОВА: [${v.location}] -> [${upd.location}]`);
      } catch (err) { console.error(`  ❌ Памылка: ${err.message}`); }
      await new Promise(r => setTimeout(r, 12000));
    }
    console.log("\n🏁 Завершана.");
  } catch (err) { console.error(err); } finally { await mongoose.disconnect(); process.exit(); }
}
runMassReparse();