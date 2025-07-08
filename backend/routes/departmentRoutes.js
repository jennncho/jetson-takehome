const express = require("express");
const router = express.Router();
const { Department } = require("../models");

// Get all departments
router.get("/", async (req, res) => {
    try {
        const departments = await Department.findAll({
            attributes: ["id", "name"],
            order: [["name", "ASC"]],
        });
        res.json(departments);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
