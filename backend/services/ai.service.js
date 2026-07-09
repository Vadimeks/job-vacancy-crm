const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const { GoogleAuth } = require("google-auth-library");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
// Бяром толькі з env, без хардкоду
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const LOCATION = process.env.LOCATION;

// 👈 ЗМЕНА: падтрымка Render Secret Files (/etc/secrets/) і лакальнага шляху
const GOOGLE_CREDS_PATH = require("fs").existsSync("/etc/secrets/google-creds.json")
  ? "/etc/secrets/google-creds.json"
  : path.join(process.cwd(), "google-creds.json");
// 👈 ДЫЯГНОСТЫКА: лагіруем які шлях выкарыстоўваецца
console.log(`🔑 [Auth] GOOGLE_CREDS_PATH: ${GOOGLE_CREDS_PATH}`);
console.log(`🔑 [Auth] Файл існуе: ${require("fs").existsSync(GOOGLE_CREDS_PATH)}`);
console.log(`🔑 [Auth] PROJECT_ID: ${GOOGLE_PROJECT_ID}, LOCATION: ${LOCATION}`);
const auth = new GoogleAuth({
  keyFile: GOOGLE_CREDS_PATH,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

async function getAccessToken() {
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token;
  } catch (err) {
    console.error("❌ Памылка атрымання токена:", err.message);
    return null;
  }
}

const AI_CHAIN = [
  { provider: "gemini_studio", name: "gemini-2.5-flash" },
  { provider: "groq", name: "llama-3.3-70b-versatile" },
  { provider: "vertex", name: "gemini-2.5-flash" },
  // 👈 ЗМЕНА: Vertex AI часова выключаны (білінг)
  // { provider: "vertex", name: "gemini-2.5-flash" },
  // { provider: "vertex", name: "gemini-2.5-flash-lite" },
  // { provider: "vertex", name: "gemini-3.1-flash-lite" },
  // { provider: "gemini_studio", name: "gemini-2.5-flash" },
  // { provider: "gemini_studio", name: "gemini-2.5-flash-lite" },
  // { provider: "groq", name: "llama-3.3-70b-versatile" },
  // { provider: "groq", name: "llama-3.1-8b-instant", maxChars: 16000 },
];

let chainFrozenUntil = 0; // Паўза 1 гадзіна пры адмове ўсіх мадэляў
const PROVIDER_FREEZE = { groq: 0, gemini_studio: 0, vertex: 0 }; // 👈 ДАДАДЗЕНА: замарозка асобных правайдэраў

const POLISH_VOIVODESHIPS = [
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
];
// ===== ЭТАЛОННЫЯ СПІСЫ ДЛЯ УНІФІКАЦЫІ =====
const KNOWN_AGENCIES = [
  //sheets
  "APOLO",
  "BISAR",
 "PPG (BIEDRONKA)",
  "INTRASERVICE",
"OTTO",
"MRÓWKI",
"WORK&HUMAN",
"RALEN",
//trello
"KREON",
  "NIDEN",
  "PERSONEL SERVICE",
  //airtable
  "JOB IMPULSE",
  "PROGRES",
"MANPOWER",
//chats/viver/tg
  "EST",
  "FWS",
  "KONO",
  "SG",
  "STAFF POWER",
  //website
  "SOLANO",
  //without agency
  "MANUAL",
  //temporary disabled
  // "VEKOS",
  // "EWL",
  // "FOLGA",
];

const BRAND_BLACKLIST = [
  "ферма",
  "склад",
  "цех",
  "фабрика",
  "завод",
  "підприємство",
  "предприятие",
  "company",
  "factory",
  "warehouse",
  "farm",
  "greenhouse",
  "теплиця",
  "птахофабрика",
  "птицефабрика",
  "комбінат",
  "комбинат",
  "магазин",
  "store",
];
const COUNTRY_MAP = {
  німеччина: "Germany",
  германия: "Germany",
  deutschland: "Germany",
  germany: "Germany",
  нідерланди: "Netherlands",
  нидерланды: "Netherlands",
  nederland: "Netherlands",
  netherlands: "Netherlands",
  польща: "Polska",
  польша: "Polska",
  poland: "Polska",
  polska: "Polska",
  франція: "France",
  франция: "France",
  france: "France",
  бельгія: "Belgium",
  бельгия: "Belgium",
  belgium: "Belgium",
  чехія: "Czech Republic",
  чехия: "Czech Republic",
  czechia: "Czech Republic",
};
const VOIVODESHIP_MAP = {
  // Dolnośląskie
  нижньосілезьке: "Dolnośląskie",
  "нижньосілезьке воєводство": "Dolnośląskie",
  нижнесилезское: "Dolnośląskie",
  "нижнесилезское воеводство": "Dolnośląskie",
  dolnośląskie: "Dolnośląskie",

  // Kujawsko-Pomorskie
  "куявсько-поморське": "Kujawsko-Pomorskie",
  "куявсько-поморське воєводство": "Kujawsko-Pomorskie",
  "куявско-поморское": "Kujawsko-Pomorskie",
  "куявско-поморское воеводство": "Kujawsko-Pomorskie",
  "kujawsko-pomorskie": "Kujawsko-Pomorskie",

  // Lubelskie
  люблінське: "Lubelskie",
  "люблінське воєводство": "Lubelskie",
  люблинское: "Lubelskie",
  "люблинское воеводство": "Lubelskie",
  lubelskie: "Lubelskie",

  // Lubuskie
  любуське: "Lubuskie",
  "любуське воєводство": "Lubuskie",
  любушское: "Lubuskie",
  "любушское воеводство": "Lubuskie",
  lubuskie: "Lubuskie",

  // Łódzkie
  лодзинське: "Łódzkie",
  "лодзинське воєводство": "Łódzkie",
  лодзинское: "Łódzkie",
  "лодзинское воеводство": "Łódzkie",
  łódzkie: "Łódzkie",

  // Małopolskie
  малопольське: "Małopolskie",
  "малопольське воєводство": "Małopolskie",
  малопольское: "Małopolskie",
  "малопольское воеводство": "Małopolskie",
  małopolskie: "Małopolskie",

  // Mazowieckie
  мазовецьке: "Mazowieckie",
  "мазовецьке воєводство": "Mazowieckie",
  мазовецкое: "Mazowieckie",
  "мазовецкое воеводство": "Mazowieckie",
  mazowieckie: "Mazowieckie",

  // Opolskie
  опольське: "Opolskie",
  "опольське воєводство": "Opolskie",
  опольское: "Opolskie",
  "опольское воеводство": "Opolskie",
  opolskie: "Opolskie",

  // Podkarpackie
  підкарпатське: "Podkarpackie",
  "підкарпатське воєводство": "Podkarpackie",
  подкарпатское: "Podkarpackie",
  "подкарпатское воеводство": "Podkarpackie",
  podkarpackie: "Podkarpackie",

  // Podlaskie
  підляське: "Podlaskie",
  "підляське воєводство": "Podlaskie",
  пiдляське: "Podlaskie", // лацінская i
  "пiдляське воєводство": "Podlaskie", // лацінская i
  подляское: "Podlaskie",
  "подляское воеводство": "Podlaskie",
  podlaskie: "Podlaskie",

  // Pomorskie
  поморське: "Pomorskie",
  "поморське воєводство": "Pomorskie",
  поморское: "Pomorskie",
  "поморское воеводство": "Pomorskie",
  pomorskie: "Pomorskie",

  // Śląskie
  сілезьке: "Śląskie",
  "сілезьке воєводство": "Śląskie",
  силезское: "Śląskie",
  "силезское воеводство": "Śląskie",
  śląskie: "Śląskie",

  // Świętokrzyskie
  свентокшиське: "Świętokrzyskie",
  "свентокшиське воєводство": "Świętokrzyskie",
  свентокшиское: "Świętokrzyskie",
  "свентокшиское воеводство": "Świętokrzyskie",
  świętokrzyskie: "Świętokrzyskie",

  // Warmińsko-Mazurskie
  "вармінсько-мазурське": "Warmińsko-Mazurskie",
  "вармінсько-мазурське воєводство": "Warmińsko-Mazurskie",
  "варминско-мазурское": "Warmińsko-Mazurskie",
  "варминско-мазурское воеводство": "Warmińsko-Mazurskie",
  "warmińsko-mazurskie": "Warmińsko-Mazurskie",

  // Wielkopolskie
  великопольське: "Wielkopolskie",
  "великопольське воєводство": "Wielkopolskie",
  великопольское: "Wielkopolskie",
  "великопольское воеводство": "Wielkopolskie",
  wielkopolskie: "Wielkopolskie",

  // Zachodniopomorskie
  західнопоморське: "Zachodniopomorskie",
  "західнопоморське воєводство": "Zachodniopomorskie",
  западнопоморское: "Zachodniopomorskie",
  "западнопоморское воеводство": "Zachodniopomorskie",
  zachodniopomorskie: "Zachodniopomorskie",
};

const ALLOWED_NUANCE_CATEGORIES = [
  "Температурний режим",
  "Фізично-важка праця",
  "Санітарні обмеження",
  "Запахи та алергени",
  "Шум",
  "Характер праці",
  "Специфічні навички",
  "Норми",
  "Тести при вступі",
  "Інше",
];
const LOCATION_FIX_MAP = {
  "katy wroclawskie": "Kąty Wrocławskie",
  "katy wrocławskie": "Kąty Wrocławskie",
  "kostrzyn-nad-odrą": "Kostrzyn nad Odrą",
  "kostrzyn nad odra": "Kostrzyn nad Odrą",
  "moszna-parcela": "Moszna Parcela",
  "gluchowo": "Głuchów",
  "gluchow": "Głuchów",
  "pakosc": "Pakość",
  "слупськ": "Słupsk",
  "гдиня": "Gdynia",
  "варшава": "Warszawa",
  "краків": "Kraków",
  "вроцлав": "Wrocław",
  "познань": "Poznań",
  "лодзь": "Łódź",
  "щецін": "Szczecin",
  "бидгощ": "Bydgoszcz",
  "люблін": "Lublin",
  "білосток": "Białystok",
  "катовіце": "Katowice",
  "грювальд": "Grunwald",
  "niderlandy": "Netherlands",
  "netherlands (netherlands)": "Netherlands",
  "niderlandy (netherlands)": "Netherlands",
  "re america": "America"
};
// Функцыя для ачысткі назвы горада ад любых краін у дужках
function normalizeLocation(location, country) {
  if (!location) return "Польща";

  // 1. Ачыстка ад дужак і лішніх прабелаў
  let clean = location.replace(/\s*\([^)]+\)/gi, "").trim();
  
  // 2. Прымусовая карэкцыя па мапе (Kąty, Kostrzyn і г.д.)
  const lowLoc = clean.toLowerCase();
  if (LOCATION_FIX_MAP[lowLoc]) {
    clean = LOCATION_FIX_MAP[lowLoc];
  }

  if (lowLoc.includes("уточнюється") || lowLoc === "") return "Польща";
  if (lowLoc.includes("маршрути по єс") || lowLoc.includes("маршруты по ес"))
    return "Інші країни Європи";
  if (
    lowLoc.includes("різні локалізації") ||
    lowLoc.includes("разные локализации")
  )
    return "Польща";

  // 3. Вызначаем краіну
  const normalizedCountry = country
    ? COUNTRY_MAP[country.toLowerCase()] || country
    : "Polska";

  // 4. Прыбіраем дублікаты гарадоў (калі праз коску)
  if (clean.includes(",")) {
    clean = [...new Set(clean.split(",").map((s) => s.trim()))].join(", ");
  }

  // 5. ВЯРТАЕМ КРАІНУ, калі гэта не Польшча
  if (normalizedCountry !== "Polska") {
    if (clean.includes(`(${normalizedCountry})`)) return clean;
    return `${clean} (${normalizedCountry})`;
  }

  if (VOIVODESHIP_MAP[clean.toLowerCase()]) return "Польща";

  return clean;
}
// Функцыя нармалізацыі агенцыі
function normalizeAgency(raw) {
  if (!raw) return "MANUAL";
  const upper = raw.toUpperCase().trim();
  const TRANSLATION_MAP = {
    АПОЛО: "APOLO",
    БИСАР: "BISAR",
    БІСАР: "BISAR",
    ЕСТ: "EST",
    ЕВЛ: "EWL",
    ЄВЛ: "EWL",
    ФВС: "FWS",
    ГЛОБАЛ: "GLOBAL",
    ИНТРАСЕРВИС: "INTRASERVICE",
    ІНТРАСЕРВІС: "INTRASERVICE",
    "ПАРТНЕР/ИНТРАСЕРВИС": "INTRASERVICE",
    КОНО: "KONO",
    МАНПАУЭР: "MANPOWER",
    МАНПАВЕР: "MANPOWER",
    МАНУАЛ: "MANUAL",
    МРУВКИ: "MRÓWKI",
    МРУВКІ: "MRÓWKI",
    НИДЕН: "NIDEN",
    НІДЕН: "NIDEN",
    ОТТО: "OTTO",
    "ПЕРСОНЕЛ СЕРВИС": "PERSONEL SERVICE",
    "ПЕРСОНЕЛ СЕРВІС": "PERSONEL SERVICE",
    ПРОГРЕСС: "PROGRES",
    ПРОГРЕС: "PROGRES",
    РАЛЕН: "RALEN",
    СГ: "SG",
    СОЛАНО: "SOLANO",
    "СТАФФ ПАУЭР": "STAFF POWER",
    "СТАФ ПАВЕР": "STAFF POWER",
    КРЕОН: "KREON",
    КРЕОНТ: "KREON",
    ФОЛЬГА: "FOLGA",
    ВЕКОС: "VEKOS",
    WORKANDHUMAN: "WORK&HUMAN",
    "ДЖОБ ІМПУЛЬС": "JOB IMPULSE", // 👈 ДАДАЦЬ ГЭТА
      "JOBIMPULSE": "JOB IMPULSE",   // 👈 ДАДАЦЬ ГЭТА
  };
  const translated = TRANSLATION_MAP[upper] || upper;
  const found = KNOWN_AGENCIES.find(
    (a) => translated === a || translated.includes(a) || a.includes(translated),
  );

  return found || "MANUAL";
}
// Функцыя валідацыі брэнда
function validateBrand(raw) {
  if (!raw) return null;

  // Прымусова ў UPPERCASE і Latin (прыбіраем кірыліцу, калі гэта магчыма)
  let brand = raw.toUpperCase().trim();

  // Калі ў назве ёсць кірыліца — гэта альбо апісанне, альбо трэба транслітараваць
  const hasCyrillic = /[А-ЯЁІЎ]/.test(brand);

  if (hasCyrillic) {
    // Калі гэта апісальная фраза (больш за 2 словы або ёсць у блэклісце) — гэта не брэнд
    if (
      brand.split(" ").length > 2 ||
      BRAND_BLACKLIST.some((b) => brand.toLowerCase().includes(b))
    ) {
      return null;
    }
    // Тут можна дадаць транслітарацыю, але пакуль проста вернем як ёсць,
    // AI ў промпце атрымае загад перакладаць у Latin.
  }

  if (
    BRAND_BLACKLIST.some((b) => brand.toLowerCase().includes(b.toLowerCase()))
  )
    return null;
  if (brand.length < 2) return null;

  return brand;
}
/**
 * Вызначае, ці сапраўды бясплатнае жытло, зыходзячы з тэксту type/details.
 * Улічвае: камунальныя паслугі, утрыманні з зарплаты, перыядычныя плацяжы.
 * Застава (дэпазіт) лічыцца бясплатным, толькі калі яна вяртаемая.
 */
