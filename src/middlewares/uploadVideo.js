const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|webm|mkv/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype =
    file.mimetype.startsWith("video/") ||
    file.mimetype === "application/octet-stream";

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error("Only video files are allowed."));
};

const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
});

module.exports = uploadVideo;