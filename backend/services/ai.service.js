// backend/services/ai.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- СІСТЭМНЫ ПРОМПТ ДЛЯ ВЫЗНАЧЭННЯ АГЕНЦЫІ/ШАБЛОНА ---
const IDENTIFY_PROMPT = `
ROLE: HR Dispatcher assistant.
TASK: Identify which agency and job template this message belongs to.

You will receive:
1. A message from a Telegram chat
2. A list of available templates with their keywords

Return ONLY a JSON object:
{
  "templateId": "the _id of the matched template, or null if no match",
  "confidence": "high/medium/low",
  "reason": "brief explanation in Ukrainian"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
`;

// --- СІСТЭМНЫ ПРОМПТ ДЛЯ МЕРЖАВАННЯ ШАБЛОНА З НОВЫМІ ДАДЗЕНЫМІ ---
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
- If message mentions count (e.g. "2 жінки", "5 чоловіків") → set count field (number only, e.g. 2)
- If message mentions gender → update requirements.gender only
- If message mentions arrival date (e.g. "приїзд 20.03", "набір 15.04") → update arrivalDate field
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
    "food": "string"
  },
  "contractType": "string"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
`;

// --- ПРОМПТ ДЛЯ ФАРМАТАВАННЯ ФІНАЛЬНАГА ПАСТА ---
const FORMAT_PROMPT = `
ROLE: Professional HR content formatter.
TASK: Format the job data into a beautiful Telegram post in UKRAINIAN.

Use this EXACT structure (skip blocks if data is empty/null/empty string):

*[title]*
👥 Набір: [count] [requirements.gender][, приїзд [arrivalDate] if arrivalDate exists]

💰 *Оплата праці*
[salary.base]
[salary.monthly if not empty]
[salary.student if not empty]
[salary.bonus if not empty]

🛠 *Характер роботи*
- [each item from description split by semicolon on new line with •]

📋 *Вимоги*
- [requirements.age if not empty]
- [requirements.docs joined by ", " if not empty]
- [requirements.nationalities if contains more than just "Україна"]

🕒 *Графік роботи*
[schedule.shifts]
[schedule.details if not empty]
[schedule.hours if not empty]

📄 Тип договору: [contractType]

🏠 *Проживання*
[accommodation.cost]
[accommodation.details if not empty]
[accommodation.deposit if not empty]

🚌 Транспорт: [transport.cost][, transport.details if not empty]

🌡 *Умови праці*
- [conditions.temperature if not empty]
- [conditions.workwear if not empty]
- [conditions.food if not empty]
- [requirements.physical if not empty]

Rules:
- Write in Ukrainian
- Use ONLY • for bullet points, never use "- •" or "-" before bullets
- Do NOT repeat location after title — title already contains location info
- Use Markdown bold (*text*) for section headers as shown
- Split description by semicolons into bullet points with •
- If entire block has no data — skip it completely, do not write the header
- requirements.physical goes into Умови праці block, NOT into Вимоги block
- Return ONLY the formatted post text, no JSON, no explanations
`;

// --- ФУНКЦЫЯ 1: Вызначэнне шаблона па тэксту паведамлення ---
async function identifyTemplate(rawText, templates) {
  // Спачатку спрабуем знайсці па ключавых словах (хутка, без AI)
  const lowerText = rawText.toLowerCase();
  const found = templates.find((t) =>
    t.keywords.some((kw) => lowerText.includes(kw.toLowerCase())),
  );

  if (found) {
    console.log(`✅ Шаблон знойдзены па ключавым слове: ${found.templateName}`);
    return found;
  }

  // Калі не знайшлі па словах — пытаемся ў AI
  console.log(`🤖 Ключавыя словы не знайшлі. Пытаемся ў AI...`);
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const templateList = templates.map((t) => ({
      _id: t._id.toString(),
      templateName: t.templateName,
      agencyName: t.agencyName,
      keywords: t.keywords,
    }));

    const prompt = `${IDENTIFY_PROMPT}\n\nMESSAGE:\n${rawText}\n\nAVAILABLE TEMPLATES:\n${JSON.stringify(templateList, null, 2)}`;
    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    if (parsed.templateId) {
      const matched = templates.find(
        (t) => t._id.toString() === parsed.templateId,
      );
      if (matched) {
        console.log(
          `✅ AI знайшоў шаблон: ${matched.templateName} (${parsed.confidence})`,
        );
        return matched;
      }
    }
  } catch (err) {
    console.error("❌ AI identify error:", err.message);
  }

  console.log(`⚠️ Шаблон не знойдзены`);
  return null;
}

// --- ФУНКЦЫЯ 2: Мерж шаблона з новымі дадзенымі з паведамлення ---
async function mergeWithTemplate(rawText, template) {
  try {
    console.log(
      `🤖 Мерж шаблона "${template.templateName}" з паведамленнем...`,
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const prompt = `${MERGE_PROMPT}\n\nTEMPLATE:\n${JSON.stringify(template, null, 2)}\n\nMESSAGE:\n${rawText}`;
    const result = await model.generateContent(prompt);

    let cleanJson = result.response.text().trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    const merged = JSON.parse(cleanJson);
    console.log(`✅ Мерж паспяховы`);
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

// --- ФУНКЦЫЯ 3: Фарматаванне гатовага Telegram-паста ---
async function formatTelegramPost(vacancyData) {
  try {
    console.log(`🤖 Фарматаванне Telegram-паста...`);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.3,
      },
    });

    const prompt = `${FORMAT_PROMPT}\n\nDATA:\n${JSON.stringify(vacancyData, null, 2)}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    console.log(`✅ Пост сфарматаваны`);
    return text;
  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    throw error;
  }
}

