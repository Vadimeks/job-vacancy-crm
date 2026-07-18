// backend/services/telegramCandidateBot.service.js

const { extractCandidateTags } = require("./candidateAi.service");
const { session, Markup } = require("telegraf");
const { bot, notifyRecruiter } = require("./telegram.service");
const Candidate = require("../models/Candidate");
const { matchVacanciesForCandidate } = require("./matching.service");
const aiService = require("./ai.service");
const Vacancy = require("../models/Vacancy");
// 👈 ДАДАДЗЕНА: Функцыя для запісу ўсіх дыялогаў у гісторыю CRM (v7.7.3)
async function logChat(telegramId, role, text, type = "chat") {
  try {
    const Candidate = require("../models/Candidate");
    await Candidate.findOneAndUpdate(
      { telegramId: String(telegramId) },
      { $push: { history: { text, role, type, date: new Date() } } }
    );
  } catch (err) { console.error("❌ LogChat Error:", err.message); }
}
// ===== КАНСТАНТЫ АНКЕТЫ =====
const CATEGORIES = [
  "Склади та логістика",
  "Харчова промисловість",
  "Автомобільна промисловість",
  "Виробництво та промисловість",
  "Будівництво",
  "Сільське господарство",
  "Торгівля та послуги",
  "Різне",
];

const VOIVODESHIPS = [
  "Dolnośląskie", "Kujawsko-Pomorskie", "Lubelskie", "Lubuskie",
  "Łódzkie", "Małopolskie", "Mazowieckie", "Opolskie",
  "Podkarpackie", "Podlaskie", "Pomorskie", "Śląskie",
  "Świętokrzyskie", "Warmińsko-Mazurskie", "Wielkopolskie", "Zachodniopomorskie",
];

const NATIONALITIES = [
  "Україна", "Молдова", "Білорусь", "Грузія", "Казахстан", "Азербайджан",
];

const DOCS_OPTIONS = [
  { label: "PESEL UKR", field: "hasPeselUkr" },
  { label: "Віза", field: "hasVisa" },
  { label: "Карта побуту", field: "hasKartaPobytu" },
  { label: "Санепід", field: "hasSanepid" },
  { label: "UDT", field: "hasUDT" },
  { label: "Права кат. B", field: "hasDrivingLicense" },
];
const LANGUAGE_LEVELS = [
  "Не вимагається", "A1", "A2", "B1", "B2", "C1"
];

const HOURS_PREFERENCES = [
  { label: "⏱️ До 170 год/міс", value: "low" },
  { label: "⏱️ 170–220 год/міс", value: "mid" },
  { label: "⏱️ 220+ год/міс", value: "high" }
];
// 👈 ДАДАДЗЕНА: Агульная клавіятура кантактаў (v7.7.7)
const CONTACT_KEYBOARD = Markup.inlineKeyboard([
  [{ text: "✈️ Написати в Telegram", url: "https://t.me/InnaNovaWork" }],
  [{ text: "📱 Написати у Viber", url: "https://msng.link/vi/48780770745" }],
  [{ text: "📞 Зателефонувати рекрутеру", url: "tel:+48780770745" }]
]);
// ===== ДАПАМОЖНЫЯ ФУНКЦЫІ =====

// 🧠 Функцыя для стварэння профілю на аснове вакансіі (v7.4)
function fillPrefsFromVacancy(vacancy) {
  const { getHoursBucket } = require("./matching.service");
  
  return {
    voivodeship: vacancy.voivodeship ? [vacancy.voivodeship.split(',')[0].trim()] : [],
    spheres: vacancy.category ? [vacancy.category] : [],
    accommodation: {
      needed: vacancy.accommodation?.type && !vacancy.accommodation.type.toLowerCase().includes("власн"),
      forCouples: vacancy.accommodation?.forCouples || false,
      freeOnly: vacancy.accommodation?.isFree || false
    },
    // 👈 ДАДАДЗЕНА: Пашыранае запаўненне профілю (v7.6.4)
    polishLanguageLevel: vacancy.requirements?.polishLanguageLevel || "Не вимагається",
    onlyDayShifts: vacancy.schedule?.onlyDayShifts || false,
    hoursRange: vacancy.salary?.hoursRange ? [getHoursBucket(vacancy.salary.hoursRange)] : [],
    experienceRequired: vacancy.requirements?.experienceRequired || false,
    nationality: vacancy.requirements?.nationalities?.[0] || "Україна",
    transportNeeded: vacancy.transport?.provided || false
  };
}
function getStep(ctx) {
  return ctx.session?.step || "name";
}

