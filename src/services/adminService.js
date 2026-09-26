const {
  getOverviewStats,
  getMonthlyRevenueAnalytics,
  getRecentActivities,
  getUsersList,
  getUserDetailsForAdmin,
  updateUserRole,
  deleteUser,
} = require("../repositories/adminRepository");

// Overview Stats Service
const getDashboardOverviewService = async () => {
  const stats = await getOverviewStats();

  return {
    success: true,
    message: "Admin dashboard overview fetched successfully",
    data: stats,
  };
};

// Revenue Analytics Service
const getRevenueAnalyticsService = async (year) => {
  const selectedYear = year ? parseInt(year, 10) : new Date().getFullYear();
  const rawAnalytics = await getMonthlyRevenueAnalytics(selectedYear);

  // Format months 1-12 with 0 revenue fallback
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const formattedData = months.map((monthName, idx) => {
    const monthNum = idx + 1;
    const found = rawAnalytics.find((r) => r._id === monthNum);
    return {
      month: monthName,
      monthNumber: monthNum,
      revenue: found ? found.revenue : 0,
      transactions: found ? found.count : 0,
    };
  });

  return {
    success: true,
    message: "Revenue analytics fetched successfully",
    year: selectedYear,
    data: formattedData,
  };
};

// Recent System Activities Service
const getRecentActivitiesService = async (limit) => {
  const activities = await getRecentActivities(limit ? parseInt(limit, 10) : 10);

  return {
    success: true,
    message: "Recent activities fetched successfully",
    data: activities,
  };
};

// Users List Service
const getUsersListService = async (queryParams) => {
  const { search, role, page, limit } = queryParams;
  const result = await getUsersList({ search, role, page, limit });

  return {
    success: true,
    message: "Users list fetched successfully",
    ...result,
  };
};

// Single User Detailed Admin Profile Service
const getUserDetailsAdminService = async (userId) => {
  const details = await getUserDetailsForAdmin(userId);

  if (!details.user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    message: "User detailed information fetched successfully",
    data: details,
  };
};

// Update User Role Service
const updateUserRoleService = async (currentAdminId, targetUserId, newRole) => {
  if (currentAdminId.toString() === targetUserId.toString() && newRole !== "admin") {
    throw new Error("You cannot remove your own admin privileges");
  }

  const updatedUser = await updateUserRole(targetUserId, newRole);

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return {
    success: true,
    message: `User role updated to ${newRole} successfully 🎉`,
    data: updatedUser,
  };
};

// Delete User Service
const deleteUserService = async (currentAdminId, targetUserId) => {
  if (currentAdminId.toString() === targetUserId.toString()) {
    throw new Error("You cannot delete your own admin account");
  }

  const deletedUser = await deleteUser(targetUserId);

  if (!deletedUser) {
    throw new Error("User not found");
  }

  return {
    success: true,
    message: "User account deleted successfully 🗑️",
  };
};

module.exports = {
  getDashboardOverviewService,
  getRevenueAnalyticsService,
  getRecentActivitiesService,
  getUsersListService,
  getUserDetailsAdminService,
  updateUserRoleService,
  deleteUserService,
};
