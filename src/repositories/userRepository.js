const User = require("../models/User");

// Create a new user
const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

// Find user by email
const findByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find user by phone
const findByPhone = async (phone) => {
  return await User.findOne({ phone });
};

// Find user by email and include password
const findByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

// Update user by ID
const updateUserById = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
};
// Find user by ID with password
const findByIdWithPassword = async (userId) => {
  return await User.findById(userId).select("+password");
};

module.exports = {
  createUser,
  findByEmail,
  findByPhone,
  findByEmailWithPassword,
  updateUserById,
  findByIdWithPassword,
};