// backend/userbot.js
require("dotenv").config();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");
const axios = require("axios");

const API_ID = parseInt(process.env.TELEGRAM_API_ID);
const API_HASH = process.env.TELEGRAM_API_HASH;
const SESSION_STRING = process.env.TELEGRAM_SESSION || "";
const AGENCY_CHAT_IDS = process.env.AGENCY_CHAT_IDS
  ? process.env.AGENCY_CHAT_IDS.split(",").map((id) => id.trim())
  : [];
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

const session = new StringSession(SESSION_STRING);

async function startUserbot() {
  console.log("🤖 Запуск Telegram userbot...");

  const client = new TelegramClient(session, API_ID, API_HASH, {
    connectionRetries: 5,
  });

  // Аўтарызацыя
  await client.start({
    phoneNumber: async () => await input.text("📱 Увядзіце нумар тэлефона: "),
    password: async () => await input.text("🔑 Увядзіце пароль (2FA): "),
    phoneCode: async () => await input.text("📨 Увядзіце код з Telegram: "),
    onError: (err) => console.error("❌ Памылка аўтарызацыі:", err),
  });

  console.log("✅ Userbot аўтарызаваны!");

  // Захоўваем сесію каб не аўтарызавацца кожны раз
  const savedSession = client.session.save();
  console.log("\n🔑 ЗАХАВАЙЦЕ ГЭТЫ SESSION STRING У .env як TELEGRAM_SESSION:");
  console.log(savedSession);
  console.log("\n");

  // Паказваем усе чаты (для атрымання ID)
  if (AGENCY_CHAT_IDS.length === 0) {
    console.log("📋 Вашы чаты (скапіруйце патрэбныя ID у AGENCY_CHAT_IDS):");
    const dialogs = await client.getDialogs({ limit: 200 });
    for (const dialog of dialogs) {
      console.log(`  ${dialog.id} — ${dialog.title || dialog.name}`);
    }
    console.log("\n");
  }

  // Слухаем новыя паведамленні
  client.addEventHandler(async (event) => {
    try {
      const message = event.message;
      const chatId = message.chatId?.toString();

      // Фільтруем толькі пазначаныя чаты
      if (AGENCY_CHAT_IDS.length > 0 && !AGENCY_CHAT_IDS.includes(chatId)) {
        return;
      }

      const text = message.text;

      // Ігнаруем кароткія паведамленні і медыя без тэксту
      if (!text || text.length < 15) return;

      console.log(
        `📨 Новае паведамленне з чата [${chatId}]: ${text.substring(0, 60)}...`,
      );

      // Адпраўляем на апрацоўку ў бэкенд
      try {
        const res = await axios.post(`${BACKEND_URL}/api/vacancies/auto`, {
          rawText: text,
        });
        console.log(
          `✅ Вакансія апрацавана: ${res.data.title} (${res.data.vacancyCode})`,
        );
      } catch (err) {
        if (err.response?.status === 429) {
          console.error("⏱️ Rate limit. Паўтарыце пазней.");
        } else {
          console.error("❌ Памылка адпраўкі на бэкенд:", err.message);
        }
      }
    } catch (err) {
      console.error("❌ Памылка апрацоўкі паведамлення:", err.message);
    }
  }, new NewMessage({}));

  console.log(
    `🎧 Userbot слухае ${AGENCY_CHAT_IDS.length > 0 ? AGENCY_CHAT_IDS.length + " чатаў" : "ўсе чаты"}...`,
  );

  // Трымаем працэс актыўным
  await new Promise(() => {});
}

startUserbot().catch(console.error);
