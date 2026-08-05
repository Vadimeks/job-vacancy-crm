const { google } = require("googleapis");
const path = require("path");
const crypto = require("crypto");
const SheetSource = require("../models/SheetSource");
const Vacancy = require("../models/Vacancy");
const SyncHistory = require("../models/SyncHistory");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const aiService = require("./ai.service");
const scraperService = require("./scraper.service");
const { analyzeAndCompareWithGemini, enrichTextWithDocs } = require("./gemini.service");
const { processVacancyMessage } = require("../routes/vacancies");
const {
  sendToTelegram,
  notifyRecruiterAboutMatch,
  notifyDev, // 👈 Дадаць сюды
} = require("./telegram.service");
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-creds.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
// 🗺️ Мапа дакументаў для PPG (BIEDRONKA)
const PPG_DOCS_MAP = {
  "DPD + magazynier": "1bi9kIorWYnH-SOv2lytvqWem-8ZRGSzb",
  "ILS + magazynier": "1bVKnAnMK6jeAJWCN-uvOcP2_p_pyD_dz",
  "JMP + kasa": "1xVi7AnBLJ8R8W0FI7qsK5AVinnUAmknn",
  "JMP + lady": "1aRpKstvbhL4Ecul9GF7k-NBDIVUyCK9r",
  "JMP + magazynier": "1-YMDVtbZd911GnRX51DurJJ14jLjYeVH",
  "JMP + wykładka": "1NvhBwILQTXOlxN2at1KafgUWuMXcNmQJ",
  "STOKROTKA + magazynier": "1U4RpFusjgX-I7RiuvfzDhmsOBy0UUdGe",
  "SUUS + UDT": "1VbjdD7zR1OpKXE1LiMk3t4P8G9uBEIo9",
  "SUUS + Pakowanie": "1wiWF2pttOO8Tf2a0lpU5u3HzhS3payQR",
  "Ligentia": "1vvTTXzxnjFQATWNym91FVS3mC969bmxU",
  "INPOST": "15Esh_9yE71fCBo2KBHk_osH0bPmJ0h24"
};

