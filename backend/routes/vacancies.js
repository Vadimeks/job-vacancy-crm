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
const geminiService = require("../services/gemini.service");
// --- ДАПАМОЖНЫЯ ФУНКЦЫІ ---

async function generateVacancyCode() {
  let nextNum = 1;

  // Шукаем апошнюю вакансію
  const lastVacancy = await Vacancy.findOne({}, { vacancyCode: 1 }).sort({
    vacancyCode: -1,
  });

  if (lastVacancy && lastVacancy.vacancyCode) {
    const lastNum = parseInt(lastVacancy.vacancyCode.replace("VAC-", ""), 10);
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  }

  // 👇 СТРАХОЎКА: Калі код ужо заняты (напрыклад, пасля таймаўту), шукаем наступны вольны
  let code = `VAC-${String(nextNum).padStart(4, "0")}`;
  let isTaken = await Vacancy.exists({ vacancyCode: code });

  while (isTaken) {
    nextNum++;
    code = `VAC-${String(nextNum).padStart(4, "0")}`;
    isTaken = await Vacancy.exists({ vacancyCode: code });
  }

  return code;
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
  rawText,
  senderInfo = "Manual",
  preDefinedAgency = null,
  originalText = "",
  isTruncated = false, // Вярнулі параметр
) {
  console.log(`\n--- 🤖 АЎТА-КАНВЕЕР: Stage 1 (Gemini) -> Stage 2 (Groq) ---`);

  try {
    const analysis = await geminiService.analyzeAndCompareWithGemini(rawText);
    if (!analysis || analysis.category === "NOISE")
      return { message: "Ignored" };

    if (analysis.category !== "FULL_VACANCY") {
      const sandboxItem = new UnprocessedMessage({
        text: originalText || rawText,
        senderInfo,
        agencyName: preDefinedAgency || analysis.agencyName || "Manual",
        category: analysis.category,
        processed: false,
        aiAnalyzed: true,
        isTruncated: isTruncated, // Захоўваем тут
        rawText: analysis.translatedFragments[0] || rawText,
      });
      await sandboxItem.save();
      return { message: "Saved to sandbox" };
    }

    const savedVacancies = [];
    const fragments = analysis.translatedFragments || [rawText];

    for (const fragment of fragments) {
      const result = await aiService.parseVacancyWithAI(fragment);
      const vacancyDataList = Array.isArray(result) ? result : [result];

      for (const vData of vacancyDataList) {
        const finalAgency = preDefinedAgency || vData.agencyName || "Manual";
        const vacancyCode = await generateVacancyCode();

        const newVacancy = new Vacancy({
          ...vData,
          agencyName: finalAgency,
          templateName: constructVacancyDisplayName({
            ...vData,
            agencyName: finalAgency,
          }),
          vacancyCode,
          originalText: rawText,
          rawText: fragment,
          isTruncated: isTruncated, // Захоўваем у вакансію
          telegramPost: await aiService.formatTelegramPost({
            ...vData,
            agencyName: finalAgency,
          }),
          status: "active",
        });

        const saved = await newVacancy.save();
        await sendToTelegram(sanitizeTelegramMarkdown(saved.telegramPost));
        savedVacancies.push(saved);
      }
      if (fragments.length > 1) await new Promise((r) => setTimeout(r, 1500));
    }
    return savedVacancies[0];
  } catch (err) {
    console.error(`❌ Auto-Pipeline Error: ${err.message}`);
    throw err;
  }
}

// --- МАРШРУТЫ API ---

// Аўта-стварэнне (з Інбокса праз робата)
router.post("/auto", async (req, res) => {
  try {
    const { rawText, senderInfo, messageId, agencyName, isTruncated } =
      req.body; // Дадалі імпарт з body
    console.log(`\n--- 👤 РУЧНЫ ПАРСІНГ: Напрамую ў Stage 2 (Groq) ---`);

    const result = await aiService.parseVacancyWithAI(rawText);
    const vacancyDataList = Array.isArray(result) ? result : [result];

    const savedVacancies = [];
    for (const vData of vacancyDataList) {
      const finalAgency = agencyName || vData.agencyName || "Manual";
      const vacancyCode = await generateVacancyCode();

      const newVacancy = new Vacancy({
        ...vData,
        agencyName: finalAgency,
        templateName: constructVacancyDisplayName({
          ...vData,
          agencyName: finalAgency,
        }),
        vacancyCode,
        originalText: rawText,
        rawText: rawText,
        isTruncated: isTruncated || false, // Захоўваем
        telegramPost: await aiService.formatTelegramPost({
          ...vData,
          agencyName: finalAgency,
        }),
        status: "active",
      });

      const saved = await newVacancy.save();
      await sendToTelegram(sanitizeTelegramMarkdown(saved.telegramPost));
      savedVacancies.push(saved);
    }

    if (messageId) await markInboxMessageAsProcessed(messageId);
    res.status(201).json(savedVacancies[0]);
  } catch (err) {
    console.error("❌ Manual Auto-route Error:", err.message);
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

// ============================================================
// БЛОК 3: ПЛАНАВАЛЬНІК (Scheduler)
// ============================================================

setInterval(
  async () => {
    console.log(
      "🕒 Heartbeat: Праверка Пясочніцы на неапрацаваныя паведамленні...",
    );
    try {
      // Бяром паведамленні, якія яшчэ не прайшлі AI-аналіз (Stage 1)
      const pending = await UnprocessedMessage.find({
        processed: false,
        aiAnalyzed: { $ne: true },
      }).limit(5); // Абмяжоўваем порцыю, каб не спаліць ліміты API за раз

      for (const msg of pending) {
        console.log(`⚙️ Аўта-апрацоўка паведамлення: ${msg._id}`);

        // Выклікаем поўны канвеер (Stage 1 + Stage 2)
        await processVacancyMessage(
          msg.text,
          msg.senderInfo,
          msg.agencyName,
          msg.text,
          msg.isTruncated, // Перадаем маркер абрэзкі
        );

        // Пазначаем, што паведамленне апрацавана робатам
        msg.processed = true;
        msg.aiAnalyzed = true;
        await msg.save();
      }
    } catch (err) {
      console.error("❌ Scheduler Error:", err.message);
    }
  },
  15 * 60 * 1000,
); // Інтэрвал 15 хвілін

module.exports = { router, processVacancyMessage };
