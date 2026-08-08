// backend/utils/messageFilters.js
const { NATIONALITIES } = require("../constants/masterData"); // 👈 ДАДАДЗЕНА для праверкі вайт-ліста
const CHAT_AGENCY_MAP = [
  // --- Telegram Whitelist ---
  { id: "-1002197502834", agency: "SG" },
  { id: "-1003470548853", agency: "STAFF POWER" },
  { id: "-1003038801216", agency: "SOLANO" },
  { id: "-1002597324535", agency: "INTRASERVICE" },
  { id: "-1003863670200", agency: "APOLO" },
  { id: "-5247965234", agency: "MANUAL" },
  { id: "-1003720434755", agency: "SOLANO" },
  { id: "-1002851211149", agency: "IGNORE_SELF" }, // Уласны канал
  // Viber Whitelist
  { key: "посередники apolo", agency: "APOLO" },
  { key: "Biedronka - PPG Partner (sistemPL)", agency: "GLOBAL" },
  { key: "партнери jobsi", agency: "BISAR" },
  { key: "est-polska", agency: "EST" },
  // { key: "вакансіі ewl ( рекрутація)", agency: "EWL" },
  { key: "fws rekrutacja", agency: "FWS" },
  { key: "partner/intraservis", agency: "INTRASERVICE" },
  { key: "kono", agency: "KONO" },
  { key: "manpower freelance_2025", agency: "MANPOWER" },
  { key: "mrówki group partners", agency: "MRÓWKI" },
  { key: "вакансии для партнеров", agency: "NIDEN" },
  { key: "otto - робота в польщі", agency: "OTTO" },
  { key: "otto для партнерів", agency: "OTTO" },
  { key: "отто для партнерів", agency: "OTTO" },
  // { key: "rekrutacja ps informacje", agency: "PERSONEL SERVICE" },
  { key: "grupa progres", agency: "PROGRES" },
  { key: "Works4you", agency: "RALEN" },
  { key: "test-group", agency: "MANUAL" },
  { key: "nova work agency", agency: "IGNORE_SELF" },
];

const SYSTEM_NOISE = [
  /\*\*processing\*\*/i,
  /clean polish translation/i,
  /реагує .* на/i,
  /новий коментар до вашого повідомлення/i,
  /ви маєте нові повідомлення/i,
  /дивіться топ-повідомлення/i,
  /пропущений виклик/i,
  /вхідний виклик/i,
  /відповідає:/i,
  /приєднався до спільноти/i,
  /приєдналась д[ао] спільноти/i,
  /приєднується [доа] групи/i,
  /приєднався до .+/i,
  /приєдналась да .+/i,
  /Користувач .* прыєднався/i,
  /joins the .* group/i,
  /pinned a message/i,
  /joined the group/i,
  /left the group/i,
  /фотоповідомлення/i,
  /голосове повідомлення/i,
  /файлове повідомлення/i,
  /стікер/i,
  /закріплює повідомлення/i,
  /закріплює:?\s*$/i,
  /menu\s*$/i,
  /Отримання останніх повідомлень/i,
  /Перевірте наявність нових повідомлень/i,
  /Повернутися у Viber/i,
  /З'єднання зі службою/i,
  /Службу відключено/i,
];

