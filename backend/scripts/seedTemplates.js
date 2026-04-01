// backend/scripts/seedTemplates.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Template = require("../models/Template");

const seedTemplates = async () => {
  try {
    // 1. Падключэнне да базы
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Падключана да MongoDB");

    // ============================================================
    // РАДОК ДЛЯ АЧЫСТКІ (РАЗАВА):
    // Разкаментуйце радок ніжэй, запусціце скрыпт адзін раз,
    // а потым зноў закаментуйце яго.
    await Template.deleteMany({});
    console.log("🗑️ База ачышчана перад імпартам");
    // ============================================================

    // 2. Пошук усіх файлаў у папцы templates
    const templatesDir = path.join(__dirname, "../data/templates");
    const files = fs
      .readdirSync(templatesDir)
      .filter(
        (file) => file.endsWith(".js") && file !== "universal_template.js",
      );

    let allTemplates = [];

    // 3. Збор даных з кожнага файла
    for (const file of files) {
      const filePath = path.join(templatesDir, file);
      // Выкарыстоўваем delete cache, каб пры паўторных запусках файл чытаўся нанова
      delete require.cache[require.resolve(filePath)];
      const fileData = require(filePath);

      if (Array.isArray(fileData)) {
        allTemplates = [...allTemplates, ...fileData];
      } else if (fileData && typeof fileData === "object") {
        // Калі ў файле толькі адзін аб'ект, а не масіў
        allTemplates.push(fileData);
      }
    }

    console.log(`📦 Знойдзена шаблонаў для загрузкі: ${allTemplates.length}`);

    // 4. Загрузка ў базу (Upsert - абнаўленне або стварэнне)
    for (const temp of allTemplates) {
      if (!temp.templateName) continue; // Пропуск, калі няма назвы

      await Template.findOneAndUpdate(
        { templateName: temp.templateName }, // Ключ для пошуку
        temp,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    console.log("🚀 Усе шаблоны паспяхова імпартаваныя/абнаўленыя!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка сіда:", err);
    process.exit(1);
  }
};

seedTemplates();
