// backend/scripts/dbMassClean.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Vacancy = require("../models/Vacancy");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const { analyzeAndCompareWithGemini } = require("../services/gemini.service");
const { processVacancyMessage } = require("../routes/vacancies");

const OUTPUT_DIR = path.join(__dirname, "output");
const startIndex = process.argv[2] ? parseInt(process.argv[2]) - 1 : 0;

function getLatestAuditFile() {
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith("audit-clean-") && f.endsWith(".json"));
  return files.length ? path.join(OUTPUT_DIR, files.sort().reverse()[0]) : null;
}

async function runMassClean() {
  try {
    const auditFile = getLatestAuditFile();
    if (!auditFile) return console.error("❌ Файл аўдыту не знойдзены.");
    console.log(`📂 Выкарыстоўваецца справаздача: ${path.basename(auditFile)}`);
    const audit = JSON.parse(fs.readFileSync(auditFile, "utf8"));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // 1. Апрацоўка Спліт-бага (Shared rawText)
    // Выдаляем усе вакансіі ў групе, акрамя першай, каб потым яе рэпарснуць
    console.log(`\n--- 🛠 Этап 1: Ачыстка спліт-бага (${audit.toFix_SharedRawText.length} груп) ---`);
    for (const group of audit.toFix_SharedRawText) {
      const [winnerId, ...toDelete] = group.ids;
      if (toDelete.length > 0) {
        const res = await Vacancy.deleteMany({ _id: { $in: toDelete } });
        console.log(`  🗑 Група [${group.codes[0]}]: выдалена ${res.deletedCount} дублікатаў.`);
      }
    }

    // 2. Збор усіх ID для праверкі (Неперакладзеныя + Лакацыі + Пераможцы спліт-бага)
    const splitWinners = audit.toFix_SharedRawText.map(g => g.ids[0]);
    const untranslatedIds = audit.toFix_Untranslated.map(v => v._id);
    const locationIssueIds = audit.toFix_LocationIssues.map(v => v._id);

    const allTargetIds = [...new Set([...splitWinners, ...untranslatedIds, ...locationIssueIds])];
    console.log(`\n--- 🧠 Этап 2: Перакласіфікацыя і рэпарсінг (${allTargetIds.length} вакансій) ---`);
    console.log(`🚀 Пачынаем з індэкса: ${startIndex + 1}`);

    for (let i = startIndex; i < allTargetIds.length; i++) {
      const id = allTargetIds[i];
      const v = await Vacancy.findById(id);
      if (!v) continue;

      console.log(`\n[${i + 1}/${allTargetIds.length}] Апрацоўка ${v.vacancyCode} (${v.agencyName})...`);

      try {
        // Крок А: Stage 1 (Класіфікацыя)
        const textToAnalyze = v.originalText || v.rawText;
        const analysis = await analyzeAndCompareWithGemini(textToAnalyze);

        if (!analysis) {
          // Калі AI вярнуў null, гэта можа быць альбо Cooldown, альбо памылка JSON
          // Мы не спыняем увесь працэс, а проста пазначаем памылку і ідзем далей
          console.log(`  ⚠️ Не ўдалося апрацаваць ${v.vacancyCode} (магчыма, занадта доўгі тэкст). Пропуск.`);
          continue; 
        }

        // Крок Б: Калі гэта НЕ вакансія (Інфа, Апдэйт, Шум)
        if (analysis.category !== "FULL_VACANCY") {
          console.log(`  📥 Катэгорыя: ${analysis.category}. Перанос у Inbox і выдаленне.`);
          
          await new UnprocessedMessage({
            sender: v.agencyName,
            agencyName: v.agencyName,
            text: analysis.translatedFragments?.join("\n\n---\n\n") || textToAnalyze,
            category: analysis.category === "RECRUITER_INFO" ? "info" : "update",
            source: v.sourceType || "manual",
            processed: false,
            aiAnalyzed: true
          }).save();

          await Vacancy.findByIdAndDelete(id);
          continue;
        }

        // Крок В: Калі гэта FULL_VACANCY — робім рэпарсінг (Stage 2)
        // Гэта выправіць мову і лакацыю
        console.log(`  ✨ Катэгорыя пацверджана. Запуск рэпарсінгу...`);
        await Vacancy.findByIdAndUpdate(id, { status: "pending_ai" });
        
        const result = await processVacancyMessage(
          analysis.translatedFragments,
          v.sender || "System",
          v.agencyName,
          v.originalText,
          v.isTruncated,
          "FULL_VACANCY",
          v.sourceHash,
          v.sheetName,
          v._id,
          v.sourceType,
          true // forceFull
        );

        if (result?.error) {
          console.error(`  ❌ Памылка Stage 2: ${result.error}`);
        } else {
          const upd = await Vacancy.findById(id);
          console.log(`  ✅ ГАТОВА: [${v.location}] -> [${upd.location}]`);
        }

      } catch (err) {
        console.error(`  ❌ Крытычная памылка для ${v.vacancyCode}: ${err.message}`);
      }

      // Паўза для захавання лімітаў
      await new Promise(r => setTimeout(r, 8000));
    }

    console.log("\n🏁 Працэдура ачысткі завершана.");
  } catch (err) {
    console.error("❌ Fatal Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

runMassClean();