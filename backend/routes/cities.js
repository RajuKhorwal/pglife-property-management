// backend/routes/cities.js
const express = require("express");
const City = require("../models/City");

const router = express.Router();

// router.post("/", async (req, res) => {      //only for testing, to add cities
//   try {
//     const { name } = req.body;
//     const city = new City({ name });
//     await city.save();
//     res.json({ success: true, city });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// @desc    Get all cities
router.get("/", async (req, res) => {
  try {
    const cities = await City.find({}, "name");
    res.json({
      success: true,
      cities
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
