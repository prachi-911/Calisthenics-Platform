const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator
} = require("../validators/authValidator");

const validateRequest = require("../middlewares/validateRequest");
const authenticateUser = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const router = express.Router();

// Register
router.post(
  "/register",
  registerValidator,
  validateRequest,
  registerUser
);

// Login
router.post(
  "/login",
  loginValidator,
  validateRequest,
  loginUser
);

// Profile (Protected)
router.get(
  "/profile",
  authenticateUser,
  getProfile
);

// Update Profile (Protected)
router.put(
  "/profile",
  authenticateUser,
  updateProfileValidator,
  validateRequest,
  updateProfile
);
router.put(
  "/change-password",
  authenticateUser,
  changePasswordValidator,
  validateRequest,
  changePassword
);
router.put(
  "/profile-picture",
  authenticateUser,
  upload.single("profilePicture"),
  uploadProfilePicture
);

module.exports = router;