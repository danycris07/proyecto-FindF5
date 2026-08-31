import { body, param } from "express-validator";
import { FieldModel } from "../models/field.model.js";
import { UserModel } from "../models/user.model.js";

export const createFieldValidation = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser texto")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("address")
    .isString()
    .withMessage("La dirección debe ser texto")
    .notEmpty()
    .withMessage("La dirección es obligatoria"),

  body("latitude")
    .optional()
    .isDecimal()
    .withMessage("La latitud no es válida"),

  body("longitude")
    .optional()
    .isDecimal()
    .withMessage("La longitud no es válida"),

  body("price")
    .isDecimal()
    .withMessage("El precio debe ser decimal"),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto"),

  body("ownerId")
    .isInt()
    .withMessage("El ownerId debe ser entero")
    .custom(async (ownerId) => {
      const usuario = await UserModel.findByPk(ownerId);

      if (!usuario) {
        throw new Error("El dueño no existe");
      }

      return true;
    }),
];

export const getFieldByIdValidation = [
  param("id")
    .isInt()
    .withMessage("El id debe ser entero")
    .custom(async (id) => {
      const cancha = await FieldModel.findByPk(id);

      if (!cancha) {
        throw new Error("La cancha no existe");
      }

      return true;
    }),
];