const RECRUITER_CHAT_NOISE = [
  /чи зможете їх взяти/i,
  /чи все ж погодять/i,
  /підкажіть чи/i,
  /також внесіть/i,
  /внесіть в систему/i,
  /прошу подавати правдивий/i,
  /чия кандидатка\??/i,
  /хто подав цих людей\??/i,
  /напишіть мені в особист/i,
  /не можу знайти ваш номер/i,
  /скинула вам (більше|вже)/i,
  /можу подати (жінку|чоловіка|людину|кандидат)/i,
  /є (вільна\s+)?жінка на/i,
  /є (вільний\s+)?чоловік на/i,
  /пока нет набора/i,
  /набора нет/i,
  /підтвердили (всі|приїзди)/i,
  /поговорилі\./i,
  /поговоримо з наступною/i,
  /чекаємо на \d/i,
  /\d+ нові? коментар/i,
  /2 нові коментарі/i,
  /погодьте (їх|його|її)/i,
  /звʼяжіться з (ним|нею|ними)/i,
  /можемо погодити (на|їх)/i,
  /внесіть (в резерв|будь ласка)/i,
  /чи готові на/i,
  /поїде на довгий термін/i,
  /приїзд можливий (і сьогодні|завтра)/i,
  /доброго (ранку|дня|вечора)/i,
  /добрий (ранок|день|вечір)/i,
  /дякую за відповідь/i,
  /цю (беремо|візьмемо|беруть)/i,
  /тільки (цю|цього|їх|його|її) (додати|внести)/i,
  /а щось інше може бути/i,
  /все питаю без неї/i,
  /як впишете/i,
  /нагадайте щоб/i,
  /буде кімната/i,
  /чекаю відповідь/i,
  /якщо місяць чекатиме/i,
  /і ще хтось один/i,
  /відмітьте, за кого/i,
  /ось пара дуже/i,
  /залежить хто перший/i,
  /в одну дату а інші/i,
  /спочатку з ними/i,
  /мої перші були/i,
  /повідомьте будь ласка/i,
  // --- НОВЫЯ МАРКЕРЫ (Крок 1) ---
  /маю жінку на/i,
  /маю чоловіка на/i,
  /звичайний песель/i,
  /сильна перевірка/i,
  /по цій уточню/i,
  /наразі працює у/i,
  /на анімексі/i,
  /дзвоню, виясняю/i,
  /поки немає місця/i,
  /дякую, забрали/i,
  /дуже хочуть працювати/i,
  /хочуть працювати/i,
  /передзвоню через/i,
  /дзвоню, виясняю/i,
  /вже завтра зв‘яжетесь/i,
  /наберу (завтра|зранку|її)/i,
  /зателефоную/i,
  /дякую всім/i,
  /всім зранку/i,
  /чи візьмуть на/i,
  /усіх на/i,
  /подавайте,? контактую/i,
  /на вірту подавати/i,
  /ось пара дуже/i,
  /чи є ще на .{1,20}$/i,
];

const RECRUITER_CHAT_NOISE_EN = [
  /not written/i,
  /sent waiting for approval/i,
  /waiting for (a response|approval|your sms|answer)/i,
  /can be agreed on/i,
  /suggest (tomatoes|cucumbers)/i,
  /(cucumbers|tomatoes) are stopped/i,
  /something else can be/i,
  /man is ready to relocate/i,
  /please remind her to send/i,
  /can (we|you|i) (agree|submit|take|offer|send|confirm|check)/i,
  /please (reserve|submit|confirm|check|orient|keep|let|tell|send|add)/i,
  /is there (anything|something|a place|still|only|any)/i,
  /do you (have|take|accept)/i,
  /at the moment/i,
  /unfortunately/i,
  /good (day|morning|afternoon|evening)/i,
  /i am in contact/i,
  /(^|\s)@[a-z0-9_]+(?!\.[a-z]{2,})/i, // 👈 ВЫПРАЎЛЕНА: патрабуе пачатак слова перад @, каб не лавіць email (напр. Ryclanlih@gmail.com)
  /^(ok|okay|noted|understood|got it|sure|yes|no)[\s,.!]*$/i,
  /^(wait|waiting|checked|confirmed|agreed|done)[\s,.!]*$/i,
  /not (written|added|in system|working)/i,
  /(cucumbers|tomatoes|peppers|strawberry|seedlings) (are|is) (stopped|finished|no more|available)/i,
  /waiting for (approval|confirmation|sms|answer|response)/i,
  /can be agreed/i,
  /suggest (tomatoes|cucumbers)/i,
  /he (is|was|has) (agree|returned|in Germany|in Poland)/i,
  /something else can be/i,
 
  /refused to work/i,
  /will arrive/i,
  /call you back/i,
  /age is not suitable/i,
  /team won't take/i,
  /let's do it/i,
];

const CANDIDATE_FORM_NOISE = [
  /\d+\.\s+[A-Z]+\s+[A-Z]+/i,
  /^[A-Z]{2,}\s+[A-Z]{2,}\s+[A-Z]{1,2}\d{5,}/m,
  /[A-Z]+\s+[A-Z]+\s+[A-Z0-9]{6,10}/,
  /\+\d{10,13}[\s\n]+[a-z0-9._%+-]+@[a-z0-9.-]+/i,
  /\+\d{10,13}\s+\+\d{10,13}/,
  /^[A-ZА-ЯЁІЎ\s]+:\s*[A-ZА-ЯЁІЎ\s]+:\s*[A-ZА-ЯЁІЎ\s]+/m, // 🆕 Форма "Імя: Горад: Праект"
];

