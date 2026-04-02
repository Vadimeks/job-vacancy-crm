// backend/services/telegram.service.js
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const RECRUITER_CHAT_ID = process.env.RECRUITER_CHAT_ID;

const sendToTelegram = async (postText, vacancyId = null) => {
  try {
    // Дадаем кнопку (пакуль закаментавана логіка спасылкі, але структура гатовая)
    /*
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url("📝 Відгукнутися", `https://t.me/твой_бот_name?start=${vacancyId}`)],
      [Markup.button.url("👤 Звязацца з рэкрутарам", "https://t.me/твой_рэкрутар_username")]
    ]);
    */
    await bot.telegram.sendMessage(CHANNEL_ID, postText, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      // reply_markup: keyboard.reply_markup // Раскаментуй гэта, калі захочаш дадаць кнопкі
    });
    console.log("✅ Вакансія адпраўлена ў Telegram (HTML)");
  } catch (err) {
    console.error("❌ Памылка HTML парсінгу:", err.message);
    // Калі HTML зламаўся (напрыклад, незакрыты тэг), шлем як просты тэкст
    await bot.telegram
      .sendMessage(CHANNEL_ID, postText)
      .catch((e) => console.error(e));
  }
};
// 2. ПАШЫРЭННЕ notifyRecruiter ДЛЯ МАТЧЫНГУ
const notifyRecruiterAboutMatch = async (vacancy, candidates) => {
  if (!RECRUITER_CHAT_ID || !candidates || candidates.length === 0) return;

  try {
    let message = `<b>🔥 Знойдзены матчынг для вакансіі:</b>\n`;
    message += `<code>${vacancy.vacancyCode}</code> — ${vacancy.title}\n\n`;
    message += `<b>Топ кандыдатаў:</b>\n`;

    // Фармуем спіс кандыдатаў са спасылкамі
    const candidateList = candidates
      .slice(0, 5)
      .map((can, index) => {
        // Спасылка на кандыдата ў тваёй адмінцы (прыклад)
        const adminLink = `${process.env.FRONTEND_URL}/candidates/${can._id}`;
        return `${index + 1}. <a href="${adminLink}">${can.name || "Безыменны"}</a> (Score: ${can.matchScore})`;
      })
      .join("\n");

    message += candidateList;
    message += `\n\n<i>Націсніце на імя, каб перайсці ў профіль.</i>`;

    await bot.telegram.sendMessage(RECRUITER_CHAT_ID, message, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  } catch (err) {
    console.error("❌ Памылка апавяшчэння рэкрутэра:", err.message);
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
      console.warn("⚠️ Бот ужо запушчаны ў іншым месцы — працягваем без бота");
    } else {
      console.error("❌ Памылка запуску бота:", err.message);
    }
  }
};

module.exports = {
  bot,
  sendToTelegram,
  notifyRecruiter,
  notifyRecruiterAboutMatch,
  startBot,
};
