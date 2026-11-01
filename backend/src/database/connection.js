import { Sequelize } from "sequelize";

const REQUIRED_DATABASE_VARIABLES = [
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
];

export function getDatabaseConfig(env = process.env) {
  const missingVariables = REQUIRED_DATABASE_VARIABLES.filter(
    (name) =>
      typeof env[name] !== "string" ||
      (name !== "DB_PASSWORD" && env[name].trim().length === 0),
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Faltan variables de entorno para MySQL: ${missingVariables.join(", ")}.`,
    );
  }

  const port = Number(env.DB_PORT ?? 3306);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DB_PORT debe ser un número entero entre 1 y 65535.");
  }

  return {
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port,
  };
}

export function createDatabaseConnection(env = process.env) {
  const config = getDatabaseConfig(env);

  return new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  });
}
