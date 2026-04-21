// backend/utils/messageFilters.js

const CHAT_AGENCY_MAP = [
  { key: "посередники apolo", agency: "APOLO" },
  { key: "ppg partner (SistemPL)", agency: "Global" },
  { key: "партнери jobsi", agency: "BISAR" },
  { key: "est-polska", agency: "EST" },
  { key: "вакансіі ewl (рекрутація)", agency: "EWL" },
  { key: "fws rekrutacja", agency: "FWS" },
  { key: "partner/intraservis", agency: "Intraservice" },
  { key: "kono", agency: "KONO" },
  { key: "manpower freelance_2025", agency: "MANPOWER" },
  { key: "mrówki group partners", agency: "MRÓWKI" },
  { key: "вакансии для партнеров", agency: "NIDEN" },
  { key: "otto - робота в Польщі", agency: "OTTO" }, // Жорсткі ключ
  { key: "otto для партнерів", agency: "OTTO" }, // Жорсткі ключ
  { key: "rekrutacja ps informacje", agency: "PERSONEL SERVICE" },
  { key: "grupa progres", agency: "PROGRES" },
  { key: "works4you вакансии в Польше", agency: "RALEN" },
  { key: "тест", agency: "MANUAL" },
];

const NOISE_PATTERNS = [
  /^новий коментар/i,
  /^ви маєте нові повідомлення/i,
  /^дивіться топ-повідомлення/i,
  /^пропущений виклик/i,
  /^вхідний виклик/i,
  /відповідає:/i, // Адсякаем адказы ў чатах
  /приєднався до спільноти/i,
  /pinned a message/i,
  /joined the group/i,
  /^фотоповідомлення$/i,
  /чия кандидатка/i,
  /хто подав цих людей/i,
  /^(?:поки\s+)?стоп\s*$/i,
  /^stop$/i,
];

function getWhitelistedAgency(chatTitle) {
  if (!chatTitle) return null;
  const title = chatTitle.toLowerCase();
  // Шукаем дакладнае супадзенне ключа ў назве чата
  const match = CHAT_AGENCY_MAP.find((entry) =>
    title.includes(entry.key.toLowerCase()),
  );
  return match ? match.agency : null;
}

function shouldIgnoreMessage(text) {
  if (!text || text.trim().length < 15) return true;
  return NOISE_PATTERNS.some((p) => p.test(text.trim()));
}

module.exports = { shouldIgnoreMessage, getWhitelistedAgency };
