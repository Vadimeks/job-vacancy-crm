// backend/userbot.js
require("dotenv").config();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const axios = require("axios");

const API_ID = parseInt(process.env.TELEGRAM_API_ID);
const API_HASH = process.env.TELEGRAM_API_HASH;
const SESSION_STRING = process.env.TELEGRAM_SESSION || "";
const BACKEND_URL =
  process.env.BACKEND_URL || "https://job-vacancy-crm-backend.onrender.com";

const AGENCY_CHAT_IDS = process.env.AGENCY_CHAT_IDS
  ? process.env.AGENCY_CHAT_IDS.split(",").map((id) => id.trim())
  : [];

if (!SESSION_STRING) {
  console.error(
    "❌ TELEGRAM_SESSION не задана. Запусціце generate-session.js лакальна.",
  );
  process.exit(1);
}

const session = new StringSession(SESSION_STRING);

async function startUserbot() {
  console.log("🤖 Запуск Telegram userbot...");

  const client = new TelegramClient(session, API_ID, API_HASH, {
    connectionRetries: 10,
    retryDelay: 3000,
    autoReconnect: true,
  });

  await client.connect();
  const me = await client.getMe();
  console.log(`✅ Userbot аўтарызаваны як: @${me.username || me.firstName}`);

  // --- 🆕 БЛОК ID DISCOVERY (ДАДАДЗЕНА) ---
  try {
    console.log("--------------------------------------------------");
    console.log("🔍 СПІС УСІХ ЧАТАЎ (Скапіруй ID для вайтліста):");
    const dialogs = await client.getDialogs({});
    for (const dialog of dialogs) {
      console.log(
        `ID: ${dialog.id.toString()} | Назва: ${dialog.title || "Прыватны чат"}`,
      );
    }
    console.log("--------------------------------------------------");
  } catch (err) {
    console.error("⚠️ Не ўдалося атрымаць спіс дыялогаў:", err.message);
  }

  // Heartbeat (захавана)
  setInterval(
    async () => {
      try {
        await client.getMe();
        console.log(`🕒 Heartbeat OK`);
      } catch (err) {
        console.error("⚠️ Heartbeat памылка:", err.message);
      }
    },
    5 * 60 * 1000,
  );

  // Слухаем новыя паведамленні (захавана)
  client.addEventHandler(async (event) => {
    try {
      const message = event.message;
      if (!message?.text) return;

      const text = message.text.trim();
      if (text.length < 15) return;

      const chat = await message.getChat();
      const chatTitle = chat?.title || chat?.firstName || "Unknown";
      const chatId = message.chatId?.toString();

      if (AGENCY_CHAT_IDS.length > 0 && !AGENCY_CHAT_IDS.includes(chatId)) {
        return;
      }

      console.log(
        `📨 [${chatTitle}] (ID: ${chatId}) ${text.length} сімв.: "${text.substring(0, 60).replace(/\n/g, " ")}..."`,
      );

      // Затрымка (захавана)
      await new Promise((resolve) => setTimeout(resolve, 500));

      await axios.post(
        `${BACKEND_URL}/api/inbox/push`,
        {
          text: text,
          sender: chatTitle,
          chatId: chatId, // 🆕 Дададзена перадача ID
          source: "telegram_userbot",
        },
        { timeout: 10000 },
      );
    } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
        console.error(`❌ Бэкенд недаступны: ${err.message}`);
      } else {
        console.error(`❌ Памылка апрацоўкі: ${err.message}`);
      }
    }
  }, new NewMessage({}));

  console.log("🎧 Userbot слухае паведамленні...");
  await new Promise(() => {});
}

startUserbot().catch((err) => {
  console.error("❌ Крытычная памылка userbot:", err);
  process.exit(1);
});
