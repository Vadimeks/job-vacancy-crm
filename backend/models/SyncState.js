const mongoose = require("mongoose");

const syncStateSchema = new mongoose.Schema(
  {
    key: { type: String, default: "circular_sync_position", unique: true },
    
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

    // 👈 ДАДАДЗЕНА: ці паспяхова завершана апошняе кола
    isComplete: { type: Boolean, default: false },
    lastFullCircleAt: { type: Date, default: null } // 👈 Дадаем дату фінішу поўнага кола
  },
  { timestamps: true }
);

module.exports = mongoose.model("SyncState", syncStateSchema);