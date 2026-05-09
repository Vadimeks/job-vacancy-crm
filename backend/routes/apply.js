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

module.exports = router;
