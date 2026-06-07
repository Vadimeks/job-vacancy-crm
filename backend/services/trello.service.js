const axios = require("axios");
const TrelloSource = require("../models/TrelloSource");
const Vacancy = require("../models/Vacancy");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const { processVacancyMessage } = require("../routes/vacancies");

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
    console.error(
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

  console.log(
    `\n🗂️ [Trello] Пачатак сінхранізацыі: ${source.boardName} (${source.agencyName})`,
  );

  const stats = { added: 0, updated: 0, closed: 0, ignored: 0, info: 0 }; // 👈 ЗМЕНА: дададзены ignored
  const details = []; // Для справаздачы
  const hotUpdates = []; // 👈 Акумулятар для групавання паведамленняў у Inbox
  const foundCardIds = new Set();

  try {
    // 1. Атрымліваем усе спісы дошкі
    const listsUrl = `https://api.trello.com/1/boards/${source.boardId}/lists?key=${source.apiKey}&token=${source.token}`;
    const listsRes = await axios.get(listsUrl);
    const lists = listsRes.data;

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

      console.log(
        `  📂 Апрацоўка спіса: "${list.name}" (Тып: ${isVacancyList ? "VACANCY" : "INFO"})`,
      );

      // 2. Атрымліваем карткі спіса
      const cardsUrl = `https://api.trello.com/1/lists/${list.id}/cards?key=${source.apiKey}&token=${source.token}`;
      const cardsRes = await axios.get(cardsUrl);
      const cards = cardsRes.data;

      for (const card of cards) {
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

        // Фармуем поўны тэкст для AI
        const fullText = `
ЗАГАЛОВАК: ${card.name}
МЕТКІ: ${labelsText}
АПІСАННЕ:
${card.desc}

${comments ? `--- АПОШНІЯ КАМЕНТАРЫ ---\n${comments}` : ""}
        `.trim();

        if (isVacancyList) {
          // --- ЛОГІКА ВАКАНСІЙ ---
          const existingVacancy = await Vacancy.findOne({
            sourceHash: card.id,
            status: "active",
          });

          // 🛡️ ПРАВЕРКА НА ЗМЕНЫ (Каб не спаліць AI дарма)
          // Ідэнтычна табліцам: калі тэкст не змяніўся — ігнаруем
          if (existingVacancy && existingVacancy.originalText === fullText) {
            stats.ignored++; // 👈 ЗМЕНА: ignored цяпер ёсць у stats (дададзена ніжэй)
            continue;
          }

          // 👈 ЗМЕНА: firstSavedId — як у табліцах, для сплітавання картак
          let firstSavedId = null;

          const result = await processVacancyMessage(
            fullText,
            "Trello",
            source.agencyName,
            fullText,
            false,
            "FULL_VACANCY",
            card.id,
            list.name,
            existingVacancy ? existingVacancy._id : null, // 👈 ЗМЕНА: было null заўсёды
            "trello",
          );

          if (result && !result.error) {
            // 👈 ЗМЕНА: запамінаем ID першай вакансіі (для сплітавання)
            if (!firstSavedId) firstSavedId = result._id;

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
            Buffer.from(fullText).toString("base64").substring(0, 20);
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
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    // --- АЎТА-ЗАКРЫЦЦЁ ВАКАНСІЙ ---
    // Калі вакансія была прывязана да гэтай дошкі, але яе больш няма ў спісах вакансій
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

      await new UnprocessedMessage({
        sender: "Trello System",
        agencyName: source.agencyName,
        text: hotText.substring(0, 4000),
        category: "info",
        source: "trello",
        processed: false,
        aiAnalyzed: true,
      }).save();
      console.log(`📦 Згрупавана ${hotUpdates.length} інфа-картак Trello.`);
    }
    await source.save();

    console.log(
      `🏁 [Trello] Сінхранізацыя завершана: +${stats.added} вакансій, 🔄 ${stats.updated} абноўлена, ⏭️ ${stats.ignored} ігнаравана, +${stats.info} інфа, 🛑 ${stats.closed} закрыта.`, // 👈 ЗМЕНА: дададзены updated і ignored
    );
  } catch (err) {
    console.error(`❌ [Trello] Sync Error (${source.boardName}):`, err.message);
  }
}

/**
 * Запуск сінхранізацыі ўсіх дошак
 */
async function syncAllTrelloBoards() {
  const sources = await TrelloSource.find({ status: "active" });
  for (const source of sources) {
    await syncTrelloBoard(source._id);
    await new Promise((r) => setTimeout(r, 5000));
  }
}

module.exports = { syncTrelloBoard, syncAllTrelloBoards };
