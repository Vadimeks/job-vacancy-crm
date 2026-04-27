// backend/services/gemini.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify a NEW_MESSAGE and compare it with RECENT_MESSAGES from the same agency.

CATEGORIES:
1. FULL_VACANCY: A single, detailed job offer (Title + Salary/Location + Duties).
2. UPDATE: Lists of jobs, short requests ("Need 2 men"), or status changes ("STOP", "Rate up").
3. RECRUITER_INFO: Legal updates, office hours, logistics.
4. NOISE: Greetings, emojis, system notifications.

COMPARISON RULES (Semantic Deduplication):
Compare the NEW_MESSAGE with the provided list of RECENT_MESSAGES.
Verdicts:
- "DUPLICATE": The NEW_MESSAGE describes the EXACT SAME job as one of the RECENT_MESSAGES. Same Brand, Same City, Same Job Essence, Same Salary. Minor text/emoji changes don't matter.
- "UPDATE": It's the same job/factory/city, but something IMPORTANT changed (Salary increased, new arrival date, or it's a list that includes a previously seen job).
- "NEW": This is a completely different job, different city, or different brand.

Output ONLY a JSON object:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE",
  "comparison": {
    "verdict": "NEW" | "DUPLICATE" | "UPDATE",
    "relatedMessageId": "ID of the matched message from RECENT_MESSAGES or null",
    "reason": "short explanation in Ukrainian"
  },
  "translatedText": "Clean Ukrainian translation of the NEW_MESSAGE"
}
`;

async function analyzeAndCompareWithGemini(text, recentMessages = []) {
  let lastError = null;

  // Падрыхтоўка кантэксту для параўнання
  const context = recentMessages.map((m) => ({
    id: m._id,
    text: m.text.substring(0, 500), // бярэм пачатак для эканоміі токенаў
    category: m.category,
    date: m.createdAt,
  }));

  for (const modelName of MODELS_PRIORITY) {
    try {
      console.log(`🔍 Gemini (${modelName}): Аналіз і параўнанне...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const userContent = `
RECENT_MESSAGES_FROM_THIS_AGENCY:
${JSON.stringify(context, null, 2)}

NEW_MESSAGE_TO_ANALYZE:
${text}
      `;

      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: userContent },
      ]);

      const response = await result.response;
      let jsonText = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(jsonText);
      console.log(
        `✅ Gemini Verdict: ${parsed.comparison.verdict} (${parsed.category})`,
      );
      return parsed;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Model ${modelName} failed: ${error.message}`);
      continue;
    }
  }

  return {
    category: "RECRUITER_INFO",
    comparison: {
      verdict: "NEW",
      relatedMessageId: null,
      reason: "Gemini error fallback",
    },
    translatedText: text,
  };
}

module.exports = { analyzeAndCompareWithGemini };
