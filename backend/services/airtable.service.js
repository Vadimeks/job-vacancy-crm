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
  const SyncState = require("../models/SyncState");
  const syncState = await SyncState.findOne({ key: "circular_sync_position" });
  const processedIds = syncState?.processedInCircle?.map(id => id.toString()) || [];

  // Бяром толькі тыя агенцыі, якіх НЯМА ў спісе апрацаваных
  const sources = await AirtableSource.find({ 
    status: "active",
    _id: { $nin: processedIds }
  }).sort({ shareId: -1, agencyName: 1 });

  console.log(`\n💎 [Airtable] Сінхранізацыя: ${sources.length} агенцый (прапушчана: ${processedIds.length})`);

  for (const source of sources) {
    try {
      const result = await syncSingleSource(source);
      
      if (result === "STOP_ALL") {
        console.error("🛑 [Airtable] AI недаступны. Спыняем усе крыніцы.");
        return "STOP_ALL";
      }

      // Пазначаем агенцыю як пройдзеную
      await SyncState.findOneAndUpdate(
        { key: "circular_sync_position" },
        { $addToSet: { processedInCircle: source._id } }
      );

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
// 👈 Ініцыялізацыя прагрэсу
  global.syncProgress = { current: 0, total: records.length, status: 'running', agency: source.agencyName };
  global.stopSyncRequested = false;

  // 🔄 1. Чытаем стан "Кола" (Circular Sync)
  const syncState = await SyncState.findOne({ key: "circular_sync_position" }) || new SyncState();
  const startIndex = (syncState.lastSourceId?.toString() === source._id.toString()) ? syncState.lastIndex : 0;

  const foundAirtableIds = new Set();
  const stats = { added: 0, updated: 0, ignored: 0, closed: 0 };

  // 🔄 2. Адзіны цыкл па запісах
  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const airtableId = row.id;
    const fields = row.fields;
    const columnName = (row.columnName || row.fields["Название колонки"] || "").toLowerCase();
    const fieldsText = Object.values(fields).join(" ").toLowerCase();
    
    // 🔍 ДЫЯГНОСТЫКА: Глядзім на структуру першага запісу
    if (i === startIndex) {
      console.log(`🔍 [Airtable Debug] Sample Record (${source.agencyName}): ID=${airtableId}, Column="${columnName}", Fields Keys=[${Object.keys(row.fields).join(", ")}]`);
    }
    // 👈 Праверка на прыпынак карыстальнікам
    if (global.stopSyncRequested) {
      console.log(`🛑 [Airtable] Сінхранізацыя ${source.agencyName} перарвана карыстальнікам.`);
      global.syncProgress.status = 'interrupted';
      global.isSyncRunning = false;
      return "STOP_ALL";
    }
    global.syncProgress.current = i + 1;
    
    let existingVacancy = await Vacancy.findOne({ airtableId });
    // 🛡️ Ахова ад памылковага закрыцця: рэгіструем ID адразу
    foundAirtableIds.add(airtableId);

    // Пропуск, калі мы яшчэ не дайшлі да патрэбнага індэкса ў гэтым коле
    if (i < startIndex) continue;


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
      console.log(`⏭️ [Airtable Skip] ${source.agencyName}: Blacklist (Column: "${columnName}", Text: "${fieldsText.substring(0, 50)}...")`);
      stats.ignored++;
      continue;
    }

   // --- 2. ПРАВЕРКА НАЗВАЎ КАЛОНАК (Белы спіс) ---
    // 👈 ФІКС: Для API-рэжыму (PROGRES) прапускаем гэтую праверку, бо там няма columnName
    if (source.shareId && source.includedColumns && source.includedColumns.length > 0) {
      const isIncluded = source.includedColumns.some(col => 
        columnName.includes(col.toLowerCase().trim())
      );
      if (!isIncluded && columnName !== "актуальное") {
         console.log(`⏭️ [Airtable Skip] ${source.agencyName}: Не ў белым спісе (Column: "${columnName}")`);
        stats.ignored++;
        continue;
      }
    }

    // --- 3. ПРАВЕРКА ПРАВІЛАЎ (Актуальность === ДА) ---
    if (source.syncRules && source.syncRules.checkField) {
      const actual = fields[source.syncRules.checkField];
      if (actual && String(actual).toLowerCase().trim() !== String(source.syncRules.checkValue).toLowerCase().trim()) {
         console.log(`⏭️ [Airtable Skip] ${source.agencyName}: Не прайшло па syncRules (${source.syncRules.checkField}: "${actual}")`);
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

    // --- ЭТАП 1: ЗБОР ДАДЗЕНЫХ ---
    let rawAirtableDump = "";

    // ПРАВЕРКА: Ці ёсць у нас ужо гатовы тэкст (пасля мінулага збою AI)?
    if (existingVacancy && existingVacancy.rawText && existingVacancy.status === "pending_ai") {
      console.log(`📦 Этап 4.5. Выкарыстоўваем захаваны тэкст Airtable (Stage 0/1 пропуск)`);
      rawAirtableDump = existingVacancy.rawText;
    } else {
      // 🛡️ ПРАВЕРКА НА ЗМЕНЫ (калі вакансія актыўная і тэкст той жа — прапускаем)
      // Будуем часовы дамп для параўнання
      let tempDump = `[Airtable ID: ${airtableId}]\n`;
      Object.entries(fields).forEach(([k, v]) => {
        if (v && !k.toLowerCase().includes("rodo")) tempDump += `${k}: ${v}\n`;
      });

      if (existingVacancy && existingVacancy.originalText === tempDump && existingVacancy.status === targetStatus) {
        console.log(`⏭️ [Airtable Skip] ${source.agencyName}: Поўны дублікат у базе (ID: ${existingVacancy.vacancyCode})`);
        stats.ignored++;
        continue;
      }

      rawAirtableDump = tempDump;

      // 💾 ЗАХАВАННЕ ПРАГРЭСУ: Калі вакансія новая, ствараем яе як чарнавік
      if (!existingVacancy) {
        const vacanciesRoute = require("../routes/vacancies");
        const vacancyCode = await vacanciesRoute.generateVacancyCode();
        
        const draft = new Vacancy({
          vacancyCode,
          airtableId: airtableId,
          sourceHash: airtableId, // Для Airtable ID запісу — гэта хэш
          agencyName: source.agencyName,
          sourceType: "airtable",
          status: "pending_ai",
          rawText: rawAirtableDump,
          originalText: rawAirtableDump
        });
        await draft.save();
        console.log(`💾 Этап 4.5. Тэкст Airtable захаваны ў базу (Draft ${vacancyCode} створаны)`);
        existingVacancy = draft;
      } else if (existingVacancy.originalText !== rawAirtableDump) {
        // Калі тэкст змяніўся — абнаўляем чарнавік перад AI
        existingVacancy.rawText = rawAirtableDump;
        existingVacancy.originalText = rawAirtableDump;
        existingVacancy.status = "pending_ai";
        await existingVacancy.save();
        console.log(`💾 Этап 4.5. Чарнавік Airtable ${existingVacancy.vacancyCode} абноўлены.`);
      }
    }

    console.log(`🧠 Этап 5. AI апрацоўка: ${source.agencyName} | ID: ${airtableId}`);
    const analysis = await analyzeAndCompareWithGemini(rawAirtableDump, [], []);
    
    // 🛡️ SAFETY SWITCH: Калі AI "ляснуў", запамінаем індэкс і спыняемся
    if (!analysis || !analysis.translatedFragments) {
      // 👈 ЗМЕНЕНА: Не спыняем Airtable, ідзем далей (v5.6)
      console.error(`⚠️ [Airtable] AI памылка для запісу ${airtableId}. Пропуск.`);
      stats.ignored++;
      continue;
    }

    // 🚀 БАТЧ-ВЫКЛІК: Адпраўляем усе фрагменты Airtable адным запытам
    const result = await processVacancyMessage(
      analysis.translatedFragments, // 👈 Перадаем увесь масіў
      "Airtable", source.agencyName, rawAirtableDump, false,
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

module.exports = { syncAirtable, syncSingleSource }; // 👈 Дададзены экспарт для ручной сінхранізацыі