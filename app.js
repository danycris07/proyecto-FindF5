import "dotenv/config";

import express from "express";

import { startDB } from "./src/config/database.js";

const PORT = process.env.PORT;
const app = express();
app.use(express.json());

app.listen(PORT, async () => {
  await startDB();
  console.log("Base corriendo en puerto:", PORT);
});
