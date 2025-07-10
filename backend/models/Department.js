module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define(
        "Department",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "Departments",
            timestamps: true,
            indexes: [
                {
                    fields: ["name"],
                    unique: true,
                },
            ],
        }
    );

    return Department;
};
