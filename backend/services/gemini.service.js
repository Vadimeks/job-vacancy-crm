// backend/services/gemini.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ініцыялізацыя з v1 Stable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_CONFIG = [
  { name: "gemini-2.5-flash-lite", apiVersion: "v1beta" },
  { name: "gemini-2.5-flash", apiVersion: "v1beta" },
  { name: "gemini-2.0-flash", apiVersion: "v1beta" },
  { name: "gemini-2.0-flash-lite-preview-02-05", apiVersion: "v1beta" },
];
// Кэш для эканоміі токенаў
const geminiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify a NEW_MESSAGE and compare it with RECENT_MESSAGES and RECENT_VACANCIES.

CATEGORIES:
1. FULL_VACANCY: Detailed job offer.
2. UPDATE: Lists, short requests, status changes.
3. RECRUITER_INFO: Legal, logistics, office info.
4. NOISE: Greetings, system notifications.

COMPARISON RULES (Semantic Match):
Compare NEW_MESSAGE with RECENT_MESSAGES and RECENT_VACANCIES.
Verdicts:
- "DUPLICATE": The job is the SAME. 
  * CRITICAL: Use semantic matching. "пакування кабаносів" and "виробництво ковбасних виробів" in the SAME CITY are DUPLICATES.
  * Minor changes in emojis, word order, or formatting do NOT make it a new job.
- "UPDATE": Same job/city, but IMPORTANT changes (Salary, arrival date).
- "NEW": Completely different job, city, or brand.

Output ONLY JSON:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE",
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
  // Праверка кэша
  const cacheKey = text.substring(0, 200);
  if (geminiCache.has(cacheKey)) {
    const cached = geminiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  let lastError;
  for (const modelCfg of MODELS_CONFIG) {
    try {
      console.log(`🔍 Gemini (${modelCfg.name}): Аналіз...`);
      const model = genAI.getGenerativeModel(
        { model: modelCfg.name },
        { apiVersion: modelCfg.apiVersion },
      );

      const userContent = `
RECENT_MESSAGES: ${JSON.stringify(recentMessages.slice(0, 5))}
RECENT_VACANCIES: ${JSON.stringify(recentVacancies.slice(0, 3))}
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

      // Запіс у кэш
      geminiCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
      return parsed;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Gemini ${modelCfg.name} failed: ${error.message}`);
      if (error.message.includes("429")) {
        console.warn(
          `⏳ Квота RPM для ${modelCfg.name} вычарпана. Спрабуем наступную мадэль...`,
        );
        continue; // Пераходзім да наступнай мадэлі ў спісе
      }
    }
  }

  return {
    error: true,
    category: "RECRUITER_INFO",
    comparison: { verdict: "NEW" },
    translatedText: text,
  };
}

module.exports = { analyzeAndCompareWithGemini };
