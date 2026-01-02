// backend/middleware/authAdmin.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access denied" });
    }

    req.user = {
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      isAdmin: user.isAdmin,
    };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({ success: false, message: "Token not valid" });
  }
}

module.exports = authAdmin;
