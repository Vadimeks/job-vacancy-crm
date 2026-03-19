// backend/services/ai.service.js
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// --- ПРОМПТЫ (без змен) ---
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
- If message contains recruiter-only info, security rules, "no phones" policy, or Asian students availability → ALWAYS put this into "additionalNotes".
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

  // --- КРОК 0: Збіраем усе брэнды з шаблонаў ---
  const allBrands = templates.map((t) => {
    // Бярэм першае слова з templateName як брэнд (напр. "ZALANDO Kąty..." → "zalando")
    return {
      brand: t.templateName.split(" ")[0].toLowerCase(),
      id: t._id.toString(),
    };
  });

  // --- КРОК 1: Калі ў паведамленні ёсць ІНШЫ брэнд — шаблон не падыходзіць ---
  // Знаходзім які брэнд згадваецца ў паведамленні
  const mentionedBrands = allBrands.filter((b) => lowerText.includes(b.brand));

  let bestMatch = null;
  let maxScore = 0;

  templates.forEach((t) => {
    let score = 0;
    const brandName = t.templateName.split(" ")[0].toLowerCase();

    // Калі ў паведамленні згадваецца іншы брэнд — гэты шаблон пропускаем
    if (mentionedBrands.length > 0) {
      const matchesThisBrand = mentionedBrands.some(
        (b) => b.brand === brandName,
      );
      if (!matchesThisBrand) return; // пропускаем
    }

    // Прыярытэт №1: Назва брэнда (+15 балаў)
    if (lowerText.includes(brandName)) {
      score += 15;
    }

    // Прыярытэт №2: Лакацыя (+7 балаў)
    if (t.location && lowerText.includes(t.location.toLowerCase())) {
      score += 7;
    }

    // Прыярытэт №3: Ключавыя словы (+1 бал за кожнае)
    if (t.keywords && Array.isArray(t.keywords)) {
      t.keywords.forEach((kw) => {
        if (lowerText.includes(kw.toLowerCase())) {
          score += 1;
        }
      });
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = t;
    }
  });

  if (bestMatch && maxScore >= 15) {
    console.log(
      `✅ Шаблон знойдзены лакальна: ${bestMatch.templateName} (Score: ${maxScore})`,
    );
    return bestMatch;
  }

  // --- КРОК 2: AI fallback ---
  console.log(
    `🤖 Лакальны пошук непэўны (Max Score: ${maxScore}). Пытаемся ў AI...`,
  );

  try {
    const templateList = templates.map((t) => ({
      _id: t._id.toString(),
      templateName: t.templateName,
      location: t.location,
      brand: t.templateName.split(" ")[0],
    }));

    const content = `MESSAGE:\n${rawText}\n\nAVAILABLE TEMPLATES:\n${JSON.stringify(templateList, null, 2)}`;

    // Выкарыстоўваем наш стандартны groqRequest з новым строгім промптам
    const responseText = await groqRequest(IDENTIFY_PROMPT, content, true);
    const parsed = JSON.parse(responseText);

    // Калі AI вярнуў ID і мы знайшлі такі шаблон
    if (parsed.templateId) {
      const matched = templates.find(
        (t) => t._id.toString() === parsed.templateId,
      );

      // Дадатковая праверка: ці не "прыдумаў" AI супадзенне для розных гарадоў?
      if (matched) {
        console.log(`✅ AI знайшоў шаблон: ${matched.templateName}`);
        return matched;
      }
    }
  } catch (err) {
    console.error("❌ AI identify error:", err.message);
  }

  console.log(
    `⚠️ Шаблон не знойдзены. Вакансія будзе апрацавана як новая (без шаблона).`,
  );
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

IMPORTANT RULES FOR SHORT TEXTS:
- If the text is very short (e.g., "Sopot Kasa"), create a title from available keywords (e.g., "Працівник на касу").
- If there is an address or street name, ALWAYS put it in "conditions.notes".
- If there is a phone number or urgent notice ("ТЕРМІНОВО"), ALWAYS put it in "additionalNotes".
- If no agency is mentioned, "agencyName" must be "Manual".

FIELD GUIDELINES:
- "title": short professional job title in Ukrainian.
- "location": city name only. If Netherlands — add "(Нідерланди)".
- "agencyName": recruitment agency name ONLY if explicitly mentioned, otherwise "Manual".
- "contractType": "zlecenie" / "o_prace" / ""
- "salary": { "base": "hourly rate", "monthly": "total", "student": "rate", "bonus": "bonuses" }
- "schedule": { "shifts": "count", "hours": "per month", "details": "extra info" }
- "description": duties as semicolon-separated list in Ukrainian.
- "accommodation": { "available": boolean, "cost": "string", "details": "string" }
- "transport": { "provided": boolean, "cost": "string", "details": "string" }
- "requirements": { "gender": "жінки/чоловіки/пари", "age": "string", "nationalities": [], "docs": [], "physical": "" }
- "conditions": { "temperature": "string", "workwear": "string", "food": "string", "notes": "STREET ADDRESS OR WORKPLACE LOCATION" }
- "additionalNotes": "PHONE NUMBERS, URGENT TAGS, SPECIAL RECRUITER NOTES".

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

    const parsed = JSON.parse(cleanJson);

    // Калі AI ўсё ж вярнуў "Нова вакансія", паспрабуем узяць першыя словы тэксту
    if (!parsed.title || parsed.title.includes("Нова вакансія")) {
      parsed.title = rawText.split(/[.\n]/)[0].substring(0, 50);
    }

    return parsed;
  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    if (error instanceof SyntaxError) {
      console.warn("⚠️ JSON не парсіцца, выкарыстоўваем базавы аб'ект");
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
