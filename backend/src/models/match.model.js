import { DataTypes } from "sequelize";
import { MATCH_STATUSES } from "./enums.js";

export function defineMatch(sequelize) {
  return sequelize.define(
    "Match",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      teamId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      fieldId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      fieldName: {
        type: DataTypes.STRING(160),
        allowNull: false,
        validate: { notEmpty: true },
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
        allowNull: true,
      },
      expectedPlayers: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: { min: 1 },
      },
      organizerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      organizerPlays: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      outsideSlots: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      playingForCoca: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      basePricePerPlayer: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
      },
      cocaAmountPerPlayer: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      pricePerPlayer: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
      },
      status: {
        type: DataTypes.ENUM(...MATCH_STATUSES),
        allowNull: false,
        defaultValue: "OPEN",
      },
    },
    {
      tableName: "matches",
      paranoid: true,
    },
  );
}

export function defineMatchParticipant(sequelize) {
  return sequelize.define(
    "MatchParticipant",
    {
      matchId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "match_participants",
      timestamps: false,
    },
  );
}