function setStep(ctx, step) {
  if (!ctx.session) ctx.session = {};
  ctx.session.step = step;
}

function buildInlineKeyboard(items, callbackPrefix, columns = 2) {
  const buttons = items.map(item =>
    Markup.button.callback(item, `${callbackPrefix}:${item}`)
  );
  const rows = [];
  for (let i = 0; i < buttons.length; i += columns) {
    rows.push(buttons.slice(i, i + columns));
  }
  return Markup.inlineKeyboard(rows);
}

function buildMultiSelectKeyboard(items, selected, callbackPrefix, columns = 2) {
  const buttons = items.map(item => {
    const isSelected = selected.includes(item);
    return Markup.button.callback(
      `${isSelected ? "✅ " : ""}${item}`,
      `${callbackPrefix}:${item}`
    );
  });
  const rows = [];
  for (let i = 0; i < buttons.length; i += columns) {
    rows.push(buttons.slice(i, i + columns));
  }
  rows.push([Markup.button.callback("✔️ Готово", `${callbackPrefix}:DONE`)]);
  return Markup.inlineKeyboard(rows);
}

// ===== АДПРАЎКА ВАКАНСІЙ КАНДЫДАТУ =====

async function sendMatchedVacanciesToCandidate(candidate) {
  try {
    const matched = await matchVacanciesForCandidate(candidate);

    if (matched.length === 0) {
      await bot.telegram.sendMessage(
        candidate.chatId,
        "На жаль, зараз підходящих вакансій немає. Але наш рекрутер незабаром з вами зв'яжеться! 📞"
      );
      await notifyRecruiter(
        `📋 <b>Новий кандидат з бота:</b>\n` +
        `👤 ${candidate.name} | ${candidate.telegram || candidate.phone || "—"}\n` +
        `🔍 Матчинг: <b>0 вакансій</b>\n` +
        `<a href="${process.env.FRONTEND_URL}/candidates/${candidate._id}">Відкрити профіль</a>`
      );
      return;
    }

    // Бяром першыя 4
    const toSend = matched.slice(0, 4);

    // Для кожнай вакансіі: генеруем пост калі яго няма
    for (const vac of toSend) {
      if (!vac.telegramFull) {
        console.log(`🤖 [CandidateBot] Генерацыя паста для ${vac.vacancyCode}...`);
        try {
          const vacDoc = await Vacancy.findById(vac._id);
          if (!vacDoc) continue;
          const postText = await aiService.formatTelegramPost(vacDoc);
          if (postText) {
            const parts = postText.split("=== SPLIT ===");
            vacDoc.telegramFull = parts[0]?.trim() || "";
            vacDoc.telegramShort = parts[1]?.trim() || "";
            vacDoc.postOutdated = false;
            vacDoc.postGeneratedAt = new Date();
            await vacDoc.save();
            vac.telegramFull = vacDoc.telegramFull;
            console.log(`✅ [CandidateBot] Пост згенераваны для ${vac.vacancyCode}`);
          }
        } catch (genErr) {
          console.error(`⚠️ [CandidateBot] Памылка генерацыі паста для ${vac.vacancyCode}:`, genErr.message);
        }
      }
    }

    // Адпраўляем кандыдату анонс
    await bot.telegram.sendMessage(
      candidate.chatId,
      `🎉 Знайдено <b>${toSend.length}</b> підходящих вакансій для вас!\n\nОтримуєте їх зараз 👇`,
      { parse_mode: "HTML" }
    );

    let sentCount = 0;
    for (const vac of toSend) {
      if (vac.telegramFull) {
        try {
          await bot.telegram.sendMessage(candidate.chatId, vac.telegramFull, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
          });
          sentCount++;
          await new Promise(r => setTimeout(r, 1500)); // Паўза паміж пастамі
        } catch (sendErr) {
          console.error(`⚠️ [CandidateBot] Памылка адпраўкі вакансіі ${vac.vacancyCode}:`, sendErr.message);
          // Фолбэк: адпраўляем кароткую картку без Markdown
          try {
            await bot.telegram.sendMessage(
              candidate.chatId,
              `📌 ${vac.vacancydescription}\n📍 ${vac.location}\n💰 ${vac.salary?.rawSalaryDisplay || "уточнюється"}`,
            );
            sentCount++;
          } catch (fallbackErr) {
            console.error(`❌ [CandidateBot] Нават фолбэк не прайшоў для ${vac.vacancyCode}:`, fallbackErr.message);
          }
        }
      }
    }
  const contactKeyboard = Markup.inlineKeyboard([
      [{ text: "✈️ Написати в Telegram", url: "https://t.me/InnaNovaWork" }],
      [{ text: "📱 Написати у Viber", url: "https://msng.link/vi/48780770745" }],
      [{ text: "📞 Зателефонувати рекрутеру", url: "tel:+48780770745" }]
    ]);
   
   await bot.telegram.sendMessage(candidate.chatId, "☝️ Оберіть вакансію, яка вам сподобалася, або зв'яжіться з рекрутером напряму:", CONTACT_KEYBOARD);
    // Апавяшчэнне рэкрутэру
    await notifyRecruiter(
      `📋 <b>Новий кандидат з бота:</b>\n` +
      `👤 ${candidate.name} | ${candidate.telegram || candidate.phone || "—"}\n` +
      `🔍 Матчинг: <b>${matched.length} знайдено, ${sentCount} відправлено</b>\n` +
      `💬 Підписка на вакансії: ${candidate.subscribedToVacancies ? "Так ✅" : "Ні"}\n` +
      `<a href="${process.env.FRONTEND_URL}/candidates/${candidate._id}">Відкрити профіль</a>`
    );

  } catch (err) {
    console.error("❌ [CandidateBot] Памылка ў sendMatchedVacanciesToCandidate:", err.message);
  }
}

