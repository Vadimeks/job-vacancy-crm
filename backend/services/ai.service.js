const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

function cleanData(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanData);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (value === "string" || value === "undefined") return [key, ""];
        if (key === "ageMax" && (value === null || value === 0 || value === ""))
          return [key, 99];
        return [key, cleanData(value)];
      }),
    );
  }
  return obj;
}

// --- PROMPTS ---

const IDENTIFY_PROMPT = `
ROLE: HR Dispatcher assistant.
TASK: Identify which template this job vacancy message belongs to.

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

// FIX: FORMAT_PROMPT тепер використовує правильні шляхи до полів v2.0
const FORMAT_PROMPT = `
ROLE: Professional HR content formatter.
TASK: Format the job data into a beautiful Telegram post in UKRAINIAN.

CRITICAL PRIVACY RULE: 
- NEVER include the Agency Name (agencyName) in the post.
- NEVER include internal notes or recruiter-only data.
- Use vacancydescription as the main title (NEVER use templateName here).

Use this EXACT structure (skip entire blocks if ALL data inside is empty/null):

*[vacancydescription]*
📍 Місто: [location] 
[• Оформлення: м. [checkInCity] — тільки якщо checkInCity не пусте]
👥 Набір: [requirements.gender joined by ", "][, приїзд [arrivalDate] — тільки якщо arrivalDate не пусте]

💰 *Оплата праці*
• Ставка: [salary.baseNetto]
[• Студенти: [salary.studentNetto] — тільки якщо не пусте]
[• Годин на місяць: [salary.hoursRange] — тільки якщо не пусте]
[• Виплати: [salary.payoutDates] — тільки якщо не пусте]
[salary.bonusDetails — якщо не пусте, вивести окремим рядком]
[salary.salaryNotes — якщо не пусте, вивести окремим рядком]

🛠 *Характер роботи*
[кожен пункт з description, розбитий по крапці з комою, на новому рядку з •]

📋 *Вимоги*
[• Вік: до [requirements.ageMax] років — тільки якщо ageMax не пусте]
• Документи: [requirements.standardDocs joined by ", "]
• Мова: [requirements.polishLanguageLevel]
[• [requirements.physicalLoad] — тільки якщо не пусте]

🕒 *Графік роботи*
[schedule.description — якщо не пусте]
[schedule.workDaysWeek — тільки якщо НЕ міститься вже у schedule.description]
[• Перерва: [schedule.breakDuration] — тільки якщо не пусте]

📄 Тип договору: [contractType]

🏠 *Проживання*
Тип: [accommodation.type]
[accommodation.costRaw — якщо не пусте]
[accommodation.details — якщо не пусте]

🚌 *Транспорт*
[transport.costRaw — якщо не пусте][, transport.details — якщо не пусте]

[💸 *Витрати та відповідальність*
[• На старті: [startExpenses.details] — якщо hasStartExpenses = true]
[• При передчасному звільненні: [earlyTerminationLiability.details] — якщо hasLiability = true]
Весь блок 💸 виводити ТІЛЬКИ якщо hasStartExpenses = true АБО hasLiability = true. Якщо обидва false — пропустити блок повністю.]

🌡 *Умови праці*
• Робочий одяг: [conditions.workwearFree ? "Безкоштовно" : "За рахунок працівника"]
• Харчування: [conditions.foodType]
[• Нюанси: [conditions.specificNuances joined by ", "] — якщо не пусте]
[conditions.foodDetails — якщо не пусте]
[conditions.specificConditionsDetails — якщо не пусте]

[🎁 *Компенсації від роботодавця*
[employerCompensations.details] — весь блок тільки якщо employerCompensations.hasCompensations = true]

[📝 *Додаткова інформація*
[additionalNotes] — весь блок тільки якщо additionalNotes не пусте]

