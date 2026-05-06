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
const modelCooldowns = new Map();

/**
 * Вылічвае час да наступнай спробы:
 * - Калі зараз ноч (да 7 ранку) -> да 07:00
 * - Калі зараз дзень (пасля 7 ранку) -> да пачатку наступнай гадзіны
 */
function getMsUntilNextRetry() {
  const now = new Date();
  const target = new Date();

  if (now.getHours() < 7) {
    target.setHours(7, 0, 0, 0);
  } else {
    target.setHours(now.getHours() + 1, 0, 0, 0);
  }
  return target.getTime() - now.getTime();
}

const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Compare NEW_MESSAGE with TODAY_MESSAGES and TODAY_VACANCIES.

VERDICTS:
- "DUPLICATE": 100% semantic match with something already received TODAY. Same job, same city, same conditions.
- "UPDATE": Same job/brand/city, but different salary, dates, or requirements.
- "NEW": Completely different job or location that hasn't appeared today.

CLASSIFICATION RULES:
FULL_VACANCY — ONLY if a SINGLE job offer has ALL THREE:
  ✅ Specific position name ("Зварювальник MIG-MAG", "Склад товарів")
  ✅ Specific city or address ("Trzeboś", "48703 Stadtlohn")
  ✅ Specific salary rate ("26 zł/h", "16€/h netto")
  ❌ NOT FULL_VACANCY if: multi-location list, "X людей на тиждень", candidate profiles, recruiter chat.

MULTI_VACANCY — message contains 2+ SEPARATE full job offers, each with own position + location + salary block.

UPDATE — use for:
  • Multi-location lists with brief info ("Eurocash Lublin 2ч, Kraków 2ч")
  • Headcount/date changes, candidate profiles, recruiter chat.

RECRUITER_INFO — legal/logistics only (PESEL, visa rules, office hours).
NOISE — greetings, reactions, @mentions only, system messages.

Output ONLY JSON:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE" | "MULTI_VACANCY",
  "vacancyCount": 1,
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

  // Калі ўсе Gemini недаступныя — фолбэк на Groq (Stage 1)
  console.log("🛡️ Gemini недаступныя. Пераход на Groq для класіфікацыі...");
  return await aiService.analyzeWithGroq(text, recentMessages, recentVacancies);
}

module.exports = { analyzeAndCompareWithGemini };
