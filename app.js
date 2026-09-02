// app.js

import "dotenv/config";

import express from "express";

import { startDB } from "./src/config/database.js";

// Importar relaciones
import "./src/models/relaciones.js";

// Importar rutas
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import teamRoutes from "./src/routes/team.routes.js";
import matchRoutes from "./src/routes/match.routes.js";
import playerRequestRoutes from "./src/routes/playerRequest.routes.js";
import playerApplicationRoutes from "./src/routes/playerApplication.routes.js";
import fieldRoutes from "./src/routes/field.routes.js";
import fieldReservationRoutes from "./src/routes/fieldReservation.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/player-requests", playerRequestRoutes);
app.use("/api/player-applications", playerApplicationRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/reservations", fieldReservationRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API de Fútbol 5 funcionando correctamente",
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  await startDB();

  console.log("Servidor corriendo en puerto:", PORT);
});