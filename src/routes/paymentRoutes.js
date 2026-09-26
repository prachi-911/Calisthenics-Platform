const express = require("express");

const {
  createOrder,
  verifyPayment,
  getMyPayments,
  getAllPayments,
  getPaymentStats,
} = require("../controllers/paymentController");

const {
  createOrderValidator,
  verifyPaymentValidator,
} = require("../validators/paymentValidator");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

// ===============================
// Authenticated Student Routes
// ===============================

// Create payment order
router.post(
  "/create-order",
  authenticateUser,
  createOrderValidator,
  validateRequest,
  createOrder
);

// Verify payment & activate subscription
router.post(
  "/verify",
  authenticateUser,
  verifyPaymentValidator,
  validateRequest,
  verifyPayment
);

// Get my payment history
router.get("/my-history", authenticateUser, getMyPayments);

// ===============================
// Admin Routes
// ===============================

// Get all payments across platform
router.get(
  "/admin/all",
  authenticateUser,
  authorizeRole("admin"),
  getAllPayments
);

// Get payment statistics
router.get(
  "/admin/stats",
  authenticateUser,
  authorizeRole("admin"),
  getPaymentStats
);

module.exports = router;
