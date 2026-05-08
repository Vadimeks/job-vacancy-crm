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
Task: Classify and translate NEW_MESSAGE.

!!! STRICT TRANSLATION RULE !!!:
- ALL output text MUST be in UKRAINIAN.
- If the input is in English or Russian -> TRANSLATE it to Ukrainian.
- If you translated the text, ALWAYS append the original text at the end like this:
  [Ukrainian Translation]
  \n\n--- ORIGINAL ---\n
  [Original Text]
- If the input is already in Ukrainian, just keep it as is.

CLASSIFICATION RULES:
1. FULL_VACANCY — ONLY if a SINGLE job offer has:
   ✅ Position + City + Salary/Rate.
   ✅ Text length MUST be > 200 characters OR contain a Google Docs link.

2. MULTI_VACANCY — Message contains 2+ SEPARATE full job offers.

3. UPDATE — Short job info, lists of cities, or status changes for existing jobs.

4. RECRUITER_INFO — General legal info (PESEL, visa), office updates, or general cooperation questions.

5. NOISE — Greetings, system messages, AND:
   ❌ Status of a specific candidate (e.g., "Miroshnychenko refused", "Sofiia will arrive", "I'll call you back").
   ❌ Short chat replies (e.g., "Let's do it", "Okay", "Thanks").
   ❌ Questions about photos/videos of housing.
   If the message is about the progress of a specific person -> it is NOISE.

Output ONLY JSON:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE" | "MULTI_VACANCY",
  "vacancyCount": number,
  "comparison": { "verdict": "NEW" | "DUPLICATE" | "UPDATE", "reason": "..." },
  "translatedText": "Ukrainian translation"
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

  return await aiService.analyzeWithGroq(text, recentMessages, recentVacancies);
}

module.exports = { analyzeAndCompareWithGemini };
