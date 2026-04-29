// backend/utils/messageFilters.js

const CHAT_AGENCY_MAP = [
  // --- Telegram Whitelist ---
  { key: "Актуальні вакансії на сьогодні", agency: "SG" },
  { key: "Rekruter freelancer", agency: "SG" },
  { key: "Staff power брижук", agency: "STAFF POWER" },
  { key: "Актуальные вакансии", agency: "SOLANO" },
  { key: "Vacancies-app-test-group", agency: "MANUAL" },

  // --- Viber Whitelist ---
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

  // --- Ignore List ---
  { key: "nova work agency", agency: "IGNORE_SELF" },
];

const SYSTEM_NOISE = [
  /новий коментар до вашого повідомлення/i,
  /ви маєте нові повідомлення в:/i,
  /ви маєте нові повідомлення/i,
  /дивіться топ-повідомлення від/i,
  /пропущений виклик/i,
  /вхідний виклик/i,
  /відповідає:/i,
  /приєднався до спільноти/i,
  /приєдналась д[ао] спільноти/i,
  /приєднується да групи/i,
  /pinned a message/i,
  /joined the group/i,
  /left the group/i,
  /фотоповідомлення/i,
  /голосове повідомлення/i,
  /файлове повідомлення/i,
  /стікер/i,
  /закріплює повідомлення/i,
  /закріплює:?\s*$/i,
  /ніден:\s*закріплює/i,
  /menu\s*$/i,
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
  const dateMatch = text.match(/(\d{1,2})[./](\d{1,2})/);
  if (!dateMatch) return false;

  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10) - 1; // JS months 0-11
  const year = new Date().getFullYear();

  const msgDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today - msgDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays > 2; // Ігнаруем, калі старэйшае за 2 дні
}

function isTruncated(text) {
  if (!text) return false;
  const t = text.trim();

  if (t.endsWith("...") || t.endsWith("…")) return true;

  // 🔧 Парог зніжаны да 800 сімвалаў
  if (t.length > 800) return false;
  if (t.length < 80) return false;

  const safeEndings = /[.!?*)\p{Emoji}\p{Emoji_Presentation}]$/u;
  return !safeEndings.test(t);
}

function getWhitelistedAgency(chatTitle) {
  if (!chatTitle) return null;
  const normalizedChat = superNormalize(chatTitle);
  if (!normalizedChat) return null;

  const match = CHAT_AGENCY_MAP.find((entry) => {
    const normalizedKey = superNormalize(entry.key);
    return (
      normalizedChat.includes(normalizedKey) ||
      normalizedKey.includes(normalizedChat)
    );
  });

  return match ? match.agency : null;
}

function shouldIgnoreMessage(text) {
  if (!text) return true;
  const trimmed = text.trim();
  if (trimmed.length < 15 || EMOJI_ONLY_RE.test(trimmed)) return true;
  if (isOldMessage(trimmed)) return true; // Фільтр па даце
  return NOISE_PATTERNS.some((p) => p.test(trimmed));
}

module.exports = { shouldIgnoreMessage, getWhitelistedAgency, isTruncated };
