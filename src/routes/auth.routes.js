// src/routes/auth.routes.js
import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/validations/auth.validation.js";
import { validate as validarCampos } from "../middlewares/validate.js";

const router = Router();

// Registro de usuario
router.post("/register", registerValidation, validarCampos, register);

// Login de usuario
router.post("/login", loginValidation, validarCampos, login);

export default router;