// ===== ЗАВЯРШЭННЕ АНКЕТЫ І ЗАХАВАННЕ КАНДЫДАТА =====

async function finishQuestionnaire(ctx) {
  try {
    await ctx.reply("⏳ Обробляємо вашу анкету, зачекайте хвилинку...");

    const s = ctx.session;

    // 1. Апрацоўка даты гатоўнасці (v7.2)
    let readyDate = null;
    let readyDateNotes = "";
    if (s.readyDateInput === "ASAP") {
      readyDate = new Date();
      readyDateNotes = "Якнайшвидше (ASAP)";
    } else if (s.readyDateInput) {
      const [day, month] = s.readyDateInput.split('.').map(Number);
      const year = new Date().getFullYear();
      readyDate = new Date(year, month - 1, day);
      readyDateNotes = s.readyDateInput;
    }

    // 2. Будуем аб'ект дакументаў
    const documents = {};
    if (s.selectedDocs && s.selectedDocs.length > 0) {
      for (const docLabel of s.selectedDocs) {
        const docOption = DOCS_OPTIONS.find(d => d.label === docLabel);
        if (docOption) documents[docOption.field] = true;
      }
    }
    documents.activeDocs = s.selectedDocs || [];

    const genderMap = { "Пара": "Пари", "Сім'я": "Сім'ї" };
    const genderValue = genderMap[s.gender] || s.gender;

    const freeTextContext = [s.genderDetail, s.additionalNotes]
      .filter(Boolean)
      .join(". ");

    let additionalNotesTags = [];
    if (freeTextContext) {
      additionalNotesTags = await extractCandidateTags(freeTextContext);
      if (additionalNotesTags.length === 0) {
        additionalNotesTags = [freeTextContext.substring(0, 100)];
      }
    }

    const candidateData = {
      name: s.name || "Невідомо",
      contactType: "telegram",
      telegram: ctx.from.username ? `@${ctx.from.username}` : String(ctx.from.id),
      phone: s.phone || "",
      gender: genderValue,
      age: s.age || null,
      nationality: s.nationality || "Україна",
      currentLocation: s.currentLocation || "",
      telegramId: String(ctx.from.id),
      chatId: String(ctx.chat.id),
      subscribedToVacancies: s.subscribedToVacancies || false,
      additionalNotesTags,
      source: "telegram_bot",
      jobPreferences: {
        voivodeship: s.workLocation || [],
        locationFlexible: s.locationFlexible || false,
        spheres: s.spheres || [],
        accommodation: { 
          needed: s.needsAccommodation || false 
        },
        transport: {
          needed: s.transportNeeded || false // 👈 НОВАЕ
        },
        polishLanguageLevel: s.polishLanguageLevel || "Не вимагається", // 👈 НОВАЕ
        hoursRange: s.hoursRange || [], // 👈 НОВАЕ
        readyDate: readyDate, // 👈 НОВАЕ
        readyDateNotes: readyDateNotes // 👈 НОВАЕ
      },
      documents,
      notes: s.genderDetail ? `Уточнення: ${s.genderDetail}` : "",
    };

    let candidate = await Candidate.findOne({ telegramId: String(ctx.from.id) });
  if (candidate) {
      // Архівацыя старога профілю ў гісторыю
      candidate.profileHistory.push({
        updatedAt: new Date(),
        jobPreferences: candidate.jobPreferences,
        source: "user"
      });
      
      // Абнаўляем існуючага
      Object.assign(candidate, candidateData);
      await candidate.save();
      console.log(`🔄 [CandidateBot] Кандыдат абноўлены: ${candidate._id}`);
    } else {
      // Ствараем новага
      candidate = new Candidate(candidateData);
      await candidate.save();
      console.log(`✅ [CandidateBot] Новы кандыдат створаны: ${candidate._id}`);
    }

    await ctx.reply(
      `✅ Дякуємо, ${s.name || ""}! Ваша анкета збережена.\n\n🔍 Шукаємо підходящі вакансії...`
    );

    // Трыгер матчынгу і адпраўка вакансій
    await sendMatchedVacanciesToCandidate(candidate);

    // Скідаем сесію пасля завяршэння
    ctx.session = {};

  } catch (err) {
    console.error("❌ [CandidateBot] Памылка ў finishQuestionnaire:", err.message);
    await ctx.reply(
      "⚠️ Виникла помилка при збереженні анкети. Будь ласка, спробуйте ще раз: /start"
    );
  }
}

