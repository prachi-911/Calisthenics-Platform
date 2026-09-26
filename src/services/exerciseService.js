const fs = require("fs");
const {
  createExercise,
  getAllExercises,
  getExerciseById,
  getExerciseByName,
  updateExercise,
  updateExerciseThumbnail,
  updateExerciseVideo,
  deleteExercise,
} = require("../repositories/exerciseRepository");

const {
  uploadImage,
  uploadVideo,
  deleteFile,
} = require("../utils/cloudinary");
const Exercise = require("../models/Exercise");
const APIFeatures = require("../utils/apiFeatures");

// Create Exercise
const createExerciseService = async (exerciseData) => {
  const existingExercise = await getExerciseByName(exerciseData.name);

  if (existingExercise) {
    throw new Error("Exercise with this name already exists");
  }

  const exercise = await createExercise(exerciseData);

  return {
    success: true,
    message: "Exercise created successfully 🎉",
    data: exercise,
  };
};

// Get All Exercises
const getAllExercisesService = async (queryString = {}) => {
  const features = new APIFeatures(
    Exercise.find().populate("prerequisites", "name category difficulty"),
    queryString
  )
    .filter(["name", "description", "targetMuscles", "category"])
    .sort("progressionLevel")
    .limitFields();

  await features.paginate();
  const exercises = await features.query;

  return {
    success: true,
    message: "Exercises fetched successfully",
    pagination: features.paginationMeta,
    count: exercises.length,
    data: exercises,
  };
};

// Get Exercise By ID
const getExerciseByIdService = async (exerciseId) => {
  const exercise = await getExerciseById(exerciseId);

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  return {
    success: true,
    message: "Exercise fetched successfully",
    data: exercise,
  };
};

// Update Exercise
const updateExerciseService = async (exerciseId, updateData) => {
  if (updateData.name) {
    const existing = await getExerciseByName(updateData.name);
    if (existing && existing._id.toString() !== exerciseId) {
      throw new Error("Another exercise with this name already exists");
    }
  }

  const exercise = await updateExercise(exerciseId, updateData);

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  return {
    success: true,
    message: "Exercise updated successfully 🎉",
    data: exercise,
  };
};

// Upload Exercise Thumbnail
const uploadExerciseThumbnailService = async (exerciseId, file) => {
  try {
    const exercise = await getExerciseById(exerciseId);

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    if (exercise.thumbnail?.publicId) {
      await deleteFile(exercise.thumbnail.publicId, "image");
    }

    const result = await uploadImage(
      file.path,
      "calisthenics-exercise-thumbnails"
    );

    const updatedExercise = await updateExerciseThumbnail(exerciseId, {
      url: result.secure_url,
      publicId: result.public_id,
    });

    return {
      success: true,
      message: "Exercise thumbnail uploaded successfully 🎉",
      data: updatedExercise,
    };
  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Failed to delete temp thumbnail file:", err);
      }
    }
  }
};

// Upload Exercise Video
const uploadExerciseVideoService = async (exerciseId, file) => {
  try {
    const exercise = await getExerciseById(exerciseId);

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    if (exercise.video?.publicId) {
      await deleteFile(exercise.video.publicId, "video");
    }

    const result = await uploadVideo(
      file.path,
      "calisthenics-exercise-videos"
    );

    const updatedExercise = await updateExerciseVideo(exerciseId, {
      url: result.secure_url,
      publicId: result.public_id,
    });

    return {
      success: true,
      message: "Exercise video uploaded successfully 🎉",
      data: updatedExercise,
    };
  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Failed to delete temp video file:", err);
      }
    }
  }
};

// Delete Exercise
const deleteExerciseService = async (exerciseId) => {
  const exercise = await getExerciseById(exerciseId);

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  if (exercise.thumbnail?.publicId) {
    await deleteFile(exercise.thumbnail.publicId, "image");
  }
  if (exercise.video?.publicId) {
    await deleteFile(exercise.video.publicId, "video");
  }

  await deleteExercise(exerciseId);

  return {
    success: true,
    message: "Exercise deleted successfully 🗑️",
  };
};

module.exports = {
  createExerciseService,
  getAllExercisesService,
  getExerciseByIdService,
  updateExerciseService,
  uploadExerciseThumbnailService,
  uploadExerciseVideoService,
  deleteExerciseService,
};
