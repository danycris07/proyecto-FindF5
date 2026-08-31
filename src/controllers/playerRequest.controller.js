import { matchedData } from "express-validator";
import { PlayerRequestModel } from "../models/playerRequest.model.js";
import { MatchModel } from "../models/match.model.js";

export const obtenerTodasLasBusquedas = async (req, res) => {
  try {
    const busquedas = await PlayerRequestModel.findAll({
      include: {
        model: MatchModel,
        as: "match",
      },
    });

    res.status(200).json(busquedas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las búsquedas",
    });
  }
};

export const obtenerBusquedaPorId = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const busqueda = await PlayerRequestModel.findByPk(id, {
      include: {
        model: MatchModel,
        as: "match",
      },
    });

    res.status(200).json(busqueda);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la búsqueda",
    });
  }
};

export const crearBusqueda = async (req, res) => {
  try {
    const datos = matchedData(req);

    const busqueda = await PlayerRequestModel.create(datos);

    res.status(201).json(busqueda);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la búsqueda",
    });
  }
};