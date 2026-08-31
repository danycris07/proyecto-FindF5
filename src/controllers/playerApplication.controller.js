import { matchedData } from "express-validator";
import { PlayerApplicationModel } from "../models/playerApplication.model.js";

export const crearSolicitudJugador = async (req, res) => {
  try {
    const datos = matchedData(req);

    const solicitud = await PlayerApplicationModel.create(datos);

    res.status(201).json(solicitud);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la solicitud",
    });
  }
};


