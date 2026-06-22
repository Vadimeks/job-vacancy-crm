const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const AirtableSource = require("../models/AirtableSource");

const AIRTABLE_DATA = [
  {
    baseId: "appZ0hH5CERo0K4uE",
    tableId: "tblTyT7NtUNZ1n2ek",
    boardName: "SK_Manpower",
    agencyName: "MANPOWER",
    includedColumns: [
      "Виплата 1500 brutto /900 netto",
      "топ оферти",
      "склади",
      "робота для сім.пар, ж.,ч.",
      "UDT",
      "робота для чоловіків",
      "поселення з дітьми",
      "не активні тимчасово",
      "oferty (dla anglojezycznych)"
    ],
    syncRules: { checkField: null, checkValue: null }
  },
  {
    baseId: "appndPfIpwD349ovK",
    tableId: "tblz6LkEKD3mxCyhS",
    boardName: "Oferty pracy Grupa Progres",
    agencyName: "PROGRES",
    includedColumns: [
      "Ж",
      "Ч",
      "Ж/Ч/Сім.П",
      "Для спеціалістів",
      "Пропозіції роботи англійською мовою"
    ],
    syncRules: { checkField: null, checkValue: null }
  },
  {
    baseId: "apppPRkm823aUVQCv",
    tableId: "tblFIwc2PUVAREP3Q",
    boardName: "Job Impulse Oferty",
    agencyName: "JOB IMPULSE",
    includedColumns: [
      "актуальное",
      "варшава и мазовецкое",
      "Познань и велкопольское",
      "лодзь и лодзинское",
      "зелена гура и любуское воеводство",
      "катовице и слензское",
      "вроцлав и дольнослезское",
      "Щецин и западнопоморское воеводство",
      "германия"
    ],
    syncRules: { 
      checkField: "Актуальность", 
      checkValue: "ДА" 
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Падключана да MongoDB для налады Airtable...");

    for (const data of AIRTABLE_DATA) {
      await AirtableSource.findOneAndUpdate(
        { baseId: data.baseId, tableId: data.tableId },
        data,
        { upsert: true, new: true }
      );
      console.log(`✅ Налады для ${data.agencyName} запісаны.`);
    }

    console.log("🏁 Засяванне завершана паспяхова.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
    process.exit(1);
  }
}

seed();