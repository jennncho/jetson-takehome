const path = require("path");
const csv = require("fast-csv");
const { Punch } = require("../models");

async function seedPunches() {
    console.log("Seeding punches...");

    return new Promise((resolve, reject) => {
        const punches = [];

        csv.parseFile(path.join(__dirname, "../data/punch-report.csv"), {
            headers: true,
            ignoreEmpty: true,
            trim: true,
        })
            .on("data", (data) => {
                // Helper: safely parse integers
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

                // Helper: safely parse floats
                const safeParseFloat = (value) => {
                    if (
                        !value ||
                        value === "" ||
                        value === "NaN" ||
                        value === "undefined"
                    )
                        return 0;
                    const parsed = parseFloat(value);
                    return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
                };

                // Helper: safely parse dates
                const safeParseDate = (value) => {
                    if (
                        !value ||
                        value === "" ||
                        value === "NaN" ||
                        value === "undefined"
                    )
                        return null;
                    const parsed = new Date(value);
                    return isNaN(parsed.getTime())
                        ? null
                        : new Date(parsed.toISOString());
                };

                // Helper: safely parse strings
                const safeString = (value) => {
                    if (!value || value === "NaN" || value === "undefined")
                        return null;
                    return value.toString().trim();
                };

                const employeeId = safeParseInt(data["Employee Id"]);
                if (!employeeId) return; // Skip rows with no employee ID

                punches.push({
                    employee_id: employeeId,
                    work_date: safeParseDate(data["Work Date"]),
                    punch_in_time: safeParseDate(data["Punch In Time"]),
                    punch_out_time: safeParseDate(
                        data["Punch Out Time"] || data["Punch Out Time "]
                    ),
                    punch_in_type: safeString(data["Punch In Type"]),
                    punch_out_type: safeString(data["Punch Out Type"]),
                    regular_duration: safeParseFloat(data["Regular Duration"]),
                    ot_duration: safeParseFloat(data["OT Duration"]),
                    paid_duration: safeParseFloat(data["Paid Duration"]),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            })
            .on("end", async () => {
                try {
                    await Punch.destroy({ where: {} });
                    const inserted = await Punch.bulkCreate(punches);
                    console.log(`Seeded ${inserted.length} punches`);
                    resolve(inserted);
                } catch (error) {
                    console.error("Error seeding punches:", error);
                    reject(error);
                }
            })
            .on("error", (error) => {
                console.error("Error reading CSV:", error);
                reject(error);
            });
    });
}

module.exports = seedPunches;
