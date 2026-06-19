const mongoose = require("mongoose");
const locationCacheSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true, index: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  displayName: { type: String },
  createdAt: { type: Date, default: Date.now, expires: '30d' }
});
module.exports = mongoose.model("LocationCache", locationCacheSchema);