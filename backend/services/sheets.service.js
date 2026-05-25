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
  if (!statusText) return "ACTIVE";

  const s = statusText.trim(); // Не робім toLowerCase адразу, каб не пашкодзіць некаторыя эмодзі

  // 1. Прыярытэтная праверка на іконкі (як у Personel Service / Bisar)
  if (s.includes("❌") || s.includes("✖️")) return "STOP";
  if (s.includes("✅") || s.includes("✔️")) return "ACTIVE";

  const lowerS = s.toLowerCase();

  // 2. Апрацоўка лагічных значэнняў і лічбаў
  if (lowerS === "false" || lowerS === "0" || lowerS === "nie") return "STOP";
  if (lowerS === "true" || lowerS === "1" || lowerS === "tak") return "ACTIVE";

  // 3. Спіс тэрмінальных тэкставых статусаў
  const terminalKeywords = [
    "nieaktualne",
    "закрыто",
    "стоп",
    "архив",
    "не актив",
    "не актуально",
    "wstrzymane",
    "zakończona",
    "brak",
  ];

  if (terminalKeywords.some((kw) => lowerS.includes(kw))) return "STOP";

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
    - position: "ПРОЕКТ", "Должность", "Назва", "вакансія укр. мовою". (If "Вакансія" contains a city, use "Проект" as position).
    - location: "Вакансія" (if it contains city names like Słubice, Stryków), "Lokalizacja", "Место работы", "Місто".
    - salary: "Wynagrodzenie", "Ставка", "Оплата", "stawka".
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
  const foundHashesInSheet = new Set(); // 👈 Новае: спіс усіх хэшаў, знойдзеных у табліцы
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

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Павялічана да 30 дзён
    const recentVacancies = await Vacancy.find({
      createdAt: { $gte: thirtyDaysAgo },
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
      if (
        rowData[i].rowMetadata?.hiddenByUser ||
        rowData[i].rowMetadata?.hiddenByFilter
      ) {
        continue;
      }
      const rowDataObj = {};
      expectedKeys.forEach((key) => {
        const idx = colMap[key];
        if (idx !== null && idx !== undefined && cells[idx]) {
          rowDataObj[key] = extractCellData(cells[idx]);
        } else {
          rowDataObj[key] = { value: "", link: "", note: "" };
        }
      });

      // --- ЛОГІКА "ЯКАРА" І ВАЛІДАЦЫЯ (BISAR Style) ---

      // 1. Калі ў радку ёсць горад — запамінаем яго. Калі няма — бярэм стары "якар".
      if (
        rowDataObj.location.value &&
        rowDataObj.location.value.trim() !== ""
      ) {
        lastLocation = rowDataObj.location.value.trim();
      } else {
        rowDataObj.location.value = lastLocation;
      }

      // 2. Вызначаем, ці з'яўляецца радок вакансіяй.
      // Калі няма ні назвы праекта, ні спасылкі на док — гэта пусты радок або смецце.
      if (!rowDataObj.position.value && !rowDataObj.link.value) {
        continue;
      }

      const verdict = getStatusVerdict(rowDataObj.status?.value);

      // Збор назвы для справаздачы
      const combinedTitle =
        rowDataObj.position.value || rowDataObj.link.value || "Без назви";

      if (verdict === "STOP") {
        const reportName = combinedTitle.toLowerCase().includes("nieaktualne")
          ? rowDataObj.location.value || combinedTitle
          : combinedTitle;

        stats.closed++;
        details.push(`🛑 ${reportName}`); // Дададзена назва ў спіс дэталяў
        continue;
      }
      if (verdict === "SKIP") continue;

      const rowString = JSON.stringify(rowDataObj);
      const rowHash = crypto.createHash("md5").update(rowString).digest("hex");
      foundHashesInSheet.add(rowHash); // 👈 НОВАЕ: фіксуем, што гэтая вакансія ёсць у табліцы
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

        continue;
      }

      console.log(`🆕 Новы радок ${i + 1}: ${combinedTitle}`);

      // 👈 НОВАЕ: Збіраем нататкі з усіх слупкоў для максімальнага кантэксту AI
      // 1. Збіраем нататкі з усіх слупкоў
      const allNotes = Object.values(rowDataObj)
        .map((obj) => obj.note)
        .filter((note) => note && note.trim() !== "")
        .join(" | ");

      // 2. Шукаем спасылку (мета-даныя або тэкст)
      const externalUrl =
        rowDataObj.link.link ||
        rowDataObj.position.link ||
        rowDataObj.details.link ||
        [
          rowDataObj.link.value,
          rowDataObj.position.value,
          rowDataObj.details.value,
        ].find((v) => v && String(v).trim().startsWith("http"));

      // 3. Фармуем базавы тэкст з маркерам крыніцы
      let rawRowText = `[SOURCE: SPREADSHEET_ROW]\nПасада: ${combinedTitle}\nЛокація: ${rowDataObj.location.value}\nСтавка: ${rowDataObj.salary.value}\nСтать: ${rowDataObj.gender.value}\nНаціональність: ${rowDataObj.nationality.value}\nДодатково: ${rowDataObj.details.value}\nНАТАТКІ З ТАБЛІЦЫ: ${allNotes}`;

      // 4. Калі ёсць спасылка — дадаем яе змест
      if (externalUrl && String(externalUrl).startsWith("http")) {
        console.log(
          `🔗 Знойдзена спасылка для апрацоўкі: ${externalUrl.substring(0, 60)}...`,
        );
        rawRowText += `\n\n--- ПАДРАБЯЗНАЕ АПІСАННЕ ПА СПАСЫЛЦЫ ---\n(Выкарыстоўвай гэты тэкст як асноўную крыніцу для FULL_VACANCY)\nСпасылка: ${externalUrl}`;

        if (!externalUrl.includes("google.com")) {
          const externalContent =
            await scraperService.getExternalContent(externalUrl);
          if (externalContent) {
            rawRowText += `\n${externalContent}`;
          }
        }
      }

      const analysis = await analyzeAndCompareWithGemini(
        rawRowText,
        [],
        recentVacancies,
      );

      if (!analysis) continue;
      // --- НОВАЕ: Дыягностыка для адладкі ---
      console.log(
        `🧠 AI Verdict для "${combinedTitle}": Category=${analysis.category}, Comparison=${analysis.comparison?.verdict || "NEW"}`,
      );
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
          await new Promise((r) => setTimeout(r, 2000));
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
    // --- 👈 НОВАЕ: АЎТА-ЗАКРЫЦЦЁ ВАКАНСІЙ, ЯКІХ НЯМА Ў ТАБЛІЦЫ ---
    if (foundHashesInSheet.size > 0) {
      const closeResult = await Vacancy.updateMany(
        {
          agencyName: source.agencyName,
          status: "active",
          sourceHash: { $exists: true, $nin: Array.from(foundHashesInSheet) },
        },
        {
          $set: { status: "closed" },
        },
      );

      if (closeResult.modifiedCount > 0) {
        console.log(
          `✅ Аўта-закрыццё: ${closeResult.modifiedCount} вакансій агенцыі ${source.agencyName} больш не ў табліцы.`,
        );
        stats.closed += closeResult.modifiedCount;
      }
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
    // Цяпер адпраўляем, нават калі былі толькі дублікаты (ignored)
    if (
      stats.added > 0 ||
      stats.updated > 0 ||
      stats.closed > 0 ||
      stats.ignored > 0
    ) {
      let reportText = `📊 **Звіт: ${source.agencyName} (${source.sheetName})**\n`;

      if (stats.added > 0) {
        const addedNames = details
          .filter((d) => d.startsWith("✨"))
          .map((d) => d.replace("✨ ", ""))
          .join(", ");
        reportText += `\n✨ **Нові (${stats.added}):** ${addedNames}\n`;
      }

      if (stats.updated > 0) {
        const updatedNames = details
          .filter((d) => d.startsWith("🔄"))
          .map((d) => d.replace("🔄 ", ""))
          .join(", ");
        reportText += `\n🔄 **Оновлені (${stats.updated}):** ${updatedNames}\n`;
      }

      reportText += `\n🛑 Закриті: ${stats.closed}\n⏭️ Ігноровано (дублі): ${stats.ignored}`;

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
