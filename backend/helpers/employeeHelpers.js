const { fn, col, literal } = require("sequelize");
const { Employee, Punch } = require("../models");

// gets the count of employees
async function getEmployeeCount(departmentFilter) {
    return await Employee.count({
        where: departmentFilter,
    });
}

// gets the top employees based on total hours worked
async function getTopEmployees(departmentFilter, limit = 10) {
    //for department filtering
    const includeConfig = {
        model: Employee,
        as: "employee",
        attributes: ["first_name", "last_name", "department"],
        required: true,
    };

    // Only add if departmentFilter is not null
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
            punch_in_type: "Clock In", // Only count actual work punches
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

module.exports = { getEmployeeCount, getTopEmployees };
