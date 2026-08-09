require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const SyncState = require("../models/SyncState");

async function unlock() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Падключана да MongoDB");

    const result = await SyncState.findOneAndUpdate(
      { key: "circular_sync_position" },
      { isRunning: false },
      { new: true }
    );

    console.log("✅ Замок скінуты:", result);
  } catch (err) {
    console.error("❌ Памылка:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

unlock();