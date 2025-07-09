const { fn, col, literal } = require("sequelize");
const { Employee, Punch } = require("../models");

// Gets hours worked metrics - total hours, regular hours, overtime, paid duration, and average workday length
async function getHoursMetrics(departmentFilter) {
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

    // Uses Sequelize aggregation functions to calculate metrics
    const queryConfig = {
        attributes: [
            [fn("SUM", col("regular_duration")), "totalRegularHours"],
            [fn("SUM", col("ot_duration")), "totalOvertimeHours"],
            [fn("SUM", col("paid_duration")), "totalPaidHours"],
            [fn("COUNT", col("Punch.id")), "totalPunches"],
        ],
        include: [includeConfig],
        where: {
            punch_in_type: "Clock In", // Only count actual work punches
        },
        raw: true,
    };

    const result = await Punch.findOne(queryConfig);

    const totalRegularHours = parseFloat(result.totalRegularHours || 0);
    const totalOvertimeHours = parseFloat(result.totalOvertimeHours || 0);
    const totalHours = totalRegularHours + totalOvertimeHours;
    const totalPunches = parseInt(result.totalPunches || 0);

    const avgWorkdayLength = totalPunches > 0 ? totalHours / totalPunches : 0;

    return {
        totalHours: parseFloat(totalHours.toFixed(2)),
        regularHours: parseFloat(totalRegularHours.toFixed(2)),
        overtimeHours: parseFloat(totalOvertimeHours.toFixed(2)),
        paidDurationHours: parseFloat(result.totalPaidHours || 0),
        avgWorkdayLength: parseFloat(avgWorkdayLength.toFixed(2)),
    };
}

// Gets PTO metrics - employee count and total hours taken for PTO
async function getPTOMetrics(departmentFilter, date) {
    // If no date specified, get all-time PTO data
    const dateFilter = date ? { work_date: date } : {};

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

    const ptoData = await Punch.findOne({
        attributes: [
            [fn("COUNT", fn("DISTINCT", col("employee_id"))), "employeeCount"],
            [fn("SUM", col("paid_duration")), "hoursTotal"],
        ],
        include: [includeConfig],
        where: {
            ...dateFilter,
            punch_in_type: "Non-Work", // Only count actual work punches
        },
        raw: true,
    });

    return {
        employeeCount: parseInt(ptoData.employeeCount || 0),
        hoursTotal: parseFloat(ptoData.hoursTotal || 0),
    };
}

module.exports = { getHoursMetrics, getPTOMetrics };
