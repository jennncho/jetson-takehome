const express = require("express");
const router = express.Router();
const { Op, fn, col, literal } = require("sequelize");
const { Employee, Punch } = require("../models");

// MAIN DASHBOARD ENDPOINT
router.get("/overview", async (req, res) => {
    try {
        const { department, date } = req.query;

        const departmentFilter =
            department && department !== "all"
                ? { department: department.split(",") }
                : null;

        const dateFilter = date ? { work_date: date } : {};

        // Get all metrics in parallel
        const [employeeCount, hoursMetrics, ptoMetrics, topEmployees] =
            await Promise.all([
                getEmployeeCount(departmentFilter),
                getHoursMetrics(departmentFilter, dateFilter),
                getPTOMetrics(departmentFilter, date),
                getTopEmployees(departmentFilter, dateFilter),
            ]);

        res.json({
            data: {
                employee_count: employeeCount,
                total_hours_worked: hoursMetrics.totalHours,
                average_workday_length: hoursMetrics.avgWorkdayLength,
                pto_employees_count: ptoMetrics.employeeCount,
                pto_hours_taken: ptoMetrics.hoursTotal,
                overtime_hours: hoursMetrics.overtimeHours,
                paid_duration_hours: hoursMetrics.paidDurationHours,
                top_employees: topEmployees,
            },
            filters: {
                department: department || "all",
                date: date || null,
            },
            meta: {
                generated_at: new Date().toISOString(),
                cache_ttl: 300,
            },
        });
    } catch (error) {
        console.error("Dashboard overview error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// HELPER FUNCTIONS

//gets total employee count based on department filter
async function getEmployeeCount(departmentFilter) {
    console.log("Get Employee Count");
    return await Employee.count({
        where: departmentFilter,
    });
}

//gets total hours worked, average workday length, overtime hours, and paid duration hours
async function getHoursMetrics(departmentFilter, dateFilter) {
    console.log("Get Hours Metrics");

    // Build the include object conditionally
    const includeConfig = {
        model: Employee,
        as: "employee",
        attributes: [],
        required: true,
    };

    // Only add where clause if departmentFilter is not null
    if (departmentFilter) {
        includeConfig.where = departmentFilter;
    }

    const result = await Punch.findOne({
        attributes: [
            [fn("SUM", col("regular_duration")), "totalRegularHours"],
            [fn("SUM", col("ot_duration")), "totalOvertimeHours"],
            [fn("SUM", col("paid_duration")), "totalPaidHours"],
            [
                fn("COUNT", fn("DISTINCT", col("employee_id"))),
                "uniqueEmployees",
            ],
            [fn("COUNT", col("Punch.id")), "totalPunches"],
        ],
        include: [includeConfig],
        where: {
            ...dateFilter,
            punch_in_type: "Clock In", // Only count actual work punches
        },
        raw: true,
    });

    const totalHours =
        parseFloat(result.totalRegularHours || 0) +
        parseFloat(result.totalOvertimeHours || 0);

    const avgWorkdayLength = totalHours / result.totalPunches;

    return {
        totalHours: totalHours.toFixed(2),
        avgWorkdayLength: parseFloat(avgWorkdayLength.toFixed(2)),
        overtimeHours: parseFloat(result.totalOvertimeHours || 0),
        paidDurationHours: parseFloat(result.totalPaidHours || 0),
    };
}

async function getPTOMetrics(departmentFilter, date) {
    console.log("Get PTO Metrics");
    if (!date) {
        return { employeeCount: 0, hoursTotal: 0 };
    }

    // Build the include object conditionally
    const includeConfig = {
        model: Employee,
        as: "employee",
        attributes: [],
        required: true,
    };

    // Only add where clause if departmentFilter is not null
    if (departmentFilter) {
        includeConfig.where = departmentFilter;
    }

    const ptoData = await Punch.findAll({
        attributes: [
            [fn("COUNT", fn("DISTINCT", col("employee_id"))), "employeeCount"],
            [fn("SUM", col("paid_duration")), "hoursTotal"],
        ],
        include: [includeConfig],
        where: {
            work_date: date,
            punch_in_type: "Non-Work", // PTO punches
        },
        raw: true,
    });

    return {
        employeeCount: parseInt(ptoData[0].employeeCount || 0),
        hoursTotal: parseFloat(ptoData[0].hoursTotal || 0),
    };
}

async function getTopEmployees(departmentFilter, dateFilter, limit = 10) {
    console.log("Get Top Employees");

    // Build the include object conditionally
    const includeConfig = {
        model: Employee,
        as: "employee",
        attributes: ["first_name", "last_name", "department"],
        required: true,
    };

    // Only add where clause if departmentFilter is not null
    if (departmentFilter) {
        includeConfig.where = departmentFilter;
    }

    const topEmployees = await Punch.findAll({
        attributes: [
            "employee_id",
            [
                fn("SUM", literal("regular_duration + ot_duration")),
                "totalHours",
            ],
        ],
        include: [includeConfig],
        where: {
            ...dateFilter,
            punch_in_type: "Clock In",
        },
        group: ["employee_id", "employee.id"],
        order: [["totalHours", "DESC"]],
        limit: limit,
        raw: true,
    });

    return topEmployees.map((emp) => ({
        employee_id: emp.employee_id,
        name: `${emp["employee.first_name"]} ${emp["employee.last_name"]}`,
        department: emp["employee.department"],
        total_hours: parseFloat(emp.totalHours || 0),
    }));
}

module.exports = router;
// Remove the complex date parsing function since we only need simple date filtering
// Helper function for date filtering is no longer needed

// Additional granular endpoints for specific use cases
// router.get("/employees/metrics", async (req, res) => {
//     try {
//         const { department } = req.query;
//         const departmentFilter =
//             department && department !== "all"
//                 ? { department: department.split(",") }
//                 : {};

//         const count = await getEmployeeCount(departmentFilter);

//         res.json({
//             data: { employee_count: count },
//             filters: { department: department || "all" },
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// router.get("/hours/summary", async (req, res) => {
//     try {
//         const { department, date } = req.query;
//         const dateFilter = date ? { work_date: date } : {};
//         const departmentFilter =
//             department && department !== "all"
//                 ? { department: department.split(",") }
//                 : {};

//         const metrics = await getHoursMetrics(departmentFilter, dateFilter);

//         res.json({
//             data: metrics,
//             filters: { department: department || "all", date },
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// router.get("/pto/summary", async (req, res) => {
//     try {
//         const { department, date } = req.query;
//         const departmentFilter =
//             department && department !== "all"
//                 ? { department: department.split(",") }
//                 : {};

//         const ptoMetrics = await getPTOMetrics(departmentFilter, date);

//         res.json({
//             data: ptoMetrics,
//             filters: { department: department || "all", date },
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// router.get("/employees/top-performers", async (req, res) => {
//     try {
//         const { department, limit = 10 } = req.query;
//         const departmentFilter =
//             department && department !== "all"
//                 ? { department: department.split(",") }
//                 : {};

//         const topEmployees = await getTopEmployees(
//             departmentFilter,
//             {},
//             parseInt(limit)
//         );

//         res.json({
//             data: { top_employees: topEmployees },
//             filters: { department: department || "all", limit },
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// module.exports = router;
