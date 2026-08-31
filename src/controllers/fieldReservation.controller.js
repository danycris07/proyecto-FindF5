import { matchedData } from "express-validator";
import { FieldReservationModel } from "../models/fieldReservation.model.js";

export const obtenerTodasLasReservas = async (req, res) => {
  try {
    const reservas = await FieldReservationModel.findAll();

    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las reservas",
    });
  }
};

export const obtenerReservaPorId = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const reserva = await FieldReservationModel.findByPk(id);

    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la reserva",
    });
  }
};

export const crearReserva = async (req, res) => {
  try {
    const datos = matchedData(req);

    const reserva = await FieldReservationModel.create(datos);

    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la reserva",
    });
  }
};

export const cancelarReserva = async (req, res) => {
  try {
    const { id } = matchedData(req);

    await FieldReservationModel.update(
      {
        status: "CANCELLED",
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).json({
      message: "Reserva cancelada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al cancelar la reserva",
    });
  }
};