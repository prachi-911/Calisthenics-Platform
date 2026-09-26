const crypto = require("crypto");
const {
  createPayment,
  getPaymentById,
  getPaymentByOrderId,
  updatePayment,
  getPaymentsByUser,
  getAllPayments,
  getPaymentStats,
} = require("../repositories/paymentRepository");

const { getSubscriptionById: getPlanById } = require("../repositories/subscriptionRepository");
const { subscribeToPlanService } = require("./userSubscriptionService");

// Create Payment Order
const createPaymentOrderService = async (userId, planId, gateway = "stripe") => {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  if (!plan.isActive) {
    throw new Error("This subscription plan is not currently active");
  }

  // Generate unique order ID
  const orderId = `ORD_${Date.now()}_${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  const payment = await createPayment({
    user: userId,
    plan: planId,
    amount: plan.price,
    currency: "USD",
    gateway,
    orderId,
    status: "pending",
  });

  return {
    success: true,
    message: "Payment order initiated successfully",
    data: {
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      planName: plan.name,
      durationDays: plan.duration,
      gateway: payment.gateway,
      paymentId: payment._id,
    },
  };
};

// Verify Payment and Activate Subscription
const verifyPaymentService = async (userId, paymentData) => {
  const { orderId, paymentId, signature } = paymentData;

  const payment = await getPaymentByOrderId(orderId);
  if (!payment) {
    throw new Error("Payment order not found");
  }

  if (payment.user._id.toString() !== userId.toString()) {
    throw new Error("Unauthorized to verify this payment");
  }

  if (payment.status === "completed") {
    return {
      success: true,
      message: "Payment already verified and completed",
      data: payment,
    };
  }

  // Verify payment (mock/gateway verification)
  const simulatedPaymentId = paymentId || `PAY_${Date.now()}_${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  // Update payment record to completed
  const updatedPayment = await updatePayment(orderId, {
    status: "completed",
    paymentId: simulatedPaymentId,
    signature: signature || null,
    paidAt: new Date(),
  });

  // Automatically activate student subscription!
  const subscriptionResult = await subscribeToPlanService(
    userId,
    payment.plan._id,
    {
      paymentId: updatedPayment.paymentId,
      amountPaid: updatedPayment.amount,
      currency: updatedPayment.currency,
    }
  );

  return {
    success: true,
    message: "Payment verified successfully and subscription activated 🎉",
    payment: updatedPayment,
    subscription: subscriptionResult.data,
  };
};

// Get User's Payment History
const getMyPaymentHistoryService = async (userId) => {
  const payments = await getPaymentsByUser(userId);

  return {
    success: true,
    message: "Payment history fetched successfully",
    count: payments.length,
    data: payments,
  };
};

// Admin: Get All Payments
const getAllPaymentsAdminService = async (query = {}) => {
  const filter = {};
  if (query.status) {
    filter.status = query.status;
  }
  if (query.gateway) {
    filter.gateway = query.gateway;
  }

  const payments = await getAllPayments(filter);

  return {
    success: true,
    message: "All payments fetched successfully",
    count: payments.length,
    data: payments,
  };
};

// Admin: Get Payment Stats
const getPaymentStatsAdminService = async () => {
  const stats = await getPaymentStats();

  return {
    success: true,
    message: "Payment statistics fetched successfully",
    data: stats,
  };
};

module.exports = {
  createPaymentOrderService,
  verifyPaymentService,
  getMyPaymentHistoryService,
  getAllPaymentsAdminService,
  getPaymentStatsAdminService,
};
