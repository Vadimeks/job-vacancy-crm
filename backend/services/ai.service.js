const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// Дзве мадэлі для надзейнасці
const MODEL_SMART = "llama-3.3-70b-versatile"; // Асноўная (разумная)
const MODEL_FAST = "llama-3.1-8b-instant"; // Запасная (хуткая)

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
const LANGUAGE_GUARD = `
!!! STRICT LANGUAGE RULE !!!
- ALL output text MUST be in UKRAINIAN.
- All descriptions, duties, notes — UKRAINIAN. Geography (location, voivodeship, checkInCity, country) — POLISH (Latin alphabet) only.
- If the input is in Russian — TRANSLATE it to Ukrainian. Never use Russian words (e.g., use "Приїзд" instead of "Приезд", "Житло" instead of "Жилье").
`;
function cleanData(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanData);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        // Калі гэта ўкладзены аб'ект — чысцім рэкурсіўна
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          return [key, cleanData(value)];
        }
        // Калі значэнне — смецце або маркеры
        if (
          value === "string" ||
          value === "undefined" ||
          value === "" ||
          value === 99 ||
          value === "99" ||
          value === null
        ) {
          return [key, null];
        }
        // ВЯРТАЕМ нармальнае значэнне
        return [key, value];
      }),
    );
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

const FORMAT_PROMPT = `
ROLE: Professional HR content formatter.
TASK: Format the job data into a beautiful Telegram post in UKRAINIAN.

!!! CRITICAL COMPACTNESS RULE !!!: 
If a field value is empty, null, "не вказано", or an empty array, you MUST NOT include the label or the line in the final post. The post must be as compact as possible. Do not show empty sections.

CRITICAL PRIVACY RULE:
- NEVER include the Agency Name (agencyName) in the post.
- NEVER include internal notes or recruiter-only data.
- Use vacancydescription as the main title (NEVER use templateName here).

Use this EXACT structure (skip entire blocks if ALL data inside is empty/null):

*[vacancydescription]*
📍 Місто: [location] 
• Оформлення: м. [checkInCity] (only if not empty)
👥 Набір: [requirements.gender joined by ", "] (only if not empty)
• Приїзд: [arrivalDate] (only if not empty)

💰 *Оплата праці*
• Ставка: [salary.baseNetto]
• Студенти: [salary.studentNetto]
• Годин на місяць: [salary.hoursRange]
• Виплати: [salary.payoutDates]
• Бонуси: [salary.bonusDetails]
• Нотатки: [salary.salaryNotes]

🛠 *Характер роботи*
[кожен пункт з description, розбитий по крапці з комою, на новому рядку з •. ВАЖЛИВО: не ставте порожніх рядків між пунктами]

📋 *Вимоги*
[• Вік: до [requirements.ageMax] років — only if ageMax is NOT null and less than 65]
• Документи: [requirements.standardDocs joined by ", "]
• Мова: [requirements.polishLanguageLevel (якщо "A1" - напиши "Базовий рівень (A1)", якщо "Не вимагається" - напиши "Не вимагається")]
[• [requirements.physicalLoad] — only if not empty]

🕒 *Графік роботи*
[schedule.description — only if not empty]
[schedule.workDaysWeek — тільки якщо НЕ міститься вже у schedule.description]
[• Перерва: [schedule.breakDuration] — only if not empty]

[📄 Тип договору: [contractType] — only if not empty]

🏠 *Проживання*
Тип: [accommodation.type]
• Вартість: [accommodation.costRaw]
• Деталі: [accommodation.details]

🚌 *Транспорт*
• [transport.costRaw]
• [transport.details]

[💸 *Витрати та відповідальність*
[• На старті: [startExpenses.details] — якщо hasStartExpenses = true]
[• При передчасному звільненні: [earlyTerminationLiability.details] — якщо hasLiability = true]
Весь блок 💸 виводити ТІЛЬКИ якщо hasStartExpenses = true АБО hasLiability = true. Якщо обидва false — пропустити блок повністю.]

🌡 *Умови праці*
• Робочий одяг: [conditions.workwearFree ? "Безкоштовно" : "За рахунок працівника"]
• Харчування: [conditions.foodType]
[• Нюанси: [conditions.specificNuances joined by ", "] — only if not empty]
[conditions.foodDetails — only if not empty]
[conditions.specificConditionsDetails — only if not empty]

[🎁 *Компенсації від роботодавця*
[employerCompensations.details] — only if employerCompensations.hasCompensations = true]

📝 *Додаткова інформація* (Only if additionalNotes not empty)
[additionalNotes]

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

// Універсальная функцыя запыту з FALLBACK логікай
async function groqRequest(systemPrompt, userContent, jsonMode = true) {
  try {
    // Спроба 1: Разумная мадэль
    console.log(`🤖 Groq: Спроба праз ${MODEL_SMART}...`);
    const response = await groq.chat.completions.create({
      model: MODEL_SMART,
      temperature: 0.2,
      response_format: jsonMode ? { type: "json_object" } : undefined,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    });
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    // Калі ліміт (429) — спрабуем хуткую мадэль
    if (error.message?.includes("429")) {
      console.warn(`⚠️ Ліміт 70b дасягнуты. Пераключаюся на ${MODEL_FAST}...`);
      const fallbackResponse = await groq.chat.completions.create({
        model: MODEL_FAST,
        temperature: 0.2,
        response_format: jsonMode ? { type: "json_object" } : undefined,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      });
      return fallbackResponse.choices[0]?.message?.content || "";
    }
    throw error; // Калі іншая памылка — пракідваем далей
  }
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
    console.log(
      `🤖 Парсинг v2.0 з повною структурою полів та уніфікацією (Версія з выпраўленнямі)...`,
    );

    const SYSTEM_INSTRUCTION = `
