const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const validateRequest = require("../middlewares/validateRequest");
const authenticateUser = require("../middlewares/authMiddleware");

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

module.exports = router;