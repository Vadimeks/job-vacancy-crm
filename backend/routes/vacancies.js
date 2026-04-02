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
  const templates = await Template.find();

  if (templates.length === 0) {
    console.warn("⚠️ Шаблоны не знойдзены ў базе");
  }

  const template = await aiService.identifyTemplate(rawText, templates);

  let vacancyData;

  if (template) {
    vacancyData = await aiService.mergeWithTemplate(rawText, template);
    vacancyData.agencyName = template.agencyName;
    vacancyData.templateId = template._id;
  } else {
    console.log("⚠️ Шаблон не знойдзены, використовуємо fallback парсинг...");
    vacancyData = await aiService.parseVacancyWithAI(rawText);

    // Автоматично створюємо шаблон для майбутнього використання
    try {
      const newTemplate =
        await aiService.createTemplateFromVacancy(vacancyData);
      if (newTemplate) {
        // Перевіряємо чи шаблон з такою назвою вже існує
        const existing = await Template.findOne({
          templateName: newTemplate.templateName,
        });
        if (!existing) {
          await Template.create(newTemplate);
          console.log(`✅ Новий шаблон збережено: ${newTemplate.templateName}`);
        } else {
          console.log(`ℹ️ Шаблон вже існує: ${newTemplate.templateName}`);
        }
      }
    } catch (err) {
      // Помилка створення шаблону не повинна зупиняти обробку вакансії
      console.error("⚠️ Не вдалося створити шаблон:", err.message);
    }
  }

  const postText = await aiService.formatTelegramPost(vacancyData);
  const vacancyCode = await generateVacancyCode();

  const newVacancy = new Vacancy({
    vacancyCode,
    title: vacancyData.title || "Нова вакансія",
    agencyName: vacancyData.agencyName || "Manual",
    category: vacancyData.category || "Іншае", // Новае поле для матчынгу
    location: vacancyData.location || "Не вызначана",

    // Зарплата v2.0
    salary: {
      baseNetto: vacancyData.salary?.baseNetto || "",
      studentNetto: vacancyData.salary?.studentNetto || "",
      salaryNotes: vacancyData.salary?.salaryNotes || "",
    },

    // Графік v2.0
    schedule: {
      shiftsCount: vacancyData.schedule?.shiftsCount || 1,
      hoursRange: vacancyData.schedule?.hoursRange || "",
    },

    // Жытло v2.0
    accommodation: {
      type: vacancyData.accommodation?.type || "Власне",
      forCouples: vacancyData.accommodation?.forCouples || false,
      cost: vacancyData.accommodation?.cost || "",
    },

    // Патрабаванні v2.0 (самыя важныя для матчынгу)
    requirements: {
      gender: vacancyData.requirements?.gender || [], // Масіў!
      ageMin: vacancyData.requirements?.ageMin || 18,
      ageMax: vacancyData.requirements?.ageMax || 60,
      nationalities: vacancyData.requirements?.nationalities || [],
      polishLanguageLevel:
        vacancyData.requirements?.polishLanguageLevel || "Не вимагається",
      needsAdditionalDocs:
        vacancyData.requirements?.needsAdditionalDocs || false,
      additionalDocsDetails:
        vacancyData.requirements?.additionalDocsDetails || "",
    },

    // Умовы v2.0
    conditions: {
      hasSpecificConditions:
        vacancyData.conditions?.hasSpecificConditions || false,
      notes: vacancyData.conditions?.notes || "",
    },

    businessTrip: {
      isBusinessTrip: vacancyData.businessTrip?.isBusinessTrip || false,
    },

    rawText: rawText,
    telegramPost: postText,
    status: "active",
  });

  const savedVacancy = await newVacancy.save();
  await sendToTelegram(postText);

  // Запускаем матчынг і адразу апавяшчаем рэкрутэра
  const matchedCandidates = await matchCandidatesForVacancy(savedVacancy);
  if (matchedCandidates && matchedCandidates.length > 0) {
    await notifyRecruiterAboutMatch(savedVacancy, matchedCandidates);
  }

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

    // AI мержыць тэкст з гатовым шаблонам — без identifyTemplate
    const merged = await aiService.mergeWithTemplate(rawText, template);
    merged.agencyName = template.agencyName;
    merged.templateId = template._id;

    const postText = await aiService.formatTelegramPost(merged);
    const vacancyCode = await generateVacancyCode();

    const newVacancy = new Vacancy({
      vacancyCode,
      title: merged.title || template.title,
      agencyName: merged.agencyName,
      location: merged.location || template.location,
      country: merged.country || template.country,
      templateId: template._id,
      arrivalDate: merged.arrivalDate || null,
      count: merged.count || null,
      salary: merged.salary || template.salary,
      schedule: merged.schedule || template.schedule,
      description: merged.description || template.description,
      accommodation: merged.accommodation || template.accommodation,
      transport: merged.transport || template.transport,
      requirements: merged.requirements || template.requirements,
      conditions: merged.conditions || template.conditions,
      contractType: merged.contractType || template.contractType,
      additionalNotes: merged.additionalNotes || template.additionalNotes || "",
      rawText,
      telegramPost: postText,
      status: "active",
    });

    const saved = await newVacancy.save();
    await sendToTelegram(postText);

    // Дадаем апавяшчэнне тут
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
