import "dotenv/config";

if (process.env.NODE_ENV === "production") {
  throw new Error("db:sync solo está disponible fuera de producción.");
}

const { sequelize } = await import("../src/database/index.js");

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: false, force: false });
  console.log("Las tablas existentes se conservaron y las faltantes se crearon.");
} finally {
  await sequelize.close();
}
