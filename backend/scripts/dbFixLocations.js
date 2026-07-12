// backend/scripts/dbFixLocations.js
// 🛠️ Скрыпт выпраўлення лакацый (v2.3): прымусовы pending_ai перад рэпарсінгам,
// каб абыйсці "ахову ад фальшывых абнаўленняў" у processVacancyMessage,
// якая раней прапускала ўсе active-вакансіі без рэальнага AI-выкліку.
// Запуск: node scripts/dbFixLocations.js

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Vacancy = require("../models/Vacancy");
const { processVacancyMessage } = require("../routes/vacancies");
const { enrichTextWithDocs } = require("../services/gemini.service");

// 👈 УКАЖЫ ШЛЯХ ДА СВАЙГО АКТУАЛЬНАГА ФАЙЛА АЎДЫТУ
const AUDIT_FILE = path.join(__dirname, "output", "audit-clean-1783870950418.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runFix() {
  const fixLog = [];
  try {
    if (!fs.existsSync(AUDIT_FILE)) {
      console.error("❌ Файл аўдыту не знойдзены.");
      return;
    }

    const audit = JSON.parse(fs.readFileSync(AUDIT_FILE, "utf8"));
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Падключана да MongoDB");

    const list = audit.toFix_LocationIssues;
    console.log(`🛠️ Пачынаем выпраўленне ${list.length} лакацый...`);

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const vacancy = await Vacancy.findById(item._id);

      if (!vacancy) {
        console.log(`\n[${i + 1}/${list.length}] ⏭️ ${item.vacancyCode} — не знойдзена ў базе, пропуск.`);
        continue;
      }

      console.log(`\n[${i + 1}/${list.length}] Апрацоўка ${vacancy.vacancyCode} (статус: ${vacancy.status})...`);

      const oldData = {
        location: vacancy.location,
        title: vacancy.vacancydescription,
        status: vacancy.status, // 👈 ДАДАДЗЕНА: захоўваем зыходны статус для лога
      };

      const textToProcess = vacancy.originalText || vacancy.rawText;

      try {
        // 👈 ДАДАДЗЕНА: прымусова пераводзім у pending_ai ПЕРАД выклікам,
        // каб processVacancyMessage не спрацаваў "⏭️ Пропуск абнаўлення — зменаў няма"
        // (гэтая ўмова спрацоўвае толькі калі status === "active", таму раней
        // усе active-вакансіі ціха прапускаліся без рэальнага AI-выкліку).
        if (vacancy.status === "active") {
          await Vacancy.findByIdAndUpdate(vacancy._id, { status: "pending_ai" });
          console.log(`  🔄 Статус часова зменены на pending_ai (для абыходу ахоўнай праверкі)`);
        }

        const enrichedText = await enrichTextWithDocs(textToProcess);

        // Выклікаем парсінг
        await processVacancyMessage(
          enrichedText,
          vacancy.sender || "System",
          vacancy.agencyName,
          vacancy.originalText,
          vacancy.isTruncated,
          vacancy.parsingResultType,
          vacancy.sourceHash,
          vacancy.sheetName,
          vacancy._id,
          vacancy.sourceType,
          true, // forceFull
        );

        // Чытаем абноўлены запіс для параўнання
        const freshVac = await Vacancy.findById(vacancy._id);

        const changeEntry = {
          code: vacancy.vacancyCode,
          id: vacancy._id,
          before: oldData,
          after: {
            location: freshVac.location,
            title: freshVac.vacancydescription,
            status: freshVac.status, // 👈 ДАДАДЗЕНА: бачым фінальны статус
          },
          // 👈 ДАДАДЗЕНА: сапраўдны SUCCESS толькі калі location рэальна змяніўся
          status: freshVac.location !== oldData.location ? "SUCCESS" : "NO_CHANGE",
        };

        console.log(`  📍 Location: [${oldData.location}] -> [${freshVac.location}]`);
        if (oldData.title !== freshVac.vacancydescription) {
          console.log(`  📝 Title: [${oldData.title}] -> [${freshVac.vacancydescription}]`);
        }
        if (changeEntry.status === "NO_CHANGE") {
          console.log(`  ⚠️ Лакацыя не змянілася — магчыма, AI зноў вярнуў кірыліцу ці "Польща"/краіну па змаўчанні.`);
        }

        fixLog.push(changeEntry);
      } catch (aiErr) {
        console.error(`  ❌ Памылка AI для ${vacancy.vacancyCode}: ${aiErr.message}`);
        fixLog.push({ code: vacancy.vacancyCode, id: vacancy._id, error: aiErr.message, status: "ERROR" });

        // 👈 ЗМЕНЕНА: лепшая дэтэкцыя лімітаў (раней "limit"/"429" не лавілі AI_COOLDOWN/ALL_AI_MODELS_FAILED)
        const isLimitError =
          aiErr.message.includes("429") ||
          aiErr.message.includes("limit") ||
          aiErr.message.includes("AI_COOLDOWN") ||
          aiErr.message.includes("ALL_AI_MODELS_FAILED");

        if (isLimitError) {
          console.log("⏳ Дасягнуты ліміт AI. Чакаем 60 секунд...");
          await sleep(60000); // 👈 ЗМЕНЕНА: было 15000, цяпер 60000 — дае мадэлям больш часу на "адпачынак"
        }
      }

      await sleep(3000);
    }

    // Захаванне справаздачы
    const reportPath = path.join(__dirname, "output", `fix-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(fixLog, null, 2));

    // 👈 ДАДАДЗЕНА: кароткая зводка ў консоль
    const successCount = fixLog.filter((f) => f.status === "SUCCESS").length;
    const noChangeCount = fixLog.filter((f) => f.status === "NO_CHANGE").length;
    const errorCount = fixLog.filter((f) => f.status === "ERROR").length;

    console.log(`\n========== ВЫНІКІ ФІКСУ ==========`);
    console.log(`✅ Сапраўды выпраўлена: ${successCount}`);
    console.log(`⚠️ Без зменаў (NO_CHANGE): ${noChangeCount}`);
    console.log(`❌ Памылкі: ${errorCount}`);
    console.log(`💾 Справаздача: ${reportPath}`);
    console.log(`===================================\n`);
  } catch (err) {
    console.error("❌ Крытычная памылка:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

runFix();