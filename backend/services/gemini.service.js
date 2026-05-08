// backend/services/gemini.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const aiService = require("./ai.service");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_CONFIG = [
  { name: "gemini-2.5-flash", apiVersion: "v1beta" },
  { name: "gemini-2.5-flash-lite", apiVersion: "v1beta" },
  { name: "gemini-2.0-flash", apiVersion: "v1beta" },
  { name: "gemini-2.0-flash-lite", apiVersion: "v1beta" },
];

const geminiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const modelCooldowns = new Map();

function getMsUntilNextRetry() {
  const now = new Date();
  const target = new Date();
  if (now.getHours() < 7) {
    target.setHours(7, 0, 0, 0);
  } else {
    target.setDate(now.getDate() + 1);
    target.setHours(7, 0, 0, 0);
  }
  return target.getTime() - now.getTime();
}

const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify and translate NEW_MESSAGE by comparing it with RECENT_MESSAGES and RECENT_VACANCIES.

SMART DEDUPLICATION RULES:
- Verdict "DUPLICATE": If the core information (Job, City, Salary, Requirements) is the same as in RECENT_MESSAGES or RECENT_VACANCIES.
- CRITICAL: Ignore differences in emojis, greetings ("Доброго дня", "Привіт"), or minor punctuation. If the essence is the same -> it's a DUPLICATE.
- Verdict "UPDATE": If it's the same job/factory but something important changed (new date, new salary, or "STOP/Closed" status).
- Verdict "NEW": If this job or location hasn't appeared today.

CLASSIFICATION RULES:
1. FULL_VACANCY — ONLY if a SINGLE job offer has:
   ✅ Position + City + Salary/Description.
   ✅ CRITICAL: Text length MUST be > 300 characters OR contain a Google Docs link.
   ❌ If the text is short (< 300 chars) and has NO Google Docs link -> classify as UPDATE.

2. MULTI_VACANCY — Message contains 2+ SEPARATE full job offers.

3. UPDATE — Short info, lists, or messages < 300 chars without a Google Docs link.

4. RECRUITER_INFO — Questions between recruiters, legal info (PESEL, visa), office updates.

5. NOISE — Greetings only, system messages, reactions.

STRICT TRANSLATION RULE:
- Always translate to UKRAINIAN. Keep city names in POLISH (Latin).

Output ONLY JSON:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE" | "MULTI_VACANCY",
  "vacancyCount": number,
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
    if (modelCooldowns.has(modelCfg.name)) {
      if (now < modelCooldowns.get(modelCfg.name)) continue;
      else modelCooldowns.delete(modelCfg.name);
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
`;

      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: userContent },
      ]);

      const response = await result.response;
      const cleanJson = response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      const parsed = JSON.parse(cleanJson);

      geminiCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
      return parsed;
    } catch (error) {
      const errorMsg = error.message || "";
      if (
        errorMsg.includes("429") ||
        errorMsg.includes("Quota") ||
        errorMsg.includes("limit")
      ) {
        const cooldownMs = getMsUntilNextRetry();
        modelCooldowns.set(modelCfg.name, now + cooldownMs);
        console.warn(
          `🚫 Gemini ${modelCfg.name}: Ліміт. Паўза да ${new Date(now + cooldownMs).toLocaleTimeString()}`,
        );
        continue;
      }
      console.error(
        `⚠️ Gemini ${modelCfg.name} памылка:`,
        errorMsg.substring(0, 100),
      );
    }
  }

  console.log("🛡️ Gemini недаступныя. Пераход на Groq для класіфікацыі...");
  return await aiService.analyzeWithGroq(text, recentMessages, recentVacancies);
}

module.exports = { analyzeAndCompareWithGemini };
