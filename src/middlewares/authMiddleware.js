const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  try {
    // Get Authorization Header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

    // Find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticateUser;