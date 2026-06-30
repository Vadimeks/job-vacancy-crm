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
    global.stopSyncRequested = false; // 👈 Скідваем пры кожным старце
    let stopReason = null; // 'user' або 'limit'

    try {
      for (const agency of agencies) {
        if (global.stopSyncRequested) { stopReason = 'user'; break; }

        console.log(`\n--- 🔄 Апрацоўка агенцыі: ${agency} ---`);
        
        const sheets = await SheetSource.find({ agencyName: agency, status: "active" });
        for (const s of sheets) {
          if (global.stopSyncRequested) { stopReason = 'user'; break; }
          const res = await syncSheetVacancies(s._id);
          if (res === "STOP_ALL") { stopReason = 'limit'; break; }
        }
        if (stopReason) break;

        const trelloBoards = await TrelloSource.find({ agencyName: agency, status: "active" });
        for (const t of trelloBoards) {
          if (global.stopSyncRequested) { stopReason = 'user'; break; }
          const res = await syncTrelloBoard(t._id);
          if (res === "STOP_ALL") { stopReason = 'limit'; break; }
        }
        if (stopReason) break;

        const airtableSources = await AirtableSource.find({ agencyName: agency, status: "active" });
        for (const a of airtableSources) {
          if (global.stopSyncRequested) { stopReason = 'user'; break; }
          const res = await syncSingleSource(a);
          if (res === "STOP_ALL") { stopReason = 'limit'; break; }
        }
        if (stopReason) break;
      }

      if (stopReason === 'limit') {
        console.log(`⚠️ [Manual Sync] Спынена: дасягнуты ліміты AI.`);
        global.syncProgress.status = 'limit';
      } else if (stopReason === 'user') {
        console.log(`🛑 [Manual Sync] Перарвана карыстальнікам.`);
        global.syncProgress.status = 'interrupted';
      } else {
        console.log(`✅ [Manual Sync] Усе выбраныя агенцыі апрацаваны цалкам.`);
        global.syncProgress.status = 'idle';
      }

    } catch (err) {
      console.error(`❌ [Manual Sync] Крытычная памылка:`, err.message);
      global.syncProgress.status = 'error';
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