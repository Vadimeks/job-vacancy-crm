const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const AirtableSource = require("../models/AirtableSource");

const AIRTABLE_DATA = [
  {
    baseId: "appfNu2YwaNTcb3rj", // 👈 НОВЫ ID (Manpower)
    tableId: "tblTyT7NtUNZ1n2ek",
    boardName: "SK_Manpower",
    agencyName: "MANPOWER",
    shareId: "shrDFLZSZGKzeiBrM",
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
    baseId: "appndPfIpwD349ovK", // Progres (застаўся ранейшы)
    tableId: "tblz6LkEKD3mxCyhS",
    boardName: "Oferty pracy Grupa Progres",
    agencyName: "PROGRES",
    shareId: null,
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
    baseId: "appU1nbvHouII9Cwb", // 👈 НОВЫ ID (Job Impulse)
    tableId: "tblhDJDWBLelwfE7g",
    boardName: "Job Impulse Oferty",
    agencyName: "JOB IMPULSE",
    shareId: "shr2m2g0K2zcZLpo0",
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
    console.log("🔌 Падключана да базы для абнаўлення ID Airtable...");

    for (const data of AIRTABLE_DATA) {
      // Шукаем па agencyName, каб абнавіць існуючыя запісы новымі ID
      await AirtableSource.findOneAndUpdate(
        { agencyName: data.agencyName },
        data,
        { upsert: true, new: true }
      );
      console.log(`✅ Налады для ${data.agencyName} абноўлены.`);
    }

    console.log("🏁 Абнаўленне завершана.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
    process.exit(1);
  }
}

seed();