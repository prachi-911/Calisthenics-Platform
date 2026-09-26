const {
  createExerciseService,
  getAllExercisesService,
  getExerciseByIdService,
  updateExerciseService,
  uploadExerciseThumbnailService,
  uploadExerciseVideoService,
  deleteExerciseService,
} = require("../services/exerciseService");

// Create Exercise
const createExercise = async (req, res) => {
  try {
    const result = await createExerciseService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Exercises
const getAllExercises = async (req, res) => {
  try {
    const result = await getAllExercisesService(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Exercise By ID
const getExerciseById = async (req, res) => {
  try {
    const result = await getExerciseByIdService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Exercise
const updateExercise = async (req, res) => {
  try {
    const result = await updateExerciseService(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload Exercise Thumbnail
const uploadExerciseThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a thumbnail image",
      });
    }

    const result = await uploadExerciseThumbnailService(req.params.id, req.file);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload Exercise Video
const uploadExerciseVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an exercise video",
      });
    }

    const result = await uploadExerciseVideoService(req.params.id, req.file);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Exercise
const deleteExercise = async (req, res) => {
  try {
    const result = await deleteExerciseService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  uploadExerciseThumbnail,
  uploadExerciseVideo,
  deleteExercise,
};
