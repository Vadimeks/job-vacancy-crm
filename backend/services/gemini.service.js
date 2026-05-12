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
    if (!res.ok) {
      console.warn(`⚠️ Google Doc: Памылка HTTP ${res.status} (ID: ${docId})`);
      return null;
    }
    const text = await res.text();
    if (text && text.length > 100) {
      console.log(
        `✅ Google Doc загружаны: ${text.length} сімв. (ID: ${docId})`,
      );
      return text;
    }
    console.warn(`⚠️ Google Doc пусты або занадта кароткі (ID: ${docId})`);
    return null;
  } catch (err) {
    console.error(`❌ Google Doc Fetch Error (ID: ${docId}):`, err.message);
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
2. SPLIT only when the message contains 2 or more COMPLETE and INDEPENDENT job offers.
   Each independent offer MUST have ALL FOUR: its own job title + its own city + its own salary + its own duties.
3. DO NOT SPLIT if:
   - The message describes ONE vacancy broken into sections (💰 Оплата, ⚙️ Обов'язки, etc.).
   - The message contains multiple job titles (e.g., "Welder / Saw Operator" or "Helper / Machine Operator") that share the SAME city, SAME salary, and SAME accommodation. This is ONE vacancy with multiple duties.
   - The same vacancy is repeated in different languages (Russian, Ukrainian, Polish). Treat it as ONE vacancy.
4. MULTI-LANGUAGE RULE: If a message has a Russian (or any other language) block and then an Ukrainian block describing the same jobs — translate everything to Ukrainian and keep the structure. If there are 2 jobs in Russian and 2 in Ukrainian — the result must be 2 fragments, not 4.
5. GOLDEN RULE: When in doubt — return ONE fragment. Incorrect splitting is far worse than not splitting.
6. ALL fragments MUST be in UKRAINIAN ONLY.
7. NEVER summarize or shorten. Copy 100% of details into each fragment.

!!! SHARED INFO RULE !!!
8. If the message ends with a general block ("Додатково:", "Загальні умови:") with NO job title/city/salary — APPEND it to the END of every vacancy fragment.

CLASSIFICATION RULES:
- FULL_VACANCY: Detailed job ad with Position + City + Salary + Duties. ALL FOUR must be present.
- UPDATE: Short status changes, stop-signals, or lists of rates/spots without full details.
- RECRUITER_INFO: Legal info, office hours, document rules.
- NOISE: Greetings, emojis only, system messages.

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
