import { body, param } from "express-validator";
import { PlayerApplicationModel } from "../models/playerApplication.model.js";
import { PlayerRequestModel } from "../models/playerRequest.model.js";
import { UserModel } from "../models/user.model.js";

export const createPlayerApplicationValidation = [
  body("playerRequestId")
    .isInt()
    .withMessage("El playerRequestId debe ser entero")
    .custom(async (playerRequestId) => {
      const solicitud = await PlayerRequestModel.findByPk(playerRequestId);

      if (!solicitud) {
        throw new Error("La búsqueda no existe");
      }

      if (solicitud.status !== "OPEN") {
        throw new Error("La búsqueda ya no está disponible");
      }

      return true;
    }),

  body("userId")
    .isInt()
    .withMessage("El userId debe ser entero")
    .custom(async (userId) => {
      const usuario = await UserModel.findByPk(userId);

      if (!usuario) {
        throw new Error("El usuario no existe");
      }

      return true;
    })
    .custom(async (userId, { req }) => {
      const { playerRequestId } = req.body;

      const solicitudExistente =
        await PlayerApplicationModel.findOne({
          where: {
            playerRequestId,
            userId,
            status: ["PENDING", "ACCEPTED"],
          },
        });

      if (solicitudExistente) {
        throw new Error("El usuario ya se postuló a esta búsqueda");
      }

      return true;
    }),
];

export const getPlayerApplicationByIdValidation = [
  param("id")
    .isInt()
    .withMessage("El id debe ser entero")
    .custom(async (id) => {
      const aplicacion = await PlayerApplicationModel.findByPk(id);

      if (!aplicacion) {
        throw new Error("La solicitud no existe");
      }

      return true;
    }),
];