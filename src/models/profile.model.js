import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ProfileModel = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.ENUM(
        "ARQUERO",
        "DEFENSOR",
        "MEDIOCAMPISTA",
        "DELANTERO",
        "COMODIN",
      ),
      defaultValue: "COMODIN",
    },
    strongFoot: {
      type: DataTypes.ENUM("DERECHO", "IZQUIERDO", "AMBIDIESTRO"),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    paranoid: true,
  },
);
