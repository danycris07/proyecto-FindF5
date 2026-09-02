// src/routes/playerRequest.routes.js
import { Router } from "express";

import {
  obtenerTodasLasBusquedas,
  obtenerBusquedaPorId,
  crearBusqueda,
} from "../controllers/playerRequest.controller.js";

import {
  createPlayerRequestValidation,
  getPlayerRequestByIdValidation,
} from "../middlewares/validations/playerRequest.validation.js";

import { validate } from "../middlewares/validate.js";

const router = Router();

// Obtener todas las publicaciones buscando jugadores
router.get("/", obtenerTodasLasBusquedas);

// Obtener una publicación específica por ID
router.get(
  "/:id",
  getPlayerRequestByIdValidation,
  validate,
  obtenerBusquedaPorId,
);

// Crear una nueva publicación buscando jugadores
router.post("/", createPlayerRequestValidation, validate, crearBusqueda);

export default router;
