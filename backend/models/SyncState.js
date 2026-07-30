const mongoose = require("mongoose");

const syncStateSchema = new mongoose.Schema(
  {
    key: { type: String, default: "circular_sync_position", unique: true },
    
    // Стан выканання (DB-level lock)
    isRunning: { type: Boolean, default: false },
    lockedAt: { type: Date, default: null },

    // На якой крыніцы мы спыніліся ў мінулы раз
    lastSourceType: { 
      type: String, 
      enum: ["spreadsheet", "trello", "airtable", null], 
      default: null 
    },
    lastSourceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    
    // На якім радку/картцы ўнутры гэтай крыніцы мы спыніліся
    lastIndex: { type: Number, default: 0 },
    
    // Спіс усіх крыніц у парадку "Кола", які мы прайшлі
    processedInCircle: [{ type: mongoose.Schema.Types.ObjectId }],

    // Ці паспяхова завершана апошняе кола
    isComplete: { type: Boolean, default: false },
    lastFullCircleAt: { type: Date, default: null } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("SyncState", syncStateSchema);