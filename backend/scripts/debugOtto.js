// backend/scripts/debugOtto.js
const { google } = require("googleapis");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const SPREADSHEET_ID = "1ajkfjO8v5FcaNl-NDydc_NwihGgFlvdEkh38ouPwmj4";
const SHEET_NAME = "WEEK 23";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-creds.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

async function checkNotes() {
  try {
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    console.log(
      `🔍 Сканаванне нататак (чорных трыкутнікаў) у ${SHEET_NAME}...`,
    );
    const res = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      ranges: [`${SHEET_NAME}!A1:Z50`],
      includeGridData: true,
    });

    const rowData = res.data.sheets[0].data[0].rowData || [];

    console.log("\n--- 🎯 ВЫНІКІ СКАNAVАННЯ ПОСЛЕ АПДЭЙТУ ТАБЛІЦЫ ---");

    for (let i = 0; i < 40; i++) {
      const row = rowData[i];
      if (!row || !row.values) continue;

      const id = (row.values[0]?.formattedValue || "").trim();
      if (!id || id === "Recruitment Order ID") continue;

      // Шукаем нататку ў любой ячэйцы радка
      let foundNote = "";
      row.values.forEach((cell) => {
        if (cell && cell.note) {
          foundNote = cell.note;
        }
      });

      if (foundNote) {
        console.log(`✅ Радок ${i + 1} [ID: ${id}]: Знойдзена нататка!`);
        console.log(
          `   Тэкст: ${foundNote.substring(0, 120).replace(/\n/g, " ")}...`,
        );
      } else {
        console.log(`❌ Радок ${i + 1} [ID: ${id}]: Нататка НЕ знойдзена.`);
      }
      console.log("---------------------------------------------------");
    }
  } catch (err) {
    console.error("❌ Памылка выканання скрыпта:", err.message);
  }
}

checkNotes();
