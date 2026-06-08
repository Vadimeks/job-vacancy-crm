// backend/services/gemini.service.js
const aiService = require("./ai.service");
const { google } = require("googleapis");
const scraperService = require("./scraper.service");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-creds.json"),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
const drive = google.drive({ version: "v3", auth });
const geminiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Stage 0: Спіс файлаў у папцы і збор тэксту з іх
 */
async function fetchGoogleDriveFolderText(folderUrl) {
  const match = folderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  const folderId = match[1];

  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType)",
    });

    const files = res.data.files;
    if (!files || files.length === 0) return null;

    console.log(`📂 Google Drive: Знойдзена ${files.length} файлаў у папцы.`);
    let folderContent = "";

    for (const file of files) {
      // Чытаем толькі Google Docs або простыя TXT
      if (file.mimeType === "application/vnd.google-apps.document") {
        const text = await fetchGoogleDocText(
          `https://docs.google.com/document/d/${file.id}/`,
        );
        if (text) folderContent += `\n\n--- ФАЙЛ: ${file.name} ---\n${text}`;
      }
    }
    return folderContent;
  } catch (err) {
    console.error(
      `❌ Google Drive Folder Error (ID: ${folderId}):`,
      err.message,
    );
    return null;
  }
}
async function fetchGoogleDocText(url) {
  const match = url.match(/\/(?:document|file)\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  const docId = match[1];
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  try {
    const res = await fetch(exportUrl, { redirect: "follow" });
    if (!res.ok) {
      if (res.status === 400) return null; // 👈 Ціха ігнаруем фота
      console.warn(
        `⚠️ Google Drive: Файл не з'яўляецца тэкстам (HTTP ${res.status}, ID: ${docId})`,
      );
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

async function enrichTextWithDocs(rawText) {
  // 1. Абарона ад паўторнага ўзбагачэння
  if (rawText.includes("--- ЗМЕСТ")) return rawText;

  // 2. Палепшаныя Regex (дадаем ігнараванне дужак у канцы)
  const docRegex =
    /(?:docs\.google\.com\/document|drive\.google\.com\/file)\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/g;
  const folderRegex =
    /drive\.google\.com\/(?:drive\/)?folders\/([a-zA-Z0-9_-]+)/g;
  const telegraphRegex = /https?:\/\/telegra\.ph\/[^\s\]\)]+/g;

  const docMatches = [...rawText.matchAll(docRegex)];
  const folderMatches = [...rawText.matchAll(folderRegex)];
  const telegraphMatches = [...rawText.matchAll(telegraphRegex)];

  if (
    docMatches.length === 0 &&
    folderMatches.length === 0 &&
    telegraphMatches.length === 0
  ) {
    return rawText;
  }

  console.log(
    `🔗 Узбагачэнне: Google Docs(${docMatches.length}), Folders(${folderMatches.length}), Telegraph(${telegraphMatches.length})`,
  );

  let enriched = rawText;

  // Апрацоўка Telegraph
  for (const match of telegraphMatches) {
    const url = match[0].replace(/[\]\)]+$/, ""); // Чысцім ад зачыняючых дужак
    if (
      url.toLowerCase().includes("zhitlo") ||
      url.toLowerCase().includes("foto")
    )
      continue;

    const content = await scraperService.getExternalContent(url);
    if (content) {
      enriched = `${enriched}\n\n--- ЗМЕСТ TELEGRAPH ---\n${content}`;
    }
  }

  // Апрацоўка папак Drive
  for (const match of folderMatches) {
    const folderId = match[1];
    const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
    console.log(`📂 Загрузка папкі Drive: ${folderId}`);
    const folderText = await fetchGoogleDriveFolderText(folderUrl);
    if (folderText)
      enriched = `${enriched}\n\n--- ЗМЕСТ ПАПКІ DRIVE ---\n${folderText}`;
  }

  // Апрацоўка асобных дакументаў
  for (const match of docMatches) {
    const docId = match[1];
    const docUrl = `https://docs.google.com/document/d/${docId}/`;
    console.log(`📄 Загрузка дакумента Drive: ${docId}`);
    const docText = await fetchGoogleDocText(docUrl);
    if (docText)
      enriched = `${enriched}\n\n--- ЗМЕСТ ДОКУМЕНТА ---\n${docText}`;
  }

  return enriched;
}

const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify, Translate, and Split NEW_MESSAGE.

!!! UKRAINIAN ONLY !!!
All output fragments MUST be in Ukrainian. If the input is in Russian or Polish, translate it accurately to Ukrainian.

!!! CRITICAL SPLITTING LOGIC !!!
1. translatedFragments: This MUST be an ARRAY of strings.
2. SPLIT only when the message contains 2 or more COMPLETE and INDEPENDENT job offers.
   Each independent offer MUST have ALL FOUR: its own job title + its own city + its own salary + its own duties.
