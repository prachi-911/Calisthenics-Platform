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

module.exports = {
  createUser,
  findByEmail,
  findByPhone,
  findByEmailWithPassword,
};