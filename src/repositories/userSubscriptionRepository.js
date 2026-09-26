const UserSubscription = require("../models/UserSubscription");

// Create User Subscription
const createUserSubscription = async (data) => {
  return await UserSubscription.create(data);
};

// Get Active Subscription for a User
const getActiveSubscriptionByUser = async (userId) => {
  return await UserSubscription.findOne({
    user: userId,
    status: "active",
    endDate: { $gt: new Date() },
  }).populate("plan");
};

// Get All Subscriptions for a User
const getAllSubscriptionsByUser = async (userId) => {
  return await UserSubscription.find({ user: userId })
    .populate("plan")
    .sort({ createdAt: -1 });
};

// Get Subscription By ID
const getSubscriptionById = async (id) => {
  return await UserSubscription.findById(id).populate("user", "fullName email").populate("plan");
};

// Get All Student Subscriptions (Admin)
const getAllStudentSubscriptions = async (filter = {}) => {
  return await UserSubscription.find(filter)
    .populate("user", "fullName email phone")
    .populate("plan")
    .sort({ createdAt: -1 });
};

// Update Subscription Status
const updateSubscriptionStatus = async (id, status, extraFields = {}) => {
  return await UserSubscription.findByIdAndUpdate(
    id,
    { status, ...extraFields },
    { new: true }
  ).populate("plan");
};

// Extend Subscription
const extendSubscription = async (id, newEndDate) => {
  return await UserSubscription.findByIdAndUpdate(
    id,
    { endDate: newEndDate, status: "active" },
    { new: true }
  ).populate("plan");
};

module.exports = {
  createUserSubscription,
  getActiveSubscriptionByUser,
  getAllSubscriptionsByUser,
  getSubscriptionById,
  getAllStudentSubscriptions,
  updateSubscriptionStatus,
  extendSubscription,
};
