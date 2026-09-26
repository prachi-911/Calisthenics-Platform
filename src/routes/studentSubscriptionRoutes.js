const express = require("express");

const {
  subscribeToPlan,
  getMyActiveSubscription,
  getMySubscriptionHistory,
  cancelMySubscription,
  getAllStudentSubscriptions,
  extendStudentSubscription,
  cancelStudentSubscriptionAdmin,
} = require("../controllers/userSubscriptionController");

const {
  subscribePlanValidator,
  extendSubscriptionValidator,
} = require("../validators/userSubscriptionValidator");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

// ===============================
// Authenticated Student Routes
// ===============================

// Get active subscription for current user
router.get("/me", authenticateUser, getMyActiveSubscription);

// Get subscription history for current user
router.get("/my-history", authenticateUser, getMySubscriptionHistory);

// Subscribe to a plan
router.post(
  "/subscribe",
  authenticateUser,
  subscribePlanValidator,
  validateRequest,
  subscribeToPlan
);

// Cancel current subscription auto-renew
router.post("/cancel", authenticateUser, cancelMySubscription);

// ===============================
// Admin Routes
// ===============================

// Get all student subscriptions
router.get(
  "/admin/all",
  authenticateUser,
  authorizeRole("admin"),
  getAllStudentSubscriptions
);

// Extend a student's subscription
router.post(
  "/admin/:id/extend",
  authenticateUser,
  authorizeRole("admin"),
  extendSubscriptionValidator,
  validateRequest,
  extendStudentSubscription
);

// Revoke/cancel a student's subscription
router.post(
  "/admin/:id/cancel",
  authenticateUser,
  authorizeRole("admin"),
  cancelStudentSubscriptionAdmin
);

module.exports = router;
