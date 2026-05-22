// backend/services/telegram.service.js
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const RECRUITER_CHAT_ID = process.env.RECRUITER_CHAT_ID;

/**
 * Адпраўка паведамлення з падтрымкай спліцінгу для доўгіх тэкстаў
 */
const sendToTelegram = async (postText, vacancyId = null) => {
  const MAX_LENGTH = 4000; // Бяспечны ліміт (Telegram дазваляе 4096)

  try {
    if (postText.length <= MAX_LENGTH) {
      // Звычайная адпраўка, калі тэкст у межах ліміту
      await bot.telegram.sendMessage(CHANNEL_ID, postText, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    } else {
      // --- ЛОГІКА СПЛІЦІНГУ ---
      console.log(
        `📏 Пост занадта доўгі (${postText.length} сімв.). Разбіваем на часткі...`,
      );

      // 1. Вызначаем загаловак (першы радок) для кантэксту другой часткі
      const lines = postText.split("\n");
      const title = lines[0] || "Вакансія";

      // 2. Шукаем месца для разрэзу (апошні перанос радка перад 4000 сімвалаў)
      let splitIndex = postText.lastIndexOf("\n", MAX_LENGTH);
      if (splitIndex === -1) splitIndex = MAX_LENGTH; // Калі няма пераносаў, рэжам жорстка

      const part1 = postText.substring(0, splitIndex).trim();
      const part2 = `*${title.replace(/\*/g, "")}* (продовження опису)\n\n${postText.substring(splitIndex).trim()}`;

      // 3. Адпраўляем першую частку
      await bot.telegram.sendMessage(CHANNEL_ID, part1, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });

      // 4. Невялікая паўза, каб захаваць парадак паведамленняў
      await new Promise((r) => setTimeout(r, 1000));

      // 5. Адпраўляем другую частку
      await bot.telegram.sendMessage(CHANNEL_ID, part2, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });

      console.log("✅ Вакансія адпраўлена двума паведамленнямі");
    }
    console.log("✅ Вакансія адпраўлена ў Telegram (Markdown)");
  } catch (err) {
    console.error(
      "❌ Памылка Markdown. Спрабуем адправіць як звычайны тэкст...",
    );
    // Калі Markdown не прайшоў, адпраўляем як Plain Text (без спліцінгу, бо Plain Text дазваляе больш сімвалаў, але лепш проста адправіць арыгінал)
    await bot.telegram
      .sendMessage(CHANNEL_ID, postText)
      .catch((e) =>
        console.error("⚠️ Нават Plain Text не прайшоў:", e.message),
      );
  }
};

const notifyRecruiterAboutMatch = async (vacancy, candidates) => {
  if (!RECRUITER_CHAT_ID || !candidates || candidates.length === 0) return;

  try {
    let message = `<b>🔥 Знойдзены матчынг для вакансіі:</b>\n`;
    message += `<code>${vacancy.vacancyCode}</code> — ${vacancy.vacancydescription || "Без назвы"}\n\n`;
    message += `<b>Топ кандыдатаў:</b>\n`;

    const candidateList = candidates
      .slice(0, 5)
      .map((can, index) => {
        const adminLink = `${process.env.FRONTEND_URL}/candidates/${can._id}`;
        const candidateName = can.name || "Безыменны";
        return `${index + 1}. <a href="${adminLink}">${candidateName}</a> (Score: ${can.matchScore})`;
      })
      .join("\n");

    message += candidateList;
    message += `\n\n<i>Націсніце на імя, каб перэйсці ў профіль.</i>`;

    await bot.telegram.sendMessage(RECRUITER_CHAT_ID, message, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
    console.log("✅ Апавяшчэнне аб матчынгу са спасылкамі адпраўлена");
  } catch (err) {
    console.error("❌ Памылка апавяшчэння рэкрутэра:", err.message);
  }
};

const notifyRecruiterAboutShortMessage = async (rawText) => {
  if (!RECRUITER_CHAT_ID) return;

  try {
    const isLocalhost = process.env.FRONTEND_URL?.includes("localhost");
    const message = `<b>📩 Атрымана кароткае паведамленне:</b>\n\n<i>"${rawText}"</i>\n\nДадзеных недастаткова для аўтаматычнага стварэння. Што зрабіць?`;

    if (isLocalhost) {
      await bot.telegram.sendMessage(RECRUITER_CHAT_ID, message, {
        parse_mode: "HTML",
      });
    } else {
      const encodedText = encodeURIComponent(rawText);
      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.url(
            "📋 Стварыць з шаблона",
            `${process.env.FRONTEND_URL}/templates?text=${encodedText}`,
          ),
        ],
        [
          Markup.button.url(
            "🔄 Абнавіць існуючую",
            `${process.env.FRONTEND_URL}/vacancies?updateText=${encodedText}`,
          ),
        ],
      ]);

      await bot.telegram.sendMessage(RECRUITER_CHAT_ID, message, {
        parse_mode: "HTML",
        reply_markup: keyboard.reply_markup,
      });
    }
  } catch (err) {
    console.error("❌ Памылка notifyRecruiterAboutShortMessage:", err.message);
  }
};

const notifyRecruiter = async (text) => {
  if (!RECRUITER_CHAT_ID) return;
  try {
    await bot.telegram.sendMessage(RECRUITER_CHAT_ID, text, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  } catch (err) {
    console.error("❌ Памылка апавяшчэння рэкрутэра:", err.message);
  }
};

const startBot = async () => {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    await bot.launch();
    console.log("✅ Бот запушчаны");
  } catch (err) {
    if (err.message?.includes("409")) {
      console.warn("⚠️ Бот ужо запушчаны ў іншым месцы");
    } else {
      console.error("❌ Памылка запуска бота:", err.message);
    }
  }
};

module.exports = {
  bot,
  sendToTelegram,
  notifyRecruiter,
  notifyRecruiterAboutMatch,
  notifyRecruiterAboutShortMessage,
  startBot,
};