Rules:
- Write in Ukrainian
- Use ONLY • for bullet points
- Do NOT show forRecruiter data
- Use Markdown bold (*text*) for section headers
- Return ONLY the formatted post text
`;

const CREATE_TEMPLATE_PROMPT = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: Create a reusable job template from a parsed vacancy JSON.

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

async function groqRequest(systemPrompt, userContent, jsonMode = true) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: jsonMode ? { type: "json_object" } : undefined,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  });
  return response.choices[0]?.message?.content || "";
}
async function mergeWithTemplate(rawText, template) {
  try {
    console.log(
      `🤖 Мерж шаблона "${template.templateName}" з повідомленням...`,
    );

    const content = `TEMPLATE:\n${JSON.stringify(template, null, 2)}\n\nMESSAGE:\n${rawText}`;
    const text = await groqRequest(MERGE_PROMPT, content, true);

    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    const merged = JSON.parse(cleanJson);

    // Абарона крытычных палёў
    merged.templateName = template.templateName;
    merged.agencyName = template.agencyName;
    if (!merged.keywords?.length) merged.keywords = template.keywords;

    return merged;
  } catch (error) {
    if (error.message?.includes("429")) throw new Error("RATE_LIMIT");
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
      // павысілі парог з 15 да 22
      // дадаткова правяраем лакацыю — яна АБАВЯЗКОВАЯ
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
      // ДАДАЕМ ПОЛЕ PROCESS (бярэм з апісання працы)
      process: t.description?.substring(0, 150),
    }));

    const content = `MESSAGE:\n${rawText}\n\nAVAILABLE TEMPLATES:\n${JSON.stringify(templateList)}`;
    const responseText = await groqRequest(IDENTIFY_PROMPT, content, true);
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
  // Без AI-запыту — проста JS, хутка і надзейна
}

async function formatTelegramPost(vacancyData) {
  try {
    console.log(`🤖 Форматування Telegram-посту...`);
    const text = await groqRequest(
      FORMAT_PROMPT,
      `DATA:\n${JSON.stringify(vacancyData, null, 2)}`,
      false,
    );
    return text.trim();
  } catch (error) {
    if (error.message?.includes("429")) throw new Error("RATE_LIMIT");
    throw error;
  }
}

async function parseVacancyWithAI(rawText) {
  try {
    console.log(`🤖 Парсинг v2.0 з поўнай структурай палёў...`);

    const SYSTEM_INSTRUCTION = `
ROLE: Professional automated job vacancy parser (Version 2.0).
TASK: Convert job vacancy text into a JSON object with EXACTLY this structure. Fill every field based on the text. Do not invent field names.

CRITICAL PRIVACY RULES:
1. agencyName: Extract the RECRUITMENT AGENCY name ONLY (e.g. Manpower, OTTO). If no agency mentioned — use null.
2. templateName: Factory/brand name + city IN POLISH ONLY (e.g. "Faurecia Grójec"). THIS IS FOR INTERNAL USE.
3. vacancydescription: THIS IS THE PUBLIC TITLE. Create a short informative description in UKRAINIAN. 
   - Use the specific job name in FORMAT: "Job Essence (Subcategory) — City"(e.g., Examples: "Склад одягу (Логістика) — Gądki", "Виробництво сосисок (М'ясна продукція) — Sława"). 
  - Use keywords from the text (e.g., "Склад одягу", "Харчове виробництво").
  - STRICT RULE: Do NOT include factory name, brand name, or agency name here (e.g., use "Пакування цукерок" instead of "Пакування цукерок на заводзе LOTTE").
4. location: Extract ONLY the city name in POLISH (e.g., "Warszawa", "Gdańsk") for filters.
5. locationDescription: FULL address and details from the text (e.g., "ul. Sloneczna 5, 96-321 Żabia Wola (35 км від Варшави)").
6. category (sphere): Identify the job category. Return ONLY one of the following UKRAINIAN values:
   - "Склади та логістика" (logistics, e-commerce, clothing/item warehouses)
   - "Харчова промисловість" (meat, fish, sweets, snacks, bakery, catering)
   - "Автомобільна промисловість" (car parts, tires, assembly, car electronics)
   - "Виробництво та промисловість" (windows, electronics, metal, household appliances, furniture)
   - "Будівництво" (concrete, rebar, finishing, roads, masonry)
   - "Сільське господарство" (farms, greenhouses, poultry, harvesting)
   - "Торгівля та послуги" (supermarkets, shops, cashiers, stocking shelves)
   - "Різне" (sewing/textile, recycling, cleaning, hotels, or if unsure)
   STRICT RULES: 
   1. The output MUST be the exact Ukrainian string from the list above.
   2. Do NOT translate these keys into English or Polish.
   3. Do NOT invent new categories.
7. MAX DETAIL EXTRACTION: Never summarize duties or special conditions. If text mentions "pouring concrete, rebar cutting, work on arrival, or delegations", these MUST be extracted in full into description or additionalNotes.

CORE PARSING RULES:
1. LANGUAGE: All descriptions, duties, notes — UKRAINIAN. Geography (location, voivodeship, checkInCity, country) — POLISH only.
2. ZERO LOSS: Never ignore ANY detail (breaks, jewelry ban, bonuses, smells, noise, laundry bonus). Everything goes into the correct field.
3. NO INTERPRETATION: If no specific number (temperature, distance) — write as text, NEVER guess.
4. checkInCity: ONLY if registration city DIFFERS from work city. Leave empty if same or no info.
5. contractType: Copy EXACTLY ("Umowa o pracę" or "Umowa zlecenie"). If not mentioned — null.
6. GENDER + COUPLES: If couples mentioned → add "Пари" to gender array AND set forCouples: true.
7. EXPENSES SPLIT: Costs BEFORE work (medical) → startExpenses. Costs/penalties DURING or on early exit → earlyTerminationLiability.

