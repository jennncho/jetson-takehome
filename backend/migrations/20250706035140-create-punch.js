"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Punches", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            employee_id: {
                type: Sequelize.INTEGER,
            },
            work_date: {
                type: Sequelize.DATEONLY,
            },
            punch_in_time: {
                type: Sequelize.TIME,
            },
            punch_out_time: {
                type: Sequelize.TIME,
            },
            punch_in_type: {
                type: Sequelize.STRING,
            },
            punch_out_type: {
                type: Sequelize.STRING,
            },
            regular_duration: {
                type: Sequelize.DECIMAL,
            },
            ot_duration: {
                type: Sequelize.DECIMAL,
            },
            paid_duration: {
                type: Sequelize.DECIMAL,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Punches");
    },
};
