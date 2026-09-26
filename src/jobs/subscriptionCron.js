const cron = require("node-cron");
const UserSubscription = require("../models/UserSubscription");
const User = require("../models/User");

// Core logic to check and expire overdue subscriptions
const runSubscriptionExpiryCheck = async () => {
  try {
    const now = new Date();
    // Find active subscriptions that have passed their end date
    const expiredSubscriptions = await UserSubscription.find({
      status: "active",
      endDate: { $lt: now },
    });

    if (expiredSubscriptions.length === 0) {
      console.log("⏰ [Cron] No expired subscriptions found.");
      return { expiredCount: 0 };
    }

    console.log(`⏰ [Cron] Found ${expiredSubscriptions.length} subscriptions to expire.`);

    for (const sub of expiredSubscriptions) {
      sub.status = "expired";
      await sub.save();

      // Check if user has any other active subscriptions
      const hasOtherActive = await UserSubscription.findOne({
        user: sub.user,
        status: "active",
        endDate: { $gt: now },
      });

      if (!hasOtherActive) {
        await User.findByIdAndUpdate(sub.user, { subscription: null });
      }
    }

    console.log(`✅ [Cron] Successfully updated ${expiredSubscriptions.length} expired subscriptions.`);
    return { expiredCount: expiredSubscriptions.length };
  } catch (error) {
    console.error("❌ [Cron Error] Subscription expiry job failed:", error.message);
    throw error;
  }
};

// Schedule: Daily at midnight (00:00)
const initSubscriptionCron = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ [Cron] Running daily subscription expiry check...");
    await runSubscriptionExpiryCheck();
  });
  console.log("📅 Subscription expiry cron job registered (daily at 00:00).");
};

module.exports = {
  runSubscriptionExpiryCheck,
  initSubscriptionCron,
};
