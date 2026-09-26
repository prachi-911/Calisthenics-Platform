const Workout = require("../models/Workout");

// Create Workout
const createWorkout = async (workoutData) => {
  return await Workout.create(workoutData);
};

// Get All Workouts
const getAllWorkouts = async (filter = {}) => {
  return await Workout.find(filter).populate(
    "exercises.exercise",
    "name category difficulty targetMuscles thumbnail video"
  );
};

// Get Workout By ID
const getWorkoutById = async (workoutId) => {
  return await Workout.findById(workoutId).populate(
    "exercises.exercise",
    "name description category difficulty targetMuscles secondaryMuscles equipment mechanics instructions tips thumbnail video"
  );
};

// Get Workout By Name
const getWorkoutByName = async (workoutName) => {
  return await Workout.findOne({ workoutName });
};

// Update Workout
const updateWorkout = async (workoutId, updateData) => {
  return await Workout.findByIdAndUpdate(workoutId, updateData, {
    new: true,
    runValidators: true,
  }).populate(
    "exercises.exercise",
    "name category difficulty targetMuscles thumbnail video"
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

// Add Exercise to Workout
const addExerciseToWorkout = async (workoutId, exerciseItem) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
    { $push: { exercises: exerciseItem } },
    { new: true, runValidators: true }
  ).populate(
    "exercises.exercise",
    "name category difficulty targetMuscles thumbnail video"
  );
};

// Remove Exercise from Workout
const removeExerciseFromWorkout = async (workoutId, exerciseItemId) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
    { $pull: { exercises: { _id: exerciseItemId } } },
    { new: true }
  ).populate(
    "exercises.exercise",
    "name category difficulty targetMuscles thumbnail video"
  );
};

// Update specific exercise in workout
const updateWorkoutExercise = async (workoutId, exerciseItemId, updateData) => {
  const setObj = {};
  if (updateData.sets !== undefined) setObj["exercises.$.sets"] = updateData.sets;
  if (updateData.reps !== undefined) setObj["exercises.$.reps"] = updateData.reps;
  if (updateData.duration !== undefined) setObj["exercises.$.duration"] = updateData.duration;
  if (updateData.restTime !== undefined) setObj["exercises.$.restTime"] = updateData.restTime;
  if (updateData.order !== undefined) setObj["exercises.$.order"] = updateData.order;
  if (updateData.notes !== undefined) setObj["exercises.$.notes"] = updateData.notes;

  return await Workout.findOneAndUpdate(
    { _id: workoutId, "exercises._id": exerciseItemId },
    { $set: setObj },
    { new: true, runValidators: true }
  ).populate(
    "exercises.exercise",
    "name category difficulty targetMuscles thumbnail video"
  );
};

// Reorder exercises in workout
const reorderWorkoutExercises = async (workoutId, exercises) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
    { exercises },
    { new: true, runValidators: true }
  ).populate(
    "exercises.exercise",
    "name category difficulty targetMuscles thumbnail video"
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
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  updateWorkoutExercise,
  reorderWorkoutExercises,
  deleteWorkout,
};