const Exercise = require("../models/Exercise");

// Create Exercise
const createExercise = async (exerciseData) => {
  return await Exercise.create(exerciseData);
};

// Get All Exercises
const getAllExercises = async (filter = {}) => {
  return await Exercise.find(filter).populate("prerequisites", "name category difficulty");
};

// Get Exercise By ID
const getExerciseById = async (exerciseId) => {
  return await Exercise.findById(exerciseId).populate("prerequisites", "name category difficulty");
};

// Get Exercise By Name
const getExerciseByName = async (name) => {
  return await Exercise.findOne({ name });
};

// Update Exercise
const updateExercise = async (exerciseId, updateData) => {
  return await Exercise.findByIdAndUpdate(exerciseId, updateData, {
    new: true,
    runValidators: true,
  }).populate("prerequisites", "name category difficulty");
};

// Update Exercise Thumbnail
const updateExerciseThumbnail = async (exerciseId, thumbnailData) => {
  return await Exercise.findByIdAndUpdate(
    exerciseId,
    { thumbnail: thumbnailData },
    { new: true, runValidators: true }
  );
};

// Update Exercise Video
const updateExerciseVideo = async (exerciseId, videoData) => {
  return await Exercise.findByIdAndUpdate(
    exerciseId,
    { video: videoData },
    { new: true, runValidators: true }
  );
};

// Delete Exercise
const deleteExercise = async (exerciseId) => {
  return await Exercise.findByIdAndDelete(exerciseId);
};

module.exports = {
  createExercise,
  getAllExercises,
  getExerciseById,
  getExerciseByName,
  updateExercise,
  updateExerciseThumbnail,
  updateExerciseVideo,
  deleteExercise,
};
