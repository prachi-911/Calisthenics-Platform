const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    workoutName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Full Body",
        "Upper Body",
        "Lower Body",
        "Core",
        "Mobility",
        "Skills",
      ],
      required: true,
    },

    difficulty: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      required: true,
    },

    targetMuscle: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    caloriesBurned: {
      type: Number,
      default: 0,
    },

    equipment: {
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

video: {
  url: {
    type: String,
    default: "",
  },
  publicId: {
    type: String,
    default: "",
  },
},
    isPremium: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workout", workoutSchema);