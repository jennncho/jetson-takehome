const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const { Employee, Department } = require("../models");

async function seedEmployees() {
    console.log("Seeding employees...");

    return new Promise((resolve, reject) => {
        const employees = new Map();

        csv.parseFile(path.join(__dirname, "../data/punch-report.csv"), {
            headers: true,
            ignoreEmpty: true,
            trim: true,
        })
            .on("data", (data) => {
                // Extract unique employees using Employee Id as the key
                const employeeId = data["Employee Id"];
                if (employeeId && !employees.has(employeeId)) {
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
                    // Clear existing employees
                    await Employee.destroy({ where: {} });

                    // Get all departments to map names to IDs
                    const departments = await Department.findAll();
                    const departmentMap = new Map();
                    departments.forEach((dept) => {
                        departmentMap.set(dept.name, dept.id);
                    });

                    // Add department_id to each employee
                    const employeeArray = Array.from(employees.values()).map(
                        (emp) => ({
                            ...emp,
                            department_id:
                                departmentMap.get(emp.department) || null,
                        })
                    );

                    const createdEmployees = await Employee.bulkCreate(
                        employeeArray
                    );

                    console.log(`Seeded ${createdEmployees.length} employees`);
                    resolve(createdEmployees);
                } catch (error) {
                    console.error("Error seeding employees:", error);
                    reject(error);
                }
            })
            .on("error", (error) => {
                console.error("Error reading CSV:", error);
                reject(error);
            });
    });
}

module.exports = seedEmployees;
