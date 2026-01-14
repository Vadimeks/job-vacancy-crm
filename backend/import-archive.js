// backend/import-archive.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const fs = require("fs");
const mongoose = require("mongoose");

const Vacancy = require("./models/Vacancy");
const { parseVacancyWithAI } = require("./services/ai.service");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Падключана да MongoDB"))
  .catch((err) => {
    console.error("❌ Памылка падключэння:", err);
    process.exit(1);
  });

async function importFromJSON() {
  try {
    const data = JSON.parse(fs.readFileSync("result.json", "utf8"));

    const messages = data.messages.filter(
      (m) =>
        m.type === "message" &&
        m.text !== "" &&
        (Array.isArray(m.text)
          ? m.text.join("").length > 10
          : m.text.length > 10)
    );

    console.log(`Знойдзена ${messages.length} паведамленняў для апрацоўкі.`);

    // ТЭСТ: вазьмі 5 штук. Калі апрацуюцца добра — замяні на batch = messages
    const batch = messages.slice(0, 5);

    for (const msg of batch) {
      let success = false;
      let retries = 0;

      while (!success && retries < 3) {
        try {
          const fullText = Array.isArray(msg.text)
            ? msg.text.join("")
            : msg.text;
          console.log(`--- Апрацоўка ID: ${msg.id} ---`);

          const parsedData = await parseVacancyWithAI(fullText);

          if (parsedData) {
            const newVacancy = new Vacancy({
              title: parsedData.title || "Новая вакансія",
              location: parsedData.location || "Не вызначана",
              salary: parsedData.salary || "",
              description: Array.isArray(parsedData.description)
                ? parsedData.description.join("\n")
                : parsedData.description || "",
              agencyName: parsedData.agencyName || "Archive",
              rawText: fullText,
              createdAt: new Date(msg.date),
              status: "active",
            });

            await newVacancy.save();
            console.log(`✅ Імпартавана: ${newVacancy.title}`);
          }

          success = true;
          await sleep(10000); // Паўза 5 сек паміж вакансіямі
        } catch (err) {
          if (err.message === "RATE_LIMIT") {
            console.log("⏳ Ліміт Google вычарпаны. Чакаем 65 секунд...");
            await sleep(65000);
            retries++;
          } else {
            console.error(
              "❌ Памылка пры апрацоўцы паведамлення:",
              err.message
            );
            success = true; // Пропуск паведамлення пры іншай памылцы
          }
        }
      }
    }

    console.log("\n🚀 Працэс завершаны!");
  } catch (error) {
    console.error("❌ Крытычная памылка:", error);
  } finally {
    mongoose.connection.close();
  }
}

importFromJSON();
