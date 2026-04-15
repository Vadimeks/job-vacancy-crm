const fs = require("fs");
const path = require("path");

// __dirname — гэта папка, дзе ляжыць сам файл patchTemplates.js
// Калі файл ляжыць у корані праекта (vacancy-app), то шляхі будуць такімі:

const PATCH_FILE = path.join(
  __dirname,

  "data",
  "patch",
  "templates.json",
);
const TEMPLATES_DIR = path.join(__dirname, "data", "templates");

// Калі ж сам patchTemplates.js ЛЯЖЫЦЬ УНУТРЫ папкі backend, то выкарыстоўвай вось гэтыя:
// const PATCH_FILE = path.join(__dirname, 'data', 'patch', 'templates.json');
// const TEMPLATES_DIR = path.join(__dirname, 'data', 'templates');

console.log("🔍 Шукаю патч тут:", PATCH_FILE);
console.log("🔍 Шукаю шаблоны тут:", TEMPLATES_DIR);

function runPatch() {
  if (!fs.existsSync(PATCH_FILE)) {
    console.error("❌ Файл з патчамі не знойдзены па адрасе:", PATCH_FILE);
    return;
  }

  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(PATCH_FILE, "utf8"));
  } catch (e) {
    console.error(
      "❌ Памылка чытання JSON. Правер коскі ў templates.json:",
      e.message,
    );
    return;
  }

  // Разгладжваем масіў масіваў
  const updatesToApply = rawData.flat();

  updatesToApply.forEach((patch) => {
    const filePath = path.join(TEMPLATES_DIR, patch.originalFile);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Файл не знойдзены: ${patch.originalFile}. Скіпаем...`);
      return;
    }

    let content = fs.readFileSync(filePath, "utf8");

    // Рэгулярка шукае блок, які пачынаецца з "// Вакансія №X"
    // і захоплівае аб'ект да наступнай вакансіі або канца масіва
    const vacancyRegex = new RegExp(
      `(// Вакансія №${patch.originalIndex}[\\s\\S]*?{)([\\s\\S]*?)(},?\\s*(?:// Вакансія №|\\s*\\]))`,
      "g",
    );

    let found = false;
    const updatedContent = content.replace(
      vacancyRegex,
      (match, header, body, footer) => {
        found = true;
        let updatedBody = body;

        Object.entries(patch.updates).forEach(([key, value]) => {
          // Шукаем поле ўнутры аб'екта (падтрымліваем любыя двукоссі і адсутнасць двукоссяў у ключах)
          const fieldRegex = new RegExp(
            `(${key}:\\s*["'\`])[^"'\`]*?(["'\`],?)`,
            "g",
          );

          if (fieldRegex.test(updatedBody)) {
            updatedBody = updatedBody.replace(fieldRegex, `$1${value}$2`);
          } else {
            // Калі поля няма, дадаем яго ў пачатак (акуратна пасля дужкі)
            updatedBody = `\n    ${key}: "${value}",` + updatedBody;
          }
        });

        return `${header}${updatedBody}${footer}`;
      },
    );

    if (found) {
      fs.writeFileSync(filePath, updatedContent, "utf8");
      console.log(
        `✅ [${patch.originalFile}] Вакансія №${patch.originalIndex} абноўлена.`,
      );
    } else {
      console.warn(
        `❓ [${patch.originalFile}] Вакансія №${patch.originalIndex} не знойдзена ў файле. Правер нумарацыю.`,
      );
    }
  });

  console.log("🚀 Усе праўкі паспяхова ўнесены!");
}

runPatch();
