const express = require("express");
const router = express.Router();
const { Op, fn, col } = require("sequelize");
const { Employee, Punch } = require("../models");
const {
    getEmployeeCount,
    getTopEmployees,
} = require("../helpers/employeeHelpers");
const { getHoursMetrics, getPTOMetrics } = require("../helpers/hoursHelpers");

// EMPLOYEE-FOCUSED ENDPOINT - Filters by department
router.get("/employees", async (req, res) => {
    try {
        const { department } = req.query;

        const departmentFilter =
            department && department !== "All"
                ? { department: department }
                : null;

        // Get employee metrics
        const [employeeCount, topEmployees] = await Promise.all([
            getEmployeeCount(departmentFilter),
            getTopEmployees(departmentFilter),
        ]);

        res.json({
            data: {
                employee_count: employeeCount,
                top_employees: topEmployees,
            },
            filters: {
                department: department || "All",
            },
        });
    } catch (error) {
        console.error("Employee metrics error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// HOURS METRICS ENDPOINT - Filters by department only
router.get("/hours-metrics", async (req, res) => {
    try {
        const { department } = req.query;

        const departmentFilter =
            department && department !== "All"
                ? { department: department }
                : null;

        // Get hours metrics
        const hoursMetrics = await getHoursMetrics(departmentFilter);

        res.json({
            data: {
                total_hours_worked: hoursMetrics.totalHours,
                overtime_hours: hoursMetrics.overtimeHours,
                regular_hours: hoursMetrics.regularHours,
                paid_duration_hours: hoursMetrics.paidDurationHours,
                average_workday_length: hoursMetrics.avgWorkdayLength,
            },
            filters: {
                department: department || "All",
            },
        });
    } catch (error) {
        console.error("Hours metrics error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PTO METRICS ENDPOINT - Filters by department and date
router.get("/pto-metrics", async (req, res) => {
    try {
        const { department, date } = req.query;

        const departmentFilter =
            department && department !== "All"
                ? { department: department }
                : null;

        // Get PTO metrics
        const ptoMetrics = await getPTOMetrics(departmentFilter, date);

        res.json({
            data: {
                pto_employees_count: ptoMetrics.employeeCount,
                pto_hours_taken: ptoMetrics.hoursTotal,
            },
            filters: {
                department: department || "All",
                date: date || null,
            },
        });
    } catch (error) {
        console.error("PTO metrics error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
