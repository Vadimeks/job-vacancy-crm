const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// --- PROMPTS (ПОЎНЫЯ ВЕРСІІ БЕЗ СКАРАЧЭННЯЎ) ---

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

const MERGE_PROMPT = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: You have a job template and a new short message. 
Extract ONLY the information that has CHANGED or is NEW in the message.
Keep ALL other fields from the template unchanged.

You will receive:
1. TEMPLATE: full job template data (JSON)
2. MESSAGE: new short message from agency chat

Rules:
- ALWAYS keep title EXACTLY as in template — never modify it
- If message contains recruiter-only info, security rules, "no phones" policy → ALWAYS put this into "additionalNotes".
- If message mentions new address or small workplace details → put into "conditions.notes".
- If message mentions count (e.g. "2 жінки", "5 чоловіків") → set count field (number only, e.g. 2)
- If message mentions gender → update requirements.gender (Array: ["Чоловіки", "Жінки", "Пари"])
- If message mentions arrival date (e.g. "приїзд 20.03", "набір 15.04") → update arrivalDate field. ALWAYS keep the original format (e.g. "23.03", never "2023-03-23").
- If message mentions housing change → update accommodation fields (type, costRaw, details)
- If message mentions salary change → update salary fields (baseNetto, studentNetto, hoursRange, payoutDates, bonusDetails)
- If message mentions schedule change → update schedule fields (shiftsCount, hoursPerShift, workDaysWeek, description)
- If message mentions nationalities → update requirements.nationalities
- If field is NOT mentioned in message → keep template value EXACTLY as is

