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
  if (!agencyName) return res.status(400).json({ message: "agencyName абавязковы" });
  if (global.isSyncRunning) return res.status(409).json({ message: "Сканаванне ўжо ідзе. Паспрабуйце пазней." });

  console.log(`🚀 [Manual Sync] Запуск для агенцыі: ${agencyName}`);
  // Адказваем адразу, сканаванне ідзе ў фоне
  res.json({ message: `Сканаванне для ${agencyName} запушчана` });

  setImmediate(async () => {
    global.isSyncRunning = true;
    try {
      const sheets = await SheetSource.find({ agencyName, status: "active" });
      console.log(`📊 [Manual Sync] Табліц для ${agencyName}: ${sheets.length}`);
      for (const s of sheets) await syncSheetVacancies(s._id);

      const trelloBoards = await TrelloSource.find({ agencyName, status: "active" });
      console.log(`🗂️ [Manual Sync] Trello-дошак для ${agencyName}: ${trelloBoards.length}`);
      for (const t of trelloBoards) await syncTrelloBoard(t._id);

      const airtableSources = await AirtableSource.find({ agencyName, status: "active" });
      console.log(`💎 [Manual Sync] Airtable-крыніц для ${agencyName}: ${airtableSources.length}`);
      for (const a of airtableSources) await syncSingleSource(a);

      console.log(`✅ [Manual Sync] Завершана для ${agencyName}`);
    } catch (err) {
      console.error(`❌ [Manual Sync] Памылка для ${agencyName}:`, err.message);
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