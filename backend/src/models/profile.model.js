import { DataTypes } from "sequelize";
import { DOMINANT_FOOTS, PLAYER_POSITIONS } from "./enums.js";

export function defineProfile(sequelize) {
  return sequelize.define(
    "Profile",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
      firstName: { type: DataTypes.STRING(120), allowNull: false },
      lastName: { type: DataTypes.STRING(120), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      profilePhotoUrl: { type: DataTypes.STRING(2048), allowNull: true },
      isPhoneVisible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      address: { type: DataTypes.STRING(160), allowNull: true },
      isAddressVisible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      position: { type: DataTypes.ENUM(...PLAYER_POSITIONS), allowNull: true },
      dominantFoot: { type: DataTypes.ENUM(...DOMINANT_FOOTS), allowNull: true },
    },
    { tableName: "profiles", underscored: true },
  );
}
