// backend/models/Rating.js
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating_clean: { type: Number, min: 0, max: 5, required: true },
    rating_food: { type: Number, min: 0, max: 5, required: true },
    rating_safety: { type: Number, min: 0, max: 5, required: true },
  },
  { timestamps: true }
);

// A user can only rate a property once
ratingSchema.index({ property: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);

