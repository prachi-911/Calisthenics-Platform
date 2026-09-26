const fs = require("fs");
const {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  getWorkoutByName,
  updateWorkout,
  updateWorkoutThumbnail,
  updateWorkoutVideo,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  updateWorkoutExercise,
  reorderWorkoutExercises,
  deleteWorkout,
} = require("../repositories/workoutRepository");
const { getExerciseById } = require("../repositories/exerciseRepository");

const {
  uploadImage,
  uploadVideo,
  deleteFile,
} = require("../utils/cloudinary");
const Workout = require("../models/Workout");
const APIFeatures = require("../utils/apiFeatures");

// Create Workout
const createWorkoutService = async (workoutData) => {
  const existingWorkout = await getWorkoutByName(workoutData.workoutName);

  if (existingWorkout) {
    throw new Error("Workout already exists");
  }

  const workout = await createWorkout(workoutData);

  return {
    success: true,
    message: "Workout created successfully 🎉",
    data: workout,
  };
};

// Get All Workouts
const getAllWorkoutsService = async (queryString = {}) => {
  const features = new APIFeatures(
    Workout.find().populate(
      "exercises.exercise",
      "name category difficulty targetMuscles thumbnail video"
    ),
    queryString
  )
    .filter(["workoutName", "description", "targetMuscle"])
    .sort("-createdAt")
    .limitFields();

  await features.paginate();
  const workouts = await features.query;

  return {
    success: true,
    message: "Workouts fetched successfully",
    pagination: features.paginationMeta,
    count: workouts.length,
    data: workouts,
  };
};

// Get Workout By ID
const getWorkoutByIdService = async (workoutId) => {
  const workout = await getWorkoutById(workoutId);

  if (!workout) {
    throw new Error("Workout not found");
  }

  return {
    success: true,
    message: "Workout fetched successfully",
    data: workout,
  };
};

// Update Workout
const updateWorkoutService = async (workoutId, updateData) => {
  const workout = await updateWorkout(workoutId, updateData);

  if (!workout) {
    throw new Error("Workout not found");
  }

  return {
    success: true,
    message: "Workout updated successfully 🎉",
    data: workout,
  };
};
// Upload Workout Thumbnail
const uploadWorkoutThumbnailService = async (workoutId, file) => {
  try {
    const workout = await getWorkoutById(workoutId);

    if (!workout) {
      throw new Error("Workout not found");
    }

    // Delete previous thumbnail if exists
    if (workout.thumbnail?.publicId) {
      await deleteFile(workout.thumbnail.publicId, "image");
    }

    // Upload new thumbnail
    const result = await uploadImage(
      file.path,
      "calisthenics-workout-thumbnails"
    );

    // Save in database
    const updatedWorkout = await updateWorkoutThumbnail(workoutId, {
      url: result.secure_url,
      publicId: result.public_id,
    });

    return {
      success: true,
      message: "Workout thumbnail uploaded successfully 🎉",
      data: updatedWorkout,
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

// Upload Workout Video
const uploadWorkoutVideoService = async (workoutId, file) => {
  try {
    const workout = await getWorkoutById(workoutId);

    if (!workout) {
      throw new Error("Workout not found");
    }

    // Delete old video from Cloudinary
    if (workout.video?.publicId) {
      await deleteFile(workout.video.publicId, "video");
    }

    // Upload new video
    const result = await uploadVideo(
      file.path,
      "calisthenics-workout-videos"
    );

    // Save video details in MongoDB
    const updatedWorkout = await updateWorkoutVideo(workoutId, {
      url: result.secure_url,
      publicId: result.public_id,
    });

    return {
      success: true,
      message: "Workout video uploaded successfully 🎉",
      data: updatedWorkout,
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

// Delete Workout
const deleteWorkoutService = async (workoutId) => {
  const workout = await getWorkoutById(workoutId);

  if (!workout) {
    throw new Error("Workout not found");
  }

  // Delete associated Cloudinary media
  if (workout.thumbnail?.publicId) {
    await deleteFile(workout.thumbnail.publicId, "image");
  }
  if (workout.video?.publicId) {
    await deleteFile(workout.video.publicId, "video");
  }

  await deleteWorkout(workoutId);

  return {
    success: true,
    message: "Workout deleted successfully 🗑️",
  };
};

// Add Exercise To Workout
const addExerciseToWorkoutService = async (workoutId, exerciseData) => {
  const workout = await getWorkoutById(workoutId);
  if (!workout) {
    throw new Error("Workout not found");
  }

  const exercise = await getExerciseById(exerciseData.exerciseId);
  if (!exercise) {
    throw new Error("Exercise not found");
  }

  // Determine order if not specified
  const order = exerciseData.order || (workout.exercises.length + 1);

  const exerciseItem = {
    exercise: exerciseData.exerciseId,
    sets: exerciseData.sets || 3,
    reps: exerciseData.reps || 0,
    duration: exerciseData.duration || 0,
    restTime: exerciseData.restTime || 60,
    order,
    notes: exerciseData.notes || "",
  };

  const updatedWorkout = await addExerciseToWorkout(workoutId, exerciseItem);

  return {
    success: true,
    message: "Exercise added to workout successfully 🎉",
    data: updatedWorkout,
  };
};

// Remove Exercise From Workout
const removeExerciseFromWorkoutService = async (workoutId, exerciseItemId) => {
  const workout = await getWorkoutById(workoutId);
  if (!workout) {
    throw new Error("Workout not found");
  }

  const updatedWorkout = await removeExerciseFromWorkout(workoutId, exerciseItemId);

  return {
    success: true,
    message: "Exercise removed from workout successfully 🗑️",
    data: updatedWorkout,
  };
};

// Update Workout Exercise
const updateWorkoutExerciseService = async (workoutId, exerciseItemId, updateData) => {
  const workout = await getWorkoutById(workoutId);
  if (!workout) {
    throw new Error("Workout not found");
  }

  const updatedWorkout = await updateWorkoutExercise(workoutId, exerciseItemId, updateData);
  if (!updatedWorkout) {
    throw new Error("Exercise item not found in this workout");
  }

  return {
    success: true,
    message: "Workout exercise updated successfully 🎉",
    data: updatedWorkout,
  };
};

// Reorder Workout Exercises
const reorderWorkoutExercisesService = async (workoutId, exercises) => {
  const workout = await getWorkoutById(workoutId);
  if (!workout) {
    throw new Error("Workout not found");
  }

  const updatedWorkout = await reorderWorkoutExercises(workoutId, exercises);

  return {
    success: true,
    message: "Workout exercises reordered successfully 🎉",
    data: updatedWorkout,
  };
};

// Get Workout Exercises
const getWorkoutExercisesService = async (workoutId) => {
  const workout = await getWorkoutById(workoutId);
  if (!workout) {
    throw new Error("Workout not found");
  }

  return {
    success: true,
    message: "Workout exercises fetched successfully",
    workoutName: workout.workoutName,
    count: workout.exercises.length,
    data: workout.exercises,
  };
};

module.exports = {
  createWorkoutService,
  getAllWorkoutsService,
  getWorkoutByIdService,
  updateWorkoutService,
  uploadWorkoutThumbnailService,
  uploadWorkoutVideoService,
  deleteWorkoutService,
  addExerciseToWorkoutService,
  removeExerciseFromWorkoutService,
  updateWorkoutExerciseService,
  reorderWorkoutExercisesService,
  getWorkoutExercisesService,
};