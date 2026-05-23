const { google } = require("googleapis");
const path = require("path");
const crypto = require("crypto");
const SheetSource = require("../models/SheetSource");
const Vacancy = require("../models/Vacancy"); // Дададзена
const SyncHistory = require("../models/SyncHistory"); // Дададзена
const UnprocessedMessage = require("../models/UnprocessedMessage"); // 👈 Дададзена для справаздач
const aiService = require("./ai.service");
const scraperService = require("./scraper.service");
const { analyzeAndCompareWithGemini } = require("./gemini.service");
const { processVacancyMessage } = require("../routes/vacancies");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-creds.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

/**
 * Вызначае вердыкт для статусу радка.
 */
function getStatusVerdict(statusText) {
  // Калі статус пусты — лічым актыўным
  if (!statusText || statusText.trim() === "") return "ACTIVE";

  const s = statusText.toLowerCase().trim();

  // Спіс тэрмінальных статусаў (толькі тое, што дакладна закрыта)
  const terminalKeywords = [
    "nieaktualne",
    "закрыто",
    "стоп",
    "❌",
    "архив",
    "не актив",
    "не актуально",
  ];

  // Калі знойдзена хоць адно "стоп-слова" — адпраўляем у закрытыя
  if (terminalKeywords.some((kw) => s.includes(kw))) return "STOP";

  // Усё астатняе (нават "Rezerwa" ці "Opiekunka на злеценню") — лічым актыўным
  return "ACTIVE";
}

/**
 * Вызначае мапінг слупкоў праз AI
 */
async function identifyColumnsWithAI(headers) {
  console.log("📋 Загалоўкі, якія бачыць AI:", headers);

  const prompt = `
    ROLE: Expert Data Analyst.
    TASK: Map Google Sheets headers to vacancy fields.
    HEADERS: ${JSON.stringify(headers)}
    
    MAPPING RULES (Find the best index for each field):
    - position: "Lokalizacja/ Podopieczny", "Вакансия", "ПРОЕКТ", "Должность", "Назва", "вакансія укр. мовою".MUST BE "Lokalizacja/ Podopieczny" or "Вакансия" or "Должность". NEVER use "Status" column for position.
    - location: "Lokalizacja", "Место работы", "ЛОКАЦІЇ", "Локализация", "Місто".
    - salary: "Wynagrodzenie", "Ставка", "Оплата", "stawka", "Ставка zl netto".
    - link: "ОПИС", "link", "опис", "Фото житла", "link na strone", "CCЫЛКА".
    - agency: "Агенція", "Назва ў CRM", "Офіс".
    - details: "Stan podopiecznego", "Dodatkowa notatka", "ЖИТЛО/ДОЇЗД", "Коментар", "Примітки".
    - status: "Status rekrutacji", "Статус", "Status", "Актуально", "АКТИВ".
    - gender: "Plec", "Пол", "Стать", "Хто потрібен".
    - nationality: "Narodowość", "Гражданство", "Громадянство", "Національність".
    
    RETURN ONLY JSON:
    {
      "position": index,
      "location": index,
      "salary": index,
      "link": index,
      "agency": index,
      "details": index,
      "status": index,
      "gender": index,
      "nationality": index
    }
    (index is 0-based. If not found, use null)
  `;

  try {
    const response = await aiService.executeAIRequest(
      prompt,
      "Identify columns",
      true,
    );

    return JSON.parse(aiService.repairJson(response));
  } catch (err) {
    console.error("❌ AI Column Mapping Error:", err.message);
    return null;
  }
}

function extractCellData(cell) {
  if (!cell) return { value: "", link: "", note: "" };
  const value = cell.formattedValue || "";
  const note = cell.note || "";
  let link = cell.hyperlink || "";
  if (!link && cell.textFormatRuns) {
    const runWithLink = cell.textFormatRuns.find(
      (run) => run.format && run.format.link,
    );
    if (runWithLink) link = runWithLink.format.link.uri;
  }
  return { value, link, note };
}

/**
 * Галоўная функцыя сінхранізацыі табліцы
 */
