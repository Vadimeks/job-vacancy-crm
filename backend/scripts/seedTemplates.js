require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Template = require("../models/Template");
const Vacancy = require("../models/Vacancy");

// Функцыя для прывядзення шаблона да стандарту v2.0
const transformTemplate = (data) => {
  const t = { ...data };

  // 1. Нармалізацыя зарплаты
  if (typeof t.salary?.baseNetto === "string") {
    t.salary.rawSalaryDisplay = t.salary.baseNetto;
    const match = t.salary.baseNetto.match(/(\d+[.,]?\d*)/);
    t.salary.baseNetto = match ? parseFloat(match[1].replace(",", ".")) : null;
  }
  if (typeof t.salary?.studentNetto === "string") {
    const match = t.salary.studentNetto.match(/(\d+[.,]?\d*)/);
    t.salary.studentNetto = match
      ? parseFloat(match[1].replace(",", "."))
      : null;
  }

  // 2. Нармалізацыя нагрузкі (Boolean)
  if (typeof t.requirements?.physicalLoad !== "boolean") {
    t.requirements.physicalLoad = !!t.requirements?.physicalLoad;
  }

  // 3. Нармалізацыя нюансаў (Масіў аб'ектаў)
  if (
    t.conditions?.specificNuances &&
    Array.isArray(t.conditions.specificNuances)
  ) {
    t.conditions.specificNuances = t.conditions.specificNuances.map((n) => {
      if (typeof n === "string") {
        return { category: "Інше", text: n };
      }
      return n;
    });
  }

  // 4. Нармалізацыя ўзросту
  if (t.requirements?.ageMax && !t.requirements?.age?.max) {
    t.requirements.age = {
      min: 18,
      max: parseInt(t.requirements.ageMax) || 60,
      rawText: `до ${t.requirements.ageMax} років`,
    };
  }

  return t;
};

const seedTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Падключана да MongoDB");

    try {
      await Template.collection.dropIndex("agencyName_1_templateName_1");
      console.log("🗑️ Унікальны індэкс выдалены.");
    } catch (e) {
      console.log("ℹ️ Індэкс не знойдзены.");
    }

    await Template.deleteMany({});
    await Vacancy.deleteMany({});
    console.log("🗑️ База стэрылізавана.");

    const templatesDir = path.join(__dirname, "../data/templates");
    const files = fs
      .readdirSync(templatesDir)
      .filter((f) => f.endsWith(".js") && f !== "universal-template.js");

    let allTemplates = [];
    for (const file of files) {
      const filePath = path.join(templatesDir, file);
      const fileData = require(filePath);
      const templates = Array.isArray(fileData) ? fileData : [fileData];

      // Трансфармуем кожны шаблон перад дадаваннем у агульны спіс
      const cleaned = templates.map(transformTemplate);
      allTemplates = [...allTemplates, ...cleaned];
      console.log(`📄 Файл: ${file} | Апрацавана: ${cleaned.length}`);
    }

    if (allTemplates.length > 0) {
      // Выкарыстоўваем захаванне без валідацыі для масавай загрузкі,
      // бо мы самі ачысцілі даныя
      await Template.insertMany(allTemplates, { lean: true });
      console.log(`✅ УСПЕХ: Запісана ${allTemplates.length} шаблонаў!`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка сіда:", err.message);
    process.exit(1);
  }
};

seedTemplates();
