const Workout = require("../models/Workout");

// Create Workout
const createWorkout = async (workoutData) => {
  return await Workout.create(workoutData);
};

// Get All Workouts
const getAllWorkouts = async () => {
  return await Workout.find();
};

// Get Workout By ID
const getWorkoutById = async (workoutId) => {
  return await Workout.findById(workoutId);
};

// Get Workout By Name
const getWorkoutByName = async (workoutName) => {
  return await Workout.findOne({ workoutName });
};

// Update Workout
const updateWorkout = async (workoutId, updateData) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Update Workout Thumbnail
const updateWorkoutThumbnail = async (workoutId, thumbnailData) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
    {
      thumbnail: thumbnailData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// Update Workout Video
const updateWorkoutVideo = async (workoutId, videoData) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
    {
      video: videoData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete Workout
const deleteWorkout = async (workoutId) => {
  return await Workout.findByIdAndDelete(workoutId);
};

module.exports = {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  getWorkoutByName,
  updateWorkout,
  updateWorkoutThumbnail,
  updateWorkoutVideo,
  deleteWorkout,
};