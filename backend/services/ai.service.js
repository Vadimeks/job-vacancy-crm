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
          return [key, 60];
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
1. The BRAND NAME in the message must EXACTLY match the brand in the template name.
   - If message mentions "Aurora" → only match templates with "Aurora" in the name.
   - If message mentions "Zalando" → only match templates with "Zalando" in the name.
   - If message mentions "BREMBO" → only match templates with "BREMBO" in the name.
2. Location alone is NOT enough to match — brand must match too.
3. If no brand match found → return templateId: null.
4. If you are less than 90% sure → return templateId: null.
5. It is ALWAYS better to return null than a wrong match.

Return ONLY a JSON object:
{
  "templateId": "the _id of the matched template, or null if no match",
  "confidence": "high/medium/low",
  "reason": "brief explanation in Ukrainian"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
`;

// FIX: MERGE_PROMPT тепер використовує повну структуру v2.0 — жодне поле не губиться
const MERGE_PROMPT = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: You have a job template (JSON v2.0) and a new short message.
Extract ONLY the information that has CHANGED or is NEW in the message.
Keep ALL other fields from the template EXACTLY unchanged.

You will receive:
1. TEMPLATE: full job template data (JSON v2.0)
2. MESSAGE: new short message from agency chat

Rules:
- ALWAYS keep templateName EXACTLY as in template — never modify it
- If message contains recruiter-only info, security rules, "no phones" policy → put into forRecruiter.internalNotes
- If message mentions new address or small workplace details → put into conditions.specificConditionsDetails
- If message mentions count (e.g. "2 жінки", "5 чоловіків") → set count field (number only, e.g. 2)
- If message mentions gender → update requirements.gender (Array: ["Чоловіки", "Жінки", "Пари"])
- If message mentions arrival date (e.g. "приїзд 20.03", "набір 15.04") → update arrivalDate. Keep original format (e.g. "23.03")
- If message mentions housing change → update accommodation fields
- If message mentions salary change → update salary fields
- If message mentions schedule change → update schedule fields
- If message mentions nationalities → update requirements.nationalities
- If field is NOT mentioned in message → keep template value EXACTLY as is

Return ONLY valid JSON with the complete merged result using FULL structure v2.0:
{
  "agencyName": "string",
  "templateName": "string",
  "vacancydescription": "string",
  "category": "string",
  "keywords": ["string"],
  "contractType": "string",
  "arrivalDate": "string or null",
  "count": "string or null",

  "forRecruiter": {
    "internalNotes": "string",
    "hideAgencyNameForCandidate": true,
    "hideEnterpriseNameForCandidate": true
  },

  "location": "string",
  "locationDescription": "string",
  "voivodeship": "string",
  "country": "Polska",
  "checkInCity": "string",

  "salary": {
    "baseNetto": "string",
    "studentNetto": "string",
    "hoursRange": "string",
    "payoutDates": "string",
    "bonusDetails": "string",
    "salaryNotes": "string"
  },

  "schedule": {
    "shiftsCount": 0,
    "hoursPerShift": "string",
    "workDaysWeek": "string",
    "breakDuration": "string",
    "canChooseShiftOnStart": false,
    "shiftChoiceDetails": "string",
    "description": "string"
  },

  "accommodation": {
    "type": "Безкоштовне/Платне/Власне",
    "forCouples": false,
    "withChildren": false,
    "withPets": false,
    "costRaw": "string",
    "details": "string"
  },

  "transport": {
    "provided": false,
    "costRaw": "string",
    "details": "string"
  },

  "employerCompensations": {
    "hasCompensations": false,
    "details": "string"
  },

  "requirements": {
    "gender": ["string"],
    "ageMax": 60,
    "nationalities": ["string"],
    "standardDocs": ["string"],
    "needsAdditionalDocs": false,
    "additionalDocsDetails": "string",
    "experienceRequired": false,
    "hasEntranceTests": false,
    "entranceTestsDetails": "string",
    "polishLanguageLevel": "string",
    "languageDetails": "string",
    "physicalLoad": "string"
  },

  "businessTrip": {
    "isBusinessTrip": false,
    "requiresPolishExperience": false,
    "requiredDocuments": [],
    "tripDetails": "string"
  },

  "conditions": {
    "hasSpecificConditions": false,
    "specificNuances": [],
    "specificConditionsDetails": "string",
    "workwearFree": false,
    "foodType": "string",
    "foodDetails": "string"
  },

  "startExpenses": {
    "hasStartExpenses": false,
    "details": "string"
  },

  "earlyTerminationLiability": {
    "hasLiability": false,
    "details": "string"
  },

  "description": "string",
  "additionalNotes": "string"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
`;

// FIX: FORMAT_PROMPT тепер використовує правильні шляхи до полів v2.0
const FORMAT_PROMPT = `
ROLE: Professional HR content formatter.
TASK: Format the job data into a beautiful Telegram post in UKRAINIAN.

Use this EXACT structure (skip entire blocks if ALL data inside is empty/null):

*[templateName]*
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
[schedule.description]
[schedule.workDaysWeek]
[schedule.breakDuration — якщо не пусте]

📄 Тип договору: [contractType]

🏠 *Проживання*
Тип: [accommodation.type]
[accommodation.costRaw — якщо не пусте]
[accommodation.details — якщо не пусте]

🚌 *Транспорт*
[transport.costRaw — якщо не пусте][, transport.details — якщо не пусте]

🌡 *Умови праці*
• Робочий одяг: [conditions.workwearFree ? "Безкоштовно" : "За рахунок працівника"]
• Харчування: [conditions.foodType]
[conditions.foodDetails — якщо не пусте]
[conditions.specificConditionsDetails — якщо не пусте]

[🎁 *Компенсації від роботодавця*
[employerCompensations.details] — весь блок тільки якщо employerCompensations.hasCompensations = true]

[📝 *Додаткова інформація*
[additionalNotes] — весь блок тільки якщо additionalNotes не пусте]

Rules:
- Write in Ukrainian
- Use ONLY • for bullet points
- Do NOT show forRecruiter data — це тільки для рекрутера
- Use Markdown bold (*text*) for section headers
- Split description by semicolons into bullet points with •
- If entire block has no data — skip it completely
- Return ONLY the formatted post text, no JSON, no explanations
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

    if (bestMatch) {
      console.log(
        `✅ Шаблон знойдзены лакальна: ${bestMatch.templateName} (Score: ${maxScore})`,
      );
      return bestMatch;
    }
  }

  try {
    const templateList = templates.map((t) => ({
      _id: t._id.toString(),
      templateName: t.templateName,
      location: t.location || "",
      brand: t.templateName.split(" ")[0],
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

async function mergeWithTemplate(rawText, template) {
  try {
    console.log(
      `🤖 Мерж шаблона "${template.templateName}" з повідомленням...`,
    );

    // FIX: templateSlim цяпер змяшчае ВСЕ палі v2.0 — нічога не губіцца
    const templateSlim = {
      agencyName: template.agencyName,
      templateName: template.templateName, // FIX: было "title" — не існуе ў схеме
      vacancydescription: template.vacancydescription,
      category: template.category,
      keywords: template.keywords,
      contractType: template.contractType,
      arrivalDate: template.arrivalDate,
      count: template.count,

      forRecruiter: template.forRecruiter, // FIX: раней губілася

      location: template.location,
      locationDescription: template.locationDescription,
      voivodeship: template.voivodeship,
      country: template.country,
      checkInCity: template.checkInCity,

      salary: template.salary,
      schedule: template.schedule,

      accommodation: template.accommodation,
      transport: template.transport,
      employerCompensations: template.employerCompensations, // FIX: раней губілася

      requirements: template.requirements,
      businessTrip: template.businessTrip, // FIX: раней губілася

      conditions: template.conditions,

      startExpenses: template.startExpenses, // FIX: раней губілася
      earlyTerminationLiability: template.earlyTerminationLiability, // FIX: раней губілася

      description: template.description,
      additionalNotes: template.additionalNotes,
    };

    const content = `TEMPLATE:\n${JSON.stringify(templateSlim, null, 2)}\n\nMESSAGE:\n${rawText}`;
    const text = await groqRequest(MERGE_PROMPT, content, true);

    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    const merged = JSON.parse(cleanJson);

    // Захаванне крытычных палёў, калі AI раптам іх выдаліў
    if (template.additionalNotes && !merged.additionalNotes)
      merged.additionalNotes = template.additionalNotes;
    if (template.forRecruiter && !merged.forRecruiter)
      merged.forRecruiter = template.forRecruiter;

    return merged;
  } catch (error) {
    if (error.message?.includes("429")) throw new Error("RATE_LIMIT");
    if (error instanceof SyntaxError) throw new Error("INVALID_JSON_RESPONSE");
    throw error;
  }
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
ROLE: Professional HR Dispatcher.
TASK: Parse job vacancy into JSON v2.0 according to the provided schema.

CRITICAL RULES:
- Language: Ukrainian for descriptions, Polish for locations (cities, voivodeships).
- If info is missing, use "" or null. NEVER use the word "string".
- If age is not specified, return null for ageMax (it will be set to 60 by the cleaner).
- agencyName must be in UPPERCASE.
- Do not invent data. If a specific detail (like temperature) is not mentioned, do not guess it.
- description must be written in Ukrainian WITHOUT agency or factory names.
- Keep "vacancydescription" as a short summary in Ukrainian (max 100 chars).

Return ONLY valid JSON.`;

    const text = await groqRequest(
      SYSTEM_INSTRUCTION,
      `Input text:\n${rawText}`,
      true,
    );

    let parsed = JSON.parse(text);
    const cleaned = cleanData(parsed);

    return {
      // === 1. СИСТЕМНІ ПОЛЯ ===
      agencyName: cleaned.agencyName?.toUpperCase() || null,
      templateName: cleaned.templateName || "",
      vacancydescription:
        cleaned.vacancydescription ||
        // FIX: не пускаем rawText у апісанне — там могуць быць назвы агенцый
        cleaned.description?.substring(0, 100) ||
        "Нова вакансія",
      category:
        cleaned.category ||
        "⚙️ Виробництво і промисловість / Логістика, склади та пакування",
      keywords: Array.isArray(cleaned.keywords) ? cleaned.keywords : [],
      contractType: cleaned.contractType || "Umowa zlecenie",
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
        type: cleaned.accommodation?.type || "Платне",
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
        ageMax: cleaned.requirements?.ageMax || 60,
        nationalities: Array.isArray(cleaned.requirements?.nationalities)
          ? cleaned.requirements.nationalities
          : ["Україна"],
        standardDocs: Array.isArray(cleaned.requirements?.standardDocs)
          ? cleaned.requirements.standardDocs
          : ["PESEL UKR"],
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
          cleaned.conditions?.specificConditionsDetails || "", // FIX: было conditions.notes — не існуе ў схеме
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
      description: cleaned.description || "", // FIX: не пускаем rawText — там назвы агенцый
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
  mergeWithTemplate,
  formatTelegramPost,
  createTemplateFromVacancy,
  testConnection,
};
