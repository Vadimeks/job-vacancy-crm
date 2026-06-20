// backend/scripts/seedIsFree.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Vacancy = require("../models/Vacancy");
const aiService = require("../services/ai.service"); // 👈 ДАДАДЗЕНА: каб карыстацца isHousingFree

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Падключана да базы для скану isFree...");

    // Усе вакансіі, без фільтру па статусе (active/closed/archived)
    const vacancies = await Vacancy.find({});
    console.log(`🚀 Знойдзена ${vacancies.length} вакансій для праверкі.`);

    let updatedCount = 0;
    let setTrueCount = 0; // 👈 ДАДАДЗЕНА: асобны лік "сталі бясплатнымі"
    let setFalseCount = 0; // 👈 ДАДАДЗЕНА: асобны лік "сталі платнымі" (карэкцыя памылак)

    for (let i = 0; i < vacancies.length; i++) {
      const v = vacancies[i];

      // 👈 ЗМЕНЕНА: было — інлайн-праверка "безкоштовн"/"0 зл" проста ў гэтым файле.
      // Цяпер — выклікаем агульную функцыю з ai.service.js, каб логіка была
      // ідэнтычная той, што ўжо ў AI-парсінгу і ў роўце /system/cleanup-locations.
      const correctIsFree = aiService.isHousingFree(
        v.accommodation?.type,
        v.accommodation?.details,
      );

      // 👈 ЗМЕНЕНА: было — `if (isFreeNow && !v.accommodation.isFree)` (толькі ў адзін бок).
      // Цяпер — `!==`, таму скрыпт і дадае true, і скідвае памылковыя true назад у false.
      if (v.accommodation.isFree !== correctIsFree) {
        const oldValue = v.accommodation.isFree;
        v.accommodation.isFree = correctIsFree;
        await v.save();
        updatedCount++;
        if (correctIsFree) {
          setTrueCount++;
        } else {
          setFalseCount++;
        }
        console.log(
          `🔄 [${v.vacancyCode || v._id}] isFree: ${oldValue} -> ${correctIsFree}`,
        );
      }
    }

    console.log(
      `🏁 Скан завершаны. Абноўлена: ${updatedCount} з ${vacancies.length} (новых true: ${setTrueCount}, выпраўлена ў false: ${setFalseCount}).`,
    );
  } catch (err) {
    console.error("❌ Памылка:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

run();