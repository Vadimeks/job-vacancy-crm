const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  agencyName: { type: String, default: "Manual" }, // Агенцыя (напр. "Lucky Union")
  location: { type: String, required: true },
  city: String,
  address: String,
  salary: {
    base: String, // 25.36 net / 31.40 brutto
    student: String, // 31.40 net
    bonus: String, // Премія 200 zł
  },
  schedule: String, // Графік: 3 зміни по 8 годин
  accommodation: {
    cost: String, // 620 zł/міс
    details: String, // 2-4 особи, кухня
  },
  food: String, // Безкоштовна кава, гаряча їжа за 1 zł
  transport: String, // Безкоштовно зі Львову / 150 zł/місяць
  requirements: {
    gender: String, // Чоловіки / Жінки
    age: String, // до 50 років
    docs: [String], // Санепід, UDT, Кат. B
    physicalForm: String,
  },
  conditions: {
    temperature: String, // +5…+12°C
    workClothes: String, // спецвзуття безкоштовно
  },
  description: String,
  rawText: String, // Арыгінальны допіс з чата
  status: { type: String, enum: ["active", "expired"], default: "active" },
  arrivalDates: [String], // 14.01, 15.01
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vacancy", vacancySchema);
