const UserSubscription = require("../models/UserSubscription");

const requireSubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Admins bypass subscription check
    if (req.user.role === "admin") {
      return next();
    }

    const activeSubscription = await UserSubscription.findOne({
      user: req.user._id,
      status: "active",
      endDate: { $gt: new Date() },
    }).populate("plan");

    if (!activeSubscription) {
      return res.status(403).json({
        success: false,
        message: "Active subscription required to access this premium feature",
        requiresSubscription: true,
      });
    }

    req.subscription = activeSubscription;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Subscription verification error",
      error: error.message,
    });
  }
};

module.exports = requireSubscription;
