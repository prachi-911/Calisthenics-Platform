const fs = require("fs");
const {
  createProgram,
  getAllPrograms,
  getProgramById,
  getProgramByTitle,
  updateProgram,
  updateProgramThumbnail,
  incrementEnrolledCount,
  deleteProgram,
} = require("../repositories/programRepository");

const {
  createEnrollment,
  getEnrollmentByUserAndProgram,
  getUserEnrollments,
  markWorkoutCompleted,
  completeProgram,
} = require("../repositories/programEnrollmentRepository");

const {
  uploadImage,
  deleteFile,
} = require("../utils/cloudinary");

// Create Program
const createProgramService = async (programData, userId) => {
  const existing = await getProgramByTitle(programData.title);
  if (existing) {
    throw new Error("Program with this title already exists");
  }

  const program = await createProgram({
    ...programData,
    createdBy: userId,
  });

  return {
    success: true,
    message: "Training program created successfully 🎉",
    data: program,
  };
};

// Get All Programs
const getAllProgramsService = async (query = {}) => {
  const filter = {};

  if (query.level) filter.level = query.level;
  if (query.category) filter.category = query.category;
  if (query.isPremium !== undefined) {
    filter.isPremium = query.isPremium === "true" || query.isPremium === true;
  }
  if (query.isPublished !== undefined) {
    filter.isPublished = query.isPublished === "true" || query.isPublished === true;
  }

  const programs = await getAllPrograms(filter);

  return {
    success: true,
    message: "Programs fetched successfully",
    count: programs.length,
    data: programs,
  };
};

// Get Program By ID
const getProgramByIdService = async (programId) => {
  const program = await getProgramById(programId);

  if (!program) {
    throw new Error("Program not found");
  }

  return {
    success: true,
    message: "Program fetched successfully",
    data: program,
  };
};

// Update Program
const updateProgramService = async (programId, updateData) => {
  if (updateData.title) {
    const existing = await getProgramByTitle(updateData.title);
    if (existing && existing._id.toString() !== programId) {
      throw new Error("Another program with this title already exists");
    }
  }

  const program = await updateProgram(programId, updateData);

  if (!program) {
    throw new Error("Program not found");
  }

  return {
    success: true,
    message: "Program updated successfully 🎉",
    data: program,
  };
};

// Upload Program Thumbnail
const uploadProgramThumbnailService = async (programId, file) => {
  try {
    const program = await getProgramById(programId);
    if (!program) {
      throw new Error("Program not found");
    }

    if (program.thumbnail?.publicId) {
      await deleteFile(program.thumbnail.publicId, "image");
    }

    const result = await uploadImage(
      file.path,
      "calisthenics-program-thumbnails"
    );

    const updatedProgram = await updateProgramThumbnail(programId, {
      url: result.secure_url,
      publicId: result.public_id,
    });

    return {
      success: true,
      message: "Program thumbnail uploaded successfully 🎉",
      data: updatedProgram,
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

// Delete Program
const deleteProgramService = async (programId) => {
  const program = await getProgramById(programId);
  if (!program) {
    throw new Error("Program not found");
  }

  if (program.thumbnail?.publicId) {
    await deleteFile(program.thumbnail.publicId, "image");
  }

  await deleteProgram(programId);

  return {
    success: true,
    message: "Program deleted successfully 🗑️",
  };
};

// Enroll In Program
const enrollProgramService = async (userId, programId) => {
  const program = await getProgramById(programId);
  if (!program) {
    throw new Error("Program not found");
  }

  const existingEnrollment = await getEnrollmentByUserAndProgram(userId, programId);
  if (existingEnrollment) {
    return {
      success: true,
      message: "Already enrolled in this program",
      data: existingEnrollment,
    };
  }

  const enrollment = await createEnrollment(userId, programId);
  await incrementEnrolledCount(programId);

  return {
    success: true,
    message: "Enrolled in training program successfully 🎉",
    data: enrollment,
  };
};

// Get User Enrollments
const getUserEnrollmentsService = async (userId) => {
  const enrollments = await getUserEnrollments(userId);

  return {
    success: true,
    message: "User enrollments fetched successfully",
    count: enrollments.length,
    data: enrollments,
  };
};

// Get Program Progress
const getProgramProgressService = async (userId, programId) => {
  const enrollment = await getEnrollmentByUserAndProgram(userId, programId);

  if (!enrollment) {
    throw new Error("You are not enrolled in this program");
  }

  return {
    success: true,
    message: "Program progress fetched successfully",
    data: enrollment,
  };
};

// Complete a Workout in Program
const completeWorkoutStepService = async (userId, programId, weekNumber, dayNumber, workoutId) => {
  const enrollment = await getEnrollmentByUserAndProgram(userId, programId);

  if (!enrollment) {
    throw new Error("You are not enrolled in this program");
  }

  // Check if this workout is already completed
  const alreadyCompleted = enrollment.completedWorkouts.some(
    (cw) => cw.weekNumber === Number(weekNumber) && cw.dayNumber === Number(dayNumber)
  );

  if (alreadyCompleted) {
    return {
      success: true,
      message: "Workout step already marked as completed",
      data: enrollment,
    };
  }

  const updatedEnrollment = await markWorkoutCompleted(enrollment._id, {
    weekNumber: Number(weekNumber),
    dayNumber: Number(dayNumber),
    workout: workoutId || null,
    completedAt: new Date(),
  });

  return {
    success: true,
    message: "Workout step marked as completed 🎉",
    data: updatedEnrollment,
  };
};

module.exports = {
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
};
