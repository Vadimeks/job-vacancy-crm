const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const { GoogleAuth } = require("google-auth-library");
const path = require("path");

// Бяром толькі з env, без хардкоду
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const LOCATION = process.env.LOCATION;

const auth = new GoogleAuth({
  // process.cwd() — гэта корань праекта на Render.
  // Гэта надзейней, чым лічыць кропкі ../..
  keyFile: path.join(process.cwd(), "google-creds.json"),
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
  { provider: "vertex", name: "gemini-2.5-flash" },
  { provider: "vertex", name: "gemini-3-flash-preview" },
  { provider: "vertex", name: "gemini-2.5-flash-lite" },
  { provider: "vertex", name: "gemini-3.1-flash-lite" },
  { provider: "groq", name: "llama-3.3-70b-versatile" },
  { provider: "groq", name: "llama-3.1-8b-instant" },
];

let chainFrozenUntil = 0; // Паўза 1 гадзіна пры адмове ўсіх мадэляў

const POLISH_VOIVODESHIPS = [
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
];
// ===== ЭТАЛОННЫЯ СПІСЫ ДЛЯ УНІФІКАЦЫІ =====
const KNOWN_AGENCIES = [
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
  "вармінсько-мазурське": "Warmińsko-mazurskie",
  великопольське: "Wielkopolskie",
  нижньосілезьке: "Dolnośląskie",
  "куявсько-поморське": "Kujawsko-pomorskie",
  люблінське: "Lubelskie",
  любуське: "Lubuskie",
  лодзинське: "Łódzkie",
  малопольське: "Małopolskie",
  мазовецьке: "Mazowieckie",
  опольське: "Opolskie",
  підкарпатське: "Podkarpackie",
  підляське: "Podlaskie",
  поморське: "Pomorskie",
  сілезьке: "Śląskie",
  свентокшиське: "Świętokrzyskie",
  західнопоморське: "Zachodniopomorskie",
  "підкарпатське воєводство": "Podkarpackie",
};

const ALLOWED_NUANCE_CATEGORIES = [
  "Тэмпературний режим",
  "Фізично-важка праця",
  "Санітарні обмеження",
  "Запахи та алергени",
  "Шум",
  "Характер праці",
  "Специфічні навички",
  "Норми",
  "Тести пры вступі",
  "Інше",
];

// Функцыя для ачысткі назвы горада ад любых краін у дужках
function normalizeLocation(location, country) {
  if (!location) return "";

  // 1. Выдаляем любыя канструкцыі ў дужках (краіны на розных мовах)
  let clean = location.replace(/\s*\([^)]+\)/gi, "").trim();

  // 2. Вызначаем эталонную назву краіны
  const normalizedCountry = country
    ? COUNTRY_MAP[country.toLowerCase()] || country
    : "Polska";

  // 3. Калі гэта не Польшча, дадаем краіну ў дужках (адзін раз)
  if (normalizedCountry !== "Polska") {
    return `${clean} (${normalizedCountry})`;
  }

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
  };

  const translated = TRANSLATION_MAP[upper] || upper;

  // Шукаем дакладнае супадзенне або ўваходжанне ў эталонны спіс
  const found = KNOWN_AGENCIES.find(
    (a) => translated === a || translated.includes(a) || a.includes(translated),
  );

  return found || translated;
}

