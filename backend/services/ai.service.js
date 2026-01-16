// backend/services/ai.service.js
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `
ROLE: Professional HR Analyst for the Polish Job Market.
TASK: Extract vacancy data from raw chat text and return a clean JSON in Belarusian.

OUTPUT STRUCTURE (JSON):
{
  "title": "Clear job title in Belarusian (e.g., 'Складнік адзення')",
  "location": "City name in Belarusian followed by Polish name in brackets (e.g., 'Уроцлаў (Wrocław)')",
  "salary": "Salary rate with currency and type (e.g., '28.50 zł/h net'). Leave empty if not found.",
  "description": "A formatted string in Belarusian with the following 3 sections (use these specific emojis):
    🛠 Абавязкі: (job responsibilities)
    🏠 Умовы: (housing, schedule, benefits)
    📝 Патрабаванні: (documents, language, age requirements)",
  "agencyName": "Extract the agency name if mentioned, otherwise use 'Manual'"
}

RULES:
1. LANGUAGE: All values must be in Belarusian (except for Polish city names in brackets).
2. CLEANING: Remove all phone numbers, Telegram links, and marketing fluff.
3. TERMINOLOGY: 
   - 'Umowa zlecenie' -> 'Дамова даручэння'
   - 'Umowa o pracę' -> 'Працоўная дамова'
   - 'Karta pobytu' -> 'Карта побыту'
4. MISSING DATA: If a section is missing, skip it in the description.
5. FORMATTING: Use '\\n' for line breaks between sections.

RETURN ONLY PURE JSON.
`;

async function parseVacancyWithAI(rawText) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using the version that works in your environment
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [
        {
          role: "user",
          parts: [{ text: `Process this text: ${rawText}` }],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    if (error.message.includes("429")) {
      throw new Error("RATE_LIMIT");
    }
    console.error("AI Service Error:", error.message);
    return null;
  }
}

module.exports = { parseVacancyWithAI };
