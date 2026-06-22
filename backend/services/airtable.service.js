const axios = require("axios");
const AirtableSource = require("../models/AirtableSource");
const Vacancy = require("../models/Vacancy");
const aiService = require("./ai.service");
const { processVacancyMessage } = require("../routes/vacancies");

/**
 * Сэрвіс для сінхранізацыі з Airtable (Manpower, Progres, Job Impulse)
 */

async function syncAirtable() {
  const sources = await AirtableSource.find({ status: "active" });
  console.log(`\n💎 [Airtable] Пачатак сінхранізацыі для ${sources.length} крыніц...`);

  for (const source of sources) {
    try {
      await syncSingleSource(source);
    } catch (err) {
      console.error(`❌ [Airtable] Памылка крыніцы ${source.agencyName}:`, err.message);
    }
    // Паўза паміж базамі
    await new Promise(r => setTimeout(r, 3000));
  }
}

async function syncSingleSource(source) {
  console.log(`\n🚀 Сканаванне базы: ${source.boardName} (${source.agencyName})`);
  
  const url = `https://api.airtable.com/v0/${source.baseId}/${source.tableId}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
  });

  const records = response.data.records;
  console.log(`📦 Атрымана ${records.length} запісаў.`);

  let stats = { added: 0, updated: 0, closed: 0, ignored: 0 };
  const foundAirtableIds = new Set();

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const fields = record.fields;
    const airtableId = record.id;
    
    // ДЭБАГ: Паглядзім, якія палі ёсць у першых запісах, каб зразумець структуру
    if (i < 3) {
      console.log(`🔍 Дэбаг палёў запісу ${i+1}:`, JSON.stringify(fields).substring(0, 200) + "...");
    }

    let currentColumn = null;
    for (const key in fields) {
      const value = String(fields[key]).trim();
      // Шукаем супадзенне назвы калонкі (ігнаруючы прабелы па баках)
      if (source.includedColumns.some(col => col.trim() === value)) {
        currentColumn = value;
        break;
      }
    }

    if (!currentColumn) {
      stats.ignored++;
      continue;
    }

    foundAirtableIds.add(airtableId);

    let status = "active";
    if (source.agencyName === "MANPOWER" && currentColumn === "не активні тимчасово") {
      status = "closed";
    }

    if (source.agencyName === "JOB IMPULSE") {
      const isActual = fields["Актуальность"] === "ДА";
      if (!isActual) status = "closed";
    }

    const fullText = Object.entries(fields)
      .map(([key, val]) => `${key}: ${val}`)
      .join("\n");

    const existingVacancy = await Vacancy.findOne({ airtableId: airtableId });

    if (existingVacancy) {
      if (existingVacancy.status !== status || existingVacancy.originalText !== fullText) {
        existingVacancy.status = status;
        if (existingVacancy.originalText !== fullText && status === "active") {
          console.log(`🔄 Абнаўленне кантэнту для ${existingVacancy.vacancyCode}`);
          await processVacancyMessage(
            fullText, "Airtable", source.agencyName, fullText, false, "FULL_VACANCY",
            airtableId, currentColumn, existingVacancy._id, "airtable"
          );
          stats.updated++;
        } else {
          await existingVacancy.save();
          if (status === "closed") stats.closed++;
        }
      }
    } else if (status === "active") {
      console.log(`✨ Новая вакансія з Airtable: ${airtableId} (Калонка: ${currentColumn})`);
      await processVacancyMessage(
        fullText, "Airtable", source.agencyName, fullText, false, "FULL_VACANCY",
        airtableId, currentColumn, null, "airtable"
      );
      stats.added++;
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  const closeResult = await Vacancy.updateMany(
    {
      agencyName: source.agencyName,
      sourceType: "airtable",
      status: "active",
      airtableId: { $exists: true, $nin: Array.from(foundAirtableIds) }
    },
    { $set: { status: "closed" } }
  );
  stats.closed += closeResult.modifiedCount;

  console.log(`🏁 Вынік для ${source.agencyName}: +${stats.added} новых, 🔄 ${stats.updated} абноўлена, 🛑 ${stats.closed} закрыта, ⏭️ ${stats.ignored} прапушчана.`);
  
  source.lastProcessedAt = new Date();
  await source.save();
}

module.exports = { syncAirtable };