// 📅 Функцыя праверкі: ці з'яўляецца дата мінулай
function isDateInPast(dateStr) {
  if (!dateStr || dateStr.trim() === "" || dateStr.includes("-")) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  // Шукаем фармат DD.MM або DD.MM.YYYY
  const parts = dateStr.match(/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/);
  if (!parts) return false;
  const day = parseInt(parts[1]);
  const month = parseInt(parts[2]) - 1;
  const year = parts[3] ? (parts[3].length === 2 ? 2000 + parseInt(parts[3]) : parseInt(parts[3])) : now.getFullYear();
  const targetDate = new Date(year, month, day);
  return targetDate < now;
}
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
  // PPG (BIEDRONKA)
  "вихід / приїзд",
  "projekt:",
  "od kiedy:",
  "stanowisko:",
  "kwatera",
  // Staff Power 
  "назва проекту/опис вакансії",
  "оплата за кандидата",
  "кількість кандидатів",
  "дата виходу",
  "місто роботи",
  "агенція",
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
      `[Color Debug] Row: ${rowNum} | Agency: RALEN | Title: ${cells[0]?.formattedValue?.substring(0, 15)} | R:${r.toFixed(3)} G:${g.toFixed(3)} B:${b.toFixed(3)} | StyleRGB: ${sr.toFixed(3)}/${sg.toFixed(3)}/${sb.toFixed(3)} | Theme: ${bgStyle?.themeColor || "NONE"} | Result: ${isColor ? "ACTIVE" : "STOP"}`,
    );

    return isColor ? "ACTIVE" : "STOP";
  }

  // 2. OTTO — заўсёды ACTIVE (прыхаваныя радкі адсякаюцца раней)
  if (agencyName === "OTTO") {
    // 👈 ДАДАДЗЕНА: лог для уніфікацыі з іншымі агенцыямі
    console.log(
      `[Status Debug] Row: ${rowNum} | Agency: OTTO | Column: "auto" | Value: "always active" | Result: ACTIVE`,
    );
    return "ACTIVE";
  }

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

  // --- АБНОЎЛЕНАЯ ЛОГІКА СТАТУСУ ---
  if (foundHeaderName) {
    // Для MRÓWKI: калі слупок знойдзены, але ячэйка пустая — гэта STOP (вырашае праблему аб'яднаных ячэек)
    // Для астатніх: пустая ячэйка пакуль не з'яўляецца STOP (ідзе далей на фолбэк)
    const isStop =
      STOP_MARKERS.some((m) => statusValue.includes(m)) ||
      (agencyName === "MRÓWKI" && !statusValue) ||
      (agencyName === "BISAR" && !statusValue); // 👈 ДАДАДЗЕНА: пустая ячэйка BISAR = STOP

    console.log(
      `[Status Debug] Row: ${rowNum} | Agency: ${agencyName} | Column: "${foundHeaderName}" | Value: "${statusValue}" | Result: ${isStop ? "STOP" : "ACTIVE"}`,
    );

    if (isStop) return "STOP";
  }

  if (statusValue && STOP_MARKERS.some((m) => statusValue.includes(m)))
    return "STOP";
  // Фолбэк: калі значэнне статусу не знойдзена (пустое), правяраем першую ячэйку радка на наяўнасць маркераў STOP
  if (!statusValue) {
    const firstCell = (cells[0]?.formattedValue || "").trim().toLowerCase();
    if (STOP_MARKERS.some((word) => firstCell.includes(word))) return "STOP";
  }

  // 4. Логіка па датах для APOLO і PPG (Аўта-стоп)
  for (let j = 0; j < headers.length; j++) {
    const h = (headers[j] || "").toLowerCase().replace(/\s+/g, " ");
    const val = (cells[j]?.formattedValue || "").trim();

    if (agencyName === "APOLO" && h.includes("вихід / приїзд")) {
      if (isDateInPast(val)) {
        console.log(`[Status Debug] Row: ${rowNum} | APOLO: Дата ў мінулым (${val}) -> STOP`);
        return "STOP";
      }
    }
    if (agencyName === "PPG (BIEDRONKA)" && h.includes("od kiedy:")) {
      if (val && isDateInPast(val)) {
        console.log(`[Status Debug] Row: ${rowNum} | PPG: Дата ў мінулым (${val}) -> STOP`);
        return "STOP";
      }
    }
 

    // 5. STAFF POWER: Калі колькасць кандыдатаў дакладна "0"
    if (agencyName === "STAFF POWER" && h.includes("кількість кандидатів")) {
      if (val === "0") {
        console.log(`[Status Debug] Row: ${rowNum} | STAFF POWER: 0 кандыдатаў -> STOP`);
        return "STOP";
      }
    }
  } // канец цыкла for

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
  let apoloGender = []; // 👈 Дададзена
  let ppgBrand = "";    // 👈 Дададзена
  let ppgPosition = ""; // 👈 Дададзена

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
    APOLO: ["вакансия", "офіс"],
    "PPG (BIEDRONKA)": ["projekt:", "region:", "stanowisko:"],
    "STAFF POWER": ["назва проекту/опис вакансії", "місто роботи", "агенція"],
  };

  const agencyAnchors = ANCHOR_MAP[agencyName] || [];

  for (let j = 0; j < headers.length; j++) {
    const header = (headers[j] || "").trim();
    if (!header) continue;

    // 🆕 Ачыстка загалоўка ад пераносаў радкоў і лішніх прабелаў для параўнання
    const headerLower = header.toLowerCase().replace(/\s+/g, " ");
    // 👈 ДАДАДЗЕНА: ігнаруем слупок каардынатараў для BISAR — інфа для рэкрутэра, не для вакансіі
    if (agencyName === "BISAR" && headerLower.includes("координатор")) continue;
    const cell = cells[j] || null;
    const { value, link, note } = extractCellData(cell);
    if (!value && !link && !note) continue;
// --- СПЕЦЫФІКА APOLO: Гендэр па зорках ---
    if (agencyName === "APOLO") {
      if (headerLower === "ч" && value === "*") apoloGender.push("Чоловіки");
      if (headerLower === "ж" && value === "*") apoloGender.push("Жінки");
      if (headerLower === "пари" && value === "*") apoloGender.push("Пари");
    }

    // --- СПЕЦЫФІКА PPG: Збор для мапінгу ---
    if (agencyName === "PPG (BIEDRONKA)") {
      if (headerLower.includes("projekt:")) ppgBrand = value.trim();
      if (headerLower.includes("stanowisko:")) ppgPosition = value.trim();
      
      if (headerLower.includes("kwatera")) {
        const isProvided = value.toLowerCase().includes("firm");
        parts.push(`Житло: ${isProvided ? "Надається" : "Власне"}`);
        continue; 
      }
    }
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
// --- ФІНАЛЬНАЕ ЎЗБАГАЧЭННЕ PPG ---
 if (agencyName === "PPG (BIEDRONKA)") {
    // 🧠 Разумны пошук ID дакумента (v5.2)
    const brand = ppgBrand.toUpperCase();
    const pos = ppgPosition.toLowerCase();
    let foundDocId = null;

    // Шукаем ключ у мапе, які змяшчаецца ў назве праекта (напр. "JMP" у "JMP KOSZALIN")
    const baseBrandKey = Object.keys(PPG_DOCS_MAP).find(k => brand.includes(k.split(' ')[0]));
    
    if (baseBrandKey) {
      if (pos.includes("кас") || pos.includes("kas")) foundDocId = PPG_DOCS_MAP["JMP + kasa"];
      else if (pos.includes("лад") || pos.includes("lad")) foundDocId = PPG_DOCS_MAP["JMP + lady"];
      else if (pos.includes("выкл") || pos.includes("wyk")) foundDocId = PPG_DOCS_MAP["JMP + wykładka"];
      else if (pos.includes("mag") || pos.includes("склад")) {
         if (brand.includes("DPD")) foundDocId = PPG_DOCS_MAP["DPD + magazynier"];
         else if (brand.includes("ILS")) foundDocId = PPG_DOCS_MAP["ILS + magazynier"];
         else if (brand.includes("STOK")) foundDocId = PPG_DOCS_MAP["STOKROTKA + magazynier"];
         else foundDocId = PPG_DOCS_MAP["JMP + magazynier"];
      }
      else if (brand.includes("LIGENTIA")) foundDocId = PPG_DOCS_MAP["Ligentia"];
      else if (brand.includes("INPOST")) foundDocId = PPG_DOCS_MAP["INPOST"];
      else if (brand.includes("SUUS")) {
        foundDocId = pos.includes("udt") ? PPG_DOCS_MAP["SUUS + UDT"] : PPG_DOCS_MAP["SUUS + Pakowanie"];
      }
    }

   if (foundDocId) {
      const docUrl = `https://docs.google.com/document/d/${foundDocId}/`;
      externalUrls.push({ url: docUrl, header: "Апісанне пасады" });
      parts.push(`[Дадатковае апісанне пасады: ${docUrl}]`);
      // 👈 Абноўлены лог з вывадам ID
      console.log(`🔗 [PPG Match] Знойдзены дакумент для ${ppgBrand}/${ppgPosition} -> ID: ${foundDocId}`);
    }
  }
  if (apoloGender.length > 0) {
    parts.push(`Набір (Стать): ${apoloGender.join(", ")}`);
  }
  return {
    text: parts.join("\n"),
    externalUrls,
    title: title || "Без назви",
    anchorText: anchorParts.join("::") || title,
  };
}
// 👈 ДАДАДЗЕНА: Экранаванне спецсімвалаў для бяспечнага выкарыстання ў $regex (v6.8)
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 👈 АБНОЎЛЕНА: Палепшаны пошук вакансіі па спасылках (v6.8)
async function findVacancyByExternalDocLink(agencyName, externalUrls) {
  // 🛡️ Ахова PPG: для гэтай агенцыі шаблонныя дакументы агульныя для розных гарадоў,
  // таму пошук па спасылцы тут забаронены, каб не зліць розныя лакацыі ў адну.
  if (agencyName === "PPG (BIEDRONKA)") return null;

  const docLinks = (externalUrls || [])
    .map(u => u.url)
    .filter(url => url.includes("docs.google.com") || url.includes("drive.google.com"));

  if (docLinks.length === 0) return null;

  return await Vacancy.findOne({
    agencyName,
    sourceType: "spreadsheet",
    status: { $in: ["active", "closed", "pending_ai"] },
    $or: docLinks.map(link => {
      const cleanLink = escapeRegExp(link.split('?')[0]);
      return {
        $or: [
          { rawText: { $regex: cleanLink, $options: 'i' } },
          { originalText: { $regex: cleanLink, $options: 'i' } }
        ]
      };
    })
  });
}


