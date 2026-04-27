// backend/utils/messageFilters.js

const CHAT_AGENCY_MAP = [
  // --- Telegram Whitelist ---
  { key: "актуальні вакансії на сьогодні", agency: "SG" },
  { key: "rekruter freelancer", agency: "SG" }, // ВЫПРАЎЛЕНА: k замест c
  { key: "staff power брижук", agency: "STAFF POWER" },
  { key: "актуальные вакансии", agency: "SOLANO" },
  { key: "vacancies-app-test-group", agency: "MANUAL" },

  // --- Viber Whitelist ---
  { key: "посередники apolo", agency: "APOLO" },
  { key: "ppg partner (sistempl)", agency: "GLOBAL" },
  { key: "партнери jobsi", agency: "BISAR" },
  { key: "est-polska", agency: "EST" },
  { key: "вакансіі ewl (рекрутація)", agency: "EWL" },
  { key: "fws rekrutacja", agency: "FWS" },
  { key: "partner/intraservis", agency: "INTRASERVICE" },
  { key: "kono", agency: "KONO" },
  { key: "manpower freelance_2025", agency: "MANPOWER" },
  { key: "mrówki group partners", agency: "MRÓWKI" },
  { key: "mrowki group partners", agency: "MRÓWKI" },
  { key: "вакансии для партнеров", agency: "NIDEN" },
  { key: "otto - робота в польщі", agency: "OTTO" },
  { key: "otto для партнерів", agency: "OTTO" },
  { key: "отто для партнерів", agency: "OTTO" },
  { key: "rekrutacja ps informacje", agency: "PERSONEL SERVICE" },
  { key: "grupa progres", agency: "PROGRES" },
  { key: "works4you вакансии в польше", agency: "RALEN" },
  { key: "test-group", agency: "MANUAL" },

  // --- Ignore List ---
  { key: "nova work agency", agency: "IGNORE_SELF" },
];

const SYSTEM_NOISE = [
  /^новий коментар до вашого повідомлення/i,
  /^ви маєте нові повідомлення в:/i,
  /^дивіться топ-повідомлення від/i,
  /^пропущений виклик/i,
  /^вхідний виклик/i,
  /відповідає:/i,
  /приєднався до спільноти/i,
  /приєдналась до спільноти/i,
  /pinned a message/i,
  /joined the group/i,
  /left the group/i,
  /^фотоповідомлення$/i,
  /^голосове повідомлення\s*\(.*\)$/i,
  /^файлове повідомлення$/i,
  /^стікер$/i,
  /^отримання останніх повідомлень/i, // Шум Viber
  /^повернутися у viber/i, // Шум Viber
  /^службу відключено/i, // Шум Viber
  /^завантаження мультимедійного контенту/i, // Шум Viber
  /^з'єднання зі службою/i, // Шум Viber
];

const RECRUITER_CHAT_NOISE = [
  /чия кандидатка\??/i,
  /хто подав цих людей\??/i,
  /могли б написати мені в личні/i,
  /напишіть мені в особист/i,
  /не можу знайти ваш номер/i,
  /скинула вам (більше|вже)/i,
  /можу подати (жінку|чоловіка|людину|кандидат)/i,
  /є (вільна\s+)?жінка на/i,
  /є (вільний\s+)?чоловік на/i,
];

const SOCIAL_NOISE = [
  /христос воскрес/i,
  /воістину воскрес/i,
  /з наступаючою пасхою/i,
  /з великоднем/i,
  /доброго дня п.?ятниці/i,
  /нехай сьогоднішній день буде/i,
  /вітаю (всіх|колег|партнерів)/i,
  /дякую (всім|за|вам)/i,
  /^дякую[\s!.]*$/i,
  /^дякуємо[\s!.]*$/i,
  /^доброго дня[\s!.]*$/i,
  /^добрий день[\s!.]*$/i,
  /^доброго ранку[\s!.]*$/i,
  /^зрозуміло[\s!.]*$/i, // Шум з логаў
];

const NOISE_PATTERNS = [
  ...SYSTEM_NOISE,
  ...RECRUITER_CHAT_NOISE,
  ...SOCIAL_NOISE,
];

const EMOJI_ONLY_RE = /^[\p{Emoji}\p{Emoji_Presentation}\s]+$/u;

function normalizeTitle(str) {
  if (!str) return "";
  return str
    .replace(/[\p{Emoji}\p{Emoji_Presentation}]/gu, "")
    .replace(/ó/g, "o")
    .replace(/ę/g, "e")
    .replace(/ą/g, "a")
    .replace(/ś/g, "s")
    .replace(/ł/g, "l")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z")
    .replace(/ć/g, "c")
    .replace(/ń/g, "n")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Пярэвірка на абрэзанасць (MacroDroid/Android limit)
 */
function isTruncated(text) {
  if (!text) return false;
  const trimmed = text.trim();
  // Калі тэкст доўгі і заканчваецца не на знак прыпынку або эмодзі
  // Звычайна апавяшчэнні абразаюцца на ~240 або ~500 сімвалах
  return trimmed.length > 200 && !/[.!?)]\s*$/.test(trimmed);
}

function getWhitelistedAgency(chatTitle) {
  if (!chatTitle) return null;
  const normalized = normalizeTitle(chatTitle);
  const match = CHAT_AGENCY_MAP.find((entry) =>
    normalized.includes(entry.key.toLowerCase()),
  );
  return match ? match.agency : null;
}

function shouldIgnoreMessage(text) {
  if (!text) return true;
  const trimmed = text.trim();
  // Захоўваем твой ліміт у 15 сімвалаў
  if (trimmed.length < 15 || EMOJI_ONLY_RE.test(trimmed)) return true;
  return NOISE_PATTERNS.some((p) => p.test(trimmed));
}

module.exports = { shouldIgnoreMessage, getWhitelistedAgency, isTruncated };
