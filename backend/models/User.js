// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed password
  college_name: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  avatar_url: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
