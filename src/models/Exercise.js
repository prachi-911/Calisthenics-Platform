const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Exercise description is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Push",
        "Pull",
        "Core",
        "Legs",
        "Full Body",
        "Skills",
        "Mobility",
      ],
      required: [true, "Category is required"],
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Elite"],
      required: [true, "Difficulty is required"],
    },

    targetMuscles: {
      type: [String],
      required: [true, "At least one target muscle is required"],
    },

    secondaryMuscles: {
      type: [String],
      default: [],
    },

    equipment: {
      type: [String],
      default: ["Bodyweight"],
    },

    mechanics: {
      type: String,
      enum: ["Compound", "Isolation"],
      default: "Compound",
    },

    instructions: {
      type: [String],
      default: [],
    },

    tips: {
      type: [String],
      default: [],
    },

    progressionLevel: {
      type: Number,
      default: 1,
      min: 1,
    },

    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],

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

// Database Indexes for Performance Optimization
exerciseSchema.index({ category: 1, difficulty: 1 });
exerciseSchema.index({ progressionLevel: 1 });
exerciseSchema.index({ isPremium: 1, isActive: 1 });
exerciseSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Exercise", exerciseSchema);
