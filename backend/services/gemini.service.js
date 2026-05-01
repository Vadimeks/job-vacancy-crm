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

// Мапа для замарожаных мадэляў
const modelCooldowns = new Map();

/**
 * Вылічвае колькасць мілісекунд да 07:00 раніцы наступнага дня
 */
function getMsUntilSevenAM() {
  const now = new Date();
  const tomorrowSeven = new Date();

  tomorrowSeven.setDate(now.getDate() + 1);
  tomorrowSeven.setHours(7, 0, 0, 0);

  return tomorrowSeven.getTime() - now.getTime();
}

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

  const now = Date.now();

  for (const modelCfg of MODELS_CONFIG) {
    // ПРАВЕРКА: Ці не замарожана мадэль?
    if (modelCooldowns.has(modelCfg.name)) {
      const cooldownUntil = modelCooldowns.get(modelCfg.name);
      if (now < cooldownUntil) {
        continue; // Пропускаем, мадэль яшчэ адпачывае
      } else {
        modelCooldowns.delete(modelCfg.name); // Час адпачынку прайшоў
      }
    }

    try {
      console.log(`🔍 Gemini (${modelCfg.name}): Аналіз...`);
      const model = genAI.getGenerativeModel(
        { model: modelCfg.name },
        { apiVersion: modelCfg.apiVersion },
      );

      const userContent = `
RECENT_MESSAGES: ${JSON.stringify(recentMessages.slice(0, 10))}
RECENT_VACANCIES: ${JSON.stringify(recentVacancies.slice(0, 5))}
NEW_MESSAGE: ${text}

CATEGORIES: 
- FULL_VACANCY: Detailed job offer. MUST contain: Position name, Location, AND at least one of: Salary details or Job Duties. 
  CRITICAL: If the message is shorter than 300 characters, classify as UPDATE.
- UPDATE: Short info, changes to existing jobs, lists of vacancies without full details, or "STOP/Closed" messages.
- RECRUITER_INFO: Legal updates (PESEL, UKR status), office info, or general recruitment rules.
- NOISE: Greetings, social talk, system notifications.

VERDICTS: NEW, DUPLICATE, UPDATE.

Output JSON structure:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE",
  "comparison": { "verdict": "NEW" | "DUPLICATE" | "UPDATE", "reason": "short explanation in Ukrainian" },
  "translatedText": "Clean Ukrainian translation"
}
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
      const errorMsg = error.message || "";
      const isQuotaError =
        errorMsg.includes("429") ||
        errorMsg.includes("Quota") ||
        errorMsg.includes("limit");

      if (isQuotaError) {
        const cooldownMs = getMsUntilSevenAM();
        modelCooldowns.set(modelCfg.name, now + cooldownMs);
        console.warn(
          `🚫 Gemini ${modelCfg.name}: Ліміт дасягнуты. Замарозка да 07:00 раніцы.`,
        );
      } else {
        console.warn(
          `⚠️ Gemini ${modelCfg.name} памылка: ${errorMsg.substring(0, 100)}`,
        );
      }
      continue;
    }
  }

  // Калі ўсе Gemini недаступныя — выкарыстоўваем Groq
  console.log(
    "🛡️ Усе мадэлі Gemini на паўзе. Пераход на Groq (llama-3.1-8b-instant)...",
  );
  return await aiService.analyzeWithGroq(
    text,
    recentMessages,
    recentVacancies,
    "llama-3.1-8b-instant",
  );
}

module.exports = { analyzeAndCompareWithGemini };
