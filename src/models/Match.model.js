import { sequelize } from "../config/database.js";
const { DataTypes } = sequelize;

export const MatchModel = sequelize.define(
  "Match",
  {
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "teams",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Si se borra el equipo organizador, se cancela el partido
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: true, //  null temporalmente si el equipo que busca rival aún no reservó cancha
      references: {
        model: "fields",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Si borran la cancha, el partido queda sin sede pero no se borra
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    pricePerPlayer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("OPEN", "FULL", "FINISHED", "CANCELLED"),
      defaultValue: "OPEN", //abierto para que se sume jugadores o rivales
      allowNull: false,
    },
  },
  {
    paranoid: true,
  },
);
