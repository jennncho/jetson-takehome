const seedEmployees = require("./employeeSeed");
const seedPunches = require("./punchSeed");
const seedDepartments = require("./departmentSeed");

async function seed() {
    try {
        console.log("🌱 Starting full seed...");

        // Run individual seeders in order
        await seedDepartments();
        await seedEmployees();
        await seedPunches();

        console.log("✅ All data seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
