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
// "use strict";
// const { Model } = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
//     class Employee extends Model {
//         /**
//          * Helper method for defining associations.
//          * This method is not a part of Sequelize lifecycle.
//          * The `models/index` file will call this method automatically.
//          */
//         static associate(models) {
//             // define association here
//         }
//     }
//     Employee.init(
//         {
//             employee_id: DataTypes.STRING,
//             first_name: DataTypes.STRING,
//             last_name: DataTypes.STRING,
//             department: DataTypes.STRING,
//         },
//         {
//             sequelize,
//             modelName: "Employee",
//         }
//     );
//     return Employee;
// };
