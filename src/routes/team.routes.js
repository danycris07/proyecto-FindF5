// src/routes/team.routes.js
import { Router } from "express";

import {
  obtenerTodosLosEquipos,
  obtenerEquipoPorId,
  crearEquipo,
  eliminarEquipo,
} from "../controllers/team.controller.js";

import {
  createTeamValidation,
  getTeamByIdValidation,
} from "../middlewares/validations/team.validation.js";

import { validate as validarCampos } from "../middlewares/validate.js";

const router = Router();

// Obtener todos los equipos
router.get("/", obtenerTodosLosEquipos);

// Obtener un equipo por ID
router.get("/:id", getTeamByIdValidation, validarCampos, obtenerEquipoPorId);

// Crear un nuevo equipo
router.post("/", createTeamValidation, validarCampos, crearEquipo);

// Eliminar un equipo (soft delete)
router.delete("/:id", getTeamByIdValidation, validarCampos, eliminarEquipo);

export default router;
