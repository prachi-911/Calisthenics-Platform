const {
  subscribeToPlanService,
  getMyActiveSubscriptionService,
  getMySubscriptionHistoryService,
  cancelMySubscriptionService,
  getAllStudentSubscriptionsService,
  extendStudentSubscriptionService,
  cancelStudentSubscriptionAdminService,
} = require("../services/userSubscriptionService");

// Subscribe to Plan
const subscribeToPlan = async (req, res) => {
  try {
    const { planId, autoRenew, paymentId, amountPaid, currency } = req.body;
    const result = await subscribeToPlanService(req.user._id, planId, {
      autoRenew,
      paymentId,
      amountPaid,
      currency,
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Active Subscription
const getMyActiveSubscription = async (req, res) => {
  try {
    const result = await getMyActiveSubscriptionService(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Subscription History
const getMySubscriptionHistory = async (req, res) => {
  try {
    const result = await getMySubscriptionHistoryService(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel My Subscription
const cancelMySubscription = async (req, res) => {
  try {
    const result = await cancelMySubscriptionService(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Get All Student Subscriptions
const getAllStudentSubscriptions = async (req, res) => {
  try {
    const result = await getAllStudentSubscriptionsService(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Extend Student Subscription
const extendStudentSubscription = async (req, res) => {
  try {
    const { days } = req.body;
    const result = await extendStudentSubscriptionService(req.params.id, days);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Cancel Student Subscription
const cancelStudentSubscriptionAdmin = async (req, res) => {
  try {
    const result = await cancelStudentSubscriptionAdminService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  subscribeToPlan,
  getMyActiveSubscription,
  getMySubscriptionHistory,
  cancelMySubscription,
  getAllStudentSubscriptions,
  extendStudentSubscription,
  cancelStudentSubscriptionAdmin,
};
