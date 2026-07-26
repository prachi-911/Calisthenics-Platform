const {
  registerUser: registerUserService,
  loginUser: loginUserService,
  updateProfile: updateProfileService,
  changePassword: changePasswordService,
  uploadProfilePicture: uploadProfilePictureService,
} = require("../services/authService");

// ===============================
// Register User Controller
// ===============================
const registerUser = async (req, res) => {
  try {
    const result = await registerUserService(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// Login User Controller
// ===============================
const loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);

    res.status(200).json(result);
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// Get Current User Profile
// ===============================
const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: req.user,
  });
};

// ===============================
// Update User Profile Controller
// ===============================
const updateProfile = async (req, res) => {
  try {
    const result = await updateProfileService(
      req.user._id,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// ===============================
// Change Password Controller
// ===============================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await changePasswordService(
      req.user._id,
      currentPassword,
      newPassword
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Upload Profile Picture Controller
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    const result = await uploadProfilePictureService(
      req.user._id,
      req.file.path
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("UPLOAD PROFILE PICTURE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// Export Controllers
// ===============================
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
};