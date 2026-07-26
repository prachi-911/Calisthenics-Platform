const {
  createUser,
  findByEmail,
  findByPhone,
  findByEmailWithPassword,
  updateUserById,
  findByIdWithPassword,
} = require("../repositories/userRepository");

const { generateToken } = require("../utils/jwt");

// ===============================
// Register User Service
// ===============================
const registerUser = async (userData) => {
  const { email, phone } = userData;

  // Check if email already exists
  const existingEmail = await findByEmail(email);

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  // Check if phone already exists (only if phone is provided)
  if (phone) {
    const existingPhone = await findByPhone(phone);

    if (existingPhone) {
      throw new Error("Phone number already exists");
    }
  }

  // Create user
  const newUser = await createUser(userData);

  // Generate JWT
  const token = generateToken({
    userId: newUser._id,
    role: newUser.role,
  });

  // Remove password before sending response
  const userResponse = newUser.toObject();
  delete userResponse.password;

  return {
    success: true,
    message: "User registered successfully 🎉",
    token,
    data: userResponse,
  };
};

// ===============================
// Login User Service
// ===============================
const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // Find user by email and include password
  const user = await findByEmailWithPassword(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = generateToken({
    userId: user._id,
    role: user.role,
  });

  // Remove password before sending response
  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    success: true,
    message: "Login successful 🎉",
    token,
    data: userResponse,
  };
};

// ===============================
// Update Profile Service
// ===============================
const updateProfile = async (userId, updateData) => {
  const updatedUser = await updateUserById(userId, updateData);

  return {
    success: true,
    message: "Profile updated successfully 🎉",
    data: updatedUser,
  };
};

// ===============================
// Change Password Service
// ===============================
const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  // Find user with password
  const user = await findByIdWithPassword(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Set new password
  user.password = newPassword;

  // This triggers the pre("save") hook and hashes the password
  await user.save();

  return {
    success: true,
    message: "Password changed successfully 🎉",
  };
};

// ===============================
// Upload Profile Picture Service
// ===============================
const uploadProfilePicture = async (userId, imageUrl) => {
  const updatedUser = await updateUserById(userId, {
    profilePicture: imageUrl,
  });

  return {
    success: true,
    message: "Profile picture updated successfully 🎉",
    data: updatedUser,
  };
};

// ===============================
// Export Services
// ===============================
module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
  uploadProfilePicture,
};