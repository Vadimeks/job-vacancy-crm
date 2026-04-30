// backend/userbot.js
// ============================================================
// Запускаецца на Render як асобны сэрвіс.
// Патрабуе зменных асяроддзя:
//   TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSION (з generate-session.js)
//   BACKEND_URL (https://job-vacancy-crm-backend.onrender.com)
//   AGENCY_CHAT_IDS (праз коску: -1001234,-1005678) — неабавязкова,
//     калі пуста — слухае ўсе чаты (фільтрацыя адбудзецца на бэкендзе)
// ============================================================
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

// Спіс ID чатаў для прэдфільтрацыі (неабавязкова).
// Калі пуста — усе паведамленні ідуць на бэкенд, там ужо ёсць вайтліст.
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
  console.log(`📡 Бэкенд: ${BACKEND_URL}`);
  console.log(
    `🎯 Чаты: ${AGENCY_CHAT_IDS.length > 0 ? AGENCY_CHAT_IDS.join(", ") : "усе (фільтрацыя на бэкендзе)"}`,
  );

  const client = new TelegramClient(session, API_ID, API_HASH, {
    connectionRetries: 10,
    retryDelay: 3000,
    autoReconnect: true,
  });

  // Запуск без інтэрактыўнага ўводу — сесія ўжо ёсць
  await client.connect();

  const me = await client.getMe();
  console.log(`✅ Userbot аўтарызаваны як: @${me.username || me.firstName}`);

  // Heartbeat кожныя 5 хвілін — трымае злучэнне жывым на Render
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

  // Слухаем новыя паведамленні
  client.addEventHandler(async (event) => {
    try {
      const message = event.message;

      // Ігнаруем паведамленні без тэксту (фота, стыкеры і г.д.)
      if (!message?.text) return;

      const text = message.text.trim();
      if (text.length < 15) return;

      // Атрымліваем назву чата
      const chat = await message.getChat();
      const chatTitle = chat?.title || chat?.firstName || "Unknown";
      const chatId = message.chatId?.toString();

      // Прэдфільтрацыя па ID (калі AGENCY_CHAT_IDS зададзены)
      if (AGENCY_CHAT_IDS.length > 0 && !AGENCY_CHAT_IDS.includes(chatId)) {
        return;
      }

      console.log(
        `📨 [${chatTitle}] ${text.length} сімв.: "${text.substring(0, 60).replace(/\n/g, " ")}..."`,
      );

      // Невялікая паўза каб не спамаваць бэкенд пры хуткім патоку
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Адпраўка на бэкенд — той жа /push эндпоінт, які выкарыстоўвае MacroDroid
      const res = await axios.post(
        `${BACKEND_URL}/api/inbox/push`,
        {
          text: text,
          sender: chatTitle, // getWhitelistedAgency() апрацуе назву чата
          source: "telegram_userbot",
        },
        { timeout: 10000 },
      );

      console.log(`  └─ Бэкенд: ${res.data.status}`);
    } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
        console.error(`❌ Бэкенд недаступны: ${err.message}`);
      } else {
        console.error(`❌ Памылка апрацоўкі: ${err.message}`);
      }
    }
  }, new NewMessage({}));

  console.log("🎧 Userbot слухае паведамленні...");

  // Трымаем працэс актыўным
  await new Promise(() => {});
}

startUserbot().catch((err) => {
  console.error("❌ Крытычная памылка userbot:", err);
  process.exit(1);
});
