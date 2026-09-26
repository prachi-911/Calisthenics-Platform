const Payment = require("../models/Payment");

// Create Payment
const createPayment = async (paymentData) => {
  return await Payment.create(paymentData);
};

// Get Payment By ID
const getPaymentById = async (id) => {
  return await Payment.findById(id).populate("user", "fullName email").populate("plan");
};

// Get Payment By Order ID
const getPaymentByOrderId = async (orderId) => {
  return await Payment.findOne({ orderId }).populate("user", "fullName email").populate("plan");
};

// Update Payment
const updatePayment = async (orderId, updateData) => {
  return await Payment.findOneAndUpdate({ orderId }, updateData, {
    new: true,
  }).populate("plan");
};

// Get Payments By User
const getPaymentsByUser = async (userId) => {
  return await Payment.find({ user: userId })
    .populate("plan", "name price duration")
    .sort({ createdAt: -1 });
};

// Get All Payments (Admin)
const getAllPayments = async (filter = {}) => {
  return await Payment.find(filter)
    .populate("user", "fullName email")
    .populate("plan", "name price")
    .sort({ createdAt: -1 });
};

// Get Payment Statistics
const getPaymentStats = async () => {
  const stats = await Payment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  let totalRevenue = 0;
  let successfulPayments = 0;
  let pendingPayments = 0;
  let failedPayments = 0;

  stats.forEach((item) => {
    if (item._id === "completed") {
      totalRevenue = item.totalAmount;
      successfulPayments = item.count;
    } else if (item._id === "pending") {
      pendingPayments = item.count;
    } else if (item._id === "failed") {
      failedPayments = item.count;
    }
  });

  return {
    totalRevenue,
    successfulPayments,
    pendingPayments,
    failedPayments,
  };
};

module.exports = {
  createPayment,
  getPaymentById,
  getPaymentByOrderId,
  updatePayment,
  getPaymentsByUser,
  getAllPayments,
  getPaymentStats,
};
