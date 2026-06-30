// backend/seedTrello.js
const path = require("path");
// Загружаем зменныя з .env файла
require("dotenv").config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const TrelloSource = require("../models/TrelloSource");

const TRELLO_DATA = [
  {
    boardId: process.env.TRELLO_BOARD_ID_NIDEN,
    boardName: "📢Niden Вакансии PL",
    agencyName: "NIDEN",
    apiKey: process.env.TRELLO_API_KEY,
    token: process.env.TRELLO_TOKEN,
    status: "active",
  },
  {
    boardId: process.env.TRELLO_BOARD_ID_KREON,
    boardName: "Актуальні Вакансії Креон",
    agencyName: "KREON",
    apiKey: process.env.TRELLO_API_KEY,
    token: process.env.TRELLO_TOKEN,
    status: "active",
  },
  {
    boardId: process.env.TRELLO_BOARD_ID_PERSONNEL,
    boardName: "Personnel Service 2026",
    agencyName: "PERSONEL SERVICE",
    apiKey: process.env.TRELLO_API_KEY,
    token: process.env.TRELLO_TOKEN,
    status: "active",
  },
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ Памылка: MONGODB_URI не знойдзены ў .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Падключана да MongoDB для засявання Trello...");

    for (const data of TRELLO_DATA) {
      if (!data.boardId || !data.apiKey || !data.token) {
        console.log(
          `⚠️ Пропуск ${data.boardName}: праверце, ці запоўнены ўсе палі ў .env для гэтай дошкі.`,
        );
        continue;
      }

      await TrelloSource.findOneAndUpdate({ boardId: data.boardId }, data, {
        upsert: true,
        new: true,
      });
      console.log(
        `✅ Дошка "${data.boardName}" паспяхова дададзена/абноўлена.`,
      );
    }

    console.log("🏁 Засяванне завершана паспяхова.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка выканання:", err.message);
    process.exit(1);
  }
}

seed();
