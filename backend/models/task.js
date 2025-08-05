const { DataTypes } = require("sequelize");
const { getSequelize } = require("../db");

const sequelize = getSequelize();

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    task: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'tasks',
    timestamps: true // Adds createdAt and updatedAt columns
});

module.exports = Task;
