// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");

// DB connection
const connectDB = require("./config/db");

// Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // body parser for JSON

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
// Nested task routes: /api/projects/:projectId/tasks
app.use("/api/projects/:projectId/tasks", taskRoutes);

// Error handling middleware (global)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1); // stop app if DB not connected
  });
