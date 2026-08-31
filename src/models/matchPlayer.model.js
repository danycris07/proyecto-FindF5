import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const MatchPlayerModel = sequelize.define(
  "MatchPlayer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "matches", // Tiene que coincidir con el tableName de MatchModel
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Si se borra el partido, se borran los jugadores anotados
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Si se borra el usuario, se lo saca del partido
    },
  },
  {
    paranoid: true,
    tableName: "match_players", // Buena práctica definir el nombre de la tabla
  },
);
