// scripts/full_audit.js
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const Vacancy = require('../models/Vacancy');

async function runFullAudit() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Падключана да БД для поўнага аўдыту...");

    const vacancies = await Vacancy.find({ 
      status: { $in: ["active", "closed", "pending_ai", "archived"] } 
    }).sort({ agencyName: 1, createdAt: -1 });

    const report = {
      summary: {
        total: vacancies.length,
        active: vacancies.filter(v => v.status === 'active').length,
        closed: vacancies.filter(v => v.status === 'closed').length,
        archived: vacancies.filter(v => v.status === 'archived').length,
        pending: vacancies.filter(v => v.status === 'pending_ai').length,
        splitParents: vacancies.filter(v => v.isSplitParent).length,
        shortDescriptions: vacancies.filter(v => v.status === 'active' && (v.originalText?.length || 0) < 350).length
      },
      // Спіс усіх актыўных кароткіх вакансій (патэнцыйнае смецце)
      potentialTrash: vacancies
        .filter(v => v.status === 'active' && (v.originalText?.length || 0) < 350)
        .map(v => ({
          ID: v.vacancyCode,
          Agency: v.agencyName,
          Length: v.originalText?.length || 0,
          Title: v.vacancydescription,
          Source: v.sourceType,
          Text: v.originalText?.substring(0, 100) + "..."
        })),
      // Спіс сямействаў (спліцінг)
      splitFamilies: vacancies
        .filter(v => v.isSplitParent)
        .map(parent => {
          const children = vacancies.filter(child => 
            child.airtableId === parent.airtableId && !child.isSplitParent
          );
          return {
            ParentID: parent.airtableId,
            Agency: parent.agencyName,
            Title: parent.vacancydescription,
            ChildrenCount: children.length,
            ChildrenIDs: children.map(c => c.vacancyCode)
          };
        }),
      // Поўны спіс для ручнога прагляду
      allVacancies: vacancies.map(v => ({
        ID: v.vacancyCode,
        Agency: v.agencyName,
        Source: `${v.sourceType}${v.sheetName ? ' (' + v.sheetName + ')' : ''}`,
        Title: v.vacancydescription,
        Status: v.status,
        IsParent: v.isSplitParent,
        AirtableID: v.airtableId,
        Hash: v.sourceHash,
        TextLen: v.originalText?.length || 0,
        Preview: v.originalText?.substring(0, 150).replace(/\n/g, " ") + "..."
      }))
    };

    fs.writeFileSync('audit_results.json', JSON.stringify(report, null, 2));
    console.log(`\n📊 АЎДЫТ ЗАВЕРШАНЫ`);
    console.log(`---------------------------`);
    console.log(`Усяго запісаў: ${report.summary.total}`);
    console.log(`Бацькоўскіх (спліцінг): ${report.summary.splitParents}`);
    console.log(`Кароткіх (актыўных): ${report.summary.shortDescriptions}`);
    console.log(`---------------------------`);
    console.log(`✅ Вынік запісаны ў: audit_results.json`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Памылка аўдыту:", err.message);
    process.exit(1);
  }
}
runFullAudit();