ROLE: Professional automated job vacancy parser (Version 2.0).
TASK: Convert job vacancy text into a JSON object with EXACTLY this structure. Fill every field based on the text. Do not invent field names.
${LANGUAGE_GUARD} 
CRITICAL GEOGRAPHY RULES:
1. location: Extract ONLY the city name in POLISH using LATIN characters (A-Z). 
   - STRICT RULE: NEVER use Cyrillic (кирилиця) for city names.
   - STRICT RULE: NEVER include the country name "Polska" or "Poland".
   - Examples: "Варшава" -> "Warszawa", "Краків" -> "Kraków", "Польковиці/Polkovice" -> "Polkowice".
   - ALWAYS use Polish spelling for city names. This is mandatory for database filters.
2. voivodeship: Select EXACTLY one from this list: ${POLISH_VOIVODESHIPS.join(", ")}. If the text doesn't mention it, determine it by the city.

CRITICAL PRIVACY & FORMATTING RULES:
1. agencyName: Extract the RECRUITMENT AGENCY name ONLY (e.g. Manpower, OTTO). If no agency mentioned — use null.
2. brand: Extract the specific factory or brand name (e.g., "LG", "Amazon", "Faurecia", "LPP"). This is the name of the workplace.
3. templateName: Factory/brand name + city IN POLISH ONLY (e.g. "Faurecia Grójec"). THIS IS FOR INTERNAL USE.
4. vacancydescription: THIS IS THE PUBLIC TITLE. Create a short informative description in UKRAINIAN. 
       - Use the specific job name in FORMAT: "Job Essence (Subcategory)". 
       - Examples: "Склад товарів (Логістика)", "Виробництво деталей (Автопром)".
       - STRICT RULE: If the specific type of goods (clothing, food, etc.) is NOT explicitly mentioned in the text — use a generic title like "Склад (Логістика)". Do NOT invent "Clothing" or "Shoes".
       - CRITICAL: DO NOT use brand names or company knowledge to guess the product type. If the text says "CCC" but doesn't mention "shoes", do NOT write "Склад взуття". Write "Склад (Логістика)".
       - STRICT RULE: Do NOT include city name, factory name, brand name, or agency name here.
5. category (sphere): Identify the job category. Return ONLY one of the following UKRAINIAN values:
   - "Склади та логістика"
   - "Харчова промисловість"
   - "Автомобільна промисловість"
   - "Виробництво та промисловість"
   - "Будівництво"
   - "Сільське господарство"
   - "Торгівля та послуги"
   - "Різне"
   STRICT RULES: 
   1. The output MUST be the exact Ukrainian string from the list above.
   2. Do NOT translate these keys into English or Polish.
   3. Do NOT invent new categories.
6. MAX DETAIL EXTRACTION: Never summarize or skip ANY details. 
   - If the text mentions recruitment steps (interview/співбесіда, BHP, medical check), include them in "additionalNotes".
   - If the text mentions minimum hours (e.g., 168h/month), include this in "salary.salaryNotes" or "schedule.description".
   - Transport schedules, bus routes, and links to videos MUST be placed in "additionalNotes".

