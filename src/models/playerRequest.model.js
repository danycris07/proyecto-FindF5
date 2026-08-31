import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

export const PlayerRequestModel = sequelize.define(
  "PlayerRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playersNeeded: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Al menos tienen que buscar 1 jugador
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("OPEN", "CLOSED", "CANCELLED"),
      defaultValue: "OPEN",
    },
  },
  { paranoid: true },
);
