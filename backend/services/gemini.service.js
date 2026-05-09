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

!!! STRICT TRANSLATION RULE !!!:
- ALL output text MUST be in UKRAINIAN.
- If the input is in English or Russian -> TRANSLATE it to Ukrainian.
- If you translated the text, append original at the end after separator "\n\n--- ORIGINAL ---\n"
- If already Ukrainian — keep as is.

CLASSIFICATION RULES:
1. FULL_VACANCY — Complete job ad. 
   MUST have: Position + City + Salary/Rate AND text length > 200 chars OR Google Docs link.
   If a message has detailed duties, requirements, conditions — it is ALWAYS FULL_VACANCY.
   Do NOT classify as UPDATE if it's a full job post.

2. MULTI_VACANCY — Message contains 2+ SEPARATE full job offers (different positions/cities).
   If unsure — classify as FULL_VACANCY, the parser will handle splitting.

3. UPDATE — Short info about existing job: new dates, count changes, rate changes, STOP signals.

4. RECRUITER_INFO — Legal/office info: PESEL updates, document requirements, office hours.

5. NOISE — ONLY:
   - System notifications (joined group, new comment, etc.)
   - Emojis only or very short greetings
   - Status of a specific candidate ("refused", "will arrive", "call me back")
   - Short chat replies ("ok", "thanks", "noted")
   If the message contains a job title OR a city OR a salary — it is NOT noise.

Output ONLY valid JSON:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE" | "MULTI_VACANCY",
  "vacancyCount": 1,
  "comparison": { "verdict": "NEW" | "DUPLICATE" | "UPDATE", "reason": "..." },
  "translatedText": "Ukrainian translation of the full message"
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
