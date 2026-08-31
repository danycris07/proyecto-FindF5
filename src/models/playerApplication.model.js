import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const PlayerApplicationModel = sequelize.define(
  "PlayerApplication",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    playerRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Obligatorio saber a qué publicación se está postulando
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Obligatorio saber qué pibe se postula
    },
    status: {
      type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED", "CANCELLED"),
      defaultValue: "PENDING", // Cuando toca el botón, queda en espera de que lo acepten
    },
  },
  {
    paranoid: true,
  },
);
