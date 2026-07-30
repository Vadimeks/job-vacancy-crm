// backend/services/gemini.service.js
const aiService = require("./ai.service");
const { google } = require("googleapis");
const scraperService = require("./scraper.service");
const path = require("path");

// 👈 ЗМЕНА: падтрымка Render Secret Files (/etc/secrets/) і лакальнага шляху
const GOOGLE_CREDS_PATH = require("fs").existsSync("/etc/secrets/google-creds.json")
  ? "/etc/secrets/google-creds.json"
  : path.join(process.cwd(), "google-creds.json");

const auth = new google.auth.GoogleAuth({
  keyFile: GOOGLE_CREDS_PATH,
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
      // Чытаем Google Docs, TXT і любыя іншыя тэкставыя файлы
      if (
        file.mimeType === "application/vnd.google-apps.document" || 
        file.mimeType === "text/plain" ||
        file.name.toLowerCase().endsWith('.txt')
      ) {
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

  // Этап 2: Пошук унікальных спасылак
  const docRegex = /(?:docs\.google\.com\/document|drive\.google\.com\/file)\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/g;
  const folderRegex = /drive\.google\.com\/(?:drive\/)?folders\/([a-zA-Z0-9_-]+)/g;
  const telegraphRegex = /https?:\/\/telegra\.ph\/[^\s\]\)]+/g;

  // Выкарыстоўваем Set, каб пазбегнуць паўторнай загрузкі адных і тых жа файлаў
  const docMatches = [...new Set([...rawText.matchAll(docRegex)].map(m => m[1]))];
  const folderMatches = [...new Set([...rawText.matchAll(folderRegex)].map(m => m[1]))];
  const telegraphMatches = [...new Set([...rawText.matchAll(telegraphRegex)].map(m => m[0].replace(/[\]\)]+$/, "")))];

  if (docMatches.length === 0 && folderMatches.length === 0 && telegraphMatches.length === 0) {
    return rawText;
  }

  console.log(`Этап 2. 🔗 Знойдзена ўнікальных спасылак: Docs(${docMatches.length}), Folders(${folderMatches.length}), Telegraph(${telegraphMatches.length})`);

  let enriched = rawText;

  // Этап 3: Загрузка зместу Telegraph
  for (const url of telegraphMatches) {
    if (url.toLowerCase().includes("zhitlo") || url.toLowerCase().includes("foto")) continue;
    const content = await scraperService.getExternalContent(url);
    if (content) {
      enriched = `${enriched}\n\n--- ЗМЕСТ TELEGRAPH ---\n${content}`;
      console.log(`✅ Этап 3. Telegraph загружаны: ${url.substring(0, 30)}...`);
    }
  }

  // Этап 4: Загрузка зместу Drive (Папкі і Дакументы)
  for (const folderId of folderMatches) {
    console.log(`Этап 4. 📂 Загрузка папкі Drive: ${folderId}`);
    const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
    const folderText = await fetchGoogleDriveFolderText(folderUrl);
    if (folderText) enriched = `${enriched}\n\n--- ЗМЕСТ ПАПКІ DRIVE ---\n${folderText}`;
  }

  for (const docId of docMatches) {
    console.log(`Этап 4. 📄 Загрузка дакумента Drive: ${docId}`);
    const docUrl = `https://docs.google.com/document/d/${docId}/`;
    const docText = await fetchGoogleDocText(docUrl);
    if (docText) {
      console.log(`✅ Этап 4. Google Doc загружаны: ${docText.length} сімв.`);
      enriched = `${enriched}\n\n--- ЗМЕСТ ДОКУМЕНТА ---\n${docText}`;
    }
  }

  return enriched;
}

const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify, Translate, and Split NEW_MESSAGE.

!!! UKRAINIAN ONLY !!!
All output fragments MUST be in Ukrainian. If the input is in Russian or Polish, translate it accurately to Ukrainian.
!!! MIRROR RULE (STRICT 1:1 TRANSLATION) !!!
- Do not summarize, do not "fix" contradictions, and do not omit any numbers.
- If the primary message says "27 zł" and the attached document says "24 zł", you MUST keep BOTH values in their respective sections.
- KEEP ALL ORIGINAL URL LINKS (Google Docs, Drive, photos, videos, etc.) in the translated text.
!!! CRITICAL SPLITTING LOGIC !!!
1. translatedFragments: This MUST be an ARRAY of strings.
2. SPLIT only when the message contains 2 or more COMPLETE and INDEPENDENT job offers.
   Each independent offer MUST have ALL FOUR: its own job title + its own city + its own salary + its own duties. DO NOT split lists of short summaries (less than 400 characters each); keep them as one fragment in the UPDATE category.
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

CLASSIFICATION RULES:
- FULL_VACANCY: Detailed job ad. 
!!! SPREADSHEET RULE: If the source is [SOURCE: SPREADSHEET_ROW], NEVER classify it as NOISE. If it has a city and any job-related text, it is ALWAYS either FULL_VACANCY or UPDATE.
!!! FOR OTHER SOURCES: Must be 400+ characters AND contain a worker's rate. !! LIST RULE: If the message contains a list of multiple short job summaries (like a digest), classify the WHOLE message as UPDATE and DO NOT split it.
!!! MIXED MESSAGE: If a message contains one detailed vacancy (more than 400 characters) and several short ones (less than 400 characters each), extract ONLY the detailed one into translatedFragments and set category to FULL_VACANCY.
!!! ANTI-CV RULE: If the text is a Job Application or CV from a candidate (e.g., "Шукаю роботу", "Ми працювали на складах", "Я водій", "2 сестри хочуть разом"), classify it as NOISE or UPDATE. NEVER classify a candidate's request as a FULL_VACANCY.
- UPDATE: Any text shorter than 400 characters (except spreadsheet rows), short status changes (STOP, CLOSED), or lists of multiple short job summaries (digests).
!!! SPREADSHEET RULE: If a spreadsheet row is very short but contains a job update, use this category. NEVER use NOISE for spreadsheet rows that contain data.
- TRUNCATED: A job ad that is clearly cut off (ends mid-sentence, mid-word, or ends with "..." / "…").
- RECRUITER_INFO: Information about recruiter bonuses, partner terms, legal updates, or office rules. If a message is primarily about "money per candidate", it belongs here, Legal info, office hours, document rules, or general cooperation terms.
- NOISE: Greetings, emojis only, system messages, or social chat.
!!! SALARY RULE: A FULL_VACANCY must contain a worker's rate (e.g., zł/god). If the text only mentions recruiter bonuses (e.g., "800 зл за кандидата"), classify it as RECRUITER_INFO. 
!!! INTEGRITY RULE !!!
Treat the entire input as a single document. The 400-character limit and classification criteria apply to the TOTAL combined text, including all content from links (sections like "--- ЗМЕСТ").

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

    const result = await aiService.executeAIRequest(
  SYSTEM_PROMPT,
  userContent,
  true,
);

    const parsed = JSON.parse(result.data);

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
