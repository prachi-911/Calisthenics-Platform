const { body } = require("express-validator");

const createProgramValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Program title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("level")
    .isIn(["Beginner", "Intermediate", "Advanced", "All Levels"])
    .withMessage("Level must be Beginner, Intermediate, Advanced, or All Levels"),

  body("category")
    .isIn([
      "Strength",
      "Hypertrophy",
      "Skills",
      "Fat Loss",
      "Mobility",
      "Calisthenics Fundamentals",
    ])
    .withMessage("Invalid program category"),

  body("durationWeeks")
    .isInt({ min: 1 })
    .withMessage("Duration in weeks must be at least 1"),

  body("workoutsPerWeek")
    .isInt({ min: 1, max: 7 })
    .withMessage("Workouts per week must be between 1 and 7"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be a boolean"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean"),

  body("schedule")
    .optional()
    .isArray()
    .withMessage("Schedule must be an array of weeks"),
];

const updateProgramValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Program title cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("level")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced", "All Levels"])
    .withMessage("Invalid level"),

  body("category")
    .optional()
    .isIn([
      "Strength",
      "Hypertrophy",
      "Skills",
      "Fat Loss",
      "Mobility",
      "Calisthenics Fundamentals",
    ])
    .withMessage("Invalid program category"),

  body("durationWeeks")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration in weeks must be at least 1"),

  body("workoutsPerWeek")
    .optional()
    .isInt({ min: 1, max: 7 })
    .withMessage("Workouts per week must be between 1 and 7"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be a boolean"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean"),

  body("schedule")
    .optional()
    .isArray()
    .withMessage("Schedule must be an array of weeks"),
];

const completeStepValidator = [
  body("weekNumber")
    .isInt({ min: 1 })
    .withMessage("weekNumber is required and must be at least 1"),

  body("dayNumber")
    .isInt({ min: 1, max: 7 })
    .withMessage("dayNumber is required and must be between 1 and 7"),

  body("workoutId")
    .optional()
    .isMongoId()
    .withMessage("workoutId must be a valid ID"),
];

module.exports = {
  createProgramValidator,
  updateProgramValidator,
  completeStepValidator,
};