// 👈 АБНОЎЛЕНА: Палепшаны пошук вакансіі па спасылках (v6.5)
async function findVacancyByExternalDocLink(agencyName, externalUrls) {
  // 🛡️ Ахова PPG: для гэтай агенцыі шаблонныя дакументы агульныя для розных гарадоў,
  // таму пошук па спасылцы тут забаронены, каб не зліць розныя лакацыі ў адну.
  if (agencyName === "PPG (BIEDRONKA)") return null;

  const docLinks = (externalUrls || [])
    .map(u => u.url)
    .filter(url => url.includes("docs.google.com") || url.includes("drive.google.com"));

  if (docLinks.length === 0) return null;

  return await Vacancy.findOne({
    agencyName,
    sourceType: "spreadsheet",
    // 👈 ДАДАДЗЕНА: шукаем і сярод чарнавікоў (pending_ai), каб не пладзіць іх
    status: { $in: ["active", "closed", "pending_ai"] },
    $or: docLinks.map(link => {
      // 👈 ЗМЕНЕНА: выкарыстоўваем escapeRegExp для бяспекі
      const cleanLink = escapeRegExp(link.split('?')[0]);
      return {
        $or: [
          { rawText: { $regex: cleanLink, $options: 'i' } },
          { originalText: { $regex: cleanLink, $options: 'i' } }
        ]
      };
    })
  });
}
/**
 * Вяртае масіў ячэек для радка rowIndex,
 * падстаўляючы значэнні з першых радкоў аб'яднанняў.
 * Вырашае праблему пустых ячэек у аб'яднаных блоках (напр. BISAR).
 */
