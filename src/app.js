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

const app = express();

// =========================
// Global Middleware
// =========================
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// =========================
// Health Check Route
// =========================
app.get("/", (req, res) => {
  res.send("🚀 Calisthenics Platform Backend is Running...");
});

// =========================
// API Routes
// =========================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/student-subscriptions", studentSubscriptionRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/workouts", workoutRoutes);
app.use("/api/v1/exercises", exerciseRoutes);
app.use("/api/v1/programs", programRoutes);
app.use("/api/v1/admin", adminRoutes);

module.exports = app;