function isHousingFree(type, details) {
  const t = (type || "").toLowerCase();
  const d = (details || "").toLowerCase();

  const hasFreeSignal =
    t.includes("безкоштовн") ||
    d.includes("безкоштовн") ||
    d.includes("бесплатн") ||
    d.includes(" 0 зл") ||
    d.includes("0 zł") ||
    d.includes("за рахунок робот");

  if (!hasFreeSignal) return false;

  // 1. Прамая згадка камунальных паслуг (комунальн / коммунальн) -> адразу платна
  if (d.includes("мунальн")) return false;

  // 2. Утрыманне з зарплаты / самастойная аплата -> адразу платна
  const deductionPattern = /вираховує|вичитує|вычита|утриму|самостійно|за свій рахунок|із зарплати|из зарплаты/;
  if (deductionPattern.test(d)) return false;

  // 3. Любая ПЕРЫЯДЫЧНАЯ цана (X zł/міс, X zł/доба) -> гэта плата, не бясплатна
  const recurringCostPattern = /\d{1,4}\s*(zł|зл|pln|€|eur)\s*\/?\s*(міс|мес|month|доба|день|тижд|сут)/;
  if (recurringCostPattern.test(d)) return false;

  // 4. Пошук сум грошай і аналіз іх прызначэння
  const amountRegex = /(\d{2,4})\s*(zł|зл|pln|€|eur)/gi;
  let match;
  
  while ((match = amountRegex.exec(d)) !== null) {
    const amount = parseInt(match[1], 10);
    if (amount === 0) continue;

    // Бярэм кантэкст вакол сумы (50 сімвалаў да і пасля)
    const contextStart = Math.max(0, match.index - 50);
    const contextEnd = Math.min(d.length, match.index + 50);
    const context = d.substring(contextStart, contextEnd);

    const isDeposit = /застав|депозит|завдат|кауці|kaucja/.test(context);
    const isRefundable = /поворотн|возвратн|вяртаем|повернення|возвращается/.test(context);

    // Калі гэта застава І яна вяртаецца — ігнаруем гэтую суму (жытло ўсё яшчэ бясплатнае)
    if (isDeposit && isRefundable) {
      continue;
    }

    // Калі сума > 0 і гэта не вяртаемая застава — жытло платнае
    if (amount > 0) return false;
  }

  return true;
}
const LANGUAGE_GUARD = `
!!! UKRAINIAN ONLY. Geography: Polish (Latin). Input is already UA, do not translate.
`;
// 1. Абноўленая функцыя cleanData
function cleanData(obj) {
  if (obj === undefined || obj === null) return null;

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanData(item));
  }

  if (typeof obj === "object") {
    const cleanedEntries = Object.entries(obj).map(([key, value]) => {
      const garbage = [
        "undefined",
        "не вказано",
        "null",
        "",
        "none",
        "n/a",
        "unknown",
      ];
      const valStr = String(value).toLowerCase().trim();

      if (value === undefined || value === null || garbage.includes(valStr)) {
        return [key, null];
      }
      return [key, cleanData(value)];
    });
    return Object.fromEntries(cleanedEntries);
  }

  return obj;
}
/**
 * Супер-рамонтнік JSON: апрацоўвае Markdown, вісячыя коскі і нябачныя сімвалы
 */
