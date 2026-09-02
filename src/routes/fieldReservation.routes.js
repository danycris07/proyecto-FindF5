// src/routes/fieldReservation.routes.js
import { Router } from "express";

import {
  obtenerTodasLasReservas,
  obtenerReservaPorId,
  crearReserva,
  cancelarReserva,
} from "../controllers/fieldReservation.controller.js";

import {
  createReservationValidation,
  // getReservationByIdValidation // <-- Descomentá esto si tenés la validación del ID en tu archivo de validaciones
} from "../middlewares/validations/fieldReservation.validation.js";

import { validate as validarCampos } from "../middlewares/validate.js";

const router = Router();

// Obtener todas las reservas (ideal para el panel del dueño de la cancha)
router.get("/", obtenerTodasLasReservas);

// Obtener una reserva por ID
router.get(
  "/:id",
  // getReservationByIdValidation,
  validarCampos,
  obtenerReservaPorId,
);

// Crear una nueva reserva (validando superposición de horarios)
router.post("/", createReservationValidation, validarCampos, crearReserva);

// Cancelar una reserva (cambia el estado a CANCELLED)
router.put(
  "/:id/cancel",
  // getReservationByIdValidation,
  validarCampos,
  cancelarReserva,
);

export default router;
