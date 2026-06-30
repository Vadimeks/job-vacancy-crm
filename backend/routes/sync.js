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
  
  // 👈 Падтрымка і аднаго радка, і масіва
  const agencies = Array.isArray(agencyName) ? agencyName : [agencyName];
  
  if (!agencies.length || !agencies[0]) {
    return res.status(400).json({ message: "Спіс агенцый пусты" });
  }

  if (global.isSyncRunning) {
    return res.status(409).json({ message: "Сканаванне ўжо ідзе. Паспрабуйце пазней." });
  }

  console.log(`🚀 [Manual Sync] Запуск для: ${agencies.join(", ")}`);
  res.json({ message: `Сканаванне для ${agencies.length} агенцый запушчана` });

  setImmediate(async () => {
    global.isSyncRunning = true;
    try {
      for (const agency of agencies) {
        console.log(`\n--- 🔄 Апрацоўка агенцыі: ${agency} ---`);
        
        const sheets = await SheetSource.find({ agencyName: agency, status: "active" });
        for (const s of sheets) await syncSheetVacancies(s._id);

        const trelloBoards = await TrelloSource.find({ agencyName: agency, status: "active" });
        for (const t of trelloBoards) await syncTrelloBoard(t._id);

        const airtableSources = await AirtableSource.find({ agencyName: agency, status: "active" });
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

// GET /api/sync/progress
router.get("/progress", (req, res) => {
  res.json(global.syncProgress || { current: 0, total: 0, status: 'idle' });
});

// POST /api/sync/stop
router.post("/stop", (req, res) => {
  global.stopSyncRequested = true;
  if (global.syncProgress) global.syncProgress.status = 'stopping';
  res.json({ message: "Запыт на прыпынак адпраўлены" });
});

module.exports = router;