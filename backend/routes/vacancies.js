// backend/routes/vacancies.js
const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Template = require("../models/Template");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const aiService = require("../services/ai.service");
const { getWhitelistedAgency } = require("../utils/messageFilters");
const {
  sendToTelegram,
  notifyRecruiterAboutMatch,
} = require("../services/telegram.service");
const { matchCandidatesForVacancy } = require("../services/matching.service");

// --- ДАПАМОЖНЫЯ ФУНКЦЫІ ---

async function generateVacancyCode() {
  // Шукаем апошнюю вакансію з самым вялікім кодам праз сартаванне
  const lastVacancy = await Vacancy.findOne({}, { vacancyCode: 1 }).sort({
    vacancyCode: -1,
  });

  let nextNum = 1;

  if (lastVacancy && lastVacancy.vacancyCode) {
    // Выцягваем лічбы з "VAC-0019" -> 19
    const lastNum = parseInt(lastVacancy.vacancyCode.replace("VAC-", ""), 10);
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  }

  return `VAC-${String(nextNum).padStart(4, "0")}`;
}

/**
 * Разумная паметка паведамлення як апрацаванага.
 * Пазначае як 'processed' само паведамленне І ўсе яго дублікаты па хэшы.
 */
async function markInboxMessageAsProcessed(messageId, rawText = null) {
  try {
    if (messageId) {
      const msg = await UnprocessedMessage.findById(messageId);
      if (msg && msg.textHash) {
        // Пазначаем усе паведамленні з такім жа хэшам (дублікаты)
        await UnprocessedMessage.updateMany(
          { textHash: msg.textHash, processed: false },
          { processed: true },
        );
        console.log(`Cleaned up duplicates for hash: ${msg.textHash}`);
      } else {
        await UnprocessedMessage.findByIdAndUpdate(messageId, {
          processed: true,
        });
      }
    }
  } catch (err) {
    console.error("⚠️ Error marking message as processed:", err.message);
  }
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
  originalText = "", // Дадалі
  isTruncated = false, // Дадалі
) {
  console.log(`\n--- 🚀 ПАЧАТАК АПРАЦОЎКІ ВАКАНСІІ ---`);

  let finalAgency =
    preDefinedAgency || getWhitelistedAgency(senderInfo) || "Manual";

  try {
    console.log(`[1/3] Запуск Groq-парсера...`);
    const vacancyData = await aiService.parseVacancyWithAI(rawText);

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
      originalText: originalText || rawText,
      rawText: rawText,
      isTruncated: isTruncated,
      telegramPost: postText,
      status: "active",
    });

    const savedVacancy = await newVacancy.save();
    await sendToTelegram(postText);

    console.log(`✅ Вакансія створана: ${vacancyCode}`);
    return savedVacancy;
  } catch (err) {
    console.error(`❌ Памылка Groq: ${err.message}. Перанос у Інбокс.`);

    // 🔧 Не ствараць дублікат калі такі тэкст ужо ёсць у буферы.
    // Без гэтага кожны краш стварае новы запіс → паведамленне зацыклівалася:
    // бралася зноў на апрацоўку → крашыла → новы fallback → і г.д. бясконца.
    const textHash = rawText.toLowerCase().replace(/[^a-zа-яёіў0-9]/gi, "");
    const existing = await UnprocessedMessage.findOne({
      agencyName: finalAgency,
      textHash,
      processed: false,
    });

    if (!existing) {
      const fallbackMsg = new UnprocessedMessage({
        sender: senderInfo,
        agencyName: finalAgency,
        text: rawText,
        textHash,
        source: "error_fallback",
        category: "vacancy",
        processed: false,
      });
      await fallbackMsg.save();
      console.log(`📥 Захавана ў Інбокс (error_fallback): ${finalAgency}`);
    } else {
      console.log(`⏭️ Fallback прапушчаны — запіс ужо ёсць: ${finalAgency}`);
    }

    return { status: "saved_to_inbox_due_to_error", error: err.message };
  }
}

// --- МАРШРУТЫ API ---

// Аўта-стварэнне (з Інбокса праз робата)
router.post("/auto", async (req, res) => {
  try {
    const { rawText, senderInfo, messageId, originalText, isTruncated } =
      req.body;
    const result = await processVacancyMessage(
      rawText,
      senderInfo || "Manual",
      null,
      originalText,
      isTruncated,
    );
    if (messageId) await markInboxMessageAsProcessed(messageId);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Стварэнне з шаблона
router.post("/from-template/:templateId", async (req, res) => {
  try {
    const { rawText, messageId } = req.body;
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

    if (messageId) {
      await markInboxMessageAsProcessed(messageId);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ручное стварэнне (Самы важны фікс тут!)
router.post("/", async (req, res) => {
  try {
    const { messageId, ...vacancyData } = req.body; // Дастаем messageId
    const vacancyCode = await generateVacancyCode();

    const newVacancy = new Vacancy({ ...vacancyData, vacancyCode });
    const saved = await newVacancy.save();

    const postText = await aiService.formatTelegramPost(saved);
    await sendToTelegram(postText);

    // Калі ствараем з інбокса — пазначаем як апрацаванае
    if (messageId) {
      await markInboxMessageAsProcessed(messageId);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Manual Create Error:", err.message);
    res.status(400).json({ message: err.message });
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

// Інтэлектуальнае абнаўленне
router.patch("/:id/ai-update", async (req, res) => {
  try {
    const { rawText, messageId } = req.body;
    const existingVacancy = await Vacancy.findById(req.params.id);

    if (!existingVacancy)
      return res.status(404).json({ message: "Вакансія не знойдзена" });

    const updatedData = await aiService.updateVacancyWithAI(
      existingVacancy.toObject(),
      rawText,
    );

    const newPostText = await aiService.formatTelegramPost(updatedData);
    const telegramUpdateNote = `🔄 **ОНОВЛЕНО** (Код: ${existingVacancy.vacancyCode})\n\n${newPostText}`;

    updatedData.telegramPost = newPostText;
    updatedData.rawText = `${existingVacancy.rawText}\n\n--- UPDATE ---\n${rawText}`;

    const saved = await Vacancy.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    try {
      await sendToTelegram(telegramUpdateNote);
    } catch (tgErr) {
      console.error("⚠️ Telegram failed:", tgErr.message);
    }

    if (messageId) {
      await markInboxMessageAsProcessed(messageId);
    }

    res.json(saved);
  } catch (err) {
    console.error("❌ AI Update Route Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router, processVacancyMessage };
