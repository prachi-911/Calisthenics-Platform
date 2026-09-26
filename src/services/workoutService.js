const fs = require("fs");
const {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  getWorkoutByName,
  updateWorkout,
  updateWorkoutThumbnail,
  updateWorkoutVideo,
  deleteWorkout,
} = require("../repositories/workoutRepository");

const {
  uploadImage,
  uploadVideo,
  deleteFile,
} = require("../utils/cloudinary");

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
const getAllWorkoutsService = async () => {
  const workouts = await getAllWorkouts();

  return {
    success: true,
    message: "Workouts fetched successfully",
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

module.exports = {
  createWorkoutService,
  getAllWorkoutsService,
  getWorkoutByIdService,
  updateWorkoutService,
  uploadWorkoutThumbnailService,
  uploadWorkoutVideoService,
  deleteWorkoutService,
};