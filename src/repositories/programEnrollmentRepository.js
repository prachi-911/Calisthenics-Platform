const ProgramEnrollment = require("../models/ProgramEnrollment");

// Create or find enrollment
const createEnrollment = async (userId, programId) => {
  return await ProgramEnrollment.create({
    user: userId,
    program: programId,
  });
};

// Find enrollment by user and program
const getEnrollmentByUserAndProgram = async (userId, programId) => {
  return await ProgramEnrollment.findOne({
    user: userId,
    program: programId,
  })
    .populate({
      path: "program",
      populate: {
        path: "schedule.days.workout",
        select: "workoutName difficulty duration thumbnail",
      },
    })
    .populate("completedWorkouts.workout", "workoutName duration");
};

// Get all enrollments for a user
const getUserEnrollments = async (userId) => {
  return await ProgramEnrollment.find({ user: userId })
    .populate("program", "title level category durationWeeks workoutsPerWeek thumbnail")
    .sort({ updatedAt: -1 });
};

// Mark workout as completed
const markWorkoutCompleted = async (enrollmentId, completedData) => {
  return await ProgramEnrollment.findByIdAndUpdate(
    enrollmentId,
    {
      $push: { completedWorkouts: completedData },
      currentWeek: completedData.weekNumber,
      currentDay: completedData.dayNumber,
    },
    { new: true }
  ).populate("program", "title durationWeeks");
};

// Complete Program
const completeProgram = async (enrollmentId) => {
  return await ProgramEnrollment.findByIdAndUpdate(
    enrollmentId,
    {
      status: "completed",
      completedAt: new Date(),
    },
    { new: true }
  );
};

module.exports = {
  createEnrollment,
  getEnrollmentByUserAndProgram,
  getUserEnrollments,
  markWorkoutCompleted,
  completeProgram,
};
