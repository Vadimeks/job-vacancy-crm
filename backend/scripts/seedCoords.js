require("dotenv").config();
const mongoose = require("mongoose");
const Vacancy = require("../models/Vacancy");
const locationService = require("../services/location.service");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Падключана да базы для міграцыі каардынат...");

    const vacancies = await Vacancy.find({ 
      status: "active", 
      "locationCoords.lat": null,
      location: { $ne: "Польща" }
    });

    console.log(`🚀 Знойдзена ${vacancies.length} вакансій для апрацоўкі.`);

    for (let i = 0; i < vacancies.length; i++) {
      const v = vacancies[i];
      console.log(`[${i+1}/${vacancies.length}] Апрацоўка: ${v.location}...`);
      
      const coords = await locationService.getCoords(v.location, v.country);
      if (coords) {
        v.locationCoords = coords;
        await v.save();
      }

      // Паўза 1.2 сек, каб не атрымаць бан ад OpenStreetMap (ліміт 1 запыт/сек)
      await new Promise(r => setTimeout(r, 1200));
    }

    console.log("🏁 Міграцыя завершана!");
  } catch (err) {
    console.error("❌ Памылка:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

run();