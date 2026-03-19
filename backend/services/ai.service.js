// backend/services/ai.service.js
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// --- ПРОМПТЫ (без змен) ---
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
- If message contains recruiter-only info, security rules, "no phones" policy, or Asian students availability → ALWAYS put this into "additionalNotes".
- If message mentions new address or small workplace details → put into "conditions.notes".
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
    "food": "string",
    "notes": "string"
  },
  "contractType": "string",
  "additionalNotes": "string"
}
`;

const FORMAT_PROMPT = `
ROLE: Professional HR content formatter.
TASK: Format the job data into a beautiful Telegram post in UKRAINIAN.

Use this EXACT structure (skip blocks if data is empty/null/empty string):

*[title]*
👥 Набір: [requirements.gender][, приїзд [arrivalDate] if arrivalDate exists]

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
📝 *Додаткова*
[additionalNotes if not empty]

IMPORTANT: Return ONLY the formatted post text.
Rules:
- Write in Ukrainian
- Use ONLY • for bullet points
- Do NOT repeat location after title
- Use Markdown bold (*text*) for section headers
- Split description by semicolons into bullet points with •
- If entire block has no data — skip it completely
- requirements.physical goes into Умови праці block
- Return ONLY the formatted post text, no JSON, no explanations
`;

// --- ДАПАМОЖНАЯ ФУНКЦЫЯ для запыту да Groq ---
async function groqRequest(systemPrompt, userContent, jsonMode = true) {
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

  let bestMatch = null;
  let maxScore = 0;

  // 1. ЛАКАЛЬНЫ ПОШУК ПА БАЛАХ (Scoring System)
  templates.forEach((t) => {
    let score = 0;

    // Вызначаем асноўнае імя брэнда (першае слова з назвы шаблона, напр. "ARVATO")
    const brandName = t.templateName.split(" ")[0].toLowerCase();

    // Прыярытэт №1: Назва прадпрыемства/брэнду (+15 балаў)
    if (lowerText.includes(brandName)) {
      score += 15;
    }

    // Прыярытэт №2: Дакладнае супадзенне лакацыі (+7 балаў)
    if (t.location && lowerText.includes(t.location.toLowerCase())) {
      score += 7;
    }

    // Прыярытэт №3: Ключавыя словы з масіва (+1 бал за кожнае)
    if (t.keywords && Array.isArray(t.keywords)) {
      t.keywords.forEach((kw) => {
        if (lowerText.includes(kw.toLowerCase())) {
          score += 1;
        }
      });
    }

    // Калі гэты шаблон набраў больш балаў за папярэдні — запамінаем яго
    if (score > maxScore) {
      maxScore = score;
      bestMatch = t;
    }
  });

  // Калі максімальны бал дастаткова высокі (мінімум супадзенне брэнда або лакацыі + тэгаў)
  // Парог 10 азначае, што мы ўпэўнены, бо знайшлі брэнд або лакацыю з тэгамі
  if (bestMatch && maxScore >= 10) {
    console.log(
      `✅ Шаблон знойдзены лакальна: ${bestMatch.templateName} (Score: ${maxScore})`,
    );
    return bestMatch;
  }

  // 2. КАЛІ ЛАКАЛЬНЫ ПОШУК НЕ ДАЎ ВЫНІКУ — ЗВАРОТ ДА AI
  console.log(
    `🤖 Лакальны пошук непэўны (Max Score: ${maxScore}). Пытаемся ў AI...`,
  );

  try {
    const templateList = templates.map((t) => ({
      _id: t._id.toString(),
      templateName: t.templateName,
      agencyName: t.agencyName,
      keywords: t.keywords,
    }));

    const content = `MESSAGE:\n${rawText}\n\nAVAILABLE TEMPLATES:\n${JSON.stringify(templateList, null, 2)}`;
    const text = await groqRequest(IDENTIFY_PROMPT, content, true);
    const parsed = JSON.parse(text);

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

  console.log(`⚠️ Шаблон не знойдзены ні лакальна, ні праз AI`);
  return null;
}

// --- ФУНКЦЫЯ 2: Мерж шаблона ---
async function mergeWithTemplate(rawText, template) {
  try {
    console.log(
      `🤖 Мерж шаблона "${template.templateName}" з паведамленнем...`,
    );

    const content = `TEMPLATE:\n${JSON.stringify(template, null, 2)}\n\nMESSAGE:\n${rawText}`;
    const text = await groqRequest(MERGE_PROMPT, content, true);

    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    const merged = JSON.parse(cleanJson);
    // Калі ў шаблоне былі нататкі, а AI вярнуў пусты радок або null - захоўваем старыя нататкі
    if (template.additionalNotes && !merged.additionalNotes) {
      merged.additionalNotes = template.additionalNotes;
    }
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

// --- ФУНКЦЫЯ 3: Фарматаванне паста ---
async function formatTelegramPost(vacancyData) {
  try {
    console.log(`🤖 Фарматаванне Telegram-паста...`);
    const text = await groqRequest(
      FORMAT_PROMPT,
      `DATA:\n${JSON.stringify(vacancyData, null, 2)}`,
      false,
    );
    console.log(`✅ Пост сфарматаваны`);
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
    console.log(`🤖 Парсінг без шаблона (Groq Llama)...`);

    const SYSTEM_INSTRUCTION = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: Parse job vacancy text into structured JSON in UKRAINIAN.

RULES:
- "title": short professional job title in Ukrainian. NOT "Новая вакансія".
- "location": city name only. If Netherlands — add "(Нідерланди)".
- "agencyName": recruitment agency name ONLY if explicitly mentioned, otherwise "Manual".
- "contractType": "zlecenie" / "o_prace" / ""
- "salary.base": hourly rate as string
- "salary.monthly": monthly earnings
- "salary.student": student rate if mentioned
- "salary.bonus": bonuses if any
- "schedule.shifts": shift count/type
- "schedule.hours": hours per month
- "schedule.details": additional schedule info
- "description": duties as semicolon-separated list in Ukrainian
- "accommodation.available": true if housing mentioned
- "accommodation.cost": housing cost
- "accommodation.details": housing details
- "transport.provided": true if transport mentioned
- "transport.cost": transport cost
- "transport.details": transport details
- "requirements.gender": "жінки" / "чоловіки" / "жінки та чоловіки" / ""
- "requirements.age": age as string
- "requirements.nationalities": array
- "requirements.docs": required documents array
- "requirements.physical": physical requirements
- "conditions.temperature": temperature if mentioned
- "conditions.workwear": work clothes info
- "conditions.food": food/kitchen info
- "conditions.notes": extra workplace info (address, etc.)
- "additionalNotes": IMPORTANT recruiter notes, security rules, "no phones" policy, or special candidate requirements.

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
    await groqRequest("You are helpful.", "Test", false);
    console.log("✅ Groq Llama даступны");
    return true;
  } catch (error) {
    console.error("❌ Groq API недаступны:", error.message);
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
