// backend/services/telegram.service.js
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const RECRUITER_CHAT_ID = process.env.RECRUITER_CHAT_ID;

const sendToTelegram = async (postText) => {
  try {
    await bot.telegram.sendMessage(CHANNEL_ID, postText, {
      parse_mode: "Markdown",
    });
    console.log("✅ Вакансія адпраўлена ў Telegram-канал");
  } catch (err) {
    console.warn("⚠️ Markdown памылка, адпраўляем як plain text...");
    try {
      await bot.telegram.sendMessage(CHANNEL_ID, postText);
      console.log("✅ Адпраўлена як plain text");
    } catch (err2) {
      console.error("❌ Памылка адпраўкі ў Telegram:", err2.message);
    }
  }
};

const notifyRecruiter = async (text) => {
  if (!RECRUITER_CHAT_ID) return;
  try {
    await bot.telegram.sendMessage(RECRUITER_CHAT_ID, text, {
      parse_mode: "Markdown",
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

module.exports = { bot, sendToTelegram, notifyRecruiter, startBot };
