// backend/models/Testimonials.js
const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    }, 
    user: {                                                 // user ias added
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    user_name: { type: String, required: true },
    content: { type: String, required: true, minlength: 5, maxlength: 500 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
