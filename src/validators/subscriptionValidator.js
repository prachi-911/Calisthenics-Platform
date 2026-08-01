const { body } = require("express-validator");

// Create / Update Subscription Validator
const subscriptionValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subscription name is required"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 day"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

module.exports = {
  subscriptionValidator,
};