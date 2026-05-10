// ============================================================
// БЛОК 1: ЗАМЯНІЦЬ ІМПАРТЫ І AI_CHAIN (самы пачатак файла)
// Замяніць: const groq = new Groq(...) і const MODEL_SMART/MODEL_FAST
// ============================================================

const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Адзіны ланцужок мадэляў: Gemini (Tier 1) → Groq (фолбэк)
const AI_CHAIN = [
  { provider: "gemini", name: "gemini-2.0-flash" },
  { provider: "gemini", name: "gemini-2.0-flash-lite" },
  { provider: "gemini", name: "gemini-2.5-flash" },
  { provider: "gemini", name: "gemini-2.5-flash-lite" },
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
  "FWS",
  "GLOBAL",
  "INTRASERVICE",
  "MANPOWER",
  "MANUAL",
  "MRÓWKI",
  "NIDEN",
  "OTTO",
  "PROGRES",
  "SG",
  "SOLANO",
  "STAFF POWER", // 🆕
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

// Функцыя нармалізацыі агенцыі
function normalizeAgency(raw) {
  if (!raw) return "MANUAL";
  const upper = raw.toUpperCase().trim();
  if (KNOWN_AGENCIES.includes(upper)) return upper;
  const found = KNOWN_AGENCIES.find(
    (a) => upper.includes(a) || a.includes(upper),
  );
  return found || upper;
}

// Функцыя валідацыі брэнда
function validateBrand(raw) {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  if (BRAND_BLACKLIST.some((b) => lower.includes(b))) return null;
  if (raw.trim().length < 2) return null;
  return raw.trim();
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
TASK: Format the job data into a beautiful Telegram post in UKRAINIAN.

!!! CRITICAL COMPACTNESS RULE !!!: 
1. IF a field value is null, undefined, or empty — DO NOT include its label, emoji, or the entire line in the post. NO EMPTY LABELS like "🕒 Графік роботи: ".
2. If an ENTIRE SECTION (Accommodation, Transport, Expenses) has no data inside, skip its header too.
3. NEVER use placeholders like "немає інформації". Just skip the line.
4. The post must be as compact as possible, looking like a natural text post, not a form.
5. TRANSPORT RULE: 
   - If transport is NOT provided → show: "🚌 Довіз: немає"
   - If transport IS provided → show: "🚌 Довіз: надається" + details (corporate buses, local routes).
   - NEVER show "Власний" as transport value.
   - Організаваны трансфер з Украіны (напрыклад, са Львова) → завсёды ў *Додаткову інформацію*, не ў блок транспарту.

CRITICAL PRIVACY RULE:
- NEVER include the Agency Name (agencyName).
- NEVER include internal notes or recruiter-only data.
- Use vacancydescription as the main title.

TITLE RULE:
- vacancydescription must be formatted as "Job Essence (Category) — Location".
- Location = place of work, not checkInCity.

Use this structure (SKIP lines/sections if data is null):

*[vacancydescription]*
📍 Місто: [location][(country if not Polska)]
[• Оформлення: м. [checkInCity]]
[👥 Набір: [requirements.gender joined by ", "]]
[• Приїзд: [arrivalDate]]

[💰 *Оплата праці*
• Ставка: [salary.baseNetto]
• Студенти: [salary.studentNetto]
• Виплати: [salary.payoutDates]
• Бонуси: [salary.bonusDetails]
• Нотатки: [salary.salaryNotes]
]

[🛠 *Характер роботи*
[пункти з description через •]]

[📋 *Вимоги*
• Вік: до [requirements.ageMax] років (only if < 65)
• Документи: [requirements.standardDocs]
• Мова: [requirements.polishLanguageLevel]
• [requirements.physicalLoad]
]

[🕒 *Графік роботи*
[schedule.description]
• Перерва: [schedule.breakDuration]
]

[📄 Тип договору: [contractType]]

[🏠 *Проживання*
🏠 Проживання: [accommodation.type]
• Можна з дітьми: Так (only if withChildren is true)
• Можна з тваринами: Так (only if withPets is true)
• Деталі: [accommodation.details]
]

[🚌 *Транспорт*
🚌 Довіз: [transport.provided ? "надається" : "немає"]
• [transport.details]
]

[💸 *Витрати та відповідальність*
• На старті: [startExpenses.details] (only if це стосується роботи, напр. медогляд)
• При передчасному звільненні: [earlyTerminationLiability.details]
]

[🌡 *Умови праці*
• Робочий одяг: [conditions.workwearFree ? "Безкоштовно" : "За рахунок працівника"]
• Харчування: [conditions.foodType]
• Нюанси: [conditions.specificNuances]
• [conditions.foodDetails]
]

[📝 *Додаткова інформація*
[additionalNotes including навчання, адаптація, вихід на норму, координатор, банківський рахунок, карта побуту, можливість роботи в інших країнах, організаваны трансфер з Украіны]]
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

// --- ДАПАМОЖНЫЯ ФУНКЦЫІ ---
// ============================================================

async function executeAIRequest(systemPrompt, userContent, jsonMode = true) {
  // Абмяжоўваем уваход, каб не было памылкі 413
  const safeContent = String(userContent).substring(0, 6000);

  if (Date.now() < chainFrozenUntil) {
    const diff = Math.ceil((chainFrozenUntil - Date.now()) / 60000);
    throw new Error(`AI_COOLDOWN: Паўза яшчэ ${diff} хв.`);
  }

  for (const model of AI_CHAIN) {
    try {
      console.log(
        `🤖 AI Спроба: ${model.provider.toUpperCase()} (${model.name})...`,
      );

      if (model.provider === "gemini") {
        const genModel = genAI.getGenerativeModel(
          { model: model.name },
          { apiVersion: "v1beta" },
        );

        // 👇 Выкарыстоўваем safeContent
        const fullPrompt = `${systemPrompt}\n\nInput text to process:\n${safeContent}`;
        const result = await genModel.generateContent(fullPrompt);

        const response = await result.response;
        const text = response
          .text()
          .replace(/```json|```/g, "")
          .trim();
        if (text) return text;
      } else {
        // Groq
        const response = await groq.chat.completions.create({
          model: model.name,
          temperature: 0.1,
          max_tokens: 8000,
          response_format: jsonMode ? { type: "json_object" } : undefined,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: safeContent }, // 👈 Выкарыстоўваем safeContent
          ],
        });
        const text = response.choices[0]?.message?.content;
        if (text) return text;
      }
    } catch (err) {
      console.warn(
        `⚠️ ${model.name} адмовіла: ${err.message?.substring(0, 100)}`,
      );
      continue;
    }
  }

  chainFrozenUntil = Date.now() + 60 * 60 * 1000;
  throw new Error("ALL_AI_MODELS_FAILED");
}

