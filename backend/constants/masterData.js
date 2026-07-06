// backend/constants/masterData.js

const CATEGORIES = [
  { value: "Склади та логістика", label: "📦 Склади та логістика" },
  { value: "Харчова промисловість", label: "🍖 Харчова промисловість" },
  { value: "Автомобільна промисловість", label: "⚙️ Автомобільна промисловість" },
  { value: "Виробництво та промисловість", label: "🏭 Виробництво та промисловість" },
  { value: "Будівництво", label: "🏗️ Будівництво" },
  { value: "Сільське господарство", label: "🍏 Сільське господарство" },
  { value: "Торгівля та послуги", label: "🛍️ Торгівля та послуги" },
  { value: "Різне", label: "🛠️ Різне" },
];

const STATUSES = [
  { value: "active", label: "🟢 Активна" },
  { value: "archived", label: "📂 Архів" },
  { value: "closed", label: "🔴 Закрита" },
];

const GENDERS = [
  { value: "Чоловіки", label: "👨 Чоловіки" },
  { value: "Жінки", label: "👩 Жінки" },
  { value: "Пари", label: "👫 Пари" },
  { value: "Сім'ї", label: "👨‍👩‍👧 Сім'ї" },
];

const LANGUAGES = [
  { value: "Не вимагається", label: "🚫 Не вимагається" },
  { value: "A1", label: "A1 (Мінімальна)" },
  { value: "A2", label: "A2 (Комунікативна)" },
  { value: "B1", label: "B1 (Середня)" },
  { value: "B2", label: "B2 (Добра)" },
  { value: "C1", label: "C1 (Професійна)" },
];

const NATIONALITIES = [
  { value: "Україна", label: "🇺🇦 Україна" },
  { value: "Молдова", label: "🇲🇩 Молдова" },
  { value: "Білорусь", label: "⚪️🔴⚪️ Білорусь" },
  { value: "Грузія", label: "🇬🇪 Грузія" },
  { value: "Казахстан", label: "🇰🇿 Казахстан" },
  { value: "Азербайджан", label: "🇦🇿 Азербайджан" },
];

const DOCS = [
  { value: "PESEL UKR", label: "PESEL UKR" },
  { value: "Віза", label: "Віза" },
  { value: "Карта побуту", label: "Карта побуту" },
  { value: "Книжка санепід", label: "Книжка санепід" },
  { value: "UDT", label: "UDT" },
  { value: "Довідка резидента", label: "Довідка резидента" },
  { value: "SEP", label: "SEP (Електрики)" },
  { value: "Права кат. B", label: "Права кат. B" },
];

const CHECKLIST_ITEMS = [
  { value: "temperature", label: "🌡️ Температурний режим" },
  { value: "physical_load", label: "🏋️ Фізично-важка праця" },
  { value: "sanitary_limits", label: "🚫 Санітарні обмеження" },
  { value: "smells_allergens", label: "👃 Запахи та алергени" },
  { value: "noise", label: "📢 Шум" },
  { value: "work_character", label: "🚶 Характер праці (стоячи/сидячи)" },
  { value: "skills", label: "🛠️ Специфічні навички" },
  { value: "norms", label: "📈 Норми" },
  { value: "entry_tests", label: "📝 Тести при вступі" },
  { value: "other", label: "➕ Інше" },
];

const VOIVODESHIPS = [
  { value: "Польща", label: "Польща" },
  { value: "Dolnośląskie", label: "Dolnośląskie (Wrocław)" },
  { value: "Kujawsko-Pomorskie", label: "Kujawsko-Pomorskie (Bydgoszcz)" },
  { value: "Lubelskie", label: "Lubelskie (Lublin)" },
  { value: "Lubuskie", label: "Lubuskie (Zielona Góra)" },
  { value: "Łódzkie", label: "Łódzkie (Łódź)" },
  { value: "Małopolskie", label: "Małopolskie (Kraków)" },
  { value: "Mazowieckie", label: "Mazowieckie (Warszawa)" },
  { value: "Opolskie", label: "Opolskie (Opole)" },
  { value: "Podkarpackie", label: "Podkarpackie (Rzeszów)" },
  { value: "Podlaskie", label: "Podlaskie (Białystok)" },
  { value: "Pomorskie", label: "Pomorskie (Gdańsk)" },
  { value: "Śląskie", label: "Śląskie (Katowice)" },
  { value: "Świętokrzyskie", label: "Świętokrzyskie (Kielce)" },
  { value: "Warmińsko-Mazurskie", label: "Warmińsko-Mazurskie (Olsztyn)" },
  { value: "Wielkopolskie", label: "Wielkopolskie (Poznań)" },
  { value: "Zachodniopomorskie", label: "Zachodniopomorskie (Szczecin)" },
  { value: "Інші країни Європи", label: "Інші країни Європи" },
];

const HOURS_RANGE_OPTIONS = [
  { value: "low", label: "⏱️ До 170 год/міс" },
  { value: "mid", label: "⏱️ 170–220 год/міс" },
  { value: "high", label: "⏱️ 220+ год/міс" },
  { value: "unknown", label: "❓ Не вказано" },
];
const CANDIDATE_STATUSES = [
  { value: "new", label: "🆕 Новий" },
  { value: "active", label: "🟢 Активний" },
  { value: "waiting", label: "⏳ Очікує" },
  { value: "employed", label: "💼 Працює" },
  { value: "left", label: "🚪 Звільнився" },
  { value: "blacklist", label: "🚫 Чорний список" },
];

const CANDIDATE_SOURCES = [
  { value: "site", label: "🌐 Тікток / Сайт" },
  { value: "telegram_bot", label: "✈️ Telegram" },
  { value: "trello", label: "🔵 Trello" },
  { value: "manual", label: "✋ Ручний" },
  { value: "other", label: "➕ Інше" },
];
module.exports = {
  CATEGORIES,
  STATUSES,
  GENDERS,
  LANGUAGES,
  NATIONALITIES,
  DOCS,
  CHECKLIST_ITEMS,
  VOIVODESHIPS,
  HOURS_RANGE_OPTIONS,
  CANDIDATE_STATUSES, 
  CANDIDATE_SOURCES 
};