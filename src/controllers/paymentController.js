const {
  createPaymentOrderService,
  verifyPaymentService,
  getMyPaymentHistoryService,
  getAllPaymentsAdminService,
  getPaymentStatsAdminService,
} = require("../services/paymentService");

// Create Payment Order
const createOrder = async (req, res) => {
  try {
    const { planId, gateway } = req.body;
    const result = await createPaymentOrderService(req.user._id, planId, gateway);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const result = await verifyPaymentService(req.user._id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Payment History
const getMyPayments = async (req, res) => {
  try {
    const result = await getMyPaymentHistoryService(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Get All Payments
const getAllPayments = async (req, res) => {
  try {
    const result = await getAllPaymentsAdminService(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Get Payment Stats
const getPaymentStats = async (req, res) => {
  try {
    const result = await getPaymentStatsAdminService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyPayments,
  getAllPayments,
  getPaymentStats,
};
