const mongoose = require("mongoose");

const cronLogSchema = new mongoose.Schema(
  {
    // Назва задачы, напрыклад "sheets-sync"
    taskName: { type: String, required: true, unique: true },
    // Дата і час апошняга паспяховага запуску
    lastRun: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CronLog", cronLogSchema);
