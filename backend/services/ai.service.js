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
If the message does not clearly match any template by Brand Name or specific Job Title, return templateId: null. Never guess if you are not sure. It is better to return null than a wrong match.
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

    // Вызначаем асноўнае імя брэнда (напр. "ID Logistics" -> "id")
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

    if (score > maxScore) {
      maxScore = score;
      bestMatch = t;
    }
  });

  // ПАРОГ ПАВЫШАНЫ ДА 15:
  // Цяпер трэба АБО дакладнае супадзенне Брэнда (15),
  // АБО Лакацыя + мінімум 8 ключавых слоў, што малаверагодна для выпадковага супадзення.
  if (bestMatch && maxScore >= 15) {
    console.log(
      `✅ Шаблон знойдзены лакальна: ${bestMatch.templateName} (Score: ${maxScore})`,
    );
    return bestMatch;
  }

  // 2. КАЛІ ЛАКАЛЬНЫ ПОШУК НЕ ПЭЎНЫ — ЗВАРОТ ДА AI З ЖОРСТКІМІ ПРАВІЛАМІ
  console.log(
    `🤖 Лакальны пошук непэўны (Max Score: ${maxScore}). Пытаемся ў AI...`,
  );

  try {
    const templateList = templates.map((t) => ({
      _id: t._id.toString(),
      templateName: t.templateName,
      industry: t.templateName.includes("Logistics")
        ? "Logistics"
        : "Production", // Дапамагаем AI зразумець сферу
      location: t.location,
    }));

    // Строгі промпт для AI, каб пазбегнуць галюцынацый
    const STRICT_IDENTIFY_PROMPT = `
    TASK: Identify if the message matches ONE specific template from the list.
    RULES:
    1. Compare the JOB TYPE (e.g., Dairy vs Logistics) and BRAND.
    2. If the message is about food production and the template is about logistics - they DO NOT match.
    3. Return {"templateId": "ID"} ONLY if you are 90% sure.
    4. If there is no clear match, return {"templateId": null, "reason": "No match found"}.
    5. Return ONLY JSON.
    `;

    const content = `MESSAGE:\n${rawText}\n\nAVAILABLE TEMPLATES:\n${JSON.stringify(templateList, null, 2)}`;

    // Выкарыстоўваем наш стандартны groqRequest з новым строгім промптам
    const responseText = await groqRequest(
      STRICT_IDENTIFY_PROMPT,
      content,
      true,
    );
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
