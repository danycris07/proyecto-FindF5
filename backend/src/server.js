import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase, models, sequelize } from "./database/index.js";
import { createAuthRouter } from "./routes/auth.routes.js";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT debe ser un número entero entre 1 y 65535.");
}

await connectDatabase();
const authRouter = createAuthRouter({ models, sequelize });
const app = createApp({ authRouter });

app.listen(port, () => {
  console.log(`FindF5 API escuchando en el puerto ${port}.`);
});
