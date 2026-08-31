import { body, param } from "express-validator";
import { Op } from "sequelize";
import { FieldReservationModel } from "../models/fieldReservation.model.js";
import { FieldModel } from "../models/field.model.js";
import { UserModel } from "../models/user.model.js";

export const createReservationValidation = [
  body("fieldId")
    .isInt()
    .withMessage("El fieldId debe ser entero")
    .custom(async (fieldId) => {
      const cancha = await FieldModel.findByPk(fieldId);

      if (!cancha) {
        throw new Error("La cancha no existe");
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
    }),

  body("date")
    .isISO8601()
    .withMessage("La fecha no es válida"),

  body("startTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    .withMessage("La hora de inicio no es válida"),

  body("endTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    .withMessage("La hora de finalización no es válida"),

  body("endTime").custom(async (endTime, { req }) => {
    const { fieldId, date, startTime } = req.body;

    if (endTime <= startTime) {
      throw new Error(
        "La hora de finalización debe ser posterior a la hora de inicio"
      );
    }

    const reserva = await FieldReservationModel.findOne({
      where: {
        fieldId,
        date,
        status: {
          [Op.in]: ["PENDING", "CONFIRMED"],
        },
        startTime: {
          [Op.lt]: endTime,
        },
        endTime: {
          [Op.gt]: startTime,
        },
      },
    });

    if (reserva) {
      throw new Error(
        "La cancha ya está reservada en ese horario"
      );
    }

    return true;
  }),
];