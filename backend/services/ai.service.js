// backend/services/ai.service.js
const { GoogleGenAI } = require("@google/genai");

// Ствараем адзіны аб'ект кліента (Centralized Client Object)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function parseVacancyWithAI(rawText) {
  try {
    // Згодна з новым SDK, зварот ідзе праз ai.models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Выкарыстоўваем апошнюю стабільную мадэль
      contents: `Ты — эксперт па рынку працы ў Польшчы. Твая задача: ператварыць тэкст аб'явы ў JSON па-беларуску.
          Палі: "title", "location", "salary", "description" (2 пункты), "agencyName".
          Вярні ТОЛЬКІ JSON. 
          Тэкст вакансіі: ${rawText}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    // У новым SDK тэкст даступны наўпрост праз response.text
    const text = response.text;

    return JSON.parse(text);
  } catch (error) {
    if (error.message.includes("429")) {
      throw new Error("RATE_LIMIT");
    }
    console.error("AI Service Error:", error.message);
    return null;
  }
}

module.exports = { parseVacancyWithAI };