3. DO NOT SPLIT if:
   - The message describes ONE vacancy broken into sections (💰 Оплата, ⚙️ Обов'язки, etc.).
   - The message contains multiple job titles (e.g., "Welder / Saw Operator" or "Helper / Machine Operator") that share the SAME city, SAME salary, and SAME accommodation. This is ONE vacancy with multiple duties.
   - The same vacancy is repeated in different languages (Russian, Ukrainian, Polish). Treat it as ONE vacancy.
3.1. MULTI-CITY RULE: If a message contains ONE job description but lists multiple cities (e.g., "Biedronka: Pasym, Ryn, Pisz"), DO NOT split it into fragments. Keep it as ONE fragment. The parser in Stage 2 will handle the list of cities.
4. MULTI-LANGUAGE RULE: If the enriched text contains the same vacancy in multiple languages (e.g., Ukrainian and Russian), merge them into one Ukrainian fragment. 
!!! PRIORITY: Use the Ukrainian version as the primary source. If other language versions (Russian, Polish) contain unique details not present in the Ukrainian text, add those details to the final Ukrainian fragment. If there are 2 jobs in Russian and 2 in Ukrainian — the result must be 2 fragments, not 4.
5. SHARED INFO RULE: If the message contains a general block (e.g., "Contacts:", "General conditions:", "How to apply:") that applies to all vacancies, you MUST APPEND this block to the END of EVERY fragment in translatedFragments. Do not lose contact information.
6. GOLDEN RULE: When in doubt — return ONE fragment. Incorrect splitting is far worse than not splitting.
7. ALL fragments MUST be in UKRAINIAN ONLY.
8. NEVER summarize or shorten. Copy 100% of details into each fragment.
PRIVACY: If you see a raw Google Docs link (docs.google.com) in the input, USE its content for translation, but DO NOT include the raw URL link in the final "translatedFragments".
CLASSIFICATION RULES:
- FULL_VACANCY: Detailed job ad for a candidate. !!! MANDATORY: Must contain a salary or hourly rate for the WORKER (e.g., "25 zł/god", "5000 zł/міс"). !!! PRIVACY RULE: If the message ONLY mentions bonuses for recruiters/partners (e.g., "800 зл за кандидата"), it is NOT a FULL_VACANCY. Classify it as RECRUITER_INFO. Duties and City must be present.
!!! CRITICAL: If the text is shorter than 400 characters, classify it as UPDATE.
If the text is 400 characters or longer, classify it as FULL_VACANCY (even if duties are not explicitly listed).

- UPDATE: Short status changes (STOP, CLOSED), stop-signals, lists of rates/spots, or job offers WITHOUT detailed dutieschanges in rates for existing jobs, or messages like "need 2 more people".
- TRUNCATED: A job ad that is clearly cut off (ends mid-sentence, mid-word, or ends with "..." / "…").
- RECRUITER_INFO: Information about recruiter bonuses, partner terms, legal updates, or office rules. If a message is primarily about "money per candidate", it belongs here, Legal info, office hours, document rules, or general cooperation terms.
- NOISE: Greetings, emojis only, system messages, or social chat.
!!! SALARY RULE: A FULL_VACANCY must contain a worker's rate (e.g., zł/god). If the text only mentions recruiter bonuses (e.g., "800 зл за кандидата"), classify it as RECRUITER_INFO. 
!!! INTEGRITY RULE: Treat the entire input as a single document. The 400-character limit and classification criteria apply to the TOTAL combined text, including all appended content from links (sections like "--- ЗМЕСТ" or "--- ПАДРАБЯЗНАЕ АПІСАННЕ").
Output ONLY valid JSON:
{
  "category": "FULL_VACANCY" | "UPDATE" | "TRUNCATED" | "RECRUITER_INFO" | "NOISE",
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

  // --- ВЫДАЛЕНА: "Жалезнае правіла 250 сімвалаў" (цяпер перакладаем усё) ---

  // 3. Кэш
  const cacheKey = enrichedText.substring(0, 400);
  if (geminiCache.has(cacheKey)) {
    const cached = geminiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  // Абмяжоўваем тэкст да 10,000 сімвалаў, каб захаваць усе моўныя версіі для перакладу
  const safeEnrichedText = enrichedText.substring(0, 10000);

  const userContent = `
RECENT_CONTEXT: ${JSON.stringify([...recentMessages, ...recentVacancies].slice(0, 5))}
NEW_MESSAGE: ${safeEnrichedText}
`;

  try {
    console.log(`🔍 Stage 1: Класіфікацыя і спліцінг (Tier 1)...`);

    const responseText = await aiService.executeAIRequest(
      SYSTEM_PROMPT,
      userContent,
      true,
    );

    const parsed = JSON.parse(aiService.repairJson(responseText));

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
