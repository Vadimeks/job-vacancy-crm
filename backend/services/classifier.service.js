const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_INSTRUCTION = `
Role: Expert Analyst of Polish Job Market Messages.
Task: Classify incoming messages from recruitment agencies and identify the agency name.

CATEGORIES:
1. FULL_VACANCY: A detailed job offer. Must contain at least two of: salary (zł/h, netto/brutto), location, or job duties. Often includes links to Google Docs, Airtable, or EWL platform.
2. UPDATE: Short status updates about existing jobs. Keywords: STOP, СТОП, Актуально, Звільнилось місце, Потрібно ще, Набір закрито, Відмінено.
3. NOISE: General chat, greetings, holiday wishes, questions about specific candidates (names/surnames), "Photo message" placeholders, GDPR (RODO) instructions, or price list updates.

AGENCIES TO IDENTIFY:
APOLO, Global, BISAR, EST, EWL, FWS, Intraservice, KONO, MANPAWER, MRÓWKI, NIDEN, OTTO, PERSONEL SERVICE, PROGRES, RALEN, FOLGA, KREON, SOLANO, VEKOS.

Output Format:
Return ONLY a JSON object with this structure:
{
  "category": "FULL_VACANCY" | "UPDATE" | "NOISE",
  "agency": "Agency Name or UNKNOWN",
  "confidence": 0.0-1.0,
  "reasoning": "Short explanation in Russian why this category was chosen"
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
    console.error("❌ Classifier Error:", error.message);
    return {
      category: "NOISE",
      agency: "UNKNOWN",
      confidence: 0,
      reasoning: "Error occurred",
    };
  }
}

module.exports = { classifyMessage };
