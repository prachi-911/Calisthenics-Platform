const {
  getDashboardOverviewService,
  getRevenueAnalyticsService,
  getRecentActivitiesService,
  getUsersListService,
  getUserDetailsAdminService,
  updateUserRoleService,
  deleteUserService,
} = require("../services/adminService");

// Dashboard Overview
const getDashboardOverview = async (req, res) => {
  try {
    const result = await getDashboardOverviewService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Revenue Analytics
const getRevenueAnalytics = async (req, res) => {
  try {
    const result = await getRevenueAnalyticsService(req.query.year);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Recent Activities
const getRecentActivities = async (req, res) => {
  try {
    const result = await getRecentActivitiesService(req.query.limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Users List
const getUsersList = async (req, res) => {
  try {
    const result = await getUsersListService(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Single User Details
const getUserDetails = async (req, res) => {
  try {
    const result = await getUserDetailsAdminService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update User Role
const updateUserRole = async (req, res) => {
  try {
    const result = await updateUserRoleService(
      req.user._id,
      req.params.id,
      req.body.role
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const result = await deleteUserService(req.user._id, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardOverview,
  getRevenueAnalytics,
  getRecentActivities,
  getUsersList,
  getUserDetails,
  updateUserRole,
  deleteUser,
};
