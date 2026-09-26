const mongoose = require("mongoose");

const userSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "active",
      index: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    autoRenew: {
      type: Boolean,
      default: true,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    paymentId: {
      type: String,
      default: null,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "USD",
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if subscription is currently valid
userSubscriptionSchema.methods.isValid = function () {
  return this.status === "active" && new Date(this.endDate) > new Date();
};

module.exports = mongoose.model("UserSubscription", userSubscriptionSchema);
