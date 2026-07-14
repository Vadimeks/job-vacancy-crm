// backend/services/telegram.service.js
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const RECRUITER_CHAT_ID = process.env.RECRUITER_CHAT_ID;
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME;
/**
 * Адпраўка паведамлення з падтрымкай спліцінгу для доўгіх тэкстаў
 */
const sendToTelegram = async (postText, vacancyId = null, file = null) => {
  if (!postText) return;

  // 1. Разбіваем на асобныя пасты (Поўны / Кароткі), калі ёсць маркер
  const posts = postText.includes("=== SPLIT ===")
    ? postText.split("=== SPLIT ===").map(p => p.trim()).filter(p => p)
    : [postText];

  for (let i = 0; i < posts.length; i++) {
    const content = posts[i];
    
    // 👈 ДАДАДЗЕНА: Фармуем кнопку-спасылку на бот (v7.3)
    const replyMarkup = vacancyId ? {
      inline_keyboard: [
        [{ 
          text: "✅ Мені цікаво / Зв'язатися", 
          url: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=apply_${vacancyId}` 
        }]
      ]
    } : undefined;
   
    const MAX_CAPTION = 1024; // Ліміт Telegram на подпіс пад фота
    const MAX_MSG = 4000;     // Ліміт на звычайнае паведамленне

    try {
      // 2. Калі ёсць файл — апрацоўваем яго толькі для ПЕРШАГА паведамлення
      if (file && i === 0) {
        const isVideo = file.mimetype.includes('video');
        const method = isVideo ? 'sendVideo' : 'sendPhoto';
        
        if (content.length <= MAX_CAPTION) {
          // ВАРЫЯНТ А: Тэкст кароткі — адпраўляем як подпіс (caption)
          await bot.telegram[method](CHANNEL_ID, { source: file.buffer }, {
            caption: content,
            parse_mode: "Markdown",
            reply_markup: replyMarkup // 👈 Дадалі кнопку
          });
        } else {
          // ВАРЫЯНТ Б: Тэкст доўгі — адпраўляем файл асобна, потым УВЕСЬ тэкст
          await bot.telegram[method](CHANNEL_ID, { source: file.buffer });
          
          // Адпраўка тэксту (з улікам ліміту 4000)
          if (content.length <= MAX_MSG) {
            await bot.telegram.sendMessage(CHANNEL_ID, content, {
              parse_mode: "Markdown",
              disable_web_page_preview: true,
              reply_markup: replyMarkup // 👈 Дадалі кнопку
            });
          } else {
            const splitIndex = content.lastIndexOf("\n", MAX_MSG) || MAX_MSG;
            await bot.telegram.sendMessage(CHANNEL_ID, content.substring(0, splitIndex), { parse_mode: "Markdown" });
            await bot.telegram.sendMessage(CHANNEL_ID, content.substring(splitIndex), { parse_mode: "Markdown" });
          }
        }
      } else {
        // 3. Звычайная адпраўка тэксту (без файла або для наступных частак)
        if (content.length <= MAX_MSG) {
          await bot.telegram.sendMessage(CHANNEL_ID, content, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: replyMarkup
          });
        } else {
          const splitIndex = content.lastIndexOf("\n", MAX_MSG) || MAX_MSG;
          await bot.telegram.sendMessage(CHANNEL_ID, content.substring(0, splitIndex), { parse_mode: "Markdown" });
          await bot.telegram.sendMessage(CHANNEL_ID, content.substring(splitIndex), { parse_mode: "Markdown" });
        }
      }
      
      // Паўза паміж паведамленнямі для абыходу спам-фільтраў
      await new Promise(r => setTimeout(r, 2000));

    } catch (err) {
      console.error("❌ Telegram Send Error:", err.message);
      // Аварыйны фолбэк: адпраўка як Plain Text, калі Markdown памылковы
      await bot.telegram.sendMessage(CHANNEL_ID, content).catch(e => 
        console.error("⚠️ Нават Plain Text не прайшоў:", e.message)
      );
    }
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
    // Дадаем .catch, каб памылка выдалення вэбхука не блакавала запуск
    await bot.telegram.deleteWebhook({ drop_pending_updates: true })
      .catch(e => console.warn("⚠️ Webhook delete failed (non-critical):", e.message));
    
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
