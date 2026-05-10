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

export const TRAVEL_GROUPS = [
  { value: "alone", label: "👤 Один / Одна" },
  { value: "couple", label: "👫 Пари" },
  { value: "family", label: "👨‍👩‍👧 Сім'я" },
];

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
  { value: "Книжка санепід", label: "Санепід" },
  { value: "UDT", label: "UDT" },
  { value: "Довідка резидента", label: "Довідка резидента" },
  { value: "SEP", label: "SEP (Електрики)" },
  { value: "Права кат. B", label: "Права кат. B" },
];

export const CHECKLIST_ITEMS = [
  { value: "no_jewelry", label: "🚫 Без прикрас/нігтів" },
  { value: "manual_tests", label: "🖐️ Мануальні тести" },
  { value: "math_tests", label: "🔢 Тести з математики" },
  { value: "physical_load", label: "🏋️ Фізичне навантаження" },
  { value: "cold_temp", label: "❄️ Холод (-22..+10°C)" },
  { value: "hot_temp", label: "🔥 Спека (+30°C)" },
  { value: "standing_work", label: "🚶 Робота стоячи" },
  { value: "smell_fish", label: "🐟 Запах риби" },
  { value: "smell_rubber", label: "🚗 Запах гуми" },
];

// Еталонний список агенцій (синхронізовано з бекендом)
export const AGENCIES = [
  "APOLO",
  "BISAR",
  "EST",
  "EWL",
  "FWS",
  "GLOBAL",
  "INTRASERVICE",
  "KONO",
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
];

export const VOIVODESHIPS = [
  "Dolnośląskie",
  "Kujawsko-pomorskie",
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
  "Warmińsko-mazurskie",
  "Wielkopolskie",
  "Zachodniopomorskie",
  "Європа (інші країни)",
];
