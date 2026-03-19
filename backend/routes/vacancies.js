// backend/routes/vacancies.js
const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Template = require("../models/Template");
const aiService = require("../services/ai.service");
const { sendToTelegram } = require("../services/telegram.service");
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
    console.log("⚠️ Шаблон не знойдзены, выкарыстоўваем fallback парсінг...");
    vacancyData = await aiService.parseVacancyWithAI(rawText);
  }

  const postText = await aiService.formatTelegramPost(vacancyData);
  const vacancyCode = await generateVacancyCode();

  // ГЭТА МЕСЦА Я ВЫПРАВІЎ:
  const newVacancy = new Vacancy({
    vacancyCode,
    title: vacancyData.title || "Нова вакансія",
    agencyName: vacancyData.agencyName || "Manual",
    location: vacancyData.location || "Не вызначана",
    country: vacancyData.country || "Польща",
    arrivalDate: vacancyData.arrivalDate || null,
    count: vacancyData.count || null,
    salary: {
      base: vacancyData.salary?.base || "",
      student: vacancyData.salary?.student || "",
      monthly: vacancyData.salary?.monthly || "",
      bonus: vacancyData.salary?.bonus || "",
      notes: vacancyData.salary?.notes || "",
    },
    schedule: {
      shifts: vacancyData.schedule?.shifts || "",
      hours: vacancyData.schedule?.hours || "",
      details: vacancyData.schedule?.details || "",
    },
    description: vacancyData.description || "",
    accommodation: {
      available: vacancyData.accommodation?.available || false,
      cost: vacancyData.accommodation?.cost || "",
      details: vacancyData.accommodation?.details || "",
    },
    transport: {
      provided: vacancyData.transport?.provided || false,
      cost: vacancyData.transport?.cost || "",
      details: vacancyData.transport?.details || "",
    },
    requirements: {
      gender: vacancyData.requirements?.gender || "",
      age: vacancyData.requirements?.age || "",
      nationalities: vacancyData.requirements?.nationalities || [],
      docs: vacancyData.requirements?.docs || [],
      physical: vacancyData.requirements?.physical || "",
    },
    conditions: {
      temperature: vacancyData.conditions?.temperature || "",
      workwear: vacancyData.conditions?.workwear || "",
      food: vacancyData.conditions?.food || "",
      notes: vacancyData.conditions?.notes || "", // Тут будзе адрас для кароткіх вакансій
    },
    contractType: vacancyData.contractType || "",
    additionalNotes: vacancyData.additionalNotes || "", // Нататкі рэкрутэра (ТЕРМІНОВО, Тэлефон)
    rawText: rawText,
    telegramPost: postText,
    status: "active",
  });

  const savedVacancy = await newVacancy.save();
  await sendToTelegram(postText);
  await matchCandidatesForVacancy(savedVacancy);

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
    await matchCandidatesForVacancy(savedVacancy);
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
