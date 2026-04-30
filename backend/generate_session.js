// backend/generate-session.js
// ============================================================
// ЗАПУСКАЦЬ ТОЛЬКІ ЛАКАЛЬНА АДЗІН РАЗ: node generate-session.js
// Пасля атрымання радка сесіі — скапіяваць у TELEGRAM_SESSION у .env
// ============================================================
require("dotenv").config();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

const API_ID = parseInt(process.env.TELEGRAM_API_ID);
const API_HASH = process.env.TELEGRAM_API_HASH;

if (!API_ID || !API_HASH) {
  console.error("❌ TELEGRAM_API_ID і TELEGRAM_API_HASH павінны быць у .env");
  process.exit(1);
}

(async () => {
  console.log("🔑 Генерацыя сесіі Telegram...");
  console.log("📌 Выкарыстоўваецца акаунт рэкрутэра (не бот-акаунт)\n");

  const client = new TelegramClient(new StringSession(""), API_ID, API_HASH, {
    connectionRetries: 3,
  });

  await client.start({
    phoneNumber: async () => await input.text("📱 Нумар тэлефона (+48...): "),
    password: async () => await input.text("🔑 Пароль 2FA (Enter калі няма): "),
    phoneCode: async () => await input.text("📨 Код з Telegram: "),
    onError: (err) => console.error("❌ Памылка:", err.message),
  });

  const sessionString = client.session.save();

  console.log("\n✅ Сесія паспяхова створана!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Дадайце гэты радок у .env як TELEGRAM_SESSION=");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(sessionString);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Паказваем спіс чатаў каб можна было скапіяваць ID у AGENCY_CHAT_IDS
  console.log(
    "📋 Вашы Telegram-чаты (скапіруйце патрэбныя ID у AGENCY_CHAT_IDS):",
  );
  console.log("Фармат у .env: AGENCY_CHAT_IDS=-1001234567890,-1009876543210\n");

  const dialogs = await client.getDialogs({ limit: 100 });
  for (const dialog of dialogs) {
    const type = dialog.isGroup
      ? "Група"
      : dialog.isChannel
        ? "Канал"
        : "Прыват";
    console.log(
      `  [${type}] ID: ${dialog.id} — ${dialog.title || dialog.name}`,
    );
  }

  await client.disconnect();
  process.exit(0);
})();