SALARY FIELD RULES:
- baseNetto: MAIN rate (e.g. "22.50 зл/год нетто"). Copy EXACTLY. NEVER empty if salary mentioned.
- bonusDetails: ALL bonuses in FULL (night shifts, overtime, attendance, quality). Do NOT summarize.
- salaryNotes: advances policy, extra housing allowance, overtime policy.

LOCATION & DESCRIPTION:
- locationDescription: combine address AND distance (e.g., "ul. Spółdzielcza 4, 05-600 Grójec (50 км від Варшави)").
- description: copy ALL duties in FULL detail. Do NOT summarize. Preserve all sentences.

CONDITIONS & KEYWORDS:
- specificNuances: array of short tags (["Запах гуми", "Шум", "Холодний склад"]).
- foodType: ONLY "Власне", "Обіди" (if FREE), or "Субсидоване".
- keywords: 5-10 items (factory name, city in UKR/PL, brand names, job process terms).

JSON STRUCTURE:
{
  "agencyName": null,
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
    "ageMax": 99,
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

    const text = await groqRequest(
      SYSTEM_INSTRUCTION,
      `Input text:\n${rawText}`,
      true,
    );

    let parsed = JSON.parse(text);

    console.log("🔍 RAW AI OUTPUT:", text.substring(0, 500));
    const cleaned = cleanData(parsed);

    return {
      // === 1. СИСТЕМНІ ПОЛЯ ===
      agencyName: cleaned.agencyName?.toUpperCase() || null,
      templateName: cleaned.templateName || "",
      //  Назва: Калі няма канкрэтнай назвы, бярэм першы сказ з апісання працэсу
      vacancydescription:
        cleaned.vacancydescription &&
        cleaned.vacancydescription !== "Нова вакансія"
          ? cleaned.vacancydescription
          : cleaned.description?.split(/[.;]/)[0].substring(0, 100).trim() ||
            "Опис вакансії",
      //  Катэгорыя: Бярэм ТОЛЬКІ тое, што знайшоў AI. Калі не знайшоў — null (каб потым узяць з шаблона)
      category: cleaned.category || null,
      keywords: Array.isArray(cleaned.keywords) ? cleaned.keywords : [],
      //  Тып кантракта: Ніякіх "Umowa zlecenie" па дэфолце. Толькі тое, што ў тэксце.
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
      country: "Polska",
      checkInCity: cleaned.checkInCity || "",

      // === 3. ФІНАНСЫ ===
      salary: {
        baseNetto: cleaned.salary?.baseNetto || "не вказано",
        studentNetto: cleaned.salary?.studentNetto || "",
        hoursRange: cleaned.salary?.hoursRange || "",
        payoutDates: cleaned.salary?.payoutDates || "",
        bonusDetails: cleaned.salary?.bonusDetails || "",
        salaryNotes: cleaned.salary?.salaryNotes || "",
      },

      // === 4. ГРАФІК ===
      schedule: {
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
        type: cleaned.accommodation?.type
          ? cleaned.accommodation.type.charAt(0).toUpperCase() +
            cleaned.accommodation.type.slice(1)
          : "Платне",
        forCouples: !!cleaned.accommodation?.forCouples,
        withChildren: !!cleaned.accommodation?.withChildren,
        withPets: !!cleaned.accommodation?.withPets,
        costRaw: cleaned.accommodation?.costRaw || "",
        details: cleaned.accommodation?.details || "",
      },
      transport: {
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
        gender: Array.isArray(cleaned.requirements?.gender)
          ? cleaned.requirements.gender
          : ["Чоловіки", "Жінки"],
        ageMax: cleaned.requirements?.ageMax || 99,
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
        entranceTestsDetails: cleaned.requirements?.entranceTestsDetails || "",
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

      // === 11. АПІСАННЕ ПРАЦЭСАЎ ===
      description: cleaned.description || "",
      additionalNotes: cleaned.additionalNotes || "",
    };
  } catch (error) {
    console.error("❌ Fatal Parsing Error:", error.message);
    throw error;
  }
}

async function createTemplateFromVacancy(vacancyData) {
  try {
    console.log(`🤖 Створення шаблону v2.0 з вакансії...`);
    const text = await groqRequest(
      CREATE_TEMPLATE_PROMPT,
      `VACANCY DATA:\n${JSON.stringify(vacancyData, null, 2)}`,
      true,
    );

    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("❌ Помилка створення шаблону:", error.message);
    return null;
  }
}

async function testConnection() {
  try {
    await groqRequest("Test", "Hi", false);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  parseVacancyWithAI,
  identifyTemplate,
  linkTemplateToVacancy,
  formatTelegramPost,
  createTemplateFromVacancy,
  testConnection,
  mergeWithTemplate,
};
