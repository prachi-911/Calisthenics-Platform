const express = require("express");

const {
  getDashboardOverview,
  getRevenueAnalytics,
  getRecentActivities,
  getUsersList,
  getUserDetails,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

const { updateRoleValidator } = require("../validators/adminValidator");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

// Apply admin authentication to all routes in this router
router.use(authenticateUser, authorizeRole("admin"));

// Dashboard Overview Analytics
router.get("/dashboard/overview", getDashboardOverview);

// Revenue Analytics
router.get("/dashboard/revenue", getRevenueAnalytics);

// Recent System Activities
router.get("/dashboard/recent-activity", getRecentActivities);

// Manage Users (Search, filter, paginate)
router.get("/users", getUsersList);

// Get User Full Profile Details
router.get("/users/:id", getUserDetails);

// Update User Role
router.put(
  "/users/:id/role",
  updateRoleValidator,
  validateRequest,
  updateUserRole
);

// Delete User
router.delete("/users/:id", deleteUser);

module.exports = router;
