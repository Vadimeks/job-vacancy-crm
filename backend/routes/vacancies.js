// backend/routes/vacancies.js
const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Template = require("../models/Template");
const aiService = require("../services/ai.service");
const {
  sendToTelegram,
  notifyRecruiterAboutMatch,
} = require("../services/telegram.service");
const { matchCandidatesForVacancy } = require("../services/matching.service");

// --- ГЕНЕРАЦЫЯ НУМАРА ВАКАНСІІ ---
async function generateVacancyCode() {
  const count = await Vacancy.countDocuments();
  const num = String(count + 1).padStart(4, "0");
  return `VAC-${num}`;
}

// --- АСНОЎНАЯ ФУНКЦЫЯ АПРАЦОЎКІ ---

async function processVacancyMessage(rawText) {
  // 1. ЗАЎСЁДЫ парсім як новую вакансію — шаблоны не ўплываюць
  const vacancyData = await aiService.parseVacancyWithAI(rawText);

  const postText = await aiService.formatTelegramPost(vacancyData);
  const vacancyCode = await generateVacancyCode();

  const newVacancy = new Vacancy({
    ...vacancyData,
    vacancyCode,
    agencyName: vacancyData.agencyName || "Manual",
    category: vacancyData.category || "Іншае",
    location: vacancyData.location || "Не вызначана",
    rawText,
    telegramPost: postText,
    status: "active",
  });

  const savedVacancy = await newVacancy.save();
  await sendToTelegram(postText);

  // Матчынг кандыдатаў
  const matchedCandidates = await matchCandidatesForVacancy(savedVacancy);
  if (matchedCandidates && matchedCandidates.length > 0) {
    await notifyRecruiterAboutMatch(savedVacancy, matchedCandidates);
  }

  // 2. ФОНАВЫ пошук шаблона — не блакіруе адказ
  setImmediate(async () => {
    try {
      const templates = await Template.find();
      const matched = await aiService.identifyTemplate(rawText, templates);

      if (matched) {
        // Шаблон знойдзены — толькі дадаём спасылку ў internalNotes
        const linked = await aiService.linkTemplateToVacancy(
          vacancyData,
          matched,
        );
        await Vacancy.findByIdAndUpdate(savedVacancy._id, {
          "forRecruiter.internalNotes": linked.forRecruiter.internalNotes,
          templateId: matched._id,
        });
        console.log(`✅ Прывязаны шаблон: ${matched.templateName}`);
      } else {
        // Шаблон не знойдзены — ствараем новы
        const newTemplate =
          await aiService.createTemplateFromVacancy(vacancyData);
        if (newTemplate) {
          const existing = await Template.findOne({
            templateName: newTemplate.templateName,
          });
          if (!existing) {
            await Template.create(newTemplate);
            console.log(
              `✅ Новы шаблон збережаны: ${newTemplate.templateName}`,
            );
          }
        }
      }
    } catch (err) {
      console.error("⚠️ Фонавая памылка (шаблоны):", err.message);
    }
  });

  return savedVacancy;
}

// POST /api/vacancies/auto
router.post("/auto", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ message: "Тэкст пусты" });
    const savedVacancy = await processVacancyMessage(rawText);
    res.status(201).json(savedVacancy);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
    res.status(500).json({ message: err.message });
  }
});
// POST /api/vacancies/from-template/:templateId
router.post("/from-template/:templateId", async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId);
    if (!template)
      return res.status(404).json({ message: "Шаблон не знойдзены" });

    const { rawText } = req.body;
    if (!rawText?.trim())
      return res.status(400).json({ message: "Тэкст пусты" });

    // 1. ЧЫСТЫ ПАРСІНГ (AI бачыць толькі тэкст паведамлення)
    const parsedData = await aiService.parseVacancyWithAI(rawText);

    // 2. ТОЛЬКІ ПРЫВЯЗКА (дадаем internalNotes са спасылкай на шаблон)
    // Функцыя linkTemplateToVacancy не мяняе палі вакансіі, а толькі дадае тэкст для рэкрутэра
    const finalData = await aiService.linkTemplateToVacancy(
      parsedData,
      template,
    );

    // 3. ЗАХАВАННЕ (захоўваем як ёсць, з templateId для сувязі)
    const newVacancy = new Vacancy({
      ...finalData,
      vacancyCode: await generateVacancyCode(),
      templateId: template._id, // Проста захоўваем сувязь, не чапаючы даныя
      rawText,
      status: "active",
    });
    // ТУТ ВАЖНА: Сначала генеруем тэкст паста, потым захоўваем і адпраўляем
    const postText = await aiService.formatTelegramPost(newVacancy);
    newVacancy.telegramPost = postText;
    const saved = await newVacancy.save();
    await sendToTelegram(postText);

    // Матчынг
    const matched = await matchCandidatesForVacancy(saved);
    if (matched && matched.length > 0) {
      await notifyRecruiterAboutMatch(saved, matched);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ from-template error:", err.message);
    res.status(500).json({ message: err.message });
  }
});
// GET /api/vacancies
router.get("/", async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/vacancies
router.post("/", async (req, res) => {
  try {
    const vacancyCode = await generateVacancyCode();
    const newVacancy = new Vacancy({ ...req.body, vacancyCode });
    const savedVacancy = await newVacancy.save();
    const postText = await aiService.formatTelegramPost(savedVacancy);
    await sendToTelegram(postText);
    // Дадаем апавяшчэнне тут
    const matched = await matchCandidatesForVacancy(savedVacancy);
    if (matched && matched.length > 0) {
      await notifyRecruiterAboutMatch(savedVacancy, matched);
    }

    res.status(201).json(savedVacancy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/vacancies/:id
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

// DELETE /api/vacancies/:id
router.delete("/:id", async (req, res) => {
  try {
    await Vacancy.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Вакансія выдалена" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/vacancies/:id/match-candidates
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