const SOCIAL_NOISE = [
  /христос воскрес/i,
  /воістину воскрес/i,
  /з наступаючою пасхою/i,
  /з великоднем/i,
  /доброго дня п.?ятниці/i,
  /вітаю (всіх|колег|партнерів)/i,
  /дякую (всім|за|вам)/i,
  /^дякую[\s!.]*$/i,
  /^дякуємо[\s!.]*$/i,
  /^зрозуміло[\s!.]*$/i,
  /^доброго дня[\s!.]*$/i,
  /^добрий день[\s!.]*$/i,
  /^доброго ранку[\s!.]*$/i,
];

const NOISE_PATTERNS = [
  ...SYSTEM_NOISE,
  ...RECRUITER_CHAT_NOISE,
  ...RECRUITER_CHAT_NOISE_EN,
  ...CANDIDATE_FORM_NOISE,
  ...SOCIAL_NOISE,
];

const EMOJI_ONLY_RE = /^[\p{Emoji}\p{Emoji_Presentation}\s]+$/u;

function superNormalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[ó]/g, "o")
    .replace(/[ę]/g, "e")
    .replace(/[ą]/g, "a")
    .replace(/[ś]/g, "s")
    .replace(/[ł]/g, "l")
    .replace(/[źż]/g, "z")
    .replace(/[ć]/g, "c")
    .replace(/[ń]/g, "n")
    .replace(/[^a-zа-яёіў0-9]/gi, "");
}

function isOldMessage(text) {
  if (!text) return false;
  const dateMatch = text.match(/(?:\s|^)(\d{1,2})[./](\d{1,2})(?:\s|$)/);
  if (!dateMatch) return false;
  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10) - 1;
  if (month > 11 || month < 0) return false;
  const year = new Date().getFullYear();
  const msgDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = today - msgDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays > 3;
}

function isTruncated(text, source = "viber") {
  if (!text) return false;
  if (source === "telegram_userbot") return false;
  const t = text.trim();
  if (t.endsWith("...") || t.endsWith("…")) return true;
  if (t.length > 800) return false;
  if (t.length < 50) return false;
  const safeEndings =
    /[\p{Emoji}\p{Emoji_Presentation}.!?*)\]/|\\a-zA-Zа-яёіўА-ЯЁІЎ0-9]$/u;
  return !safeEndings.test(t);
}
// Палепшаны хэш: выдаляе даты, час І ЭМОДЗІ
function getPrefixHash(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/menu\s*$/i, "") // 🆕 Выдаляем "Menu" у канцы (спам ад Viber)
    .replace(/\d{1,2}[./]\d{1,2}/g, "") // Выдаляем даты
    .replace(/\d{1,2}:\d{2}/g, "") // Выдаляем час
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      "",
    ) // Выдаляем эмодзі
    .replace(/\s+/g, "")
    .replace(/[^a-zа-яёіў0-9]/gi, "")
    .substring(0, 250);
}

function getWhitelistedAgency(chatTitle, chatId = null) {
  if (!chatTitle && !chatId) return null;
  if (chatId) {
    const incomingId = chatId.toString().trim();
    const matchById = CHAT_AGENCY_MAP.find(
      (entry) => entry.id && entry.id.toString().trim() === incomingId,
    );
    if (matchById) return matchById.agency;
  }
  const normalizedChat = superNormalize(chatTitle);
  const matchByTitle = CHAT_AGENCY_MAP.find((entry) => {
    if (!entry.key) return false;
    const normalizedKey = superNormalize(entry.key);
    return normalizedChat.includes(normalizedKey);
  });
  return matchByTitle ? matchByTitle.agency : null;
}

/**
 * Палепшаная функцыя фільтрацыі шуму.
 * Вяртае аб'ект з вердыктам і прычынай для дэталёвага лагіравання.
 */