function resolveMergedCells(rowIndex, rowData, merges) {
  const originalCells = rowData[rowIndex]?.values || [];
  if (!merges || merges.length === 0) return originalCells;

  // Капіруем масіў каб не мутаваць арыгінал
  const resolved = [...originalCells];

  for (const merge of merges) {
    // Ці трапляе бягучы радок у гэтае аб'яднанне (акрамя першага радка — у яго ёсць значэнне)
    if (rowIndex > merge.startRowIndex && rowIndex < merge.endRowIndex) {
      const col = merge.startColumnIndex;
      const sourceCell = rowData[merge.startRowIndex]?.values?.[col];
      if (sourceCell) {
        if (!resolved[col] || !resolved[col].formattedValue) {
          resolved[col] = sourceCell;
        }
        if (sourceCell.note && !resolved[col].note) {
          resolved[col].note = sourceCell.note;
        }
      }
    }
  }

  return resolved;
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
  // Ініцыялізацыя прагрэсу (v8.26 fix)
  global.syncProgress = { current: 0, total: 0, status: 'running', agency: source.agencyName };
  global.stopSyncRequested = false;
  // 🔄 Чытаем стан "Кола" (Circular Sync)
  const SyncState = require("../models/SyncState");
  const syncState = await SyncState.findOne({ key: "circular_sync_position" }) || new SyncState();
  const startIndex = (syncState.lastSourceId?.toString() === source._id.toString()) ? syncState.lastIndex : 0;
  const hotUpdates = []; // 👈 Акумулятар для групавання паведамленняў у Inbox
  const foundHashesInSheet = new Set();

  try {
    // 👈 ДАДАДЗЕНА: Дынамічны выбар ліста для OTTO (v8.14)
    let actualSheetName = source.sheetName;

    if (source.agencyName === "OTTO") {
      try {
        const meta = await sheets.spreadsheets.get({
          spreadsheetId: source.spreadsheetId,
          includeGridData: false
        });
        const titles = meta.data.sheets.map(s => s.properties.title);
        
        // Шукаем усе лісты WEEK XX (ігнаруючы рэгістр і прабелы) і бярэм з самым вялікім нумарам
        const weekSheets = titles
          .filter(t => /WEEK\s*\d+/i.test(t))
          .map(t => ({ title: t, num: parseInt(t.match(/\d+/)[0]) }))
          .sort((a, b) => b.num - a.num);

        if (weekSheets.length > 0) {
          actualSheetName = weekSheets[0].title;
          if (actualSheetName !== source.sheetName) {
            console.log(`📅 [OTTO] Знойдзены новы ліст: ${actualSheetName} (было: ${source.sheetName})`);
            source.sheetName = actualSheetName;
            await source.save(); // Захоўваем у базу, каб наступны раз не шукаць занова
          }
        }
      } catch (metaErr) {
        console.error("⚠️ Не ўдалося атрымаць спіс лістоў для OTTO:", metaErr.message);
      }
    }

    // Разумнае фармаванне назвы ліста: двукоссі патрэбны толькі калі ёсць прабелы
    const safeSheetName = actualSheetName.includes(" ")
      ? `'${actualSheetName}'`
      : actualSheetName;

    const response = await sheets.spreadsheets.get({
      spreadsheetId: source.spreadsheetId,
      ranges: [`${safeSheetName}!A1:Z150`],
      includeGridData: true,
    });

    const rowData = response.data.sheets[0].data[0].rowData;
    // 👈 ДАДАДЗЕНА: здабываем інфармацыю аб аб'яднаных ячэйках (для BISAR і падобных)
    const merges = response.data.sheets[0].merges || [];
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
    // 👈 АБНАЎЛЯЕМ ПРАГРЭС (колькасць радкоў)
    // 👈 ВЫПРАЎЛЕНА: лічым толькі запоўненыя радкі для дакладнасці прагрэсу (v8.16)
    const actualRows = rowData.slice(headerRowIndex + 1).filter(row => {
      return row.values && row.values.some(v => v.formattedValue && v.formattedValue.trim() !== "");
    });
    global.syncProgress.total = actualRows.length;
    global.syncProgress.current = 0;
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
    global.syncProgress.current++; // 👈 КРОК ЛІЧЫЛЬНІКА
      // Пропуск, калі мы яшчэ не дайшлі да патрэбнага індэкса ў гэтым коле
      // 👈 ВЫПРАЎЛЕНА: Чакаем, толькі калі гэта фонавы Watchdog, а не сам ручны запуск (v8.8)
      if (!global.isManualSync && global.isManualActionInProgress) {
        while (global.isManualActionInProgress) {
          console.log("⏳ [Sync] Фонавая аўтаматыка на паўзе: рэкрутэр працуе ўручную...");
          await new Promise(r => setTimeout(r, 5000)); // Чакаем 5 секунд і правяраем зноў
        }
      }
      if (i < startIndex) continue;
 if (global.stopSyncRequested) {
        console.log("🛑 [Sheets] Сінхранізацыя перарвана карыстальнікам.");
        return "STOP_ALL";
      }
      const cells = resolveMergedCells(i, rowData, merges);
      
      // 👈 ВЫПРАЎЛЕНА: дададзена праверка pixelSize для поўнага ігнаравання схаваных радкоў (v8.16)
      const meta = rowData[i].rowMetadata;
      if (
        meta?.hiddenByUser || 
        meta?.hiddenByFilter || 
        meta?.hiddenByParent || 
        meta?.pixelSize === 0
      ) continue;

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
let rawRowText = ""; // 👈 Аб'яўляем тут, каб яна была бачна ўсім (v8.19)
      // 2. Ствараем СЕМАНТЫЧНЫ ХЭШ (Агенцыя + Ліст + Якар)
      // Нармалізуем якар і назву ліста (ніжні рэгістр, выдаленне прабелаў), каб хэш быў стабільным
      // нават пры змене рэгістра назвы ўкладкі ў Google Sheets (v3.2)
      const normalizedAnchor = String(rowAnchor)
        .toLowerCase()
        .replace(/\s+/g, "")
        .trim();
      const normalizedSheetName = String(source.sheetName).toLowerCase().trim();

      const rowHash = crypto
        .createHash("md5")
        .update(
          `${source.agencyName}::${normalizedSheetName}::${normalizedAnchor}`,
        )
        .digest("hex");

      let existingVacancy = await Vacancy.findOne({ sourceHash: rowHash });

      // 👈 ДАДАДЗЕНА: Fallback-пошук, калі хэш змяніўся, але Google Doc супадае (v6.4)
      if (!existingVacancy && externalUrls.length > 0) {
        const foundByLink = await findVacancyByExternalDocLink(source.agencyName, externalUrls);
        if (foundByLink) {
          console.log(
            `🔗 [Sync] Знойдзена супадзенне па Google Doc для ${foundByLink.vacancyCode}. "Лечым" хэш.`,
          );
          foundByLink.sourceHash = rowHash; // Абнаўляем хэш на новы, каб наступны раз знайшлося адразу
          await foundByLink.save();
          existingVacancy = foundByLink;
        }
      }

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
          // 👈 Дадаем у гарачыя апдэйты
          hotUpdates.push({
            row: i + 1,
            title: rowTitle,
            code: existingVacancy.vacancyCode,
            type: "STOP/CLOSED",
          });
        }
        continue;
      }

      // 4. Калі вакансія ўжо ёсць і яна ACTIVE (або чакае якаснай апрацоўкі)
      if (existingVacancy && (existingVacancy.status === "active" || existingVacancy.status === "pending_ai")) {
        foundHashesInSheet.add(rowHash);

        // ПРАВЕРКА: Ці змяніўся поўны тэкст радка?
        // Пропуск (Resume) спрацуе ТОЛЬКІ калі тэкст супадае І статус ужо ACTIVE.
        // Калі статус pending_ai — мы НЕ прапускаем, а ідзем далей на апрацоўку.
        if (existingVacancy.originalText === rowBodyText && existingVacancy.status !== "pending_ai") {
          stats.ignored++;
          continue;
        }
        
        console.log(
          `🔄 [Row ${i + 1}] ${existingVacancy.status === "pending_ai" ? "Даапрацоўка чаргі" : "Абнаўленне"}: ${existingVacancy.vacancyCode}`
        );
       }

      // --- ЭТАП 1: ЗБОР ДАДЗЕНЫХ ---
      console.log(`Этап 1. [Row ${i + 1}] Апрацоўка: ${rowTitle}`);
      foundHashesInSheet.add(rowHash);



      // 👈 ВЫПРАЎЛЕНА: адноўлена логіка праверкі чаргі і закрыты дужкі (v8.18)
      if (existingVacancy && existingVacancy.rawText && existingVacancy.status === "pending_ai") {
        console.log(`📦 Этап 4.5. Выкарыстоўваем захаваны тэкст (Stage 0/1 пропуск)`);
        rawRowText = existingVacancy.rawText;
      } else {
        // --- ЭТАП 2-4: ЗАГРУЗКА DRIVE / TELEGRAPH ---
        let externalContent = "";
        for (const { url, header } of externalUrls) {
          if (!url.includes("google.com")) {
            const scraped = await scraperService.getExternalContent(url);
            if (scraped) externalContent += `\n\n--- ЗМЕСТ ПА СПАСЫЛЦЫ (${header}) ---\n${scraped}`;
          }
        } // 👈 ДАДАДЗЕНА ДУЖКА (закрывае цыкл спасылак)

        const rowBodyTextOnly = `[SOURCE: SPREADSHEET_ROW | AGENCY: ${source.agencyName}]\n${rowBodyText}`;
        
        // Выклікаем узбагачэнне (Этапы 2, 3, 4 унутры gemini.service)
        rawRowText = await enrichTextWithDocs(rowBodyTextOnly + externalContent);
      } // 👈 ГЭТА ЗАКРЫВАЕ ELSE 
        
        // 💾 ЗАХАВАННЕ ПРАГРЭСУ: Калі вакансія новая, ствараем яе як чарнавік
        if (!existingVacancy) {
          const vacanciesRoute = require("../routes/vacancies");
          const vacancyCode = await vacanciesRoute.generateVacancyCode();
          
          const draft = new Vacancy({
            vacancyCode,
            sourceHash: rowHash,
            agencyName: source.agencyName,
            sourceType: "spreadsheet",
            sheetName: source.sheetName,
            status: "pending_ai",
            rawText: rawRowText,
            originalText: rowBodyText
          });
          await draft.save();
          console.log(`💾 Этап 4.5. Тэкст захаваны ў базу (Draft ${vacancyCode} створаны)`);
          existingVacancy = draft;
        } else if (existingVacancy.originalText !== rowBodyText) {
          // Калі вакансія была, але тэкст у табліцы змяніўся — абнаўляем rawText і ставім pending_ai
          existingVacancy.rawText = rawRowText;
          existingVacancy.originalText = rowBodyText;
          existingVacancy.status = "pending_ai";
          await existingVacancy.save();
          console.log(`💾 Этап 4.5. Чарнавік ${existingVacancy.vacancyCode} абноўлены новым тэкстам.`);
        }
      
