const {
  createUser,
  findByEmail,
  findByPhone,
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

module.exports = {
  registerUser,
};