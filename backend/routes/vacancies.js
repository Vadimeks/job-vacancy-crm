// backend/routes/vacancies.js
const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Template = require("../models/Template");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const aiService = require("../services/ai.service");
const { getWhitelistedAgency } = require("../utils/messageFilters"); // Дадалі імпарт
const {
  sendToTelegram,
  notifyRecruiterAboutMatch,
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

// --- АСНОЎНАЯ ЛОГІКА АПРАЦОЎКІ ---

async function processVacancyMessage(
  rawText,
  senderInfo = "Manual",
  preDefinedAgency = null,
) {
  console.log(`\n--- 🚀 ПАЧАТАК АПРАЦОЎКІ ВАКАНСІІ ---`);

  let finalAgency =
    preDefinedAgency || getWhitelistedAgency(senderInfo) || "Manual";

  try {
    // 1. Спроба парсінгу праз Groq
    console.log(`[1/3] Запуск Groq-парсера...`);
    const vacancyData = await aiService.parseVacancyWithAI(rawText);

    // 2. Падрыхтоўка і захаванне
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
    await sendToTelegram(postText);

    console.log(`✅ Вакансія створана: ${vacancyCode}`);
    return savedVacancy;
  } catch (err) {
    console.error(`❌ Памылка Groq: ${err.message}. Перанос у Інбокс.`);

    // FALLBACK: Калі Groq упаў, захоўваем у Інбокс як вакансію для ручной апрацоўкі
    const fallbackMsg = new UnprocessedMessage({
      sender: senderInfo,
      agencyName: finalAgency,
      text: rawText,
      source: "error_fallback",
      category: "vacancy", // Пазначаем як вакансію, каб рэкрутэр бачыў яе ў патрэбным спісе
      processed: false,
    });
    await fallbackMsg.save();
    return { status: "saved_to_inbox_due_to_error", error: err.message };
  }
}

// НОВЫ РОЎТ: Інтэлектуальнае абнаўленне існуючай вакансіі
router.patch("/:id/ai-update", async (req, res) => {
  try {
    const { rawText } = req.body;
    const existingVacancy = await Vacancy.findById(req.params.id);

    if (!existingVacancy)
      return res.status(404).json({ message: "Вакансія не знойдзена" });

    // Выклікаем AI для разумнага мерджу
    const updatedData = await aiService.updateVacancyWithAI(
      existingVacancy.toObject(),
      rawText,
    );

    // Абнаўляем пост для Telegram (калі трэба)
    const newPostText = await aiService.formatTelegramPost(updatedData);
    // Дадаем пазнаку аб абнаўленні для Telegram
    const telegramUpdateNote = `🔄 **ОНОВЛЕНО** (Код: ${existingVacancy.vacancyCode})\n\n${newPostText}`;

    updatedData.telegramPost = newPostText;
    updatedData.rawText = `${existingVacancy.rawText}\n\n--- UPDATE ---\n${rawText}`;

    const saved = await Vacancy.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    // АДПРАЎЛЯЕМ У ТЭЛЕГРАМ
    try {
      await sendToTelegram(telegramUpdateNote);
    } catch (tgErr) {
      console.error("⚠️ Telegram failed, but DB is updated:", tgErr.message);
    }

    res.json(saved);
  } catch (err) {
    console.error("❌ AI Update Route Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// --- МАРШРУТЫ API ---

// Аўта-стварэнне
router.post("/auto", async (req, res) => {
  try {
    const { rawText, senderInfo, messageId } = req.body; // Дадалі messageId
    if (!rawText) return res.status(400).json({ message: "Тэкст пусты" });

    const result = await processVacancyMessage(rawText, senderInfo || "Manual");

    // КАЛІ ПРЫЙШОЎ messageId — пазначаем паведамленне як апрацаванае
    if (messageId) {
      await UnprocessedMessage.findByIdAndUpdate(messageId, {
        processed: true,
      });
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Auto Route Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Стварэнне з шаблона
router.post("/from-template/:templateId", async (req, res) => {
  try {
    const { rawText, messageId } = req.body; // Дадалі messageId
    const template = await Template.findById(req.params.templateId);
    if (!template)
      return res.status(404).json({ message: "Шаблон не знойдзены" });

    const parsedData = await aiService.parseVacancyWithAI(rawText);
    const displayName = constructVacancyDisplayName({
      ...parsedData,
      agencyName: template.agencyName,
    });
    const finalData = await aiService.linkTemplateToVacancy(
      parsedData,
      template,
    );

    const newVacancy = new Vacancy({
      ...finalData,
      agencyName: template.agencyName,
      templateName: displayName,
      vacancyCode: await generateVacancyCode(),
      templateId: template._id,
      rawText: rawText,
      status: "active",
    });

    const postText = await aiService.formatTelegramPost(newVacancy);
    newVacancy.telegramPost = postText;
    const saved = await newVacancy.save();
    await sendToTelegram(postText);

    // ПАЗНАЧАЕМ ЯК АПРАЦАВАНАЕ
    if (messageId) {
      await UnprocessedMessage.findByIdAndUpdate(messageId, {
        processed: true,
      });
    }

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

// Ручное стварэнне
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

module.exports = { router, processVacancyMessage };
