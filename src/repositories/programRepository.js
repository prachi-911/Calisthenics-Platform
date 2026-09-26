const Program = require("../models/Program");

// Create Program
const createProgram = async (programData) => {
  return await Program.create(programData);
};

// Get All Programs
const getAllPrograms = async (filter = {}) => {
  return await Program.find(filter)
    .populate("createdBy", "fullName")
    .populate("schedule.days.workout", "workoutName difficulty category duration thumbnail");
};

// Get Program By ID
const getProgramById = async (programId) => {
  return await Program.findById(programId)
    .populate("createdBy", "fullName")
    .populate({
      path: "schedule.days.workout",
      populate: {
        path: "exercises.exercise",
        select: "name difficulty category targetMuscles thumbnail video",
      },
    });
};

// Get Program By Title
const getProgramByTitle = async (title) => {
  return await Program.findOne({ title });
};

// Update Program
const updateProgram = async (programId, updateData) => {
  return await Program.findByIdAndUpdate(programId, updateData, {
    new: true,
    runValidators: true,
  }).populate("schedule.days.workout", "workoutName difficulty category duration thumbnail");
};

// Update Program Thumbnail
const updateProgramThumbnail = async (programId, thumbnailData) => {
  return await Program.findByIdAndUpdate(
    programId,
    { thumbnail: thumbnailData },
    { new: true, runValidators: true }
  );
};

// Increment Enrolled Count
const incrementEnrolledCount = async (programId) => {
  return await Program.findByIdAndUpdate(
    programId,
    { $inc: { enrolledCount: 1 } },
    { new: true }
  );
};

// Delete Program
const deleteProgram = async (programId) => {
  return await Program.findByIdAndDelete(programId);
};

module.exports = {
  createProgram,
  getAllPrograms,
  getProgramById,
  getProgramByTitle,
  updateProgram,
  updateProgramThumbnail,
  incrementEnrolledCount,
  deleteProgram,
};