// --- СТАРАЯ ФУНКЦЫЯ (пакідаем для сумяшчальнасці) ---
async function parseVacancyWithAI(rawText) {
  try {
    console.log(`🤖 Парсінг без шаблона (Gemini 2.5 Flash)...`);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });

    const SYSTEM_INSTRUCTION = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: Parse job vacancy text into structured JSON in UKRAINIAN.

RULES:
- "title": short professional job title in Ukrainian (e.g. "Збір спаржі", "Виробництво морозива", "Догляд за квітами"). NOT "Новая вакансія".
- "location": city name only (e.g. "Освенцим", "Намислув"). If Netherlands — add "(Нідерланди)".
- "agencyName": recruitment agency name ONLY if explicitly mentioned, otherwise "Manual". Factory/farm names are NOT agencies.
- "contractType": "zlecenie" if "umowa zlecenie", "o_prace" if "umowa o pracę", otherwise ""
- "salary.base": hourly rate as string (e.g. "22,63 zł нетто/год", "17,55 € брутто/год")
- "salary.monthly": monthly earnings (e.g. "2800-3800 € брутто/міс")
- "salary.student": student rate if mentioned
- "salary.bonus": bonuses if any
- "schedule.shifts": shift count/type (e.g. "1 зміна", "2 денні зміни", "3 зміни (6-14, 14-22, 22-06)")
- "schedule.hours": hours per month (e.g. "160-220 годин/міс")
- "schedule.details": additional schedule info (days, seasons)
- "description": duties as semicolon-separated list in Ukrainian
- "accommodation.available": true if housing mentioned, false otherwise
- "accommodation.cost": housing cost as string
- "accommodation.details": housing details
- "transport.provided": true if transport mentioned
- "transport.cost": transport cost or "безкоштовно"
- "transport.details": transport details
- "requirements.gender": "жінки", "чоловіки", "жінки та чоловіки", or ""
- "requirements.age": age as string (e.g. "від 30 до 50 років", "без обмежень")
- "requirements.nationalities": array, empty if not specified
- "requirements.docs": required documents array (e.g. ["санепід", "карта побиту або віза"])
- "requirements.physical": physical requirements as string
- "conditions.temperature": temperature if mentioned
- "conditions.workwear": work clothes info
- "conditions.food": food/kitchen info

Return ONLY valid JSON. No markdown. No explanations.`;

    const result = await model.generateContent(
      `${SYSTEM_INSTRUCTION}\n\nInput text:\n${rawText}`,
    );

    let cleanJson = result.response.text().trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    return JSON.parse(cleanJson);
  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      throw new Error("RATE_LIMIT");
    }

    // Калі JSON не парсіцца — вяртаем базавы аб'ект
    if (error instanceof SyntaxError) {
      console.warn("⚠️ JSON не парсіцца, выкарыстоўваем базавы аб'ект");
      return {
        title: "Новая вакансія",
        location: "Польща",
        agencyName: "Manual",
        salary: { base: "", student: "", bonus: "" },
        schedule: { shifts: "", hours: "", details: "" },
        description: rawText.substring(0, 500),
        accommodation: { available: false, cost: "", details: "" },
        transport: { provided: false, cost: "", details: "" },
        requirements: { gender: "", age: "", nationalities: [], docs: [] },
        conditions: { temperature: "", workwear: "", food: "" },
        contractType: "",
      };
    }

    throw error;
  }
}

async function testConnection() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    await model.generateContent("Test");
    console.log("✅ Gemini 2.5 Flash даступны");
    return true;
  } catch (error) {
    console.error("❌ Gemini API недаступны:", error.message);
    return false;
  }
}

module.exports = {
  parseVacancyWithAI,
  identifyTemplate,
  mergeWithTemplate,
  formatTelegramPost,
  testConnection,
};
