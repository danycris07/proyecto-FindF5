// src/routes/user.routes.js
import { Router } from "express";
import {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  eliminarUsuario,
} from "../controllers/user.controller.js";

import {
  createUserValidation,
  getUserByIdValidation,
} from "../middlewares/validations/user.validation.js";

import { validate as validarCampos } from "../middlewares/validate.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", obtenerTodosLosUsuarios);

// Obtener un usuario por ID
router.get("/:id", getUserByIdValidation, validarCampos, obtenerUsuarioPorId);

// Crear un nuevo usuario
router.post("/", createUserValidation, validarCampos, crearUsuario);

// Eliminar un usuario (soft delete)
router.delete("/:id", getUserByIdValidation, validarCampos, eliminarUsuario);

export default router;
