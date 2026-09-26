const mongoose = require("mongoose");

const dayScheduleSchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 7,
  },
  dayName: {
    type: String,
    default: "",
    trim: true,
  },
  isRestDay: {
    type: Boolean,
    default: false,
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
    default: null,
  },
  instructions: {
    type: String,
    default: "",
  },
});

const weekScheduleSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  title: {
    type: String,
    default: "",
    trim: true,
  },
  days: [dayScheduleSchema],
});

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Program title is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Program description is required"],
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      required: [true, "Level is required"],
    },

    category: {
      type: String,
      enum: [
        "Strength",
        "Hypertrophy",
        "Skills",
        "Fat Loss",
        "Mobility",
        "Calisthenics Fundamentals",
      ],
      required: [true, "Category is required"],
    },

    durationWeeks: {
      type: Number,
      required: [true, "Duration in weeks is required"],
      min: 1,
    },

    workoutsPerWeek: {
      type: Number,
      required: [true, "Workouts per week is required"],
      min: 1,
      max: 7,
    },

    tags: {
      type: [String],
      default: [],
    },

    thumbnail: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    schedule: [weekScheduleSchema],

    isPremium: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    enrolledCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Database Indexes for Performance Optimization
programSchema.index({ level: 1, category: 1 });
programSchema.index({ isPremium: 1, isPublished: 1 });
programSchema.index({ enrolledCount: -1 });
programSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Program", programSchema);
