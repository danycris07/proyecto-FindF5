import { sequelize } from "../config/database.js";
const { DataTypes } = sequelize;

export const FieldReservationModel = sequelize.define(
  "FieldReservation",
  {
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "fields",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT", // No borra al usuario si tiene una reserva
    },
    date: {
      type: DataTypes.DATEONLY, // YYYY-MM-DD (Ej: '2026-08-25') - Solo la fecha
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME, // HH:MM:SS (Ej: '21:00:00') - Hora de inicio
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME, // HH:MM:SS (Ej: '22:00:00') - Hora de fin
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELLED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
  },
  {
    paranoid: true,
  },
);
