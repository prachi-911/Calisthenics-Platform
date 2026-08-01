const {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} = require("../services/subscriptionService");

// Create Subscription Plan
const createSubscription = async (req, res) => {
  try {
    const result = await createSubscriptionPlan(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error("CREATE SUBSCRIPTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Subscription Plans
const getSubscriptions = async (req, res) => {
  try {
    const result = await getAllSubscriptionPlans();

    res.status(200).json(result);
  } catch (error) {
    console.error("GET SUBSCRIPTIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Subscription By ID
const getSubscription = async (req, res) => {
  try {
    const result = await getSubscriptionPlanById(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    console.error("GET SUBSCRIPTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Subscription
const updateSubscription = async (req, res) => {
  try {
    const result = await updateSubscriptionPlan(
      req.params.id,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("UPDATE SUBSCRIPTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Subscription
const deleteSubscription = async (req, res) => {
  try {
    const result = await deleteSubscriptionPlan(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    console.error("DELETE SUBSCRIPTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
};