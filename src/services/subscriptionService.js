const {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  getSubscriptionByName,
  updateSubscription,
  deleteSubscription,
} = require("../repositories/subscriptionRepository");

// Create Subscription Plan
const createSubscriptionPlan = async (subscriptionData) => {
  const { name } = subscriptionData;

  // Check if plan already exists
  const existingPlan = await getSubscriptionByName(name);

  if (existingPlan) {
    throw new Error("Subscription plan already exists");
  }

  const newPlan = await createSubscription(subscriptionData);

  return {
    success: true,
    message: "Subscription plan created successfully 🎉",
    data: newPlan,
  };
};

// Get All Subscription Plans
const getAllSubscriptionPlans = async () => {
  const plans = await getAllSubscriptions();

  return {
    success: true,
    message: "Subscription plans fetched successfully",
    data: plans,
  };
};

// Get Single Subscription Plan
const getSubscriptionPlanById = async (subscriptionId) => {
  const plan = await getSubscriptionById(subscriptionId);

  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  return {
    success: true,
    message: "Subscription plan fetched successfully",
    data: plan,
  };
};

// Update Subscription Plan
const updateSubscriptionPlan = async (
  subscriptionId,
  updateData
) => {
  const updatedPlan = await updateSubscription(
    subscriptionId,
    updateData
  );

  if (!updatedPlan) {
    throw new Error("Subscription plan not found");
  }

  return {
    success: true,
    message: "Subscription plan updated successfully 🎉",
    data: updatedPlan,
  };
};

// Delete Subscription Plan
const deleteSubscriptionPlan = async (subscriptionId) => {
  const deletedPlan = await deleteSubscription(subscriptionId);

  if (!deletedPlan) {
    throw new Error("Subscription plan not found");
  }

  return {
    success: true,
    message: "Subscription plan deleted successfully 🗑️",
  };
};

module.exports = {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
};