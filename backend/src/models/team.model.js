import { DataTypes } from "sequelize";

export function defineTeam(sequelize) {
  return sequelize.define(
    "Team",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      captainId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "teams",
      paranoid: true,
    },
  );
}

export function defineTeamMember(sequelize) {
  return sequelize.define(
    "TeamMember",
    {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      teamId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
      },
    },
    {
      tableName: "team_members",
      timestamps: false,
    },
  );
}
