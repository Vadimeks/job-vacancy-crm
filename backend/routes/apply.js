// backend/routes/apply.js
const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const Vacancy = require("../models/Vacancy");
const { notifyRecruiter } = require("../services/telegram.service");
const MD = require("../constants/masterData"); 

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

  // 👈 ДАДАДЗЕНА: Апрацоўка даты гатоўнасці (v7.9.6)
    let readyDate = null;
    let readyDateNotes = "";
    if (surveyData.readyDate === "ASAP") {
      readyDate = new Date();
      readyDateNotes = "Якнайшвидше (ASAP)";
    } else if (surveyData.readyDate) {
      const [day, month] = surveyData.readyDate.split('.').map(Number);
      if (day && month) {
        const year = new Date().getFullYear();
        readyDate = new Date(year, month - 1, day);
        readyDateNotes = surveyData.readyDate;
      }
    }
    // 👈 ВЫПРАЎЛЕНА: дазваляем адпраўку без telegramId (для Viber/Browser)
if (!telegramId && !phone) return res.status(400).json({ message: "Telegram ID or Phone missing" });

   // 1. Шукаем кандыдата: спачатку па Telegram ID, потым па тэлефоне (v7.9.3)
    let candidate = null;
    
    if (telegramId) {
      candidate = await Candidate.findOne({ telegramId: String(telegramId) });
    }

    if (!candidate && phone) {
      // Шукаем па тэлефоне (прыводзім да адзінага фармату: толькі лічбы)
      const cleanPhone = phone.replace(/\D/g, "");
      candidate = await Candidate.findOne({ 
        phone: { $regex: cleanPhone } 
      });
    }
    
    if (!candidate) {
      const { generateCandidateCode } = require("./candidates");
      candidate = new Candidate({
        candidateCode: await generateCandidateCode(),
        telegramId: telegramId ? String(telegramId) : null,
        source: telegramId ? "telegram_bot" : "viber", // 👈 Аўта-вызначэнне крыніцы
        contactType: telegramId ? "telegram" : "viber"
      });
    }

    // 2. Разумнае абнаўленне з пошукам канфліктаў (v7.9.6)
    const conflicts = [];
    
    // 👈 ЗМЕНЕНА: Шукаем канфлікты ТОЛЬКІ калі анкета ўжо запаўнялася раней
    if (candidate.hasCompletedSurvey) {
      const checkConflict = (oldValue, newValue, label) => {
        if (!newValue) return false;
        if (oldValue && String(oldValue).toLowerCase() !== String(newValue).toLowerCase()) {
          conflicts.push(label);
          return true;
        }
        return false;
      };

      checkConflict(candidate.name, name, "Ім'я");
      checkConflict(candidate.age, surveyData.age, "Вік");
      checkConflict(candidate.gender, surveyData.gender, "Стать");
      checkConflict(candidate.phone, phone, "Телефон");
      checkConflict(candidate.jobPreferences?.polishLanguageLevel, surveyData.polishLanguageLevel, "Мова");

      if (conflicts.length > 0) {
        candidate.profileHistory.push({
          updatedAt: new Date(),
          jobPreferences: { ...candidate.jobPreferences },
          source: "auto"
        });
        candidate.needsClarification = true;
        candidate.clarificationFields = conflicts;
      }
    }

    // Запісваем новыя дадзеныя
    candidate.name = name;
    candidate.phone = phone;
    candidate.age = surveyData.age || candidate.age;
    candidate.gender = surveyData.gender || candidate.gender;
    candidate.nationality = surveyData.nationality || candidate.nationality;
    candidate.currentLocation = surveyData.currentLocation || candidate.currentLocation;

    candidate.jobPreferences = {
      ...candidate.jobPreferences,
      voivodeship: surveyData.voivodeship || [],
      locationFlexible: !!surveyData.locationFlexible, // 👈 ДАДАДЗЕНА
      spheres: surveyData.spheres || [],
      accommodation: { 
        ...candidate.jobPreferences?.accommodation,
        needed: !!surveyData.accommodationNeeded,
        freeOnly: !!surveyData.freeHousingOnly  
      },
      transport: { needed: !!surveyData.transportNeeded },
      polishLanguageLevel: surveyData.polishLanguageLevel || candidate.jobPreferences?.polishLanguageLevel,
      hoursRange: surveyData.hoursRange || [],
      readyDate: readyDate,
      readyDateNotes: readyDateNotes,
      nuances: surveyData.nuances || [], // 👈 ДАДАДЗЕНА (масіў)
      nuancesNotes: surveyData.nuancesNotes || "", // 👈 ВЫПРАЎЛЕНА (тэкст)
      notes: surveyData.notes || ""
    };

    candidate.documents = {
      ...candidate.documents,
      activeDocs: surveyData.activeDocs || []
    };

    candidate.subscribedToVacancies = !!surveyData.autoMatchConsent;
    const isFirstTime = !candidate.hasCompletedSurvey; // 👈 Вызначаем для апавяшчэння
    candidate.hasCompletedSurvey = true; // 👈 ПАТВЕРДЖАНА: анкета запоўнена

    // 3. Запісваем у гісторыю, што анкета запоўнена
    candidate.history.push({
      date: new Date(),
      type: "chat",
      role: "system",
      text: "📋 Кандидат заповнив повну анкету через Mini App"
    });

    await candidate.save();

    // 4. Апавяшчаем рэкрутэра (v7.9.1 - з нюансамі)
    const genderLabel = MD.GENDERS.find(g => g.value === surveyData.gender)?.label || surveyData.gender;
    const docsLabel = (surveyData.activeDocs || []).join(", ") || "не вказано";

    
    await notifyRecruiter(
      `✅ <b>${isFirstTime ? "🆕 Нова анкета" : "🔄 Оновлена анкета"} через Mini App!</b>\n\n` +
      `👤 Ім'я: ${name}\n` +
      `📞 Телефон: ${phone}\n` +
      `🎂 Вік: ${surveyData.age || "не вказано"}\n` +
      `👥 Стать: ${genderLabel}\n` +
      `🌍 Національність: ${surveyData.nationality || "не вказано"}\n` +
      `📍 Зараз у: ${surveyData.currentLocation || "не вказано"}\n` +
      `🔍 Регіони: ${surveyData.locationFlexible ? "🌍 Будь-який регіон" : (surveyData.voivodeship?.join(", ") || "не вказано")}\n` +
      `🏭 Сфери: ${surveyData.spheres?.join(", ") || "не вказано"}\n` +
      `🏠 Житло: ${surveyData.accommodationNeeded ? "потрібне" + (surveyData.freeHousingOnly ? " (тільки безкоштовне)" : "") : "не потрібне"}\n` +
      `🚌 Довіз: ${surveyData.transportNeeded ? "потрібен" : "не потрібен"}\n` +
      `🗣️ Польська: ${surveyData.polishLanguageLevel || "не вказано"}\n` +
      `📄 Документи: ${docsLabel}\n` +
      `📅 Готовий з: ${surveyData.readyDate || "не вказано"}\n` +
      `🔔 Згода на автопідбір: ${surveyData.autoMatchConsent ? "Так ✅" : "Ні"}\n\n` +
      `${surveyData.nuances?.length > 0 ? `⚠️ <b>НЮАНСИ:</b> ${surveyData.nuances.join(", ")}\n` : ""}` +
      `${surveyData.nuancesNotes ? `📝 Деталі нюансів: ${surveyData.nuancesNotes}\n` : ""}` +
      `${surveyData.notes ? `📝 Побажання: ${surveyData.notes}\n` : ""}` +
      `\n<a href="${process.env.FRONTEND_URL}/candidates/${candidate._id}">Відкрити профіль у CRM</a>`
    );

    // 👈 ДАДАДЗЕНА: Аўта-падбор вакансій толькі пры згодзе кандыдата
    if (surveyData.autoMatchConsent) {
      const { sendMatchedVacanciesToCandidate } = require("../services/telegramCandidateBot.service");
      sendMatchedVacanciesToCandidate(candidate).catch(err =>
        console.error("❌ Auto-match TMA Error:", err.message)
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ TMA Apply Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
