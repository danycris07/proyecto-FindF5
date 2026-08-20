import { sequelize } from "../config/database.js";
const { DataTypes } = sequelize;

export const UserModel = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("PLAYER", "FIELD_OWNER", "ADMIN"),
      defaultValue: "PLAYER",
    },
  },
  {
    paranoid: true,
  },
);
