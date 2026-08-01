const Subscription = require("../models/subscriptionModel");

// Create Subscription
const createSubscription = async (subscriptionData) => {
  return await Subscription.create(subscriptionData);
};

// Get All Subscriptions
const getAllSubscriptions = async () => {
  return await Subscription.find();
};

// Get Subscription By ID
const getSubscriptionById = async (subscriptionId) => {
  return await Subscription.findById(subscriptionId);
};

// Get Subscription By Name
const getSubscriptionByName = async (name) => {
  return await Subscription.findOne({ name });
};

// Update Subscription
const updateSubscription = async (subscriptionId, updateData) => {
  return await Subscription.findByIdAndUpdate(
    subscriptionId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete Subscription
const deleteSubscription = async (subscriptionId) => {
  return await Subscription.findByIdAndDelete(subscriptionId);
};

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  getSubscriptionByName,
  updateSubscription,
  deleteSubscription,
};