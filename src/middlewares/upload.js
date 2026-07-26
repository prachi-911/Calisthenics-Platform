const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "calisthenics-profile-pictures",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Multer Upload Middleware
const upload = multer({
  storage: storage,
});

module.exports = upload;