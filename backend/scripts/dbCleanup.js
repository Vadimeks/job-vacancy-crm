// backend/scripts/dbCleanup.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Vacancy = require("../models/Vacancy");

const OUTPUT_DIR = path.join(__dirname, "output");

function getLatestAuditFile() {
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith("audit-clean-") && f.endsWith(".json"));
  if (files.length === 0) return null;
  return path.join(OUTPUT_DIR, files.sort().reverse()[0]);
}

function pickWinner(docs) {
  const statusRank = { active: 0, pending_ai: 0, closed: 1, archived: 2 };
  docs.sort((a, b) => {
    const rankA = statusRank[a.status] ?? 3;
    const rankB = statusRank[b.status] ?? 3;
    if (rankA !== rankB) return rankA - rankB;
    const lenA = (a.rawText || "").length;
    const lenB = (b.rawText || "").length;
    if (lenA !== lenB) return lenB - lenA;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  return docs[0];
}

async function runCleanup() {
  try {
    const auditFile = getLatestAuditFile();
    if (!auditFile) {
      console.error("❌ Файлы аўдыту не знойдзены.");
      return;
    }
    console.log(`📂 Выкарыстоўваецца справаздача: ${path.basename(auditFile)}`);
    const audit = JSON.parse(fs.readFileSync(auditFile, "utf8"));
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const idsToDelete = new Set();
    audit.toDelete_ShortVacancies.forEach(v => idsToDelete.add(v._id));

    const dupGroups = {};
    audit.duplicates_HighConfidence.forEach(pair => {
      if (!dupGroups[pair.groupKey]) dupGroups[pair.groupKey] = new Set();
      dupGroups[pair.groupKey].add(pair.a.id);
      dupGroups[pair.groupKey].add(pair.b.id);
    });

    for (const key in dupGroups) {
      const docs = await Vacancy.find({ _id: { $in: Array.from(dupGroups[key]) } }).lean();
      if (docs.length < 2) continue;
      const winner = pickWinner(docs);
      docs.forEach(d => {
        if (d._id.toString() !== winner._id.toString()) idsToDelete.add(d._id.toString());
      });
    }

    if (idsToDelete.size === 0) {
      console.log("✅ Дублікатаў не знойдзена.");
      return;
    }

    console.log(`⚠️ Будзе выдалена запісаў: ${idsToDelete.size}`);
    console.log("Напішыце 'yes' для пацверджання:");
    process.stdin.once('data', async data => {
      if (data.toString().trim().toLowerCase() === 'yes') {
        const res = await Vacancy.deleteMany({ _id: { $in: Array.from(idsToDelete) } });
        console.log(`🚀 Выдалена: ${res.deletedCount}`);
      } else console.log("❌ Скасавана.");
      process.exit();
    });
  } catch (err) { console.error(err); process.exit(1); }
}
runCleanup();