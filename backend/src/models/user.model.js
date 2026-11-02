import { DataTypes } from "sequelize";
import { USER_ROLES } from "./enums.js";

export function defineUser(sequelize) {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...USER_ROLES),
        allowNull: false,
        defaultValue: "PLAYER",
      },
      reputation: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      paranoid: true,
    },
  );
}
