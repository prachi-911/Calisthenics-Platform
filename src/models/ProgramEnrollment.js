const mongoose = require("mongoose");

const completedWorkoutSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
  },
  dayNumber: {
    type: Number,
    required: true,
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const programEnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    currentWeek: {
      type: Number,
      default: 1,
    },

    currentDay: {
      type: Number,
      default: 1,
    },

    completedWorkouts: [completedWorkoutSchema],

    status: {
      type: String,
      enum: ["in-progress", "completed", "paused"],
      default: "in-progress",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One enrollment per user per program
programEnrollmentSchema.index({ user: 1, program: 1 }, { unique: true });

module.exports = mongoose.model("ProgramEnrollment", programEnrollmentSchema);
