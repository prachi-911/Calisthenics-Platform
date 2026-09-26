const { body } = require("express-validator");

const subscribePlanValidator = [
  body("planId")
    .isMongoId()
    .withMessage("Valid subscription plan ID is required"),

  body("autoRenew")
    .optional()
    .isBoolean()
    .withMessage("autoRenew must be a boolean"),

  body("paymentId")
    .optional()
    .isString(),

  body("amountPaid")
    .optional()
    .isNumeric()
    .withMessage("amountPaid must be a number"),

  body("currency")
    .optional()
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("currency must be a 3-letter code (e.g. USD, INR)"),
];

const extendSubscriptionValidator = [
  body("days")
    .isInt({ min: 1 })
    .withMessage("days must be an integer of at least 1"),
];

module.exports = {
  subscribePlanValidator,
  extendSubscriptionValidator,
};
