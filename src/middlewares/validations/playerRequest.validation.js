import { body, param } from "express-validator";
import { PlayerRequestModel } from "../models/playerRequest.model.js";
import { MatchModel } from "../models/match.model.js";

export const createPlayerRequestValidation = [
  body("matchId")
    .isInt()
    .withMessage("El matchId debe ser entero")
    .custom(async (matchId) => {
      const partido = await MatchModel.findByPk(matchId);

      if (!partido) {
        throw new Error("El partido no existe");
      }

      return true;
    }),

  body("playersNeeded")
    .isInt({ min: 1 })
    .withMessage("Debe buscar al menos un jugador"),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto"),
];

export const getPlayerRequestByIdValidation = [
  param("id")
    .isInt()
    .withMessage("El id debe ser entero")
    .custom(async (id) => {
      const solicitud = await PlayerRequestModel.findByPk(id);

      if (!solicitud) {
        throw new Error("La búsqueda de jugadores no existe");
      }

      return true;
    }),
];