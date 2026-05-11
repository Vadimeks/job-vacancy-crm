// backend/services/gemini.service.js
const aiService = require("./ai.service");

const geminiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Stage 0: Загрузка тэксту з Google Docs
 */
async function fetchGoogleDocText(url) {
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  const docId = match[1];
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  try {
    const res = await fetch(exportUrl, { redirect: "follow" });
    if (!res.ok) return null;
    const text = await res.text();
    return text.length > 100 ? text : null;
  } catch (err) {
    console.error("⚠️ Google Docs Fetch Error:", err.message);
    return null;
  }
}

/**
 * Stage 0: Пошук спасылак і збагачэнне тэксту
 */
async function enrichTextWithDocs(rawText) {
  const urlRegex =
    /https?:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+[^\s]*/g;
  const urls = rawText.match(urlRegex);
  if (!urls) return rawText;

  console.log(`🔗 Знойдзены Google Docs спасылкі: ${urls.length}. Загрузка...`);
  let enriched = rawText;
  for (const url of urls) {
    const docText = await fetchGoogleDocText(url);
    if (docText) {
      enriched = `${enriched}\n\n--- ЗМЕСТ ДОКУМЕНТА ---\n${docText}`;
    }
  }
  return enriched;
}

const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify, Translate, and Split NEW_MESSAGE.

!!! CRITICAL SPLITTING LOGIC !!!
1. translatedFragments: This MUST be an ARRAY of strings.
2. If the message contains 2 or more DETAILED job offers (each has its own duties, requirements, and conditions), SPLIT them into separate strings in the array.
3. If it's ONE job offer or a LIST of short statuses, return an array with ONE string.
4. ALL fragments MUST be in UKRAINIAN ONLY. NO ENGLISH. NO RUSSIAN.
5. NEVER summarize or shorten. Copy 100% of details.

!!! SHARED INFO RULE (CRITICAL) !!!
6. If the message ends with a general block (e.g., "Додатково:", "Загальні умови:", "📌 Додатково") that applies to ALL vacancies (e.g., housing type, transport, legalization, SNF certificate) — DO NOT create a separate fragment for it.
   Instead: APPEND this shared info to the END of EVERY vacancy fragment it applies to, under "📌 Загальна інформація:".
7. A block is "shared" if it has NO job title, NO city, NO salary, NO duties — only general conditions.
8. NEVER classify a shared/general block as a standalone FULL_VACANCY fragment.

CLASSIFICATION RULES:
- FULL_VACANCY: Detailed job ad (Position + City + Salary + Duties).
- UPDATE: Short status changes, stop-signals, or lists of rates/spots.
- RECRUITER_INFO: Legal info, office hours, document rules.
- NOISE: Greetings, emojis, system messages.

Output ONLY valid JSON:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE",
  "translatedFragments": ["Fragment 1 (UA)", "Fragment 2 (UA)"],
  "comparison": { "verdict": "NEW" | "DUPLICATE" | "UPDATE", "reason": "..." }
}
`;

/**
 * Stage 1: Санітар, Сплітар і Перакладчык
 */
async function analyzeAndCompareWithGemini(
  text,
  recentMessages = [],
  recentVacancies = [],
) {
  // 1. Stage 0: Збагачэнне праз Google Docs
  const enrichedText = await enrichTextWithDocs(text);

  // 2. «Жалезнае правіла 250 сімвалаў»
  // Калі тэкст кароткі і няма Google Docs — гэта аўтаматычна UPDATE (эканомім токены)
  if (enrichedText.length < 250 && !enrichedText.includes("docs.google.com")) {
    console.log(
      `📉 Кароткае паведамленне (${enrichedText.length} сімв.), аўта-класіфікацыя: UPDATE`,
    );
    return {
      category: "UPDATE",
      translatedFragments: [enrichedText],
      comparison: { verdict: "NEW", reason: "Short message (<250 chars)" },
      enrichedText: enrichedText,
    };
  }

  // 3. Кэш
  const cacheKey = enrichedText.substring(0, 250);
  if (geminiCache.has(cacheKey)) {
    const cached = geminiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  const userContent = `
RECENT_CONTEXT: ${JSON.stringify([...recentMessages, ...recentVacancies].slice(0, 5))}
NEW_MESSAGE: ${enrichedText}
`;

  try {
    console.log(`🔍 Stage 1: Класіфікацыя і спліцінг (Tier 1)...`);

    const responseText = await aiService.executeAIRequest(
      SYSTEM_PROMPT,
      userContent,
      true,
    );

    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    parsed.enrichedText = enrichedText;

    geminiCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
    return parsed;
  } catch (error) {
    console.error(`⚠️ Stage 1 Error:`, error.message.substring(0, 100));
    // Вяртаем null, каб паведамленне засталося ў Пясочніцы як "Неапрацаванае"
    // Гэта не дасць вакансіі ператварыцца ў "Інфа" пры памылцы AI
    return null;
  }
}

module.exports = { analyzeAndCompareWithGemini, enrichTextWithDocs };
