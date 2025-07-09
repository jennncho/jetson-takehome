module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define(
        "Employee",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            department: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "Employees",
            timestamps: false,
            indexes: [
                {
                    fields: ["department"],
                },
            ],
        }
    );
    Employee.associate = function (models) {
        Employee.hasMany(models.Punch, {
            foreignKey: "employee_id",
            as: "punches",
        });
    };

    return Employee;
};
