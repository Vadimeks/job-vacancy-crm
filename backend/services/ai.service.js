// backend/services/ai.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
ROLE: Professional HR Dispatcher for the Polish job market.
TASK: Parse job text into a FLAT JSON structure in UKRAINIAN.

STRATEGY:
1. If the input text is a FULL description: Extract all details and translate to Ukrainian.
2. If the input text is a SHORT message (e.g., "Lisner, 10 women"): Fill the fields based on the context. 
3. AGENCY VS COMPANY: 
   - "agencyName" is ONLY for recruitment firms (e.g., EVL, OTTO, Gremi).
   - Factory names (Mondelez, Lisner, LG) MUST go into "description" or "title", NOT "agencyName".
   - If no agency mentioned, set "agencyName" to "Manual".

STRICT JSON STRUCTURE:
{
  "title": "Professional title in Ukrainian",
  "location": "City name (Polish name in brackets)",
  "agencyName": "Agency name or 'Manual'",
  "salary": {
    "base": "Base rate info in Ukrainian",
    "student": "Student rate info in Ukrainian",
    "bonus": "Bonuses info"
  },
  "schedule": "Working hours info in Ukrainian",
  "description": "Full job description/duties in Ukrainian",
  "accommodation": {
    "cost": "Cost info",
    "details": "Housing info"
  },
  "transport": "Transport info as a string",
  "requirements": {
    "gender": "Gender",
    "age": "Age",
    "docs": ["Doc1", "Doc2"]
  }
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.
`;

async function parseVacancyWithAI(rawText) {
  try {
    console.log(`🤖 Выкарыстанне Gemini 2.5 Flash для парсінгу...`);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.2,        // Меней крэатыўнасці
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
        responseMimeType: "application/json"  // Важна: прымушае вяртаць JSON
      }
    });

    const prompt = `${SYSTEM_INSTRUCTION}\n\nInput text:\n${rawText}`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Ачыстка JSON ад магчымых markdown тэгаў
    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    
    // Знаходзім JSON аб'ект, нават калі ёсць лішні тэкст
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanJson);
    console.log(`✅ Парсінг паспяховы`);
    
    return parsed;
    
  } catch (error) {
    // Апрацоўка rate limit
    if (error.message?.includes("429") || error.status === 429) {
      console.error("⏱️ Rate limit: занадта шмат запытаў");
      throw new Error("RATE_LIMIT");
    }
    
    // Апрацоўка памылак парсінгу JSON
    if (error instanceof SyntaxError) {
      console.error("❌ Памылка парсінгу JSON:", error.message);
      throw new Error("INVALID_JSON_RESPONSE");
    }
    
    console.error("❌ AI Service Error:", error.message);
    throw error;
  }
}

// Функцыя для тэставання злучэння
async function testConnection() {
  try {
    console.log("🔍 Праверка Gemini API...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    await model.generateContent("Test connection");
    console.log("✅ Gemini 2.5 Flash даступны");
    return true;
  } catch (error) {
    console.error("❌ Gemini API недаступны:", error.message);
    return false;
  }
}

// Функцыя для атрымання інфармацыі пра выкарыстанне API
async function getModelInfo() {
  return {
    model: "gemini-2.5-flash",
    provider: "Google Generative AI",
    features: ["JSON parsing", "Ukrainian translation", "Context understanding"]
  };
}

module.exports = { 
  parseVacancyWithAI, 
  testConnection,
  getModelInfo
};