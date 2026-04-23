// backend/services/gemini.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Спіс мадэляў у парадку прыярытэту (ад лепшай да самай стабільнай)
const MODELS_PRIORITY = [
  "gemini-2.5-flash", // Асноўная мадэль 2026 года
  "gemini-2.5-flash-lite", // Хуткая палегчаная версія
  "gemini-2.0-flash", // Папярэдняе пакаленне
  "gemini-1.5-flash", // Самая стабільная "рабочая каня"
];

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
  let lastError = null;

  // Перабор мадэляў са спісу
  for (const modelName of MODELS_PRIORITY) {
    try {
      console.log(`🔍 Спроба аналізу мадэллю: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });

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

      const parsedResult = JSON.parse(jsonText);
      console.log(`✅ Паспяхова апрацавана мадэллю ${modelName}`);
      return parsedResult;
    } catch (error) {
      lastError = error;
      console.warn(
        `⚠️ Мадэль ${modelName} не змагла апрацаваць запыт: ${error.message}`,
      );

      // Калі памылка 429 (ліміт запытаў) ці 503 (перагрузка), пераходзім да наступнай мадэлі
      continue;
    }
  }

  // Калі ніводная мадэль не спрацавала
  console.error("❌ Усе мадэлі Gemini адмовілі:", lastError.message);

  // Фоллбэк: вяртаем як RECRUITER_INFO, каб паведамленне не знікла
  return {
    category: "RECRUITER_INFO",
    reasoning: "Gemini error, saved as fallback",
    translatedText: text,
  };
}

module.exports = { classifyWithGemini };
