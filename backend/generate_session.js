require("dotenv").config(); // Падключаем dotenv для чытання .env
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

// Цяпер бярэм значэнні з .env
const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

(async () => {
  if (!apiId || !apiHash) {
    console.error(
      "❌ Памылка: Правер, ці ёсць TELEGRAM_API_ID і TELEGRAM_API_HASH у тваім .env файле!",
    );
    process.exit(1);
  }

  console.log("🚀 Пачатак генерацыі сесіі...");
  const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () =>
      await input.text("📱 Увядзіце нумар тэлефона (+375...): "),
    password: async () =>
      await input.text("🔑 Увядзіце пароль (2FA), калі ёсць: "),
    phoneCode: async () => await input.text("📨 Увядзіце код з Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("\n✅ УСЁ ГАТОВА! Ваша STRING_SESSION (скапіруйце гэты радок):");
  console.log("--------------------------------------------------");
  console.log(client.session.save());
  console.log("--------------------------------------------------");
  process.exit(0);
})();
