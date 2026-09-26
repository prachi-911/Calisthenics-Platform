const express = require("express");

const {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  uploadWorkoutThumbnail,
  uploadWorkoutVideo,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  updateWorkoutExercise,
  reorderWorkoutExercises,
  getWorkoutExercises,
} = require("../controllers/workoutController");

const {
  workoutValidator,
  updateWorkoutValidator,
  addExerciseToWorkoutValidator,
  updateWorkoutExerciseValidator,
  reorderExercisesValidator,
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

// Get exercises of a workout
router.get("/:id/exercises", getWorkoutExercises);

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

// Add exercise to workout
router.post(
  "/:id/exercises",
  authenticateUser,
  authorizeRole("admin"),
  addExerciseToWorkoutValidator,
  validateRequest,
  addExerciseToWorkout
);

// Reorder exercises in workout
router.put(
  "/:id/exercises-reorder",
  authenticateUser,
  authorizeRole("admin"),
  reorderExercisesValidator,
  validateRequest,
  reorderWorkoutExercises
);

// Update specific exercise in workout
router.put(
  "/:id/exercises/:exerciseItemId",
  authenticateUser,
  authorizeRole("admin"),
  updateWorkoutExerciseValidator,
  validateRequest,
  updateWorkoutExercise
);

// Remove exercise from workout
router.delete(
  "/:id/exercises/:exerciseItemId",
  authenticateUser,
  authorizeRole("admin"),
  removeExerciseFromWorkout
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