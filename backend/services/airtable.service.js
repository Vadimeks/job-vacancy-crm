const axios = require("axios");
const AirtableSource = require("../models/AirtableSource");
const Vacancy = require("../models/Vacancy");
const { processVacancyMessage } = require("../routes/vacancies");
const { analyzeAndCompareWithGemini } = require("./gemini.service");
const airtableScraper = require("./airtableScraper.service");

/**
 * Сінхранізацыя Airtable з выкарыстаннем поўнага AI-пайплайна
 */
async function syncAirtable() {
  // Прымусова сартуем так, каб JOB IMPULSE і MANPOWER (дзе ёсць shareId) заўжды ішлі ПЕРАД PROGRES
  const sources = await AirtableSource.find({ status: "active" }).sort({ shareId: -1, agencyName: 1 });
  console.log(`\n💎 [Airtable] Пачатак сінхранізацыі для ${sources.length} агенцый...`);

  for (const source of sources) {
    try {
      await syncSingleSource(source);
    } catch (err) {
      console.error(`❌ [Airtable] Памылка ў ${source.agencyName}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}

async function syncSingleSource(source) {
  console.log(`\n🚀 Сканаванне: ${source.boardName} (${source.agencyName})`);

  let records = [];

  if (source.shareId) {
    // 1. ВАРЫЯНТ СКРАПЕРА (Для Job Impulse і Manpower)
    const scraped = await airtableScraper.fetchSharedData(source.shareId);
    if (!scraped || scraped.length === 0) {
      console.log(`⚠️ Запісаў не знойдзена для ${source.agencyName}.`);
      return;
    }
    records = scraped;
  } else {
    // 2. ВАРЫЯНТ АФІЦЫЙНАГА API (Для Progres)
    try {
      const url = `https://api.airtable.com/v0/${source.baseId}/${source.tableId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
      });
      records = response.data.records || [];
    } catch (apiErr) {
      console.error(`❌ [API Error] ${source.agencyName}:`, apiErr.message);
      return;
    }
  }

  console.log(`📦 Атрымана запісаў ад скрапера/API: ${records.length}`);

  const foundAirtableIds = new Set();
  const stats = { added: 0, updated: 0, ignored: 0, closed: 0 };

  for (const row of records) {
    const airtableId = row.id;
    foundAirtableIds.add(airtableId);

    // Правяраем правілы валідацыі (напр. Актуальность === ДА), калі яны ёсць
    if (source.syncRules && source.syncRules.checkField) {
      const fName = source.syncRules.checkField;
      const expected = source.syncRules.checkValue;
      const actual = row.fields[fName];
      if (actual && String(actual).toLowerCase().trim() !== String(expected).toLowerCase().trim()) {
        stats.ignored++;
        continue;
      }
    }

    // Вызначаем калонку. Калі пуста — ставім "актуальное"
    let currentColumn = row.fields["Название колонки"] || row.columnName || "актуальное";

    // ПРАВЕРКА НАЗВАЎ КАЛОНАК (фільтрацыя гарадоў)
    if (source.includedColumns && source.includedColumns.length > 0) {
      const hasMatch = source.includedColumns.some(col => 
        currentColumn.toLowerCase().trim() === col.toLowerCase().trim()
      );
      // Калі калонка яўна вызначана, але яе няма ў дазволеных — ігнаруем
      if (!hasMatch && currentColumn !== "актуальное") {
        stats.ignored++;
        continue;
      }
    }

    // Збіраем увесь тэкст з палёў радка для AI
    let rawAirtableDump = `[Airtable ID: ${airtableId}]\n`;
    Object.entries(row.fields).forEach(([k, v]) => {
      if (k !== "Название колонки" && k !== "ColumnName" && v) {
        rawAirtableDump += `${k}: ${v}\n`;
      }
    });

    console.log(`🧠 AI апрацоўка для ${source.agencyName} (ID: ${airtableId})...`);

    // Шукаем існуючую вакансію ў нашай базе МАНГО
    const existingVacancy = await Vacancy.findOne({
      airtableId: airtableId,
      agencyName: source.agencyName,
      sourceType: "airtable"
    });

    // Адпраўляем у AI пайплайн
    const analysis = await analyzeAndCompareWithGemini(rawAirtableDump, [], []);

    if (!analysis || !analysis.translatedFragments || analysis.translatedFragments.length === 0) {
      stats.ignored++;
      continue;
    }

    for (let i = 0; i < analysis.translatedFragments.length; i++) {
      const fragment = analysis.translatedFragments[i];
      const fragmentHash = analysis.translatedFragments.length > 1 ? `${airtableId}_${i}` : airtableId;

      const result = await processVacancyMessage(
        fragment,
        "Airtable",
        source.agencyName,
        rawAirtableDump,
        false,
        analysis.category,
        fragmentHash,
        currentColumn,
        existingVacancy ? existingVacancy._id : null,
        "airtable"
      );

      if (result && result.error) {
        if (result.error.includes("AI_COOLDOWN") || result.error.includes("ALL_AI_MODELS_FAILED")) {
          console.error("🛑 Спыняем Airtable: AI недаступны.");
          return "STOP"; 
        }
      } else if (result) {
        if (existingVacancy) stats.updated++; else stats.added++;
      }
    }

    // Паўза, каб не спаміць ліміты AI
    await new Promise(r => setTimeout(r, 4000));
  }

  // АЎТА-ЗАКРЫЦЦЁ СТАРЫХ ВАКАНСІЙ
  const closeResult = await Vacancy.updateMany(
    {
      agencyName: source.agencyName,
      sourceType: "airtable",
      status: "active",
      airtableId: { $exists: true, $nin: Array.from(foundAirtableIds) }
    },
    {
      $set: {
        status: "closed",
        closedAt: new Date(),
        closingReason: "Выдалена або знікла з Airtable пры сінхранізацыі"
      }
    }
  );

  if (closeResult.modifiedCount > 0) {
    stats.closed = closeResult.modifiedCount;
  }

  console.log(`🏁 [${source.agencyName}] Сінхранізацыя завершана: +${stats.added} новых, 🔄 ${stats.updated} абноўлена, 🛑 ${stats.closed} закрыта. (Ігнаравана: ${stats.ignored})`);
}

module.exports = { syncAirtable };