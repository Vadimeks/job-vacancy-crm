// backend/routes/sync.js
const express = require("express");
const router = express.Router();
const SheetSource = require("../models/SheetSource");
const TrelloSource = require("../models/TrelloSource");
const AirtableSource = require("../models/AirtableSource");
const { syncSheetVacancies } = require("../services/sheets.service");
const { syncTrelloBoard } = require("../services/trello.service");
const { syncSingleSource } = require("../services/airtable.service");

// POST /api/sync/agency
router.post("/agency", async (req, res) => {
 const { agencyName } = req.body;
  // 👈 Ператвараем у масіў, нават калі прыйшоў адзін радок
  const agencies = Array.isArray(agencyName) ? agencyName : [agencyName];
  
  if (!agencies.length) return res.status(400).json({ message: "Спіс агенцый пусты" });
  if (global.isSyncRunning) return res.status(409).json({ message: "Сканаванне ўжо ідзе. Паспрабуйце пазней." });

  console.log(`🚀 [Manual Sync] Запуск для агенцый: ${agencies.join(", ")}`);
  res.json({ message: `Сканаванне для ${agencies.length} агенцый запушчана` });

  setImmediate(async () => {
    global.isSyncRunning = true;
    try {
      // 👈 Цыкл па ўсіх выбраных агенцыях
      for (const agency of agencies) {
        console.log(`\n--- 🔄 Сінхранізацыя агенцыі: ${agency} ---`);
        
        const sheets = await SheetSource.find({ agencyName: agency, status: "active" });
        console.log(`📊 [Manual Sync] Табліц для ${agency}: ${sheets.length}`);
        for (const s of sheets) await syncSheetVacancies(s._id);

        const trelloBoards = await TrelloSource.find({ agencyName: agency, status: "active" });
        console.log(`🗂️ [Manual Sync] Trello-дошак для ${agency}: ${trelloBoards.length}`);
        for (const t of trelloBoards) await syncTrelloBoard(t._id);

        const airtableSources = await AirtableSource.find({ agencyName: agency, status: "active" });
        console.log(`💎 [Manual Sync] Airtable-крыніц для ${agency}: ${airtableSources.length}`);
        for (const a of airtableSources) await syncSingleSource(a);
      }
      console.log(`✅ [Manual Sync] Усе выбраныя агенцыі апрацаваны.`);
    } catch (err) {
      console.error(`❌ [Manual Sync] Памылка:`, err.message);
    } finally {
      global.isSyncRunning = false;
    }
  });
});
// GET /api/sync/progress - атрымаць бягучы стан
router.get("/progress", (req, res) => {
  res.json(global.syncProgress);
});

// POST /api/sync/stop - запыт на прыпынак
router.post("/stop", (req, res) => {
  global.stopSyncRequested = true;
  global.syncProgress.status = 'stopping';
  console.log("🛑 [Sync] Атрыманы запыт на прыпынак сінхранізацыі.");
  res.json({ message: "Запыт на прыпынак адпраўлены" });
});
module.exports = router;