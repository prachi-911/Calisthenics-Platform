const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const programRoutes = require("./routes/programRoutes");
const studentSubscriptionRoutes = require("./routes/studentSubscriptionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const searchRoutes = require("./routes/searchRoutes");

const helmet = require("helmet");
const hpp = require("hpp");
const mongoSanitize = require("./middlewares/mongoSanitize");
const { generalLimiter, authLimiter, paymentLimiter } = require("./middlewares/rateLimiter");

const app = express();

// =========================
// Security & Global Middlewares
// =========================
// Set secure HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors());

// Development logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Body parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Prevent NoSQL query injection
app.use(mongoSanitize);

// Prevent HTTP parameter pollution
app.use(hpp());

// Apply rate limiting to all /api requests
app.use("/api", generalLimiter);

// =========================
// Health Check Route
// =========================
app.get("/", (req, res) => {
  res.send("🚀 Calisthenics Platform Backend is Running...");
});

// =========================
// API Routes
// =========================
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/student-subscriptions", studentSubscriptionRoutes);
app.use("/api/v1/payments", paymentLimiter, paymentRoutes);
app.use("/api/v1/workouts", workoutRoutes);
app.use("/api/v1/exercises", exerciseRoutes);
app.use("/api/v1/programs", programRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/search", searchRoutes);

// =========================
// 404 Not Found Handler
// =========================
const AppError = require("./utils/AppError");
const errorHandler = require("./middlewares/errorHandler");

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// =========================
// Centralized Error Handler
// =========================
app.use(errorHandler);

module.exports = app;