const { body } = require("express-validator");

const createOrderValidator = [
  body("planId")
    .isMongoId()
    .withMessage("Valid subscription plan ID is required"),

  body("gateway")
    .optional()
    .isIn(["stripe", "razorpay", "paypal", "mock"])
    .withMessage("Gateway must be stripe, razorpay, paypal, or mock"),
];

const verifyPaymentValidator = [
  body("orderId")
    .trim()
    .notEmpty()
    .withMessage("orderId is required"),

  body("paymentId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("paymentId cannot be empty if provided"),

  body("signature")
    .optional()
    .isString(),
];

module.exports = {
  createOrderValidator,
  verifyPaymentValidator,
};