// Функцыя валідацыі брэнда
function validateBrand(raw) {
  if (!raw) return null;
  const upper = raw.toUpperCase().trim();
  if (
    BRAND_BLACKLIST.some((b) => upper.toLowerCase().includes(b.toLowerCase()))
  )
    return null;
  if (upper.length < 2) return null;
  return upper;
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
        "99",
        99,
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

!!! CRITICAL FORMATTING RULE (COMPACT VS FULL) !!!
1. IF the vacancy has very little information (e.g., only title, city, and rate, but NO duties/description) -> Use COMPACT MODE.
   COMPACT MODE: One single paragraph. Example: "🔥 *Зварювальник — Stadtlohn (Germany)* / Ставка: 16€ / Житло: надається / Документи: будь-які. Деталі: [additionalNotes]"
2. IF the vacancy has full details -> Use FULL MODE (structured with bullets).

!!! CRITICAL COMPACTNESS RULE !!!
- If a field value is null, undefined, or empty — DO NOT include its label, emoji, or the entire line in the post.
- If an ENTIRE SECTION (Accommodation, Transport, Expenses) has no data inside, skip its header too.
- NEVER use placeholders like "немає інформації". Just skip the line.
- The post must be as compact as possible, looking like a natural text post, not a form.

!!! CRITICAL RULES !!!
- NEVER include the Agency Name.
- NEVER include internal notes or recruiter-only data.
- GEOGRAPHY: If country is NOT Polska, show it in parentheses ONCE. Example: "Stadtlohn (Germany)". NEVER "Stadtlohn (Germany) (Germany)".
- TRANSPORT RULE:
   • If transport is NOT provided → "🚌 Довіз: немає"
   • If transport IS provided → "🚌 Довіз: надається" + details
   • NEVER show "Власний" as transport value
- ACCOMMODATION: If costRaw is present, show it! Example: "🏠 Проживання: Надається (450 €/міс)".
- LANGUAGE: If requirements.languageDetails is present, show it in the Requirements block.
- COMPACTNESS: If a section is empty, skip it. No placeholders like "немає інформацыі".
TITLE RULE:
- vacancydescription must be formatted as "Job Essence (Category) — Location".
- Location = place of work, not checkInCity.

FULL MODE STRUCTURE (skip empty lines/sections):

*[vacancydescription]*

📍 Місто: [location][(country if not Polska)]
[• Оформлення: м. [checkInCity]]
[👥 Набір: [requirements.gender joined by ", "]]
[• Приїзд: [arrivalDate]]

💰 *Оплата праці*
• Ставка: [salary.baseNetto]
[• Годин на місяць: [salary.hoursRange]]
[• Студенти: [salary.studentNetto]]
[• Виплати: [salary.payoutDates]]
[• Бонуси: [salary.bonusDetails]]
[• Деталі: [salary.salaryNotes]]

🛠 *Характер роботи*
[description items with •]

📋 *Вимоги*
[• Досвід роботи: [requirements.experienceRequired ? "Обов'язковий" : "Не вимагається"]]
[• Вік: до [requirements.ageMax] років (only if < 65)]
• Документи: [requirements.standardDocs]
• Мова: [requirements.polishLanguageLevel]
[• Фізичне навантаження: [requirements.physicalLoad]]

🕒 *Графік роботи :* [schedule.description]

[• Перерва: [schedule.breakDuration]]

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
[• Нюанси: [conditions.specificNuances joined by "; "]]
[• Деталі: [conditions.foodDetails]]

📝 *Додаткова інформація*
[additionalNotes including навчання, адаптація, вихід на норму, координатор, банківський рахунок, карта побуту, можливість роботи в інших країнах, організаваны трансфер з Украіны]
`;

const CREATE_TEMPLATE_PROMPT = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: Create a reusable job template from a parsed vacancy JSON.
${LANGUAGE_GUARD}
The template should:
1. Extract the BRAND/COMPANY name from templateName or description
2. Generate a short descriptive templateName: "[Brand] [City] - [Short job description]"
   Example: "Aurora Kąty Wrocławskie - Склад одягу та аксесуарів"
3. Generate keywords array (5-10 items): brand name, location, key job terms in Ukrainian, Polish and Russian variants
4. Map ALL fields to Structure v2.0
5. Set agencyName to the value from vacancy UPPERCASE, or "Unknown" if not specified

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

Return ONLY valid JSON with the complete merged result using FULL structure v2.0.
IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
`;
const UPDATE_VACANCY_PROMPT = `
ROLE: Professional HR Dispatcher.
TASK: Update an EXISTING job vacancy (JSON v2.0) with information from a NEW message.
${LANGUAGE_GUARD}

CRITICAL RULES FOR UPDATE:
1. If the message mentions housing cost (e.g., "450€", "15€/доба") -> update accommodation.costRaw and accommodation.details.
2. If the message says "STOP", "closed", "зібрана", "не актуально" -> set status to "closed".
3. KEEP ALL OTHER FIELDS: If a field (like agencyName, brand, or description) is NOT mentioned in the new message, you MUST keep the value from CURRENT_VACANCY_JSON. NEVER reset them to null.
4. DO NOT change vacancyCode or _id.
5. If new requirements appear (e.g., "English language") -> update requirements.languageDetails.

Return ONLY valid JSON.
`;
// --- ДАПАМОЖНЫЯ ФУНКЦЫІ ---
// ============================================================
async function executeAIRequest(systemPrompt, userContent, jsonMode = true) {
  const safeContent = String(userContent).substring(0, 8000);

  if (Date.now() < chainFrozenUntil) {
    const diff = Math.ceil((chainFrozenUntil - Date.now()) / 60000);
    throw new Error(`AI_COOLDOWN: Паўза яшчэ ${diff} хв.`);
  }

  for (const model of AI_CHAIN) {
    try {
      // --- VERTEX AI ---
      if (model.provider === "vertex") {
        console.log(`🤖 Запыт да Vertex AI: ${model.name}`);
        const token = await getAccessToken();
        if (!token) throw new Error("Токен адсутнічае");

        const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model.name}:streamGenerateContent`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\n${safeContent}` }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: jsonMode ? "application/json" : "text/plain",
            },
          }),
        });

        const data = await response.json();
        if (data.error || (Array.isArray(data) && data[0]?.error)) {
          throw new Error(data.error?.message || data[0]?.error?.message);
        }

        const chunks = Array.isArray(data) ? data : [data];
        let fullText = "";
        for (const chunk of chunks) {
          const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunkText) fullText += chunkText;
        }

        if (fullText) return fullText.replace(/```json|```/g, "").trim();
      }

      // --- GROQ ---
      if (model.provider === "groq") {
        console.log(`🤖 Запыт да Groq: ${model.name}`);
        const groqParams = {
          model: model.name,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: safeContent },
          ],
          temperature: 0.1,
        };
        if (jsonMode) groqParams.response_format = { type: "json_object" };

        const response = await groq.chat.completions.create(groqParams);
        let text = response.choices[0]?.message?.content?.trim();

        if (text) {
          // Чыстка без рэгулярак (каб не глючыў інтэрфейс)
          let cleanText = text.trim();
          if (cleanText.startsWith("```")) {
            cleanText = cleanText.split("\n").slice(1).join("\n");
          }
          if (cleanText.endsWith("```")) {
            cleanText = cleanText.split("```")[0];
          }
          return cleanText.trim();
        }
      }
    } catch (error) {
      console.error(
        `⚠️ Error (${model.name}):`,
        error.message.substring(0, 150),
      );
    }
  }

  chainFrozenUntil = Date.now() + 60 * 60 * 1000;
  throw new Error("ALL_AI_MODELS_FAILED");
}

