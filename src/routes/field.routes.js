// src/routes/field.routes.js
import { Router } from "express";

import {
  obtenerTodasLasCanchas,
  obtenerCanchaPorId,
  crearCancha,
  eliminarCancha,
} from "../controllers/field.controller.js";

import {
  createFieldValidation,
  getFieldByIdValidation,
} from "../middlewares/validations/field.validation.js";

import { validate as validarCampos } from "../middlewares/validate.js";

const router = Router();

// Obtener todas las canchas
router.get("/", obtenerTodasLasCanchas);

// Obtener una cancha por ID
router.get("/:id", getFieldByIdValidation, validarCampos, obtenerCanchaPorId);

// Registrar una nueva cancha
router.post("/", createFieldValidation, validarCampos, crearCancha);

// Eliminar una cancha (soft delete)
router.delete("/:id", getFieldByIdValidation, validarCampos, eliminarCancha);

export default router;
