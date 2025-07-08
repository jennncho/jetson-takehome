const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log("Database connected successfully!");

        // Sync database (creates tables if they don't exist)
        // await sequelize.sync();
        // console.log("Database synchronized successfully!");

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} 🚀`);
        });
    } catch (error) {
        console.error("Unable to start server:", error);
        process.exit(1);
    }
}

startServer();
