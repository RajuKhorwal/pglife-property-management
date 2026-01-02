const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const authMiddleware = require("../middleware/auth");

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      propertyId,
      moveInDate,
      duration,
      numberOfPeople,
      specialRequests,
      totalAmount,
    } = req.body;

    // 1️⃣ Required field check
    if (!propertyId || !moveInDate || !duration || !numberOfPeople || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2️⃣ Prevent past booking dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const moveIn = new Date(moveInDate);
    moveIn.setHours(0, 0, 0, 0);

    if (moveIn < today) {
      return res.status(400).json({
        message: "Booking date cannot be in the past",
      });
    }

    // 3️⃣ Calculate move-out date
    const moveOutDate = new Date(moveIn);
    moveOutDate.setMonth(moveOutDate.getMonth() + Number(duration));

    // 4️⃣ Check property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 5️⃣ Prevent date collision
    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $ne: "cancelled" },
      moveInDate: { $lt: moveOutDate },
      moveOutDate: { $gt: moveIn },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This property is already booked for the selected dates",
      });
    }

    // 6️⃣ Create booking
    const booking = new Booking({
      user: req.user._id,
      property: propertyId,
      moveInDate: moveIn,
      moveOutDate,
      duration,
      numberOfPeople,
      specialRequests,
      totalAmount,
      status: "confirmed",
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