/**
 * JSON Brute Force Repair: чысціць Markdown і спрабуе закрыць абрэзаныя дужкі/лапкі.
 */
function repairJson(text) {
  if (!text) return "{}";
  
  let cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

  // 👈 ДАДАДЗЕНА: Закрыццё вісячай лапкі
  const openQuotes = (cleaned.match(/"/g) || []).length;
  if (openQuotes % 2 !== 0) cleaned += '"';

  if (!cleaned.endsWith("}")) {
    if (cleaned.endsWith(",")) cleaned = cleaned.slice(0, -1);
    
    const openBraces = (cleaned.match(/\{/g) || []).length;
    const closeBraces = (cleaned.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      cleaned += "}".repeat(openBraces - closeBraces);
    }
  }
  return cleaned;
}
// --- PROMPTS ---

const IDENTIFY_PROMPT = `
ROLE: HR Dispatcher assistant.
TASK: Identify which template this job vacancy message belongs to.
${LANGUAGE_GUARD}
CRITICAL RULES:
1. Brand must match exactly.
2. Location (city) must match.
3. Agency name must match (agencyName field).
4. Job PROCESS must match — same duties/description. Different role at same factory = NO MATCH.
If any of the 4 criteria fail → return templateId: null.

Return ONLY a JSON object:
{
  "templateId": "the _id of the matched template, or null if no match",
  "confidence": "high/medium/low",
  "reason": "brief explanation in Ukrainian"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
CRITICAL RULE: If the factory and location match, but the JOB PROCESS (duties/process field) is different, return templateId: null. We need a new template for different roles.
`;

// 2. Абноўлены FORMAT_PROMPT
const FORMAT_PROMPT = `
ROLE: Professional HR content formatter.
TASK: Format job data into a beautiful Telegram post in UKRAINIAN.
!!! OUTPUT STRUCTURE !!!
You MUST return exactly two versions of the post separated by "=== SPLIT ===".
Version 1: Full detailed post.
Version 2: Short concise post.


!!! CRITICAL MODE SELECTION !!!
- Use COMPACT MODE if the total length of the vacancy information (rawText) is less than 700 characters.
- Use FULL MODE if the total length is 700 characters or more.

!!! CRITICAL COMPACTNESS RULE !!!
- If a field value is null, undefined, or empty — DO NOT include its label, emoji, or the entire line in the post.
- If an ENTIRE SECTION (Accommodation, Transport, Expenses) has no data inside, skip its header too.
- NEVER use placeholders like "немає інформації". Just skip the line.
- The post must be as compact as possible, looking like a natural text post, not a form.

!!! CRITICAL RULES !!!
- NEVER include internalNotes or parsingResultType. Agency Name and Brand are ONLY allowed in the Metadata Line at the very beginning.
- NEVER include genderDescription (it is for internal use only).
- If a field is null, empty, or "Не вимагається" (for experience), skip the entire line.
- Use Ukrainian for all labels.
- NEVER include technical info like "KRAZ", "nr certyfikatu", or "Oferta pracy tymczasowej".
- NO PAST DATES: Today is {{currentDate}}. If arrivalDate or any date in the text is before today, DO NOT include it in the post.
- GEOGRAPHY: If country is NOT Polska, show it in parentheses ONCE. Example: "Stadtlohn (Germany)".
- CONTACTS: Always include this exact line at the end of BOTH posts: 📲 Контактуйте: @InnaNovaWork +48 780 770 745 Інна

- TRANSPORT RULE:
   • If the text mentions "безкоштовний доїзд", "автобус від фірми", "довіз до роботи" -> provided MUST be true.
   • provided is false ONLY if candidates must use their own car or public transport at their own expense.
   • If transport is NOT provided -> "🚌 Довіз: немає"
   • If transport IS provided -> "🚌 Довіз: надається" + details
- ACCOMMODATION: If costRaw is present, show it! Example: "🏠 Проживання: Надається (450 €/міс)".
- LANGUAGE: If requirements.languageDetails is present, show it in the Requirements block.
- COMPACTNESS: If a section is empty, skip it. No placeholders like "немає інформацыі".
TITLE RULE:
- vacancydescription must be formatted as "Job Essence (Category) — Location".
- Location = place of work, not checkInCity.

FULL MODE STRUCTURE (skip empty lines/sections):
🆔 [vacancyCode] | 🏢 [agencyName] [| 🏭 brand]
*[vacancydescription]*

📍 Місто: [location][(country if not Polska)]
[• Оформлення: м. [checkInCity]]
[👥 Набір: [requirements.gender joined by ", "]]
[• Приїзд: [arrivalDate]]

💰 *Оплата праці*
• Ставка: [salary.rawSalaryDisplay]
[• Годин на місяць: [salary.hoursRange]]
[• Студенти: [salary.studentNetto] [salary.currency]/god (netto)]
[• Виплати: [salary.payoutDates]]
[• Бонуси: [salary.bonusDetails]]
[• Деталі: [salary.salaryNotes]] (!!! SKIP this line if salaryNotes repeats the same information as salary.rawSalaryDisplay)

🛠 *Характер роботи*
[description items with •]

📋 *Вимоги*
[• Досвід роботи: [requirements.experienceRequired ? "Обов'язковий" : "Не вимагається"]]
[• Вік: [requirements.age.rawText]]
[• Національність: [requirements.nationalities joined by ", "]]
• Документи: [requirements.standardDocs]
• Мова: [polishLanguageLevel] [([languageDetails])] (skip brackets if details empty)
[• Фізично важка праця: Так (only if physicalLoad is true)]

🕒 *Графік роботи:* [schedule.description]

📄 *Тип договору:* [contractType]

🏠 *Проживання :* [accommodation.type]
[• Для пар: Так (only if forCouples is true)]
[• Можна з дітьми: Так (only if withChildren is true)]
[• Можна з тваринами: Так (only if withPets is true)]
[• Деталі: [accommodation.details]]

🚌 *Транспорт (довіз) :* [transport.provided ? "надається" : "немає"]
[• Деталі: [transport.details]]

💸 *Витрати та відповідальність*
[• На старті: [startExpenses.details]]
[• При передчасному звільненні: [earlyTerminationLiability.details]]

🌡 *Умови праці*
• Робочий одяг: [conditions.workwearFree ? "Безкоштовно" : "За рахунок працівника"]
• Харчування: [conditions.foodType]
[• [specificNuances.text] (each as a bullet point, NO category labels)]
[• Деталі: [conditions.foodDetails]]

📝 *Додаткова інформація*
[additionalNotes including навчання, адаптація, вихід на норму, координатор, банківський рахунок, карта побуту, можливість роботи в інших країнах, організаваны трансфер з Украіны]
📲 Контактуйте: @InnaNovaWork +48 780 770 745 Інна

--- STRUCTURE FOR SHORT POST (after === SPLIT ===) ---
🆔 [vacancyCode] | 🏢 [agencyName] [| 🏭 brand]

🔥 *[vacancydescription]*
📍 [location] | 💰 [salary.rawSalaryDisplay]
👥 Набір: [requirements.gender] [| 🎂 Вік: [requirements.age.rawText]]
🏠 Проживання: [accommodation.type] [([accommodation.details])]
🗓 Графік: [schedule.description] [| ⏱ [salary.hoursRange] год/міс]
📄 Тип договору: [contractType]
🚌 Транспорт: [transport.provided ? "надається" : "немає"]

📲 Контактуйте: @InnaNovaWork +48 780 770 745 Інна`
;

const CREATE_TEMPLATE_PROMPT = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: Create a reusable job template from a parsed vacancy JSON.
${LANGUAGE_GUARD}
The template should:
1. Extract the BRAND/COMPANY name from templateName or description
2. Generate a short descriptive templateName: "[Brand] [City] - [Short job description]"
   Example: "Aurora Kąty Wrocławskie - Склад одягу та аксесуарів"
3. Generate keywords array (5-10 items): brand name, location, key job terms in Ukrainian, Polish (latin) variants
4. Map ALL fields to Structure v2.1 (including genderDescription and specificNuances as objects)
5. Set agencyName to the value from vacancy UPPERCASE.
Return ONLY valid JSON.
`;

const MERGE_PROMPT = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: You have a job template (JSON v2.0) and a new short message.
${LANGUAGE_GUARD}
Extract ONLY the information that has CHANGED or is NEW in the message.
Keep ALL other fields from the template EXACTLY unchanged.

Rules:
- ALWAYS keep templateName EXACTLY as in template — never modify it
- If message mentions salary change → update salary fields
- If message mentions arrival date → update arrivalDate
- If message mentions count → update count
- If message mentions gender → update requirements.gender
- If message mentions housing change → update accommodation fields
- If message mentions schedule change → update schedule fields
- If field is NOT mentioned in message → keep template value EXACTLY as is
- DESCRIPTION PRESERVATION: The 'description' field in the template contains detailed duties. NEVER delete or shorten it. If the message adds a new duty, append it to the existing list.
Return ONLY valid JSON with the complete merged result using FULL structure v2.0.
IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
`;
const UPDATE_VACANCY_PROMPT = `
ROLE: Professional HR Dispatcher.
TASK: Update an EXISTING job vacancy (JSON v2.1) with information from a NEW message.
${LANGUAGE_GUARD}

CRITICAL RULES FOR UPDATE:
1. PRIVACY: Any new mentions of recruiter bonuses or internal counts MUST go ONLY to forRecruiter.internalNotes.
2. If the message says "STOP", "closed", "зібрана", "не актуально", "стоп" -> set status to "closed".
3. KEEP ALL OTHER FIELDS: If a field is NOT mentioned in the new message, you MUST keep the value from CURRENT_VACANCY_JSON.
4. Update genderDescription if new count info appears.
- DESCRIPTION: Do not overwrite the existing description. If new duties are mentioned, add them to the list.
Return ONLY valid JSON.
`;
const COMPARE_VACANCIES_PROMPT = `
ROLE: HR Data Auditor.
TASK: Compare a NEW vacancy from a spreadsheet with an EXISTING vacancy from the database.
${LANGUAGE_GUARD}

NEW_DATA:
{{newData}}

EXISTING_DATA:
{{existingData}}

DECISION RULES:
1. If they describe the EXACT SAME job at the same factory/location → return verdict: "DUPLICATE".
2. If it's the same job but the NEW_DATA has updated salary, dates, or spots → return verdict: "UPDATE".
3. If they are different jobs (different roles, different factories, or different cities) → return verdict: "NEW".

Return ONLY JSON:
{
  "verdict": "DUPLICATE" | "UPDATE" | "NEW",
  "reason": "Short explanation in Ukrainian",
  "mergedData": null or merged JSON object if verdict is UPDATE
}
`;
// --- ДАПАМОЖНЫЯ ФУНКЦЫІ ---
// ============================================================
async function executeAIRequest(systemPrompt, userContent, jsonMode = true, fullModelOnly = false) {
  // const safeContent = String(userContent).substring(0, 8000);

  if (Date.now() < chainFrozenUntil) {
    const diff = Math.ceil((chainFrozenUntil - Date.now()) / 60000);
    throw new Error(`AI_COOLDOWN: Паўза яшчэ ${diff} хв.`);
  }
 let lastErrorWasJson = false;
  for (const model of AI_CHAIN) {
    if (fullModelOnly && model.name.toLowerCase().includes("lite")) continue;

    // 👈 ДАДАДЗЕНА: Праверка, ці не замарожаны гэты правайдэр
    if (Date.now() < PROVIDER_FREEZE[model.provider]) {
      const remain = Math.ceil((PROVIDER_FREEZE[model.provider] - Date.now()) / 60000);
      console.log(`❄️ [AI] Правайдэр ${model.provider} замарожаны яшчэ на ${remain} хв. Пропуск ${model.name}.`);
      continue;
    }

    // 👈 ГІБРЫДНАЯ ЛОГІКА: Gemini атрымлівае пачку, Groq — па адной
    let currentInput = "";
    let isSequentialGroq = (model.provider === "groq" && Array.isArray(userContent));

    if (Array.isArray(userContent)) {
      // 👈 ЗМЕНЕНА: Vertex выкарыстоўвае тую ж логіку пачак, што і Gemini Studio
      if (model.provider === "gemini_studio" || model.provider === "vertex") {
        currentInput = userContent.map((t, i) => `--- VACANCY ${i+1} ---\n${t}`).join("\n\n");
      } else if (!isSequentialGroq) {
        currentInput = userContent.join("\n\n");
      }
    } else {
      currentInput = String(userContent);
    }

    if (model.maxChars && currentInput.length > model.maxChars && !isSequentialGroq) {
      console.log(`⏩ Пропуск ${model.name}: тэкст занадта вялікі.`);
      continue;
    }

    console.log(`[AI Request] Model: ${model.name} | Provider: ${model.provider} | Mode: ${isSequentialGroq ? 'Sequential' : 'Batch'}`);
    let retries = 1;

    while (retries >= 0) {
      try {
        let fullText = "";

        // --- VERTEX AI (Non-streaming version) ---
        if (model.provider === "vertex") {
          console.log(`🤖 Запыт да Vertex AI: ${model.name} (Спроб: ${retries})`);
          const token = await getAccessToken();
           if (!token) throw new Error("Токен адсутнічае");
          // 👈 ЗМЕНЕНА: generateContent замест streamGenerateContent
          const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model.name}:generateContent`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000);

          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${currentInput}` }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: jsonMode ? "application/json" : "text/plain",
                maxOutputTokens: 8192,
              },
            }),
          });

          clearTimeout(timeoutId);
          if (response.status === 429) throw new Error("RATE_LIMIT");
          if (!response.ok) throw new Error(`VERTEX_ERROR_${response.status}`);

          const data = await response.json();
          // 👈 ЗМЕНЕНА: Простае атрыманне тэксту без цыкла па chunks
          fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
// --- GEMINI AI STUDIO ---
        if (model.provider === "gemini_studio") {
          console.log(`🤖 Запыт да Gemini AI Studio (SDK): ${model.name}`);
          const genModel = genAI.getGenerativeModel({ model: model.name }, { apiVersion: "v1beta" });
          const result = await genModel.generateContent(systemPrompt + "\n\n" + currentInput);
          const response = await result.response;
          fullText = response.text().trim();
        }
        // --- GROQ (З падтрымкай паслядоўнай апрацоўкі масіваў) ---
        if (model.provider === "groq") {
          if (isSequentialGroq) {
            console.log(`🤖 Groq Sequential: апрацоўка ${userContent.length} фрагментаў...`);
            let results = [];
            for (const fragment of userContent) {
              const response = await groq.chat.completions.create({
                model: model.name,
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: fragment }],
                temperature: 0.1, response_format: jsonMode ? { type: "json_object" } : undefined
              });
              const text = response.choices[0]?.message?.content?.trim();
              results.push(jsonMode ? JSON.parse(repairJson(text)) : text);
              await new Promise(r => setTimeout(r, 2000)); // Паўза паміж фрагментамі для Groq
            }
            return { data: JSON.stringify(results), isLowQuality: false, modelUsed: model.name };
          } else {
            const response = await groq.chat.completions.create({
              model: model.name,
              messages: [{ role: "system", content: systemPrompt }, { role: "user", content: currentInput }],
              temperature: 0.1, response_format: jsonMode ? { type: "json_object" } : undefined
            });
            fullText = response.choices[0]?.message?.content?.trim();
          }
        }

        // --- ВАЛІДАЦЫЯ ВЫНІКУ ---
        if (!fullText || fullText.length < 5) throw new Error("EMPTY_RESPONSE");

        if (jsonMode) {
          try {
            const repaired = repairJson(fullText);
            let isLowQuality = false;
            
            // Правяраем, ці патрабаваўся рамонт
            try { JSON.parse(fullText); } catch (e) { isLowQuality = true; }

            // Валідуем вынік
            JSON.parse(repaired); 

            return { data: repaired, isLowQuality, modelUsed: model.name }; // 👈 Дадалі modelUsed
          } catch (e) {
            console.warn(`⚠️ Мадэль ${model.name} вярнула невылечны JSON.`);
            lastErrorWasJson = true; // 👈 ДАДАДЗЕНА: пазначаем, што праблема ў кантэнце, а не ў сервісе
            throw new Error("INVALID_JSON");
          }
        }

        return { data: fullText.trim(), isLowQuality: false, modelUsed: model.name }; // 👈 Дадалі modelUsed
      } catch (error) {
        const isRetryable =
          error.message.includes("SERVER_ERROR") || error.name === "AbortError";

        if (isRetryable && retries > 0) {
          console.warn(`⚠️ Часовая памылка (${model.name}), паўтор...`);
          retries--;
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        console.error(`⚠️ Памылка мадэлі (${model.name}):`, error.message);

        // 👈 ДАДАДЗЕНА: Вызначаем, ці гэта памылка лімітаў (429 / Quota)
        const isRateLimit = 
          error.message?.includes("429") || 
          error.message?.includes("Rate limit") || 
          error.message?.includes("quota") ||
          error.message?.includes("RATE_LIMIT");

        if (isRateLimit) {
          // 👈 ЗМЕНЕНА: Дыферэнцыраваная замарозка (v5.6)
          // Vertex (платны) — 2 хвіліны, астатнія (бясплатныя) — 30 хвілін
          const freezeMinutes = model.provider === "vertex" ? 2 : 30;
          PROVIDER_FREEZE[model.provider] = Date.now() + freezeMinutes * 60 * 1000;
          console.warn(`🚫 [AI] Правайдэр ${model.provider} дасягнуў ліміту. Замарожана на ${freezeMinutes} хв.`);
        }

        break; // Выхад з while, пераход да наступнай мадэлі ў for
      }
    }
  }
