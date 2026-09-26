const cron = require("node-cron");
const Payment = require("../models/Payment");

// Clean up pending payments older than 24 hours
const runStalePaymentsCleanup = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await Payment.updateMany(
      {
        status: "pending",
        createdAt: { $lt: oneDayAgo },
      },
      {
        $set: {
          status: "failed",
          failureReason: "Payment session expired after 24 hours of inactivity",
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`⏰ [Cron] Expired ${result.modifiedCount} stale pending payments.`);
    }

    return { cleanedCount: result.modifiedCount };
  } catch (error) {
    console.error("❌ [Cron Error] Stale payments cleanup job failed:", error.message);
    throw error;
  }
};

// Schedule: Every 6 hours
const initPaymentCron = () => {
  cron.schedule("0 */6 * * *", async () => {
    console.log("⏰ [Cron] Running stale payments cleanup...");
    await runStalePaymentsCleanup();
  });
  console.log("📅 Stale payments cleanup cron job registered (every 6 hours).");
};

module.exports = {
  runStalePaymentsCleanup,
  initPaymentCron,
};
