// backend/middleware/uploadAvatar.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ✅ IMPROVED: Better configuration with quality optimization
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pglife/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // ✅ ADD webp support
    transformation: [
      { 
        width: 300, 
        height: 300, 
        crop: "fill", 
        gravity: "face", // ✅ ADD: Smart cropping focuses on faces
        quality: "auto:good", // ✅ ADD: Automatic quality optimization
        fetch_format: "auto" // ✅ ADD: Automatic format selection (WebP when supported)
      }
    ],
    // ✅ ADD: Unique filename to prevent caching issues
    public_id: (req, file) => {
      return `avatar_${req.user._id}_${Date.now()}`;
    }
  },
});

// ✅ ADD: File filter for security
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// ✅ IMPROVED: Add file size limit (5MB)
const uploadAvatar = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

module.exports = uploadAvatar;