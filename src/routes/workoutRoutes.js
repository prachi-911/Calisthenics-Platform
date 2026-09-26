const express = require("express");

const {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  uploadWorkoutThumbnail,
  uploadWorkoutVideo,
  deleteWorkout,
} = require("../controllers/workoutController");

const {
  workoutValidator,
  updateWorkoutValidator,
} = require("../validators/workoutValidator");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const validateRequest = require("../middlewares/validateRequest");
const uploadImage = require("../middlewares/uploadImage");
const uploadVideo = require("../middlewares/uploadVideo");
const router = express.Router();

// ===============================
// Public Routes
// ===============================

// Get all workouts
router.get("/", getAllWorkouts);

// Get workout by ID
router.get("/:id", getWorkoutById);

// ===============================
// Admin Routes
// ===============================

// Create workout
router.post(
  "/",
  authenticateUser,
  authorizeRole("admin"),
  workoutValidator,
  validateRequest,
  createWorkout
);

// Update workout
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  updateWorkoutValidator,
  validateRequest,
  updateWorkout
);
// Upload Workout Thumbnail
router.post(
  "/:id/thumbnail",
  authenticateUser,
  authorizeRole("admin"),
  uploadImage.single("thumbnail"),
  uploadWorkoutThumbnail
);

// Upload Workout Video
router.post(
  "/:id/video",
  authenticateUser,
  authorizeRole("admin"),
  uploadVideo.single("video"),
  uploadWorkoutVideo
);

// Delete workout
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  deleteWorkout
);

module.exports = router;