import { randomUUID } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import express, { Router } from "express";
import { param, validationResult } from "express-validator";
import { createRequireAuth } from "../middleware/require-auth.js";
import {
  defaultProfilePhotoUrl,
  ensureProfilePhotoDirectory,
  getProfilePhotoFilePath,
  PROFILE_PHOTO_DIRECTORY,
  PROFILE_PHOTO_PATH,
} from "../services/profile-photos.js";

const PHOTO_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function publicProfile(user) {
  const profile = user.profile ?? user;
  // Attendance is not considered verified until organizers can confirm it.
  // Do not expose legacy reputation values that may be based on sign-ups.
  const attendanceRate = null;
  const profileType =
    user.role === "FIELD_OWNER"
      ? "Dueño de cancha"
      : user.role === "ADMIN"
        ? "Administrador"
      : profile.position === "GOALKEEPER"
          ? "Arquero"
          : "Jugador de campo";

  return {
    id: user.id,
    name: [profile.firstName, profile.lastName].filter(Boolean).join(" "),
    profilePhotoUrl: profile.profilePhotoUrl || defaultProfilePhotoUrl(user.id),
    profileType,
    dominantFoot: user.role === "PLAYER" ? profile.dominantFoot : null,
    reputation: attendanceRate == null
      ? { attendanceRate: null, label: "Nuevo" }
      : {
          attendanceRate,
          label: `${attendanceRate}% Asistencia`,
        },
    phoneAvailable: Boolean(profile.isPhoneVisible && profile.phone),
    ...(profile.isPhoneVisible && profile.phone ? { phone: profile.phone } : {}),
    ...(profile.isAddressVisible && profile.address ? { address: profile.address } : {}),
  };
}

export function createUsersRouter({ models }) {
  const router = Router();
  const requireAuth = createRequireAuth(models);

  router.post(
    "/me/profile-photo",
    requireAuth,
    express.raw({ type: Object.keys(PHOTO_TYPES), limit: "2mb" }),
    async (request, response, next) => {
      const contentType = request.get("content-type")?.split(";")[0].trim().toLowerCase();
      const extension = PHOTO_TYPES[contentType];
      if (!extension) {
        return response.status(415).json({ message: "SubÃ­ una imagen JPG, PNG o WebP." });
      }
      if (!Buffer.isBuffer(request.body) || request.body.length === 0) {
        return response.status(400).json({ message: "El archivo de imagen estÃ¡ vacÃ­o." });
      }

      await ensureProfilePhotoDirectory();
      const filename = `${request.authUser.id}-${randomUUID()}.${extension}`;
      const filePath = `${PROFILE_PHOTO_DIRECTORY}/${filename}`;
      const photoUrl = `${PROFILE_PHOTO_PATH}/${filename}`;
      const profile = request.authUser.profile;
      const previousPhotoPath = getProfilePhotoFilePath(profile?.profilePhotoUrl);

      try {
        await writeFile(filePath, request.body, { flag: "wx" });
        if (!profile) {
          request.authUser.profile = await models.Profile.create({ userId: request.authUser.id });
        }
        await request.authUser.profile.update({ profilePhotoUrl: photoUrl });
      } catch (error) {
        await unlink(filePath).catch(() => {});
        return next(error);
      }

      if (previousPhotoPath) await unlink(previousPhotoPath).catch(() => {});
      return response.status(200).json({
        user: { id: request.authUser.id, profilePhotoUrl: photoUrl },
      });
    },
  );

  router.get(
    "/:id/profile",
    requireAuth,
    param("id").isInt({ min: 1, max: 4294967295 }).toInt(),
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
      const user = await models.User.findByPk(request.params.id, {
        include: [{ model: models.Profile, as: "profile" }],
      });
      if (!user) {
        return response.status(404).json({ message: "No encontramos ese jugador." });
      }
      return response.status(200).json(publicProfile(user));
    },
  );

  return router;
}
