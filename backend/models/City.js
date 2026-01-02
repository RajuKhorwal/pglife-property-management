// backend/models/City.js
const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, lowercase: true, trim: true }
}, { timestamps: true });

CitySchema.index({ name: 1 });

module.exports = mongoose.model("City", CitySchema);
