import "dotenv/config";
import { hashPassword } from "../src/auth/password.js";
import { sequelize, models } from "../src/database/index.js";

const name = process.env.ADMIN_NAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!name || name.length < 2 || !email || !password || password.length < 12) {
  throw new Error(
    "Configurá ADMIN_NAME, ADMIN_EMAIL y una ADMIN_PASSWORD de al menos 12 caracteres en .env.",
  );
}

try {
  await sequelize.authenticate();

  const existingUser = await models.User.findOne({ where: { email } });
  if (existingUser) {
    if (existingUser.role === "ADMIN") {
      console.log("La cuenta administradora ya existe; no se realizaron cambios.");
      process.exitCode = 0;
    } else {
      throw new Error(
        "El email indicado ya pertenece a una cuenta que no es administradora.",
      );
    }
  } else {
    await models.User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      role: "ADMIN",
    });
    console.log("Se creó la cuenta administradora inicial.");
  }
} finally {
  await sequelize.close();
}
