// backend/utils/messageFilters.js

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
  { key: "вакансіі ewl ( рекрутація)", agency: "EWL" },
  { key: "fws rekrutacja", agency: "FWS" },
  { key: "partner/intraservis", agency: "INTRASERVICE" },
  { key: "kono", agency: "KONO" },
  { key: "manpower freelance_2025", agency: "MANPOWER" },
  { key: "mrówki group partners", agency: "MRÓWKI" },
  { key: "вакансии для партнеров", agency: "NIDEN" },
  { key: "otto - робота в польщі", agency: "OTTO" },
  { key: "otto для партнерів", agency: "OTTO" },
  { key: "отто для партнерів", agency: "OTTO" },
  { key: "rekrutacja ps informacje", agency: "PERSONEL SERVICE" },
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
  /є актуальні дати/i,
  /актуальна вакансія/i,
  /чи є (ще|місця|вільні)/i,
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
  /@[a-z_]+/i,
  /^(ok|okay|noted|understood|got it|sure|yes|no)[\s,.!]*$/i,
  /^(wait|waiting|checked|confirmed|agreed|done)[\s,.!]*$/i,
  /not (written|added|in system|working)/i,
  /(cucumbers|tomatoes|peppers|strawberry|seedlings) (are|is) (stopped|finished|no more|available)/i,
  /waiting for (approval|confirmation|sms|answer|response)/i,
  /can be agreed/i,
  /suggest (tomatoes|cucumbers)/i,
  /he (is|was|has) (agree|returned|in Germany|in Poland)/i,
  /something else can be/i,
  /@[a-z_]+/i,
  /refused to work/i,
  /will arrive/i,
  /call you back/i,
  /age is not suitable/i,
  /team won't take/i,
  /let's do it/i,
];

const CANDIDATE_FORM_NOISE = [
  /\d+\.\s+[A-Z]+\s+[A-Z]+/i,
  /^[A-Z]{2,}\s+[A-Z]{2,}\s+[A-Z]{1,2}\d{5,}/m, // 👈 Выпраўлена (патрабуе лічбы пашпарта)
  /[A-Z]+\s+[A-Z]+\s+[A-Z0-9]{6,10}/,
  /\+\d{10,13}[\s\n]+[a-z0-9._%+-]+@[a-z0-9.-]+/i,
  /\+\d{10,13}\s+\+\d{10,13}/,
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

function getPrefixHash(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\d{1,2}[./]\d{1,2}/g, "") // Выдаляем даты (12.05, 12/05)
    .replace(/\d{1,2}:\d{2}/g, "") // Выдаляем час (16:44)
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

function shouldIgnoreMessage(text) {
  if (!text) return true;
  const trimmed = text.trim();
  if (trimmed.length < 15 || EMOJI_ONLY_RE.test(trimmed)) return true;
  return NOISE_PATTERNS.some((p) => p.test(trimmed));
}

const POST_AI_NOISE_UA = [
  // Пытанні пра актуальнасць і месцы
  /(чи\s+)?(актуально|є\s+місця|залишились|вільно|є\s+вакансії)/i,
  /яка\s+(назва|ставка|дата|локація)/i,
  /(де|куди|коли)\s+(таблиця|файл|координатор|приїзд|виїзд)/i,

  // Прапановы кандыдатаў (самы часты шум)
  /(маю|є|можу\s+подати)\s+(жінку|чоловіка|людину|пару|кандидата|хлопця|дівчину)/i,
  /люди\s+(хочуть|готові|їдуть)/i,
  /візьмете\s+(без\s+досвіду|пару|людей)/i,

  // Дзеянні з сістэмай/табліцай
  /(впишіть|запишіть|подайте|погодьте|забронюйте|внесіть)\s+(в\s+систему|в\s+таблицю|будь\s+ласка|їх|його|її)/i,
  /звʼяжіться\s+з\s+(ним|нею|ними)/i,
  /перевірте\s+(кандидата|документи)/i,

  // Статусы і чаканне
  /(чекаю|дайте)\s+(відповідь|підтвердження|інфо|адресу)/i,
  /(вже|зараз)\s+(в\s+системі|подали|зайнято|закрито|працює|звільнились)/i,
  /погоджено|затверджено|відмовлено/i,

  // Кароткія дыялогавыя фразы
  /підкажіть\s+(будь\s+ласка|як|що)/i,
  /доброго\s+(ранку|дня|вечора)/i,
  /дякую|зрозумів|добре|ок|окей/i,
  /пропоную\s+(цукіні|полуницю|клубніку|помідори)/i,
  /скільки\s+років/i,
];

function shouldIgnorePostAI(text) {
  if (!text) return false;
  // Калі тэкст вельмі кароткі пасля перакладу (менш за 40 сімвалаў) — хутчэй за ўсё гэта шум
  if (text.length < 40) return true;
  return POST_AI_NOISE_UA.some((p) => p.test(text));
}

module.exports = {
  shouldIgnoreMessage,
  getWhitelistedAgency,
  isTruncated,
  getPrefixHash,
  shouldIgnorePostAI,
};
