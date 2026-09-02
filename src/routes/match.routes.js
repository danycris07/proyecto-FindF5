// src/routes/match.routes.js
import { Router } from "express";

import {
  obtenerTodosLosPartidos,
  obtenerPartidoPorId,
  crearPartido,
  eliminarPartido,
} from "../controllers/match.controller.js";

import {
  createMatchValidation,
  getMatchByIdValidation,
} from "../middlewares/validations/match.validation.js";

import { validate as validarCampos } from "../middlewares/validate.js";

const router = Router();

// Obtener todos los partidos
router.get("/", obtenerTodosLosPartidos);

// Obtener un partido por ID
router.get("/:id", getMatchByIdValidation, validarCampos, obtenerPartidoPorId);

// Crear un nuevo partido
router.post("/", createMatchValidation, validarCampos, crearPartido);

// Eliminar un partido (soft delete)
router.delete("/:id", getMatchByIdValidation, validarCampos, eliminarPartido);

export default router;
