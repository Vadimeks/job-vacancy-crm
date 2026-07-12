// backend/scripts/dbAudit.js
// 🔍 Абноўлены скрыпт аўдыту (v2.0): чыстая дыягностыка без шуму.
// Запуск: node scripts/dbAudit.js

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Vacancy = require("../models/Vacancy");

const CYRILLIC_REGEX = /[А-ЯЁІЎа-яёіў]/;
const SHORT_TEXT_LIMIT = 400;
const SIMILARITY_THRESHOLD = 0.75; // Павялічылі да 75% для дакладнасці

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
  
  // 👈 ФІКС: Толькі тэкставыя крыніцы (Docs, Drive, файлы)
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

    const vacancies = await Vacancy.find({}).lean();
    console.log(`📦 Усяго вакансій у базе: ${vacancies.length}`);

    const report = {
      generatedAt: new Date().toISOString(),
      totalVacancies: vacancies.length,
      toDelete_ShortVacancies: [], // Усе кароткія на выдаленне
      toFix_LocationIssues: [],    // Кірыліца ў лакацыях
      duplicates_HighConfidence: [], // Супадзенне па ID або Docs
      duplicates_Potential: [],      // Супадзенне па тэксце
    };

    // 1. Збор кароткіх вакансій (rawText < 400)
    report.toDelete_ShortVacancies = vacancies
      .filter(v => v.parsingResultType === "FULL_VACANCY" && (v.rawText || "").length < SHORT_TEXT_LIMIT)
      .map(v => ({
        vacancyCode: v.vacancyCode,
        _id: v._id,
        len: (v.rawText || "").length,
        status: v.status,
        agency: v.agencyName
      }));

    // 2. Збор праблем з лакацыямі (без voivodeship)
    for (const v of vacancies) {
      const issues = [];
      if (CYRILLIC_REGEX.test(v.location || "")) issues.push("location_field_cyrillic");
      
      const tail = extractDescriptionTail(v.vacancydescription);
      if (tail && CYRILLIC_REGEX.test(tail)) issues.push("title_tail_cyrillic");
      
      if (issues.length > 0) {
        report.toFix_LocationIssues.push({
          vacancyCode: v.vacancyCode,
          _id: v._id,
          location: v.location,
          title: v.vacancydescription,
          issues
        });
      }
    }

    // 3. Дублікаты
    const groups = new Map();
    for (const v of vacancies) {
      if (v.status === "archived") continue;
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
            a: { code: a.vacancyCode, id: a._id, source: a.sourceType },
            b: { code: b.vacancyCode, id: b._id, source: b.sourceType }
          };

          // Высокая ўпэўненасць (ID або адзін і той жа Google Doc)
          if (sharedDocs.length > 0 || sharedIds.length > 0) {
            report.duplicates_HighConfidence.push({
              ...pair,
              reason: sharedIds.length > 0 ? "shared_technical_id" : "shared_google_doc",
              evidence: sharedIds.length > 0 ? sharedIds : sharedDocs
            });
          } else {
            // Патэнцыйныя (па тэксце)
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

    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const filepath = path.join(outputDir, `audit-clean-${Date.now()}.json`);
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));

    console.log("\n========== ВЫНІКІ АЎДЫТУ (ЧЫСТЫЯ) ==========");
    console.log(`🗑️ На выдаленне (кароткія): ${report.toDelete_ShortVacancies.length}`);
    console.log(`📍 Праблемы лакацый (кірыліца): ${report.toFix_LocationIssues.length}`);
    console.log(`👯 Дублікаты (High Confidence): ${report.duplicates_HighConfidence.length}`);
    console.log(`🤔 Дублікаты (Potential): ${report.duplicates_Potential.length}`);
    console.log(`\n💾 Справаздача: ${filepath}`);
    console.log("============================================\n");

  } catch (err) {
    console.error("❌ Памылка:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

runAudit();