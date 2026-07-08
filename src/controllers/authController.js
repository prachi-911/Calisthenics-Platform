const { registerUser: registerUserService } = require("../services/authService");

// Register User Controller
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

module.exports = {
  registerUser,
};