Return ONLY valid JSON with the complete merged result using this structure v2.0:
{
  "title": "string",
  "location": "string",
  "voivodeship": "string",
  "agencyName": "string",
  "arrivalDate": "string or null",
  "count": "string or null",
  "salary": {
    "baseNetto": "string",
    "studentNetto": "string",
    "hoursRange": "string",
    "payoutDates": "string",
    "bonusDetails": "string"
  },
  "schedule": {
    "shiftsCount": number,
    "hoursPerShift": "string",
    "workDaysWeek": "string",
    "description": "string"
  },
  "description": "string",
  "accommodation": {
    "type": "Безкоштовне/Платне/Власне",
    "costRaw": "string",
    "details": "string"
  },
  "transport": {
    "costRaw": "string",
    "details": "string"
  },
  "requirements": {
    "gender": ["string"],
    "ageMax": number,
    "nationalities": ["string"],
    "standardDocs": ["string"],
    "polishLanguageLevel": "string"
  },
  "conditions": {
    "foodType": "string",
    "workwearFree": boolean,
    "notes": "string"
  },
  "contractType": "string",
  "additionalNotes": "string"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
`;

const FORMAT_PROMPT = `
ROLE: Professional HR content formatter.
TASK: Format the job data into a beautiful Telegram post in UKRAINIAN.

Use this EXACT structure (skip blocks if data is empty/null/empty string):

*[title]*
👥 Набір: [requirements.gender joined by ", "][, приїзд [arrivalDate] if arrivalDate exists]

💰 *Оплата праці*
- Ставка: [salary.baseNetto]
- Студенти: [salary.studentNetto if not empty]
- Годин на місяць: [salary.hoursRange]
- Выплати: [salary.payoutDates]
[salary.bonusDetails if not empty]

🛠 *Характер роботи*
- [each item from description split by semicolon on new line with •]

📋 *Вимоги*
- Вік: [requirements.ageMax if not empty]
- Документи: [requirements.standardDocs joined by ", "]
- Мова: [requirements.polishLanguageLevel]

🕒 *Графік роботи*
[schedule.description]
[schedule.workDaysWeek]

📄 Тип договору: [contractType]

🏠 *Проживання*
Тип: [accommodation.type]
[accommodation.costRaw if not empty]
[accommodation.details if not empty]

🚌 Транспорт: [transport.costRaw if not empty][, transport.details if not empty]

🌡 *Умови праці*
- Робочий одяг: [conditions.workwearFree ? "Безкоштовно" : "За рахунок працівника"]
- Харчування: [conditions.foodType]

📝 *Додаткова інформація*
[additionalNotes if not empty]

IMPORTANT: Return ONLY the formatted post text.
Rules:
- Write in Ukrainian
- Use ONLY • for bullet points
- Do NOT repeat location after title
- Use Markdown bold (*text*) for section headers
- Split description by semicolons into bullet points with •
- If entire block has no data — skip it completely
- Return ONLY the formatted post text, no JSON, no explanations
`;

const CREATE_TEMPLATE_PROMPT = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: Create a reusable job template from a parsed vacancy JSON.

The template should:
1. Extract the BRAND/COMPANY name from title or description
2. Generate a short descriptive templateName: "[Brand] [City] - [Short job description]"
   Example: "Aurora Kąty Wrocławskie - Склад одягу та аксесуарів"
3. Generate keywords array (5-10 items): brand name, location, key job terms in Ukrainian, Polish and Russian variants
4. Map ALL fields to Structure 2.0 (salary.baseNetto, schedule.shiftsCount, etc.)
5. Set agencyName to the value from vacancy, or "Unknown" if not specified

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
      score += 15; // брэнд знойдзены

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

    // Выкарыстоўваем templateSlim для эканоміі токенаў і дакладнасці (як у арыгінале)
    const templateSlim = {
      title: template.title,
      location: template.location,
      voivodeship: template.voivodeship,
      agencyName: template.agencyName,
      salary: template.salary,
      schedule: template.schedule,
      description: template.description,
      accommodation: template.accommodation,
      transport: template.transport,
      requirements: template.requirements,
      conditions: template.conditions,
      contractType: template.contractType,
      additionalNotes: template.additionalNotes,
      arrivalDate: template.arrivalDate,
      count: template.count,
    };

    const content = `TEMPLATE:\n${JSON.stringify(templateSlim, null, 2)}\n\nMESSAGE:\n${rawText}`;
    const text = await groqRequest(MERGE_PROMPT, content, true);

    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    const merged = JSON.parse(cleanJson);
    if (template.additionalNotes && !merged.additionalNotes)
      merged.additionalNotes = template.additionalNotes;

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
    console.log(`🤖 Парсинг v2.0 з жорсткай валідацыяй...`);

    const SYSTEM_INSTRUCTION = `
ROLE: Professional HR Dispatcher.
TASK: Parse job vacancy into JSON v2.0.

CRITICAL: The following fields are REQUIRED by the database. If info is missing, use default values:
- "voivodeship": extract or put "Польща"
- "salary": { "baseNetto": "не вказано" }
- "accommodation": { "type": "Платне" }
- "category": "Інше"
- "vacancydescription": "extract full text here" (IMPORTANT: use this exact key, not 'description')

Return ONLY valid JSON.`;

    const text = await groqRequest(
      SYSTEM_INSTRUCTION,
      `Input text:\n${rawText}`,
      true,
    );
    let parsed = JSON.parse(text);

    // БЕЗПЕКА: Калі AI забыўся на нейкае поле, дадаем яго ўручную перад базай
    return {
      title: parsed.title || "Нова вакансія",
      voivodeship: parsed.voivodeship || "Польща",
      category: parsed.category || "Інше",
      vacancydescription:
        parsed.vacancydescription || parsed.description || rawText, // Мапім апісанне
      salary: {
        baseNetto: parsed.salary?.baseNetto || "не вказано",
        studentNetto: parsed.salary?.studentNetto || "",
        hoursRange: parsed.salary?.hoursRange || "",
        payoutDates: parsed.salary?.payoutDates || "",
        bonusDetails: parsed.salary?.bonusDetails || "",
      },
      accommodation: {
        type: parsed.accommodation?.type || "Платне",
        costRaw: parsed.accommodation?.costRaw || "",
        details: parsed.accommodation?.details || "",
      },
      requirements: {
        gender: parsed.requirements?.gender || ["Пари"],
        ageMax: parsed.requirements?.ageMax || null,
        standardDocs: parsed.requirements?.standardDocs || [],
      },
      // ... дадайце астатнія палі па аналогіі
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
