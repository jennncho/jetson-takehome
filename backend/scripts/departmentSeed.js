const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const { Department } = require("../models");

async function seedDepartments() {
    console.log("Seeding departments...");

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
                    });
                }
            })
            .on("end", async () => {
                try {
                    // Clear existing departments
                    await Department.destroy({ where: {} });

                    // Insert new departments
                    const departmentArray = Array.from(departments.values());
                    const createdDepartments = await Department.bulkCreate(
                        departmentArray
                    );

                    console.log(
                        `Seeded ${createdDepartments.length} departments`
                    );
                    resolve(createdDepartments);
                } catch (error) {
                    console.error("Error seeding departments:", error);
                    reject(error);
                }
            })
            .on("error", (error) => {
                console.error("Error reading CSV:", error);
                reject(error);
            });
    });
}

module.exports = seedDepartments;
