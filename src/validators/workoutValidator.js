const { body } = require("express-validator");

const workoutValidator = [
  body("workoutName")
    .trim()
    .notEmpty()
    .withMessage("Workout name is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .isIn([
      "Full Body",
      "Upper Body",
      "Lower Body",
      "Core",
      "Mobility",
      "Skills",
    ])
    .withMessage("Invalid category"),

  body("difficulty")
    .isIn([
      "Beginner",
      "Intermediate",
      "Advanced",
    ])
    .withMessage("Invalid difficulty"),

  body("targetMuscle")
    .trim()
    .notEmpty()
    .withMessage("Target muscle is required"),

  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be greater than 0"),

  body("caloriesBurned")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Calories burned must be 0 or more"),

  body("equipment")
    .optional()
    .isArray()
    .withMessage("Equipment must be an array"),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be true or false"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

const updateWorkoutValidator = [
  body("workoutName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Workout name cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("category")
    .optional()
    .isIn([
      "Full Body",
      "Upper Body",
      "Lower Body",
      "Core",
      "Mobility",
      "Skills",
    ])
    .withMessage("Invalid category"),

  body("difficulty")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Invalid difficulty"),

  body("targetMuscle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Target muscle cannot be empty"),

  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be greater than 0"),

  body("caloriesBurned")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Calories burned must be 0 or more"),

  body("equipment")
    .optional()
    .isArray()
    .withMessage("Equipment must be an array"),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be true or false"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

const addExerciseToWorkoutValidator = [
  body("exerciseId")
    .isMongoId()
    .withMessage("Valid exercise ID is required"),

  body("sets")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Sets must be an integer of at least 1"),

  body("reps")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reps must be 0 or more"),

  body("duration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Duration must be 0 or more seconds"),

  body("restTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Rest time must be 0 or more seconds"),

  body("order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Order must be at least 1"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
];

const updateWorkoutExerciseValidator = [
  body("sets")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Sets must be an integer of at least 1"),

  body("reps")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reps must be 0 or more"),

  body("duration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Duration must be 0 or more seconds"),

  body("restTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Rest time must be 0 or more seconds"),

  body("order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Order must be at least 1"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
];

const reorderExercisesValidator = [
  body("exercises")
    .isArray({ min: 1 })
    .withMessage("Exercises array is required"),
];

module.exports = {
  workoutValidator,
  createWorkoutValidator: workoutValidator,
  updateWorkoutValidator,
  addExerciseToWorkoutValidator,
  updateWorkoutExerciseValidator,
  reorderExercisesValidator,
};