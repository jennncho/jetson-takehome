module.exports = (sequelize, DataTypes) => {
    const Punch = sequelize.define(
        "Punch",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            work_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            punch_in_time: {
                type: DataTypes.TIME,
                allowNull: true,
            },
            punch_out_time: {
                type: DataTypes.TIME,
                allowNull: true,
            },
            punch_in_type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["Clock In", "Non-Work"]],
                },
            },
            punch_out_type: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isIn: [["Clock Out", null]],
                },
            },
            regular_duration: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            ot_duration: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            paid_duration: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
        },
        {
            tableName: "Punches",
            timestamps: false,
            indexes: [
                {
                    fields: ["employee_id"],
                },
                {
                    fields: ["work_date"],
                },
                {
                    fields: ["employee_id", "work_date"],
                },
            ],
        }
    );
    Punch.associate = function (models) {
        Punch.belongsTo(models.Employee, {
            foreignKey: "employee_id",
            as: "employee",
        });
    };

    return Punch;
};
