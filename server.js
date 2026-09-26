require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { initCronJobs } = require("./src/jobs");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize Automated Background Jobs
initCronJobs();

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});