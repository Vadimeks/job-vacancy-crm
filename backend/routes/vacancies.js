// backend/routes/vacancies.js
const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Template = require("../models/Template");
const Counter = require("../models/Counter");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const aiService = require("../services/ai.service");
const { enrichTextWithDocs } = require("../services/gemini.service");
const { getWhitelistedAgency } = require("../utils/messageFilters");
const {
  sendToTelegram,
  notifyRecruiterAboutMatch,
} = require("../services/telegram.service");
const { matchCandidatesForVacancy } = require("../services/matching.service");

// --- ДАПАМОЖНЫЯ ФУНКЦЫІ ---

const BRAND_BLACKLIST = [
  "ферма",
  "склад",
  "цех",
  "фабрика",
  "завод",
  "підприємство",
  "предприятие",
  "теплиця",
  "птахофабрика",
  "птицефабрика",
  "комбінат",
  "комбинат",
  "магазин",
  "брендовий одяг",
  "брендовая одежда",
  "одяг",
  "одежда",
  "виробництво",
  "производство",
  "логістика",
  "логистика",
];

// ============================================================
// БЛОК 1: АПТЫМІЗАВАНЫ ГЕНЕРАТАР (толькі логіка падліку)
// ============================================================
async function generateVacancyCode() {
  // Шукаем адну апошнюю вакансію з самым вялікім кодам
  const lastVacancy = await Vacancy.findOne({}, { vacancyCode: 1 }).sort({
    vacancyCode: -1,
  });

  let nextNum = 1;

  if (lastVacancy && lastVacancy.vacancyCode) {
    // Выцягваем лічбу з "VAC-0095" -> 95
    const lastNum = parseInt(lastVacancy.vacancyCode.replace("VAC-", ""), 10);
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  }

  // Абнаўляем Counter проста для парадку (неабавязкова, але карысна)
  await Counter.findOneAndUpdate(
    { name: "vacancy" },
    { $set: { seq: nextNum } },
    { upsert: true },
  );

  return `VAC-${String(nextNum).padStart(4, "0")}`;
}

