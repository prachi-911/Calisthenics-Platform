const express = require("express");

const {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  uploadProgramThumbnail,
  deleteProgram,
  enrollProgram,
  getMyEnrollments,
  getProgramProgress,
  completeWorkoutStep,
} = require("../controllers/programController");

const {
  createProgramValidator,
  updateProgramValidator,
  completeStepValidator,
} = require("../validators/programValidator");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const validateRequest = require("../middlewares/validateRequest");
const uploadImage = require("../middlewares/uploadImage");

const router = express.Router();

// ===============================
// Public Routes
// ===============================

// Get all programs (supports ?level=&category=&isPremium=)
router.get("/", getAllPrograms);

// ===============================
// Authenticated Student Routes
// ===============================

// Get user's enrolled programs
router.get("/enrolled/me", authenticateUser, getMyEnrollments);

// Get single program details
router.get("/:id", getProgramById);

// Enroll in a program
router.post("/:id/enroll", authenticateUser, enrollProgram);

// Get user progress in a program
router.get("/:id/progress", authenticateUser, getProgramProgress);

// Mark a workout step completed
router.post(
  "/:id/complete-step",
  authenticateUser,
  completeStepValidator,
  validateRequest,
  completeWorkoutStep
);

// ===============================
// Admin Routes
// ===============================

// Create program
router.post(
  "/",
  authenticateUser,
  authorizeRole("admin"),
  createProgramValidator,
  validateRequest,
  createProgram
);

// Update program
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  updateProgramValidator,
  validateRequest,
  updateProgram
);

// Upload program thumbnail
router.post(
  "/:id/thumbnail",
  authenticateUser,
  authorizeRole("admin"),
  uploadImage.single("thumbnail"),
  uploadProgramThumbnail
);

// Delete program
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  deleteProgram
);

module.exports = router;
