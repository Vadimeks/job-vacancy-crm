// backend/scripts/dbAudit.js
// 🔍 Поўны аўдыт базы (v2.5): Пераклад, Лакацыі, Спліцінг і Дублікаты.
// Запуск: node scripts/dbAudit.js

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Vacancy = require("../models/Vacancy");

// Канстанты для аналізу
const CYRILLIC_REGEX = /[А-ЯЁІЎа-яёіў]/;
const RUSSIAN_ONLY_CHARS = /[ыэёъЫЭЁЪ]/; // Спецыфічныя рускія літары
const SHORT_TEXT_LIMIT = 400;
const SIMILARITY_THRESHOLD = 0.75;

// ===== ДАПАМОЖНЫЯ ФУНКЦЫІ =====

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/\s*\([^)]+\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDescriptionTail(vacancydescription) {
  if (!vacancydescription) return "";
  const idx = vacancydescription.lastIndexOf(" — ");
  if (idx === -1) return "";
  return vacancydescription.substring(idx + 3).trim();
}

function extractLinksAndIds(vacancy) {
  const text = `${vacancy.rawText || ""} ${vacancy.originalText || ""}`;
  const allUrls = [...text.matchAll(/https?:\/\/[^\s\]\)]+/g)].map((m) => m[0]);
  
  const docUrls = allUrls.filter(url => 
    url.includes("docs.google.com") || 
    url.includes("drive.google.com") || 
    /\.(docx?|txt)$/i.test(url)
  );

  const ids = [];
  if (vacancy.sourceHash) ids.push(vacancy.sourceHash);
  if (vacancy.airtableId) ids.push(vacancy.airtableId);
  
  return { docUrls, ids };
}

function tokenize(text) {
  return new Set(
    (text || "")
      .toLowerCase()
      .replace(/[^a-zа-яёіў0-9\s]/gi, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// ===== ГАЛОЎНАЯ ФУНКЦЫЯ АЎДЫТУ =====

async function runAudit() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Падключана да MongoDB");

    const vacancies = await Vacancy.find({ status: { $ne: "archived" } }).lean();
    console.log(`📦 Усяго вакансій для аналізу: ${vacancies.length}`);

    const report = {
      generatedAt: new Date().toISOString(),
      totalVacancies: vacancies.length,
      toFix_Untranslated: [],      // Рускі тэкст (твой галоўны нюанс)
      toFix_LocationIssues: [],    // Кірыліца ў лакацыях або расхаджэнні
      toFix_SharedRawText: [],     // Спліт-баг (розныя вакансіі з аднолькавым rawText)
      toDelete_ShortVacancies: [], // Тэкст < 400
      duplicates_HighConfidence: [], // Супадзенне па ID або Docs
      duplicates_Potential: [],      // Супадзенне па тэксце
    };

    const textGroups = new Map(); // Для пошуку спліт-бага

    for (const v of vacancies) {
      // 1. Праверка на неперакладзены тэкст (v2.6)
      const UKRAINIAN_CHARS = /[ііїєґІЇЄҐ]/;
      const hasRussianSpecific = /[ыэёъЫЭЁЪ]/.test(v.rawText || "");
      const isCyrillic = CYRILLIC_REGEX.test(v.rawText || "");
      
      // Калі ёсць рускія літары АБО ёсць кірыліца, але няма ніводнай украінскай літары
      const isUntranslated = hasRussianSpecific || (isCyrillic && !UKRAINIAN_CHARS.test(v.rawText || ""));

      if (isUntranslated) {
        report.toFix_Untranslated.push({
          vacancyCode: v.vacancyCode,
          _id: v._id.toString(),
          agency: v.agencyName,
          preview: (v.rawText || "").substring(0, 80) + "..."
        });
      }

      // 3. Праблемы лакацый (Кірыліца ў полі location)
      const issues = [];
      if (CYRILLIC_REGEX.test(v.location || "")) issues.push("location_field_cyrillic");
      
      const tail = extractDescriptionTail(v.vacancydescription);
      if (tail) {
        if (CYRILLIC_REGEX.test(tail)) issues.push("title_tail_cyrillic");
        else if (normalize(tail) !== normalize(v.location)) issues.push("location_title_mismatch");
      }
      
      if (issues.length > 0) {
        report.toFix_LocationIssues.push({
          vacancyCode: v.vacancyCode,
          _id: v._id.toString(),
          location: v.location,
          title: v.vacancydescription,
          issues
        });
      }

      // 4. Збор для пошуку спліт-бага (агульны rawText)
      if (v.rawText && v.rawText.length > 500) {
        if (!textGroups.has(v.rawText)) textGroups.set(v.rawText, []);
        textGroups.get(v.rawText).push({
          code: v.vacancyCode,
          id: v._id.toString()
        });
      }
    }

    // Вылучаем групы з агульным тэкстам (Split Bug)
    for (const [text, items] of textGroups.entries()) {
      if (items.length > 1) {
        report.toFix_SharedRawText.push({
          count: items.length,
          codes: items.map(i => i.code),
          ids: items.map(i => i.id),
          preview: text.substring(0, 100) + "..."
        });
      }
    }

    // 5. Дублікаты (High Confidence & Potential)
    const groups = new Map();
    for (const v of vacancies) {
      const key = `${normalize(v.agencyName)}::${normalize(v.brand)}::${normalize(v.location)}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(v);
    }

    for (const [key, group] of groups.entries()) {
      if (group.length < 2) continue;

      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const a = group[i];
          const b = group[j];
          
          const linksA = extractLinksAndIds(a);
          const linksB = extractLinksAndIds(b);
          
          const sharedDocs = linksA.docUrls.filter(u => linksB.docUrls.includes(u));
          const sharedIds = linksA.ids.filter(id => id && linksB.ids.includes(id));

          const pair = {
            groupKey: key,
            a: { code: a.vacancyCode, id: a._id.toString(), source: a.sourceType },
            b: { code: b.vacancyCode, id: b._id.toString(), source: b.sourceType }
          };

          if (sharedDocs.length > 0 || sharedIds.length > 0) {
            report.duplicates_HighConfidence.push({
              ...pair,
              reason: sharedIds.length > 0 ? "shared_technical_id" : "shared_google_doc"
            });
          } else {
            const sim = jaccardSimilarity(tokenize(a.rawText), tokenize(b.rawText));
            if (sim >= SIMILARITY_THRESHOLD) {
              report.duplicates_Potential.push({
                ...pair,
                similarity: Math.round(sim * 100) + "%"
              });
            }
          }
        }
      }
    }

    // Захаванне справаздачы
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const filepath = path.join(outputDir, `audit-clean-${Date.now()}.json`);
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));

    console.log("\n========== ВЫНІКІ АЎДЫТУ (v2.5) ==========");
    console.log(`🇷🇺 Неперакладзены тэкст: ${report.toFix_Untranslated.length}`);
    console.log(`📍 Праблемы лакацый: ${report.toFix_LocationIssues.length}`);
    console.log(`👯 Спліт-баг (агульны тэкст): ${report.toFix_SharedRawText.length} груп`);
    console.log(`🗑️ Кароткія вакансіі: ${report.toDelete_ShortVacancies.length}`);
    console.log(`👯 Дублікаты (High Confidence): ${report.duplicates_HighConfidence.length}`);
    console.log(`🤔 Дублікаты (Potential): ${report.duplicates_Potential.length}`);
    console.log(`\n💾 Справаздача: ${filepath}`);
    console.log("==========================================\n");

  } catch (err) {
    console.error("❌ Памылка:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

runAudit();