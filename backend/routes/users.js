// backend/routes/users.js
const express = require("express");
const Interested = require("../models/Interested");
const Property = require("../models/Property");
const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();
const uploadAvatar = require("../middleware/uploadAvatar");


// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, college_name } = req.body;

    // find user by id
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
        email: user.email, // keep email non-editable
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

    // Save avatar URL
    user.avatar_url = req.file.path; 
    await user.save();

    res.json({
      success: true,
      message: "Avatar updated successfully",
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
    console.error("Avatar upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
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