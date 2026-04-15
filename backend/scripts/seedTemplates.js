// backend/scripts/seedTemplates.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Template = require("../models/Template");
const Vacancy = require("../models/Vacancy");

const seedTemplates = async () => {
  try {
    // 1. Падключэнне да базы
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Падключана да MongoDB");

    // ============================================================
    // ⚠️ БЛОК ПОЎНАЙ АЧЫСТКІ
    // ============================================================
    try {
      // Выдаляем старыя індэксы, якія могуць замінаць
      await Template.collection.dropIndex("agencyName_1_templateName_1");
      console.log("🗑️ Унікальны індэкс выдалены.");
    } catch (e) {
      console.log("ℹ️ Індэкс не знойдзены або ўжо выдалены.");
    }

    await Template.deleteMany({}); // Ачыстка шаблонаў
    await Vacancy.deleteMany({}); // Ачыстка тых самых 150 старых вакансій
    console.log("🗑️ База цалкам стэрылізавана (Templates + Vacancies).");
    // ============================================================

    // 2. Пошук усіх файлаў у папцы templates
    const templatesDir = path.join(__dirname, "../data/templates");

    if (!fs.existsSync(templatesDir)) {
      console.error("❌ Папка не знойдзена:", templatesDir);
      process.exit(1);
    }

    const files = fs
      .readdirSync(templatesDir)
      .filter(
        (file) => file.endsWith(".js") && file !== "universal-template.js",
      );

    console.log(`📂 Знойдзена файлаў у папцы: ${files.length}`);

    let allTemplates = [];

    // 3. Збор даных з кожнага файла
    for (const file of files) {
      const filePath = path.join(templatesDir, file);
      delete require.cache[require.resolve(filePath)];
      const fileData = require(filePath);

      let countInFile = 0;
      if (Array.isArray(fileData)) {
        allTemplates = [...allTemplates, ...fileData];
        countInFile = fileData.length;
      } else if (fileData && typeof fileData === "object") {
        allTemplates.push(fileData);
        countInFile = 1;
      }

      console.log(`📄 Файл: ${file} | Прачытана шаблонаў: ${countInFile}`);
    }

    console.log(`---`);
    console.log(`📦 Агулам сабрана шаблонаў у файлах: ${allTemplates.length}`);

    // Фільтрацыя па назве
    const validTemplates = allTemplates.filter((temp) => {
      if (!temp.templateName) {
        console.log(
          `⚠️ Аб'ект без templateName у агенцыі: ${temp.agencyName || "невядома"}`,
        );
        return false;
      }
      return true;
    });

    // 4. Загрузка ў базу (Чысты імпарт праз insertMany)
    if (validTemplates.length > 0) {
      await Template.insertMany(validTemplates);
      console.log(`✅ УСПЕХ: Запісана ${validTemplates.length} шаблонаў у БД!`);
    }

    console.log("🚀 Працэдура завершана паспяхова.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка сіда:", err);
    process.exit(1);
  }
};

seedTemplates();
