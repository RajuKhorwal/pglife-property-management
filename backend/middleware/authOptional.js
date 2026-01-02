// backend/middleware/authOptional.js
const jwt = require("jsonwebtoken");

module.exports = function authOptional(req, _res, next) {
  const header = req.headers.authorization || "";
  const parts = header.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") return next();

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const _id = decoded._id ||  decoded.userId;
    if (_id) req.user = { _id };
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      console.warn("⏰ Token expired at:", new Date(e.expiredAt).toISOString());
    } else if (e.name === "JsonWebTokenError") {
      console.warn("❌ Invalid token:", e.message);
    } else {
      console.warn("⚠️ JWT error:", e.message);
    }
  }

  return next();
};
