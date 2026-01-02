// backend/index.js
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const bookingRoutes = require("./routes/bookingRoutes");

// serve static uploads folder


const app = express();
connectDB();
// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/cities", require("./routes/cities"));
app.use("/api/users", require("./routes/users"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("PGLIFE API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
