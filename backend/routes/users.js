// backend/routes/users.js
const express = require("express");
const Interested = require("../models/Interested");
const Property = require("../models/Property");
const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();
const uploadAvatar = require("../middleware/uploadAvatar");
const cloudinary = require("../config/cloudinary"); // ✅ ADD THIS

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, college_name } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // update fields
    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    if (college_name) user.college_name = college_name;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        college_name: user.college_name,
        avatar_url: user.avatar_url,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        college_name: user.college_name,
        avatar_url: user.avatar_url,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ IMPROVED: Avatar upload with old image deletion
router.put("/:id/avatar", auth, uploadAvatar.single("avatar"), async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure logged-in user is only updating their own profile
    if (req.user._id.toString() !== id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ✅ NEW: Delete old avatar from Cloudinary if exists
    if (user.avatar_url) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = user.avatar_url.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `pglife/avatars/${publicIdWithExtension.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId);
        console.log('Old avatar deleted:', publicId);
      } catch (deleteError) {
        console.error('Error deleting old avatar:', deleteError);
        // Don't fail the request if old image deletion fails
      }
    }

    // ✅ IMPROVED: Save avatar URL (Cloudinary returns full URL in req.file.path)
    user.avatar_url = req.file.path;
    await user.save();

    // ✅ IMPROVED: Return response with cache-busting timestamp
    res.json({
      success: true,
      message: "Avatar updated successfully",
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        college_name: user.college_name,
        avatar_url: user.avatar_url, // This is already full Cloudinary URL
        isAdmin: user.isAdmin,
      },
      timestamp: Date.now(), // ✅ ADD: For cache busting
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   GET /api/users/:id/interested
// @desc    Get all interested properties of a user
// @access  Private
router.get("/:id/interested", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Ensure logged-in user is fetching only their own data
    if (req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const interested = await Interested.find({ user: userId }).populate(
      "property",
      "name address rent city gender images rating_clean rating_food rating_safety"
    );

    const properties = interested.map((entry) => entry.property);

    res.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
