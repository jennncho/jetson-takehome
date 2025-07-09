"use strict";

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Departments", null, {}); // This line clears the table first
        return new Promise((resolve, reject) => {
            const departments = new Map();

            csv.parseFile(path.join(__dirname, "../data/punch-report.csv"), {
                headers: true,
                ignoreEmpty: true,
                trim: true,
            })
                .on("data", (data) => {
                    // Extract unique departments
                    const departmentName = data["Department"];
                    if (departmentName && !departments.has(departmentName)) {
                        departments.set(departmentName, {
                            name: departmentName,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                    }
                })
                .on("end", async () => {
                    try {
                        const departmentArray = Array.from(
                            departments.values()
                        );
                        await queryInterface.bulkInsert(
                            "Departments",
                            departmentArray,
                            {}
                        );
                        console.log(
                            `Seeded ${departmentArray.length} departments`
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
        await queryInterface.bulkDelete("Departments", null, {});
    },
};