CORE PARSING RULES:
1. LANGUAGE: All descriptions, duties, notes — UKRAINIAN. Geography (location, voivodeship, checkInCity, country) — POLISH (Latin alphabet) only.
2. ZERO LOSS & NO SUMMARIZATION: Never summarize duties. 
   - IMPORTANT: Use a SEMICOLON (;) to separate every single duty or task in the "description" field. This is critical for correct bullet-point formatting on the frontend.
3. NO INTERPRETATION: If no specific number (temperature, distance) — write as text, NEVER guess.
4. checkInCity: ONLY if registration city DIFFERS from work city. Leave empty if same or no info. Use Latin characters.
5. contractType: Copy EXACTLY ("Umowa o pracę" or "Umowa zlecenie"). If not mentioned — null.
6. GENDER + COUPLES: If couples mentioned → add "Пари" to gender array AND set forCouples: true.
   - COUPLES & HOUSING: If the text says housing for couples is NOT available yet (e.g. "для пар немає житла", "житло для пар поки відсутнє") → set forCouples: false, BUT write a note in accommodation.details: "Житло для пар наразі відсутнє, можливо з'явиться пізніше".
7. EXPENSES SPLIT: Costs BEFORE work (medical) → startExpenses. Costs/penalties DURING or on early exit → earlyTerminationLiability.
8. FIELD DISTRIBUTION — description vs additionalNotes:
   - "description": job duties and work process ONLY. Use SEMICOLONS (;) to separate each duty.
   - "additionalNotes": ALL other information that does not fit any specific structured field — recruitment stages, bus schedules, video links, contract details, extra notes, client brand names (BMW, Tesla).
   - ZERO LOSS RULE: Any piece of information from the source text that cannot be placed in a specific structured field MUST be written into "additionalNotes". Nothing is ever lost.
   - STRICT NO-DUPLICATION: If information is ALREADY captured in specific fields (salary, accommodation, transport, conditions.workwearFree, conditions.foodType), you MUST NOT repeat it in "description" or "additionalNotes".

SALARY FIELD RULES:
- baseNetto: MAIN rate from the text. Copy EXACTLY (e.g., "22.50 зл/год нетто" OR "31.40 zł/год brutto"). 
  CRITICAL: NEVER leave this field empty if any salary/rate is mentioned in the text. 
- bonusDetails: ALL bonuses in FULL (night shifts, overtime, attendance, quality). Do NOT summarize.
- salaryNotes: advances policy, extra housing allowance, overtime policy.

REQUIREMENTS RULES:
- polishLanguageLevel: This field MUST be one of these: "Не вимагається", "A1", "A2", "B1", "B2", "C1". 
If the text says something else, map it to the closest code. Do NOT output descriptions like "рівень розуміння". Output ONLY the code.

LOCATION & DESCRIPTION:
- locationDescription: combine address AND distance (e.g., "ul. Spółdzielcza 4, 05-600 Grójec (50 км від Варшави)").
- description: copy ALL duties in FULL detail. Do NOT summarize. Preserve all sentences.
- schedule.description: MUST contain the FULL shift schedule with exact times. Example: "І зміна: пн–пт 12 год (06:00–18:00) + сб 8 год (06:00–14:00); ІІ зміна: пн–пт 12 год (14:00–02:00); ІІІ зміна: нд–чт 12 год (22:00–10:00) + пт 8 год (22:00–06:00)". NEVER summarize or omit shift times if they are present in the text.

