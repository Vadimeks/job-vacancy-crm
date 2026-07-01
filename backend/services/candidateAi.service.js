// backend/services/candidateAi.service.js
const { executeAIRequest } = require("./ai.service");

const EXTRACT_CANDIDATE_TAGS_PROMPT = `
ROLE: Professional HR Assistant.
TASK: Analyze candidate's free-text inputs (gender details and additional wishes) to extract structured tags for job matching.

ALLOWED TAGS:
- ONLY_DAY: Candidate cannot work night shifts (e.g., "без начэй", "толькі дзень").
- WITH_CHILDREN: Traveling with minors, needs specific housing.
- WITH_PETS: Traveling with animals.
- COUPLE_ROOM: Strictly requires a private room for two people.
- GROUP: Traveling as a group of friends/colleagues (e.g., "2 хлопцы", "3 дзяўчыны", "група").
- HEAVY_LIFT_LIMIT: Health restrictions regarding physical labor.
- HAS_UDT: Mentions forklift license.
- HAS_SANEPID: Mentions sanitary book.
- DRIVER_B: Mentions driving license.
- URGENT: Ready to start immediately.

RULES:
1. Return ONLY a JSON array of strings.
2. Combine information from all provided text snippets.
3. If no tags match, return [].
4. Input is in Ukrainian/Russian/Polish.

EXAMPLE INPUT: "Нас двое сяброў. Хачу працу без начэй."
EXAMPLE OUTPUT: ["GROUP", "ONLY_DAY"]
`;

async function extractCandidateTags(text) {
  if (!text || text.trim().length < 2) return [];

  try {
    console.log(`🤖 [AI Candidate] Аналіз усіх нататак (удакладненні + пажаданні)...`);
    
    const result = await executeAIRequest(
      EXTRACT_CANDIDATE_TAGS_PROMPT,
      `CANDIDATE_INFO: "${text}"`,
      true
    );

    if (result && result.data) {
      const tags = JSON.parse(result.data);
      return Array.isArray(tags) ? tags : [];
    }
    return [];
  } catch (err) {
    console.error("⚠️ [AI Candidate] Памылка парсінгу тэгаў:", err.message);
    return [];
  }
}

module.exports = { extractCandidateTags };