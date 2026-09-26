const {
  createProgramService,
  getAllProgramsService,
  getProgramByIdService,
  updateProgramService,
  uploadProgramThumbnailService,
  deleteProgramService,
  enrollProgramService,
  getUserEnrollmentsService,
  getProgramProgressService,
  completeWorkoutStepService,
} = require("../services/programService");

// Create Program
const createProgram = async (req, res) => {
  try {
    const result = await createProgramService(req.body, req.user._id);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Programs
const getAllPrograms = async (req, res) => {
  try {
    const result = await getAllProgramsService(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Program By ID
const getProgramById = async (req, res) => {
  try {
    const result = await getProgramByIdService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Program
const updateProgram = async (req, res) => {
  try {
    const result = await updateProgramService(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload Program Thumbnail
const uploadProgramThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a thumbnail image",
      });
    }

    const result = await uploadProgramThumbnailService(req.params.id, req.file);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Program
const deleteProgram = async (req, res) => {
  try {
    const result = await deleteProgramService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Enroll in Program
const enrollProgram = async (req, res) => {
  try {
    const result = await enrollProgramService(req.user._id, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User's Enrolled Programs
const getMyEnrollments = async (req, res) => {
  try {
    const result = await getUserEnrollmentsService(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Progress for a Program
const getProgramProgress = async (req, res) => {
  try {
    const result = await getProgramProgressService(req.user._id, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark Workout Step Completed
const completeWorkoutStep = async (req, res) => {
  try {
    const { weekNumber, dayNumber, workoutId } = req.body;
    const result = await completeWorkoutStepService(
      req.user._id,
      req.params.id,
      weekNumber,
      dayNumber,
      workoutId
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  uploadProgramThumbnail,
  deleteProgram,
  enrollProgram,
  getMyEnrollments,
  getProgramProgress,
  completeWorkoutStep,
};
