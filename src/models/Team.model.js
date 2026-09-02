import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const TeamModel = sequelize.define(
  "Team",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    captainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    paranoid: true,
  },
);
