import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes.js";

export function createApp({ authRouter, matchesRouter, fieldsRouter } = {}) {
  const app = express();
  const allowedOrigin =
    process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

  app.use(
    cors({
      origin: (origin, callback) =>
        callback(null, !origin || origin === allowedOrigin),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "16kb" }));
  app.use("/api/health", healthRouter);
  if (authRouter) {
    app.use("/api/auth", authRouter);
  }
  if (matchesRouter) {
    app.use("/api/matches", matchesRouter);
  }
  if (fieldsRouter) {
    app.use("/api/fields", fieldsRouter);
  }
  app.use((_request, response) =>
    response.status(404).json({ message: "No encontramos esa ruta." }),
  );
  app.use((error, _request, response, _next) => {
    if (error?.type === "entity.parse.failed") {
      return response.status(400).json({ message: "El cuerpo JSON no es válido." });
    }

    console.error(error);
    return response.status(500).json({ message: "Ocurrió un error interno." });
  });

  return app;
}
