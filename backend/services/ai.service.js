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
CRITICAL RULE: If the factory and location match, but the JOB PROCESS (duties/process field) is different, return templateId: null. We need a new template for different roles.
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

[💸 *Витрати та відповідальність*
[• На старті: [startExpenses.details] — якщо hasStartExpenses = true]
[• При передчасному звільненні: [earlyTerminationLiability.details] — якщо hasLiability = true].]

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
- Do NOT show forRecruiter data — це тільки для рекрутера
- Use Markdown bold (*text*) for section headers
- Split description into logical sentences and format each as a new line starting with •
- If entire block has no data — skip it completely
- Return ONLY the formatted post text, no JSON, no explanations
- If information in specificNuances and specificConditionsDetails is identical, display it only once
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

async function mergeWithTemplate(rawText, template) {
  try {
    console.log(
      `🤖 Мерж шаблона "${template.templateName}" з повідомленням...`,
    );

    // FIX: templateSlim цяпер змяшчае ВСЕ палі v2.0 — нічога не губіцца
    const templateSlim = {
      agencyName: template.agencyName,
      templateName: template.templateName,
      vacancydescription: template.vacancydescription,
      category: template.category,
      keywords: template.keywords,
      contractType: template.contractType,
      arrivalDate: template.arrivalDate,
      count: template.count,
      forRecruiter: template.forRecruiter,

      location: template.location,
      locationDescription: template.locationDescription,
      voivodeship: template.voivodeship,
      country: template.country,
      checkInCity: template.checkInCity,

      salary: template.salary,
      schedule: template.schedule,

      accommodation: template.accommodation,
      transport: template.transport,
      employerCompensations: template.employerCompensations,

      requirements: template.requirements,
      businessTrip: template.businessTrip,

      conditions: template.conditions,

      startExpenses: template.startExpenses,
      earlyTerminationLiability: template.earlyTerminationLiability,

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
    // Калі AI вярнуў пустыя масівы, якія дакладно былі ў шаблоне — аднаўляем іх
    if (
      (!merged.keywords || merged.keywords.length === 0) &&
      template.keywords?.length > 0
    )
      merged.keywords = template.keywords;
    if (
      (!merged.requirements?.standardDocs ||
        merged.requirements.standardDocs.length === 0) &&
      template.requirements?.standardDocs?.length > 0
    )
      merged.requirements.standardDocs = template.requirements.standardDocs;
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
ROLE: Professional automated job vacancy parser (Version 2.0).
TASK: Convert job text into a JSON object based on the strict v2.0 template.

STRICT RULES:
1. LANGUAGE: All descriptions, duties, and notes MUST be in UKRAINIAN. 
2. GEOGRAPHY: Fields 'location', 'voivodeship', 'checkInCity', and 'country' MUST be in POLISH only (e.g., Warszawa, Śląskie). Do not translate them!
3. ZERO LOSS PRINCIPLE: 100% completeness. Do not ignore minor details (free drinks, microwave, jewelry ban, laundry bonuses, attendance bonuses). Everything must be in the corresponding fields.
4. checkInCity ALGORITHM:
   - Step 1: Check for office/registration address. If the office city differs from the work city -> put it in checkInCity.
   - Step 2: If the header says "Arrival to [City]" and work is elsewhere -> put that city in checkInCity.
   - Step 3: If cities match or no info -> leave empty "".
5. NO INTERPRETATION: If no specific number is mentioned (temperature, distance), do not guess. Write as in text: "cold warehouse".
6. CONFIDENTIALITY: Remove agency names (Manpower, OTTO). KEEP product brands (Sinsay, Samsung, Bosch).
7. AUTONOMY: Each vacancy (No. 81, 82...) must be a standalone object. No "same as above" references.
8. vacancydescription must be a concise job title in Ukrainian (e.g., 'Пакування цукерак'), excluding factory names.

OUTPUT: Return ONLY a valid JSON object.`;

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
  mergeWithTemplate,
  formatTelegramPost,
  createTemplateFromVacancy,
  testConnection,
};
