// backend/routes/vacancies.js
const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Template = require("../models/Template");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const aiService = require("../services/ai.service");
const {
  sendToTelegram,
  notifyRecruiterAboutMatch,
  notifyRecruiterAboutShortMessage,
} = require("../services/telegram.service");
const { matchCandidatesForVacancy } = require("../services/matching.service");

// --- ДАПАМОЖНЫЯ ФУНКЦЫІ ---

async function generateVacancyCode() {
  const count = await Vacancy.countDocuments();
  const num = String(count + 1).padStart(4, "0");
  return `VAC-${num}`;
}

function isInformative(text) {
  if (!text) return false;
  const cleanText = text.trim();
  if (cleanText.length < 80) return false;
  const keywords = [
    "zl",
    "зл",
    "netto",
    "brutto",
    "міста",
    "miasto",
    "горад",
    "вакансія",
    "умова",
    "umowa",
  ];
  return (
    keywords.some((kw) => cleanText.toLowerCase().includes(kw)) ||
    cleanText.length > 150
  );
}

function constructVacancyDisplayName(data) {
  const parts = [];
  if (data.agencyName && data.agencyName !== "Manual")
    parts.push(data.agencyName);
  const jobInfo = data.vacancydescription || data.position || "Новая вакансія";
  parts.push(jobInfo);
  if (data.location && data.location !== "Не вызначана")
    parts.push(data.location);
  return parts.join(" — ");
}

// --- АСНОЎНАЯ ЛОГІКА АПРАЦОЎКІ (Unified Flow) ---

async function processVacancyMessage(
  rawText,
  senderInfo = "Manual",
  preDefinedAgency = null,
) {
  // 1. Вызначаем агенцыю (прыярытэт у таго, што знайшоў Classifier)
  let finalAgency = preDefinedAgency || "Manual";

  // 2. Калі тэкст занадта кароткі — у Пясочніцу
  if (!isInformative(rawText)) {
    const rawMsg = new UnprocessedMessage({
      sender: senderInfo,
      agencyName: finalAgency,
      text: rawText,
      source: senderInfo.toLowerCase().includes("viber") ? "viber" : "telegram",
      category: "chat",
      processed: false,
    });
    await rawMsg.save();
    await notifyRecruiterAboutShortMessage(
      `📥 Нефармат у Пясочніцы:\n\n${rawText}`,
    );
    return { status: "saved_to_sandbox" };
  }

  // 3. Парсінг праз AI v2.0
  const vacancyData = await aiService.parseVacancyWithAI(rawText);

  // Калі Classifier не ведаў агенцыю, а парсер знайшоў яе ў тэксце — бярэм яе
  if (finalAgency === "Manual" && vacancyData.agencyName) {
    finalAgency = vacancyData.agencyName;
  }

  // 4. Фарміраванне аб'екта вакансіі
  const displayName = constructVacancyDisplayName({
    ...vacancyData,
    agencyName: finalAgency,
  });
  const postText = await aiService.formatTelegramPost({
    ...vacancyData,
    agencyName: finalAgency,
  });
  const vacancyCode = await generateVacancyCode();

  const newVacancy = new Vacancy({
    ...vacancyData,
    agencyName: finalAgency,
    templateName: displayName,
    vacancyCode,
    rawText,
    telegramPost: postText,
    status: "active",
  });

  const savedVacancy = await newVacancy.save();

  // 5. Адпраўка ў Тэлеграм канал
  await sendToTelegram(postText);

  // 6. Аўта-матчынг кандыдатаў
  const matched = await matchCandidatesForVacancy(savedVacancy);
  if (matched?.length > 0) {
    await notifyRecruiterAboutMatch(savedVacancy, matched);
  }

  // 7. Фонавая праца з шаблонамі
  setImmediate(async () => {
    try {
      const templates = await Template.find();
      const matchedTpl = await aiService.identifyTemplate(rawText, templates);
      if (matchedTpl) {
        const linked = await aiService.linkTemplateToVacancy(
          vacancyData,
          matchedTpl,
        );
        await Vacancy.findByIdAndUpdate(savedVacancy._id, {
          "forRecruiter.internalNotes":
            linked.forRecruiter?.internalNotes || "",
          templateId: matchedTpl._id,
        });
      } else {
        const newTpl = await aiService.createTemplateFromVacancy(vacancyData);
        if (newTpl) await Template.create(newTpl);
      }
    } catch (err) {
      console.error("Template background error:", err.message);
    }
  });

  return savedVacancy;
}

// --- МАРШРУТЫ API ---

// Аўта-стварэнне (з фронту)
router.post("/auto", async (req, res) => {
  try {
    const result = await processVacancyMessage(req.body.rawText);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Стварэнне з шаблона
router.post("/from-template/:templateId", async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId);
    if (!template)
      return res.status(404).json({ message: "Шаблон не знойдзены" });

    const parsedData = await aiService.parseVacancyWithAI(req.body.rawText);
    const displayName = constructVacancyDisplayName(parsedData);
    const finalData = await aiService.linkTemplateToVacancy(
      parsedData,
      template,
    );

    const newVacancy = new Vacancy({
      ...finalData,
      templateName: displayName,
      vacancyCode: await generateVacancyCode(),
      templateId: template._id,
      rawText: req.body.rawText,
      status: "active",
    });

    const postText = await aiService.formatTelegramPost(newVacancy);
    newVacancy.telegramPost = postText;
    const saved = await newVacancy.save();
    await sendToTelegram(postText);

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Спіс вакансій
router.get("/", async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ручное стварэнне (з формы)
router.post("/", async (req, res) => {
  try {
    const vacancyCode = await generateVacancyCode();
    const newVacancy = new Vacancy({ ...req.body, vacancyCode });
    const saved = await newVacancy.save();
    const postText = await aiService.formatTelegramPost(saved);
    await sendToTelegram(postText);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Рэдагаванне
router.put("/:id", async (req, res) => {
  try {
    const updated = await Vacancy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Выдаленне
router.delete("/:id", async (req, res) => {
  try {
    await Vacancy.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Вакансія выдалена" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Матчынг для канкрэтнай вакансіі
router.get("/:id/match-candidates", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ message: "Не знойдзена" });
    const matched = await matchCandidatesForVacancy(vacancy);
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router, processVacancyMessage };
