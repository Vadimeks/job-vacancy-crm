const { google } = require("googleapis");
const path = require("path");
const crypto = require("crypto");
const SheetSource = require("../models/SheetSource");
const Vacancy = require("../models/Vacancy");
const SyncHistory = require("../models/SyncHistory");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const aiService = require("./ai.service");
const scraperService = require("./scraper.service");
const { analyzeAndCompareWithGemini } = require("./gemini.service");
const { processVacancyMessage } = require("../routes/vacancies");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-creds.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// --- КЛЮЧАВЫЯ СЛОВЫ ДЛЯ ПОШУКУ РАДКА ЗАГАЛОЎКАЎ ---
// Дадаем усе вядомыя загалоўкі з усіх табліц
const HEADER_KEYWORDS = [
  // Агульныя
  "вакансія",
  "вакансия",
  "проект",
  "статус",
  "посада",
  "ставка",
  "оплата",
  "пол",
  "місто",
  "city",
  "klient",
  "опис",
  "назва",
  "фірма",
  // INTRASERVICE Польша
  "место работы",
  "выходы",
  "количество мест",
  "возраст",
  // INTRASERVICE Голандія / Opiekunki
  "rekrutacji",
  "lokalizacja",
  "wynagrodzenie",
  "podopieczny",
  "start pracy",
  "dodatkowa",
  "umowa",
  "płeć",
  "dokumenty",
  // РАЛЕН
  "локализация",
  "гражданство",
  "колво",
  "кол-во",
  "дата выхода",
  "вознаг",
  "комментарий",
  // ОТТО
  "стать",
  "громадянство",
  "офіс",
  "функції",
  "клієнта",
  "контракту",
  "recruitment",
  "order",
  // МРУВКІ
  "должность",
  "национальность",
  "примечание",
  "sanepid",
  // ВЕКОС
  "актуально",
  "доїзд",
  "доплата",
  // БІСАР
  "адреса",
  "координатори",
  "локації",
  "житло",
];

/**
 * Вызначае ці з'яўляецца колер ячэйкі "небелым" (для RALEN).
 * Дэфолтны/белы фон = { red:1, green:1, blue:1 } або undefined.
 * Любы іншы колер = вакансія актыўная.
 */
function hasNonWhiteBackground(cell) {
  if (!cell) return false;
  const bg = cell.effectiveFormat?.backgroundColor;
  if (!bg) return false;
  // Калі ўсе каналы = 1 (або адсутнічаюць, бо дэфолт = 1) — гэта белы
  const r = bg.red ?? 1;
  const g = bg.green ?? 1;
  const b = bg.blue ?? 1;
  // Дапускаем невялікае адхіленне (0.99+) на выпадак float-акруглення
  return !(r >= 0.99 && g >= 0.99 && b >= 0.99);
}

/**
 * Вызначае статус радка.
 * Праглядае ВСЕ ячэйкі радка — шукае маркеры закрыцця.
 * Для RALEN дадаткова правярае фон першай непустой ячэйкі.
 */
function getRowStatus(cells, agencyName) {
  if (!cells || cells.length === 0) return "EMPTY";

  // 1. Універсальны фільтр шуму: мінімум 3 запоўненыя ячэйкі
  const filledCount = cells.filter(
    (c) => (c?.formattedValue || "").trim() !== "",
  ).length;
  if (filledCount < 3) return "EMPTY";

  // 2. Спецыяльнае правіла для RALEN (колер фону)
  if (agencyName === "RALEN") {
    const firstFilledCell = cells.find(
      (c) => c && (c.formattedValue || "").trim() !== "",
    );
    if (firstFilledCell && !hasNonWhiteBackground(firstFilledCell)) {
      return "STOP";
    }
  }

  // 3. Адсякаем па STOP-маркерах
  const STOP_MARKERS = [
    "❌",
    "✖️",
    "nieaktualne",
    "закрыто",
    "стоп",
    "stop",
    "архив",
    "не актив",
    "false",
    "0",
  ];

  for (const cell of cells) {
    if (!cell) continue;
    const val = (cell.formattedValue || "").trim().toLowerCase();
    if (STOP_MARKERS.some((m) => val.includes(m))) return "STOP";
  }

  // 4. Калі не знайшлі STOP і дастаткова тэксту — вакансія АКТЫЎНАЯ
  return "ACTIVE";
}

/**
 * Здабывае значэнне, спасылку і нататку з адной ячэйкі.
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
 * Збірае поўны тэкст радка ў фармаце "Загаловак: Значэнне".
 * Дадае cell note побач з ячэйкай.
 * Спасылкі (акрамя фота жылля) дадаюцца як тэкст.
 * Вяртае: { text, externalUrls, title }
 */
