const axios = require("axios");
const AirtableSource = require("../models/AirtableSource");
const Vacancy = require("../models/Vacancy");
const { processVacancyMessage } = require("../routes/vacancies");
const { analyzeAndCompareWithGemini } = require("./gemini.service"); // 👈 Дададзена для Stage 1

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
  
  const url = `https://api.airtable.com/v0/${source.baseId}/${source.tableId}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
  });

  const records = response.data.records;
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

    if (rawAirtableDump.length < 50) continue;

    // 4. ПРАВЕРКА НА ЗМЕНЫ (Каб не мучыць AI дарма)
    const existingVacancy = await Vacancy.findOne({ airtableId: airtableId });
    
    // Калі тэкст і статус не змяніліся — ігнаруем
    if (existingVacancy && existingVacancy.originalText === rawAirtableDump && existingVacancy.status === status) {
      stats.ignored++;
      continue;
    }

    // 5. ЗАПУСК AI-ПАЙПЛАЙНА (Stage 1: Класіфікацыя і Пераклад)
    console.log(`🧠 AI Stage 1 для Airtable ID: ${airtableId}...`);
    const analysis = await analyzeAndCompareWithGemini(
      `[SOURCE: AIRTABLE | AGENCY: ${source.agencyName}]\n${rawAirtableDump}`
    );

    if (!analysis || !analysis.translatedFragments) {
      console.warn(`⚠️ AI не змог апрацаваць запіс ${airtableId}`);
      continue;
    }

    // 6. ЗАХАВАННЕ ПРАЗ ПАРСЕР (Stage 2)
    for (let fIdx = 0; fIdx < analysis.translatedFragments.length; fIdx++) {
      const fragment = analysis.translatedFragments[fIdx];
      const fragmentHash = analysis.translatedFragments.length > 1 ? `${airtableId}_${fIdx}` : airtableId;
      

      const result = await processVacancyMessage(
        fragment,
        "Airtable",
        source.agencyName,
        rawAirtableDump,
        false,
        analysis.category,
        fragmentHash, // 👈 выкарыстоўваем унікальны хэш фрагмента
        currentColumn,
        existingVacancy ? existingVacancy._id : null,
        "airtable"
      );

      if (result && !result.error) {
        if (existingVacancy) stats.updated++; else stats.added++;
      }
    }

    // Паўза для стабільнасці AI
    await new Promise(r => setTimeout(r, 2000));
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