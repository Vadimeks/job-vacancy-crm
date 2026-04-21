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

// backend/routes/vacancies.js

async function processVacancyMessage(
  rawText,
  senderInfo = "Manual",
  preDefinedAgency = null,
) {
  console.log(`\n--- 📥 НОВАЕ ПАВЕДАМЛЕННЕ ---`);
  console.log(`Крыніца: ${senderInfo}`);
  console.log(`Тэкст: ${rawText.substring(0, 200)}...`);

  // 1. ПРАВЕРКА НА ІНФАРМАТЫЎНАСЦЬ
  if (!isInformative(rawText)) {
    console.log(`[!] Паведамленне занадта кароткае. Захоўваем у Пясочніцу.`);
    const rawMsg = new UnprocessedMessage({
      sender: senderInfo,
      agencyName: preDefinedAgency || "Manual",
      text: rawText,
      source: senderInfo.toLowerCase().includes("viber") ? "viber" : "telegram",
      category: "chat",
      processed: false,
    });
    await rawMsg.save();
    return { status: "saved_to_sandbox" };
  }

  // 2. ПАРСІНГ ПРАЗ AI
  console.log(`[AI] Запуск парсера v2.0...`);
  const vacancyData = await aiService.parseVacancyWithAI(rawText);

  let finalAgency = preDefinedAgency || vacancyData.agencyName || "Manual";
  console.log(
    `[AI] Вынік парсінгу: ${vacancyData.vacancydescription || "Без назвы"} (${finalAgency})`,
  );

  // 3. ЗАХАВАННЕ Ў БАЗУ
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
  console.log(`✅ ВАКАНСІЯ СТВОРАНА: ${vacancyCode}`);

  // 4. АДПРАЎКА Ў ТЭЛЕГРАМ
  try {
    await sendToTelegram(postText);
    console.log(`✈️ Пост адпраўлены ў Telegram.`);
  } catch (e) {
    console.error(`❌ Памылка адпраўкі ў ТГ:`, e.message);
  }

  console.log(`--- 🏁 АПРАЦОЎКА ЗАВЕРШАНА ---\n`);
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
