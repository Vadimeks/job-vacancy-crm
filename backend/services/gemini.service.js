// backend/services/gemini.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const aiService = require("./ai.service");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🚀 Актуальныя мадэлі на красавік 2026
const MODELS_CONFIG = [
  { name: "gemini-2.5-flash", apiVersion: "v1beta" },
  { name: "gemini-2.5-flash-lite", apiVersion: "v1beta" },
  { name: "gemini-2.0-flash", apiVersion: "v1beta" },
  { name: "gemini-2.0-flash-lite", apiVersion: "v1beta" },
];

const geminiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Compare NEW_MESSAGE with TODAY_MESSAGES and TODAY_VACANCIES.

VERDICTS:
- "DUPLICATE": 100% semantic match with something already received TODAY. Same job, same city, same conditions.
- "UPDATE": Same job/brand/city, but different salary, dates, or requirements.
- "NEW": Completely different job or location that hasn't appeared today.

CATEGORIES:
1. FULL_VACANCY: Detailed job offer (position, location, salary).
2. UPDATE: Changes to existing jobs, short lists, or status changes.
3. RECRUITER_INFO: Legal, logistics, or general recruitment info.

Output ONLY JSON:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO",
  "comparison": {
    "verdict": "NEW" | "DUPLICATE" | "UPDATE",
    "reason": "short explanation in Ukrainian"
  },
  "translatedText": "Clean Ukrainian translation"
}
`;

async function analyzeAndCompareWithGemini(
  text,
  recentMessages = [],
  recentVacancies = [],
) {
  const cacheKey = text.substring(0, 200);
  if (geminiCache.has(cacheKey)) {
    const cached = geminiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  for (const modelCfg of MODELS_CONFIG) {
    try {
      console.log(`🔍 Gemini (${modelCfg.name}): Аналіз...`);
      const model = genAI.getGenerativeModel(
        { model: modelCfg.name },
        { apiVersion: modelCfg.apiVersion },
      );

      const userContent = `
TODAY_MESSAGES: ${JSON.stringify(recentMessages.slice(0, 10))}
TODAY_VACANCIES: ${JSON.stringify(recentVacancies.slice(0, 5))}
NEW_MESSAGE: ${text}
      `;

      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: userContent },
      ]);
      const response = await result.response;
      const parsed = JSON.parse(
        response
          .text()
          .replace(/```json|```/g, "")
          .trim(),
      );

      geminiCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
      return parsed;
    } catch (error) {
      console.warn(`⚠️ Gemini ${modelCfg.name} failed: ${error.message}`);
      continue;
    }
  }

  // Калі ўсе Gemini выдалі памылку (ліміты), выкарыстоўваем Groq як апошні шанец
  console.log(
    "🛡️ Усе мадэлі Gemini недаступныя. Пераход на Groq (Llama 3.3)...",
  );
  return await aiService.analyzeWithGroq(text, recentMessages, recentVacancies);
}

module.exports = { analyzeAndCompareWithGemini };
