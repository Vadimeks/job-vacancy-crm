const axios = require("axios");
const TrelloSource = require("../models/TrelloSource");
const Vacancy = require("../models/Vacancy");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const { processVacancyMessage } = require("../routes/vacancies");
const { analyzeAndCompareWithGemini } = require("./gemini.service");
const { checkVacancyGatekeeper } = require("../utils/messageFilters");
const { notifyDev } = require("./telegram.service"); // 👈 Дадаць імпарт
/**
 * Нармалізацыя назвы: выдаленне эмодзі і лішніх прабелаў
 */
function normalizeName(name) {
  if (!name) return "";
  return name
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      "",
    )
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

// Спісы для поўнага парсінгу вакансій
const VACANCY_LIST_KEYWORDS = [
  "ПРИОРИТЕТ НОМЕР 1",
  "ДЛЯ МУЖЧИН",
  "ЗАКАЗЫ ДЛЯ ПАР",
  "ДЛЯ ЖЕНЩИН",
  "КАРЩИКИ/СПЕЦИАЛИСТЫ",
  "ДРУГИЕ СТРАНЫ",
  "РЕКРУТАЦІЯ ТИЖДЕНЬ",
  "РЕЗЕРВ",
  "СТАЛА РЕКРУТАЦІЯ",
  "ПРІОРИТЕТ",
  "NIDEN ВАКАНСИИ PL",
  "СРОЧНАЯ РЕКРУТАЦИЯ",
  "С ЖИЛЬЁМ",
  "БЕЗ ЖИЛЬЯ",
  "ОПЕРАТОР UDT",
  "ОПЕРАТОР UDT",
];

// Спісы для адпраўкі ў Inbox (Info)
const INFO_LIST_KEYWORDS = ["ВАЖНАЯ ИНФОРМАЦИЯ", "ОСОБИСТЕ ПРОХАННЯ", "ВАЖНО"];

/**
 * Атрыманне апошніх каментароў да карткі
 */
async function getCardComments(cardId, apiKey, token) {
  try {
    const url = `https://api.trello.com/1/cards/${cardId}/actions?filter=commentCard&limit=3&key=${apiKey}&token=${token}`;
    const response = await axios.get(url);
    return response.data.map((action) => action.data.text).join("\n\n");
  } catch (err) {
    global.logger(
      `[Trello] Error fetching comments for ${cardId}:`,
      err.message,
    );
    return "";
  }
}

/**
 * Сінхранізацыя адной дошкі
 */
