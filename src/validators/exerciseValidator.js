const { body } = require("express-validator");

const createExerciseValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Exercise name is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .isIn([
      "Push",
      "Pull",
      "Core",
      "Legs",
      "Full Body",
      "Skills",
      "Mobility",
    ])
    .withMessage("Invalid category. Must be Push, Pull, Core, Legs, Full Body, Skills, or Mobility"),

  body("difficulty")
    .isIn(["Beginner", "Intermediate", "Advanced", "Elite"])
    .withMessage("Invalid difficulty. Must be Beginner, Intermediate, Advanced, or Elite"),

  body("targetMuscles")
    .isArray({ min: 1 })
    .withMessage("Target muscles must be a non-empty array"),

  body("secondaryMuscles")
    .optional()
    .isArray()
    .withMessage("Secondary muscles must be an array"),

  body("equipment")
    .optional()
    .isArray()
    .withMessage("Equipment must be an array"),

  body("mechanics")
    .optional()
    .isIn(["Compound", "Isolation"])
    .withMessage("Mechanics must be Compound or Isolation"),

  body("instructions")
    .optional()
    .isArray()
    .withMessage("Instructions must be an array of steps"),

  body("tips")
    .optional()
    .isArray()
    .withMessage("Tips must be an array"),

  body("progressionLevel")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Progression level must be at least 1"),

  body("prerequisites")
    .optional()
    .isArray()
    .withMessage("Prerequisites must be an array of exercise IDs"),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be a boolean"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const updateExerciseValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Exercise name cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("category")
    .optional()
    .isIn([
      "Push",
      "Pull",
      "Core",
      "Legs",
      "Full Body",
      "Skills",
      "Mobility",
    ])
    .withMessage("Invalid category"),

  body("difficulty")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced", "Elite"])
    .withMessage("Invalid difficulty"),

  body("targetMuscles")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Target muscles must be a non-empty array"),

  body("secondaryMuscles")
    .optional()
    .isArray()
    .withMessage("Secondary muscles must be an array"),

  body("equipment")
    .optional()
    .isArray()
    .withMessage("Equipment must be an array"),

  body("mechanics")
    .optional()
    .isIn(["Compound", "Isolation"])
    .withMessage("Mechanics must be Compound or Isolation"),

  body("instructions")
    .optional()
    .isArray()
    .withMessage("Instructions must be an array"),

  body("tips")
    .optional()
    .isArray()
    .withMessage("Tips must be an array"),

  body("progressionLevel")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Progression level must be at least 1"),

  body("prerequisites")
    .optional()
    .isArray()
    .withMessage("Prerequisites must be an array"),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be a boolean"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

module.exports = {
  exerciseValidator: createExerciseValidator,
  createExerciseValidator,
  updateExerciseValidator,
};
