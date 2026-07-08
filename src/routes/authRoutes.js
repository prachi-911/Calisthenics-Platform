const express = require("express");

const { registerUser } = require("../controllers/authController");
const { registerValidator } = require("../validators/authValidator");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

// Register User
router.post(
  "/register",
  registerValidator,
  validateRequest,
  registerUser
);

module.exports = router;