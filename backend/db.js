const { Sequelize } = require("sequelize");

let sequelize;

module.exports = async () => {
    try {
        // Create Sequelize instance
        sequelize = new Sequelize(
            process.env.DB_NAME || 'postgres',
            process.env.DB_USERNAME || 'admin',
            process.env.DB_PASSWORD || 'password123',
            {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                dialect: 'postgres',
                logging: false, // Set to console.log to see SQL queries
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        );

        // Test the connection
        await sequelize.authenticate();
        console.log("Connected to PostgreSQL database.");

        // Sync all models (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log("Database synchronized.");

        return sequelize;
    } catch (error) {
        console.log("Could not connect to database.", error);
        throw error;
    }
};

module.exports.getSequelize = () => sequelize;
