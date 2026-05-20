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

// Функцыя для ачысткі назвы горада ад любых краін у дужках
function normalizeLocation(location, country) {
  if (!location) return "";
  // 1. Выдаляем УСЕ дужкі і тое, што ў іх (прыбіраем старыя краіны)
  let clean = location.replace(/\s*\([^)]+\)/gi, "").trim();

  // 2. Прыбіраем дублікаты гарадоў, калі яны ідуць праз коску (напр. "Warszawa, Warszawa")
  if (clean.includes(",")) {
    clean = [...new Set(clean.split(",").map((s) => s.trim()))].join(", ");
  }

  // 3. Вызначаем эталонную назву краіны
  const normalizedCountry = country
    ? COUNTRY_MAP[country.toLowerCase()] || country
    : "Polska";

  // 4. Дадаем краіну толькі калі гэта не Польшча
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
  const found = KNOWN_AGENCIES.find(
    (a) => translated === a || translated.includes(a) || a.includes(translated),
  );

  return found || "MANUAL";
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

!!! CRITICAL MODE SELECTION !!!
- Use COMPACT MODE if the total length of the vacancy information (rawText) is less than 700 characters.
- Use FULL MODE if the total length is 700 characters or more.

!!! CRITICAL COMPACTNESS RULE !!!
- If a field value is null, undefined, or empty — DO NOT include its label, emoji, or the entire line in the post.
- If an ENTIRE SECTION (Accommodation, Transport, Expenses) has no data inside, skip its header too.
- NEVER use placeholders like "немає інформації". Just skip the line.
- The post must be as compact as possible, looking like a natural text post, not a form.

!!! CRITICAL RULES !!!
- NEVER include Agency Name, internalNotes, or parsingResultType.
- NEVER include genderDescription (it is for internal use only).
- If a field is null, empty, or "Не вимагається" (for experience), skip the entire line.
- Use Ukrainian for all labels.
- NEVER include technical info like "KRAZ", "nr certyfikatu", or "Oferta pracy tymczasowej".

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
`;

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
// --- ДАПАМОЖНЫЯ ФУНКЦЫІ ---
// ============================================================
async function executeAIRequest(systemPrompt, userContent, jsonMode = true) {
  const safeContent = String(userContent).substring(0, 8000);

  if (Date.now() < chainFrozenUntil) {
    const diff = Math.ceil((chainFrozenUntil - Date.now()) / 60000);
    throw new Error(`AI_COOLDOWN: Паўза яшчэ ${diff} хв.`);
  }

  for (const model of AI_CHAIN) {
    let retries = 2; // Колькасць спроб для кожнай мадэлі пры памылках 5xx

    while (retries >= 0) {
      try {
        // --- VERTEX AI ---
        if (model.provider === "vertex") {
          console.log(
            `🤖 Запыт да Vertex AI: ${model.name} (Спроб засталося: ${retries})`,
          );
          const token = await getAccessToken();
          if (!token) throw new Error("Токен адсутнічае");

          const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model.name}:streamGenerateContent`;

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 секунд таймаўт

          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
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

          clearTimeout(timeoutId);

          if (response.status >= 500) {
            throw new Error(`SERVER_ERROR_${response.status}`);
          }

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
          if (text) return text.replace(/```json|```/g, "").trim();
        }

        break; // Калі паспяхова — выходзім з цыкла спроб (while)
      } catch (error) {
        const isNetworkError =
          error.name === "AbortError" || error.message.includes("SERVER_ERROR");

        if (isNetworkError && retries > 0) {
          console.warn(
            `⚠️ Часовая памылка (${model.name}), паўтор праз 2 сек...`,
          );
          retries--;
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        console.error(
          `⚠️ Error (${model.name}):`,
          error.message.substring(0, 150),
        );
        break; // Пераходзім да наступнай мадэлі ў AI_CHAIN
      }
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

  // 🛡️ Technical Privacy Shield
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

  const text = await executeAIRequest(
    FORMAT_PROMPT,
    `DATA:\n${JSON.stringify(publicData, null, 2)}`,
    false,
  );

  if (!text || text.startsWith("{") || text.length < 50) {
    throw new Error("AI returned invalid format for Telegram post");
  }

  return text.trim();
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

async function parseVacancyWithAI(
  rawText,
  forcedAgency = null,
  parsingResultType = "FULL_VACANCY",
) {
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
- location: actual place of work. Polish spelling only (Warszawa, Kraków).
- MULTI-CITY RULE: If the text lists multiple cities for the SAME job description (e.g., Biedronka: Pasym, Ryn, Pisz), DO NOT split into fragments. Instead, list ALL cities in the 'location' field separated by commas (e.g., "Pasym, Ryn, Pisz").
- checkInCity: registration/оформлення city.
- country: default Polska; if not Poland → English name.
- voivodeship: if Poland → exact voivodeship; else "Європа (інші країни)".
- International: city + country in parentheses (e.g., "Droßdorf (Germany)").
- STRICT: never Cyrillic for cities; never include "Polska" in location.

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
        location: displayLocation,
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
            cleaned.salary?.rawSalaryDisplay || cleaned.salary?.baseNetto || "",
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
            : ["Чоловіки", "Жінки", "Пари", "Сім'ї"],
          genderDescription: cleaned.requirements?.genderDescription || "",
          age: {
            min: Number(cleaned.requirements?.age?.min) || 18,
            max: Number(cleaned.requirements?.age?.max) || 60,
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
        rawText: rawText,
        parsingResultType: parsingResultType,
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
