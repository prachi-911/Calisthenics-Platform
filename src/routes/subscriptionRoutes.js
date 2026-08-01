const express = require("express");

const {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
} = require("../controllers/subscriptionController");

const {
  subscriptionValidator,
} = require("../validators/subscriptionValidator");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

// =======================
// Public/User Routes
// =======================

// Get all subscription plans
router.get("/", getSubscriptions);

// Get single subscription plan
router.get("/:id", getSubscription);

// =======================
// Admin Routes
// =======================

// Create subscription plan
router.post(
  "/",
  authenticateUser,
  authorizeRole("admin"),
  subscriptionValidator,
  validateRequest,
  createSubscription
);

// Update subscription plan
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  subscriptionValidator,
  validateRequest,
  updateSubscription
);

// Delete subscription plan
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  deleteSubscription
);

module.exports = router;