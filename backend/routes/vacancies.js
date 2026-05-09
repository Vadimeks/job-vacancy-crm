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
function sanitizeTelegramMarkdown(text) {
  if (!text) return "";
  return (
    text
      // Выдаляем незакрытыя ** (нечатная колькасць)
      .replace(/\*\*([^*]+)\*\*/g, "*$1*") // ** -> *
      .replace(/\*(?!\*)(.*?)\*/g, (m) => m) // пакідаем адзінарныя
      // Выдаляем незакрытыя _ (курсіў)
      .replace(/(?<!\w)_([^_\n]+)_(?!\w)/g, (m) => m)
      .replace(/(?<!\w)_(?![_\s])/g, "")
      // Выдаляем незакрытыя [ без парнага ]
      .replace(/\[([^\]]*?)(?=\n|$)/g, "$1")
      // Выдаляем незакрытыя ` без пары
      .replace(/`([^`\n]*?)(?=\n|$)/gm, "$1")
      // Зачышчаем множныя пустыя радкі
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}
// --- АСНОЎНАЯ ЛОГІКА АПРАЦОЎКІ ---
async function processVacancyMessage(
  rawText, // Перакладзены тэкст
  senderInfo = "Manual",
  preDefinedAgency = null,
  originalText = "",
  isTruncated = false,
) {
  console.log(`\n--- 🚀 STAGE 2: АПРАЦОЎКА ВАКАНСІЙ (Tier 1 Chain) ---`);

  try {
    // [1] Парсінг праз універсальны рухавік (Gemini/Groq)
    // Цяпер AI сам вырашае, ці разбіваць на масіў і які тып прысвоіць
    const result = await aiService.parseVacancyWithAI(rawText);
    const vacancyList = Array.isArray(result) ? result : [result];

    const savedVacancies = [];

    for (const vacancyData of vacancyList) {
      // Вызначаем агенцыю (патрэбна для абодвух тыпаў)
      const whitelisted = getWhitelistedAgency(senderInfo);
      const finalAgency =
        preDefinedAgency ||
        (whitelisted && whitelisted !== "MANUAL" ? whitelisted : null) ||
        vacancyData.agencyName ||
        whitelisted ||
        "Manual";

      // [2] ПРАВЕРКА ТЫПУ: Калі AI палічыў, што гэта не поўная вакансія — адпраўляем у Пясочніцу
      if (vacancyData.parsingResultType === "UPDATE") {
        const sandboxItem = new UnprocessedMessage({
          text: originalText || rawText,
          senderInfo,
          agencyName: finalAgency,
          category: "UPDATE",
          processed: false,
          aiAnalyzed: true, // Каб робат не чапаў яго паўторна
          rawText: rawText,
        });
        await sandboxItem.save();
        console.log(`📩 Частка паведамлення захавана ў Пясочніцу як UPDATE.`);
        continue; // Пераходзім да наступнага элемента масіва
      }

      // [3] СТВАРЭННЕ ПОЎНАЙ ВАКАНСІІ
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

      const saved = await newVacancy.save();

      // Адпраўка ў Telegram
      const safePostText = sanitizeTelegramMarkdown(postText);
      await sendToTelegram(safePostText);

      savedVacancies.push(saved);
      console.log(`✅ Вакансія створана: ${vacancyCode} (${finalAgency})`);

      // Паўза паміж пастамі, калі іх некалькі
      if (vacancyList.length > 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    // Вяртаем першую створаную вакансію (або пустую, калі былі толькі апдэйты)
    return savedVacancies.length > 0
      ? savedVacancies[0]
      : { message: "Processed as updates" };
  } catch (err) {
    console.error(`❌ Stage 2 Error: ${err.message}`);
    return { error: err.message };
  }
}

// --- МАРШРУТЫ API ---

// Аўта-стварэнне (з Інбокса праз робата)
router.post("/auto", async (req, res) => {
  try {
    // Дадалі agencyName у спіс зменных
    const {
      rawText,
      senderInfo,
      messageId,
      originalText,
      isTruncated,
      agencyName,
    } = req.body;

    const result = await processVacancyMessage(
      rawText,
      senderInfo || "Manual",
      agencyName || null, // Калі агенцыя выбрана ўручную — перадаем яе
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

    const result = await aiService.parseVacancyWithAI(rawText);
    // Бяром першую вакансію з выніку (нават калі там масіў)
    const parsedData = Array.isArray(result) ? result[0] : result;

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
      await sendToTelegram(sanitizeTelegramMarkdown(telegramUpdateNote));
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
