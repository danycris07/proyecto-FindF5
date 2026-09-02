import { body, param } from "express-validator";
import { MatchModel } from "../../models/match.model.js";
import { TeamModel } from "../../models/team.model.js";
import { FieldModel } from "../../models/field.model.js";

export const createMatchValidation = [
  body("teamId")
    .isInt()
    .withMessage("El teamId debe ser entero")
    .bail()
    .custom(async (teamId) => {
      const equipo = await TeamModel.findByPk(teamId);

      if (!equipo) {
        throw new Error("El equipo no existe");
      }

      return true;
    }),

  body("fieldId")
    .optional()
    .isInt()
    .withMessage("El fieldId debe ser entero")
    .bail()
    .custom(async (fieldId) => {
      const cancha = await FieldModel.findByPk(fieldId);

      if (!cancha) {
        throw new Error("La cancha no existe");
      }

      return true;
    }),

  body("date").isISO8601().withMessage("La fecha no es válida"),

  body("startTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    .withMessage("La hora de inicio no es válida"),

  body("endTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    .withMessage("La hora de finalización no es válida"),

  body("pricePerPlayer").isDecimal().withMessage("El precio debe ser decimal"),

  body("maxPlayers")
    .isInt({ min: 1 })
    .withMessage("Debe haber al menos un jugador"),
];

export const getMatchByIdValidation = [
  param("id")
    .isInt()
    .withMessage("El id debe ser entero")
    .bail()
    .custom(async (id) => {
      const partido = await MatchModel.findByPk(id);

      if (!partido) {
        throw new Error("El partido no existe");
      }

      return true;
    }),
];
