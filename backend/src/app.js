import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes.js";

export function createApp({
  authRouter,
  usersRouter,
  matchesRouter,
  fieldsRouter,
  adminRouter,
} = {}) {
  const app = express();
  const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.0.23:5173", // La IP exacta desde la que accede tu celular
    process.env.FRONTEND_ORIGIN,
  ].filter(Boolean));

  app.use(
    cors({
      origin: (origin, callback) =>
        callback(null, !origin || allowedOrigins.has(origin)),
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json({ limit: "16kb" }));
  app.use("/api/health", healthRouter);
  if (authRouter) {
    app.use("/api/auth", authRouter);
  }
  if (usersRouter) {
    app.use("/api/users", usersRouter);
  }
  if (matchesRouter) {
    app.use("/api/matches", matchesRouter);
  }
  if (fieldsRouter) {
    app.use("/api/fields", fieldsRouter);
  }
  if (adminRouter) {
    app.use("/api/admin", adminRouter);
  }
  app.use((_request, response) =>
    response.status(404).json({ message: "No encontramos esa ruta." }),
  );
  app.use((error, _request, response, _next) => {
    if (error?.type === "entity.parse.failed") {
      return response
        .status(400)
        .json({ message: "El cuerpo JSON no es válido." });
    }

    console.error(error);
    return response.status(500).json({ message: "Ocurrió un error interno." });
  });

  return app;
}