// 👈 SMART FREEZE: Замарожваем увесь ланцужок толькі калі гэта НЕ памылка JSON (v5.5)
  if (!lastErrorWasJson) {
    chainFrozenUntil = Date.now() + 5 * 60 * 1000; // Паўза 5 хв толькі пры адмове API
    console.error("❄️ [AI] Усе мадэлі адмовілі (API error). Глабальная замарозка на 5 хв.");
  } else {
    console.warn("⚠️ [AI] Усе мадэлі вярнулі INVALID_JSON. Пропуск без глабальнай замарозкі.");
  }

  throw new Error("ALL_AI_MODELS_FAILED");
}

async function mergeWithTemplate(rawText, template) {
 try {
    console.log(`🤖 Мерж шаблона "${template.templateName}"...`);
    const content = `TEMPLATE:\n${JSON.stringify(template, null, 2)}\n\nMESSAGE:\n${rawText}`;
    
    const result = await executeAIRequest(MERGE_PROMPT, content, true);

    const merged = JSON.parse(result.data);
    merged.isLowQuality = result.isLowQuality;
    merged.templateName = template.templateName;
    merged.agencyName = normalizeAgency(template.agencyName);
    
    if (!merged.keywords?.length) merged.keywords = template.keywords;
    return merged;
  } catch (error) {
    throw error;
  }
}

