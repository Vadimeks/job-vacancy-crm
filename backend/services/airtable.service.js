const axios = require("axios");
const AirtableSource = require("../models/AirtableSource");
const Vacancy = require("../models/Vacancy");
const { processVacancyMessage } = require("../routes/vacancies");
const { analyzeAndCompareWithGemini } = require("./gemini.service");
const airtableScraper = require("./airtableScraper.service");
const SyncState = require("../models/SyncState"); // 👈 Дадаць да астатніх імпартаў
/**
 * Сінхранізацыя Airtable з выкарыстаннем поўнага AI-пайплайна
 */
async function syncAirtable() {
  const sources = await AirtableSource.find({ status: "active" }).sort({ shareId: -1, agencyName: 1 });
  console.log(`\n💎 [Airtable] Пачатак сінхранізацыі для ${sources.length} агенцый...`);

  for (const source of sources) {
    try {
      const result = await syncSingleSource(source);
      // 👈 ДАДАДЗЕНА: калі AI недаступны — спыняем усе крыніцы
      if (result === "STOP_ALL") {
        console.error("🛑 [Airtable] AI недаступны. Спыняем усе крыніцы.");
        return "STOP_ALL";
      }
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
    const scraped = await airtableScraper.fetchSharedData(source.shareId);
    if (!scraped || scraped.length === 0) {
      console.log(`⚠️ Запісаў не знойдзена для ${source.agencyName}.`);
      return;
    }
    records = scraped;
  } else {
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

  console.log(`📦 Атрымана запісаў: ${records.length}`);

  // 🔄 1. Чытаем стан "Кола" (Circular Sync)
  const syncState = await SyncState.findOne({ key: "circular_sync_position" }) || new SyncState();
  const startIndex = (syncState.lastSourceId?.toString() === source._id.toString()) ? syncState.lastIndex : 0;

  const foundAirtableIds = new Set();
  const stats = { added: 0, updated: 0, ignored: 0, closed: 0 };

  // 🔄 2. Адзіны цыкл па запісах
  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const airtableId = row.id;
    
    // 🛡️ Ахова ад памылковага закрыцця: рэгіструем ID адразу
    foundAirtableIds.add(airtableId);

    // Пропуск, калі мы яшчэ не дайшлі да патрэбнага індэкса ў гэтым коле
    if (i < startIndex) continue;

    const fields = row.fields;
    const columnName = (row.columnName || row.fields["Название колонки"] || "").toLowerCase();
    const fieldsText = Object.values(fields).join(" ").toLowerCase();

    // --- 1. ІНДЫВІДУАЛЬНАЯ ФІЛЬТРАЦЫЯ (Blacklist) ---
    let shouldIgnore = false;
    if (source.agencyName === "MANPOWER") {
      if (columnName.includes("згода rodo") || columnName.includes("uncategorized") || 
          columnName.includes("архів") || columnName.includes("архив") ||
          fieldsText.includes("азія") || fieldsText.includes("azja")) {
        shouldIgnore = true;
      }
    } else if (source.agencyName === "JOB IMPULSE") {
      if (columnName.includes("uncategorized") || columnName.includes("phillipinas") || columnName.includes("indian")) {
        shouldIgnore = true;
      }
    } else if (source.agencyName === "PROGRES") {
      if (columnName.includes("uncategorized") || columnName.includes("архів") || columnName.includes("archive")) {
        shouldIgnore = true;
      }
    }

    if (shouldIgnore) {
      stats.ignored++;
      continue;
    }

    // --- 2. ПРАВЕРКА НАЗВАЎ КАЛОНАК (Белы спіс) ---
    if (source.includedColumns && source.includedColumns.length > 0) {
      const isIncluded = source.includedColumns.some(col => 
        columnName.includes(col.toLowerCase().trim())
      );
      if (!isIncluded && columnName !== "актуальное") {
        stats.ignored++;
        continue;
      }
    }

    // --- 3. ПРАВЕРКА ПРАВІЛАЎ (Актуальность === ДА) ---
    if (source.syncRules && source.syncRules.checkField) {
      const actual = fields[source.syncRules.checkField];
      if (actual && String(actual).toLowerCase().trim() !== String(source.syncRules.checkValue).toLowerCase().trim()) {
        stats.ignored++;
        continue;
      }
    }

    // --- 4. ВЫЗНАЧЭННЕ СТАТУСУ ---
    let targetStatus = "active";
    if (source.agencyName === "MANPOWER") {
      if (columnName.includes("не активні") || fieldsText.includes("не активні")) {
        targetStatus = "closed";
      }
    }

    // --- 5. ЗБОР ТЭКСТУ ДЛЯ AI ---
    let rawAirtableDump = `[Airtable ID: ${airtableId}]\n`;
    Object.entries(fields).forEach(([k, v]) => {
      if (v && !k.toLowerCase().includes("rodo")) rawAirtableDump += `${k}: ${v}\n`;
    });

    // --- 6. ПРАВЕРКА НА ЗМЕНЫ (Resume Logic) ---
    const existingVacancy = await Vacancy.findOne({ airtableId, agencyName: source.agencyName });
    if (existingVacancy && existingVacancy.originalText === rawAirtableDump && existingVacancy.status === targetStatus) {
      stats.ignored++;
      continue;
    }

    console.log(`🧠 AI апрацоўка: ${source.agencyName} | ID: ${airtableId} | Status: ${targetStatus}`);

    const analysis = await analyzeAndCompareWithGemini(rawAirtableDump, [], []);
    
    // 🛡️ SAFETY SWITCH: Калі AI "ляснуў", запамінаем індэкс і спыняемся
    if (!analysis || !analysis.translatedFragments) {
      console.error(`🛑 [Airtable] AI Error для ${airtableId}. Запамінаем індэкс ${i} і спыняемся.`);
      await SyncState.findOneAndUpdate(
        { key: "circular_sync_position" },
        { lastSourceType: "airtable", lastSourceId: source._id, lastIndex: i },
        { upsert: true }
      );
      return "STOP_ALL";
    }

    for (const fragment of analysis.translatedFragments) {
      const result = await processVacancyMessage(
        fragment, "Airtable", source.agencyName, rawAirtableDump, false,
        analysis.category, airtableId, columnName, 
        existingVacancy ? existingVacancy._id : null, "airtable",
        false, targetStatus
      );

      if (result && !result.error) {
        const isRecentlyCreated = result.createdAt && (Date.now() - new Date(result.createdAt).getTime() < 60000);
        if (isRecentlyCreated && !existingVacancy) stats.added++; else stats.updated++;
      } else if (result?.error) {
        console.error(`🛑 [Airtable] AI Cooldown у парсеры. Спыняем на індэксе ${i}.`);
        await SyncState.findOneAndUpdate(
          { key: "circular_sync_position" },
          { lastSourceType: "airtable", lastSourceId: source._id, lastIndex: i },
          { upsert: true }
        );
        return "STOP_ALL";
      }
    }
    await new Promise(r => setTimeout(r, 4000));
  }

  // --- 7. РАЗУМНАЕ АЎТА-ЗАКРЫЦЦЁ ---
  if (foundAirtableIds.size > 0) {
    await Vacancy.updateMany(
      { agencyName: source.agencyName, sourceType: "airtable", status: "active", airtableId: { $exists: false } },
      { $set: { status: "closed", closingReason: "Заменена на версію з ID" } }
    );

    const closeMissing = await Vacancy.updateMany(
      { agencyName: source.agencyName, sourceType: "airtable", status: "active", airtableId: { $exists: true, $nin: Array.from(foundAirtableIds) } },
      { $set: { status: "closed", closingReason: "Знікла з Airtable" } }
    );
    stats.closed = closeMissing.modifiedCount;
  }

  // Скідваем індэкс пасля паспяховага завяршэння ўсёй табліцы
  await SyncState.findOneAndUpdate({ key: "circular_sync_position" }, { lastIndex: 0 });

  console.log(`🏁 [${source.agencyName}] Завершана: +${stats.added} новых, 🔄 ${stats.updated} абноўлена, 🛑 ${stats.closed} закрыта, ⏭️ ${stats.ignored} прапушчана.`);
}

module.exports = { syncAirtable };