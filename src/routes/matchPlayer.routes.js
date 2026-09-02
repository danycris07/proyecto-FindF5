// src/routes/playerApplication.routes.js
import { Router } from "express";

import {
  crearSolicitudJugador,
  aceptarSolicitudJugador,
} from "../controllers/playerApplication.controller.js";

import {
  createPlayerApplicationValidation,
  acceptPlayerApplicationValidation,
} from "../validators/playerApplication.validator.js";

import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

// Postularse para jugar (el usuario toca "Quiero jugar")
router.post(
  "/",
  createPlayerApplicationValidation,
  validarCampos,
  crearSolicitudJugador,
);

// El capitán acepta la solicitud del usuario
router.put(
  "/:id/accept",
  acceptPlayerApplicationValidation,
  validarCampos,
  aceptarSolicitudJugador,
);

export default router;
