// backend/routes/properties.js
const express = require("express");
const Property = require("../models/Property");
const City = require("../models/City");
const Testimonial = require("../models/Testimonial");
const Amenity = require("../models/Amenity");
const Interested = require("../models/Interested");
const auth = require("../middleware/auth");
const router = express.Router();
const authOptional = require("../middleware/authOptional");
const jwt = require("jsonwebtoken");
const Rating = require("../models/Rating");
const User = require("../models/User");

// GET /api/properties?city=Delhi
router.get("/", async (req, res) => {
  try {
    const cityName = req.query.city;
    if (!cityName) {
      return res
        .status(400)
        .json({ success: false, message: "City is required" });
    }

    // Find city
    const city = await City.findOne({ name: cityName });
    if (!city) {
      return res
        .status(404)
        .json({ success: false, message: "City not found" });
    }

    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token && token !== "null" && token !== "undefined") {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded._id;
        } catch (err) {
          if (err.name === "TokenExpiredError") {
            console.warn("⏰ Token expired at:", err.expiredAt);
          } else {
            console.warn("❌ Invalid token in /api/properties:", err.message);
          }
        }
      }
    }

    // Find properties in city
    const properties = await Property.find({ city: city._id });

    // For each property, count interested users
    const propertyData = await Promise.all(
      properties.map(async (property) => {
        const interestedCount = await Interested.countDocuments({
          property: property._id,
        });

        let userInterested = false;
        if (userId) {
          const existing = await Interested.findOne({
            property: property._id,
            user: userId,
          });
          userInterested = !!existing;
        }

        return {
          ...property.toObject(),
          rating_clean: property.rating_clean || 0,
          rating_food: property.rating_food || 0,
          rating_safety: property.rating_safety || 0,
          interestedCount,
          userInterested,
        };
      })
    );

    res.json({
      success: true,
      city: city.name,
      properties: propertyData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET property details by ID
router.post("/:id/interested", auth, async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user._id; // extracted from token

    // Check if already interested
    const existing = await Interested.findOne({
      property: propertyId,
      user: userId,
    });
    if (existing) {
      return res.json({
        success: true,
        message: "Already marked as interested",
      });
    }

    // Create new interest
    await Interested.create({ property: propertyId, user: userId });

    res.json({ success: true, message: "Property marked as interested" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:id", authOptional, async (req, res) => {
  try {
    const propertyId = req.params.id;

    // fetch property + city
    const property = await Property.findById(propertyId).populate("city");
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // fetch testimonials
    const testimonials = await Testimonial.find({ property: propertyId });

    // fetch amenities
    const amenities = await Amenity.find({ property: propertyId });

    // fetch interested users
    const interestedUsers = await Interested.find({ property: propertyId });
    const interestedCount = interestedUsers.length;

    // ✅ check if this logged-in user is interested
    let userInterested = false;
    if (req.user) {
      userInterested = await Interested.exists({
        property: propertyId,
        user: req.user._id,
      });
    }

    res.json({
      success: true,
      property,
      testimonials,
      amenities,
      interestedCount,
      userInterested, // <-- frontend can now color the heart correctly
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id/interested", auth, async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user._id; // ✅ comes from token

    const existing = await Interested.findOne({
      property: propertyId,
      user: userId,
    });
    if (!existing) {
      return res.json({
        success: true,
        message: "You have not marked this property as interested",
      });
    }

    await Interested.deleteOne({ _id: existing._id });

    res.json({ success: true, message: "Interest removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:id/testimonials", auth, async (req, res) => {
  try {
    const { content } = req.body; // testimonial content
    const propertyId = req.params.id;
    const userId = req.user._id; // from JWT

    if (!content || content.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    const user = await User.findById(userId);

    const testimonial = new Testimonial({
      user: userId,
      user_name: user.full_name, // ✅ matches schema
      property: propertyId,
      content, // ✅ matches schema
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully!",
      testimonial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/properties/:id/testimonials
router.get("/:id/testimonials", async (req, res) => {
  try {
    const propertyId = req.params.id;

    const testimonials = await Testimonial.find({
      property: propertyId,
      status: "approved",
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      testimonials,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/properties/:id/rate
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const { rating_clean, rating_food, rating_safety } = req.body;
    const propertyId = req.params.id;
    const userId = req.user._id;

    if (
      rating_clean < 0 ||
      rating_clean > 5 ||
      rating_food < 0 ||
      rating_food > 5 ||
      rating_safety < 0 ||
      rating_safety > 5
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Ratings must be between 0 and 5" });
    }

    // Create or update rating
    let rating = await Rating.findOne({ property: propertyId, user: userId });

    if (rating) {
      rating.rating_clean = rating_clean;
      rating.rating_food = rating_food;
      rating.rating_safety = rating_safety;
      await rating.save();
    } else {
      rating = await Rating.create({
        property: propertyId,
        user: userId,
        rating_clean,
        rating_food,
        rating_safety,
      });
    }

    // Recalculate averages for property
    const allRatings = await Rating.find({ property: propertyId });
    const avg_clean =
      allRatings.reduce((sum, r) => sum + r.rating_clean, 0) /
      allRatings.length;
    const avg_food =
      allRatings.reduce((sum, r) => sum + r.rating_food, 0) / allRatings.length;
    const avg_safety =
      allRatings.reduce((sum, r) => sum + r.rating_safety, 0) /
      allRatings.length;

    const property = await Property.findById(propertyId);
    property.rating_clean = avg_clean;
    property.rating_food = avg_food;
    property.rating_safety = avg_safety;
    await property.save();

    res.json({
      success: true,
      message: "Rating submitted successfully",
      averages: {
        clean: avg_clean,
        food: avg_food,
        safety: avg_safety,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
