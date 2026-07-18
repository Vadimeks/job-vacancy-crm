// backend/routes/apply.js
const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const Vacancy = require("../models/Vacancy");
const { notifyRecruiter } = require("../services/telegram.service");

router.post("/", async (req, res) => {
  try {
    const { vacancyId, name, contactType, telegram, phone, ...rest } = req.body;

    const candidate = new Candidate({
      name,
      contactType,
      telegram,
      phone,
      source: "site",
      status: "new",
      ...rest,
    });

    if (vacancyId) {
      candidate.appliedVacancies.push({
        vacancyId,
        appliedAt: new Date(),
        type: req.body.applyType || "want_work",
      });
    }

    const saved = await candidate.save();

    // Фікс: vacancy.title → vacancy.vacancydescription (схема v2.0)
    let vacancyInfo = "";
    if (vacancyId) {
      const vacancy = await Vacancy.findById(vacancyId);
      if (vacancy) {
        const vacTitle =
          vacancy.vacancydescription || vacancy.templateName || "Без назвы";
        vacancyInfo = `\n📋 Вакансія: <b>${vacTitle}</b> (${vacancy.vacancyCode || vacancy._id})`;
      }
    }

    const applyType =
      req.body.applyType === "want_info"
        ? "Хоча дазнацца дэталі"
        : "Хоча тут працаваць";

    const msg = `
🔔 <b>Новая заяўка!</b> (${applyType})${vacancyInfo}

👤 <b>${name}</b>
📞 ${contactType}: ${telegram || phone || "—"}
🌍 Нацыянальнасць: ${rest.nationality || "—"}
📍 Знаходзіцца: ${rest.currentLocation || "—"}
🎂 Узрост: ${rest.age || "—"}
    `.trim();

    await notifyRecruiter(msg);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// 👈 НОВАЕ: Прыём анкеты з Telegram Mini App (v7.8.0)
router.post("/tma", async (req, res) => {
  try {
    const { telegramId, name, phone, ...surveyData } = req.body;

    if (!telegramId) return res.status(400).json({ message: "Telegram ID missing" });

    // 1. Шукаем існуючага кандыдата альбо ствараем новага
    let candidate = await Candidate.findOne({ telegramId: String(telegramId) });
    
    if (!candidate) {
      const { generateCandidateCode } = require("./candidates");
      candidate = new Candidate({
        candidateCode: await generateCandidateCode(),
        telegramId: String(telegramId),
        source: "telegram_bot",
        contactType: "telegram"
      });
    }

    // 2. Абнаўляем дадзеныя профілю
    candidate.name = name;
    candidate.phone = phone;
    candidate.age = surveyData.age || candidate.age;
    candidate.gender = surveyData.gender || candidate.gender;
    
    candidate.jobPreferences = {
      ...candidate.jobPreferences,
      voivodeship: surveyData.voivodeship || [],
      spheres: surveyData.spheres || [],
      accommodation: { 
        ...candidate.jobPreferences.accommodation,
        needed: surveyData.accommodationNeeded,
        freeOnly: surveyData.freeHousingOnly  
      },
      transport: { needed: surveyData.transportNeeded },
      notes: surveyData.notes || ""
    };
 // 👈 ДАДАДЗЕНА: Захаванне дакументаў з анкеты
    candidate.documents = {
      ...candidate.documents,
      activeDocs: surveyData.activeDocs || []
    };
    // 3. Запісваем у гісторыю, што анкета запоўнена
    candidate.history.push({
      date: new Date(),
      type: "chat",
      role: "system",
      text: "📋 Кандидат заповнив повну анкету через Mini App"
    });

    await candidate.save();

    // 4. Апавяшчаем рэкрутэра
    
    await notifyRecruiter(
      `✅ <b>Анкета заповнена!</b>\n\n` +
      `👤 Кандидат: ${name}\n` +
      `📞 Телефон: ${phone}\n` +
      `📍 Регіони: ${surveyData.voivodeship?.join(", ") || "не вказано"}\n` +
      `<a href="${process.env.FRONTEND_URL}/candidates/${candidate._id}">Відкрити профіль у CRM</a>`
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ TMA Apply Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
