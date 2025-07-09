module.exports = {
    development: {
        username: process.env.DB_USER || "jennycho",
        password: process.env.DB_PASSWORD || "stophacking",
        database: process.env.DB_NAME || "jetson_punch_db",
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        logging: false,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
    },
};
// module.exports = {
//     "development": {
//         "username": "jennycho",
//         "password": "stophacking",
//         "database": "jetson_punch_db",
//         "host": "127.0.0.1",
//         "dialect": "postgres",
//         "port": 5432,
//         "logging": false
//     },
//     "docker": {
//         "username": "jennycho",
//         "password": "stophacking",
//         "database": "jetson_punch_db",
//         "host": "database",
//         "port": 5432,
//         "dialect": "postgres",
//         "pool": {
//             "max": 5,
//             "min": 0,
//             "acquire": 30000,
//             "idle": 10000
//         }
//     },
//     "test": {
//         "username": "root",
//         "password": null,
//         "database": "database_test",
//         "host": "127.0.0.1",
//         "dialect": "mysql"
//     },
//     "production": {
//         "username": "jennycho",
//         "password": "stophacking",
//         "database": "jetson_punch_db",
//         "host": "database",
//         "port": 5432,
//         "dialect": "postgres",
//         "pool": {
//             "max": 5,
//             "min": 0,
//             "acquire": 30000,
//             "idle": 10000
//         }
//     }
// }
