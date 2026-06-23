const axios = require("axios");
const AirtableSource = require("../models/AirtableSource");
const Vacancy = require("../models/Vacancy");
const { processVacancyMessage } = require("../routes/vacancies");
const { analyzeAndCompareWithGemini } = require("./gemini.service"); // 👈 Дададзена для Stage 1
const airtableScraper = require("./airtableScraper.service");
const UnprocessedMessage = require("../models/UnprocessedMessage"); // 👈 Дадаць гэты радок

/**
 * Сінхранізацыя Airtable з выкарыстаннем поўнага AI-пайплайна
 */
async function syncAirtable() {
  const sources = await AirtableSource.find({ status: "active" });
  console.log(`\n💎 [Airtable] Пачатак сінхранізацыі для ${sources.length} агенцый...`);

  for (const source of sources) {
    try {
      await syncSingleSource(source);
    } catch (err) {
      console.error(`❌ [Airtable] Памылка ў ${source.agencyName}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}

async function syncSingleSource(source) {
  console.log(`\n🚀 Сканаванне: ${source.boardName} (${source.agencyName})`);
  
  let records = [];

  if (source.shareId) {
    // Метад для MANPOWER і JOB IMPULSE (без ключа)
    records = await airtableScraper.fetchSharedData(source.shareId);
  } else {
    // Метад для PROGRES (афіцыйны API)
    try {
      const url = `https://api.airtable.com/v0/${source.baseId}/${source.tableId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
      });
      records = response.data.records;
    } catch (apiErr) {
      console.error(`❌ [Airtable API] Памылка ${source.agencyName}:`, apiErr.message);
    }
  }

  if (!records || records.length === 0) {
    console.log(`⚠️ Запісаў не знойдзена для ${source.agencyName}.`);
    return;
  }
  console.log(`📦 Атрымана запісаў: ${records.length}`);

  const stats = { added: 0, updated: 0, closed: 0, ignored: 0 };
  const foundAirtableIds = new Set();

  for (const record of records) {
    const fields = record.fields;
    const airtableId = record.id;

    // 1. ВЫЗНАЧЭННЕ КАТЭГОРЫІ (КАНБАН-СЛУПКА)
   let currentColumn = null;
    for (const key in fields) {
      const val = fields[key];
      const stringVal = Array.isArray(val) ? String(val[0]) : String(val);
      const cleanVal = stringVal.trim().toLowerCase(); // 👈 прыводзім да ніжняга рэгістра

      // Параўноўваем абедзве часткі ў ніжнім рэгістры
      const found = source.includedColumns.find(col => col.trim().toLowerCase() === cleanVal);
      if (found) {
        currentColumn = found; // захоўваем арыгінальную назву з налад
        break;
      }
    }

    if (!currentColumn) continue;
    foundAirtableIds.add(airtableId);

    // 2. ВЫЗНАЧЭННЕ СТАТУСУ (БІЗНЕС-ЛОГІКА)
    let status = "active";
    if (source.agencyName === "MANPOWER" && currentColumn === "не активні тимчасово") {
      status = "closed";
    }
    if (source.agencyName === "JOB IMPULSE") {
      // Шукаем любое поле, якое змяшчае слова "Актуальность"
      const actKey = Object.keys(fields).find(k => k.includes("Актуальность"));
      const actVal = actKey ? fields[actKey] : null;
      const isActual = Array.isArray(actVal) ? actVal[0] === "ДА" : actVal === "ДА";
      if (!isActual) status = "closed";
    }

    // 3. ЗБОР СЫРЫХ ДАДЗЕНЫХ ДЛЯ AI (Stage 1)
    // Проста робім дамп усіх палёў, Gemini сам разбярэцца
    const rawAirtableDump = Object.entries(fields)
      .filter(([key, val]) => typeof val !== 'object' || Array.isArray(val))
      .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
      .join("\n");

    // 📏 ФІЛЬТР ДАЎЖЫНІ (Крок 2.1)
    if (rawAirtableDump.length < 200) {
      console.log(`⏭️ Пропуск ${airtableId}: занадта кароткі запіс (${rawAirtableDump.length} сімв.)`);
      stats.ignored++;
      continue;
    }

    if (rawAirtableDump.length >= 200 && rawAirtableDump.length < 400) {
      console.log(`📥 Кароткі запіс (${rawAirtableDump.length} сімв.) -> Inbox`);
      await new UnprocessedMessage({
        sender: source.agencyName,
        agencyName: source.agencyName,
        text: `[Airtable: ${currentColumn}]\n${rawAirtableDump}`,
        source: "airtable",
        category: "update",
        processed: false,
        aiAnalyzed: true
      }).save();
      stats.ignored++;
      continue;
    }

    // 4. ПРАВЕРКА НА ЗМЕНЫ
    const existingVacancy = await Vacancy.findOne({ airtableId: airtableId });
    if (existingVacancy && existingVacancy.originalText === rawAirtableDump && existingVacancy.status !== "pending_ai") {
      stats.ignored++;
      continue;
    }

    // 5. ЗАПУСК AI-ПАЙПЛАЙНА
    console.log(`🧠 AI Stage 1 для Airtable ID: ${airtableId}...`);
    const analysis = await analyzeAndCompareWithGemini(
      `[SOURCE: AIRTABLE | AGENCY: ${source.agencyName}]\n${rawAirtableDump}`
    );

    if (!analysis || !analysis.translatedFragments) {
      console.error(`🛑 AI FATAL ERROR для ${airtableId}. Спыняем сінхранізацыю.`);
      return "STOP"; 
    }

    // 6. ЗАХАВАННЕ ПРАЗ ПАРСЕР
    for (let i = 0; i < analysis.translatedFragments.length; i++) {
      const fragment = analysis.translatedFragments[i];
      const fragmentHash = analysis.translatedFragments.length > 1 ? `${airtableId}_${i}` : airtableId;

      const result = await processVacancyMessage(
        fragment,
        "Airtable",
        source.agencyName,
        rawAirtableDump,
        false,
        analysis.category,
        fragmentHash,
        currentColumn,
        existingVacancy ? existingVacancy._id : null,
        "airtable"
      );

      if (result && result.error) {
        if (result.error.includes("AI_COOLDOWN") || result.error.includes("ALL_AI_MODELS_FAILED")) {
          console.error("🛑 Спыняем Airtable: AI недаступны.");
          return "STOP"; 
        }
      } else if (result) {
        if (existingVacancy) stats.updated++; else stats.added++;
      }
    }

    // Паўза для стабільнасці AI
    await new Promise(r => setTimeout(r, 6000)); // 👈 6 секунд
  }

  // 7. АЎТА-ЗАКРЫЦЦЁ
  const closeResult = await Vacancy.updateMany(
    {
      agencyName: source.agencyName,
      sourceType: "airtable",
      status: "active",
      airtableId: { $exists: true, $nin: Array.from(foundAirtableIds) }
    },
    { $set: { status: "closed" } }
  );
  stats.closed = closeResult.modifiedCount;

  console.log(`🏁 ${source.agencyName} завершана: +${stats.added} новых, 🔄 ${stats.updated} абноўлена, 🛑 ${stats.closed} закрыта.`);
  
  source.lastProcessedAt = new Date();
  await source.save();
}

module.exports = { syncAirtable };