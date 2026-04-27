// backend/services/gemini.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_PRIORITY = [
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
];

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
  let lastError = null;

  const contextMessages = recentMessages.map((m) => ({
    text: m.text.substring(0, 1000),
    category: m.category,
    date: m.createdAt,
  }));

  const contextVacancies = recentVacancies.map((v) => ({
    title: v.vacancydescription,
    location: v.location,
    salary: v.salary?.baseNetto,
    date: v.createdAt,
  }));

  for (const modelName of MODELS_PRIORITY) {
    try {
      console.log(`🔍 Gemini (${modelName}): Аналіз...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const userContent = `
RECENT_MESSAGES: ${JSON.stringify(contextMessages)}
RECENT_VACANCIES: ${JSON.stringify(contextVacancies)}
NEW_MESSAGE: ${text}
      `;

      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: userContent },
      ]);
      const response = await result.response;
      let jsonText = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(jsonText);
      console.log(`✅ Gemini Verdict: ${parsed.comparison.verdict}`);
      return parsed;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Gemini ${modelName} failed: ${error.message}`);
      continue;
    }
  }
  return {
    category: "RECRUITER_INFO",
    comparison: { verdict: "NEW" },
    translatedText: text,
  };
}

module.exports = { analyzeAndCompareWithGemini };
