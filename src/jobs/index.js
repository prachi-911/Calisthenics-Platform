const { initSubscriptionCron } = require("./subscriptionCron");
const { initPaymentCron } = require("./paymentCron");

const initCronJobs = () => {
  if (process.env.NODE_ENV === "test") {
    return; // Don't run background cron during tests
  }

  console.log("⏱️  Initializing automated background cron jobs...");
  initSubscriptionCron();
  initPaymentCron();
};

module.exports = {
  initCronJobs,
};
