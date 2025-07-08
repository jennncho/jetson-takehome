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

    Department.associate = function (models) {
        Department.hasMany(models.Employee, {
            foreignKey: "department_id",
            as: "employees",
        });
    };

    return Department;
};

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Department extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Department.init({
//     name: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Department',
//   });
//   return Department;
// };
