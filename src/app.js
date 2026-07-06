const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());

// Test Route
app.get("/", (req, res) => {
    res.send("🚀 Calisthenics Platform Backend is Running...");
});

module.exports = app;