// backend/routes/vacancies.js
const express = require("express");
const multer = require('multer');
const upload = multer(); // Для апрацоўкі FormData і файлаў у памяці
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Template = require("../models/Template");
const Counter = require("../models/Counter");
const UnprocessedMessage = require("../models/UnprocessedMessage");
const aiService = require("../services/ai.service");
const { POLISH_VOIVODESHIPS, VOIVODESHIP_MAP } = aiService;
const { enrichTextWithDocs } = require("../services/gemini.service");
const { getWhitelistedAgency } = require("../utils/messageFilters");
const {
  sendToTelegram,
  notifyRecruiterAboutMatch,
} = require("../services/telegram.service");
const { matchCandidatesForVacancy } = require("../services/matching.service");
const locationService = require("../services/location.service");
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
    createdAt: -1, // 👈 ЗМЕНА: сартуем па даце, не па радку
    // Было: vacancyCode: -1 — сартаванне як радок ("VAC-0099" > "VAC-0100" алфавітна)
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
// Функцыя-скрыпт для генерацыі кароткага паста па шаблоне карыстальніка
function formatShortPostScript(v) {
  const lines = [];
  
  // 1. ID
  lines.push(`🆔 ${v.vacancyCode}`);

  // 2. Загаловак
  lines.push(`🔥 *${v.vacancydescription}*`);

  // 3. Лакацыя і Зарплата
  const salary = v.salary?.rawSalaryDisplay || (v.salary?.baseNetto ? `${v.salary.baseNetto} PLN` : "уточнюється");
  lines.push(`📍 ${v.location} | 💰 ${salary}`);

  // 4. Набор і Узрост
  const gender = Array.isArray(v.requirements?.gender) ? v.requirements.gender.join(", ") : (v.gender || "Будь-хто");
  const age = v.requirements?.age?.rawText || (v.requirements?.age?.max ? `до ${v.requirements.age.max} років` : "");
  lines.push(`👥 Набір: ${gender}${age ? ` | 🎂 Вік: ${age}` : ""}`);

  // 5. Жытло (з дэталямі ў дужках)
  if (v.accommodation?.type) {
    let acc = `🏠 Проживання: ${v.accommodation.type}`;
    if (v.accommodation.details) acc += ` (${v.accommodation.details})`;
    lines.push(acc);
  }

  // 6. Графік і Гадзіны
  const sched = v.schedule?.description || "";
  const hours = v.salary?.hoursRange || "";
  if (sched || hours) {
    lines.push(`🗓 Графік: ${sched}${hours ? ` | ⏱ ${hours} год/міс` : ""}`);
  }

  // 7. Тып дагавору
  if (v.contractType) {
    lines.push(`📄 Тип договору: ${v.contractType}`);
  }

  // 8. Транспарт
  const transport = v.transport?.provided ? "надається" : "немає";
  lines.push(`🚌 Транспорт: ${transport}`);

  return lines.join("\n");
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
  sourceHash = null,
  sheetName = "", // 👈 ДАДАДЗЕНА
  existingId = null, // 👈 ДАДАДЗЕНА: ID для абнаўлення
  sourceType = "manual", // 👈 ДАДАДЗЕНА
   forceFull = false,
   forcedStatus = null // 👈 Новы параметр
) {
  console.log(
    `\n--- 🤖 Stage 2: Groq-парсінг для ${preDefinedAgency || "Manual"} ---`,
  );
  try {
    const savedVacancies = [];
// 🛡️ Калі мы ведаем, што гэта рэтрай або вакансія ўжо ў чарзе — патрабуем Full мадэль
    let needsFull = forceFull;
    if (existingId) {
      const current = await Vacancy.findById(existingId);
      if (current?.status === "pending_ai") needsFull = true;
    }

    const result = await aiService.parseVacancyWithAI(
      enrichedText,
      preDefinedAgency,
      parsingResultType,
      sheetName,
      needsFull
    );
   
    // 🧠 Вызначаем мадэль і рыхтуем спіс дадзеных
    // result цяпер заўсёды будзе апрацаваны як масіў, нават калі AI вярнуў адзін аб'ект
    let vacancyDataList = [];
    if (result) {
      if (Array.isArray(result)) {
        vacancyDataList = result;
      } else {
        vacancyDataList = [result];
      }
    }
    const modelUsed = vacancyDataList[0]?.modelUsed || ""; 
    const isLite = modelUsed.toLowerCase().includes("lite");
    // Калі статус прымусова перададзены (напр. closed з Airtable), выкарыстоўваем яго
    // Інакш: калі мадэль Lite — у чаргу, калі Full — актыўная.
    const finalStatus = forcedStatus || (isLite ? "pending_ai" : "active");
    // 🌍 Аўтаматычнае атрыманне каардынат для кожнага фрагмента
    for (const vData of vacancyDataList) {
      try {
        const coords = await locationService.getCoords(vData.location, vData.country);
        if (coords) {
          vData.locationCoords = coords;
        }
      } catch (coordErr) {
        console.error("⚠️ Памылка атрымання каардынат:", coordErr.message);
      }
    }
    // 💡 Precision Fix: толькі першы фрагмент абнаўляе існуючую вакансію
    let currentExistingId = existingId;

    for (const vData of vacancyDataList) {
      const finalAgency = preDefinedAgency || vData.agencyName || "Manual";

      // 🔍 ЛОГІКА ПОШУКУ ДУБЛІКАТАЎ (v4.5 - Smart Hybrid Search)
      if (!currentExistingId) {
         // 1. Прыярытэт па хэшы (для табліц і трэла)
        if (sourceHash) {
          const byHash = await Vacancy.findOne({ sourceHash, status: { $in: ["active", "pending_ai"] } });
          if (byHash) currentExistingId = byHash._id;
        }

         // 2. Калі хэша няма (чаты), шукаем кандыдатаў і пытаемся ў AI
        if (!currentExistingId) {
          const potentialMatches = await Vacancy.find({
            agencyName: finalAgency,
            location: { $regex: new RegExp(`^${vData.location}$`, "i") },
            brand: vData.brand ? { $regex: new RegExp(`^${vData.brand}$`, "i") } : { $in: ["", null] },
            status: { $in: ["active", "pending_ai"] }
          }).sort({ updatedAt: -1 }).limit(3); // Бяром 3 апошнія для параўнання

          for (const candidate of potentialMatches) {
            try {
              const comparison = await aiService.compareVacanciesWithAI(vData, candidate);
              if (comparison.verdict === "DUPLICATE" || comparison.verdict === "UPDATE") {
                console.log(`✅ AI пацвердзіў супадзенне з ${candidate.vacancyCode}`);
                currentExistingId = candidate._id;
                break; 
              }
            } catch (err) {
              console.error(`⚠️ Памылка AI-параўнання з ${candidate.vacancyCode}:`, err.message);
            }
          }
        }
      }

      if (currentExistingId) {
        // 🛡️ АБАРОНА АД ФАЛЬШЫВЫХ АПДЭЙТАЎ (v4.6)
        const existing = await Vacancy.findById(currentExistingId);
        const newOriginalText = originalText || enrichedText;

        // Калі тэкст не змяніўся і вакансія актыўная — нічога не робім, каб не псаваць updatedAt
        if (
          existing &&
          existing.originalText === newOriginalText &&
          existing.status === "active"
        ) {
          console.log(
            `⏭️ Пропуск абнаўлення для ${existing.vacancyCode} — зменаў няма.`,
          );
          savedVacancies.push(existing);
          currentExistingId = null;
          continue;
        }

       // 🔄 РЭАЛЬНАЕ АБНАЎЛЕННЕ
        const updated = await Vacancy.findByIdAndUpdate(
          currentExistingId,
          {
            ...vData,
            agencyName: finalAgency,
            sourceType: sourceType,
            originalText: newOriginalText,
           rawText: Array.isArray(enrichedText) ? enrichedText.join("\n\n---\n\n") : enrichedText,
            sheetName: sheetName || vData.sheetName,
            isLowQuality: vData.isLowQuality || false,
            templateName: constructVacancyDisplayName({
              ...vData,
              agencyName: finalAgency,
            }),
            sourceHash: sourceHash || undefined,
            status: finalStatus,
            // Пазначаем для рэдактара, толькі калі вакансія актыўная
            postOutdated: finalStatus === "active" ? true : false,
          },
          { new: true },
        );
        console.log(`✅ Вакансія абноўлена: ${updated.vacancyCode} (Статус: ${finalStatus})`);
        savedVacancies.push(updated);
        currentExistingId = null;
      }  else {
        // ✨ ЛОГІКА СТВАРЭННЯ НОВАЙ
        const vacancyCode = await generateVacancyCode();
        const newVacancy = new Vacancy({
          ...vData,
          agencyName: finalAgency,
          sourceType: sourceType,
          sheetName: sheetName || vData.sheetName,
          templateName: constructVacancyDisplayName({
            ...vData,
            agencyName: finalAgency,
          }),
          vacancyCode,
          isLowQuality: vData.isLowQuality || false,
          originalText: originalText || enrichedText,
          rawText: Array.isArray(enrichedText) ? enrichedText.join("\n\n---\n\n") : enrichedText,
          isTruncated,
          parsingResultType,
          sourceHash,
          status: finalStatus,
          postOutdated: finalStatus === "active" ? true : false,
        });

        const saved = await newVacancy.save();
        console.log(`✅ Вакансія створана: ${vacancyCode} (Статус: ${finalStatus})`);
        savedVacancies.push(saved);
      }
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
      sourceHash, // Калі перадаецца
      sheetName, // 👈 Дадаем прыём назвы ліста
      existingId, // 👈 Прымаем ID
      sourceType, // 👈 ДАДАДЗЕНА
    } = req.body;

    const result = await processVacancyMessage(
      rawText,
      senderInfo || "Manual",
      agencyName,
      rawText,
      isTruncated || false,
      parsingResultType || "FULL_VACANCY",
      sourceHash || null,
      sheetName || "", // 👈 Перадаем у апрацоўку
      existingId || null, // 👈 Перадаем у працэсар
      sourceType || "manual", // 👈 ПЕРАДАЕМ У ПРАЦЭСАР
    );

    if (result && result._id && !result.error) {
      console.log(`✅ [Reparse] Вакансія ${vacancy.vacancyCode} паспяхова абноўлена.`);
      res.json(result);
    } else {
      const errorMsg = result?.error || "Усе AI-мадэлі адмовілі ў апрацоўцы";
      console.error(`❌ [Reparse] Памылка: ${errorMsg}`);
      res.status(500).json({ message: errorMsg }); // 👈 Цяпер фронтэнд убачыць памылку
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

    // Пазначаем для ручной публікацыі
    newVacancy.postOutdated = true;
    const saved = await newVacancy.save();

    if (messageId) {
      await markInboxMessageAsProcessed(messageId);
    }

    console.log(`✅ Вакансія ${saved.vacancyCode} створана з шаблона. Чакае публікацыі.`);
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

     const coords = await locationService.getCoords(vacancyData.location, vacancyData.country);
    const newVacancy = new Vacancy({ 
      ...vacancyData, 
      vacancyCode,
      locationCoords: coords || undefined 
    });
    // Пазначаем, што пост патрабуе генерацыі, і захоўваем без адпраўкі
    newVacancy.postOutdated = true;
    const saved = await newVacancy.save();

    if (messageId) {
      await markInboxMessageAsProcessed(messageId);
    }

    console.log(`✅ Вакансія ${saved.vacancyCode} створана ўручную. Чакае публікацыі.`);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Manual Create Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// Фільтры (Выпраўлена для v2.1)
router.get("/filters-data", async (req, res) => {
  try {
    const vacancies = await Vacancy.find({
      status: { $in: ["active", "closed"] },
    });

    const cities = new Set();
    const agencies = new Set();
    const brands = new Set();
    const nuances = new Set();
    const voivodeships = new Set();

    vacancies.forEach((v) => {
      // 1. Гарады
      if (v.location) {
        v.location.split(",").forEach((cityPart) => {
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

      // 4. Нюансы
      if (v.conditions?.specificNuances) {
        v.conditions.specificNuances.forEach((n) => {
          if (n && n.category) nuances.add(n.category);
        });
      }

      // 5. ✅ РАЗУМНЫ ЗБОР ВАЯВОДСТВАЎ (v2.3)
      // Калі краіна — Польшча, заўсёды дадаем агульны пункт
      if (
        v.country === "Polska" ||
        (v.voivodeship && v.voivodeship.toLowerCase().includes("польща"))
      ) {
        voivodeships.add("Польща");
      }

      if (v.voivodeship) {
        const vovLower = v.voivodeship.toLowerCase();

        // Правяраем кожнае эталоннае ваяводства на ўваходжанне ў радок
        POLISH_VOIVODESHIPS.forEach((p) => {
          if (vovLower.includes(p.toLowerCase())) {
            voivodeships.add(p);
          }
        });

        if (vovLower.includes("європ") || vovLower.includes("europe")) {
          voivodeships.add("Інші країни Європи");
        }
      }
    });

    res.json({
      cities: Array.from(cities).sort(),
      agencies: Array.from(agencies).sort(),
      brands: Array.from(brands).sort(),
      nuances: Array.from(nuances).sort(),
      voivodeships: Array.from(voivodeships).sort(), // Гэта пойдзе ў фільтр "Регіон"
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
      freeHousing, // 👈 ДАДАДЗЕНА
      startDate, // 👈 ДАДАДЗЕНА
      endDate, // 👈 ДАДАДЗЕНА
      onlyDayShifts, // 👈 ДАДАДЗЕНА
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
    // Фільтр па бескаштоўнаму жыллю (v4.8)
    if (freeHousing === "true") {
      query["accommodation.isFree"] = true;
    }
    // Фільтр па зарплаце (baseNetto)
    if ((minSalary && minSalary !== "") || (maxSalary && maxSalary !== "")) {
      query["salary.baseNetto"] = { $ne: null };
      if (minSalary && minSalary !== "")
        query["salary.baseNetto"].$gte = Number(minSalary);
      if (maxSalary && maxSalary !== "")
        query["salary.baseNetto"].$lte = Number(maxSalary);
    }
    // Фільтр па графіку (onlyDayShifts)
if (onlyDayShifts === "true") {
  query["schedule.onlyDayShifts"] = true;
}
    // Фільтр па ўзросце (maxAge)
    if ((minAge && minAge !== "") || (maxAge && maxAge !== "")) {
      query["requirements.age.max"] = { $ne: null };
      if (minAge && minAge !== "")
        query["requirements.age.max"].$gte = Number(minAge);
      if (maxAge && maxAge !== "")
        query["requirements.age.max"].$lte = Number(maxAge);
    }

    // Мульты-фільтры па рэгіёнах (v2.3)
    if (city) {
      const cityList = city.split(",");
      const isPolandSelected = cityList.includes("Польща");
      const strictRegex = (v) => new RegExp(`(^|,)\\s*${v}\\s*(,|$)`, "i");

      let regionConditions = [];

      if (isPolandSelected) {
        const otherSelected = cityList.filter((c) => c !== "Польща");
        regionConditions = [
          { country: "Polska" },
          ...otherSelected.map((v) => ({ voivodeship: strictRegex(v) })),
        ];
      } else {
        regionConditions = cityList.map((v) => ({
          voivodeship: strictRegex(v),
        }));
      }

      // Бяспечнае даданне ў запыт праз $and, каб не зламаць іншыя $or
      if (regionConditions.length > 0) {
        if (!query.$and) query.$and = [];
        query.$and.push({ $or: regionConditions });
      }
    }
    if (agency) query.agencyName = { $in: agency.split(",") };
    if (category) query.category = { $in: category.split(",") };
    // Фільтр па датах (v3.7)
    if (startDate || endDate) {
      const dateRange = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // Пачатак дня
        dateRange.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Канец дня
        dateRange.$lte = end;
      }

      // Выкарыстоўваем толькі updatedAt, бо яна заўсёды актуальная
      query.updatedAt = dateRange;
    }

    // 🆕 Фільтр па крыніцах (sourceType)
    if (req.query.sourceType) {
      query.sourceType = { $in: req.query.sourceType.split(",") };
    }

    // Сартуем па даце абнаўлення (самыя свежыя зверху)
    const vacancies = await Vacancy.find(query).sort({
      updatedAt: -1,
      createdAt: -1,
    });
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

    // Пазначаем, што пасля AI-абнаўлення пост трэба перагенераваць
    updatedData.postOutdated = true;
    updatedData.rawText = `${existingVacancy.rawText}\n\n--- UPDATE ---\n${rawText}`;

    const saved = await Vacancy.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    console.log(`✅ Вакансія ${saved.vacancyCode} абноўлена праз AI. Пост пазначаны як састарэлы.`);

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

      // 1. Нармалізацыя лакацыі
// 1. Нармалізацыя праз асноўную функцыю
      let newLoc = aiService.normalizeLocation(v.location, v.country);
      
      // 2. Калі краіна не Польшча, забяспечваем фармат "Full City Name (Country)"
      if (v.country && v.country !== "Polska") {
        const countryTag = `(${v.country})`;
        // Прыбіраем ЛЮБЫЯ дужкі, якія маглі быць у назве, каб атрымаць чысты горад
        const cityOnly = newLoc.replace(/\s*\([^)]+\)/gi, "").trim();
        newLoc = `${cityOnly} ${countryTag}`;
      }

      // 2. Нармалізацыя брэнда
      const newBrand = aiService.validateBrand(v.brand);
      if (newBrand !== v.brand) {
        v.brand = newBrand;
        isChanged = true;
      }

// 🏠 ПРАВЕРКА БЯСПЛАТНАГА ЖЫТЛА (цяпер праз агульную функцыю isHousingFree)
const correctIsFree = aiService.isHousingFree(v.accommodation?.type, v.accommodation?.details);
if (v.accommodation.isFree !== correctIsFree) {
  v.accommodation.isFree = correctIsFree;
  isChanged = true;
}
      // 3. РАЗУМНАЯ НАРМАЛІЗАЦЫЯ МУЛЬТЫ-ВАЯВОДСТВАЎ (v2.3.2)
      if (v.voivodeship) {
        // Разбіваем радок па косках (на выпадак "Wielkopolskie, Dolnośląskie")
        const parts = v.voivodeship
          .split(",")
          .map((p) => p.trim().toLowerCase());
        const normalizedParts = new Set();

        parts.forEach((part) => {
          if (!part) return;

          // 1. Спрабуем знайсці ў мапе (напр. "підляське")
          if (VOIVODESHIP_MAP[part]) {
            normalizedParts.add(VOIVODESHIP_MAP[part]);
          } else {
            // 2. Правяраем ці ёсць у POLISH_VOIVODESHIPS (ігнаруючы рэгістр)
            const correctName = POLISH_VOIVODESHIPS.find(
              (p) => p.toLowerCase() === part,
            );
            if (correctName) {
              normalizedParts.add(correctName);
            } else if (
              part === "інші країни європи" ||
              part.includes("європ")
            ) {
              normalizedParts.add("Інші країни Європи");
            }
          }
        });

        // Калі мы знайшлі хоць адно валіднае ваяводства
        if (normalizedParts.size > 0) {
          const newVoivStr = Array.from(normalizedParts).sort().join(", ");
          if (v.voivodeship !== newVoivStr) {
            v.voivodeship = newVoivStr;
            isChanged = true;
          }
        } else {
          // Калі ў полі было смецце — ставім "Польща"
          if (v.voivodeship !== "Польща") {
            v.voivodeship = "Польща";
            isChanged = true;
          }
        }
      } else {
        // Калі пусто — ставім "Польща"
        v.voivodeship = "Польща";
        isChanged = true;
      }

      // 4. Уніфікацыя Еўропы
      const europeRegex = /європа|інші країни європи/i;
      if (v.voivodeship && europeRegex.test(v.voivodeship)) {
        v.voivodeship = "Інші країни Європи";
        isChanged = true;
      }
 // 🌍 Аўта-атрыманне каардынат падчас ачысткі
      const coords = await locationService.getCoords(newLoc, v.country);
      if (coords) {
        v.locationCoords = coords;
        isChanged = true;
      }
      if (isChanged) {
        await v.save();
        updatedCount++;
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
async function retryPendingVacancies() {
  console.log("🧹 [Queue] Спроба даапрацаваць вакансіі са статусам pending_ai...");
  const pending = await Vacancy.find({ status: "pending_ai" });
  if (pending.length === 0) return;

  for (const vac of pending) {
    console.log(`🔄 Рэтрай для ${vac.vacancyCode}...`);
    await processVacancyMessage(
      vac.rawText,
      vac.sender || "System",
      vac.agencyName,
      vac.originalText,
      vac.isTruncated,
      vac.parsingResultType,
      vac.sourceHash,
      vac.sheetName,
      vac._id,
      vac.sourceType,
      true // Прымусова Full
    );
    await new Promise(r => setTimeout(r, 5000));
  }
}
// Генерацыя прэв'ю для рэдактара
router.post("/:id/generate-preview", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ message: "Вакансія не знойдзена" });

    const postText = await aiService.formatTelegramPost(vacancy);
    if (!postText) throw new Error("AI_EMPTY");

    const parts = postText.split("=== SPLIT ===");
    
    vacancy.telegramFull = parts[0]?.trim() || "";
    vacancy.telegramShort = parts[1]?.trim() || "";
    vacancy.postOutdated = false;
    vacancy.postGeneratedAt = new Date(); // Захоўваем час генерацыі
    await vacancy.save();

    res.json({ full: vacancy.telegramFull, short: vacancy.telegramShort });
  } catch (err) {
    console.error("❌ Preview Error:", err.message);
    
    const isLimit = err.message.includes("AI_COOLDOWN") || 
                    err.message.includes("429") || 
                    err.message.includes("ALL_AI_MODELS_FAILED");

    if (isLimit) {
      return res.status(503).json({ 
        message: "Зараз AI дасягнуў ліміту запытаў або вельмі заняты. З сістэмай усё добра, проста паспрабуйце згенераваць пост яшчэ раз праз 2, 3 або 5 хвілін." 
      });
    }
    res.status(500).json({ message: "Памылка AI: " + err.message });
  }
});

// Публікацыя адрэдагаванага паста
router.post("/:id/publish", upload.single('file'), async (req, res) => {
  global.isManualActionInProgress = true; // 👈 Уключаем прыярытэт
  try {
    const { fullText, shortText, mode } = req.body;
    const file = req.file;

    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ message: "Вакансія не знойдзена" });

    let textToSend = mode === "short" ? (shortText || vacancy.telegramShort) : (fullText || vacancy.telegramFull);

    await sendToTelegram(textToSend, vacancy._id, file);

    vacancy.isPublished = true;
    await vacancy.save();
    
    res.json({ message: "✅ Апублікавана" });
  } catch (err) {
    console.error("❌ Publish Route Error:", err.message);
    res.status(500).json({ message: "Памылка публікацыі: " + err.message });
  } finally {
    global.isManualActionInProgress = false; // 👈 Выключаем прыярытэт
  }
});
// 1. Генерацыя сырога тэксту для дайджэста
router.post("/bulk-preview", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) return res.status(400).json({ message: "Вакансії не обрані" });

    const vacancies = await Vacancy.find({ _id: { $in: ids } });
    
    let digest = ""; // Пуста, каб ты сам напісаў уступ у мадалцы
    
    vacancies.forEach((v, index) => {
      // ВЫКЛІК СКРЫПТА
      digest += formatShortPostScript(v);
      
      if (index !== vacancies.length - 1) {
        digest += "\n\n-------------------\n\n";
      }
    });

    digest += "\n\n📲 Контактуйте: @InnaNovaWork +48 780 770 745 Інна";
    
    res.json({ text: digest });
  } catch (err) {
    console.error("❌ Bulk Preview Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 2. Публікацыя (прымае гатовы тэкст са сплітамі ад фронтэнда)
router.post("/bulk-publish", upload.single('file'), async (req, res) => {
  global.isManualActionInProgress = true; // 👈 Уключаем прыярытэт
  try {
    const { text } = req.body;
    const file = req.file;

    if (!text) return res.status(400).json({ message: "Текст порожній" });

    await sendToTelegram(text, null, file);
    
    res.json({ message: "✅ Опубліковано" });
  } catch (err) {
    console.error("❌ Bulk Publish Error:", err.message);
    res.status(500).json({ message: "Помилка публікації: " + err.message });
  } finally {
    global.isManualActionInProgress = false; // 👈 Выключаем прыярытэт
  }
});
// 🔄 Перапарсінг адной вакансіі праз AI (v5.0)
router.post("/:id/reparse", async (req, res) => {
  global.isManualActionInProgress = true; // 👈 Уключаем прыярытэт
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ message: "Вакансія не знойдзена" });

    const textToParse = vacancy.originalText || vacancy.rawText;
    const result = await processVacancyMessage(
      textToParse,
      vacancy.sender || "Manual",
      vacancy.agencyName,
      vacancy.originalText,
      vacancy.isTruncated,
      vacancy.parsingResultType,
      vacancy.sourceHash,
      vacancy.sheetName,
      vacancy._id,
      vacancy.sourceType,
      true 
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Памылка перапарсінгу: " + err.message });
  } finally {
    global.isManualActionInProgress = false; // 👈 Выключаем заўсёды
  }
});
module.exports = { router, processVacancyMessage, retryPendingVacancies, generateVacancyCode };