// ============================================================
// БЛОК 3: mergeWithTemplate

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

// ============================================================
// БЛОК 4: ЗАМЯНІЦЬ formatTelegramPost
// ============================================================

async function formatTelegramPost(vacancyData) {
  console.log(`🤖 Форматаванне Telegram-посту...`);
  const text = await executeAIRequest(
    FORMAT_PROMPT,
    `DATA:\n${JSON.stringify(vacancyData, null, 2)}`,
    false,
  );
  return text.trim();
}

async function parseVacancyWithAI(rawText) {
  try {
    console.log(`🤖 Парсінг v2.0 ...`);

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
- Array of "Category (detail)".
- Categories: "Температурний режим", "Запахи", "Фізичне навантаження", "Характер праці", "Санітарні обмеження", "Інше".
- Example: ["Температурний режим (+5°C)", "Санітарні обмеження (без манікюру)"].

GEOGRAPHY RULES:
- location: first city mentioned; Polish spelling only (Warszawa, Kraków, Polkowice).
- checkInCity: registration/оформлення city.
- country: default Polska; if not Poland → English name.
- voivodeship: if Poland → exact voivodeship; else "Європа (інші країни)".
- International: city + country in parentheses (e.g., "Droßdorf (Germany)").
- STRICT: never Cyrillic for cities; never include "Polska" in location.

PRIVACY & FORMATTING:
- agencyName: recruitment agency only (else null).
- brand: Extract ONLY the exact factory/brand name in Polish or Latin (English) script.
  • Examples: "Amazon", "CCC", "Faurecia", "LPP".
  • STRICT: Do NOT output descriptions like "світовий лідер", "птахофабрика", "велика компанія".
  • STRICT: If no clear brand name is mentioned → null.
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
- baseNetto: exact rate (never empty if mentioned).
- studentNetto: if mentioned.
- bonusDetails: all bonuses in full.
- salaryNotes: advances, overtime, housing allowance.
- payoutDates: if mentioned.

REQUIREMENTS:
- polishLanguageLevel: one of "Не вимагається", "A1", "A2", "B1", "B2", "C1".
- documents: only from strict list; others → additionalDocsDetails.
- gender, ageMax, nationalities, physicalLoad — fill if present.

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
    const parsedData = JSON.parse(text);
    // Ствараем функцыю-абгортку для твайго існуючага коду
    const processSingle = (parsed) => {
      // --- ПОСТ-АПРАЦОЎКА (Страхоўка) ---
      if (parsed.location) {
        parsed.location = parsed.location.replace(/Polska,?\s*/gi, "").trim();
      }

      const cleaned = cleanData(parsed);

      // ===== УНІФІКАЦЫЯ ПАСЛЯ AI =====
      const normalizedAgency = normalizeAgency(cleaned.agencyName);
      const validatedBrand = validateBrand(cleaned.brand);

      // 2. Лагічны загаловак (улічваем краіну)
      const baseTitle =
        cleaned.vacancydescription &&
        cleaned.vacancydescription !== "Нова вакансія"
          ? cleaned.vacancydescription
          : "Опис вакансії";

      // Фармуем прыгожую лакацыю: "Psary" або "Machecoul (France)"
      const displayLocation =
        cleaned.country && cleaned.country !== "Polska"
          ? `${cleaned.location} (${cleaned.country})`
          : cleaned.location;

      // Фінальны загаловак: "Склад адзення — Psary"
      const finalTitle =
        displayLocation &&
        !baseTitle.toLowerCase().includes(displayLocation.toLowerCase())
          ? `${baseTitle} — ${displayLocation}`
          : baseTitle;

      // 2. Страхоўка зарплаты
      let finalBaseNetto = cleaned.salary?.baseNetto;
      if (
        (!finalBaseNetto || finalBaseNetto === "не вказано") &&
        cleaned.salary?.salaryNotes
      ) {
        if (
          cleaned.salary.salaryNotes.toLowerCase().includes("brutto") ||
          cleaned.salary.salaryNotes.includes("zł")
        ) {
          finalBaseNetto = cleaned.salary.salaryNotes;
        }
      }

      return {
        // === 1. СИСТЕМНІ ПОЛЯ ===
        ...cleaned,
        agencyName: normalizedAgency, // 👈 Цяпер нармалізацыя працуе!
        brand: validatedBrand, // 👈 Цяпер брэнды чыстыя!
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
        location: cleaned.location || "",
        locationDescription: cleaned.locationDescription || "",
        voivodeship: cleaned.voivodeship || "Польща",
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
          specificNuances: Array.isArray(cleaned.conditions?.specificNuances)
            ? cleaned.conditions.specificNuances
            : [],
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
const UPDATE_VACANCY_PROMPT = `
ROLE: Professional HR Dispatcher.
TASK: Update an EXISTING job vacancy (JSON v2.0) with information from a NEW message.
${LANGUAGE_GUARD}
Rules:
1. If the message says "STOP", "closed", "зібрана", "не актуально", "набір закрито" -> set status to "closed".
2. If the message mentions a new salary/rate -> update salary.baseNetto and other salary fields.
3. If the message mentions a new arrival date -> update arrivalDate.
4. If the message mentions a change in requirements (gender, age) -> update requirements.
5. If the message contains new details -> append them to additionalNotes or update specific fields.
6. KEEP all other fields from the original JSON exactly as they are.
7. Do NOT change vacancyCode, _id, or agencyName.

Return ONLY valid JSON with the full updated structure v2.0.
`;

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
};
