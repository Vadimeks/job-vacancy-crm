// backend/utils/messageFilters.js

const CHAT_AGENCY_MAP = [
  // --- Telegram Whitelist (па ID — самы надзейны спосаб) ---
  { id: "-1002197502834", agency: "SG" }, // REKRUTER FREELANCER
  { id: "-1003470548853", agency: "STAFF POWER" }, // STAFF POWER БРИЖУК
  { id: "-1003038801216", agency: "SOLANO" }, // SOLANO БРИЖУК
  { id: "-1002597324535", agency: "INTRASERVICE" }, // ІНТРАСЕРВІС БРИЖУК
  { id: "-1003863670200", agency: "APOLO" }, // Посередники APOLO
  { id: "-5247965234", agency: "MANUAL" }, // Vacancies-app-test-group
  { id: "-1003720434755", agency: "SOLANO" }, // АКТУАЛЬНЫЕ ВАКАНСИИ

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
  /^реагує .* на/i,
  /^новий коментар до вашого повідомлення/i,
  /^ви маєте нові повідомлення/i,
  /^дивіться топ-повідомлення/i,
  /^пропущений виклик/i,
  /^вхідний виклик/i,
  /^відповідає:/i,
  /^приєднався до спільноти/i,
  /^приєдналась д[ао] спільноти/i,
  /^приєднується [доа] групи/i,
  /^приєднався до .+/i,
  /^приєдналась до .+/i,
  /^Користувач .* приєднався/i,
  /^joins the .* group/i,
  /^pinned a message/i,
  /^joined the group/i,
  /^left the group/i,
  /^фотоповідомлення/i,
  /^голосове повідомлення/i,
  /^файлове повідомлення/i,
  /^стікер/i,
  /^закріплює повідомлення/i,
  /^закріплює:?\s*$/i,
  /^menu\s*$/i,
  /^Отримання останніх повідомлень/i,
  /^Перевірте наявність нових повідомлень/i,
  /^Повернутися у Viber/i,
  /^З'єднання зі службою/i,
  /^Службу відключено/i,
];

const RECRUITER_CHAT_NOISE = [
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
  /поговорили\./i,
  /поговоримо з наступною/i,
  /чекаємо на \d/i,
  /\d+ нові? коментар/i,
  /2 нові коментарі/i,
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
  /^доброго дня[\s!.]*$/i,
  /^добрий день[\s!.]*$/i,
  /^доброго ранку[\s!.]*$/i,
  /^зрозуміло[\s!.]*$/i,
];

const NOISE_PATTERNS = [
  ...SYSTEM_NOISE,
  ...RECRUITER_CHAT_NOISE,
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

// Функцыя для праверкі старых дат у тэксце
function isOldMessage(text) {
  if (!text) return false;

  // Шукаем дату, якая стаіць асобна (напрыклад, "Дата: 20.04" або "на 20/04")
  // Дадаем праверку, каб перад лічбай не было кропкі ці іншай лічбы (каб не блытаць з 20.50)
  const dateMatch = text.match(/(?:\s|^)(\d{1,2})[./](\d{1,2})(?:\s|$)/);
  if (!dateMatch) return false;

  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10) - 1;

  // Калі месяц больш за 12 — гэта дакладна не дата, а нейкая лічба
  if (month > 11 || month < 0) return false;

  const year = new Date().getFullYear();
  const msgDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today - msgDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays > 3;
}

/**
 * Правярае, ці з'яўляецца тэкст абрэзаным.
 */
function isTruncated(text, source = "viber") {
  if (!text) return false;

  // 🆕 Юзербот заўсёды забірае 100% тэксту
  if (source === "telegram_userbot") return false;

  const t = text.trim();

  // 1. Яўная абрэзка
  if (t.endsWith("...") || t.endsWith("…")) return true;

  // 2. Доўгі тэкст амаль заўсёды поўны
  if (t.length > 800) return false;
  if (t.length < 50) return false;

  // 3. Бяспечныя заканчэнні (дадалі літары і лічбы для спасылак/тэл)
  const safeEndings =
    /[\p{Emoji}\p{Emoji_Presentation}.!?*)\]/|\\a-zA-Zа-яёіўА-ЯЁІЎ0-9]$/u;
  return !safeEndings.test(t);
}

/**
 * Стварае адбітак пачатку паведамлення (150 сімвалаў)
 */
function getPrefixHash(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-zа-яёіў0-9]/gi, "")
    .substring(0, 150);
}

/**
 * Разумны вайтліст: прыярытэт па ID, фолбэк на назву
 */
function getWhitelistedAgency(chatTitle, chatId = null) {
  if (!chatTitle && !chatId) return null;

  // 1. Прыярытэт: Пошук па ID
  if (chatId) {
    const incomingId = chatId.toString().trim();
    const matchById = CHAT_AGENCY_MAP.find(
      (entry) => entry.id && entry.id.toString().trim() === incomingId,
    );
    if (matchById) return matchById.agency;
  }

  // 2. Фолбэк: Пошук па назве
  const normalizedChat = superNormalize(chatTitle);

  const matchByTitle = CHAT_AGENCY_MAP.find((entry) => {
    if (!entry.key) return false;
    const normalizedKey = superNormalize(entry.key);

    // ВАЖНА: Пярэднім толькі ці змяшчае назва чата наш ключ.
    // Выдаляем зваротную праверку (normalizedKey.includes(normalizedChat)),
    // якая выклікала памылку з кароткімі назвамі як "То".
    return normalizedChat.includes(normalizedKey);
  });

  return matchByTitle ? matchByTitle.agency : null;
}

function shouldIgnoreMessage(text) {
  if (!text) return true;
  const trimmed = text.trim();
  if (trimmed.length < 15 || EMOJI_ONLY_RE.test(trimmed)) return true;

  // РАДОК З isOldMessage ВЫДАЛЕНЫ, каб паведамленні не знікалі

  return NOISE_PATTERNS.some((p) => p.test(trimmed));
}

module.exports = {
  shouldIgnoreMessage,
  getWhitelistedAgency,
  isTruncated,
  getPrefixHash,
};
