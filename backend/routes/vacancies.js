// backend/routes/vacancies.js
const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Template = require("../models/Template");
const aiService = require("../services/ai.service");
const {
  sendToTelegram,
  notifyRecruiterAboutMatch,
  notifyRecruiterAboutShortMessage,
} = require("../services/telegram.service");
const { matchCandidatesForVacancy } = require("../services/matching.service");

// --- ГЕНЕРАЦЫЯ НУМАРА ВАКАНСІІ ---
async function generateVacancyCode() {
  const count = await Vacancy.countDocuments();
  const num = String(count + 1).padStart(4, "0");
  return `VAC-${num}`;
}

// --- ХУТКІ ФІЛЬТР ІНФАРМАТЫЎНАСЦІ ---
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
  const hasKeywords = keywords.some((kw) =>
    cleanText.toLowerCase().includes(kw),
  );

  return hasKeywords || cleanText.length > 150;
}
// --- НОВАЕ: КАНСТРУКТАР НАЗВЫ ДЛЯ РЭКРУТЭРА (запісваецца ў templateName вакансіі) ---
function constructVacancyDisplayName(data) {
  const parts = [];

  // 1. Агенцтва (толькі калі яно не дэфолтнае)
  if (data.agencyName && data.agencyName !== "Manual") {
    parts.push(data.agencyName);
  }

  // 2. Суць працы (прыярытэт на кароткі апіс)
  const jobInfo = data.vacancydescription || data.position || "Новая вакансія";
  parts.push(jobInfo);

  // 3. Лакацыя
  if (data.location && data.location !== "Не вызначана") {
    parts.push(data.location);
  }

  return parts.join(" — ");
}
// --- АСНОЎНАЯ ФУНКЦЫЯ АПРАЦОЎКІ ---
async function processVacancyMessage(rawText) {
  if (!isInformative(rawText)) {
    console.log("⚠️ Паведамленне неінфарматыўнае. Адпраўка ў пясочніцу...");

    // ЗАМЕСТ проста апавяшчэння, ствараем запіс у базе
    const rawMsg = new RawMessage({
      text: rawText,
      source: "Telegram", // можна дынамічна перадаваць, калі ёсць інфа
      status: "new",
    });
    await rawMsg.save();

    // Апавяшчэнне рэкрутэру пакідаем, але мяняем тэкст, што яно ў Пясочніцы
    await notifyRecruiterAboutShortMessage(
      `📥 Новае паведамленне ў пясочніцы:\n\n${rawText}`,
    );

    return { status: "saved_to_sandbox", message: "Message moved to sandbox" };
  }

  // 1. Парсінг праз AI
  const vacancyData = await aiService.parseVacancyWithAI(rawText);

  // Гнеруемы назву для адмінкі
  const displayName = constructVacancyDisplayName(vacancyData);

  // Генеруем пост для Тэлеграма (перадаем сырыя дадзеныя,
  // aiService сам павінен ігнараваць прыватныя палі)
  const postText = await aiService.formatTelegramPost(vacancyData);
  const vacancyCode = await generateVacancyCode();

  const newVacancy = new Vacancy({
    ...vacancyData,
    templateName: displayName, // Запісваем інфарматыўную назву сюды
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

  // Матчынг
  const matchedCandidates = await matchCandidatesForVacancy(savedVacancy);
  if (matchedCandidates && matchedCandidates.length > 0) {
    await notifyRecruiterAboutMatch(savedVacancy, matchedCandidates);
  }

  // 2. ФОНАВАЯ ПРЫВЯЗКА (без перазапісу templateName вакансіі!)
  setImmediate(async () => {
    try {
      const templates = await Template.find();
      const matched = await aiService.identifyTemplate(rawText, templates);

      if (matched) {
        // Захоўваем толькі ID шаблона і ўнутраныя нататкі, не чапаючы асноўныя палі вакансіі
        const linked = await aiService.linkTemplateToVacancy(
          vacancyData,
          matched,
        );
        await Vacancy.findByIdAndUpdate(savedVacancy._id, {
          "forRecruiter.internalNotes":
            linked.forRecruiter?.internalNotes || "",
          templateId: matched._id,
        });
        console.log(`✅ Прывязаны ID шаблона: ${matched.templateName}`);
      } else {
        const newTemplateData =
          await aiService.createTemplateFromVacancy(vacancyData);
        if (newTemplateData) {
          const existing = await Template.findOne({
            templateName: newTemplateData.templateName,
          });
          if (!existing) {
            await Template.create(newTemplateData);
            console.log(
              `✅ Створаны новы шаблон: ${newTemplateData.templateName}`,
            );
          }
        }
      }
    } catch (err) {
      console.error("⚠️ Пошук шаблона памылка:", err.message);
    }
  });

  return savedVacancy;
}

// POST /api/vacancies/auto
router.post("/auto", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ message: "Тэкст пусты" });
    const result = await processVacancyMessage(rawText);

    if (result.status === "notified_recruiter") {
      return res.status(200).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
    res.status(500).json({ message: err.message });
  }
});
// POST /api/vacancies/from-template/:templateId
router.post("/from-template/:templateId", async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId);
    if (!template) {
      return res.status(404).json({ message: "Шаблон не знойдзены" });
    }

    const { rawText } = req.body;
    if (!rawText?.trim()) {
      return res.status(400).json({ message: "Тэкст пусты" });
    }

    // 1. ЧЫСТЫ ПАРСІНГ (AI бачыць толькі тэкст паведамлення)
    const parsedData = await aiService.parseVacancyWithAI(rawText);

    // 2. ГЕНЕРАЦЫЯ ІНФАРМАТЫЎНАЙ НАЗВЫ ДЛЯ РЭКРУТЭРА
    // Мы бярэм дадзеныя з паведамлення, каб назва была актуальнай (напр. з новым горадам)
    const displayName = constructVacancyDisplayName(parsedData);

    // 3. ПРЫВЯЗКА НАТАТАК (бярэм толькі internalNotes з шаблона)
    const finalData = await aiService.linkTemplateToVacancy(
      parsedData,
      template,
    );

    // 4. СТВАРЭННЕ ВАКАНСІІ
    const newVacancy = new Vacancy({
      ...finalData,
      templateName: displayName, // Актуальная назва (Агенцтва — Праца — Горад)
      vacancyCode: await generateVacancyCode(),
      templateId: template._id, // Захоўваем сувязь з бацькоўскім шаблонам
      rawText,
      status: "active",
    });

    // 5. ТЭЛЕГРАМ-ПОСТ (aiService выкарыстоўвае палі для кандыдата, без брэнда)
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
