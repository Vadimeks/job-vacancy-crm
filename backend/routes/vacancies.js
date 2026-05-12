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
function normalizeLocationForDB(location, country) {
  if (!location) return "";
  let clean = location
    .replace(/\s*\(Німеччина\)/gi, "")
    .replace(/\s*\(Нідерланди\)/gi, "")
    .replace(/\s*\(Франція\)/gi, "")
    .replace(/\s*\(Польща\)/gi, "")
    .replace(/\s*\(Germany\)/gi, "")
    .replace(/\s*\(Netherlands\)/gi, "")
    .replace(/\s*\(France\)/gi, "")
    .replace(/\s*\(Poland\)/gi, "")
    .trim();

  // Выдаляем дублі тыпу (Germany) (Germany)
  clean = clean.replace(/\(([^)]+)\)\s*\(\1\)/gi, "($1)");

  // Калі не Польшча — пакідаем толькі назву горада, краіна і так ёсць у полі country
  if (country && country !== "Polska") {
    const countryPattern = new RegExp(`\\s*\\(${country}\\)\\s*$`, "i");
    clean = clean.replace(countryPattern, "").trim();
  }
  return clean;
}

const BRAND_BLACKLIST = [
  "ферма",
  "склад",
  "цех",
  "фабрика",
  "завод",
  "підприємство",
  "company",
  "factory",
  "warehouse",
];
async function generateVacancyCode() {
  // Атамарная аперацыя: знаходзім апошні код і адразу рэзервуем наступны
  // Выкарыстоўваем retry loop для абароны ад race condition
  const MAX_RETRIES = 10;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let nextNum = 1;

    const lastVacancy = await Vacancy.findOne({}, { vacancyCode: 1 }).sort({
      vacancyCode: -1,
    });

    if (lastVacancy && lastVacancy.vacancyCode) {
      const lastNum = parseInt(lastVacancy.vacancyCode.replace("VAC-", ""), 10);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }

    // Шукаем першы вольны код пачынаючы з nextNum
    let code = `VAC-${String(nextNum).padStart(4, "0")}`;
    let isTaken = await Vacancy.exists({ vacancyCode: code });

    while (isTaken) {
      nextNum++;
      code = `VAC-${String(nextNum).padStart(4, "0")}`;
      isTaken = await Vacancy.exists({ vacancyCode: code });
    }

    // Спрабуем "зарэзерваваць" код праз insertOne-like trick:
    // калі паміж нашай праверкай і захаваннем хтосьці ўжо ўзяў гэты код —
    // E11000 злавім у catch вышэй і паўторым спробу
    return code;
  }

  // Апошні рэзерв: timestamp-based код
  const fallback = `VAC-${Date.now().toString().slice(-6)}`;
  console.warn(`⚠️ generateVacancyCode: выкарыстаны fallback код ${fallback}`);
  return fallback;
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
function cleanTelegramPost(text) {
  if (!text) return "";
  return text
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      // Выдаляем пустыя загалоўкі і дзіўныя сімвалы ад AI
      if (
        trimmed.endsWith(":") ||
        trimmed.match(/^[^a-zA-Zа-яёіў0-9*🔥📍💰🛠📋🏠🚌💸🌡📝]+:?\s*$/)
      )
        return false;
      // Выдаляем радкі тыпу "• null" або "• undefined"
      if (trimmed.includes("null") || trimmed.includes("undefined"))
        return false;
      return true;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Яшчэ адна страхоўка ад пустых прабелаў
    .trim();
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
  sender = "Manual", // Выкарыстоўваем sender для адпаведнасці мадэлі
  preDefinedAgency = null,
  originalText = "",
  isTruncated = false,
) {
  console.log(`\n--- 🤖 АЎТА-КАНВЕЕР: Stage 1 (Gemini) -> Stage 2 (Groq) ---`);

  try {
    const analysis = await geminiService.analyzeAndCompareWithGemini(rawText);
    if (!analysis || analysis.category === "NOISE")
      return { message: "Ignored" };

    if (analysis.category !== "FULL_VACANCY") {
      const sandboxItem = new UnprocessedMessage({
        text: originalText || rawText,
        sender: sender, // 👈 ВЫПРАЎЛЕНА: цяпер супадае з патрабаваннем схемы
        agencyName: preDefinedAgency || analysis.agencyName || "Manual",
        category: analysis.category,
        processed: false,
        aiAnalyzed: true,
        isTruncated: isTruncated,
        rawText: analysis.translatedFragments
          ? analysis.translatedFragments[0]
          : rawText,
      });
      await sandboxItem.save();
      return { message: "Saved to sandbox" };
    }

    const savedVacancies = [];
    const fragments = analysis.translatedFragments || [rawText];

    for (const fragment of fragments) {
      // Перадаем агенцыю, вызначаную па ID чата, каб яна не страцілася
      const result = await aiService.parseVacancyWithAI(
        fragment,
        preDefinedAgency,
      );
      const vacancyDataList = Array.isArray(result) ? result : [result];

      for (const vData of vacancyDataList) {
        const finalAgency = preDefinedAgency || vData.agencyName || "Manual";

        let saved;
        let saveAttempts = 0;
        while (saveAttempts < 5) {
          try {
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
              isTruncated: isTruncated,
              telegramPost: await aiService.formatTelegramPost({
                ...vData,
                agencyName: finalAgency,
              }),
              status: "active",
            });
            saved = await newVacancy.save();
            break; // Паспяхова захавана
          } catch (saveErr) {
            if (saveErr.code === 11000 && saveAttempts < 4) {
              saveAttempts++;
              console.warn(
                `⚠️ vacancyCode дубль, паўторная спроба ${saveAttempts}/4...`,
              );
              await new Promise((r) => setTimeout(r, 100 * saveAttempts));
            } else {
              throw saveErr;
            }
          }
        }
        await sendToTelegram(
          cleanTelegramPost(sanitizeTelegramMarkdown(saved.telegramPost)),
        );
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
      req.body;
    console.log(`\n--- 👤 РУЧНЫ ПАРСІНГ: Напрамую ў Stage 2 (Groq) ---`);

    // Перадаем абраную агенцыю (forcedAgency)
    const result = await aiService.parseVacancyWithAI(rawText, agencyName);
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
        isTruncated: isTruncated || false,
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

// Ручное стварэнне
router.post("/", async (req, res) => {
  try {
    const { messageId, ...vacancyData } = req.body;
    const vacancyCode = await generateVacancyCode();

    const newVacancy = new Vacancy({ ...vacancyData, vacancyCode });
    const saved = await newVacancy.save();

    const postText = await aiService.formatTelegramPost(saved);
    await sendToTelegram(postText);

    if (messageId) {
      await markInboxMessageAsProcessed(messageId);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Manual Create Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});
router.get("/filters-data", async (req, res) => {
  try {
    const vacancies = await Vacancy.find({ status: "active" });

    const cities = new Set();
    const agencies = new Set();
    const brands = new Set();
    const nuances = new Set();

    vacancies.forEach((v) => {
      // 1. Гарады (нармалізаваныя)
      const city = normalizeLocationForDB(v.location, v.country);
      if (city) {
        const displayCity =
          v.country !== "Polska" ? `${city} (${v.country})` : city;
        cities.add(displayCity);
      }

      // 2. Агенцыі (толькі нармалізаваныя)
      if (v.agencyName && v.agencyName !== "Manual") agencies.add(v.agencyName);

      // 3. Брэнды (чысцім ад смецця)
      if (
        v.brand &&
        !BRAND_BLACKLIST.some((b) => v.brand.toLowerCase().includes(b))
      ) {
        brands.add(v.brand);
      }

      // 4. Нюансы (катэгорыі)
      if (v.conditions?.specificNuances) {
        v.conditions.specificNuances.forEach((n) => {
          const category = n.split(" (")[0];
          nuances.add(category);
        });
      }
    });

    res.json({
      cities: Array.from(cities).sort(),
      agencies: Array.from(agencies).sort(),
      brands: Array.from(brands).sort(),
      nuances: Array.from(nuances).sort(),
      contractTypes: [
        "Umowa zlecenie",
        "Umowa o pracę",
        "Відрядження (A1)",
        "Інше",
      ],
      workHours: ["8 годин", "10-12 годин", "Інше"],
      shiftTypes: ["Тільки день", "Змішані (день/ніч)"],
    });
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

router.post("/system/cleanup-locations", async (req, res) => {
  try {
    const vacancies = await Vacancy.find();
    let updatedCount = 0;

    for (const v of vacancies) {
      let isChanged = false;

      // 1. Лакацыя
      const newLoc = aiService.normalizeLocation(v.location, v.country);
      if (newLoc !== v.location) {
        v.location = newLoc;
        isChanged = true;
      }

      // 2. Агенцыя (UpperCase + Translation)
      const newAgency = aiService.normalizeAgency(v.agencyName);
      if (v.agencyName !== newAgency) {
        v.agencyName = newAgency;
        isChanged = true;
      }

      // 3. Брэнд (UpperCase + Blacklist)
      const newBrand = aiService.validateBrand(v.brand);
      if (v.brand !== newBrand) {
        v.brand = newBrand;
        isChanged = true;
      }

      // 4. Ваяводства (Пераклад)
      const vLower = v.voivodeship?.toLowerCase().trim();
      // Мы выкарыстоўваем VOIVODESHIP_MAP, які трэба таксама экспартаваць з aiService
      const newVoiv = aiService.VOIVODESHIP_MAP[vLower] || v.voivodeship;
      if (v.voivodeship !== newVoiv) {
        v.voivodeship = newVoiv;
        isChanged = true;
      }

      // 5. Нюансы (Фільтрацыя па 10 катэгорыях)
      if (v.conditions?.specificNuances) {
        const newNuances = aiService.normalizeNuances(
          v.conditions.specificNuances,
        );
        if (
          JSON.stringify(v.conditions.specificNuances) !==
          JSON.stringify(newNuances)
        ) {
          v.conditions.specificNuances = newNuances;
          isChanged = true;
        }
      }

      if (isChanged) {
        // Абнаўляем загаловак, каб прыбраць дублі лакацый
        const baseTitle = v.vacancydescription || "Опис вакансії";
        const titlePart = baseTitle.includes(" — ")
          ? baseTitle.split(" — ")[0]
          : baseTitle;
        v.vacancydescription = `${titlePart.trim()} — ${v.location}`;

        await v.save();
        updatedCount++;
      }
    }
    res.json({
      message: "✅ Super Cleanup Done",
      total: vacancies.length,
      updated: updatedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router, processVacancyMessage };
