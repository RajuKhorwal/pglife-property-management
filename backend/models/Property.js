// backend/models/Property.js
const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "unisex"], required: true },
  rent: { type: Number, required: true, min: 1 },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  rating_clean: { type: Number, default: 0, min: 0, max: 5 },
  rating_food: { type: Number, default: 0, min: 0, max: 5 },
  rating_safety: { type: Number, default: 0, min: 0, max: 5 },
  images: [{ type: String }] 
}, { timestamps: true });

PropertySchema.index({ name: "text", address: "text" });

module.exports = mongoose.model("Property", PropertySchema);