function buildRowText(cells, headers) {
  const parts = [];
  const externalUrls = [];
  let title = "";

  // Словы, якія сігналізуюць пра фота жылля — такія спасылкі ігнаруем як крыніцу кантэнту
  const PHOTO_KEYWORDS = ["фото", "photo", "зображення", "image", "picture"];

  for (let j = 0; j < headers.length; j++) {
    const header = (headers[j] || "").trim();
    if (!header) continue; // Прапускаем слупкі без загалоўка

    const cell = cells[j] || null;
    const { value, link, note } = extractCellData(cell);

    if (!value && !link && !note) continue; // Пустая ячэйка — прапускаем

    // Ігнаруем тэхнічныя ID пры выбары назвы (напр. 2026-79319 або хэшы)
    const isTechnicalId =
      /^\d{4}-\d+$/.test(value.trim()) ||
      value.trim().toUpperCase().startsWith("ID") ||
      (value.trim().length > 15 && /^[a-f0-9]+$/i.test(value.trim()));

    if (!title && value && !isTechnicalId) title = value.trim();

    // Фармуем радок: "Загаловак: Значэнне"
    let line = `${header}: ${value}`;

    // Дадаем нататку (cell note) адразу пасля значэння
    if (note) {
      line += `\n  [Нататка да "${header}": ${note}]`;
    }

    parts.push(line);

    // Апрацоўка спасылак
    if (link && link.startsWith("http")) {
      const headerLower = header.toLowerCase();
      const isPhoto = PHOTO_KEYWORDS.some((kw) => headerLower.includes(kw));

      if (isPhoto) {
        // Фота жылля: дадаем толькі як тэкст, змест не спампоўваем
        parts.push(`  [Фота/зображення: ${link}]`);
      } else {
        // Усе іншыя спасылкі — збіраем для спампоўкі кантэнту
        externalUrls.push({ url: link, header });
        parts.push(`  [Спасылка: ${link}]`);
      }
    }
  }

  return {
    text: parts.join("\n"),
    externalUrls,
    title: title || "Без назви",
  };
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

  const stats = { added: 0, updated: 0, closed: 0, ignored: 0 };
  const details = [];
  const foundHashesInSheet = new Set();

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

    for (let i = 0; i < Math.min(rowData.length, 20); i++) {
      const rowValues = (rowData[i].values || []).map((v) =>
        (v.formattedValue || "").toLowerCase(),
      );
      const matchCount = rowValues.filter((rv) =>
        HEADER_KEYWORDS.some((kw) => rv.includes(kw)),
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

    // Захоўваем загалоўкі як масіў радкоў (індэкс = нумар слупка)
    const headers = (rowData[headerRowIndex].values || []).map(
      (v) => v.formattedValue || "",
    );
    console.log("📋 Загалоўкі:", headers.filter((h) => h.trim()).join(" | "));

    // --- КРОК 2: Загружаем апошнія вакансіі для кантэксту дэдуплікацыі ---
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentVacancies = await Vacancy.find({
      createdAt: { $gte: thirtyDaysAgo },
    })
      .select(
        "vacancydescription location agencyName salary.rawSalaryDisplay createdAt",
      )
      .limit(50);

    // --- КРОК 3: ЦЫКЛ ПА РАДКАХ ---
    for (let i = headerRowIndex + 1; i < rowData.length; i++) {
      const cells = rowData[i].values;
      if (
        rowData[i].rowMetadata?.hiddenByUser ||
        rowData[i].rowMetadata?.hiddenByFilter
      )
        continue;

      const rowStatus = getRowStatus(cells, source.agencyName);
      if (rowStatus === "EMPTY") continue;

      const {
        text: rowBodyText,
        externalUrls,
        title: rowTitle,
      } = buildRowText(cells || [], headers);
      if (!rowBodyText.trim()) continue;

      const rowHash = crypto
        .createHash("md5")
        .update(`${source.agencyName}::${rowBodyText}`)
        .digest("hex");

      // 1. Шукаем існуючую вакансію
      const existingVacancy = await Vacancy.findOne({ sourceHash: rowHash });

      // 2. Калі радок у табліцы STOP
      if (rowStatus === "STOP") {
        foundHashesInSheet.add(rowHash);
        if (existingVacancy && existingVacancy.status === "active") {
          existingVacancy.status = "closed";
          await existingVacancy.save();
          stats.closed++;
          details.push(
            `🛑 [${existingVacancy.vacancyCode || "N/A"}] ${rowTitle}`,
          );
        }
        continue;
      }

      // 3. Калі радок ACTIVE, і ў базе яна ўжо ACTIVE — пропуск
      if (existingVacancy && existingVacancy.status === "active") {
        foundHashesInSheet.add(rowHash);
        stats.ignored++;
        continue;
      }

      // 4. Апрацоўка (Новая або Рэанімацыя)
      console.log(
        `🚀 Апрацоўка: ${rowTitle} (${existingVacancy ? "Рэанімацыя" : "Новая"})`,
      );
      foundHashesInSheet.add(rowHash);

      let externalContent = "";
      for (const { url, header } of externalUrls) {
        if (!url.includes("google.com")) {
          const scraped = await scraperService.getExternalContent(url);
          if (scraped)
            externalContent += `\n\n--- ЗМЕСТ ПА СПАСЫЛЦЫ (${header}) ---\n${scraped}`;
        }
      }

      const rawRowText = `[SOURCE: SPREADSHEET_ROW | AGENCY: ${source.agencyName}]\n${rowBodyText}${externalContent}`;
      const analysis = await analyzeAndCompareWithGemini(
        rawRowText,
        [],
        recentVacancies,
      );

      if (!analysis) {
        console.log(`⏳ AI Cooldown на радку ${i + 1}. Спыняем сінхранізацыю.`);
        return "STOP_ALL";
      }

      if (existingVacancy && existingVacancy.status === "closed") {
        // РЭАНІМАЦЫЯ
        existingVacancy.status = "active";
        if (analysis.translatedFragments?.[0]) {
          existingVacancy.rawText = analysis.translatedFragments[0];
        }
        await existingVacancy.save();
        stats.updated++;
        details.push(
          `🔄 [${existingVacancy.vacancyCode}] ${rowTitle} (Адноўлена)`,
        );
      } else if (analysis.category === "FULL_VACANCY") {
        // НОВАЯ
        let lastCreatedCode = "NEW";
        for (const fragment of analysis.translatedFragments) {
          const savedVac = await processVacancyMessage(
            fragment,
            "Google Sheets",
            source.agencyName,
            fragment,
            false,
            "FULL_VACANCY",
            rowHash,
          );
          if (savedVac && savedVac.vacancyCode)
            lastCreatedCode = savedVac.vacancyCode;
          await new Promise((r) => setTimeout(r, 2000));
        }
        stats.added++;
        details.push(`✨ [${lastCreatedCode}] ${rowTitle}`);
      }

      await new Promise((r) => setTimeout(r, 5000));
    }

    // --- АЎТА-ЗАКРЫЦЦЁ ВАКАНСІЙ, ЯКІХ НЯМА Ў ТАБЛІЦЫ ---
    if (foundHashesInSheet.size > 0) {
      // Знаходзім вакансіі, якія будуць закрыты, каб захаваць іх ID для справаздачы
      const vacanciesToClose = await Vacancy.find({
        agencyName: source.agencyName,
        status: "active",
        sourceHash: { $exists: true, $nin: Array.from(foundHashesInSheet) },
      }).select("_id vacancyCode vacancydescription position");

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
        // Дадаем кожную аўтаматычна закрытую вакансію ў спіс дэталяў з яе айдзі і назвай
        for (const vac of vacanciesToClose) {
          details.push(
            `🛑 [${vac.vacancyCode || "N/A"}] ${vac.vacancydescription || vac.position || "Без назвы"}`,
          );
        }
      }
    }

    // --- ЗАПІС ГІСТОРЫІ Ў БАЗУ ---
    await SyncHistory.create({
      agencyName: source.agencyName,
      sheetName: source.sheetName,
      stats,
      details,
      status: "success",
    });

    // --- СПРАВАЗДАЧА Ў INBOX ---
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
          .join("\n"); // Перанос радка для лепшага чытання спісу з ID
        reportText += `\n✨ **Нові (${stats.added}):**\n${addedNames}\n`;
      }

      if (stats.updated > 0) {
        const updatedNames = details
          .filter((d) => d.startsWith("🔄"))
          .map((d) => d.replace("🔄 ", ""))
          .join("\n");
        reportText += `\n🔄 **Оновлені (${stats.updated}):**\n${updatedNames}\n`;
      }

      if (stats.closed > 0) {
        const closedNames = details
          .filter((d) => d.startsWith("🛑"))
          .map((d) => d.replace("🛑 ", ""))
          .join("\n");
        reportText += `\n🛑 **Закриті (${stats.closed}):**\n${closedNames}\n`;
      } else {
        reportText += `\n🛑 Закриті: 0\n`;
      }
      reportText += `\n⏭️ Ігноровано (дублі): ${stats.ignored}`;

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
    const result = await syncSheetVacancies(source._id);

    if (result === "STOP_ALL") {
      console.error("🛑 Сінхранізацыя перарвана: AI Cooldown.");
      break;
    }
    // Невялікая паўза паміж табліцамі для бяспекі
    await new Promise((r) => setTimeout(r, 5000));
  }
}

module.exports = { syncSheetVacancies, syncAllSheets };
