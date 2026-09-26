const express = require("express");

const {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  uploadExerciseThumbnail,
  uploadExerciseVideo,
  deleteExercise,
} = require("../controllers/exerciseController");

const {
  createExerciseValidator,
  updateExerciseValidator,
} = require("../validators/exerciseValidator");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const validateRequest = require("../middlewares/validateRequest");
const uploadImage = require("../middlewares/uploadImage");
const uploadVideo = require("../middlewares/uploadVideo");

const router = express.Router();

// ===============================
// Public Routes
// ===============================

// Get all exercises (supports ?category=&difficulty=&targetMuscle=&isPremium=)
router.get("/", getAllExercises);

// Get exercise by ID
router.get("/:id", getExerciseById);

// ===============================
// Admin Routes
// ===============================

// Create exercise
router.post(
  "/",
  authenticateUser,
  authorizeRole("admin"),
  createExerciseValidator,
  validateRequest,
  createExercise
);

// Update exercise
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  updateExerciseValidator,
  validateRequest,
  updateExercise
);

// Upload exercise thumbnail
router.post(
  "/:id/thumbnail",
  authenticateUser,
  authorizeRole("admin"),
  uploadImage.single("thumbnail"),
  uploadExerciseThumbnail
);

// Upload exercise video
router.post(
  "/:id/video",
  authenticateUser,
  authorizeRole("admin"),
  uploadVideo.single("video"),
  uploadExerciseVideo
);

// Delete exercise
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  deleteExercise
);

module.exports = router;
