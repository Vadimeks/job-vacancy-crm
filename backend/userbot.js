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

  // 1. Аўтарызацыя
  await client.start({
    phoneNumber: async () => await input.text("📱 Увядзіце нумар тэлефона: "),
    password: async () => await input.text("🔑 Увядзіце пароль (2FA): "),
    phoneCode: async () => await input.text("📨 Увядзіце код з Telegram: "),
    onError: (err) => console.error("❌ Памылка аўтарызацыі:", err),
  });

  console.log("✅ Userbot аўтарызаваны!");

  // 2. Heartbeat (трымае злучэнне жывым кожныя 10 хвілін)
  setInterval(
    async () => {
      try {
        await client.getMe();
        console.log("🕒 Heartbeat: Злучэнне з Telegram актыўнае.");
      } catch (err) {
        console.error("⚠️ Heartbeat: Памылка злучэння...", err.message);
      }
    },
    10 * 60 * 1000,
  );

  // 3. Паказваем усе чаты (для атрымання ID), калі спіс пусты
  if (AGENCY_CHAT_IDS.length === 0) {
    console.log("📋 Вашы чаты (скапіруйце патрэбныя ID у AGENCY_CHAT_IDS):");
    const dialogs = await client.getDialogs({ limit: 100 });
    for (const dialog of dialogs) {
      console.log(`  ${dialog.id} — ${dialog.title || dialog.name}`);
    }
    console.log("\n");
  }

  // 4. Слухаем новыя паведамленні
  client.addEventHandler(async (event) => {
    try {
      const message = event.message;
      if (!message || !message.text) return;

      const chatId = message.chatId?.toString();

      // Атрымліваем назву чата для лепшай ідэнтыфікацыі агенцыі
      const chat = await message.getChat();
      const chatTitle = chat.title || "Unknown Chat";

      // Фільтруем толькі пазначаныя чаты (калі спіс не пусты)
      if (AGENCY_CHAT_IDS.length > 0 && !AGENCY_CHAT_IDS.includes(chatId)) {
        return;
      }

      const text = message.text;

      // Ігнаруем занадта кароткія паведамленні
      if (text.length < 15) return;

      console.log(
        `📨 [${chatTitle}] Новае паведамленне: ${text.substring(0, 50)}...`,
      );

      // Невялікая паўза, каб не спамаваць API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // АДПРАЎКА НА БЭКЕНД (на новы разумны эндпоінт)
      try {
        const res = await axios.post(`${BACKEND_URL}/api/inbox/push-userbot`, {
          rawText: text,
          senderInfo: chatTitle, // Перадаем назву чата для мапінгу агенцыі
        });

        if (res.data.status === "auto_processed") {
          console.log(`🚀 Вакансія створана аўтаматычна (ID: ${res.data.id})`);
        } else if (res.data.status === "saved_to_inbox") {
          console.log(`📥 Захавана ў Пясочніцу (Update/Info)`);
        } else {
          console.log(`ℹ️ Статус апрацоўкі: ${res.data.status}`);
        }
      } catch (err) {
        console.error("❌ Памылка адпраўкі на бэкенд:", err.message);
      }
    } catch (err) {
      console.error(
        "❌ Памылка апрацоўкі паведамлення юзерботам:",
        err.message,
      );
    }
  }, new NewMessage({}));

  console.log(
    `🎧 Userbot слухае ${AGENCY_CHAT_IDS.length > 0 ? AGENCY_CHAT_IDS.length + " чатаў" : "ўсе чаты"}...`,
  );

  // Трымаем працэс актыўным
  await new Promise(() => {});
}

module.exports = { startUserbot };
