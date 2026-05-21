const { google } = require("googleapis");
const path = require("path");
const crypto = require("crypto");
const SheetSource = require("../models/SheetSource");
const aiService = require("./ai.service");
const scraperService = require("./scraper.service");
const { enrichTextWithDocs } = require("./gemini.service");
const { processVacancyMessage } = require("../routes/vacancies");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-creds.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

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
    
    RETURN ONLY JSON:
    {
      "position": index,
      "location": index,
      "salary": index,
      "link": index,
      "agency": index,
      "details": index
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

async function syncSheetVacancies(sourceId) {
  const source = await SheetSource.findById(sourceId);
  if (!source || source.status === "paused") return;

  console.log(
    `📊 Пачатак сінхранізацыі: ${source.sheetName} (${source.agencyName})`,
  );

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: source.spreadsheetId,
      ranges: [`${source.sheetName}!A1:Z100`],
      includeGridData: true,
    });

    const rowData = response.data.sheets[0].data[0].rowData;
    if (!rowData || rowData.length < 1) return;

    // --- КРОК 1: ПОШУК РАДКА ЗАГАЛОЎКАЎ ---
    let headerRowIndex = -1;
    const keywords = ["вакансія", "вакансия", "проект", "статус", "посада"];

    for (let i = 0; i < Math.min(rowData.length, 10); i++) {
      const rowValues = (rowData[i].values || []).map((v) =>
        (v.formattedValue || "").toLowerCase(),
      );
      if (keywords.some((kw) => rowValues.some((rv) => rv.includes(kw)))) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      console.log("⚠️ Не ўдалося знайсці радок загалоўкаў у першых 10 радках.");
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
      console.log("🧠 Запыт да AI для мапінгу...");
      colMap = await identifyColumnsWithAI(headers);
      console.log("🗺️ Мапінг:", colMap);
      if (colMap && colMap.position !== null) {
        source.columnMap = colMap;
        await source.save();
      } else {
        return;
      }
    }

    // --- КРОК 3: АПРАЦОЎКА ДАНЫХ ---
    let lastLocation = "";
    const expectedKeys = [
      "position",
      "location",
      "salary",
      "link",
      "agency",
      "details",
    ];

    // Пачынаем з наступнага радка пасля загалоўкаў
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

      if (!rowDataObj.position.value || rowDataObj.position.value.length < 3)
        continue;

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

      // 5. Збор поўнага тэксту для AI
      let fullDescription = `
        ВАКАНСІЯ З ТАБЛІЦЫ:
        Пасада: ${rowDataObj.position.value}
        Лакацыя: ${rowDataObj.location.value}
        Стаўка: ${rowDataObj.salary.value}
        Агенцыя: ${source.agencyName}
        Дадаткова: ${rowDataObj.details.value} ${rowDataObj.position.note} ${rowDataObj.details.note}
      `;

      const externalUrl =
        rowDataObj.link.link ||
        rowDataObj.position.link ||
        rowDataObj.link.value;

      if (externalUrl && externalUrl.startsWith("http")) {
        // ЛЮБАЯ спасылка на google (docs, drive, sheets) ідзе ў Stage 0
        if (externalUrl.includes("google.com")) {
          console.log(
            `📄 Google-спасылка знойдзена, будзе апрацавана праз Stage 0`,
          );
          fullDescription += `\n\nДэталі тут: ${externalUrl}`;
        } else {
          console.log(
            `🔗 Загрузка вонкавага кантэнту (Telegraph/HTML): ${externalUrl}`,
          );
          const externalContent =
            await scraperService.getExternalContent(externalUrl);
          if (externalContent) {
            fullDescription += `\n\n--- ДЭТАЛЬНАЕ АПІСАННЕ ПА СПАСЫЛЦЫ ---\n${externalContent}`;
          }
        }
      }

      // 6. Stage 0 + Stage 2
      const enrichedText = await enrichTextWithDocs(fullDescription);

      const result = await processVacancyMessage(
        enrichedText,
        "Google Sheets",
        source.agencyName,
        fullDescription,
        false,
        "FULL_VACANCY",
      );

      if (result && !result.error) {
        source.processedHashes.push(rowHash);
        if (source.processedHashes.length > 500) source.processedHashes.shift();
        await source.save();
        console.log(`✅ Дададзена: ${rowDataObj.position.value}`);
      }

      await new Promise((r) => setTimeout(r, 2000));
    }

    source.lastProcessedAt = new Date();
    await source.save();
    console.log(`🏁 Сінхранізацыя ${source.sheetName} завершана.`);
  } catch (err) {
    console.error(`❌ Sync Error:`, err.message);
  }
}

async function syncAllSheets() {
  const sources = await SheetSource.find({ status: "active" });
  for (const source of sources) {
    await syncSheetVacancies(source._id);
  }
}

module.exports = { syncSheetVacancies, syncAllSheets };
