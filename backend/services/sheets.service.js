const { google } = require("googleapis");
const path = require("path");
const crypto = require("crypto");
const SheetSource = require("../models/SheetSource");
const Vacancy = require("../models/Vacancy");
const aiService = require("./ai.service");
const scraperService = require("./scraper.service");
// Мяняем enrichTextWithDocs на analyzeAndCompareWithGemini
const { analyzeAndCompareWithGemini } = require("./gemini.service");
const { processVacancyMessage } = require("../routes/vacancies");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-creds.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
/**
 * Вызначае вердыкт для статусу радка.
 * ACTIVE - апрацоўваем
 * SKIP   - прапускаем радок (continue)
 * STOP   - спыняем усю табліцу (break)
 */
function getStatusVerdict(statusText) {
  // Калі статус пусты (колер у Рален ці няма слупка ў Отто)
  // — лічым АКТЫЎНЫМ, каб не прапусціць новае.
  if (!statusText || statusText.trim() === "") return "ACTIVE";

  const s = statusText.toLowerCase().trim();

  // Спіс актыўных статусаў
  const activeKeywords = [
    "активная",
    "aktywna",
    "приоритет",
    "ищем",
    "✅",
    "актуально",
    "акція",
    "актив.✅",
  ];

  // Спіс тэрмінальных статусаў (пасля якіх ідзе архіў)
  const terminalKeywords = [
    "закрыто",
    "nieaktualne",
    "стоп",
    "❌",
    "архив",
    "не актив",
    "не актив.❌",
  ];

  if (activeKeywords.some((kw) => s.includes(kw))) return "ACTIVE";
  if (terminalKeywords.some((kw) => s.includes(kw))) return "STOP";

  // Калі статус невядомы (нейкі тэкст, якога няма ў спісах)
  // — лепш прапусціць радок, каб не есці токены на смецце.
  return "SKIP";
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
    
    MAPPING RULES:
    - position: "Вакансия", "ПРОЕКТ", "Должность", "Назва", "Вакансия/ опис".
    - location: "Место работы", "ЛОКАЦІЇ МІСЦЯ РОБОТИ", "Локализация", "Lokalizacja", "Місто".
    - salary: "Ставка", "Оплата", "stawka", "Wynagrodzenie".
    - link: "link", "опис", "Фото житла", "link na strone", "CCЫЛКА".
    - agency: "Агенція", "Назва ў CRM", "Офіс".
    - details: "ЖИТЛО/ДОЇЗД", "Коментар", "Примітки", "Dodatkowa notatka", "Примечание", "Проживание".
    - status: "Статус", "Status", "Актуально".
    
    RETURN ONLY JSON:
    {
      "position": index,
      "location": index,
      "salary": index,
      "link": index,
      "agency": index,
      "details": index,
      "status": index
    }
  `;

  try {
    const response = await aiService.executeAIRequest(
      prompt,
      "Identify columns",
      true,
    );
    const cleanJson = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("❌ AI Column Mapping Error:", err.message);
    return null;
  }
}

/**
 * Здабывае даныя з ячэйкі (тэкст, спасылку або нататку)
 */
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

    // --- КРОК 1: ПОШУК РАДКА ЗАГАЛОЎКАЎ ---
    let headerRowIndex = -1;
    const keywords = ["вакансія", "вакансия", "проект", "статус", "посада"];

    for (let i = 0; i < Math.min(rowData.length, 15); i++) {
      const rowValues = (rowData[i].values || []).map((v) =>
        (v.formattedValue || "").toLowerCase(),
      );
      if (keywords.some((kw) => rowValues.some((rv) => rv.includes(kw)))) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      console.log("⚠️ Не ўдалося знайсці радок загалоўкаў у першых 15 радках.");
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
      colMap.position === null ||
      colMap.position === undefined
    ) {
      console.log("🧠 Мапінг адсутнічае або няпоўны. Запыт да AI...");
      colMap = await identifyColumnsWithAI(headers);
      console.log("🗺️ Вызначаны мапінг ад AI:", colMap);
      if (colMap && colMap.position !== null) {
        source.columnMap = colMap;
        await source.save();
      } else {
        console.log("⚠️ AI не змог вызначыць структуру слупкоў.");
        return;
      }
    }

    // --- КРОК 3: ПАДРЫХТОЎКА КАНТЭКСТУ ДЛЯ ДЭДУПЛІКАЦЫІ ---
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const recentVacancies = await Vacancy.find({
      createdAt: { $gte: fortyEightHoursAgo },
    })
      .select(
        "vacancydescription location agencyName salary.rawSalaryDisplay createdAt",
      )
      .limit(30);

    let lastLocation = "";
    const expectedKeys = [
      "position",
      "location",
      "salary",
      "link",
      "agency",
      "details",
      "status",
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

      // --- ПРАВЕРКА СТАТУСУ (BREAK / CONTINUE) ---
      const verdict = getStatusVerdict(rowDataObj.status?.value);

      if (verdict === "STOP") {
        console.log(
          `🛑 Тэрмінальны статус "${rowDataObj.status.value}" на радку ${i + 1}. Спыняем табліцу.`,
        );
        break;
      }
      if (verdict === "SKIP") continue;

      if (!rowDataObj.position.value || rowDataObj.position.value.length < 3)
        continue;

      // Групаванне па лакацыі
      if (rowDataObj.location.value) {
        lastLocation = rowDataObj.location.value;
      } else {
        rowDataObj.location.value = lastLocation;
      }

      const rowString = JSON.stringify(rowDataObj);
      const rowHash = crypto.createHash("md5").update(rowString).digest("hex");

      if (source.processedHashes.includes(rowHash)) continue;

      console.log(
        `🆕 Радок ${i + 1}: ${rowDataObj.position.value} | ${rowDataObj.location.value}`,
      );

      // Збор тэксту для Stage 1
      let rawRowText = `Пасада: ${rowDataObj.position.value}\nЛакацыя: ${rowDataObj.location.value}\nСтаўка: ${rowDataObj.salary.value}\nДадаткова: ${rowDataObj.details.value} ${rowDataObj.position.note} ${rowDataObj.details.note}`;

      const externalUrl =
        rowDataObj.link.link ||
        rowDataObj.position.link ||
        rowDataObj.link.value;
      if (externalUrl && externalUrl.startsWith("http")) {
        if (externalUrl.includes("google.com")) {
          rawRowText += `\nСпасылка: ${externalUrl}`;
        } else {
          const externalContent =
            await scraperService.getExternalContent(externalUrl);
          if (externalContent)
            rawRowText += `\n\n--- АПІСАННЕ ---\n${externalContent}`;
        }
      }

      // Stage 1: Пераклад + Класіфікацыя + Дэдуплікацыя
      console.log(`🔎 Праверка праз Stage 1 для: ${rowDataObj.position.value}`);
      const analysis = await analyzeAndCompareWithGemini(
        rawRowText,
        [],
        recentVacancies,
      );

      if (!analysis) {
        console.log("⚠️ AI не змог апрацаваць радок, пропуск.");
        continue;
      }

      if (analysis.comparison?.verdict === "DUPLICATE") {
        console.log(
          `🔁 AI вызначыў дублікат: ${analysis.comparison.reason}. Пропуск.`,
        );
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
          );
        }
        console.log(`✅ Вакансія створана з радка ${i + 1}`);
      }

      source.processedHashes.push(rowHash);
      if (source.processedHashes.length > 1000) source.processedHashes.shift();
      await source.save();

      await new Promise((r) => setTimeout(r, 3000));
    }

    source.lastProcessedAt = new Date();
    await source.save();
    console.log(`🏁 Сінхранізацыя ${source.sheetName} завершана.`);
  } catch (err) {
    console.error(`❌ Sync Error (${source.sheetName}):`, err.message);
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
