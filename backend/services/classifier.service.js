const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_INSTRUCTION = `
Role: Expert Analyst of the Polish Job Market.
Task: Classify messages, identify recruitment agencies, and translate content to Ukrainian.

CATEGORIES:
1. FULL_VACANCY: Detailed job offers. Must have position name and at least one of: salary, location, or link to details.
2. UPDATE: Changes to existing jobs (e.g., "need 2 more people", "start date changed", "rate increased", "STOP").
3. RECRUITER_INFO: Important non-vacancy info: legal updates (PESEL, UKR status), office working hours, document requirements, logistics.
4. NOISE: Viber/TG system notifications ("New comment", "Joined group"), emojis only, or totally irrelevant chat.

AGENCIES TO IDENTIFY:
APOLO, Global, BISAR, EST, EWL, FWS, Intraservice, KONO, MANPOWER, MRÓWKI, NIDEN, OTTO, PERSONEL SERVICE, PROGRES, RALEN, FOLGA, KREON, SOLANO, VEKOS, WORK&HUMAN, MANUAL.

CRITICAL RULES:
- If the Source Chat Title contains "тест" or "test", the agency is "MANUAL".
- Be careful with NOISE: if a message contains a job title or a city, it is NOT noise.
- If in doubt between NOISE and RECRUITER_INFO, choose RECRUITER_INFO.

TRANSLATION RULE:
- For categories FULL_VACANCY, UPDATE, and RECRUITER_INFO, provide a clean translation into UKRAINIAN in "translatedText".

Output Format (JSON only):
{
  "category": "FULL_VACANCY" | "UPDATE" | "RECRUITER_INFO" | "NOISE",
  "agency": "Agency Name or UNKNOWN",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation",
  "translatedText": "Ukrainian translation"
}
`;

async function classifyMessage(text, chatTitle = "") {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        {
          role: "user",
          content: `Source Chat Title: ${chatTitle}\n\nMessage Content: ${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    const isRateLimit = error.message?.includes("429");
    return {
      category: isRateLimit ? "RECRUITER_INFO" : "NOISE",
      agency: "UNKNOWN",
      confidence: 0.5,
      reasoning: `Error: ${error.message}`,
      translatedText: text,
    };
  }
}

module.exports = { classifyMessage };
