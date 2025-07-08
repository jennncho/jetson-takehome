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
                references: {
                    model: "employees",
                    key: "id",
                },
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
// "use strict";
// const { Model } = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
//     class Punch extends Model {
//         /**
//          * Helper method for defining associations.
//          * This method is not a part of Sequelize lifecycle.
//          * The `models/index` file will call this method automatically.
//          */
//         static associate(models) {
//             // define association here
//         }
//     }
//     Punch.init(
//         {
//             employee_id: DataTypes.STRING,
//             work_date: DataTypes.DATEONLY,
//             punch_in_time: DataTypes.TIME,
//             punch_out_time: DataTypes.TIME,
//             punch_in_type: DataTypes.STRING,
//             punch_out_type: DataTypes.STRING,
//             regular_duration: DataTypes.DECIMAL,
//             ot_duration: DataTypes.DECIMAL,
//             paid_duration: DataTypes.DECIMAL,
//         },
//         {
//             sequelize,
//             modelName: "Punch",
//         }
//     );
//     return Punch;
// };
