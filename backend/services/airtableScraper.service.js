const axios = require("axios");

async function fetchSharedData(shareId) {
  try {
    console.log(`🕵️ [Scraper] Атрыманне дадзеных для Share ID: ${shareId}`);

    // 1. Загружаем старонку для атрымання Access Policy
    const pageRes = await axios.get(`https://airtable.com/${shareId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' }
    });

    const accessPolicyMatch = pageRes.data.match(/"accessPolicy":"([^"]+)"/);
    const appIdMatch = pageRes.data.match(/"sharedApplicationId":"([^"]+)"/);

    if (!accessPolicyMatch || !appIdMatch) throw new Error("Airtable змяніў структуру старонкі.");

    // 2. Запыт да ўнутранага API за дадзенымі
    const dataUrl = `https://airtable.com/remote/v1/shared/view/${shareId}/readSharedViewData?stringifiedObjectParams=%7B%22includeDataForTable%22%3Atrue%7D`;
    const dataRes = await axios.get(dataUrl, {
      headers: {
        'x-airtable-application-id': appIdMatch[1],
        'x-airtable-access-policy': accessPolicyMatch[1],
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Referer': `https://airtable.com/${shareId}`
      }
    });

    const { columns, rows } = dataRes.data.data.table;
    
    // 3. Фарматаванне пад стандарт афіцыйнага API
    return rows.map(row => ({
      id: row.id,
      fields: columns.reduce((acc, col) => {
        const val = row.cellValuesByColumnId[col.id];
        if (val !== undefined) acc[col.name] = val;
        return acc;
      }, {})
    }));

  } catch (err) {
    console.error(`❌ [Scraper] Памылка:`, err.message);
    return null;
  }
}

module.exports = { fetchSharedData };