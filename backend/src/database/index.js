import "dotenv/config";
import { createDatabaseConnection } from "./connection.js";
import { defineModels } from "../models/index.js";

export const sequelize = createDatabaseConnection();
export const models = defineModels(sequelize);

export async function connectDatabase() {
  await sequelize.authenticate();
}