function shouldIgnoreMessage(text) {
  if (!text) return { ignore: true, reason: "EMPTY_TEXT" };
  const trimmed = text.trim();

  if (trimmed.length < 15) return { ignore: true, reason: "TOO_SHORT" };
  if (EMOJI_ONLY_RE.test(trimmed)) return { ignore: true, reason: "EMOJI_ONLY" };

  const noiseCategories = [
    { name: "SYSTEM_NOISE", patterns: SYSTEM_NOISE },
    { name: "RECRUITER_CHAT_NOISE", patterns: RECRUITER_CHAT_NOISE },
    { name: "RECRUITER_CHAT_NOISE_EN", patterns: RECRUITER_CHAT_NOISE_EN },
    { name: "CANDIDATE_FORM_NOISE", patterns: CANDIDATE_FORM_NOISE },
    { name: "SOCIAL_NOISE", patterns: SOCIAL_NOISE }
  ];

  for (const category of noiseCategories) {
    const matchedPattern = category.patterns.find(p => p.test(trimmed));
    if (matchedPattern) {
      return { ignore: true, reason: `${category.name} (${matchedPattern.toString()})` };
    }
  }
  return { ignore: false, reason: null };
}
// Новая функцыя для дэтэкцыі маркетынгавых анонсаў з бонусамі
function isMarketingBonus(text) {
  if (!text || text.length > 400) return false;
  // Шукаем пачатак з бонуса (напр. **500 зл за кандидата**)
  return /^\**\d+\s*зл\s*за\s*кандидата/i.test(text.trim());
}

const POST_AI_NOISE_UA = [
  /зарплата прийшла/i,
  /коли виплата/i,
  /є місця на/i,
  /хтось серйозний/i,
  /питають і зникають/i,
  /хто перший/i,
  /чекає на карту/i,
  /децизію/i,
  /минутку.*уточню/i,
  /освядчення треба замовити/i,
  // --- ДАДАДЗЕНА ПА ПЛАНЕ v2.1 ---
  /маю жінку на/i,
  /маю чоловіка на/i,
  /дякую, забрали/i,
  /хочуть працювати/i,
  /звичайний песель/i,
  /сильна перевірка/i,
  // ------------------------------
  /(чи\s+)?(актуально|є\s+місця|залишились|вільно|є\s+вакансії)/i,
  /яка\s+(назва|ставка|дата|локація)/i,
  /(де|куди|коли)\s+(таблиця|файл|координатор|приїзд|виїзд)/i,
  /(маю|є|можу\s+подати)\s+(жінку|чоловіка|людину|пару|кандидата|хлопця|дівчину)/i,
  /люди\s+(хочуть|готові|їдуть)/i,
  /візьмете\s+(без\s+досвіду|пару|людей)/i,
  /(впишіть|запишіть|подайте|погодьте|забронюйте|внесіть)\s+(в\s+систему|в\s+таблицю|будь\s+ласка|їх|його|її)/i,
  /звʼяжіться\s+з\s+(ним|нею|ними)/i,
  /перевірте\s+(кандидата|документи)/i,
  /(чекаю|дайте)\s+(відповідь|підтвердження|інфо|адресу)/i,
  /(вже|зараз)\s+(в\s+системі|подали|зайнято|закрито|працює|звільнились)/i,
  /погоджено|затверджено|відмовлено/i,
  /підкажіть\s+(будь\s+ласка|як|що)/i,
  /доброго\s+(ранку|дня|вечора)/i,
  /дякую|зрозумів|добре|ок|окей/i,
  /пропоную\s+(цукіні|полуницю|клубніку|помідори)/i,
  /скільки\s+років/i,
  /курси\s+польської|карта\s+побиту\s+допомога|шукаю\s+житло|перевізник|попутка/i,
  /виплати\s+були|коли\s+зарплата|не\s+прийшли\s+гроші|зарплата\s+прийшла/i,
  /хто\s+працював\s+на|відгуки\s+про|порадьте/i,
  /є віза/i,
  /готова їхати/i,
  /що можемо запропонувати/i,
  /візу зробили/i,
  /зазволення прийшло/i,
  /компенсація за білет/i,
  /будемо знати/i,
  /майбутнім на Голландію/i,
  /пришліть паспорт/i,
  /немає проблем/i,
  /чи є штрафи/i,
  /хв(илин)?\s+пішки/i,
  /мин\s+пішки/i,
  /є фото житла/i,
  /в контакті з/i,
];

