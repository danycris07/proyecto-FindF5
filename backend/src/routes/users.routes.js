import { Router } from "express";
import { param, validationResult } from "express-validator";
import { createRequireAuth } from "../middleware/require-auth.js";

function publicProfile(user) {
  const attendanceRate =
    user.reputation?.attendanceRate ?? user.reputation?.attendance ?? null;
  const profileType =
    user.role === "FIELD_OWNER"
      ? "Dueño de cancha"
      : user.role === "ADMIN"
        ? "Administrador"
        : user.position === "GOALKEEPER"
          ? "Arquero"
          : "Jugador de campo";

  return {
    id: user.id,
    name: user.name,
    profileType,
    dominantFoot: user.role === "PLAYER" ? user.dominantFoot : null,
    reputation: attendanceRate == null
      ? { attendanceRate: null, label: "Nuevo" }
      : {
          attendanceRate,
          label: `${attendanceRate}% Asistencia`,
        },
    ...(user.isPhoneVisible && user.phone ? { phone: user.phone } : {}),
  };
}

export function createUsersRouter({ models }) {
  const router = Router();
  const requireAuth = createRequireAuth(models);

  router.get(
    "/:id/profile",
    requireAuth,
    param("id").isInt({ min: 1 }).toInt(),
    (request, response, next) => {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(400).json({
          message: "El identificador del jugador no es válido.",
        });
      }
      return next();
    },
    async (request, response) => {
      const user = await models.User.findByPk(request.params.id);
      if (!user) {
        return response.status(404).json({ message: "No encontramos ese jugador." });
      }
      return response.status(200).json(publicProfile(user));
    },
  );

  return router;
}
