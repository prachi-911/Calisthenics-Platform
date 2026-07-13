const {
  createUser,
  findByEmail,
  findByPhone,
  findByEmailWithPassword,
} = require("../repositories/userRepository");

const { generateToken } = require("../utils/jwt");

// Register User Service
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
// Login User Service
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

module.exports = {
  registerUser,
  loginUser,
};