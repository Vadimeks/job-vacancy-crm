const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Відавочна паказваем шлях да .env файла, які ляжыць у гэтай жа папцы backend
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Бярэм менавіта вашу змянную MONGODB_URI
const MONGO_URI = process.env.MONGODB_URI;

async function run() {
  try {
    console.log("🔗 Падключаемся да MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Падключана паспяхова!");

    // Ствараем дынамічную схему без строгіх абмежаванняў, каб проста забраць тое, што ёсць у базе
    const Vacancy =
      mongoose.models.Vacancy ||
      mongoose.model(
        "Vacancy",
        new mongoose.Schema({}, { strict: false }),
        "vacancies",
      );

    console.log("📊 Чытаем дакументы з базы (усяго ў вас каля 350)...");

    // Выбіраем толькі тыя палі, якія нас цікавяць для аналізу, каб не цягнуць лішні тэкст
    const docs = await Vacancy.find(
      {},
      {
        salary: 1,
        contractType: 1, // Мы праверым, ці існуе гэтае поле на верхнім узроўні
        contract: 1, // На выпадак, калі яно называецца інакш
        employmentType: 1, // Яшчэ адзін магчымы варыянт назвы
        title: 1, // Назва вакансіі для кантэксту
        source: 1, // Крыніца (Viber/Trello), каб разумець адкуль дадзеныя
      },
    ).lean();

    console.log(`✅ Атрымана дакументаў: ${docs.length}`);

    // Шлях да файла, куды запішам вынік
    const outputPath = path.join(__dirname, "db_salaries_and_contracts.json");

    // Запісваем у прыгожым фармаце JSON з водступамі ў 2 прабелы
    fs.writeFileSync(outputPath, JSON.stringify(docs, null, 2), "utf-8");

    console.log(`\n🎉 Поўны JSON-файл паспяхова створаны!`);
    console.log(`📂 Шлях да файла: ${outputPath}`);
    console.log(
      `💡 Цяпер вы можаце адкрыць гэты файл у VS Code і скінуць яго змест сюды.`,
    );
  } catch (err) {
    console.error("❌ Адбылася памылка:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Адключана ад базы дадзеных.");
  }
}

run();