async function syncTrelloBoard(sourceId) {
  const source = await TrelloSource.findById(sourceId);
  if (!source || source.status === "paused") return;

  global.logger(
    `\n🗂️ [Trello] Пачатак сінхранізацыі: ${source.boardName} (${source.agencyName})`,
  );

  const stats = { added: 0, updated: 0, closed: 0, ignored: 0, info: 0 };
  const failedRows = [];

  const details = [];
  const hotUpdates = [];
  const foundCardIds = new Set();

  // Ініцыялізацыя прагрэсу (v8.29 fix)
  global.syncProgress = { current: 0, total: 0, status: 'running', agency: source.agencyName };
  global.stopSyncRequested = false;

  // 🔄 Чытаем стан "Кола" (Circular Sync)
  const SyncState = require("../models/SyncState");
  const syncState = await SyncState.findOne({ key: "circular_sync_position" }) || new SyncState();
  const startIndex = (syncState.lastSourceId?.toString() === source._id.toString()) ? syncState.lastIndex : 0;

  try {
    // 1. Атрымліваем усе спісы дошкі
    const listsUrl = `https://api.trello.com/1/boards/${source.boardId}/lists?key=${source.apiKey}&token=${source.token}`;
    const listsRes = await axios.get(listsUrl);
    const lists = listsRes.data;// Падлічваем агульную колькасць картак ва ўсіх рэлевантных спісах (v8.29)
    const relevantLists = lists.filter(l => {
      const n = normalizeName(l.name);
      return VACANCY_LIST_KEYWORDS.some(kw => n.includes(kw)) || INFO_LIST_KEYWORDS.some(kw => n.includes(kw));
    });
    let cardCounter = 0; // 👈 ДАДАЦЬ ГЭТА (ініцыялізацыя лічыльніка для ўсёй дошкі)
    global.syncProgress.current = 0;
    // Запытваем колькасць картак для кожнага спіса (спрошчана)
    global.syncProgress.total = relevantLists.reduce((acc, l) => acc + (l.id ? 10 : 0), 0); // Прыблізна, альбо пакінь 0, яно абновіцца

    for (const list of lists) {
      const normListName = normalizeName(list.name);

      // Вызначаем тып спіса
      const isVacancyList = VACANCY_LIST_KEYWORDS.some((kw) =>
        normListName.includes(kw),
      );
      const isInfoList = INFO_LIST_KEYWORDS.some((kw) =>
        normListName.includes(kw),
      );

      if (!isVacancyList && !isInfoList) continue;

      global.logger(
        `  📂 Апрацоўка спіса: "${list.name}" (Тып: ${isVacancyList ? "VACANCY" : "INFO"})`,
      );

      // 2. Атрымліваем карткі спіса
      const cardsUrl = `https://api.trello.com/1/lists/${list.id}/cards?key=${source.apiKey}&token=${source.token}`;
      const cardsRes = await axios.get(cardsUrl);
      const cards = cardsRes.data;

      
      for (const card of cards) {
        global.syncProgress.current++; // 👈 Гэты радок у цябе ўжо ёсць

        // 👈 ДАДАДЗЕНА (v8.36): Heartbeat
        if (global.syncProgress.current % 5 === 0) {
          const SyncState = require("../models/SyncState");
          await SyncState.findOneAndUpdate({ key: "circular_sync_position" }, { lockedAt: new Date() });
        }
          // 👈 ПРАВЕРКА НА ПРЫПЫНАК
        if (global.stopSyncRequested) {
          global.logger("🛑 [Trello] Сінхранізацыя перарвана карыстальнікам.");
          return "STOP_ALL";}

        // 👈 ДАДАДЗЕНА: Паўза, калі рэкрутэр выконвае ручную аперацыю (той жа механізм, што і ў sheets.service.js)
        if (!global.isManualSync && global.isManualActionInProgress) {
          while (global.isManualActionInProgress) {
            global.logger("⏳ [Trello Sync] Фонавая аўтаматыка на паўзе: рэкрутэр працуе ўручную...");
            await new Promise(r => setTimeout(r, 5000));
          }
        }

        const currentCardIndex = cardCounter;
        cardCounter++;

        // Пропуск, калі мы яшчэ не дайшлі да патрэбнага індэкса
        if (currentCardIndex < startIndex) {
          foundCardIds.add(card.id);
          continue;
        }
        foundCardIds.add(card.id);

        // Збіраем тэкст метак
        const labelsText = card.labels
          .map((l) => l.name)
          .filter((n) => n)
          .join(", ");
        const comments = await getCardComments(
          card.id,
          source.apiKey,
          source.token,
        );

        // Фармуем сыры дамп для AI

        const rawTrelloDump = `
${card.name}
${labelsText ? `Меткі: ${labelsText}` : ""}
${card.desc}
${comments ? `\n--- КАМЕНТАРЫ ---\n${comments}` : ""}
        `.trim();

        // 📏 ФІЛЬТР ДАЎЖЫНІ (Крок 3.1)
        if (rawTrelloDump.length < 200) {
          global.logger(`⏭️ Пропуск карткі ${card.name}: занадта кароткая (${rawTrelloDump.length} сімв.)`);
          stats.ignored++;
          continue;
        }

        if (rawTrelloDump.length >= 200 && rawTrelloDump.length < 400) {
          global.logger(`📥 Кароткая картка (${rawTrelloDump.length} сімв.) -> ${global.isManualSync ? 'Inbox' : 'Толькі ў лог'}`);
          if (global.isManualSync) {
            await new UnprocessedMessage({
              sender: source.agencyName,
              agencyName: source.agencyName,
              text: `[Trello: ${list.name}]\n${rawTrelloDump}`,
              source: "trello",
              category: "update",
              processed: false,
              aiAnalyzed: true
            }).save();
          }
          stats.ignored++;
          continue;
        }
          
        

        if (isVacancyList) {
          // --- ЛОГІКА ВАКАНСІЙ ---
          let existingVacancy = await Vacancy.findOne({
  sourceHash: card.id,
  status: { $in: ["active", "pending_ai"] },
});

          // --- ЭТАП 1: ЗБОР ДАДЗЕНЫХ ---
          global.logger(`Этап 1. [Trello] Апрацоўка: ${card.name}`);

          let finalTrelloText = "";

          // ПРАВЕРКА: Ці ёсць у нас ужо гатовы тэкст (пасля мінулага збою AI)?
          if (existingVacancy && existingVacancy.rawText && existingVacancy.status === "pending_ai") {
            global.logger(`📦 Этап 4.5. Выкарыстоўваем захаваны тэкст Trello (Stage 0/1 пропуск)`);
            finalTrelloText = existingVacancy.rawText;
          } else {
            // 1. Будуем тэкст
            finalTrelloText = `[SOURCE: TRELLO | AGENCY: ${source.agencyName}]\n${rawTrelloDump}`;

            // 2. 👈 ПЕРАНЕСЕНА СЮДЫ: Жалезны Санітар (v8.7)
            const gateVerdict = checkVacancyGatekeeper(rawTrelloDump, list.name);
            
            if (gateVerdict === "IGNORE") {
              global.logger(`⏭️ [Trello Gatekeeper] Смецце або кароткі тэкст: ${card.name}`);
              stats.ignored++;
              continue;
            }

            if (gateVerdict === "CLOSE") {
              global.logger(`🔴 [Trello Gatekeeper] СТОП-маркер: ${card.name}.`);
              if (existingVacancy && existingVacancy.status !== "closed") {
                existingVacancy.status = "closed";
                existingVacancy.closingReason = "Маркер СТОП у Trello (Gatekeeper)";
                await existingVacancy.save();
              }
              stats.ignored++;
              continue;
            }

            // 3. 🛡️ ПРАВЕРКА НА ЗМЕНЫ (v8.7)
            if (existingVacancy && existingVacancy.originalText === rawTrelloDump && existingVacancy.status === "active") {
              global.logger(`⏭️ [Trello Skip] Дублікат: ${card.name}`);
              stats.ignored++;
              continue;
            }

            // 💾 ЗАХАВАННЕ ПРАГРЭСУ (v8.40): Абнаўляем толькі калі ўжо звязана па ID.
            // Калі ID новы — пакідаем existingVacancy = null, каб спрацаваў семантычны пошук у processVacancyMessage.
            if (existingVacancy && existingVacancy.originalText !== rawTrelloDump) {
              existingVacancy.rawText = finalTrelloText;
              existingVacancy.originalText = rawTrelloDump;
              existingVacancy.status = "pending_ai";
              await existingVacancy.save();
              global.logger(`💾 Этап 4.5. Чарнавік Trello ${existingVacancy.vacancyCode} абноўлены.`);
            }
          }

          // --- ЭТАП 5-7: AI АПРАЦОЎКА ---
          const analysis = await analyzeAndCompareWithGemini(finalTrelloText);

          // 👈 ВЫПРАЎЛЕНА: Абарона ад крашу, калі AI недаступны (v8.19)
          if (!analysis) {
            global.logger(`⚠️ [Trello] AI недаступны для карткі "${card.name}". Пропуск.`);
            stats.ignored++;
            continue;
          }
 
          // 🔍 ДЫЯГНОСТЫКА (часова, v8.3): правяраем гіпотэзу пра UPDATE...
          global.logger(`🔍 [Category Debug] ${source.agencyName} | Card: "${card.name}" | List: "${list.name}" | AI Category: ${analysis?.category || "NULL"}`);
// 👈 ВЫПРАЎЛЕНА: Вакансія ствараецца ТОЛЬКІ пры FULL_VACANCY. Усё астатняе (UPDATE, INFO) — у Inbox (v8.3)
          if (analysis.category !== "FULL_VACANCY") {
            const msgCategory = analysis.category === "UPDATE" ? "update" : "info";
            global.logger(`📥 [Trello] Катэгорыя ${analysis.category} -> ${global.isManualSync ? 'Адпраўка ў Inbox' : 'Толькі ў лог'}`);
            if (global.isManualSync) {
              await new UnprocessedMessage({
                sender: source.agencyName,
                agencyName: source.agencyName,
                text: `[Trello: ${list.name}]\n${rawTrelloDump}`,
                source: "trello",
                category: msgCategory,
                processed: false,
                aiAnalyzed: true
              }).save();
            }
            stats.ignored++;
            continue;
          }
          
          if (!analysis || !analysis.translatedFragments) {
            // 👈 ЗМЕНЕНА: Не спыняем усю дошку, проста прапускаем картку (v5.6)
            global.logger(`⚠️ [Trello] AI памылка для "${card.name}". Картка застаецца ў pending_ai. Пропуск.`);
            stats.ignored++;
            continue; 
          }

          // 🚀 Stage 2: БАТЧ-ПАРСІНГ (Адпраўляем усе фрагменты Трэла адразу)
          // 👈 ВЫПРАЎЛЕНА: trelloTargetStatus нідзе не аб'яўляўся, кідаў ReferenceError і крашыў сінхранізацыю дошкі.
          // Trello, у адрозненне ад Airtable, не мае логікі "closed" па назвах калонак — заўсёды "active".
          const trelloTargetStatus = "active";
          const result = await processVacancyMessage(
  analysis.translatedFragments,
  "Trello",
  source.agencyName,
  rawTrelloDump,
  false,
  analysis.category,
  card.id,
  list.name,
  existingVacancy ? existingVacancy._id : null,
  "trello",
  false,
  trelloTargetStatus
);

if (result && result.error) {
  global.logger(`⚠️ [Trello] Вакансія "${card.name}" не дапрацавана. Прычына: ${result.error}`);
  failedRows.push({ id: card.id, title: card.name, reason: result.error });

  if (result.error.includes("AI_COOLDOWN") || result.error.includes("ALL_AI_MODELS_FAILED")) {
    global.logger("🛑 Спыняем Trello: AI недаступны.");
    await SyncState.findOneAndUpdate(
      { key: "circular_sync_position" },
      { lastSourceType: "trello", lastSourceId: source._id, lastIndex: currentCardIndex },
      { upsert: true }
    );
    return "STOP_ALL";
  }
} else if (result) {
  if (existingVacancy) {
    stats.updated++;
    details.push(`🔄 [${result.vacancyCode}] ${card.name}`);
  } else {
    stats.added++;
    details.push(`✨ [${result.vacancyCode}] ${card.name}`);
  }
}

        } else if (isInfoList) {
          // --- ЛОГІКА INFO (ЗБОР У ДАЙДЖЭСТ) ---
          const textHash =
            card.id +
            "_" +
            Buffer.from(rawTrelloDump).toString("base64").substring(0, 20);
          const existingInfo = await UnprocessedMessage.findOne({ textHash });

          if (!existingInfo) {
            hotUpdates.push({
              row: list.name, // Выкарыстоўваем назву спіса замест нумара радка
              title: card.name,
              content: card.desc,
              type: "INFO",
            });
            stats.info++;
          }
        }

        // Паўза паміж карткамі для AI
        await new Promise((r) => setTimeout(r, 5000));
      }
    }

    // --- АЎТА-ЗАКРЫЦЦЁ ВАКАНСІЙ ---
    // Закрываем толькі калі прайшлі ўсе спісы цалкам (не было STOP_ALL або ручнога прыпынку)
    if (foundCardIds.size > 0 && !global.stopSyncRequested) {
      const closedResult = await Vacancy.updateMany(
      {
        agencyName: source.agencyName,
        sourceType: "trello",
        status: "active",
        sourceHash: { $exists: true, $nin: Array.from(foundCardIds) },
      },
      { $set: { status: "closed" } },
    );
    stats.closed = closedResult.modifiedCount;
}
    source.lastProcessedAt = new Date();
    // --- АДПРАЎКА ГАРАЧЫХ АПДЭЙТАЎ Trello ---
    if (hotUpdates.length > 0) {
      let hotText = `🔥 **Trello Дайджэст: ${source.agencyName}**\n`;
      hotText += `-----------------------------------------\n`;

      hotUpdates.forEach((upd) => {
        hotText += `ℹ️ **${upd.row}**: ${upd.title}\n`;
        if (upd.content) {
          const shortContent =
            upd.content.length > 150
              ? upd.content.substring(0, 150) + "..."
              : upd.content;
          hotText += `└ _${shortContent.replace(/\n/g, " ")}_\n\n`;
        }
      });

      if (global.isManualSync) {
        await new UnprocessedMessage({
          sender: "Trello System",
          agencyName: source.agencyName,
          text: hotText.substring(0, 4000),
          category: "info",
          source: "trello",
          processed: false,
          aiAnalyzed: true,
        }).save();
      }
      global.logger(`📦 Згрупавана ${hotUpdates.length} інфа-картак Trello.`);
    }
    // Калі прайшлі ўсю дошку — скідаем індэкс
    await SyncState.findOneAndUpdate(
      { key: "circular_sync_position" },
      { lastIndex: 0 }
    );
    await source.save();
if (failedRows.length > 0) {
  global.logger(`⚠️ [Trello] Не дапрацавана ${failedRows.length} картак. Яны застаюцца ў чарзе pending_ai.`);
  failedRows.forEach(fr => {
    global.logger(`⏭️ [Pending] Card ${fr.id} (${fr.title}) — Прычына: ${fr.reason}`);
  });
}

    global.logger(
      `🏁 [Trello] Сінхранізацыя завершана: +${stats.added} вакансій, 🔄 ${stats.updated} абноўлена, ⏭️ ${stats.ignored} ігнаравана, +${stats.info} інфа, 🛑 ${stats.closed} закрыта.`, // 👈 ЗМЕНА: дададзены updated і ignored
    );
  } catch (err) {
    global.logger(`❌ [Trello] Sync Error (${source.boardName}): ${err.message}`);
    await notifyDev(`❌ <b>Trello Sync Error</b>\nBoard: ${source.boardName}\nError: ${err.message}`);
  }
}

/**
 * Запуск сінхранізацыі ўсіх дошак
 */
async function syncAllTrelloBoards() {
  const SyncState = require("../models/SyncState");
  const syncState = await SyncState.findOne({ key: "circular_sync_position" });
  const processedIds = syncState?.processedInCircle?.map(id => id.toString()) || [];

  // Бяром толькі тыя дошкі, якіх НЯМА ў спісе апрацаваных у гэтым коле
  const sources = await TrelloSource.find({ 
    status: "active",
    _id: { $nin: processedIds }
  });

  global.logger(`🚀 Сінхранізацыя Trello: ${sources.length} дошак (прапушчана: ${processedIds.length})`);

  for (const source of sources) {
    const result = await syncTrelloBoard(source._id);
    
    if (result === "STOP_ALL") {
      return "STOP_ALL";
    }

    // Пазначаем дошку як пройдзеную ў гэтым коле
    await SyncState.findOneAndUpdate(
      { key: "circular_sync_position" },
      { $addToSet: { processedInCircle: source._id } }
    );

    await new Promise((r) => setTimeout(r, 6000));
  }
}

module.exports = { syncTrelloBoard, syncAllTrelloBoards };
