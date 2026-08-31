import { param } from "express-validator";
import { PlayerApplicationModel } from "../models/playerApplication.model.js";

export const acceptPlayerApplicationValidation = [
  param("id")
    .isInt()
    .withMessage("El id debe ser entero")
    .custom(async (id) => {
      const solicitud = await PlayerApplicationModel.findByPk(id);

      if (!solicitud) {
        throw new Error("La solicitud no existe");
      }

      if (solicitud.status !== "PENDING") {
        throw new Error("La solicitud ya fue procesada");
      }

      return true;
    }),
];