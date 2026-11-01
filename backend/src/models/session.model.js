import { DataTypes } from "sequelize";

export function defineSession(sequelize) {
  return sequelize.define(
    "Session",
    {
      tokenHash: {
        type: DataTypes.STRING(64),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "sessions",
      updatedAt: false,
      indexes: [{ fields: ["expires_at"] }],
    },
  );
}
