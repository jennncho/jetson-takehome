"use strict";

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Employees", null, {}); // This line clears the table first
        return new Promise((resolve, reject) => {
            const employees = new Map();

            csv.parseFile(path.join(__dirname, "../data/punch-report.csv"), {
                headers: true,
                ignoreEmpty: true,
                trim: true,
            })
                .on("data", (data) => {
                    // Extract unique employees
                    const employeeId = data["Employee Id"];
                    if (!employees.has(employeeId)) {
                        employees.set(employeeId, {
                            id: parseInt(employeeId),
                            first_name: data["First Name"],
                            last_name: data["Last Name"],
                            department: data["Department"],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                    }
                })
                .on("end", async () => {
                    try {
                        const employeeArray = Array.from(employees.values());
                        await queryInterface.bulkInsert(
                            "Employees",
                            employeeArray,
                            {}
                        );
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                })
                .on("error", reject);
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Employees", null, {});
    },
};
