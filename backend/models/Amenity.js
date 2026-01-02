// backend/models/Amenity.js
const mongoose = require("mongoose");

const AmenitySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Building", "Common Area", "Bedroom", "Washroom"], required: true },
    icon: { type: String, enum: ["wifi", "tv", "ac", "geyser", "powerbackup", "fireext", "bed", "parking", "rowater", "dining", "washingmachine", "lift", "cctv"] }, // e.g. "wifi", "tv", "ac"
  },
  { timestamps: true }
);

AmenitySchema.index({ property: 1 });


module.exports = mongoose.model("Amenity", AmenitySchema);