async function markInboxMessageAsProcessed(messageId) {
  try {
    if (messageId) {
      const msg = await UnprocessedMessage.findById(messageId);
      if (msg && msg.textHash) {
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
      if (
        trimmed.endsWith(":") ||
        trimmed.match(/^[^a-zA-Zа-яёіў0-9*🔥📍💰🛠📋🏠🚌💸🌡📝]+:?\s*$/)
      )
        return false;
      if (trimmed.includes("null") || trimmed.includes("undefined"))
        return false;
      return true;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Разумная ачыстка і валідацыя Markdown для Telegram (EDITION 2026)
 * Выпраўляе незакрытыя тэгі і экрануе адзіночныя службовыя сімвалы.
 */
function sanitizeTelegramMarkdown(text) {
  if (!text) return "";

  let sanitized = text;

  // 1. Экрануем падкрэсліванні ТОЛЬКІ ўнутры круглых дужак спасылак [тэкст](url)
  // Гэта вырашае праблему з URL Google Docs, якія змяшчаюць "_"
  sanitized = sanitized.replace(/\((https?:\/\/[^\)]+)\)/g, (match, url) => {
    return "(" + url.replace(/_/g, "\\_") + ")";
  });

  // 2. Балансіроўка і праверка парнасці для тлустага тэксту (*) і курсіву (_)
  // Мы выкарыстоўваем Markdown V1, таму ** замяняем на * для надзейнасці
  sanitized = sanitized.replace(/\*\*/g, "*");

  const charsToCheck = ["*", "_", "`"];
  charsToCheck.forEach((char) => {
    const regex = new RegExp("\\" + char, "g");
    const count = (sanitized.match(regex) || []).length;
    // Калі колькасць сімвалаў няцотная — выдаляем апошні неўраўнаважаны сімвал
    if (count % 2 !== 0) {
      const lastIndex = sanitized.lastIndexOf(char);
      sanitized =
        sanitized.substring(0, lastIndex) + sanitized.substring(lastIndex + 1);
      console.log(
        `⚠️ Выпраўлены няпарны сімвал фарматавання [ ${char} ] у тэксце вакансіі.`,
      );
    }
  });

  // 3. Праверка квадратных дужак [ ] (стыль спасылак)
  const openBrackets = (sanitized.match(/\[/g) || []).length;
  const closeBrackets = (sanitized.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    // Калі дужкі не збалансаваны, экрануем іх, каб не ламаць Markdown
    sanitized = sanitized.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
  }

  // 4. Фінальная ачыстка лішніх пераносаў
  return sanitized.replace(/\n{3,}/g, "\n\n").trim();
}

// ============================================================
// ЦЭНТРАЛІЗАВАНАЯ ФУНКЦЫЯ ПРАЦЭСІНГУ
// ============================================================
async function processVacancyMessage(
  enrichedText, // 👈 Тэкст ужо збагачаны дакументамі
  sender = "Manual",
  preDefinedAgency = null,
  originalText = "",
  isTruncated = false,
  parsingResultType = "FULL_VACANCY",
  sourceHash = null, // 👈 Дададзена
) {
  console.log(
    `\n--- 🤖 Stage 2: Groq-парсінг для ${preDefinedAgency || "Manual"} ---`,
  );
  try {
    const savedVacancies = [];

    // ВАЖНА: Перадаем enrichedText першым аргументам!
    const result = await aiService.parseVacancyWithAI(
      enrichedText,
      preDefinedAgency,
      parsingResultType,
    );

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
        originalText: originalText || enrichedText, // 👈 Выправілі rawText на enrichedText
        rawText: enrichedText,
        isTruncated: isTruncated,
        parsingResultType: parsingResultType,
        sourceHash: sourceHash,
        status: "active",
      });

      const saved = await newVacancy.save();
      console.log(`✅ Вакансія створана: ${vacancyCode}`);

      // Фармуем пост на аснове ЗАХАВАНАГА аб'екта (Privacy Shield)
      const postText = await aiService.formatTelegramPost(saved);
      saved.telegramPost = postText;
      await saved.save();

      await sendToTelegram(sanitizeTelegramMarkdown(postText));
      savedVacancies.push(saved);
    }

    return savedVacancies.length > 0 ? savedVacancies[0] : null;
  } catch (err) {
    console.error(`❌ processVacancyMessage Error: ${err.message}`);
    return { error: err.message };
  }
}

// --- МАРШРУТЫ API ---

// Аўта-стварэнне (Рэфактарынг v2.1)
router.post("/auto", async (req, res) => {
  try {
    const {
      rawText,
      senderInfo,
      messageId,
      agencyName,
      isTruncated,
      parsingResultType,
    } = req.body;

    const result = await processVacancyMessage(
      rawText,
      senderInfo || "Manual",
      agencyName,
      rawText,
      isTruncated || false,
      parsingResultType || "FULL_VACANCY",
    );

    if (result && !result.error) {
      if (messageId) await markInboxMessageAsProcessed(messageId);
      res.status(201).json(result);
    } else {
      throw new Error(result?.error || "Памылка апрацоўкі");
    }
  } catch (err) {
    console.error("❌ Auto-route Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Стварэнне з шаблона
router.post("/from-template/:templateId", async (req, res) => {
  try {
    const { rawText, messageId, parsingResultType } = req.body;
    const template = await Template.findById(req.params.templateId);
    if (!template)
      return res.status(404).json({ message: "Шаблон не знойдзены" });

    // 🆕 Stage 0: Узбагачаем тэкст перад парсінгам
    // Калі тэкст прыйшоў з інбокса, ён можа быць ужо ўзбагачаны
    const enrichedText = rawText.includes("--- ЗМЕСТ")
      ? rawText
      : await enrichTextWithDocs(rawText);

    const result = await aiService.parseVacancyWithAI(
      enrichedText, // ✅ Цяпер парсер атрымае тэкст з файлаў Drive
      null,
      parsingResultType || "FULL_VACANCY",
    );
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
      rawText: enrichedText, // 🆕 Захоўваем ужо поўны тэкст з файлаў
      parsingResultType: parsingResultType || "FULL_VACANCY", // 🆕 Захоўваем вердыкт
      status: "active",
    });

    const saved = await newVacancy.save();

    // 🆕 Фармуем пост на аснове ЗАХАВАНАГА аб'екта
    const postText = await aiService.formatTelegramPost(saved);
    saved.telegramPost = postText;
    await saved.save();

    await sendToTelegram(sanitizeTelegramMarkdown(postText));

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
    // 🛡️ Абарона ад пустышак: калі апісанне менш за 30 сімвалаў — адхіляем
    const desc = vacancyData.description || "";
    if (desc.length < 30) {
      return res.status(400).json({
        message:
          "Занадта кароткі апісанне. Дадзеных недастаткова для стварэння новай вакансіі. Калі ласка, выкарыстоўвайце функцыю 'Абнавіць існуючую'.",
      });
    }
    const vacancyCode = await generateVacancyCode();

    const newVacancy = new Vacancy({ ...vacancyData, vacancyCode });
    const saved = await newVacancy.save();

    const postText = await aiService.formatTelegramPost(saved);
    await sendToTelegram(sanitizeTelegramMarkdown(postText));

    if (messageId) {
      await markInboxMessageAsProcessed(messageId);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Manual Create Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// Фільтры (Выпраўлена для v2.1)
router.get("/filters-data", async (req, res) => {
  try {
    // Бярэм дадзеныя з усіх вакансій (active і closed), каб фільтры бачылі ўсё
    const vacancies = await Vacancy.find({
      status: { $in: ["active", "closed"] },
    });

    const cities = new Set();
    const agencies = new Set();
    const brands = new Set();
    const nuances = new Set();

    vacancies.forEach((v) => {
      // 1. Гарады (Разбіваем спісы праз коску, прыбіраем краіны ў дужках)
      if (v.location) {
        v.location.split(",").forEach((cityPart) => {
          // Выдаляем краіну ў дужках, напр. "Berlin (Germany)" -> "Berlin"
          let cleanCity = cityPart.split("(")[0].trim();
          if (
            cleanCity &&
            cleanCity !== "Польща" &&
            cleanCity !== "уточнюється"
          ) {
            cities.add(cleanCity);
          }
        });
      }

      // 2. Агенцыі
      if (v.agencyName && v.agencyName !== "Manual") agencies.add(v.agencyName);

      // 3. Брэнды
      if (
        v.brand &&
        !BRAND_BLACKLIST.some((b) => v.brand.toLowerCase().includes(b))
      ) {
        brands.add(v.brand);
      }

      // 4. Нюансы (Абноўлена пад аб'екты v2.1)
      if (
        v.conditions?.specificNuances &&
        Array.isArray(v.conditions.specificNuances)
      ) {
        v.conditions.specificNuances.forEach((n) => {
          // n цяпер гэта { category: "...", text: "..." }
          if (n && n.category) {
            nuances.add(n.category);
          }
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
    const {
      isFavorite,
      minSalary,
      maxSalary,
      minAge,
      maxAge,
      city,
      agency,
      category,
      status,
      housing, // Дадаем параметр жылля
    } = req.query;

    let query = {};

    // Калі статус перададзены (напр. "active,closed"), разбіваем яго ў масіў
    if (status) {
      query.status = { $in: status.split(",") };
    } else {
      // Па змаўчанні паказваем і актыўныя, і закрытыя (акрамя архіўных)
      query.status = { $in: ["active", "closed"] };
    }

    // Фільтр па абраных
    if (isFavorite === "true") query.isFavorite = true;
    // Фільтр па жыллю: паказваем толькі калі надаецца (Безкоштовне/Платне/Надається)
    if (housing === "true") {
      query["accommodation.type"] = {
        $in: ["Надається", "Надається (для пар)", "Безкоштовне", "Платне"],
      };
    }
    // Фільтр па зарплаце (baseNetto)
    if ((minSalary && minSalary !== "") || (maxSalary && maxSalary !== "")) {
      query["salary.baseNetto"] = { $ne: null };
      if (minSalary && minSalary !== "")
        query["salary.baseNetto"].$gte = Number(minSalary);
      if (maxSalary && maxSalary !== "")
        query["salary.baseNetto"].$lte = Number(maxSalary);
    }

    // Фільтр па ўзросце (maxAge)
    if ((minAge && minAge !== "") || (maxAge && maxAge !== "")) {
      query["requirements.age.max"] = { $ne: null };
      if (minAge && minAge !== "")
        query["requirements.age.max"].$gte = Number(minAge);
      if (maxAge && maxAge !== "")
        query["requirements.age.max"].$lte = Number(maxAge);
    }

    // Мульты-фільтры (масівы)
    if (city) {
      const cityList = city.split(",");
      if (cityList.includes("Польща")) {
        // Калі абрана "Польшча" — паказваем усе ваяводствы, акрамя замежных
        query.voivodeship = { $ne: "Інші країни Європи" };
      } else {
        // Інакш шукаем па канкрэтных абраных ваяводствах
        query.voivodeship = { $in: cityList };
      }
    }
    if (agency) query.agencyName = { $in: agency.split(",") };
    if (category) query.category = { $in: category.split(",") };

    const vacancies = await Vacancy.find(query).sort({ createdAt: -1 });
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

// Cleanup Script (Абноўлена v2.2)
router.post("/system/cleanup-locations", async (req, res) => {
  try {
    const vacancies = await Vacancy.find();
    let updatedCount = 0;

    for (const v of vacancies) {
      let isChanged = false;

      // 1. Нармалізацыя лакацыі (выкарыстоўваем нашу новую функцыю з ai.service)
      const newLoc = aiService.normalizeLocation(v.location, v.country);
      if (newLoc !== v.location) {
        v.location = newLoc;
        isChanged = true;
      }

      // 2. Нармалізацыя брэнда
      const newBrand = aiService.validateBrand(v.brand);
      if (newBrand !== v.brand) {
        v.brand = newBrand;
        isChanged = true;
      }

      // 3. Нармалізацыя ваяводства (śląskie -> Śląskie)
      if (v.voivodeship) {
        let vov = v.voivodeship.trim();
        vov = vov.charAt(0).toUpperCase() + vov.slice(1).toLowerCase();
        if (vov !== v.voivodeship) {
          v.voivodeship = vov;
          isChanged = true;
        }
      }
      // 4. Уніфікацыя Еўропы (Разумная)
      const europeRegex = /європа|інші країни європи/i;
      const targetEurope = "Інші країни Європи";

      if (v.voivodeship && europeRegex.test(v.voivodeship)) {
        v.voivodeship = targetEurope;
        isChanged = true;
      }

      if (v.location && europeRegex.test(v.location)) {
        // Калі ў лакацыі напісана "Еўропа" — гэта памылка, ставім "Польща" (бо горад невядомы)
        v.location = "Польща";
        isChanged = true;
      }
    }
    res.json({
      message: "✅ База ачышчана",
      total: vacancies.length,
      updated: updatedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Пераключэнне статусу "Абранае"
router.patch("/:id/favorite", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy)
      return res.status(404).json({ message: "Вакансія не знойдзена" });

    vacancy.isFavorite = !vacancy.isFavorite;
    await vacancy.save();

    res.json({ _id: vacancy._id, isFavorite: vacancy.isFavorite });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Масавае выдаленне вакансій
router.post("/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Спіс ID адсутнічае" });
    }
    const result = await Vacancy.deleteMany({ _id: { $in: ids } });
    res.json({ message: `✅ Выдалена вакансій: ${result.deletedCount}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = { router, processVacancyMessage };
