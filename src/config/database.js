import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
);

export const startDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("Base conectada correctamente");
  } catch (error) {
    console.error("No se pudo conectar a la BD", error);
  }
};
