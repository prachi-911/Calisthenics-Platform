const { body } = require("express-validator");

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

const registerValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please enter a valid phone number."),
];
const updateProfileValidator = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters."),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender."),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date of birth."),

  body("fitness.height")
    .optional()
    .isNumeric()
    .withMessage("Height must be a number."),

  body("fitness.weight")
    .optional()
    .isNumeric()
    .withMessage("Weight must be a number."),

  body("fitness.goal")
    .optional()
    .isIn([
      "weight_loss",
      "muscle_gain",
      "strength",
      "endurance",
      "flexibility",
      "general_fitness",
    ])
    .withMessage("Invalid fitness goal."),

  body("fitness.level")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Invalid fitness level."),
];

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long."),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
};