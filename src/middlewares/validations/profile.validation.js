import { body, param } from "express-validator";

import { ProfileModel } from "../models/profile.model.js";
import { UserModel } from "../models/user.model.js";

export const crearProfileValidation = [
  body("userId")
    .notEmpty()
    .withMessage("El userId es obligatorio")
    .isInt()
    .withMessage("El userId debe ser un número entero")
    .bail()
    .custom(async (userId) => {
      const usuario = await UserModel.findByPk(userId);

      if (!usuario) {
        throw new Error("El usuario no existe");
      }

      const profile = await ProfileModel.findOne({
        where: { userId },
      });

      if (profile) {
        throw new Error("El usuario ya tiene un perfil");
      }

      return true;
    }),

  body("nickname")
    .isString()
    .withMessage("El nickname debe ser un texto")
    .trim()
    .isLength({ max: 100 })
    .withMessage("El nickname no puede superar los 100 caracteres"),

  body("position")
    .optional()
    .isIn(["ARQUERO", "DEFENSOR", "MEDIOCAMPISTA", "DELANTERO", "COMODIN"])
    .withMessage("La posición no es válida"),

  body("strongFoot")
    .optional()
    .isIn(["DERECHO", "IZQUIERDO", "AMBIDIESTRO"])
    .withMessage("La pierna hábil no es válida"),

  body("bio")
    .optional()
    .isString()
    .withMessage("La bio debe ser un texto")
    .bail()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("La bio no puede superar los 1000 caracteres"),
];

export const obtenerProfileValidation = [
  param("id")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isInt()
    .withMessage("El id debe ser un número entero")
    .bail()
    .custom(async (id) => {
      const profile = await ProfileModel.findByPk(id);

      if (!profile) {
        throw new Error("El perfil no existe");
      }

      return true;
    }),
];

export const actualizarProfileValidation = [
  param("id")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isInt()
    .withMessage("El id debe ser un número entero")
    .bail()
    .custom(async (id) => {
      const profile = await ProfileModel.findByPk(id);

      if (!profile) {
        throw new Error("El perfil no existe");
      }

      return true;
    }),

  body("nickname")
    .optional()
    .isString()
    .withMessage("El nickname debe ser un texto")
    .bail()
    .trim()
    .isLength({ max: 100 })
    .withMessage("El nickname no puede superar los 100 caracteres"),

  body("position")
    .optional()
    .isIn(["ARQUERO", "DEFENSOR", "MEDIOCAMPISTA", "DELANTERO", "COMODIN"])
    .withMessage("La posición no es válida"),

  body("strongFoot")
    .optional()
    .isIn(["DERECHO", "IZQUIERDO", "AMBIDIESTRO"])
    .withMessage("La pierna hábil no es válida"),

  body("bio")
    .optional()
    .isString()
    .withMessage("La bio debe ser un texto")
    .bail()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("La bio no puede superar los 1000 caracteres"),
];

export const eliminarProfileValidation = [
  param("id")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isInt()
    .withMessage("El id debe ser un número entero")
    .bail()
    .custom(async (id) => {
      const profile = await ProfileModel.findByPk(id);

      if (!profile) {
        throw new Error("El perfil no existe");
      }

      return true;
    }),
];

export const actualizarProfileImageValidation = [
  param("id")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isInt()
    .withMessage("El id debe ser un número entero")
    .bail()
    .custom(async (id) => {
      const profile = await ProfileModel.findByPk(id);

      if (!profile) {
        throw new Error("El perfil no existe");
      }

      return true;
    }),
];
