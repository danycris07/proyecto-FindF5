import { DataTypes } from "sequelize";
import { DOMINANT_FOOTS, PLAYER_POSITIONS, USER_ROLES } from "./enums.js";

export function defineUser(sequelize) {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: { notEmpty: true },
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
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      isPhoneVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      role: {
        type: DataTypes.ENUM(...USER_ROLES),
        allowNull: false,
        defaultValue: "PLAYER",
      },
      position: {
        type: DataTypes.ENUM(...PLAYER_POSITIONS),
        allowNull: true,
        validate: {
          matchesRole() {
            if (this.role !== "PLAYER" && this.position) {
              throw new Error("Solo los jugadores pueden tener una posición.");
            }
          },
        },
      },
      dominantFoot: {
        type: DataTypes.ENUM(...DOMINANT_FOOTS),
        allowNull: true,
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