async function identifyTemplate(rawText, templates) {
  const lowerText = rawText.toLowerCase();
  console.log(`🔍 Пошук шаблона сярод ${templates.length} варыянтаў...`);

  const allBrands = templates.map((t) => ({
    brand: t.templateName.split(" ")[0].toLowerCase(),
    id: t._id.toString(),
  }));

  const mentionedBrands = allBrands.filter((b) => lowerText.includes(b.brand));

  if (mentionedBrands.length === 0) {
    console.log(`⚠️ Брэнд у тэксце не знойдзены — пераходзім да AI...`);
  } else {
    let bestMatch = null;
    let maxScore = 0;

    templates.forEach((t) => {
      const brandName = t.templateName.split(" ")[0].toLowerCase();
      const matchesThisBrand = mentionedBrands.some(
        (b) => b.brand === brandName,
      );
      if (!matchesThisBrand) return;

      let score = 0;
      score += 15;

      if (t.location && lowerText.includes(t.location.toLowerCase()))
        score += 7;
      if (t.keywords && Array.isArray(t.keywords)) {
        t.keywords.forEach((kw) => {
          if (lowerText.includes(kw.toLowerCase())) score += 1;
        });
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = t;
      }
    });

    if (bestMatch && maxScore >= 22) {
      const locationMatch =
        bestMatch.location &&
        lowerText.includes(bestMatch.location.toLowerCase());

      if (locationMatch) {
        console.log(
          `✅ Шаблон знойдзены лакальна: ${bestMatch.templateName} (Score: ${maxScore})`,
        );
        return bestMatch;
      } else {
        console.log(`⚠️ Брэнд супадае але лакацыя не — адпраўляем да AI`);
      }
    }
  }

  try {
    const templateList = templates.map((t) => ({
      _id: t._id.toString(),
      templateName: t.templateName,
      location: t.location || "",
      brand: t.templateName.split(" ")[0],
      process: t.description?.substring(0, 150),
    }));

    const content = `MESSAGE:\n${rawText}\n\nAVAILABLE TEMPLATES:\n${JSON.stringify(templateList)}`;
    const response = await executeAIRequest(IDENTIFY_PROMPT, content, true);
    const parsed = JSON.parse(response.data);

    if (parsed.templateId) {
      const matched = templates.find(
        (t) => t._id.toString() === parsed.templateId,
      );
      if (matched) return matched;
    }
  } catch (err) {
    console.error("❌ AI identify error:", err.message);
  }
  return null;
}

async function linkTemplateToVacancy(vacancyData, template) {
  const ref = `📎 Шаблон: ${template.templateName} (ID: ${template._id})`;
  const existing = vacancyData.forRecruiter?.internalNotes || "";
  return {
    ...vacancyData,
    forRecruiter: {
      ...vacancyData.forRecruiter,
      internalNotes: existing ? `${ref}\n${existing}` : ref,
    },
  };
}

