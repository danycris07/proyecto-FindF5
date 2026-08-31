import { body, param } from "express-validator";
import { TeamModel } from "../models/team.model.js";
import { UserModel } from "../models/user.model.js";

export const createTeamValidation = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser texto")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto"),

  body("captainId")
    .isInt()
    .withMessage("El captainId debe ser entero")
    .custom(async (captainId) => {
      const usuario = await UserModel.findByPk(captainId);

      if (!usuario) {
        throw new Error("El capitán no existe");
      }

      return true;
    }),
];

export const getTeamByIdValidation = [
  param("id")
    .isInt()
    .withMessage("El id debe ser entero")
    .custom(async (id) => {
      const equipo = await TeamModel.findByPk(id);

      if (!equipo) {
        throw new Error("El equipo no existe");
      }

      return true;
    }),
];