async function syncSheetVacancies(sourceId) {
  const source = await SheetSource.findById(sourceId);
  if (!source || source.status === "paused") return;

  console.log(
    `📊 Пачатак сінхранізацыі: ${source.sheetName} (${source.agencyName})`,
  );

  // Новая структура для SyncHistory і справаздач
  const stats = { added: 0, updated: 0, closed: 0, ignored: 0 };
  const details = [];

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: source.spreadsheetId,
      ranges: [`${source.sheetName}!A1:Z150`],
      includeGridData: true,
    });

    const rowData = response.data.sheets[0].data[0].rowData;
    if (!rowData || rowData.length < 1) {
      console.log("⚠️ Табліца пустая.");
      return;
    }

    // --- КРОК 1: ПОШУК РАДКА ЗАГАЛОЎКАЎ (Пашыраны спіс) ---
    let headerRowIndex = -1;
    const keywords = [
      "вакансія",
      "вакансия",
      "проект",
      "статус",
      "посада",
      "ставка",
      "оплата",
      "локализация",
      "пол",
      "місто",
      "city",
      "klient",
      "опис",
      "aktywna",
      "назва",
      "фірма",
      "rekrutacji",
      "lokalizacja",
      "wynagrodzenie",
      "opiekunki",
      "podopieczny",
      "start pracy", // 👈 Дададзена для Opiekunki
    ];

    for (let i = 0; i < Math.min(rowData.length, 20); i++) {
      // Павялічана да 20 радкоў
      const rowValues = (rowData[i].values || []).map((v) =>
        (v.formattedValue || "").toLowerCase(),
      );
      const matchCount = rowValues.filter((rv) =>
        keywords.some((kw) => rv.includes(kw)),
      ).length;
      if (matchCount >= 2) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      console.log("⚠️ Не ўдалося знайсці радок загалоўкаў.");
      return;
    }

    console.log(`✅ Загалоўкі знойдзены ў радку №${headerRowIndex + 1}`);
    const headers = rowData[headerRowIndex].values.map(
      (v) => v.formattedValue || "",
    );

    // --- КРОК 2: МАПІНГ ---
    let colMap =
      source.columnMap instanceof Map
        ? Object.fromEntries(source.columnMap)
        : source.columnMap || {};

    if (
      !colMap ||
      Object.keys(colMap).length === 0 ||
      colMap.position === null
    ) {
      console.log("🧠 Мапінг адсутнічае. Запыт да AI...");
      colMap = await identifyColumnsWithAI(headers);
      if (colMap && colMap.position !== null) {
        source.columnMap = colMap;
        await source.save();
      } else {
        console.log("⚠️ AI не змог вызначыць структуру слупкоў.");
        return;
      }
    }

    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const recentVacancies = await Vacancy.find({
      createdAt: { $gte: fortyEightHoursAgo },
    })
      .select(
        "vacancydescription location agencyName salary.rawSalaryDisplay createdAt",
      )
      .limit(50);

    let lastLocation = "";
    const expectedKeys = [
      "position",
      "location",
      "salary",
      "link",
      "agency",
      "details",
      "status",
      "gender",
      "nationality",
    ];

    // --- КРОК 4: ЦЫКЛ ПА РАДКАХ ---
    for (let i = headerRowIndex + 1; i < rowData.length; i++) {
      const cells = rowData[i].values;
      if (!cells || cells.length === 0) continue;

      const rowDataObj = {};
      expectedKeys.forEach((key) => {
        const idx = colMap[key];
        if (idx !== null && idx !== undefined && cells[idx]) {
          rowDataObj[key] = extractCellData(cells[idx]);
        } else {
          rowDataObj[key] = { value: "", link: "", note: "" };
        }
      });

      // Пропуск цалкам пустых радкоў
      if (
        !rowDataObj.position.value &&
        !rowDataObj.details.value &&
        !rowDataObj.salary.value
      )
        continue;

      const verdict = getStatusVerdict(rowDataObj.status?.value);

      // Збор назвы для справаздачы
      const combinedTitle =
        rowDataObj.position.value || rowDataObj.link.value || "Без назви";

      if (verdict === "STOP") {
        // Калі мы памылкова ўзялі статус замест назвы (напр. "Nieaktualne"),
        // паспрабуем узяць імя з суседняга слупка для справаздачы
        const reportName = combinedTitle.toLowerCase().includes("nieaktualne")
          ? rowDataObj.location.value || combinedTitle
          : combinedTitle;

        stats.closed++; // Лічым для гісторыі
        continue;
      }
      if (verdict === "SKIP") continue;

      if (rowDataObj.location.value) {
        lastLocation = rowDataObj.location.value;
      } else {
        rowDataObj.location.value = lastLocation;
      }

      const rowString = JSON.stringify(rowDataObj);
      const rowHash = crypto.createHash("md5").update(rowString).digest("hex");

      // 1. ПРАВЕРКА Ў ЛАКАЛЬНЫМ СПІСЕ КРЫНІЦЫ (хуткая)
      if (source.processedHashes.includes(rowHash)) {
        stats.ignored++;
        continue;
      }

      // 2. ГЛАБАЛЬНАЯ ПРАВЕРКА Ў БАЗЕ (абарона ад дубляў пасля 48 гадзін)
      const existingVacancy = await Vacancy.findOne({ sourceHash: rowHash });
      if (existingVacancy) {
        console.log(
          `🛡️ ГЛАБАЛЬНЫ ФІЛЬТР: Вакансія "${combinedTitle}" ужо ёсць у базе. Пропуск.`,
        );
        stats.ignored++;
        // Сінхранізуем лакальны спіс хэшаў, каб больш не запытваць БД па гэтым радку
        source.processedHashes.push(rowHash);
        await source.save();
        continue;
      }

      console.log(`🆕 Новы радок ${i + 1}: ${combinedTitle}`);

      let rawRowText = `Пасада: ${combinedTitle}\nЛокація: ${rowDataObj.location.value}\nСтавка: ${rowDataObj.salary.value}\nСтать: ${rowDataObj.gender.value}\nНаціональність: ${rowDataObj.nationality.value}\nДодатково: ${rowDataObj.details.value} ${rowDataObj.position.note} ${rowDataObj.details.note}`;

      // --- РАЗУМНЫ ПОШУК СПАСЫЛКІ (Агрэсіўны) ---
      // 1. Шукаем схаваную гіперспасылку (мета-даныя) у ключавых слупках
      // Мы правяраем .link, які запаўняецца ў extractCellData
      const externalUrl =
        rowDataObj.link.link ||
        rowDataObj.position.link ||
        rowDataObj.details.link ||
        // 2. Калі мета-спасылкі няма, шукаем тэкст, які пачынаецца з http
        [
          rowDataObj.link.value,
          rowDataObj.position.value,
          rowDataObj.details.value,
        ].find((v) => v && String(v).trim().startsWith("http"));

      if (externalUrl && String(externalUrl).startsWith("http")) {
        console.log(
          `🔗 Знойдзена спасылка для апрацоўкі: ${externalUrl.substring(0, 60)}...`,
        );

        // Дадаем спасылку ў тэкст.
        // analyzeAndCompareWithGemini -> enrichTextWithDocs аўтаматычна знойдзе яе і спампуе змест.
        rawRowText += `\nСпасылка: ${externalUrl}`;

        // Калі гэта НЕ Google Doc (напр. Telegraph), дадаткова скрапім яго тут
        if (!externalUrl.includes("google.com")) {
          const externalContent =
            await scraperService.getExternalContent(externalUrl);
          if (externalContent)
            rawRowText += `\n\n--- АПІСАННЕ З САЙТА ---\n${externalContent}`;
        }
      }

      const analysis = await analyzeAndCompareWithGemini(
        rawRowText,
        [],
        recentVacancies,
      );

      if (!analysis) continue;

      // Апрацоўка дублікатаў і абнаўленняў
      if (analysis.comparison?.verdict === "DUPLICATE") {
        source.processedHashes.push(rowHash);
        continue;
      }

      if (analysis.comparison?.verdict === "UPDATE") {
        stats.updated++;
        details.push(`🔄 ${combinedTitle}`);
        // Адпраўляем UPDATE у Inbox
        await new UnprocessedMessage({
          sender: "Google Sheets",
          agencyName: source.agencyName,
          text: `Оновлення в табліці для: ${combinedTitle}\n\n${analysis.translatedFragments?.[0] || rawRowText}`,
          category: "update",
          source: "google_sheets",
          aiAnalyzed: true,
        }).save();

        source.processedHashes.push(rowHash);
        await source.save();
        continue;
      }

      if (analysis.category === "FULL_VACANCY") {
        for (const fragment of analysis.translatedFragments) {
          await processVacancyMessage(
            fragment,
            "Google Sheets",
            source.agencyName,
            fragment,
            false,
            "FULL_VACANCY",
            rowHash, // 👈 ПЕРАДАЕМ ХЭШ ДЛЯ ЗАХАВАННЯ
          );
        }
        stats.added++;
        details.push(`✨ ${combinedTitle}`);
      }

      source.processedHashes.push(rowHash);
      if (source.processedHashes.length > 1000) {
        source.processedHashes.splice(0, source.processedHashes.length - 1000);
      }
      await source.save();
      await new Promise((r) => setTimeout(r, 4000)); // Паўза 4 сек для стабільнасці
    }

    // --- ЗАПІС ГІСТОРЫІ Ў БАЗУ ---
    await SyncHistory.create({
      agencyName: source.agencyName,
      sheetName: source.sheetName,
      stats: stats,
      details: details,
      status: "success",
    });

    // --- ФІНАЛЬНАЯ СПРАВАЗДАЧА Ў INBOX ---
    if (stats.added > 0 || stats.updated > 0 || stats.closed > 0) {
      const reportText = `📊 **Звіт: ${source.agencyName}**\n✨ Нові: ${stats.added}\n🔄 Оновлені: ${stats.updated}\n🛑 Закриті: ${stats.closed}\n⏭️ Ігноровано (дублі): ${stats.ignored}`;

      await new UnprocessedMessage({
        sender: "System",
        agencyName: source.agencyName,
        text: reportText,
        category: "info",
        source: "google_sheets",
        processed: false,
        aiAnalyzed: true,
      }).save();
    }

    source.lastProcessedAt = new Date();
    await source.save();
    console.log(`🏁 Сінхранізацыя ${source.sheetName} завершана.`);
  } catch (err) {
    console.error(`❌ Sync Error (${source.sheetName}):`, err.message);
    // Фіксуем памылку ў гісторыі
    await SyncHistory.create({
      agencyName: source.agencyName,
      sheetName: source.sheetName,
      status: "error",
      errorMessage: err.message,
    });
  }
}

async function syncAllSheets() {
  const sources = await SheetSource.find({ status: "active" });
  console.log(`🚀 Запуск сінхранізацыі для ${sources.length} табліц...`);
  for (const source of sources) {
    await syncSheetVacancies(source._id);
  }
}

module.exports = { syncSheetVacancies, syncAllSheets };