async function formatTelegramPost(vacancyData) {
  console.log(
    `🤖 Форматаванне Telegram-посту для ${vacancyData.vacancyCode}...`,
  );

  try {
    // 1. 🛡️ Technical Privacy Shield
    const rawObj = vacancyData.toObject ? vacancyData.toObject() : vacancyData;
    const {
      forRecruiter,
      originalText,
      rawText,
      textHash,
      prefixHash,
      __v,
      _id,
      ...publicData
    } = rawObj;

    // 2. Падрыхтоўка промпта з датай
    const currentDate = new Date().toLocaleDateString('uk-UA');
    const dynamicPrompt = FORMAT_PROMPT.replace('{{currentDate}}', currentDate);

    const strictPrompt =
      dynamicPrompt +
      "\n\n!!! CRITICAL: Return TWO versions separated by === SPLIT ===. NO JSON, NO explanations.";

    // 3. Запыт да AI
    const result = await executeAIRequest(
      strictPrompt,
      `DATA:\n${JSON.stringify(publicData, null, 2)}`,
      false
    );

    // Выпраўлена: бяром з result, а не з response
    let trimmedText = (result?.data || result || "").trim();

    // Лакальная функцыя для жалезнага экраніравання спецсімвалаў Telegram
    const escapeMarkdownV2 = (text) => {
      if (!text) return "";
      
      // 1. Праверка парнасці зорачак (*) і ніжніх падкрэсліванняў (_)
      const starCount = (text.match(/\*/g) || []).length;
      const underCount = (text.match(/_/g) || []).length;
      
      let processed = text;
      if (starCount % 2 !== 0) {
        console.log(`⚠️ [AI Service] Няпарны сімвал [*] для ${vacancyData.vacancyCode}. Экрануем усе зорачкі.`);
        processed = processed.replace(/\*/g, '\\*');
      }
      if (underCount % 2 !== 0) {
        console.log(`⚠️ [AI Service] Няпарны сімвал [_] для ${vacancyData.vacancyCode}. Экрануем усе падкрэсліванні.`);
        processed = processed.replace(/_/g, '\\_');
      }

      // 2. Экрануем тэхнічныя сімвалы (- + = ! . ( ) { } [ ] > # | ~)
      // Выкарыстоўваем адмоўны прагляд (lookahead/lookbehind), каб НЕ зламаць раздзяляльнік === SPLIT ===
      return processed.replace(/(?<!=== )(?<!=)([\+\-\=\!\.\(\)\{\}\[\]\>\|\#\~])(?!(?: ===)|(?:=))/g, '\\$1');
    };

    // Калі AI вярнуў сыры JSON замест фарматаванага тэксту (аварыйны шчыт)
    const isJson = trimmedText.startsWith('{') && trimmedText.endsWith('}');
    if (isJson) {
      console.log("⚠️ AI вярнуў JSON замест гатовага паста. Уключаем аварыйны шчыт.");
      const parsed = JSON.parse(trimmedText);
      const fullFallback = parsed.fullPost || parsed.full || parsed.text || trimmedText;
      const shortFallback = parsed.shortPost || parsed.short || "";
      
      // Бяспечна экрануем абедзве часткі асобна
      return `${escapeMarkdownV2(fullFallback)}\n\n=== SPLIT ===\n\n${escapeMarkdownV2(shortFallback)}`;
    }

    if (!trimmedText || trimmedText.length < 50) {
      throw new Error("Фарматаванне вярнула занадта кароткі або пусты тэкст.");
    }

    // Прымяняем экраніраванне да гатовага паста
    return escapeMarkdownV2(trimmedText);
  } catch (err) {
    console.error(`❌ Памылка фарматавання паста для ${vacancyData.vacancyCode}:`, err.message);
    throw err;
  }
}

function normalizeNuances(nuances) {
  if (!Array.isArray(nuances)) return [];
  return nuances
    .map((n) => {
      if (!n || typeof n !== "object") return null;

      // AI прысылае { category, text }. Валідуем катэгорыю.
      const matchedCategory = ALLOWED_NUANCE_CATEGORIES.find(
        (cat) => cat.toLowerCase() === (n.category || "").toLowerCase(),
      );

      return {
        category: matchedCategory || "Інше",
        text: n.text || "",
      };
    })
    .filter((n) => n && n.text); // Пакідаем толькі тыя, дзе ёсць тэкст
}

async function parseVacancyWithAI(rawText, forcedAgency = null, parsingResultType = "FULL_VACANCY", sheetName = null, fullModelOnly = false) {
  try {
    console.log(
      `🤖 Парсінг v2.0 ... ${forcedAgency ? `(Forced Agency: ${forcedAgency})` : ""}`,
    );

    const SYSTEM_INSTRUCTION = `
ROLE: Professional automated job vacancy parser (v2.3).
TASK: Convert job vacancy text into JSON. 
!!! BATCH RULE: If the input contains multiple independent vacancies (marked as --- VACANCY N ---), you MUST return an ARRAY of JSON objects [{}, {}, {}]. If it is a single vacancy, return a single object.
LANGUAGE:
- Descriptions, duties, notes → Ukrainian.
- Geography (location, voivodeship, checkInCity, country) → Polish (Latin alphabet only).
- Categories → exact Ukrainian strings.

DOCUMENT RULES:
- Use ONLY: "PESEL UKR", "Біометрія", "Карта побуту", "Віза", "Санепід", "UDT", "SEP", "Права кат. B", "Довідка резидента".
- Others → additionalDocsDetails.

NUANCES RULES (conditions.specificNuances):
- MANDATORY: Extract ALL specific working conditions into this array. 
- NEVER put these details into additionalNotes if they fit a category below.
- Format: Array of objects { "category": "CATEGORY_NAME", "text": "detail" }.
- Categories (USE ONLY THESE 10):
  1. "Температурний режим" (e.g., +5°C, холодний цех, спека)
  2. "Фізично-важка праця" (e.g., підняття ваги >15кг, робота з великими деталями)
  3. "Санітарні обмеження" (e.g., без манікюру, без біжутерії, без вій)
  4. "Запахи та алергени" (e.g., запах гуми, фарби, пил, клей)
  5. "Шум" (e.g., робота в берушах, шумні станки)
  6. "Характер праці" (e.g., 100% стоячи, робота на колінах, сидяча робота, робота са сканером)
  7. "Специфічні навички" (e.g., знання креслень, робота з ножам, пневмоінструмент)
  8. "Норми" (e.g., робота на акорд, високий темп, виконання плану)
  9. "Тести при вступі" (e.g., мануальні тести, математика, перевірка зору)
  10. "Інше" (anything else specific)

GEOGRAPHY RULES:
- location: All cities and locations MUST be in Polish (Latin alphabet). Example: "Warszawa", not "Варшава". Never translate city names to Ukrainian.
- MULTI-CITY RULE: If the text lists multiple cities for the SAME job description (e.g., Biedronka: Pasym, Ryn, Pisz), DO NOT split into fragments. Instead, list ALL cities in the 'location' field separated by commas (e.g., "Pasym, Ryn, Pisz").
- checkInCity: registration/оформлення city.
- country: default Polska; if not Poland → English name.
- voivodeship: 
  • If Poland → exact voivodeship name in Latin (e.g., "Mazowieckie"). 
  • MULTI-REGION RULE: If the vacancy lists multiple cities from DIFFERENT voivodeships (e.g., "Namysłów, Syców"), you MUST list ALL corresponding voivodeships separated by commas (e.g., "Opolskie, Dolnośląskie").
  • If country is not Poland → "Інші країни Європи".
- International: city + country in parentheses (e.g., "Droßdorf (Germany)").
- STRICT: never Cyrillic for cities; never include "Polska" in location.

PRIVACY & FORMATTING:
- agencyName: recruitment agency only. 
  • STRICT RULE: Choose ONLY from this list: [APOLO, BISAR, EST, EWL, FOLGA, FWS, GLOBAL, INTRASERVICE, KONO, KREON, MANPOWER, MRÓWKI, NIDEN, OTTO, PERSONEL SERVICE, PROGRES, RALEN, SG, SOLANO, STAFF POWER, VEKOS, WORK&HUMAN, JOB IMPULSE, MANUAL].
  • TRANSLATION RULE: If the agency name is in Cyrillic, TRANSLATE it to the Latin equivalent from the list above (e.g., "Прогрес" -> "PROGRES", "Коно" -> "KONO").
  • If no match from the list is found -> output null.
• brand: Extract ONLY the exact factory/brand name in Latin script (e.g., "AMAZON", "ZARA").
  • STRICT RULE: If the brand name is descriptive (e.g., "Брендовий одяг", "Склад електроніки") -> return null.
  • STRICT RULE: Brand must be in UPPERCASE and Latin characters only.
  • If no clear brand name is mentioned -> null.
  • STRICT: If no clear brand name is mentioned -> null.
- templateName: brand + city (Polish spelling).
- vacancydescription: PUBLIC TITLE in Ukrainian.
  • Format: "Job Essence (Category) — Location".
  • Examples: "Склад товарів (Логістика) — Warszawa", "Виробництво деталей (Автопром) — Grójec".
  • STRICT: Location = place of work, not checkInCity.
  • STRICT: Do NOT include brand/agency names.
  • STRICT: If goods type not explicitly mentioned → generic "Склад (Логістика)".
!!! CRITICAL PRIVACY SHIELD !!!
- RECRUITER BONUSES: Any mention of money "per candidate" (e.g., "800 зл за кандидата", "500 зл за людину") MUST go ONLY to forRecruiter.internalNotes.
- INTERNAL COUNTS: Mentions like "need 1 person", "last 2 spots" go ONLY to forRecruiter.internalNotes.
- NEVER put recruiter-only info in public fields (salary, description, additionalNotes).
- TECHNICAL INFO: Any mention of "KRAZ", "nr certyfikatu", or "Oferta pracy tymczasowej" MUST go ONLY to forRecruiter.internalNotes. NEVER put this in public fields.
CATEGORY:
One of:
"Склади та логістика", "Харчова промисловість", "Автомобільна промисловість",
"Виробництво та промисловість", "Будівництво", "Сільське господарство",
"Торгівля та послуги", "Різне".
!!! RULE: Jobs like "Caregiver", "Nanny", "Medical assistant", "Догляд за літніми" must be classified as "Різне".

DESCRIPTION & NOTES:
- description: ONLY duties; full detail.
- FORMATTING RULE: Use double newlines (\n\n) between logical paragraphs. Use bullet points (•) for lists.
- additionalNotes: everything else (recruitment, transport, videos, contract details, client brand names, навчання/вихід на норму).
- No duplication: if info already in structured fields → don’t repeat.
-- DRIVE CONTENT PRIORITY: If the input contains sections like "--- ЗМЕСТ ДОКУМЕНТА" or "--- ЗМЕСТ ПАПКІ DRIVE", treat this as the PRIMARY source for duties and description. The short table text is only for metadata (dates, counts).

CONDITIONS:
- specificNuances: array of objects { "category": "CATEGORY_NAME", "text": "detail" }.
- foodType: "Власне", "Обіди", "Субсидоване".
- workwearFree: if mentioned.

GENDER & AGE ACCURACY:
- gender: Array of ["Чоловіки", "Жінки", "Пари", "Сім'ї"]. Use ONLY these 4 values.
- genderDescription: ONLY specific counts (e.g., "2 пари", "Тільки чоловіки"). 
- ageMax: Age requirements as a STRING (e.g., "18-55", "до 60 років"). 
- nationalities: Array of countries (e.g., ["Україна", "Білорусь"]).
  PRIORITY RULE: If the message starts with a specific urgent call (e.g., "ПОТРЕБУЄМ 7 жінок"), this has HIGHER priority than any general template text at the end (e.g., "Стать: чоловіки, жінки, пари"). In this case, set gender to ["Жінки"] and put "7 жінок" in genderDescription.

!!! STRICT RULE: Extract age and nationality from ANY part of the text and put them ONLY in their specific fields. NEVER leave them in genderDescription.

ACCOMMODATION:
- type: "Надається (для пар)", "Надається", "Не надається", null.
- isFree: Boolean. Set to true ONLY if the text explicitly mentions "безкоштовне", "бесплатное", "0 zł", or "за рахунок роботодавця", or it is a refundable deposit. If utilities (komunalka) or any non-refundable monthly fee is mentioned, isFree must be false.
- forCouples/withChildren/withPets → true only if explicitly stated.
- details: all housing info (cost, Wi-Fi, rules).
- Do not use costRaw, write price directly in details.

SALARY:
- baseNetto: exact rate WITH currency symbol (e.g., "25 zł/god"). 
  CORRUPTION RULE: If the rate is corrupted (e.g., "˲5.12 zł"), DO NOT skip it. Try to recover the number (e.g., 25.12) or put the raw corrupted string into salaryNotes so a human can fix it. NEVER leave baseNetto empty if a rate is clearly present.
- studentNetto: if mentioned, also with currency.
- hoursRange: total hours per month (e.g., "230-260").
- bonusDetails: all bonuses in full.
- salaryNotes: advances, overtime, housing allowance, and detailed rate explanations.
- rawSalaryDisplay: STRICTLY SHORT. Only the rate range and currency. Example: "25.36 - 31.40 zł/god". NEVER put long explanations here. Put them in salaryNotes.
  !!! CRITICAL: NEVER use recruiter bonuses (e.g., "800 зл за людыну") to fill baseNetto or rawSalaryDisplay. These fields are for the WORKER'S pay only. Recruiter money goes ONLY to forRecruiter.internalNotes.
REQUIREMENTS:
- experienceRequired: true/false (check if "досвід" is mentioned as required).
- polishLanguageLevel: one of "Не вимагається", "A1", "A2", "B1", "B2", "C1".
  LANGUAGE RULE: If ANY specific language knowledge is required (e.g., Romanian, English), DO NOT set polishLanguageLevel to "Не вимагається". Set it to "A1" or higher and specify the language in languageDetails.
- documents: only from strict list; others → additionalDocsDetails.
- physicalLoad: Boolean (true if work is physically heavy/demanding, else false).

SCHEDULE:
- description: full shift schedule with times (never summarized).
- shiftsCount, hoursPerShift, workDaysWeek, breakDuration — fill if present.

EXPENSES:
- startExpenses: costs before work (medical, transfers).
- earlyTerminationLiability: costs/penalties during or on exit.
- onlyDayShifts: Boolean. 
  • TRUE ONLY IF: the schedule is guaranteed to be day-only (e.g., "08:00-16:00", "06:00-18:00", or explicitly "без нічних змін"). 
  • FALSE IF: mentions "night shift", "3 shifts", "nocki", "22:00-06:00", or if it says "1 зміна" WITHOUT specifying hours (we cannot guarantee it's not a night shift).
  • FALSE IF: no schedule information is provided.

LOCATION DESCRIPTION:
- locationDescription: full address + distance (if given).

KEYWORDS:
- 5–10 items: factory name, city (UKR/PL), brand names, job process terms.

CORE RULES:
- ZERO LOSS: never skip details.
- NO SUMMARIZATION: duties must be copied in full.
- SEMICOLON (;) between duties.
- NO INTERPRETATION: never guess numbers.
- contractType: copy exactly ("Umowa o pracę" or "Umowa zlecenie"), else null.

JSON STRUCTURE:
{
  "agencyName": null,
  "brand": "",
  "templateName": "",
  "vacancydescription": "",
  "category": "",
  "keywords": [],
  "contractType": null,
  "forRecruiter": {
    "internalNotes": "",
    "hideAgencyNameForCandidate": true,
    "hideEnterpriseNameForCandidate": true
  },
  "location": "",
  "locationDescription": "",
  "voivodeship": "",
  "country": "Polska",
  "checkInCity": "",
  "salary": {
    "baseNetto": 25.36,
    "studentNetto": 31.40,
    "baseBrutto": null,
    "currency": "PLN",
    "rawSalaryDisplay": "25.36 - 30.00 zł/god (нетто)",
    "hoursRange": "210-270",
    "payoutDates": "",
    "bonusDetails": "",
    "salaryNotes": ""
  },
  "schedule": {
    "shiftsCount": 0,
    "hoursPerShift": "",
    "workDaysWeek": "",
    "breakDuration": "",
    "canChooseShiftOnStart": false,
    "shiftChoiceDetails": "",
    "description": ""
    "onlyDayShifts": false
  },
  "accommodation": {
    "type": "",
    "forCouples": false,
    "withChildren": false,
    "withPets": false,
    "costRaw": "",
    "details": ""
  },
  "transport": {
    "provided": false,
    "costRaw": "",
    "details": ""
  },
  "employerCompensations": {
    "hasCompensations": false,
    "details": ""
  },
  "requirements": {
    "gender": ["Чоловіки", "Жінки", "Пари", "Сім'ї"],
    "genderDescription": "Тільки жінки (гаряча вакансія)",
    "age": {
      "min": 18,
      "max": 55,
      "rawText": "від 18 до 55 років"
    },
    "nationalities": ["Україна"],
    "standardDocs": ["PESEL UKR", "Віза", "Карта побуту"],
    "needsAdditionalDocs": false,
    "additionalDocsDetails": "",
    "experienceRequired": false,
    "hasEntranceTests": false,
    "entranceTestsDetails": "",
    "polishLanguageLevel": "Не вимагається",
    "languageDetails": "",
    "physicalLoad": false
  },
  "businessTrip": {
    "isBusinessTrip": false,
    "requiresPolishExperience": false,
    "requiredDocuments": [],
    "tripDetails": ""
  },
  "conditions": {
    "hasSpecificConditions": false,
    "specificNuances": [
      { "category": "Характер праці", "text": "робота зі сканером" }
    ],
    "specificConditionsDetails": "",
    "workwearFree": false,
    "foodType": "Власне",
    "foodDetails": ""
  },
  "startExpenses": {
    "hasStartExpenses": false,
    "details": ""
  },
  "earlyTerminationLiability": {
    "hasLiability": false,
    "details": ""
  },
  "description": "",
  "additionalNotes": "",
  "arrivalDate": "",
  "count": "",
  "parsingResultType": "FULL_VACANCY"
}`;

  const currentDate = new Date().toLocaleDateString('uk-UA');
    const DATE_INSTRUCTION = `\n\n!!! CRITICAL DATE RULE !!!\nToday is ${currentDate}. If you see arrival dates or start dates from the PAST (e.g., 2024 or early 2025), IGNORE them. Set arrivalDate to null if the date in text is older than today.`;
    
    // 👈 ЗМЕНА: Перадаем rawText як ёсць (масіў або радок), executeAIRequest сам вырашыць як яго апрацаваць
    const result = await executeAIRequest(SYSTEM_INSTRUCTION + DATE_INSTRUCTION, rawText, true, fullModelOnly);

    const parsedData = JSON.parse(result.data);

    const processSingle = (parsed) => {
      // --- Страхоўка лакацыі: прыбіраем дубляванне "Polska"
      if (parsed.location) {
        parsed.location = parsed.location.replace(/Polska,?\s*/gi, "").trim();
      }

      const cleaned = cleanData(parsed);

      // --- НАРМАЛІЗАЦЫЯ ВАЛЮТ (Устаўлена ўнутр вобласці бачнасці cleaned) ---
      if (cleaned && cleaned.salary && cleaned.salary.currency) {
        const c = String(cleaned.salary.currency).toUpperCase();
        if (c === "€") cleaned.salary.currency = "EUR";
        if (c === "ZŁ" || c === "ZL") cleaned.salary.currency = "PLN";
      }

      // Агенцыя: Forced → AI → Manual
      const normalizedAgency =
        forcedAgency || normalizeAgency(cleaned.agencyName);

      // Бренд
      const validatedBrand = validateBrand(cleaned.brand);

      // 1. Атрымліваем ужо гатовую лакацыю (Warszawa або Berlin (Germany))
      const displayLocation = normalizeLocation(
        cleaned.location,
        cleaned.country,
      );

      // 🛡️ ФІКС КІРЫЛІЦЫ: Калі AI ігнаруе промпт і піша "Варшава"
      let finalLocation = displayLocation;
      const hasCyrillic = /[А-ЯЁІЎа-яёіў]/.test(finalLocation);
      if (hasCyrillic) {
        const lowLoc = finalLocation.toLowerCase();
        // LOCATION_FIX_MAP у нас ужо ёсць у пачатку файла
        for (const [key, val] of Object.entries(LOCATION_FIX_MAP)) {
          if (lowLoc.includes(key)) {
            finalLocation = val;
            break;
          }
        }
      }

      // 2. Загаловак: выкарыстоўваем displayLocation
      const baseTitle = cleaned.vacancydescription || "Опис вакансії";
      const titleWithoutLocation = baseTitle.includes(" — ")
        ? baseTitle.substring(0, baseTitle.lastIndexOf(" — ")).trim()
        : baseTitle;

      const finalTitle =
        displayLocation &&
        !titleWithoutLocation
          .toLowerCase()
          .includes(displayLocation.toLowerCase())
          ? `${titleWithoutLocation} — ${displayLocation}`
          : titleWithoutLocation;

      // Транспарт: "Власний" → provided: false
      if (
        cleaned.transport?.details?.toLowerCase().includes("власн") ||
        cleaned.transport?.costRaw?.toLowerCase().includes("власн")
      ) {
        cleaned.transport.provided = false;
        cleaned.transport.details = "";
      }

      // Зарплата: дадаём валюту, калі толькі лічба
      let finalBaseNetto = cleaned.salary?.baseNetto;
      if (
        finalBaseNetto &&
        !isNaN(String(finalBaseNetto).replace(",", ".").trim())
      ) {
        const currency = cleaned.country === "Polska" ? "zł/god" : "€/год";
        finalBaseNetto = `${finalBaseNetto} ${currency}`;
      }

      // Fallback на salaryNotes
      if (
        (!finalBaseNetto || finalBaseNetto === "не вказано") &&
        cleaned.salary?.salaryNotes
      ) {
        if (
          cleaned.salary.salaryNotes.toLowerCase().includes("brutto") ||
          cleaned.salary.salaryNotes.includes("zł") ||
          cleaned.salary.salaryNotes.includes("€")
        ) {
          finalBaseNetto = cleaned.salary.salaryNotes;
        }
      }
      const rawVoiv = cleaned.voivodeship || "Польща";
      const voivParts = rawVoiv.split(",").map((p) => p.trim().toLowerCase());
      const finalVoivParts = new Set();

      voivParts.forEach((p) => {
        if (VOIVODESHIP_MAP[p]) {
          finalVoivParts.add(VOIVODESHIP_MAP[p]);
        } else {
          const matched = POLISH_VOIVODESHIPS.find(
            (pv) => pv.toLowerCase() === p,
          );
          if (matched) finalVoivParts.add(matched);
          else if (p.includes("європ"))
            finalVoivParts.add("Інші країни Європи");
        }
      });

      const finalVoivodeship =
        finalVoivParts.size > 0
          ? Array.from(finalVoivParts).sort().join(", ")
          : "Польща";
      return {
        // === 1. СИСТЕМНІ ПОЛЯ ===
        ...cleaned,
        agencyName: normalizedAgency,
        sheetName: sheetName,
        brand: validatedBrand,
        templateName: cleaned.templateName || "",
        vacancydescription: finalTitle,
        description: cleaned.description
          ? cleaned.description
              .split(/[;.]/) // Разбіваем і па кропцы, і па кропцы з коскай
              .map((s) => s.trim())
              .filter((part) => part.length > 5) // Ігнаруем занадта кароткія абрыўкі
              .join("\n• ")
          : "",
        category: cleaned.category || null,
        keywords: Array.isArray(cleaned.keywords) ? cleaned.keywords : [],
        contractType: cleaned.contractType || null,
        arrivalDate: cleaned.arrivalDate || null,
        count: cleaned.count || null,

        forRecruiter: {
          internalNotes: cleaned.forRecruiter?.internalNotes || "",
          hideAgencyNameForCandidate: true,
          hideEnterpriseNameForCandidate: true,
        },

        // === 2. ЛАКАЦЫІ І ГЕАГРАФІЯ ===
        location: finalLocation,
        locationDescription: cleaned.locationDescription || "",
        voivodeship: finalVoivodeship,
        country: cleaned.country || "Polska",
        checkInCity: cleaned.checkInCity || "",

        // === 3. ФІНАНСЫ ===
        salary: {
          baseNetto:
            Number(String(cleaned.salary?.baseNetto).replace(/[^0-9.]/g, "")) ||
            null,
          studentNetto:
            Number(
              String(cleaned.salary?.studentNetto).replace(/[^0-9.]/g, ""),
            ) || null,
          baseBrutto: Number(cleaned.salary?.baseBrutto) || null,
          currency: cleaned.salary?.currency || "PLN",
          rawSalaryDisplay:
            cleaned.salary?.rawSalaryDisplay ||
            (cleaned.salary?.baseNetto
              ? `${cleaned.salary.baseNetto} ${cleaned.salary.currency || "PLN"}`
              : ""),
          hoursRange: cleaned.salary?.hoursRange || "",
          payoutDates: cleaned.salary?.payoutDates || "",
          bonusDetails: cleaned.salary?.bonusDetails || "",
          salaryNotes: cleaned.salary?.salaryNotes || "",
        },

        // === 4. ГРАФІК ===
        schedule: {
          ...(cleaned.schedule || {}),
          shiftsCount: Number(cleaned.schedule?.shiftsCount) || 0,
          hoursPerShift: cleaned.schedule?.hoursPerShift || "",
          workDaysWeek: cleaned.schedule?.workDaysWeek || "",
          breakDuration: cleaned.schedule?.breakDuration || "",
          canChooseShiftOnStart: !!cleaned.schedule?.canChooseShiftOnStart,
          shiftChoiceDetails: cleaned.schedule?.shiftChoiceDetails || "",
          description: cleaned.schedule?.description || "",
          onlyDayShifts: !!cleaned.schedule?.onlyDayShifts, 
        },

        // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
        accommodation: {
          type: cleaned.accommodation?.type || null,
          isFree: isHousingFree(cleaned.accommodation?.type, cleaned.accommodation?.details), // 👈 ЗМЕНЕНА: цяпер не давяраем AI наўпрост, а пераправяраем праз функцыю
          forCouples: !!cleaned.accommodation?.forCouples,
          withChildren: !!cleaned.accommodation?.withChildren,
          withPets: !!cleaned.accommodation?.withPets,
          details: cleaned.accommodation?.details || "",
        },
        transport: {
          ...(cleaned.transport || {}),
          provided: !!cleaned.transport?.provided,
          costRaw: cleaned.transport?.costRaw || "",
          details: cleaned.transport?.details || "",
        },

        // === 6. КАМПЕНСАЦЫІ ===
        employerCompensations: {
          hasCompensations: !!cleaned.employerCompensations?.hasCompensations,
          details: cleaned.employerCompensations?.details || "",
        },

        // === 7. ПАТРАБАВАННІ ===
        requirements: {
          ...cleaned.requirements,
          gender: Array.isArray(cleaned.requirements?.gender)
            ? cleaned.requirements.gender
            : ["Чоловіки", "Жінки", "Пари", "Сім'ї"],
          genderDescription: cleaned.requirements?.genderDescription || "",
          age: {
            min: Number(cleaned.requirements?.age?.min) || null,
            max: Number(cleaned.requirements?.age?.max) || null,
            rawText:
              cleaned.requirements?.age?.rawText ||
              String(cleaned.requirements?.ageMax || ""),
          },
          nationalities: Array.isArray(cleaned.requirements?.nationalities)
            ? cleaned.requirements.nationalities
            : ["Україна"],
          standardDocs: Array.isArray(cleaned.requirements?.standardDocs)
            ? cleaned.requirements.standardDocs
            : [],
          needsAdditionalDocs: !!cleaned.requirements?.needsAdditionalDocs,
          additionalDocsDetails:
            cleaned.requirements?.additionalDocsDetails || "",
          experienceRequired: !!cleaned.requirements?.experienceRequired,
          hasEntranceTests: !!cleaned.requirements?.hasEntranceTests,
          entranceTestsDetails:
            cleaned.requirements?.entranceTestsDetails || "",
          polishLanguageLevel:
            cleaned.requirements?.polishLanguageLevel || "Не вимагається",
          languageDetails: cleaned.requirements?.languageDetails || "",
          physicalLoad: !!cleaned.requirements?.physicalLoad,
        },

        // === 8. АДРЫХТОЎКА Ў ЕЎРОПУ (А1) ===
        businessTrip: {
          isBusinessTrip: !!cleaned.businessTrip?.isBusinessTrip,
          requiresPolishExperience:
            !!cleaned.businessTrip?.requiresPolishExperience,
          requiredDocuments: Array.isArray(
            cleaned.businessTrip?.requiredDocuments,
          )
            ? cleaned.businessTrip.requiredDocuments
            : [],
          tripDetails: cleaned.businessTrip?.tripDetails || "",
        },

        // === 9. СПЕЦЫФІЧНЫЯ ЎМОВЫ ===
        conditions: {
          hasSpecificConditions: !!cleaned.conditions?.hasSpecificConditions,
          specificNuances: normalizeNuances(
            cleaned.conditions?.specificNuances,
          ),
          specificConditionsDetails:
            cleaned.conditions?.specificConditionsDetails || "",
          workwearFree: !!cleaned.conditions?.workwearFree,
          foodType: cleaned.conditions?.foodType || "Власне",
          foodDetails: cleaned.conditions?.foodDetails || "",
        },

        // === 10. ВЫДАТКІ І АДКАЗНАСЦЬ ===
        startExpenses: {
          hasStartExpenses: !!cleaned.startExpenses?.hasStartExpenses,
          details: cleaned.startExpenses?.details || "",
        },
        earlyTerminationLiability: {
          hasLiability: !!cleaned.earlyTerminationLiability?.hasLiability,
          details: cleaned.earlyTerminationLiability?.details || "",
        },

        description: cleaned.description || "",
        additionalNotes: cleaned.additionalNotes || "",
        isLowQuality: result.isLowQuality,
        modelUsed: result.modelUsed,
        // 👈 ФІКС: заўсёды захоўваем як радок, нават калі гэта батч-масіў
        rawText: Array.isArray(rawText) ? rawText.join("\n\n---\n\n") : rawText,
        parsingResultType: parsingResultType,
      };
    }; // Закрываем функцыю processSingle

    const finalResult = Array.isArray(parsedData)
      ? parsedData.map(processSingle)
      : processSingle(parsedData);

    // Дадаем мета-даныя да ўсяго выніку
    if (Array.isArray(finalResult)) {
      finalResult.forEach(v => v.modelUsed = result.modelUsed);
    }
    return finalResult;
  } catch (error) {
    console.error("❌ Fatal Parsing Error:", error.message);
    throw error;
  }
}

async function createTemplateFromVacancy(vacancyData) {
  try {
    console.log(`🤖 Стварэнне шаблона v2.0...`);
    
    const result = await executeAIRequest(
      CREATE_TEMPLATE_PROMPT,
      `VACANCY DATA:\n${JSON.stringify(vacancyData, null, 2)}`,
      true,
    );

    // Проста парсім гатовыя дадзеныя:
    return JSON.parse(result.data);
  } catch (error) {
    console.error("❌ Памылка стварэння шаблона:", error.message);
    return null;
  }
}

async function testConnection() {
  try {
    await executeAIRequest("Test", "Hi", false);
    return true;
  } catch {
    return false;
  }
}

async function updateVacancyWithAI(existingVacancy, newText) {
  console.log(`🤖 Абнаўленне вакансіі ${existingVacancy.vacancyCode}...`);
  const content = `CURRENT_VACANCY_JSON:\n${JSON.stringify(existingVacancy, null, 2)}\n\nNEW_MESSAGE_TEXT:\n${newText}`;
  const response = await executeAIRequest(UPDATE_VACANCY_PROMPT, content, true);
  return JSON.parse(response.data);
}
async function compareVacanciesWithAI(newData, existingData) {
  try {
    const content = `NEW:\n${JSON.stringify(newData)}\n\nEXISTING:\n${JSON.stringify(existingData)}`;
    const response = await executeAIRequest(COMPARE_VACANCIES_PROMPT, content, true);
    return JSON.parse(response.data);
  } catch (err) {
    console.error("❌ AI Comparison Error:", err.message);
    return { verdict: "NEW" }; // У выпадку памылкі лічым як новую
  }
}
module.exports = {
  parseVacancyWithAI,
  executeAIRequest,
  identifyTemplate,
  linkTemplateToVacancy,
  formatTelegramPost,
  createTemplateFromVacancy,
  testConnection,
  updateVacancyWithAI,
  mergeWithTemplate,
  normalizeAgency,
  validateBrand,
  normalizeLocation,
  normalizeNuances,
  POLISH_VOIVODESHIPS, // <--- ДАДАДЗЕНА
  VOIVODESHIP_MAP, // <--- ДАДАДЗЕНА
  COMPARE_VACANCIES_PROMPT,
  compareVacanciesWithAI,
  repairJson,
  isHousingFree,
};