CONDITIONS & KEYWORDS:
- specificNuances: array of short tags (["Запах гуми", "Шум", "Холодний склад"]).
- foodType: ONLY "Власне", "Обіди" (if FREE), or "Субсидоване".
- keywords: 5-10 items (factory name, city in UKR/PL, brand names, job process terms).

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

    const text = await groqRequest(
      SYSTEM_INSTRUCTION,
      `Input text:\n${rawText}`,
      true,
    );

    let parsed = JSON.parse(text);

    // --- ПОСТ-АПРАЦОЎКА (Страхоўка) ---
    // 1. Выдаляем "Polska" калі AI ўсё ж такі яго дадаў у поле горада
    if (parsed.location) {
      parsed.location = parsed.location.replace(/Polska,?\s*/gi, "").trim();
    }

    const cleaned = cleanData(parsed);

    // 2. Лагічны загаловак
    const baseTitle =
      cleaned.vacancydescription &&
      cleaned.vacancydescription !== "Нова вакансія"
        ? cleaned.vacancydescription
        : cleaned.description?.split(/[.;]/)[0].substring(0, 100).trim() ||
          "Опис вакансії";

    // Дадаем горад толькі калі яго яшчэ няма ў загалоўку
    const finalTitle =
      cleaned.location &&
      !baseTitle.toLowerCase().includes(cleaned.location.toLowerCase())
        ? `${baseTitle} — ${cleaned.location}`
        : baseTitle;

    // --- СТРАХОЎКА ЗАРПЛАТЫ ---
    // Калі AI запісаў стаўку ў salaryNotes замест baseNetto, пераносім яе
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
      agencyName: cleaned.agencyName?.toUpperCase() || null,
      brand: cleaned.brand || "",
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
      country: "Polska",
      checkInCity: cleaned.checkInCity || "",

      // === 3. ФІНАНСЫ ===
      salary: {
        ...(cleaned.salary || {}),
        baseNetto: finalBaseNetto || "не вказано",
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
        ...(cleaned.accommodation || {}),
        type: cleaned.accommodation?.type || "Платне",
        forCouples: !!cleaned.accommodation?.forCouples,
        withChildren: !!cleaned.accommodation?.withChildren,
        withPets: !!cleaned.accommodation?.withPets,
        costRaw: cleaned.accommodation?.costRaw || "",
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
      rawText: rawText,
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
  try {
    console.log(
      `🤖 Інтэлектуальнае абнаўленне вакансіі ${existingVacancy.vacancyCode}...`,
    );
    const content = `CURRENT_VACANCY_JSON:\n${JSON.stringify(existingVacancy, null, 2)}\n\nNEW_MESSAGE_TEXT:\n${newText}`;
    const responseText = await groqRequest(
      UPDATE_VACANCY_PROMPT,
      content,
      true,
    );

    let cleanJson = responseText
      .trim()
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "");
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("❌ AI Update Error:", error.message);
    throw error;
  }
}
/**
 * Класіфікацыя паведамлення праз Groq (Llama 3.3 70b)
 * Выкарыстоўваецца як надзейны фолбэк для Gemini
 */
async function analyzeWithGroq(
  text,
  recentMessages = [],
  recentVacancies = [],
) {
  try {
    console.log(`🔍 Groq (${MODEL_SMART}): Фолбэк-аналіз...`);

    const systemPrompt = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify a NEW_MESSAGE and compare it with RECENT_MESSAGES and RECENT_VACANCIES.
Return ONLY valid JSON.
    `;

    const userContent = `
RECENT_MESSAGES: ${JSON.stringify(recentMessages.slice(0, 3))}
RECENT_VACANCIES: ${JSON.stringify(recentVacancies.slice(0, 2))}
NEW_MESSAGE: ${text}

CATEGORIES: FULL_VACANCY, UPDATE, RECRUITER_INFO, NOISE.
VERDICTS: NEW, DUPLICATE, UPDATE.

Output JSON structure:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE",
  "comparison": { "verdict": "NEW" | "DUPLICATE" | "UPDATE", "reason": "string" },
  "translatedText": "Clean Ukrainian translation"
}
    `;

    const response = await groq.chat.completions.create({
      model: MODEL_SMART,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    });

    return JSON.parse(response.choices[0]?.message?.content);
  } catch (err) {
    console.error("❌ Groq fallback analysis failed:", err.message);
    return null;
  }
}

/**
 * Хуткі пераклад тэксту (фолбэк)
 */
async function simpleTranslate(text) {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL_FAST,
      messages: [
        {
          role: "system",
          content:
            "Translate the following text to Ukrainian. Return ONLY the translation.",
        },
        { role: "user", content: text },
      ],
    });
    return response.choices[0]?.message?.content || text;
  } catch (err) {
    return text;
  }
}
module.exports = {
  parseVacancyWithAI,
  identifyTemplate,
  linkTemplateToVacancy,
  formatTelegramPost,
  createTemplateFromVacancy,
  testConnection,
  updateVacancyWithAI,
  mergeWithTemplate,
  analyzeWithGroq,
  simpleTranslate,
};
