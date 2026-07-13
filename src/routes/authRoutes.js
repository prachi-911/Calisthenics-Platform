const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

// Register User
router.post(
  "/register",
  registerValidator,
  validateRequest,
  registerUser
);

// Login User
router.post(
  "/login",
  loginValidator,
  validateRequest,
  loginUser
);

module.exports = router;