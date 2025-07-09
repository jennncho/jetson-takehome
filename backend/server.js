// const app = require("./app");
// const { sequelize } = require("./models");

// const PORT = process.env.PORT || 5000;

// async function startServer() {
//     try {
//         // Test database connection
//         await sequelize.authenticate();
//         console.log("Database connected successfully!");

//         // Start server
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT} 🚀`);
//         });
//     } catch (error) {
//         console.error("Unable to start server:", error);
//         process.exit(1);
//     }
// }

// startServer();

const app = require("./app");
const { sequelize, Employee, Punch, Department } = require("./models");

const PORT = process.env.PORT || 3001;

async function syncDatabase() {
    try {
        // Create tables in dependency order
        await Department.sync();
        await Employee.sync(); // Create employees table first
        await Punch.sync(); // Then create punches table

        console.log("Database synced successfully!");
    } catch (error) {
        console.error("Database sync failed:", error);
        throw error;
    }
}

async function startServer() {
    try {
        // Test database connection with retry logic for Docker
        await connectWithRetry();

        // Sync database (create tables if they don't exist)
        await syncDatabase();
        console.log("Database synced successfully!");

        // Start server
        app.listen(PORT, "0.0.0.0", () => {
            // Added '0.0.0.0' for Docker
            console.log(`Server is running on port ${PORT} 🚀`);
        });
    } catch (error) {
        console.error("Unable to start server:", error);
        process.exit(1);
    }
}

// Retry connection logic for Docker (database might take time to start)
async function connectWithRetry() {
    const maxRetries = 10;
    const delay = 5000; // 5 seconds

    for (let i = 0; i < maxRetries; i++) {
        try {
            await sequelize.authenticate();
            console.log("Database connected successfully!");
            return;
        } catch (error) {
            console.log(
                `Database connection attempt ${i + 1}/${maxRetries} failed:`,
                error.message
            );

            if (i === maxRetries - 1) {
                throw error;
            }

            console.log(`Retrying in ${delay / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

startServer();
