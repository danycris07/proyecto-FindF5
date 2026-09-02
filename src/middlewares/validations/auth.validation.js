import { body } from "express-validator";
import { UserModel } from "../../models/user.model.js";

export const registerValidation = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser texto")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("email")
    .isEmail()
    .withMessage("Debe ingresar un email válido")
    .normalizeEmail()
    .bail()
    .custom(async (email) => {
      const usuario = await UserModel.findOne({
        where: { email },
      });

      if (usuario) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  body("password")
    .isString()
    .withMessage("La contraseña debe ser texto")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),

  body("phone")
    .isString()
    .withMessage("El teléfono debe ser texto")
    .notEmpty()
    .withMessage("El teléfono es obligatorio"),

  body("role")
    .optional()
    .isIn(["PLAYER", "FIELD_OWNER", "ADMIN"])
    .withMessage("El rol no es válido"),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Debe ingresar un email válido")
    .normalizeEmail()
    .notEmpty()
    .withMessage("El email es obligatorio"),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
