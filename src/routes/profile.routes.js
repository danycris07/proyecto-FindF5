// src/routes/profile.routes.js
import { Router } from "express";

import {
  obtenerTodosLosProfiles,
  obtenerProfilePorId,
  crearProfile,
  actualizarProfile,
  eliminarProfile,
  actualizarProfileImage,
} from "../controllers/profile.controller.js";

import {
  crearProfileValidation,
  obtenerProfileValidation,
  actualizarProfileValidation,
  eliminarProfileValidation,
  actualizarProfileImageValidation,
} from "../middlewares/validations/profile.validation.js";

import { validate as validarCampos } from "../middlewares/validate.js";

const router = Router();

// Obtener todos los perfiles
router.get("/", obtenerTodosLosProfiles);

// Obtener un perfil por ID
router.get(
  "/:id",
  obtenerProfileValidation,
  validarCampos,
  obtenerProfilePorId,
);

// Crear un nuevo perfil
router.post("/", crearProfileValidation, validarCampos, crearProfile);

// Actualizar los datos de texto de un perfil (nickname, bio, etc.)
router.put(
  "/:id",
  actualizarProfileValidation,
  validarCampos,
  actualizarProfile,
);

// Eliminar un perfil (soft delete)
router.delete(
  "/:id",
  eliminarProfileValidation,
  validarCampos,
  eliminarProfile,
);

// Actualizar SOLO la imagen de perfil
router.patch(
  "/:id/image",
  actualizarProfileImageValidation,
  validarCampos,
  // uploadProfileImage.single('profileImage'),
  actualizarProfileImage,
);

export default router;
