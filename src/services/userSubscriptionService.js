const {
  createUserSubscription,
  getActiveSubscriptionByUser,
  getAllSubscriptionsByUser,
  getSubscriptionById,
  getAllStudentSubscriptions,
  updateSubscriptionStatus,
  extendSubscription,
} = require("../repositories/userSubscriptionRepository");

const { getSubscriptionById: getPlanById } = require("../repositories/subscriptionRepository");
const User = require("../models/User");

// Subscribe to a Plan
const subscribeToPlanService = async (userId, planId, paymentDetails = {}) => {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  if (!plan.isActive) {
    throw new Error("This subscription plan is currently not available");
  }

  // Check if user already has an active subscription
  const currentActive = await getActiveSubscriptionByUser(userId);

  let startDate = new Date();
  // If user has an active subscription, new subscription starts after the current one expires
  if (currentActive) {
    startDate = new Date(currentActive.endDate);
  }

  // Calculate endDate: plan.duration is days
  const durationInDays = plan.duration || 30;
  const endDate = new Date(startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000);

  const subscription = await createUserSubscription({
    user: userId,
    plan: planId,
    startDate,
    endDate,
    status: "active",
    autoRenew: paymentDetails.autoRenew !== undefined ? paymentDetails.autoRenew : true,
    paymentId: paymentDetails.paymentId || null,
    amountPaid: paymentDetails.amountPaid !== undefined ? paymentDetails.amountPaid : plan.price,
    currency: paymentDetails.currency || "USD",
  });

  // Update user model's subscription reference
  await User.findByIdAndUpdate(userId, { subscription: plan._id });

  return {
    success: true,
    message: "Subscribed to plan successfully 🎉",
    data: subscription,
  };
};

// Get Current User's Active Subscription
const getMyActiveSubscriptionService = async (userId) => {
  const activeSubscription = await getActiveSubscriptionByUser(userId);

  if (!activeSubscription) {
    return {
      success: true,
      message: "No active subscription found",
      data: null,
      hasActiveSubscription: false,
    };
  }

  return {
    success: true,
    message: "Active subscription fetched successfully",
    hasActiveSubscription: true,
    data: activeSubscription,
  };
};

// Get User's Subscription History
const getMySubscriptionHistoryService = async (userId) => {
  const history = await getAllSubscriptionsByUser(userId);

  return {
    success: true,
    message: "Subscription history fetched successfully",
    count: history.length,
    data: history,
  };
};

// Cancel Auto-Renew / Subscription
const cancelMySubscriptionService = async (userId) => {
  const activeSubscription = await getActiveSubscriptionByUser(userId);

  if (!activeSubscription) {
    throw new Error("No active subscription to cancel");
  }

  const updated = await updateSubscriptionStatus(activeSubscription._id, "cancelled", {
    autoRenew: false,
    cancelledAt: new Date(),
  });

  return {
    success: true,
    message: "Subscription cancelled successfully. You will have access until your billing cycle ends.",
    data: updated,
  };
};

// Admin: Get All Student Subscriptions
const getAllStudentSubscriptionsService = async (query = {}) => {
  const filter = {};
  if (query.status) {
    filter.status = query.status;
  }

  const subscriptions = await getAllStudentSubscriptions(filter);

  return {
    success: true,
    message: "Student subscriptions fetched successfully",
    count: subscriptions.length,
    data: subscriptions,
  };
};

// Admin: Extend Student Subscription
const extendStudentSubscriptionService = async (subscriptionId, extraDays) => {
  const subscription = await getSubscriptionById(subscriptionId);

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const currentEnd = new Date(subscription.endDate) > new Date()
    ? new Date(subscription.endDate)
    : new Date();

  const newEndDate = new Date(currentEnd.getTime() + Number(extraDays) * 24 * 60 * 60 * 1000);
  const updated = await extendSubscription(subscriptionId, newEndDate);

  return {
    success: true,
    message: `Subscription extended by ${extraDays} days 🎉`,
    data: updated,
  };
};

// Admin: Revoke / Cancel Subscription
const cancelStudentSubscriptionAdminService = async (subscriptionId) => {
  const subscription = await getSubscriptionById(subscriptionId);

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const updated = await updateSubscriptionStatus(subscriptionId, "cancelled", {
    autoRenew: false,
    cancelledAt: new Date(),
  });

  return {
    success: true,
    message: "Subscription cancelled by admin",
    data: updated,
  };
};

module.exports = {
  subscribeToPlanService,
  getMyActiveSubscriptionService,
  getMySubscriptionHistoryService,
  cancelMySubscriptionService,
  getAllStudentSubscriptionsService,
  extendStudentSubscriptionService,
  cancelStudentSubscriptionAdminService,
};
