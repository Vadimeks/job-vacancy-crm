require("dotenv").config();
const { google } = require("googleapis");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-creds.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// 👇 Устаў сюды ID табліцы RALEN
const SPREADSHEET_ID = "1qASi88Ihwdw3LpFLQECg-7YSGuv07lZ4pMqFNyTgk8E";
const SHEET_NAME = "ВАКАНСИИ 2026";

async function main() {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    ranges: ["ВАКАНСИИ 2026!A14:Z14"], // зялёны радок
    includeGridData: true,
  });

  const rowData = response.data.sheets[0].data[0].rowData;
  if (!rowData || rowData.length === 0) {
    console.log("❌ Радок пусты");
    return;
  }

  const cells = rowData[0].values || [];
  cells.forEach((cell, idx) => {
    const bg = cell.effectiveFormat?.backgroundColor;
    const bgStyle = cell.effectiveFormat?.backgroundColorStyle;
    const val = cell.formattedValue || "";
    if (bg || bgStyle) {
      console.log(
        `Слупок ${idx} | Значэнне: "${val.substring(0, 20)}" | BG: ${JSON.stringify(bg)} | Style: ${JSON.stringify(bgStyle)}`,
      );
    }
  });
}

main().catch(console.error);