// 🔍 ДЫЯГНОСТЫКА: Глядзім, што сабрана з радка табліцы (v8.18)
      if (source.agencyName === "OTTO") {
  console.log(`📝 [OTTO Row ${i + 1}] Length: ${rawRowText.length}`);
}
      // --- ЭТАП 5-7: AI АПРАЦОЎКА ---
      const analysis = await analyzeAndCompareWithGemini(rawRowText, [], recentVacancies);

      if (!analysis) {
        // 👈 ЗМЕНЕНА: Не спыняем сінхранізацыю табліц (v5.6)
        console.warn(`⚠️ [Sheets] AI памылка для радка ${i + 1}. Вакансія ў pending_ai. Пропуск.`);
        stats.ignored++;
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
        const hasVacancySignal =
          /\d+[\s,.]?\d*\s*(zł|zlot|€|eur|pln|год|час|\/h)/i.test(rawRowText) ||
          /вакансі|посад|робот|праця|работ|завод|склад|виробництв/i.test(
            rawRowText,
          );

        // Замест стварэння паведамлення — дадаем у масіў
        if (rawRowText.length < 400 && hasVacancySignal) {
          hotUpdates.push({
            row: i + 1,
            title: rowTitle,
            code: existingVacancy?.vacancyCode,
            content: analysis.translatedFragments?.[0] || rawRowText,
            type: analysis.category === "RECRUITER_INFO" ? "INFO" : "UPDATE",
          });
        }

        stats.updated++;
        details.push(`🔄 ${vacCode}${rowTitle} (Row: ${i + 1})`);
        continue;
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
        // Правяраем, ці пазнаў AI гэтую вакансію (дублікат або абнаўленне),
        // пры гэтым у базе няма супадзення па хэшы (старая вакансія)
        const isRecognizedOld =
          (analysis.comparison?.verdict === "DUPLICATE" ||
            analysis.comparison?.verdict === "UPDATE") &&
          !existingVacancy;

        if (isRecognizedOld) {
          console.log(
            `⏭️ AI пазнаў старую вакансію (Verdict: ${analysis.comparison?.verdict}). Пропуск стварэння новага ID.`,
          );
          stats.ignored++;
          continue; // Пераходзім да наступнага радка
        }
       // 🚀 БАТЧ-ВЫКЛІК: Адпраўляем усе фрагменты адразу адным запытам
        const savedVac = await processVacancyMessage(
          analysis.translatedFragments, // 👈 Перадаем увесь масіў фрагментаў
          "Google Sheets",
          source.agencyName,
          rowBodyText,
          false,
          "FULL_VACANCY",
          rowHash,
          source.sheetName,
          existingVacancy ? existingVacancy._id : null,
          "spreadsheet"
        );

        if (savedVac && !savedVac.error) {
          if (existingVacancy) stats.updated++; else stats.added++;
          details.push(`✨ [${savedVac.vacancyCode}] ${rowTitle} (Row: ${i + 1})`);
        }
      }

      await new Promise((r) => setTimeout(r, 5000));
    }

    // --- АЎТА-ЗАКРЫЦЦЁ ВАКАНСІЙ, ЯКІХ НЯМА Ў ТАБЛІЦЫ ---
    if (foundHashesInSheet.size > 0) {
      // Знаходзім вакансіі, якія будуць закрыты, каб захаваць іх ID для справаздачы
      // 👈 ВЫПРАЎЛЕНА: закрываем вакансіі агенцыі па ўсіх лістах, калі іх няма ў бягучым скане (v8.16)
      const vacanciesToClose = await Vacancy.find({
        agencyName: source.agencyName,
        sourceType: "spreadsheet",
        status: "active",
        sourceHash: { $exists: true, $nin: Array.from(foundHashesInSheet) },
      }).select("_id vacancyCode vacancydescription position");

      const closeResult = await Vacancy.updateMany(
        {
          agencyName: source.agencyName,
          sourceType: "spreadsheet",
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
    // --- АДПРАЎКА ГАРАЧЫХ АПДЭЙТАЎ АДЗІНЫМ БЛОКАМ ---
    if (hotUpdates.length > 0) {
      let hotText = `🔥 **ГАРЫЧЫЯ АПДЭЙТЫ: ${source.agencyName} (${source.sheetName})**\n`;
      hotText += `-----------------------------------------\n`;

      hotUpdates.forEach((upd) => {
        const icon =
          upd.type === "STOP/CLOSED" ? "🛑" : upd.type === "INFO" ? "ℹ️" : "📝";
        const codePart = upd.code ? `[${upd.code}] ` : "";
        hotText += `${icon} **Радок ${upd.row}**: ${codePart}${upd.title}\n`;
        if (upd.content) {
          // Абмяжоўваем тэкст фрагмента для чытальнасці
          const shortContent =
            upd.content.length > 150
              ? upd.content.substring(0, 150) + "..."
              : upd.content;
          hotText += `└ _${shortContent.replace(/\n/g, " ")}_\n\n`;
        }
      });

      // Захоўваем адно агульнае паведамленне (абмяжоўваем 4000 сімвалаў)
      await new UnprocessedMessage({
        sender: "System",
        agencyName: source.agencyName,
        text: hotText.substring(0, 4000),
        category: "update",
        source: "google_sheets",
        processed: false,
        aiAnalyzed: true,
      }).save();

      console.log(
        `📦 Згрупавана ${hotUpdates.length} апдэйтаў у адно паведамленне Inbox.`,
      );
    }
    // Калі мы прайшлі ўсю табліцу да канца — скідаем індэкс для гэтай крыніцы
    await SyncState.findOneAndUpdate(
      { key: "circular_sync_position" },
      { lastIndex: 0 }
    );
    source.lastProcessedAt = new Date();
    await source.save();
    console.log(`🏁 Сінхранізацыя ${source.sheetName} завершана.`);
  } catch (err) {
    console.error(`❌ Sync Error (${source.sheetName}):`, err.message);
    await notifyDev(`❌ <b>Sheets Sync Error</b>\nAgency: ${source.agencyName}\nSheet: ${source.sheetName}\nError: ${err.message}`);
    await SyncHistory.create({
      agencyName: source.agencyName,
      sheetName: source.sheetName,
      status: "error",
      errorMessage: err.message,
    });

    // 👈 ДАДАДЗЕНА: калі памылка звязана з AI — спыняем усю сінхранізацыю
    // Было: catch заўжды вяртаў undefined, syncAllSheets працягваў цыкл нават пры AI Cooldown
    const isAiError =
      err.message?.includes("AI_COOLDOWN") ||
      err.message?.includes("ALL_AI_MODELS_FAILED");

    if (isAiError) {
      console.error("🛑 AI недаступны. Спыняем сінхранізацыю ўсіх табліц.");
      return "STOP_ALL";
    }
  }
}

async function syncAllSheets() {
  const SyncState = require("../models/SyncState");
  const syncState = await SyncState.findOne({ key: "circular_sync_position" });
  const processedIds = syncState?.processedInCircle?.map(id => id.toString()) || [];

  // Бяром толькі тыя табліцы, якіх НЯМА ў спісе апрацаваных у гэтым коле
  const sources = await SheetSource.find({ 
    status: "active", 
    _id: { $nin: processedIds } 
  });

  console.log(`🚀 Запуск сінхранізацыі для ${sources.length} табліц (прапушчана: ${processedIds.length})...`);

  for (const source of sources) {
    const result = await syncSheetVacancies(source._id);

    if (result === "STOP_ALL") {
      return "STOP_ALL";
    }

    // Калі табліца паспяхова пройдзена (lastIndex стаў 0), дадаем яе ў спіс апрацаваных
    await SyncState.findOneAndUpdate(
      { key: "circular_sync_position" },
      { $addToSet: { processedInCircle: source._id } }
    );

    await new Promise((r) => setTimeout(r, 5000));
  }
}

module.exports = { syncSheetVacancies, syncAllSheets };