async function mergeWithTemplate(rawText, template) {
  try {
    console.log(`🤖 Мерж шаблона "${template.templateName}"...`);
    const content = `TEMPLATE:\n${JSON.stringify(template, null, 2)}\n\nMESSAGE:\n${rawText}`;
    const text = await executeAIRequest(MERGE_PROMPT, content, true);

    let cleanJson = text
      .trim()
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    const merged = JSON.parse(cleanJson);
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
    const responseText = await executeAIRequest(IDENTIFY_PROMPT, content, true);
    const parsed = JSON.parse(responseText);

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
  console.log(`🤖 Форматаванне Telegram-посту...`);
  const text = await executeAIRequest(
    FORMAT_PROMPT,
    `DATA:\n${JSON.stringify(vacancyData, null, 2)}`,
    false,
  );
  return text.trim();
}
function normalizeNuances(nuances) {
  if (!Array.isArray(nuances)) return [];
  return nuances
    .map((n) => {
      const category = ALLOWED_NUANCE_CATEGORIES.find((cat) =>
        n.startsWith(cat),
      );
      return category ? n : null;
    })
    .filter(Boolean);
}

async function parseVacancyWithAI(rawText, forcedAgency = null) {
  try {
    console.log(
      `🤖 Парсінг v2.0 ... ${forcedAgency ? `(Forced Agency: ${forcedAgency})` : ""}`,
    );

    const SYSTEM_INSTRUCTION = `
ROLE: Professional automated job vacancy parser (v2.3).
TASK: Convert job vacancy text into a JSON object with EXACTLY this structure. Fill every field based on the text. Do not invent field names.

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
- Format: "Category (detail)".
- Categories (USE ONLY THESE 10):
  1. "Тэмпературний режим" (e.g., +5°C, холодний цех, спека)
  2. "Фізично-важка праця" (e.g., підняття ваги >15кг, робота з великими деталями)
  3. "Санітарні обмеження" (e.g., без манікюру, без біжутерії, без вій)
  4. "Запахи та алергени" (e.g., запах гуми, фарби, пил, клей)
  5. "Шум" (e.g., робота в берушах, шумні станки)
  6. "Характер праці" (e.g., 100% стоячи, робота на колінах, сидяча робота, робота са сканером)
  7. "Специфічні навички" (e.g., знання креслень, робота з ножам, пневмоінструмент)
  8. "Норми" (e.g., робота на акорд, високий темп, виконання плану)
  9. "Тести пры вступі" (e.g., мануальні тести, матэматыка, праверка зроку)
  10. "Інше" (anything else specific)

GEOGRAPHY RULES:
- location: first city mentioned; Polish spelling only (Warszawa, Kraków, Polkowice).
- checkInCity: registration/оформлення city.
- country: default Polska; if not Poland → English name.
- voivodeship: if Poland → exact voivodeship; else "Європа (інші країни)".
- International: city + country in parentheses (e.g., "Droßdorf (Germany)").
- STRICT: never Cyrillic for cities; never include "Polska" in location.
- STRICT LOCATION VALIDATION:
  • location = actual place of work.
  • checkInCity = registration/arrival city.
  • If the raw text contains a misspelled location (e.g., "Elena Gura"), automatically replace it with the correct Polish name ("Zielona Góra").
  • Always use Polish spelling (Latin alphabet).
  • If the location is not clearly specified, keep it as-is but add a note in additionalNotes for manual verification.

PRIVACY & FORMATTING:
- agencyName: recruitment agency only. 
  • STRICT RULE: Choose ONLY from this list: [APOLO, BISAR, EST, EWL, FWS, GLOBAL, INTRASERVICE, KONO, MANPOWER, MRÓWKI, NIDEN, OTTO, PERSONEL SERVICE, PROGRES, RALEN, SG, SOLANO, STAFF POWER, MANUAL].
  • TRANSLATION RULE: If the agency name is in Cyrillic, TRANSLATE it to the Latin equivalent from the list above (e.g., "Прогрес" -> "PROGRES", "Коно" -> "KONO").
  • If no match from the list is found -> output null.
- brand: Extract ONLY the exact factory/brand name in Polish or Latin script (e.g., "Amazon", "CCC").
  • STRICT: If no clear brand name is mentioned -> null.
- templateName: brand + city (Polish spelling).
- vacancydescription: PUBLIC TITLE in Ukrainian.
  • Format: "Job Essence (Category) — Location".
  • Examples: "Склад товарів (Логістика) — Warszawa", "Виробництво деталей (Автопром) — Grójec".
  • STRICT: Location = place of work, not checkInCity.
  • STRICT: Do NOT include brand/agency names.
  • STRICT: If goods type not explicitly mentioned → generic "Склад (Логістика)".

CATEGORY:
One of:
"Склади та логістика", "Харчова промисловість", "Автомобільна промисловість",
"Виробництво та промисловість", "Будівництво", "Сільське господарство",
"Торгівля та послуги", "Різне".

DESCRIPTION & NOTES:
- description: ONLY duties; full detail; separated by ;.
- additionalNotes: everything else (recruitment, transport, videos, contract details, client brand names, навчання/вихід на норму, кількість людей у цеху).
- No duplication: if info already in structured fields → don’t repeat.

CONDITIONS:
- specificNuances: array of "Category (detail)".
- foodType: "Власне", "Обіди", "Субсидоване".
- workwearFree: if mentioned.

ACCOMMODATION:
- type: "Надається (для пар)", "Надається", "Не надається", null.
- forCouples/withChildren/withPets → true only if explicitly stated.
- details: all housing info (cost, Wi-Fi, rules).
- Do not use costRaw, write price directly in details.

SALARY:
- baseNetto: exact rate WITH currency symbol (e.g., "25 zł/god", "16 €/h"). NEVER return just a number.
- studentNetto: if mentioned, also with currency.
- hoursRange: total hours per month (e.g., "230-260").
- bonusDetails: all bonuses in full.
- salaryNotes: advances, overtime, housing allowance.

REQUIREMENTS:
- experienceRequired: true/false (check if "досвід" is mentioned as required).
- polishLanguageLevel: one of "Не вимагається", "A1", "A2", "B1", "B2", "C1".
- documents: only from strict list; others → additionalDocsDetails.

SCHEDULE:
- description: full shift schedule with times (never summarized).
- shiftsCount, hoursPerShift, workDaysWeek, breakDuration — fill if present.

EXPENSES:
- startExpenses: costs before work (medical, transfers).
- earlyTerminationLiability: costs/penalties during or on exit.

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
    "baseNetto": "",
    "studentNetto": "",
    "hoursRange": "",
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
    "gender": [],
    "ageMax": null,
    "nationalities": ["Україна"],
    "standardDocs": ["PESEL UKR", "Віза", "Карта побуту"],
    "needsAdditionalDocs": false,
    "additionalDocsDetails": "",
    "experienceRequired": false,
    "hasEntranceTests": false,
    "entranceTestsDetails": "",
    "polishLanguageLevel": "Не вимагається",
    "languageDetails": "",
    "physicalLoad": ""
  },
  "businessTrip": {
    "isBusinessTrip": false,
    "requiresPolishExperience": false,
    "requiredDocuments": [],
    "tripDetails": ""
  },
  "conditions": {
    "hasSpecificConditions": false,
    "specificNuances": [],
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
  "count": ""
}`;

    const text = await executeAIRequest(SYSTEM_INSTRUCTION, rawText, true);
    const cleanText = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const parsedData = JSON.parse(cleanText);

    const processSingle = (parsed) => {
      // --- Страхоўка лакацыі: прыбіраем дубляванне "Polska"
      if (parsed.location) {
        parsed.location = parsed.location.replace(/Polska,?\s*/gi, "").trim();
      }

      const cleaned = cleanData(parsed);

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
      const vLower = cleaned.voivodeship?.toLowerCase().trim();
      const finalVoivodeship =
        VOIVODESHIP_MAP[vLower] || cleaned.voivodeship || "Польща";
      return {
        // === 1. СИСТЕМНІ ПОЛЯ ===
        ...cleaned,
        agencyName: normalizedAgency,
        brand: validatedBrand,
        templateName: cleaned.templateName || "",
        vacancydescription: finalTitle,
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
        location: displayLocation,
        locationDescription: cleaned.locationDescription || "",
        voivodeship: finalVoivodeship,
        country: cleaned.country || "Polska",
        checkInCity: cleaned.checkInCity || "",

        // === 3. ФІНАНСЫ ===
        salary: {
          ...(cleaned.salary || {}),
          baseNetto: finalBaseNetto || null,
          studentNetto: cleaned.salary?.studentNetto || "",
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
        },

        // === 5. ПРАЖЫВАННЕ І ТРАНСПАРТ ===
        accommodation: {
          type: cleaned.accommodation?.type || null,
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
            : ["Чоловіки", "Жінки"],
          ageMax: cleaned.requirements?.ageMax || null,
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
          physicalLoad: cleaned.requirements?.physicalLoad || "",
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
        rawText: rawText,
        parsingResultType: parsed.parsingResultType || "FULL_VACANCY",
      };
    }; // Закрываем функцыю processSingle

    return Array.isArray(parsedData)
      ? parsedData.map(processSingle)
      : processSingle(parsedData);
  } catch (error) {
    console.error("❌ Fatal Parsing Error:", error.message);
    throw error;
  }
}

async function createTemplateFromVacancy(vacancyData) {
  try {
    console.log(`🤖 Стварэнне шаблона v2.0...`);
    const text = await executeAIRequest(
      CREATE_TEMPLATE_PROMPT,
      `VACANCY DATA:\n${JSON.stringify(vacancyData, null, 2)}`,
      true,
    );
    let cleanJson = text
      .trim()
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];
    return JSON.parse(cleanJson);
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
  const responseText = await executeAIRequest(
    UPDATE_VACANCY_PROMPT,
    content,
    true,
  );
  let cleanJson = responseText
    .trim()
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "");
  return JSON.parse(cleanJson);
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
  normalizeNuances, // <--- ДАДАДЗЕНА
  VOIVODESHIP_MAP, // <--- ДАДАДЗЕНА
};
