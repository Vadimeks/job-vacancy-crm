const axios = require("axios");
const AirtableSource = require("../models/AirtableSource");
const Vacancy = require("../models/Vacancy");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const { processVacancyMessage } = require("../routes/vacancies");
const { analyzeAndCompareWithGemini } = require("./gemini.service");
const airtableScraper = require("./airtableScraper.service");
const SyncState = require("../models/SyncState"); 
const { checkVacancyGatekeeper } = require("../utils/messageFilters");
const { notifyDev } = require("./telegram.service"); // 👈 Дадаць імпарт
/**
 * Сінхранізацыя Airtable з выкарыстаннем поўнага AI-пайплайна
 */
async function syncAirtable() {

  const syncState = await SyncState.findOne({ key: "circular_sync_position" });
  const processedIds = syncState?.processedInCircle?.map(id => id.toString()) || [];

  // Бяром толькі тыя агенцыі, якіх НЯМА ў спісе апрацаваных
  const sources = await AirtableSource.find({ 
    status: "active",
    _id: { $nin: processedIds }
  }).sort({ shareId: -1, agencyName: 1 });

  global.logger(`\n💎 [Airtable] Сінхранізацыя: ${sources.length} агенцый (прапушчана: ${processedIds.length})`);

  for (const source of sources) {
    try {
      const result = await syncSingleSource(source);
      
      if (result === "STOP_ALL") {
        global.logger("🛑 [Airtable] AI недаступны. Спыняем усе крыніцы.");
        return "STOP_ALL";
      }

      // Пазначаем агенцыю як пройдзеную
      await SyncState.findOneAndUpdate(
        { key: "circular_sync_position" },
        { $addToSet: { processedInCircle: source._id } }
      );

    } catch (err) {
      global.logger(`❌ [Airtable] Памылка ў ${source.agencyName}: ${err.message}`);
      await notifyDev(`❌ <b>Airtable Sync Error</b>\nAgency: ${source.agencyName}\nError: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}

async function syncSingleSource(source) {
  global.logger(`\n🚀 Сканаванне: ${source.boardName} (${source.agencyName})`);

  let records = [];
  if (source.shareId) {
    const scraped = await airtableScraper.fetchSharedData(source.shareId);
    if (!scraped || scraped.length === 0) {
      global.logger(`⚠️ Запісаў не знойдзена для ${source.agencyName}.`);
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
      global.logger(`❌ [Airtable] Памылка ў ${source.agencyName}: ${err.message}`);
      return;
    }
  }

  global.logger(`📦 Атрымана запісаў: ${records.length}`);
// 👈 Ініцыялізацыя прагрэсу
  global.syncProgress = { current: 0, total: records.length, status: 'running', agency: source.agencyName };
  global.stopSyncRequested = false;

  // 🔄 1. Чытаем стан "Кола" (Circular Sync)
  const syncState = await SyncState.findOne({ key: "circular_sync_position" }) || new SyncState();
  const startIndex = (syncState.lastSourceId?.toString() === source._id.toString()) ? syncState.lastIndex : 0;

  const foundAirtableIds = new Set();
  const stats = { added: 0, updated: 0, ignored: 0, closed: 0 };
const failedRows = [];

  // 🔄 2. Адзіны цыкл па запісах
  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const airtableId = row.id;
    const fields = row.fields;
    const cardTitle = (fields["Назва"] || "").toLowerCase().trim(); // 👈 Здабываем загаловак для дакладнай фільтрацыі
    const columnName = (row.columnName || row.fields["Название колонки"] || "").toLowerCase();
    // 👈 ВЫПРАЎЛЕНА: Бяспечны збор тэксту без [object Object] (v8.4)
    const fieldsText = Object.values(fields)
      .map(v => typeof v === 'object' ? JSON.stringify(v) : String(v))
      .join(" ")
      .toLowerCase();
    
    // 🔍 ДЫЯГНОСТЫКА: Глядзім на структуру першага запісу
    if (i === startIndex) {
      global.logger(`🔍 [Airtable Debug] Sample Record (${source.agencyName}): ID=${airtableId}, Column="${columnName}", Fields Keys=[${Object.keys(row.fields).join(", ")}]`);
    }
    // 👈 Праверка на прыпынак карыстальнікам
    if (global.stopSyncRequested) {
      global.logger(`🛑 [Airtable] Сінхранізацыя ${source.agencyName} перарвана карыстальнікам.`);
      global.syncProgress.status = 'interrupted';
      global.isSyncRunning = false;
      return "STOP_ALL";
    }

    // 👈 ДАДАДЗЕНА: Паўза, калі рэкрутэр выконвае ручную аперацыю (той жа механізм, што і ў sheets.service.js / trello.service.js)
    if (!global.isManualSync && global.isManualActionInProgress) {
      while (global.isManualActionInProgress) {
        global.logger(`⏳ [Airtable Sync] Фонавая аўтаматыка на паўзе: рэкрутэр працуе ўручную...`);
        await new Promise(r => setTimeout(r, 5000));
      }
    }

    global.syncProgress.current = i + 1;
    // 👈 ДАДАДЗЕНА (v8.36): Heartbeat
    if (i % 5 === 0) {
      await SyncState.findOneAndUpdate({ key: "circular_sync_position" }, { lockedAt: new Date() });}
      
    // 👈 ЗМЕНЕНА (v8.55): дадана sourceHash: airtableId, каб пры сплітынгу знаходзіць
    // менавіта "радзіцельскі"/адзінкавы запіс, а не выпадковае дзіця сям'і (у дзяцей
    // airtableId той жа, але sourceHash = "${airtableId}-N")
    let existingVacancy = await Vacancy.findOne({ airtableId, sourceHash: airtableId });
    // 🛡️ Ахова ад памылковага закрыцця: рэгіструем ID адразу
    foundAirtableIds.add(airtableId);

    // Пропуск, калі мы яшчэ не дайшлі да патрэбнага індэкса ў гэтым коле
    if (i < startIndex) continue;


    // --- 1. ІНДЫВІДУАЛЬНАЯ ФІЛЬТРАЦЫЯ (Blacklist v8.22) ---
    let shouldIgnore = false;
    if (source.agencyName === "MANPOWER") {
      // А) Праверка слупкоў (Катэгорый) — тут усё застаецца як было
      const isBadColumn = 
        columnName.includes("rodo") || 
        columnName.includes("uncategorized") || 
        columnName.includes("виплата") ||
        columnName.includes("1500");

      // Б) Праверка менавіта ЗАГАЛОЎКА (каб не забіць апісанне вакансіі)
      const isTrashTitle = 
        cardTitle.includes("як створити cv") || 
        cardTitle.includes("документи для uz") || 
        cardTitle.includes("оплата фоп") ||
        cardTitle.includes("про manpower") ||
        cardTitle.includes("контакт з нами") ||
        cardTitle.includes("умови співпраці") ||
        cardTitle.includes("wniosek o udzielenie") ||
        cardTitle.includes("oświadczenie o przekroczeniu") ||
        (cardTitle === "опис вакансії" && fieldsText.length < 600); // Толькі калі загаловак пусты і тэксту мала

      // В) Праверка на рэкруцэрскія маркеры (якіх НІКОЛІ няма ў вакансіях для кандыдатаў)
      const isRecruiterOnly = 
        fieldsText.includes("винагороду за кандидатів") || 
        fieldsText.includes("прайс в документі ексель");

      // Г) Праверка метак (Тэгаў)
      const isBadLabel = 
        fieldsText.includes("архів") || 
        fieldsText.includes("архив") || 
        fieldsText.includes("тимчасово") || 
        fieldsText.includes("временно") ||
        fieldsText.includes("азія") || 
        fieldsText.includes("azja");

      if (isBadColumn || isTrashTitle || isRecruiterOnly || isBadLabel) {
        shouldIgnore = true;
      }
    } else if (source.agencyName === "JOB IMPULSE") {
      // 👈 АБНОЎЛЕНА: поўная блакіроўка непатрэбных катэгорый (v8.11)
      if (
        columnName.includes("uncategorized") || 
        columnName.includes("philipinas") || 
        columnName.includes("indian") 
      ) {
        shouldIgnore = true;
      }
    
   } else if (source.agencyName === "PROGRES") {
      // 👈 ВЫПРАЎЛЕНА: Progres выкарыстоўвае поле "Для кого:", а не назву калонкі (v8.3)
      const progresStatus = (fields["Для кого:"] || "").toLowerCase();
      if (columnName.includes("uncategorized") || progresStatus.includes("архів") || progresStatus.includes("archive")) {
        shouldIgnore = true;
      }
    }

       if (shouldIgnore) {
      global.logger(`⏭️ [Airtable Skip] ${source.agencyName}: Blacklist (Column: "${columnName}")`);
      // 👈 ЗМЕНЕНА (v8.55): закрываем УСЮ сям'ю (бацька застаецца archived і не чапаецца,
      // бо яго status ніколі не "active"/"pending_ai")
      const closedFamily = await Vacancy.updateMany(
        { airtableId, status: { $in: ["active", "pending_ai"] } },
        { $set: { status: "closed", closingReason: `Агенцкі Blacklist/Архіў (${source.agencyName})` } }
      );
      if (closedFamily.modifiedCount > 0) {
        global.logger(`✅ Закрыта ${closedFamily.modifiedCount} вакансій сям'і (ID: ${airtableId}) праз фільтр.`);
      }
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
         global.logger(`⏭️ [Airtable Skip] ${source.agencyName}: Не ў белым спісе (Column: "${columnName}")`);
        stats.ignored++;
        continue;
      }
    }

    // --- 3. ПРАВЕРКА ПРАВІЛАЎ (Актуальность === ДА) ---
    if (source.syncRules && source.syncRules.checkField) {
      const actual = fields[source.syncRules.checkField];
      if (actual && String(actual).toLowerCase().trim() !== String(source.syncRules.checkValue).toLowerCase().trim()) {
         global.logger(`⏭️ [Airtable Skip] ${source.agencyName}: Не прайшло па syncRules (${source.syncRules.checkField}: "${actual}")`);
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
      global.logger(`📦 Этап 4.5. Выкарыстоўваем захаваны тэкст Airtable (Stage 0/1 пропуск)`);
      rawAirtableDump = existingVacancy.rawText;
    } else {
      // 🛡️ ПРАВЕРКА НА ЗМЕНЫ (калі вакансія актыўная і тэкст той жа — прапускаем)
      // Будуем часовы дамп для параўнання
      let tempDump = `[Airtable ID: ${airtableId}]\n`;
      Object.entries(fields).forEach(([k, v]) => {
        if (v && !k.toLowerCase().includes("rodo")) tempDump += `${k}: ${v}\n`;
      });

      // 👈 ВЫПРАЎЛЕНА: Спачатку прысвойваем тэкст (v8.7)
      rawAirtableDump = tempDump;

      // 👈 ПЕРАНЕСЕНА ВЫШЭЙ: Жалезны Санітар (v8.7)
      // Цяпер ён спрацуе нават калі тэкст не змяніўся, і закрые вакансію пры наяўнасці STOP
      const gateVerdict = checkVacancyGatekeeper(rawAirtableDump, columnName);
      
      if (gateVerdict === "IGNORE") {
        global.logger(`⏭️ [Gatekeeper Skip] ${source.agencyName}: Смецце або кароткі тэкст.`);
        stats.ignored++;
        continue;
      }
      
            if (gateVerdict === "CLOSE") {
        global.logger(`🔴 [Gatekeeper Close] ${source.agencyName}: Знойдзены СТОП-маркер.`);
        // 👈 ЗМЕНЕНА (v8.55): закрываем УСЮ сям'ю дзяцей, бацька застаецца archived
        const closedFamily = await Vacancy.updateMany(
          { airtableId, status: { $in: ["active", "pending_ai"] } },
          { $set: { status: "closed", closingReason: "Маркер СТОП у тэксце (Gatekeeper)" } }
        );
        if (closedFamily.modifiedCount > 0) {
          global.logger(`✅ Закрыта ${closedFamily.modifiedCount} вакансій сям'і (ID: ${airtableId}) праз Gatekeeper.`);
        }
        stats.ignored++;
        continue;
      }

            // 🛡️ ПРАВЕРКА НА ДУБЛІКАТ (v8.7)
      // Цяпер яна ідзе ПАСЛЯ Санітара, таму не блакуе закрыццё
      // 👈 ЗМЕНЕНА (v8.55): для бацькоўскага запісу (isSplitParent) статус заўсёды "archived"
      // і ніколі не супадзе з targetStatus — таму для яго параўноўваем толькі тэкст
      const isDuplicateText = existingVacancy && existingVacancy.originalText === rawAirtableDump &&
        (existingVacancy.isSplitParent || existingVacancy.status === targetStatus);
      if (isDuplicateText) {
        global.logger(`⏭️ [Airtable Skip] ${source.agencyName}: Поўны дублікат у базе (ID: ${existingVacancy.vacancyCode || existingVacancy.airtableId})`);
        stats.ignored++;
        continue;
      }
      
      // 💾 ЗАХАВАННЕ ПРАГРЭСУ (v8.40): Абнаўляем толькі калі ўжо звязана па ID. 
      // Калі ID новы — пакідаем existingVacancy = null, каб спрацаваў семантычны пошук у processVacancyMessage.
      if (existingVacancy && existingVacancy.originalText !== rawAirtableDump) {
        existingVacancy.rawText = rawAirtableDump;
        existingVacancy.originalText = rawAirtableDump;
        existingVacancy.status = "pending_ai";
        await existingVacancy.save();
        global.logger(`💾 Этап 4.5. Чарнавік Airtable ${existingVacancy.vacancyCode} абноўлены.`);
      }
    }

    global.logger(`🧠 Этап 5. AI апрацоўка: ${source.agencyName} | ID: ${airtableId}`);
    const analysis = await analyzeAndCompareWithGemini(rawAirtableDump, [], []);

    // 👈 ВЫПРАЎЛЕНА: Абарона ад крашу, калі AI недаступны (v8.19)
    if (!analysis) {
      global.logger(`⚠️ [Airtable] AI недаступны для запісу ${airtableId}. Пропуск.`);
      stats.ignored++;
      continue;
    }
    // 🔍 ДЫЯГНОСТЫКА (часова, v8.3): правяраем гіпотэзу пра UPDATE, які пралазіць міма фільтра
    global.logger(`🔍 [Category Debug] ${source.agencyName} | ID: ${airtableId} | Column: "${columnName}" | AI Category: ${analysis?.category || "NULL"} | Title: "${rawAirtableDump.substring(0, 60).replace(/\n/g, " ")}..."`);
    // 👈 ВЫПРАЎЛЕНА: Вакансія ствараецца ТОЛЬКІ пры FULL_VACANCY. Усё астатняе (UPDATE, INFO) — у Inbox (v8.3)
    if (analysis.category !== "FULL_VACANCY") {
      const msgCategory = analysis.category === "UPDATE" ? "update" : "info";
      global.logger(`📥 [Airtable] Катэгорыя ${analysis.category} -> ${global.isManualSync ? 'Адпраўка ў Inbox' : 'Толькі ў лог'}`);
      
      if (global.isManualSync) {
        await new UnprocessedMessage({
          sender: source.agencyName,
          agencyName: source.agencyName,
          text: `[Airtable: ${columnName || "API"}]\n${rawAirtableDump}`,
          source: "airtable",
          category: msgCategory,
          processed: false,
          aiAnalyzed: true
        }).save();
      }
      stats.ignored++;
      continue; 
    }
    // 🛡️ SAFETY SWITCH: Калі AI "ляснуў", запамінаем індэкс і спыняемся
    if (!analysis || !analysis.translatedFragments) {
      // 👈 ЗМЕНЕНА: Не спыняем Airtable, ідзем далей (v5.6)
      global.logger(`⚠️ [Airtable] AI памылка для запісу ${airtableId}. Пропуск.`);
      stats.ignored++;
      continue;
    }

        // 👈 ДАДАДЗЕНА (v8.55): вызначаем, ці гэта картка з некалькімі пасадамі (сплітынг)
    const fragments = analysis.translatedFragments;
    const isSplitCard = fragments.length > 1;

    if (isSplitCard) {
      global.logger(`🧩 [Airtable Split] ${source.agencyName}: картка ${airtableId} разбітая на ${fragments.length} пасад(ы).`);

      // 1. Захоўваем/абнаўляем радзіцельскі запіс (не паказваецца рэкрутэру, толькі для параўнання тэксту карткі)
      await Vacancy.findOneAndUpdate(
        { airtableId, sourceHash: airtableId },
        {
          $set: {
            agencyName: source.agencyName,
            sourceType: "airtable",
            sheetName: columnName,
            airtableId,
            sourceHash: airtableId,
            isSplitParent: true,
            status: "archived",
            originalText: rawAirtableDump,
            rawText: rawAirtableDump,
          },
        },
        { upsert: true }
      );

      // 2. Апрацоўваем кожную пасаду асобна, са сваім унікальным sourceHash (airtableId-1, -2, ...)
      const usedHashes = [];
      let splitFailed = false;

      for (let idx = 0; idx < fragments.length; idx++) {
        const childHash = `${airtableId}-${idx + 1}`;
        usedHashes.push(childHash);

        const childResult = await processVacancyMessage(
          [fragments[idx]],
          "Airtable", source.agencyName, rawAirtableDump, false,
          analysis.category, childHash, columnName,
          null, "airtable",
          false, targetStatus
        );

        if (childResult && !childResult.error) {
          const isRecentlyCreated = childResult.createdAt && (Date.now() - new Date(childResult.createdAt).getTime() < 60000);
          if (isRecentlyCreated) stats.added++; else stats.updated++;
        } else if (childResult?.error) {
          global.logger(`⚠️ [Airtable Split] Пасада ${childHash} не дапрацавана. Прычына: ${childResult.error}`);
          failedRows.push({ id: childHash, title: cardTitle || "Без назви", reason: childResult.error });

          if (childResult.error.includes("AI_COOLDOWN")) {
            global.logger(`🛑 [Airtable] AI Cooldown у парсеры (сплітынг). Спыняем на індэксе ${i}.`);
            await SyncState.findOneAndUpdate(
              { key: "circular_sync_position" },
              { lastSourceType: "airtable", lastSourceId: source._id, lastIndex: i },
              { upsert: true }
            );
            splitFailed = true;
            break;
          }
        }
      }

      if (splitFailed) return "STOP_ALL";

      // 3. Закрываем пасады, якіх больш няма ў картцы (калі колькасць паменшылася)
      const staleChildren = await Vacancy.updateMany(
        { airtableId, sourceHash: { $ne: airtableId, $nin: usedHashes }, status: { $in: ["active", "pending_ai"] } },
        { $set: { status: "closed", closingReason: "Пасада больш не згадваецца ў картцы" } }
      );
      if (staleChildren.modifiedCount > 0) {
        global.logger(`✅ [Airtable Split] Закрыта ${staleChildren.modifiedCount} пасад(ы), якіх больш няма ў картцы ${airtableId}.`);
        stats.closed += staleChildren.modifiedCount;
      }

    } else {
      // 🚀 БАТЧ-ВЫКЛІК: звычайная (несплітаваная) картка — паводзіны без змен
      const result = await processVacancyMessage(
        fragments,
        "Airtable", source.agencyName, rawAirtableDump, false,
        analysis.category, airtableId, columnName,
        existingVacancy ? existingVacancy._id : null, "airtable",
        false, targetStatus
      );

      if (result && !result.error) {
        const isRecentlyCreated = result.createdAt && (Date.now() - new Date(result.createdAt).getTime() < 60000);
        if (isRecentlyCreated && !existingVacancy) stats.added++; else stats.updated++;
      } else if (result?.error) {
        global.logger(`⚠️ [Airtable] Вакансія ў запісе ${airtableId} не дапрацавана. Прычына: ${result.error}`);
        failedRows.push({ id: airtableId, title: cardTitle || "Без назви", reason: result.error });

        if (result.error.includes("AI_COOLDOWN")) {
          global.logger(`🛑 [Airtable] AI Cooldown у парсеры. Спыняем на індэксе ${i}.`);
          await SyncState.findOneAndUpdate(
            { key: "circular_sync_position" },
            { lastSourceType: "airtable", lastSourceId: source._id, lastIndex: i },
            { upsert: true }
          );
          return "STOP_ALL";
        }
      }
    }

    await new Promise(r => setTimeout(r, 4000));
  }

// --- 7. РАЗУМНАЕ АЎТА-ЗАКРЫЦЦЁ (v8.29 fix) ---
  // Закрываем толькі калі прайшлі ўсе запісы (не было STOP_ALL)
  if (foundAirtableIds.size > 0 && global.syncProgress.current >= records.length) {
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
if (failedRows.length > 0) {
  global.logger(`⚠️ [Airtable] Не дапрацавана ${failedRows.length} запісаў. Яны застаюцца ў чарзе pending_ai.`);
  failedRows.forEach(fr => {
    global.logger(`⏭️ [Pending] ID ${fr.id} (${fr.title}) — Прычына: ${fr.reason}`);
  });
}

  global.logger(`🏁 [${source.agencyName}] Завершана: +${stats.added} новых, 🔄 ${stats.updated} абноўлена, 🛑 ${stats.closed} закрыта, ⏭️ ${stats.ignored} прапушчана.`);
  
}

module.exports = { syncAirtable, syncSingleSource }; // 👈 Дададзены экспарт для ручной сінхранізацыі