function shouldIgnorePostAI(text) {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < 40) return true;
  const linkCount = (trimmed.match(/https?:\/\/[^\s]+/g) || []).length;
  if (linkCount > 2) return true;
  // Захоўваем арыгінальную праверку па масіве
  return POST_AI_NOISE_UA.some((p) => p.test(trimmed));
}
// Шукае, які менавіта Regex спрацаваў (для дэбагу логаў)
function getMatchingIgnoreRegex(text) {
  if (!text) return null;
  const cleaned = text.trim();
  for (const regex of GLOBAL_NOISE) {
    if (regex.test(cleaned)) return `GLOBAL_NOISE: ${regex.toString()}`;
  }
  for (const regex of RECRUITER_CHAT_NOISE) {
    if (regex.test(cleaned)) return `RECRUITER_CHAT_NOISE: ${regex.toString()}`;
  }
  return null;
}
/**
 * Гейткіпер вакансій: вырашае лёс запісу ДА выкліку AI.
 * Вердыкты: 
 * - "PROCESS": усё добра, ідзем у AI.
 * - "CLOSE": знойдзены STOP-маркер, трэба закрыць вакансію.
 * - "IGNORE": смецце, кароткі тэкст ці чужая нацыянальнасць.
 */
function checkVacancyGatekeeper(text, columnName = "") {
  if (!text) return "IGNORE";

  const cleanText = text
    .replace(/\[Airtable ID: [^\]]+\]/g, "")
    .replace(/Назва колонки: [^\n]+/g, "")
    .replace(/Название колонки: [^\n]+/g, "")
    .trim();

  const lowerText = cleanText.toLowerCase();
  const lowerColumn = (columnName || "").toLowerCase();

  // 2. STOP-Check
  const stopZone = lowerText.substring(0, 200);
  if (/\b(stop|стоп|архів|архив|неактив|не актив)\b/i.test(stopZone)) {
    console.log(`🔴 [Gatekeeper Close] Знойдзены STOP-маркер у пачатку тэксту.`);
    return "CLOSE";
  }

  if (/актуальн(ість|ость)[^:\n]{0,25}:\s*(ні|нет|no)(?=[\s,.\n]|$)/i.test(lowerText)) {
    console.log(`🔴 [Gatekeeper Close] Маркер Актуальнасць: НІ.`);
    return "CLOSE";
  }

  // 3. Nationality-Check
  const exclusiveMarkers = [
    "філіппінці", "філіпінці", "індія", "индия", "англомовні", 
    "англоязычные", "philippines", "india", "english", "columbia", "колумбія",
    "узбекистан", "таджикистан", "киргизстан", "непал", "азия", "азія", "azja"
  ];
  
  const hasExclusiveMarker = exclusiveMarkers.some(m => lowerText.includes(m) || lowerColumn.includes(m));
  
 if (hasExclusiveMarker) {
  const whiteList = NATIONALITIES.map(n => n.value.toLowerCase());
  const hasWhiteListCountry = whiteList.some(n => lowerText.includes(n));
  
  if (!hasWhiteListCountry) {
    // 👈 Дадаем лагаванне, каб бачыць чаму радок адхілены
    if (global.logger) {
      global.logger(`⛔ [Gatekeeper] Нацыянальны блок: маркер "${exclusiveMarkers.find(m => lowerText.includes(m))}" знойдзены, але дазволеных краін няма. Фрагмент: "${lowerText.substring(0, 250)}"`);
    }
    return "IGNORE";
  }
}


  // 4. Length-Check
  if (cleanText.length < 200) {
    console.log(`⏭️ [Gatekeeper Ignore] Занадта кароткі тэкст (${cleanText.length} сімв.).`);
    return "IGNORE";
  }

  // 5. Шаблон-Check
  const forbiddenTemplates = [
    "анкета - подачи", "анкета подачі", "документы легального", "документи легального",
    "warunki współpracy", "особенности трудоустройства", "частые вопросы", 
    "примери обьявлений", "приклади оголошень",
    "як створити cv", "документи для uz", "оплата фоп", "про manpower", 
    "контакт з нами", "умови співпраці", "wniosek o udzielenie", 
    "oświadczenie o przekroczeniu", 
  ];
  
  const isForbidden = forbiddenTemplates.some(t => {
    const index = lowerText.indexOf(t);
    return index >= 0 && index < 80;
  });

  if (isForbidden) {
    console.log(`⏭️ [Gatekeeper Ignore] Выяўлены шаблон інфа-карткі ў загалоўку.`);
    return "IGNORE";
  }
    
  return "PROCESS";
}
module.exports = {
  shouldIgnoreMessage,
  getMatchingIgnoreRegex,
  getWhitelistedAgency,
  isTruncated,
  getPrefixHash,
  shouldIgnorePostAI,
  isMarketingBonus,
  checkVacancyGatekeeper,
};