// ===== РЭГІСТРАЦЫЯ HANDLERS =====

function registerCandidateBotHandlers() {
  // Session middleware — убудаваны Telegraf, захоўвае ў памяці
  bot.use(session());

  // /start — пачатак анкеты
// 2. Новы апрацоўшчык START (унутры registerCandidateBotHandlers)
bot.start(async (ctx) => {
    const payload = ctx.startPayload; 
    const telegramId = String(ctx.from.id);
    
    let candidate = await Candidate.findOne({ telegramId });
    
    if (!candidate) {
      // 👈 НОВАЕ: Шукаем па імені, калі няма па telegramId
      const name = `${ctx.from.first_name || ""} ${ctx.from.last_name || ""}`.trim();
      const potentialDuplicate = await Candidate.findOne({ name: name });

      const { generateCandidateCode } = require("../routes/candidates");
      candidate = new Candidate({
        candidateCode: await generateCandidateCode(),
        name: name || "Кандидат",
        telegramId,
        chatId: String(ctx.chat.id),
        telegram: ctx.from.username ? `@${ctx.from.username}` : null,
        contactType: "telegram",
        source: "telegram_bot",
        // 👈 Пазначаем як дублікат, калі імя супала
        isDuplicate: !!potentialDuplicate,
        linkedDuplicateId: potentialDuplicate ? potentialDuplicate._id : null
      });
      await candidate.save();
      
      if (candidate.isDuplicate) {
        await notifyRecruiter(`⚠️ <b>Увага:</b> Знайдено дублікат кандидата па імені: <b>${name}</b>. <a href="${process.env.FRONTEND_URL}/candidates/${candidate._id}">Праверыць</a>`);
      }
    }

    if (payload && payload.startsWith('apply_')) {
      const vacancyId = payload.replace('apply_', '');
      const vacancy = await Vacancy.findById(vacancyId);
      
      if (vacancy) {
        // 1. Запісваем водгук у базу
        if (!candidate.appliedVacancies.some(av => av.vacancyId.toString() === vacancyId)) {
          candidate.appliedVacancies.push({ vacancyId, appliedAt: new Date(), type: "want_work" });
          await candidate.save();
        }

        // 2. Апавяшчэнне рэкрутэру (перанесена вышэй за return)
        await notifyRecruiter(
          `🔥 <b>Новий відгук на вакансію!</b>\n\n` +
          `📋 Вакансія: <b>${vacancy.vacancydescription}</b>\n` +
          `🆔 Код: <code>${vacancy.vacancyCode}</code>\n` +
          `👤 Кандидат: ${candidate.name}\n` +
          `✈️ Telegram: ${candidate.telegram || "немає"}\n` +
          `<a href="${process.env.FRONTEND_URL}/candidates/${candidate._id}">Відкрити профіль у CRM</a>`
        );

        // 3. Адказ кандыдату (выпраўлена мова)
        const confirmMsg = `✅ Ви відгукнулися на вакансію: ${vacancy.vacancydescription}\n\nРекрутер отримав ваше повідомлення і скоро зв'яжеться з вами.`;
        await ctx.reply(confirmMsg);
        await logChat(telegramId, "bot", confirmMsg);

        const promptMsg = `Щоб ми могли запропонувати вам найкращі варіанти, напишіть, будь ласка, **прямо сюди в чат** одним повідомленням:\n• Ваше ім'я та вік\n• Рівень польської мови\n• Досвід роботи\n• Коли готові приїхати\n\nАбо натисніть кнопку нижче, щоб заповнити анкету 👇`;
        await ctx.reply(promptMsg, {
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.webApp("📋 Заповнити анкету (1 хв)", `${process.env.FRONTEND_URL}/survey`)],
            [Markup.button.callback("⏭️ Пропустити", "skip_survey")]
          ])
        });
        
        setStep(ctx, "waiting_full_info"); 
        return;
      }
    }

    // 3. Калі проста заяўка на падбор або старт
    setStep(ctx, "name");
    await ctx.reply("👋 Вітаємо ў Nova Work Agency! Давайте заповнимо коротку анкету. Як вас звати?");
  });

  // ===== АПРАЦОЎКА ТЭКСТАВАГА ЎВОДУ =====
  bot.on("text", async (ctx) => {
    const step = getStep(ctx);
    const text = ctx.message.text.trim();

    // Ігнаруем каманды
    if (text.startsWith("/")) return;

    switch (step) {
      // 👈 ДАДАДЗЕНА: Апрацоўка адказу пасля водгуку (v7.7.3)
      case "waiting_full_info": {
        await logChat(ctx.from.id, "user", text); 
        await notifyRecruiter(`📝 <b>Додаткова інформація від кандидата (${ctx.from.first_name}):</b>\n\n<i>"${text}"</i>`);
        
        const thanksMsg = "Дякуємо! Інформація прийнята. Рекрутер вивчить ваші дані і напише вам найближчим часом. ⏳";
        await ctx.reply(thanksMsg);
        await logChat(ctx.from.id, "bot", thanksMsg);
        setStep(ctx, "idle");
        break;
      }

      // Крок 1: Імя
      case "name": {
        await logChat(ctx.from.id, "user", text); ctx.session.name = text;
        setStep(ctx, "phone");
        await ctx.reply("📞 Введіть ваш номер телефону або Viber (наприклад: +380991234567):");
        break;
      }

      // Крок 2: Тэлефон
      case "phone": {
        await logChat(ctx.from.id, "user", text); ctx.session.phone = text;
        setStep(ctx, "gender");
        await ctx.reply(
          "👤 Оберіть вашу стать:",
          buildInlineKeyboard(["Чоловіки", "Жінки", "Пара", "Сім'я"], "gender", 2)
        );
        break;
      }

      // Крок 4: Удакладненне полу (вольны тэкст)
      case "gender_detail": {
        await logChat(ctx.from.id, "user", `Уточнення статі: ${text}`); ctx.session.genderDetail = text;
        setStep(ctx, "age");
        await ctx.reply("🎂 Скільки вам років? (Введіть число):");
        break;
      }

      // Крок 5: Узрост
      case "age": {
        const age = parseInt(text, 10);
        if (isNaN(age) || age < 16 || age > 80) {
          await ctx.reply("⚠️ Будь ласка, введіть коректний вік (число від 16 до 80):");
          break;
        }
        ctx.session.age = age;
        await logChat(ctx.from.id, "user", `Вік: ${text}`); ctx.session.age = age;
        setStep(ctx, "nationality");
        await ctx.reply(
          "🌍 Оберіть вашу національність:",
          buildInlineKeyboard(NATIONALITIES, "nationality", 2)
        );
        break;
      }

      // Крок 7: Горад дзе зараз знаходзіцца
      case "current_location": {
        await logChat(ctx.from.id, "user", `Зараз у: ${text}`); ctx.session.currentLocation = text;
        setStep(ctx, "work_location");
        await ctx.reply(
          "📍 Де шукаєте роботу?",
          buildInlineKeyboard(
            ["Польща (будь-який регіон)", "Конкретне воєводство", "Інші країни Європи"],
            "work_location",
            1
          )
        );
        break;
      }
// Крок: Дата гатоўнасці (тэкставы ўвод)
      case "ready_date": {
        if (!text.match(/^\d{1,2}\.\d{1,2}$/)) {
          await ctx.reply("⚠️ Будь ласка, введіть дату у форматі ДД.ММ (наприклад: 20.07):");
          break;
        }
        await logChat(ctx.from.id, "user", `Готовий з: ${text}`); ctx.session.readyDateInput = text;
        setStep(ctx, "docs");
        const docLabels = DOCS_OPTIONS.map(d => d.label);
        await ctx.reply(
          "📄 Які документи у вас є? (можна кілька, потім натисніть Готово):",
          buildMultiSelectKeyboard(docLabels, [], "doc", 2)
        );
        break;
      }
      // Крок 14: Дадатковая інфармацыя
      case "additional": {
        await logChat(ctx.from.id, "user", `Побажання: ${text}`); ctx.session.additionalNotes = text;
        await finishQuestionnaire(ctx);
        break;
      }

      default:
        await ctx.reply("Будь ласка, скористайтеся кнопками вище 👆");
    }
  });

  // ===== CALLBACK HANDLERS (кнопкі) =====

  // Гендэр
  bot.action(/^gender:(.+)$/, async (ctx) => {
    const value = ctx.match[1];
    await logChat(ctx.from.id, "user", `Стать: ${value}`);
    ctx.session.gender = value;
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    setStep(ctx, "gender_detail");
    await ctx.reply(
      `✅ Обрано: ${value}\n\n` +
      "Якщо потрібно уточнити — напишіть тут.\n" +
      "_Наприклад: 'двоє друзів', 'мати з дитиною', 'троє чоловіків'_",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([[Markup.button.callback("⏭️ Пропустити", "gender_detail:SKIP")]])
      }
    );
  });

  // Пропуск удакладнення полу
  bot.action("gender_detail:SKIP", async (ctx) => {
    ctx.session.genderDetail = null;
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    setStep(ctx, "age");
    await ctx.reply("🎂 Скільки вам років? (Введіть число):");
  });

  // Нацыянальнасць
  bot.action(/^nationality:(.+)$/, async (ctx) => {
    const value = ctx.match[1];
   await logChat(ctx.from.id, "user", `Національність: ${value}`);
    ctx.session.nationality = value;
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    setStep(ctx, "current_location");
    await ctx.reply("🏙️ В якому місті або країні ви зараз знаходитесь? (Введіть текстом, наприклад: Київ, Варшава):");
  });

  // Бажаная лакацыя працы (першы ўзровень выбару)
  bot.action(/^work_location:(.+)$/, async (ctx) => {
    const value = ctx.match[1];
    await logChat(ctx.from.id, "user", `Шукає роботу: ${value}`);
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);

    if (value === "Польща (будь-який регіон)") {
      ctx.session.locationFlexible = true;
      ctx.session.workLocation = ["Польща"];
      setStep(ctx, "spheres");
      ctx.session.spheres = [];
      await ctx.reply(
        "🏭 Оберіть сфери роботи (можна кілька, потім натисніть Готово):",
        buildMultiSelectKeyboard(CATEGORIES, [], "sphere", 1)
      );
    } else if (value === "Інші країни Європи") {
      ctx.session.locationFlexible = false;
      ctx.session.workLocation = ["Інші країни Європи"];
      setStep(ctx, "spheres");
      ctx.session.spheres = [];
      await ctx.reply(
        "🏭 Оберіть сфери роботи (можна кілька, потім натисніть Готово):",
        buildMultiSelectKeyboard(CATEGORIES, [], "sphere", 1)
      );
    } else {
      // Выбар канкрэтных ваяводстваў
      ctx.session.locationFlexible = false;
      ctx.session.workLocation = [];
      setStep(ctx, "work_location_voiv");
      await ctx.reply(
        "🗺️ Оберіть воєводство (можна кілька, потім натисніть Готово):",
        buildMultiSelectKeyboard(VOIVODESHIPS, [], "voiv", 2)
      );
    }
  });

  // Выбар ваяводства (мульты-выбар)
  bot.action(/^voiv:(.+)$/, async (ctx) => {
    const value = ctx.match[1];

    if (value === "DONE") 
      {
      if (!ctx.session.workLocation || ctx.session.workLocation.length === 0) {
        await ctx.answerCbQuery("⚠️ Оберіть хоча б одне воєводство!");
        return;
      }
      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup(undefined);
      setStep(ctx, "spheres");
      ctx.session.spheres = [];
      await ctx.reply(
        "🏭 Оберіть сфери роботи (можна кілька, потім натисніть Готово):",
        buildMultiSelectKeyboard(CATEGORIES, [], "sphere", 1)
      );
    } else {
      await ctx.answerCbQuery();
      if (!ctx.session.workLocation) ctx.session.workLocation = [];
      const idx = ctx.session.workLocation.indexOf(value);
      if (idx > -1) {
        ctx.session.workLocation.splice(idx, 1);
      } else {
        ctx.session.workLocation.push(value);
      }
      await logChat(ctx.from.id, "user", `Обрано регіон: ${value}`);
      // Абнаўляем клавіятуру з адзначанымі элементамі
      await ctx.editMessageReplyMarkup(
        buildMultiSelectKeyboard(VOIVODESHIPS, ctx.session.workLocation, "voiv", 2).reply_markup
      );
    }
    
  });

  // Выбар сфер працы (мульты-выбар)
  bot.action(/^sphere:(.+)$/, async (ctx) => {
    const value = ctx.match[1];

    if (value === "DONE") {
      if (!ctx.session.spheres || ctx.session.spheres.length === 0) {
        await ctx.answerCbQuery("⚠️ Оберіть хоча б одну сферу!");
        return;
      }
      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup(undefined);
      setStep(ctx, "accommodation");
      await ctx.reply(
        "🏠 Вам потрібне житло від роботодавця?",
        buildInlineKeyboard(["Так", "Ні"], "accommodation", 2)
      );
    } else {
      await ctx.answerCbQuery();
      if (!ctx.session.spheres) ctx.session.spheres = [];
      const idx = ctx.session.spheres.indexOf(value);
      if (idx > -1) {
        ctx.session.spheres.splice(idx, 1);
      } else {
        ctx.session.spheres.push(value);
      }
      await logChat(ctx.from.id, "user", `Сфера: ${value}`);
      await ctx.editMessageReplyMarkup(
        buildMultiSelectKeyboard(CATEGORIES, ctx.session.spheres, "sphere", 1).reply_markup
      );
    }
    
  });

  // Жытло -> Пераход да Транспарту (v7.1)
  bot.action(/^accommodation:(.+)$/, async (ctx) => {
    const value = ctx.match[1];
    await logChat(ctx.from.id, "user", `Потрібне житло: ${value}`);
    ctx.session.needsAccommodation = value === "Так";
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    setStep(ctx, "transport");
    await ctx.reply(
      "🚌 Вам потрібен довіз да роботи?",
      Markup.inlineKeyboard([
        [Markup.button.callback("🚗 Так, потрібен", "transport:YES")],
        [Markup.button.callback("❌ Ні, не потрібно / Маю власне авто", "transport:NO")]
      ])
    );
  });
