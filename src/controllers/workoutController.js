const {
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
} = require("../services/workoutService");

// Create Workout
const createWorkout = async (req, res) => {
  try {
    const result = await createWorkoutService(req.body);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Workouts
const getAllWorkouts = async (req, res) => {
  try {
    const result = await getAllWorkoutsService();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Workout By ID
const getWorkoutById = async (req, res) => {
  try {
    const result = await getWorkoutByIdService(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Workout
const updateWorkout = async (req, res) => {
  try {
    const result = await updateWorkoutService(
      req.params.id,
      req.body
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload Workout Thumbnail
const uploadWorkoutThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a thumbnail image",
      });
    }

    const result = await uploadWorkoutThumbnailService(
      req.params.id,
      req.file
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// Upload Workout Video
const uploadWorkoutVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a workout video",
      });
    }

    const result = await uploadWorkoutVideoService(
      req.params.id,
      req.file
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete Workout
const deleteWorkout = async (req, res) => {
  try {
    const result = await deleteWorkoutService(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Exercise to Workout
const addExerciseToWorkout = async (req, res) => {
  try {
    const result = await addExerciseToWorkoutService(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Exercise from Workout
const removeExerciseFromWorkout = async (req, res) => {
  try {
    const result = await removeExerciseFromWorkoutService(
      req.params.id,
      req.params.exerciseItemId
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Workout Exercise
const updateWorkoutExercise = async (req, res) => {
  try {
    const result = await updateWorkoutExerciseService(
      req.params.id,
      req.params.exerciseItemId,
      req.body
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Reorder Workout Exercises
const reorderWorkoutExercises = async (req, res) => {
  try {
    const result = await reorderWorkoutExercisesService(
      req.params.id,
      req.body.exercises
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Workout Exercises
const getWorkoutExercises = async (req, res) => {
  try {
    const result = await getWorkoutExercisesService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  uploadWorkoutThumbnail,
  uploadWorkoutVideo,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  updateWorkoutExercise,
  reorderWorkoutExercises,
  getWorkoutExercises,
};