const express = require("express");
const cors = require("cors");
require("dotenv").config();
const overviewRoutes = require("./routes/overviewRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/overview", overviewRoutes);
app.use("/api/departments", departmentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

module.exports = app;
