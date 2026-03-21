// backend/services/ai.service.js
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

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
- If message mentions gender → update requirements.gender only
- If message mentions arrival date (e.g. "приїзд 20.03", "набір 15.04") → update arrivalDate field. ALWAYS keep the original format (e.g. "23.03", never "2023-03-23").
- If message mentions housing change → update accommodation fields
- If message mentions salary change → update salary fields
- If message mentions schedule change → update schedule fields
- If message mentions nationalities → update requirements.nationalities
- If field is NOT mentioned in message → keep template value EXACTLY as is

Return ONLY valid JSON with the complete merged result using this structure:
{
  "title": "string",
  "location": "string",
  "country": "string",
  "agencyName": "string",
  "arrivalDate": "string or null",
  "count": "number or null",
  "salary": {
    "base": "string",
    "student": "string",
    "monthly": "string",
    "bonus": "string",
    "notes": "string"
  },
  "schedule": {
    "shifts": "string",
    "hours": "string",
    "details": "string"
  },
  "description": "string",
  "accommodation": {
    "available": true,
    "cost": "string",
    "details": "string",
    "deposit": "string"
  },
  "transport": {
    "provided": true,
    "cost": "string",
    "details": "string"
  },
  "requirements": {
    "gender": "string",
    "age": "string",
    "nationalities": ["string"],
    "docs": ["string"],
    "physical": "string"
  },
  "conditions": {
    "temperature": "string",
    "workwear": "string",
    "food": "string",
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
👥 Набір: [requirements.gender][, приїзд [arrivalDate] if arrivalDate exists - use EXACTLY as stored, never convert to ISO format]

💰 *Оплата праці*
[salary.base]
[salary.monthly if not empty]
[salary.student if not empty]
[salary.bonus if not empty]

🛠 *Характер роботи*
- [each item from description split by semicolon on new line with •]

📋 *Вимоги*
- [requirements.age if not empty]
- [requirements.docs joined by ", " if not empty — skip contractType values like "Umowa Zlecenie"]
- [requirements.nationalities if contains more than just "Україна"]

🕒 *Графік роботи*
[schedule.shifts — write full human-readable text, e.g. "2 зміни по 10 годин" not just "2"]
[schedule.details if not empty]
[schedule.hours if not empty — write full text, e.g. "160-200 годин/міс" not just "160-200"]

📄 Тип договору: [contractType — write full name: "Umowa zlecenie" or "Umowa o pracę", never abbreviate]

🏠 *Проживання*
[if accommodation.available = false → write "Житло не надається"]
[if accommodation.available = true → accommodation.cost]
[accommodation.details if not empty]
[accommodation.deposit if not empty]

🚌 Транспорт: [transport.cost — write full text with units, e.g. "200 zł/міс" not just "200"][, transport.details if not empty]

🌡 *Умови праці*
- [conditions.temperature if not empty]
- [conditions.workwear if not empty]
- [conditions.food if not empty]
- [requirements.physical if not empty]

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
- requirements.physical goes into Умови праці block, NOT into Вимоги block
- conditions.notes is an ADDRESS — do NOT put it into Умови праці, skip it entirely in the post
- Return ONLY the formatted post text, no JSON, no explanations
`;

const CREATE_TEMPLATE_PROMPT = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: Create a reusable job template from a parsed vacancy JSON.

The template should:
1. Extract the BRAND/COMPANY name from title or description
2. Generate a short descriptive templateName: "[Brand] [City] - [Short job description]"
   Example: "Aurora Kąty Wrocławskie - Склад одягу та аксесуарів"
   Example: "BREMBO Dąbrowa Górnicza - Виробництво гальмівних дисків"
3. Generate keywords array (5-10 items): brand name, location, key job terms in Ukrainian, Polish and Russian variants
4. Keep ALL other fields exactly as in the vacancy data
5. Set agencyName to the value from vacancy, or "Unknown" if not specified

Return ONLY valid JSON with this structure:
{
  "templateName": "string",
  "agencyName": "string",
  "keywords": ["string"],
  "title": "string",
  "location": "string",
  "country": "string",
  "salary": { "base": "string", "student": "string", "monthly": "string", "bonus": "string", "notes": "string" },
  "schedule": { "shifts": "string", "hours": "string", "details": "string" },
  "description": "string",
  "accommodation": { "available": true, "cost": "string", "details": "string", "deposit": "string" },
  "transport": { "provided": true, "cost": "string", "details": "string" },
  "requirements": { "gender": "string", "age": "string", "nationalities": ["string"], "docs": ["string"], "physical": "string" },
  "conditions": { "temperature": "string", "workwear": "string", "food": "string", "notes": "string" },
  "contractType": "string",
  "additionalNotes": "string"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
`;

// --- ДАПАМОЖНАЯ ФУНКЦЫЯ ---
async function groqRequest(systemPrompt, userContent, jsonMode = true) {
  // Затрымка каб не перавышаць rate limit
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

// --- ФУНКЦЫЯ 1: Вызначэнне шаблона ---
async function identifyTemplate(rawText, templates) {
  const lowerText = rawText.toLowerCase();

  console.log(`🔍 Пошук шаблона сярод ${templates.length} варыянтаў...`);

  // Збіраем усе брэнды з шаблонаў
  const allBrands = templates.map((t) => ({
    brand: t.templateName.split(" ")[0].toLowerCase(),
    id: t._id.toString(),
  }));

  // Шукаем якія брэнды ёсць у тэксце
  const mentionedBrands = allBrands.filter((b) => lowerText.includes(b.brand));

  // ⚠️ КЛЮЧАВАЯ ПРАБЛЕМА: калі брэнд не знойдзены — не рабіць лакальны пошук
  // Ключавыя словы без брэнда не могуць ідэнтыфікаваць шаблон надзейна
  if (mentionedBrands.length === 0) {
    console.log(`⚠️ Брэнд у тэксце не знойдзены — пераходзім да AI...`);
  } else {
    // Лакальны пошук ТОЛЬКІ калі брэнд знойдзены
    let bestMatch = null;
    let maxScore = 0;

    templates.forEach((t) => {
      const brandName = t.templateName.split(" ")[0].toLowerCase();

      // Прапускаем шаблоны якіх брэнд не згадваецца ў тэксце
      const matchesThisBrand = mentionedBrands.some(
        (b) => b.brand === brandName,
      );
      if (!matchesThisBrand) return;

      let score = 0;
      score += 15; // брэнд знойдзены — аснова

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

  // AI fallback — адпраўляем толькі сціслы спіс (не поўныя шаблоны)
  console.log(`🤖 Лакальны пошук не знайшоў — пытаемся ў AI...`);

  try {
    // Адпраўляем толькі назву + location + brand — без keywords
    // Гэта зніжае памер запыту ў ~5 разоў
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
      if (matched) {
        console.log(`✅ AI знайшоў шаблон: ${matched.templateName}`);
        return matched;
      }
    }
  } catch (err) {
    console.error("❌ AI identify error:", err.message);
  }

  console.log(`⚠️ Шаблон не знойдзены. Вакансія будзе апрацавана як новая.`);
  return null;
}

// --- ФУНКЦЫЯ 2: Мерж шаблона ---
async function mergeWithTemplate(rawText, template) {
  try {
    console.log(
      `🤖 Мерж шаблона "${template.templateName}" з повідомленням...`,
    );

    const templateSlim = {
      title: template.title,
      location: template.location,
      country: template.country,
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
    };

    const content = `TEMPLATE:\n${JSON.stringify(templateSlim, null, 2)}\n\nMESSAGE:\n${rawText}`;
    const text = await groqRequest(MERGE_PROMPT, content, true);

    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    const merged = JSON.parse(cleanJson);

    if (template.additionalNotes && !merged.additionalNotes) {
      merged.additionalNotes = template.additionalNotes;
    }

    console.log(`✅ Мерж успішний`);
    return merged;
  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    if (error instanceof SyntaxError) {
      throw new Error("INVALID_JSON_RESPONSE");
    }
    throw error;
  }
}

// --- ФУНКЦЫЯ 3: Фарматаванне паста ---
async function formatTelegramPost(vacancyData) {
  try {
    console.log(`🤖 Форматування Telegram-посту...`);
    const text = await groqRequest(
      FORMAT_PROMPT,
      `DATA:\n${JSON.stringify(vacancyData, null, 2)}`,
      false,
    );
    console.log(`✅ Пост відформатовано`);
    return text.trim();
  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    throw error;
  }
}

// --- ФУНКЦЫЯ 4: Парсінг без шаблона ---
async function parseVacancyWithAI(rawText) {
  try {
    console.log(`🤖 Парсинг без шаблону (Groq Llama)...`);

    const SYSTEM_INSTRUCTION = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: Parse job vacancy text into structured JSON in UKRAINIAN.

IMPORTANT RULES:
- "title": ALWAYS include company/brand name + short job description. Format: "[Brand] [City] - [Job]". Example: "Aurora Kąty Wrocławskie - Склад одягу та аксесуарів". Never use generic "Складський працівник" without brand.
- "location": city name only. If Netherlands — add "(Нідерланди)".
- "agencyName": recruitment agency name ONLY if explicitly mentioned, otherwise "Manual".
- "contractType": full name — "Umowa zlecenie" or "Umowa o pracę", never abbreviate.
- "salary.base": ALWAYS include units. Example: "31,40 zł/год brutto". Never just "31.40".
- "salary.monthly": monthly total with description.
- "salary.student": student rate if mentioned.
- "salary.bonus": bonuses with full description including units.
- "schedule.shifts": FULL text. Example: "2 зміни по 10 годин (06:00–16:30 та 18:00–04:30)". Never just "2".
- "schedule.hours": FULL text with units. Example: "160–200 годин/міс". Never just "160-200".
- "schedule.details": work days, breaks, rotation schedule.
- "description": duties as semicolon-separated list in Ukrainian.
- "accommodation.available": true/false. If "Житло не надається" → false.
- "accommodation.cost": cost with units.
- "transport.provided": true if transport mentioned.
- "transport.cost": ALWAYS with units. Example: "200 zł/міс". Never just "200".
- "transport.details": pickup points, route details.
- "requirements.gender": "жінки", "чоловіки", "жінки та чоловіки".
- "requirements.age": full text. Example: "до 55 років".
- "requirements.nationalities": array, empty if not specified.
- "requirements.docs": ONLY real documents: ["CV", "санепід", "UDT", "водійське посвідчення кат. B"]. Never put contract type here.
- "requirements.physical": physical requirements, language requirements, experience.
- "conditions.temperature": temperature if mentioned.
- "conditions.workwear": work clothes info.
- "conditions.food": food/kitchen info.
- "conditions.notes": STREET ADDRESS ONLY. Example: "ul. Logistyczna 4, Kąty Wrocławskie".
- "additionalNotes": signing date, start date, available spots, security rules, phone bans.

Return ONLY valid JSON. No markdown. No explanations.`;

    const text = await groqRequest(
      SYSTEM_INSTRUCTION,
      `Input text:\n${rawText}`,
      true,
    );

    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    return JSON.parse(cleanJson);
  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    if (error instanceof SyntaxError) {
      console.warn("⚠️ JSON не парситься, використовуємо базовий об'єкт");
      return {
        title: rawText.substring(0, 40) + "...",
        location: "Польща",
        agencyName: "Manual",
        salary: { base: "", student: "", bonus: "" },
        schedule: { shifts: "", hours: "", details: "" },
        description: rawText.substring(0, 500),
        accommodation: { available: false, cost: "", details: "" },
        transport: { provided: false, cost: "", details: "" },
        requirements: { gender: "", age: "", nationalities: [], docs: [] },
        conditions: { temperature: "", workwear: "", food: "", notes: "" },
        contractType: "",
        additionalNotes: "",
      };
    }
    throw error;
  }
}

// --- ФУНКЦЫЯ 5: Стварэнне шаблона з вакансіі ---
async function createTemplateFromVacancy(vacancyData) {
  try {
    console.log(`🤖 Створення шаблону з вакансії...`);

    const text = await groqRequest(
      CREATE_TEMPLATE_PROMPT,
      `VACANCY DATA:\n${JSON.stringify(vacancyData, null, 2)}`,
      true,
    );

    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    const template = JSON.parse(cleanJson);
    console.log(`✅ Шаблон створено: ${template.templateName}`);
    return template;
  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    console.error("❌ Помилка створення шаблону:", error.message);
    return null;
  }
}

async function testConnection() {
  try {
    await groqRequest("You are helpful.", "Test", false);
    console.log("✅ Groq Llama доступний");
    return true;
  } catch (error) {
    console.error("❌ Groq API недоступний:", error.message);
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
