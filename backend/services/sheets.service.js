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
  // WORK&HUMAN
  "назва вакансії",
  "опис вакансії",
  "вікова категорія",
  "оплата посередникам",
  "контакт координатор",
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
/**
/**
 * Вызначае статус радка на аснове агенцыі і загалоўкаў.
 */
function getRowStatus(cells, agencyName, headers = [], rowIndex = 0) {
  if (!cells || cells.length === 0) return "EMPTY";
  const filledCount = cells.filter(
    (c) => (c?.formattedValue || "").trim() !== "",
  ).length;
  if (filledCount < 3) return "EMPTY";

  const rowNum = rowIndex + 1;

  // 1. RALEN — па колеры фону першай ячэйкі (Слупок А)
  if (agencyName === "RALEN") {
    const firstCell = cells[0];
    const format = firstCell?.effectiveFormat;
    const bg = format?.backgroundColor;
    const bgStyle = format?.backgroundColorStyle;

    // Калі аб'ект bg адсутнічае — гэта дакладна белы (дэфолт)
    if (!bg || Object.keys(bg).length === 0) {
      return "STOP";
    }

    // Адсутны канал = 0 (не 1!), бо {"green":1} азначае чысты зялёны
    const r = bg.red ?? 0;
    const g = bg.green ?? 0;
    const b = bg.blue ?? 0;

    // --- ДАДАТКОВА: чытаем backgroundColorStyle.rgbColor ---
    // Калі колер выстаўлены праз новы пікер Google Sheets,
    // ён трапляе ў bgStyle.rgbColor, а bg застаецца {1,1,1}
    const rgbStyle = bgStyle?.rgbColor;
    const sr = rgbStyle?.red ?? 0;
    const sg = rgbStyle?.green ?? 0;
    const sb = rgbStyle?.blue ?? 0;

    // Вызначаем, ці з'яўляецца колер небелым — праверяем абодва крыніцы
    // Вызначаем колер па абодвух крыніцах (берам максімум з кожнага канала)
    const fr = Math.min(r, sr);
    const fg = Math.max(g, sg);
    const fb = Math.min(b, sb);

    // Толькі зялёны і аранжавы лічацца актыўнымі.
    // Зялёны:   R≈0, G≈1, B≈0  → {"green":1}
    // Аранжавы: R≈1, G≈0.6, B≈0
    // Шэры, белы і любы іншы — STOP
    const isGreen = fg > 0.8 && fr < 0.2 && fb < 0.2;
    const isOrange = fr > 0.8 && fg > 0.4 && fg < 0.8 && fb < 0.2;

    const isColor = isGreen || isOrange;

    // 🔍 ДЭБАГ: Цяпер з нумарам радка і тыпам колеру
    console.log(
      `[Color Debug] Row: ${rowNum} | Title: ${cells[0]?.formattedValue?.substring(0, 15)} | R:${r.toFixed(3)} G:${g.toFixed(3)} B:${b.toFixed(3)} | StyleRGB: ${sr.toFixed(3)}/${sg.toFixed(3)}/${sb.toFixed(3)} | Theme: ${bgStyle?.themeColor || "NONE"} | Result: ${isColor ? "ACTIVE" : "STOP"}`,
    );

    return isColor ? "ACTIVE" : "STOP";
  }

  // 2. OTTO — заўсёды ACTIVE (прыхаваныя радкі адсякаюцца раней)
  if (agencyName === "OTTO") return "ACTIVE";

  // 3. Мапінг слупкоў статусу паводле патрабаванняў
  const statusHeadersMap = {
    BISAR: ["актив", "не актив"],
    VEKOS: ["актуально"],
    "WORK&HUMAN": ["статус"],
    MRÓWKI: ["статус"],
    INTRASERVICE: ["статус вакансии", "status rekrutacji"],
  };

  const targetHeaders = statusHeadersMap[agencyName] || [];
  let statusValue = "";
  let foundHeaderName = "";

  // Шукаем значэнне ў патрэбным слупку
  for (let j = 0; j < headers.length; j++) {
    const h = (headers[j] || "").toLowerCase().trim();
    const cleanH = h.replace(/\s+/g, " "); // Ачыстка загалоўка ад пераносаў

    if (targetHeaders.some((th) => cleanH.includes(th.toLowerCase()))) {
      statusValue = (cells[j]?.formattedValue || "").trim().toLowerCase();
      foundHeaderName = cleanH;
      break;
    }
  }

  const STOP_MARKERS = [
    "❌",
    "false",
    "стоп",
    "stop",
    "закрыто",
    "nieaktualne",
    "не актуально",
    "rezerwa",
    "brak",
  ];

  if (foundHeaderName) {
    const isStop = STOP_MARKERS.some((m) => statusValue.includes(m));
    console.log(
      `[Status Debug] Row: ${rowNum} | Agency: ${agencyName} | Column: "${foundHeaderName}" | Value: "${statusValue}" | Result: ${isStop ? "STOP" : "ACTIVE"}`,
    );
  }

  if (statusValue && STOP_MARKERS.some((m) => statusValue.includes(m)))
    return "STOP";

  if (!statusValue) {
    const firstCell = (cells[0]?.formattedValue || "").trim().toLowerCase();
    if (STOP_MARKERS.some((word) => firstCell.includes(word))) return "STOP";
  }

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
function buildRowText(cells, headers, agencyName, sheetName) {
  const parts = [];
  const externalUrls = [];
  let title = "";
  let anchorParts = [];

  const ANCHOR_MAP = {
    BISAR: ["місто приїзду", "проект", "локації місця роботи"],
    VEKOS: ["вакансія", "проект", "місто приїзду"],
    OTTO: ["офіс отто", "функції", "назва клієнта"],
    MRÓWKI: ["№", "должность", "место работы"],
    RALEN: [
      "название вакансии", // 👈 Цяпер знойдзе нават з пераносам радка
      "локализация",
      "комментарий", // 👈 Дадаем для ўнікальнасці хэша (Row 8 vs Row 9)
    ],
    INTRASERVICE:
      sheetName === "Opiekunki"
        ? ["lokalizacja/ podopieczny"]
        : sheetName === "Голандія"
          ? ["вакансия/ опис", "название в crm"]
          : sheetName === "Польша"
            ? ["вакансия", "название в crm", "место работы"]
            : [],
    "WORK&HUMAN": ["назва вакансії", "опис вакансії", "локалізалізація"],
  };

  const agencyAnchors = ANCHOR_MAP[agencyName] || [];

  for (let j = 0; j < headers.length; j++) {
    const header = (headers[j] || "").trim();
    if (!header) continue;

    // 🆕 Ачыстка загалоўка ад пераносаў радкоў і лішніх прабелаў для параўнання
    const headerLower = header.toLowerCase().replace(/\s+/g, " ");

    const cell = cells[j] || null;
    const { value, link, note } = extractCellData(cell);
    if (!value && !link && !note) continue;

    // 1. Збіраем СЕМАНТЫЧНЫ ЯКАР
    if (agencyAnchors.some((a) => headerLower.includes(a.toLowerCase()))) {
      anchorParts.push(value.replace(/\s+/g, " ").trim());
    }

    // 2. Вызначаем назву для справаздачы
    const hasLetters = /[a-zA-Zа-яёіўА-ЯЁІЎ]/.test(value);
    const isStatusWord = [
      "активная",
      "приоритет",
      "акция",
      "активна",
      "закрыто",
    ].includes(value.trim().toLowerCase());
    if (!title && value && hasLetters && value.length > 2 && !isStatusWord) {
      title = value.trim();
    }

    let line = `${header}: ${value}`;
    if (note) line += `\n  [Нататка: ${note}]`;
    parts.push(line);

    if (link && link.startsWith("http")) {
      const linkLower = link.toLowerCase();
      const isPhoto =
        linkLower.includes("zhitlo") ||
        linkLower.includes("foto") ||
        linkLower.includes("photo");

      // 🆕 Новая праверка: ігнаруем пэўныя калонкі для скрапінгу, каб не блытаць AI
      const isIgnoredForScraping =
        headerLower.includes("link na strone") ||
        headerLower.includes("фото видео") ||
        headerLower.includes("оплата для партнера");

      if (!isPhoto && !isIgnoredForScraping) {
        externalUrls.push({ url: link, header });
        parts.push(`  [Спасылка: ${link}]`);
      } else {
        // Пакідаем у тэксце для рэкрутэра, але не адпраўляем на скрапінг
        const label = isPhoto ? "Фота" : "Спасылка";
        parts.push(`  [${label}: ${link}]`);
      }
    }
  }

  return {
    text: parts.join("\n"),
    externalUrls,
    title: title || "Без назви",
    anchorText: anchorParts.join("::") || title,
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
    // Разумнае фармаванне назвы ліста: двукоссі патрэбны толькі калі ёсць прабелы
    const safeSheetName = source.sheetName.includes(" ")
      ? `'${source.sheetName}'`
      : source.sheetName;

    const response = await sheets.spreadsheets.get({
      spreadsheetId: source.spreadsheetId,
      ranges: [`${safeSheetName}!A1:Z150`],
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

      // Перадаем headers і індэкс i для дакладнага вызначэння статусу і логаў
      const rowStatus = getRowStatus(cells, source.agencyName, headers, i);

      if (rowStatus === "EMPTY") continue;

      const {
        text: rowBodyText,
        externalUrls,
        title: rowTitle,
        anchorText: rowAnchor, // 👈 Атрымліваем якар
      } = buildRowText(
        cells || [],
        headers,
        source.agencyName,
        source.sheetName,
      );

      if (!rowBodyText.trim()) continue;

      // 2. Ствараем СЕМАНТЫЧНЫ ХЭШ (Агенцыя + Ліст + Якар)
      // Гэта дазваляе вакансіі "пераязджаць" па табліцы без стварэння дублікатаў
      const rowHash = crypto
        .createHash("md5")
        .update(`${source.agencyName}::${source.sheetName}::${rowAnchor}`)
        .digest("hex");

      const existingVacancy = await Vacancy.findOne({ sourceHash: rowHash });

      // 3. Калі радок у табліцы STOP
      if (rowStatus === "STOP") {
        foundHashesInSheet.add(rowHash);
        if (existingVacancy && existingVacancy.status === "active") {
          existingVacancy.status = "closed";
          await existingVacancy.save();
          stats.closed++;
          details.push(
            `🛑 [${existingVacancy.vacancyCode || "N/A"}] ${rowTitle} (Row: ${i + 1})`,
          );
        }
        continue;
      }

      // 4. Калі вакансія ўжо ёсць і яна ACTIVE
      if (existingVacancy && existingVacancy.status === "active") {
        foundHashesInSheet.add(rowHash);

        // ПРАВЕРКА: Ці змяніўся поўны тэкст радка?
        // Калі тэкст супадае на 100% — ігнаруем (поўны дублікат)
        if (existingVacancy.originalText === rowBodyText) {
          stats.ignored++;
          continue;
        }
        // Калі тэкст розны — ідзем далей на AI-абнаўленне (UPDATE)
        console.log(
          `🔄 Абнаўленне дадзеных для ${existingVacancy.vacancyCode} (Row: ${i + 1})`,
        );
      }

      // 5. Апрацоўка (Новая, Рэанімацыя або Абнаўленне)
      console.log(
        `🚀 [Row ${i + 1}] Апрацоўка: ${rowTitle} (${existingVacancy ? (existingVacancy.status === "closed" ? "Рэанімацыя" : "Абнаўленне") : "Новая"})`,
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
        console.log(`⏳ AI не адказаў для радка ${i + 1}. Пропуск.`);
        continue;
      }

      console.log(
        `🧠 AI Verdict [Row ${i + 1}]: Category=${analysis.category}, Verdict=${analysis.comparison?.verdict || "NEW"}`,
      );

      // 1. ЛОГІКА ДЛЯ UPDATE АБО RECRUITER_INFO (ІДУЦЬ У INBOX)
      // Калі AI пазначыў як UPDATE (напрыклад, кароткі тэкст) або RECRUITER_INFO — заўсёды ў інбокс
      if (
        analysis.category === "UPDATE" ||
        analysis.category === "RECRUITER_INFO" ||
        analysis.comparison?.verdict === "UPDATE"
      ) {
        const vacCode = existingVacancy
          ? `[${existingVacancy.vacancyCode}] `
          : "";
        const msgCategory =
          analysis.category === "RECRUITER_INFO" ? "info" : "update";

        await new UnprocessedMessage({
          sender: "Google Sheets",
          agencyName: source.agencyName,
          text: `Дадзеныя з табліцы (Row: ${i + 1}) для: ${vacCode}${rowTitle}\n\n${analysis.translatedFragments?.[0] || rawRowText}`,
          category: msgCategory,
          source: "google_sheets",
          aiAnalyzed: true,
        }).save();

        stats.updated++;
        details.push(`🔄 ${vacCode}${rowTitle} (Row: ${i + 1}) -> Inbox`);
        continue; // 👈 Абавязкова пераходзім да наступнага радка
      }
      // 2. ЛОГІКА ДЛЯ РЭАНІМАЦЫІ (Калі вакансія была CLOSED, а стала ACTIVE і яна FULL)
      if (existingVacancy && existingVacancy.status === "closed") {
        existingVacancy.status = "active";
        existingVacancy.originalText = rowBodyText; // 👈 ДАДАЕМ ГЭТА
        if (analysis.translatedFragments?.[0]) {
          existingVacancy.rawText = analysis.translatedFragments[0];
        }
        await existingVacancy.save();
        stats.updated++;
        details.push(
          `🔄 [${existingVacancy.vacancyCode}] ${rowTitle} (Row: ${i + 1}) (Адноўлена)`,
        );
        continue;
      }

      // 3. ЛОГІКА ДЛЯ НОВЫХ ПАЎНАВАЖНЫХ ВАКАНСІЙ (АБО АБНАЎЛЕННЯЎ)
      if (analysis.category === "FULL_VACANCY") {
        let fragmentIndex = 0;
        for (const fragment of analysis.translatedFragments) {
          const savedVac = await processVacancyMessage(
            fragment,
            "Google Sheets",
            source.agencyName,
            rowBodyText, // 👈 Гэта запіша сыры тэкст у базу
            false,
            "FULL_VACANCY",
            rowHash,
            source.sheetName,
            fragmentIndex === 0
              ? existingVacancy
                ? existingVacancy._id
                : null
              : null,
          );

          if (savedVac && savedVac.vacancyCode) {
            if (fragmentIndex === 0 && existingVacancy) {
              stats.updated++;
              details.push(
                `🔄 [${savedVac.vacancyCode}] ${rowTitle} (Row: ${i + 1})`,
              );
            } else {
              stats.added++;
              details.push(
                `✨ [${savedVac.vacancyCode}] ${rowTitle} (Row: ${i + 1}${fragmentIndex > 0 ? " - ч." + (fragmentIndex + 1) : ""})`,
              );
            }
          }
          fragmentIndex++;
          await new Promise((r) => setTimeout(r, 2000));
        }
      }

      await new Promise((r) => setTimeout(r, 5000));
    }

    // --- АЎТА-ЗАКРЫЦЦЁ ВАКАНСІЙ, ЯКІХ НЯМА Ў ТАБЛІЦЫ ---
    if (foundHashesInSheet.size > 0) {
      // Знаходзім вакансіі, якія будуць закрыты, каб захаваць іх ID для справаздачы
      const vacanciesToClose = await Vacancy.find({
        agencyName: source.agencyName,
        sheetName: source.sheetName, // 👈 ДАДАДЗЕНА: шукаем толькі ў межах гэтага ліста
        status: "active",
        sourceHash: { $exists: true, $nin: Array.from(foundHashesInSheet) },
      }).select("_id vacancyCode vacancydescription position");

      const closeResult = await Vacancy.updateMany(
        {
          agencyName: source.agencyName,
          sheetName: source.sheetName, // 👈 ДАДАДЗЕНА: закрываем толькі свае
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
        const addedNames = details.filter((d) => d.startsWith("✨")).join("\n");
        reportText += `\n✨ **Нові (${stats.added}):**\n${addedNames}\n`;
      }

      if (stats.updated > 0) {
        const updatedNames = details
          .filter((d) => d.startsWith("🔄"))
          .join("\n");
        reportText += `\n🔄 **Оновлені (${stats.updated}):**\n${updatedNames}\n`;
      }

      if (stats.closed > 0) {
        const closedNames = details
          .filter((d) => d.startsWith("🛑"))
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
