// backend/services/gemini.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-latest" });

const SYSTEM_PROMPT = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify messages into 3 useful categories or NOISE.

CATEGORIES:
1. FULL_VACANCY: Detailed job offers. Must have a job title and at least one of: salary, location, or link.
2. UPDATE: Changes to existing jobs ("need 2 more people", "STOP", "rate increased", "arrival date changed").
3. RECRUITER_INFO: Important non-vacancy info (legal updates, office hours, document requirements, logistics).
4. NOISE: General chat, greetings, emojis only, system notifications, or irrelevant information.

Output ONLY a JSON object:
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE",
  "reasoning": "short explanation in Ukrainian",
  "translatedText": "Clean Ukrainian translation of the message (only for non-NOISE categories)"
}
`;

async function classifyWithGemini(text) {
  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Message to analyze: ${text}` },
    ]);
    const response = await result.response;
    let jsonText = response.text();

    // Ачыстка ад магчымых маркдаун-тэгаў
    jsonText = jsonText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("❌ Gemini Classification Error:", error.message);
    // У выпадку памылкі лічым паведамленне інфармацыйным, каб не страціць яго
    return { category: "RECRUITER_INFO", translatedText: text };
  }
}

module.exports = { classifyWithGemini };
