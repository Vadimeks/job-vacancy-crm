// backend/services/gemini.service.js
// Stage 1: Класіфікацыя паведамленняў (смецце, дублі, апдейты, вакансіі)
// Stage 2 (парсінг) — у ai.service.js праз executeAIRequest

const aiService = require("./ai.service");

const geminiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 хвілін

// Промпт максімальна просты — толькі фільтр і класіфікацыя
const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify and translate NEW_MESSAGE.

CLASSIFICATION RULES:
1. FULL_VACANCY — A complete job advertisement. 
   ✅ CRITICAL: If the message contains a detailed job description (duties, requirements, conditions) and is long (> 300 chars), it is ALWAYS FULL_VACANCY.
   ✅ Even if you recognize the brand (like NOWALIJKA or Amazon), if the post is a full ad, mark it as FULL_VACANCY.
   ❌ Do NOT mark as UPDATE if it's a standalone job offer.

2. MULTI_VACANCY — Message contains 2+ SEPARATE full job offers.

3. UPDATE — ONLY for short status changes: "need 2 more people", "rate increased", "recruitment stopped", "new dates for existing job".

4. RECRUITER_INFO — Legal info, office hours, document rules.

5. NOISE — System messages, emojis, or specific candidate status ("Ivan arrived").

Output ONLY valid JSON:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE" | "MULTI_VACANCY",
  "vacancyCount": 1,
  "comparison": { "verdict": "NEW" | "DUPLICATE" | "UPDATE", "reason": "..." },
  "translatedText": "Ukrainian translation"
}
`;

async function analyzeAndCompareWithGemini(
  text,
  recentMessages = [],
  recentVacancies = [],
) {
  // 1. Кэш (не аналізуем адно і тое ж двойчы)
  const cacheKey = text.substring(0, 200);
  if (geminiCache.has(cacheKey)) {
    const cached = geminiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  // 2. Для кароткіх паведамленняў (<250 сімв.) — не аналізуем глыбока,
  //    адпраўляем напрамую ў пясочніцу як UPDATE
  if (text.length < 250 && !text.includes("docs.google.com")) {
    return {
      category: "UPDATE",
      vacancyCount: 0,
      comparison: { verdict: "NEW", reason: "Кароткае паведамленне" },
      translatedText: text,
    };
  }

  const userContent = `
RECENT_MESSAGES: ${JSON.stringify(recentMessages.slice(0, 5))}
NEW_MESSAGE: ${text}
`;

  try {
    console.log(`🔍 Stage 1: Класіфікацыя паведамлення...`);

    // Выкарыстоўваем адзіны ланцужок мадэляў з ai.service.js
    const responseText = await aiService.executeAIRequest(
      SYSTEM_PROMPT,
      userContent,
      true,
    );

    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    geminiCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
    return parsed;
  } catch (error) {
    console.error(`⚠️ Stage 1 памылка:`, error.message.substring(0, 100));
    // Калі ланцужок замарожаны (AI_COOLDOWN) — вяртаем null
    // Калі іншая памылка — захоўваем як UPDATE для ручной апрацоўкі
    if (error.message.includes("AI_COOLDOWN")) return null;
    return {
      category: "UPDATE",
      vacancyCount: 0,
      comparison: { verdict: "NEW", reason: "Памылка аналізу" },
      translatedText: text,
    };
  }
}

module.exports = { analyzeAndCompareWithGemini };
