"use strict";

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Clear existing data in the Punches table
        await queryInterface.bulkDelete("Punches", null, {});
        return new Promise((resolve, reject) => {
            const punches = [];

            csv.parseFile(path.join(__dirname, "../data/punch-report.csv"), {
                headers: true,
                ignoreEmpty: true,
                trim: true,
            })
                .on("data", (data) => {
                    // Helper functions to safely parse different data types
                    // Function to safely parse integers
                    const safeParseInt = (value) => {
                        if (
                            !value ||
                            value === "" ||
                            value === "NaN" ||
                            value === "undefined"
                        )
                            return null;
                        const parsed = parseInt(value);
                        return isNaN(parsed) ? null : parsed;
                    };
                    // Function to safely parse floats
                    const safeParseFloat = (value) => {
                        if (
                            !value ||
                            value === "" ||
                            value === "NaN" ||
                            value === "undefined"
                        )
                            return 0;
                        const parsed = parseFloat(value);
                        if (isNaN(parsed)) return 0;
                        return Math.round(parsed * 100) / 100;
                    };

                    // Function to safely parse dates
                    const safeParseDate = (value) => {
                        if (
                            !value ||
                            value === "" ||
                            value === "NaN" ||
                            value === "undefined"
                        )
                            return null;

                        // Handle different date formats
                        const parsed = new Date(value);
                        if (isNaN(parsed.getTime())) return null;

                        // Ensure consistent timezone handling
                        return new Date(parsed.toISOString());
                    };
                    // Function to safely convert strings
                    const safeString = (value) => {
                        if (!value || value === "NaN" || value === "undefined")
                            return null;
                        return value.toString().trim();
                    };

                    // Skip rows with no employee ID
                    const employeeId = safeParseInt(data["Employee Id"]);
                    if (!employeeId) return;

                    punches.push({
                        employee_id: employeeId,
                        work_date: safeParseDate(data["Work Date"]),
                        punch_in_time: safeParseDate(data["Punch In Time"]),
                        punch_out_time: safeParseDate(
                            data["Punch Out Time"] || data["Punch Out Time "]
                        ),
                        punch_in_type: safeString(data["Punch In Type"]),
                        punch_out_type: safeString(data["Punch Out Type"]),
                        regular_duration: safeParseFloat(
                            data["Regular Duration"]
                        ),
                        ot_duration: safeParseFloat(data["OT Duration"]),
                        paid_duration: safeParseFloat(data["Paid Duration"]),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                })
                .on("end", async () => {
                    try {
                        console.log(
                            `Inserting ${punches.length} punch records`
                        );
                        await queryInterface.bulkInsert("Punches", punches, {});
                        resolve();
                    } catch (error) {
                        console.error("Error inserting punches:", error);
                        reject(error);
                    }
                })
                .on("error", reject);
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Punches", null, {});
    },
};
