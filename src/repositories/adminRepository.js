const User = require("../models/User");
const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");
const Program = require("../models/Program");
const UserSubscription = require("../models/UserSubscription");
const Payment = require("../models/Payment");
const ProgramEnrollment = require("../models/ProgramEnrollment");

// Get Overview Analytics
const getOverviewStats = async () => {
  const [
    totalUsers,
    totalWorkouts,
    totalExercises,
    totalPrograms,
    totalEnrollments,
    subscriptionsStats,
    revenueStats,
  ] = await Promise.all([
    User.countDocuments(),
    Workout.countDocuments(),
    Exercise.countDocuments(),
    Program.countDocuments(),
    ProgramEnrollment.countDocuments(),
    UserSubscription.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]),
  ]);

  let activeSubscriptions = 0;
  let expiredSubscriptions = 0;
  let cancelledSubscriptions = 0;

  subscriptionsStats.forEach((s) => {
    if (s._id === "active") activeSubscriptions = s.count;
    else if (s._id === "expired") expiredSubscriptions = s.count;
    else if (s._id === "cancelled") cancelledSubscriptions = s.count;
  });

  const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;
  const totalTransactions = revenueStats.length > 0 ? revenueStats[0].totalTransactions : 0;

  return {
    users: {
      total: totalUsers,
    },
    content: {
      workouts: totalWorkouts,
      exercises: totalExercises,
      programs: totalPrograms,
      enrollments: totalEnrollments,
    },
    subscriptions: {
      active: activeSubscriptions,
      expired: expiredSubscriptions,
      cancelled: cancelledSubscriptions,
    },
    revenue: {
      total: totalRevenue,
      transactions: totalTransactions,
    },
  };
};

// Get Monthly Revenue Breakdown
const getMonthlyRevenueAnalytics = async (year = new Date().getFullYear()) => {
  return await Payment.aggregate([
    {
      $match: {
        status: "completed",
        paidAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31T23:59:59`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$paidAt" },
        revenue: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]);
};

// Get Recent System Activity
const getRecentActivities = async (limit = 10) => {
  const [recentUsers, recentPayments, recentEnrollments] = await Promise.all([
    User.find().select("fullName email role createdAt").sort({ createdAt: -1 }).limit(limit),
    Payment.find().populate("user", "fullName email").populate("plan", "name").sort({ createdAt: -1 }).limit(limit),
    ProgramEnrollment.find().populate("user", "fullName email").populate("program", "title").sort({ createdAt: -1 }).limit(limit),
  ]);

  return {
    recentUsers,
    recentPayments,
    recentEnrollments,
  };
};

// Get All Users with Filtering and Pagination
const getUsersList = async ({ search, role, page = 1, limit = 10 }) => {
  const query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    query.role = role;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .populate("subscription", "name price duration")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// Get Single User Detailed Profile (for admin)
const getUserDetailsForAdmin = async (userId) => {
  const [user, subscriptions, payments, enrollments] = await Promise.all([
    User.findById(userId).select("-password").populate("subscription"),
    UserSubscription.find({ user: userId }).populate("plan").sort({ createdAt: -1 }),
    Payment.find({ user: userId }).populate("plan").sort({ createdAt: -1 }),
    ProgramEnrollment.find({ user: userId }).populate("program").sort({ createdAt: -1 }),
  ]);

  return {
    user,
    subscriptions,
    payments,
    enrollments,
  };
};

// Update User Role
const updateUserRole = async (userId, role) => {
  return await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
};

// Delete User
const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

module.exports = {
  getOverviewStats,
  getMonthlyRevenueAnalytics,
  getRecentActivities,
  getUsersList,
  getUserDetailsForAdmin,
  updateUserRole,
  deleteUser,
};