// Транспарт -> Пераход да Мовы (v7.1)
  bot.action(/^transport:(.+)$/, async (ctx) => { const value = ctx.match[1]; const text = value === "YES" ? "Так" : "Ні"; await logChat(ctx.from.id, "user", `Потрібен довіз: ${text}`); 
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    setStep(ctx, "language");
    await ctx.reply(
      "🗣️ Який ваш рівень знання польської мови?",
      buildInlineKeyboard(LANGUAGE_LEVELS, "lang", 2)
    );
  });
  // Мова -> Пераход да Гадзін (v7.1)
  bot.action(/^lang:(.+)$/, async (ctx) => {
    const value = ctx.match[1];
    await logChat(ctx.from.id, "user", `Рівень польської: ${value}`);
    ctx.session.polishLanguageLevel = value;
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    setStep(ctx, "hours");
    
    const hoursButtons = HOURS_PREFERENCES.map(h => 
      Markup.button.callback(h.label, `hours:${h.value}`)
    );
    
    await ctx.reply(
      "⏱️ Скільки годин на місяць ви бажаєте працювати?",
      Markup.inlineKeyboard(hoursButtons, { columns: 1 })
    );
  });
  // Гадзіны -> Пераход да Даты гатоўнасці (v7.1)
  bot.action(/^hours:(.+)$/, async (ctx) => {
    const value = ctx.match[1];
    await logChat(ctx.from.id, "user", `Бажані години: ${value}`);
    ctx.session.hoursRange = [value]; // Захоўваем як масіў для схемы
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    setStep(ctx, "ready_date");
    await ctx.reply(
      "📅 Коли ви готові розпочати роботу?\n\n" +
      "Введіть дату у форматі ДД.ММ (наприклад: 25.07):",
      Markup.inlineKeyboard([[Markup.button.callback("⏭️ Якнайшвидше", "ready_date:ASAP")]])
    );
  });

  // Апрацоўка кнопкі "Якнайшвидше"
  bot.action("ready_date:ASAP", async (ctx) => {
    await logChat(ctx.from.id, "user", "Дата: Якнайшвидше (ASAP)");
    ctx.session.readyDateInput = "ASAP";
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    setStep(ctx, "docs");
    const docLabels = DOCS_OPTIONS.map(d => d.label);
    await ctx.reply(
      "📄 Які документи у вас є? (можна кілька, потім натисніть Готово):",
      buildMultiSelectKeyboard(docLabels, [], "doc", 2)
    );
  });
  // Дакументы (мульты-выбар)
  bot.action(/^doc:(.+)$/, async (ctx) => {
    const value = ctx.match[1];

    if (value === "DONE") {
      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup(undefined);
      setStep(ctx, "subscribe");
      await ctx.reply(
        "🔔 Підписатись на вакансії, що підходять саме вам за обраними параметрами?\n\n" +
        "_Ви будете отримувати повідомлення, коли з'являться нові підходящі вакансії_",
        {
          parse_mode: "Markdown",
          ...buildInlineKeyboard(["Так", "Ні"], "subscribe", 2)
        }
      );
    } else {
      await ctx.answerCbQuery();
      if (!ctx.session.selectedDocs) ctx.session.selectedDocs = [];
      const idx = ctx.session.selectedDocs.indexOf(value);
      if (idx > -1) {
        ctx.session.selectedDocs.splice(idx, 1);
      } else {
        ctx.session.selectedDocs.push(value);
        await logChat(ctx.from.id, "user", `Документ: ${value}`);
      }
      const docLabels = DOCS_OPTIONS.map(d => d.label);
      await ctx.editMessageReplyMarkup(
        buildMultiSelectKeyboard(docLabels, ctx.session.selectedDocs, "doc", 2).reply_markup
      );
    }
  });

  // Падпіска на вакансіі
  bot.action(/^subscribe:(.+)$/, async (ctx) => {
    const value = ctx.match[1];
    await logChat(ctx.from.id, "user", `Підписка: ${value}`);
    ctx.session.subscribedToVacancies = value === "Так";
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    setStep(ctx, "additional");
   await ctx.reply(
      "📝 Якщо маєте побажання або деталі, яких не було в анкеті — **напишіть їх прямо сюди в чат**\n\n" +
      "_Наприклад: 'хочу роботу тільки вдень', 'їду з дитиною'_",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([[Markup.button.callback("⏭️ Пропустити", "additional:SKIP")]])
      }
    );
  });

  // Пропуск дадатковай інфармацыі
  bot.action("additional:SKIP", async (ctx) => {
    await logChat(ctx.from.id, "user", "Додаткова інформація: Пропущено");
    ctx.session.additionalNotes = null;
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    await finishQuestionnaire(ctx);
  });
// 👈 ДАДАДЗЕНА: Апрацоўка кнопкі "Пропустити" (v7.7.3)
  bot.action("skip_survey", async (ctx) => {
    const msg = "Дякуємо! Рекрутер зв'яжеться з вами найближчим часом. Очікуйте на повідомлення! ⏳";
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(undefined);
    await ctx.reply(msg);
    await logChat(ctx.from.id, "bot", msg); // Запісваем фінальнае паведамленне бота
    setStep(ctx, "idle");
  });
  console.log("✅ [CandidateBot] Handlers зарэгістраваны");
}

module.exports = { registerCandidateBotHandlers };