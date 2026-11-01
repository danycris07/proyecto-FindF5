import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase } from "./database/index.js";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT debe ser un número entero entre 1 y 65535.");
}

const app = createApp();

await connectDatabase();

app.listen(port, () => {
  console.log(`FindF5 API escuchando en el puerto ${port}.`);
});
