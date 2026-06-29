// frontend/src/constants/masterData.js

export const CATEGORIES = [
  { value: "Склади та логістика", label: "📦 Склади та логістика" },
  { value: "Харчова промисловість", label: "🍖 Харчова промисловість" },
  {
    value: "Автомобільна промисловість",
    label: "⚙️ Автомобільна промисловість",
  },
  {
    value: "Виробництво та промисловість",
    label: "🏭 Виробництво та промисловість",
  },
  { value: "Будівництво", label: "🏗️ Будівництво" },
  { value: "Сільське господарство", label: "🍏 Сільське господарство" },
  { value: "Торгівля та послуги", label: "🛍️ Торгівля та послуги" },
  { value: "Різне", label: "🛠️ Різне" },
];

export const STATUSES = [
  { value: "active", label: "🟢 Активна" },
  { value: "archived", label: "📂 Архів" },
  { value: "closed", label: "🔴 Закрита" },
];

export const GENDERS = [
  { value: "Чоловіки", label: "👨 Чоловіки" },
  { value: "Жінки", label: "👩 Жінки" },
  { value: "Пари", label: "👫 Пари" },
  { value: "Сім'ї", label: "👨‍👩‍👧 Сім'ї" },
];

export const LANGUAGES = [
  { value: "Не вимагається", label: "🚫 Не вимагається" },
  { value: "A1", label: "A1 (Мінімальна)" },
  { value: "A2", label: "A2 (Комунікативна)" },
  { value: "B1", label: "B1 (Середня)" },
  { value: "B2", label: "B2 (Добра)" },
  { value: "C1", label: "C1 (Професійна)" },
];

export const ACCOMMODATION_OPTIONS = [
  { value: "provided", label: "🏠 Надається" },
  { value: "couples", label: "👫 Для пар" },
  { value: "none", label: "❌ Без житла" },
];

export const TRANSPORT_OPTIONS = [
  { value: "provided", label: "🚌 Є довіз" },
  { value: "none", label: "❌ Немає довозу" },
];

// TRAVEL_GROUPS выдалены, бо дублюе GENDERS

export const NATIONALITIES = [
  { value: "Україна", label: "🇺🇦 Україна" },
  { value: "Молдова", label: "🇲🇩 Молдова" },
  { value: "Білорусь", label: "🇧🇾 Білорусь" },
  { value: "Грузія", label: "🇬🇪 Грузія" },
  { value: "Казахстан", label: "🇰🇿 Казахстан" },
  { value: "Азербайджан", label: "🇦🇿 Азербайджан" },
];

export const DOCS = [
  { value: "PESEL UKR", label: "PESEL UKR" },
  { value: "Віза", label: "Віза" },
  { value: "Карта побуту", label: "Карта побуту" },
  { value: "Книжка санепід", label: "Книжка санепід" },
  { value: "UDT", label: "UDT" },
  { value: "Довідка резидента", label: "Довідка резидента" },
  { value: "SEP", label: "SEP (Електрики)" },
  { value: "Права кат. B", label: "Права кат. B" },
];

export const CHECKLIST_ITEMS = [
  { value: "temperature", label: "🌡️ Температурний режим" },
  { value: "physical_load", label: "🏋️ Фізично-важка праця" },
  { value: "sanitary_limits", label: "🚫 Санітарні обмеження" },
  { value: "smells_allergens", label: "👃 Запахи та алергени" },
  { value: "noise", label: "📢 Шум" },
  { value: "work_character", label: "🚶 Характер праці (стоячи/сидячи)" }, // Удакладнена назва
  { value: "skills", label: "🛠️ Специфічні навички" },
  { value: "norms", label: "📈 Норми" },
  { value: "entry_tests", label: "📝 Тести при вступі" },
  { value: "other", label: "➕ Інше" },
];

export const AGENCIES = [
  "APOLO",
  "BISAR",
  "EST",
  // "EWL",
  "FOLGA",
  "FWS",
  "GLOBAL",
  "INTRASERVICE",
  // "KONO",
  "KREON",
  "MANPOWER",
  "MANUAL",
  "MRÓWKI",
  "NIDEN",
  "OTTO",
  "PERSONEL SERVICE",
  "PROGRES",
  "RALEN",
  "SG",
  "SOLANO",
  "STAFF POWER",
  "VEKOS",
  "WORK&HUMAN",
  "JOB IMPULSE",
  "PPG (BIEDRONKA)",
].sort();

export const VOIVODESHIPS = [
  "Польща",
  "Dolnośląskie",
  "Kujawsko-Pomorskie",
  "Lubelskie",
  "Lubuskie",
  "Łódzkie",
  "Małopolskie",
  "Mazowieckie",
  "Opolskie",
  "Podkarpackie",
  "Podlaskie",
  "Pomorskie",
  "Śląskie",
  "Świętokrzyskie",
  "Warmińsko-Mazurskie",
  "Wielkopolskie",
  "Zachodniopomorskie",
  "Інші країни Європи",
];
// 👈 ДАДАДЗЕНА: Тыпы дагавору (case-insensitive фільтрацыя на фронце)
export const CONTRACT_TYPES = [
  { value: "zlecenie", label: "📋 Umowa zlecenie" },
  { value: "oprace", label: "💼 Umowa o pracę" },
  { value: "null", label: "❓ Не вказано" },
];

// 👈 ДАДАДЗЕНА: Buckets гадзін у месяц
export const HOURS_RANGE_OPTIONS = [
  { value: "low", label: "⏱️ До 170 год/міс" },
  { value: "mid", label: "⏱️ 170–220 год/міс" },
  { value: "high", label: "⏱️ 220+ год/міс" },
  { value: "unknown", label: "❓ Не вказано" },
];
