// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const authAdmin = require("../middleware/authAdmin"); // require the admin middleware
const Property = require("../models/Property");
const City = require("../models/City");
const Amenity = require("../models/Amenity");
const Testimonial = require("../models/Testimonial");
const User = require("../models/User");
const Interested = require("../models/Interested");
const { uploadPropertyImages } = require("../middleware/upload"); // make sure this exists

//   Create a new property (admin only)
router.post(
  "/properties",
  authAdmin,
  uploadPropertyImages.array("images", 5), // allow up to 5 images
  async (req, res) => {
    try {
      const { name, address, gender, rent, cityName } = req.body;

      if (!name || !address || !gender || !rent || !cityName) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      // Find or create city
      let city = await City.findOne({ name: cityName });
      if (!city) {
        city = await City.create({ name: cityName });
      }

      // Save uploaded image paths
      const imagePaths = (req.files || []).map(
        (file) => `/uploads/properties/${file.filename}`
      );

      const property = new Property({
        name,
        address,
        gender,
        rent,
        city: city._id,
        images: imagePaths,
      });

      await property.save();
      await property.populate("city", "name");

      res
        .status(201)
        .json({ success: true, message: "Property created", property });
    } catch (err) {
      console.error("Admin create property error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Get a single property with amenities & testimonials (admin only)
router.get("/properties/:id", authAdmin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "city",
      "name"
    );
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const amenities = await Amenity.find({ property: property._id });
    const testimonials = await Testimonial.find({ property: property._id });

    res.json({
      success: true,
      property,
      amenities,
      testimonials,
    });
  } catch (err) {
    console.error("Admin get property detail error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// List all properties (admin only)
router.get("/properties", authAdmin, async (req, res) => {
  try {
    const properties = await Property.find().populate("city", "name");
    res.json({ success: true, count: properties.length, properties });
  } catch (err) {
    console.error("Admin list properties error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete a property (admin only)
router.delete("/properties/:id", authAdmin, async (req, res) => {
  try {
    const propertyId = req.params.id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Delete all related data in parallel
    await Promise.all([
      Amenity.deleteMany({ property: propertyId }),
      Testimonial.deleteMany({ property: propertyId }),
      Interested.deleteMany({ property: propertyId }),
    ]);

    // Delete the property itself
    await Property.findByIdAndDelete(propertyId);

    res.json({
      success: true,
      message: "Property and all related data deleted",
    });
  } catch (err) {
    console.error("Admin delete property error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update a property (admin only)
router.put(
  "/properties/:id",
  authAdmin,
  uploadPropertyImages.array("images", 5),
  async (req, res) => {
    try {
      const { name, address, gender, rent, cityName } = req.body;
      let existingImages = req.body.existingImages || [];

      if (typeof existingImages === "string") {
        // if only one existingImage is sent
        existingImages = [existingImages];
      }

      const property = await Property.findById(req.params.id);
      if (!property)
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });

      // Delete removed images from uploads folder
      const removedImages = property.images.filter(
        (img) => !existingImages.includes(img)
      );
      removedImages.forEach((imgPath) => {
        const fullPath = path.join(process.cwd(), imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });

      const newUploadedImages = (req.files || []).map(
        (file) => `/uploads/properties/${file.filename}`
      );
      property.images = [...existingImages, ...newUploadedImages];

      if (name) property.name = name;
      if (address) property.address = address;
      if (gender) property.gender = gender;
      if (rent) property.rent = rent;

      // Update city
      if (cityName) {
        let city = await City.findOne({ name: cityName });
        if (!city) city = await City.create({ name: cityName });
        property.city = city._id;
      }

      await property.save();
      await property.populate("city", "name");

      res.json({ success: true, message: "Property updated", property });
    } catch (err) {
      console.error("Admin update property error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

//   Add an amenity to a property (admin only)
router.post("/properties/:id/amenities", authAdmin, async (req, res) => {
  try {
    const { name, type, icon } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Amenity name is required" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const amenity = await Amenity.create({
      property: req.params.id,
      name,
      type,
      icon,
    });

    res.status(201).json({ success: true, amenity });
  } catch (err) {
    console.error("Admin add amenity error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/admin/amenities
router.get("/amenities", authAdmin, async (req, res) => {
  try {
    const amenities = await Amenity.find().populate("property", "name address");
    res.json({ success: true, count: amenities.length, amenities });
  } catch (err) {
    console.error("Admin list amenities error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/admin/amenities/:id
router.put("/amenities/:id", authAdmin, async (req, res) => {
  try {
    const { name, type, icon, propertyId } = req.body;
    const amenity = await Amenity.findById(req.params.id);
    if (!amenity)
      return res
        .status(404)
        .json({ success: false, message: "Amenity not found" });

    if (name) amenity.name = name;
    if (type) amenity.type = type;
    if (icon) amenity.icon = icon;
    if (propertyId) amenity.property = propertyId;

    await amenity.save();
    await amenity.populate("property", "name address");
    res.json({ success: true, amenity });
  } catch (err) {
    console.error("Admin update amenity error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /api/admin/amenities/:id
router.delete("/amenities/:id", authAdmin, async (req, res) => {
  try {
    await Amenity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Amenity deleted" });
  } catch (err) {
    console.error("Admin delete amenity error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Create a testimonial for a property (admin only)
 * Note: since frontend doesn't post testimonials, admin can create them here.
 * Body: { user_name, content }
 */
router.post("/properties/:id/testimonials", authAdmin, async (req, res) => {
  try {
    const { user_name, content } = req.body;
    if (!content || content.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const testimonial = await Testimonial.create({
      user: req.user._id, // admin-created (not tied to a regular user)
      user_name: user_name || req.user.full_name || "Admin",
      property: req.params.id,
      content,
    });

    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    console.error("Admin create testimonial error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET all testimonials
router.get("/testimonials", authAdmin, async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate("property", "name")
      .populate("user", "full_name email avatar_url")
      .sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (err) {
    console.error("Error in GET /api/admin/testimonials:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT update testimonial status (approve/reject)
router.put("/testimonials/:id", authAdmin, async (req, res) => {
  try {
    const { content, status } = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { ...(content && { content }), ...(status && { status }) },
      { new: true }
    )
      .populate("property", "name")
      .populate("user", "full_name email avatar_url");
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, testimonial });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE testimonial
router.delete("/testimonials/:id", authAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ADMIN: Users management
 * GET /api/admin/users  -> list users
 * DELETE /api/admin/users/:id -> delete user
 */
router.get("/users", authAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    const usersWithFullAvatar = users.map((u) => {
      let avatar = u.avatar_url;
      if (avatar && !avatar.startsWith("http")) {
        avatar = `${process.env.REACT_APP_BACKEND_URL}${avatar}`;
      }
      return {
        ...u.toObject(),
        avatar_url: avatar || null,
      };
    });

    res.json({ success: true, users: usersWithFullAvatar });
  } catch (err) {
    console.error("Admin list users error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/users/:id", authAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists first
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete user's testimonials and interested entries
    await Promise.all([
      Testimonial.deleteMany({ user: userId }),
      Interested.deleteMany({ user: userId }),
    ]);

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "User and related data deleted" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update user (admin only)
router.put("/users/:id", authAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { full_name, phone, college_name, gender, avatar_url } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update allowed fields only
    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    if (college_name) user.college_name = college_name;
    if (gender) user.gender = gender;
    if (avatar_url) user.avatar_url = avatar_url;

    await user.save();
    res.json({ success: true, message: "User updated", user });
  } catch (err) {
    console.error("Admin update user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ADMIN: Interested/bookings management
 * GET /api/admin/interested  -> list all interested entries (bookings)
 * DELETE /api/admin/interested/:id -> delete an interested entry
 */
router.get("/interested", authAdmin, async (req, res) => {
  try {
    const items = await Interested.find({})
      .populate("user", "full_name email")
      .populate("property", "name address");
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    console.error("Admin list interested error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/interested/:id", authAdmin, async (req, res) => {
  try {
    await Interested.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Entry deleted" });
  } catch (err) {
    console.error("Admin delete interested error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
