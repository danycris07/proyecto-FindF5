import { matchedData } from "express-validator";
import { MatchModel } from "../models/match.model.js";
import { TeamModel } from "../models/team.model.js";
import { FieldModel } from "../models/field.model.js";

export const obtenerTodosLosPartidos = async (req, res) => {
  try {
    const partidos = await MatchModel.findAll({
      include: [
        {
          model: TeamModel,
          as: "team",
        },
        {
          model: FieldModel,
          as: "field",
        },
      ],
    });

    res.status(200).json(partidos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los partidos",
    });
  }
};

export const obtenerPartidoPorId = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const partido = await MatchModel.findByPk(id, {
      include: [
        {
          model: TeamModel,
          as: "team",
        },
        {
          model: FieldModel,
          as: "field",
        },
      ],
    });

    res.status(200).json(partido);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el partido",
    });
  }
};

export const crearPartido = async (req, res) => {
  try {
    const datos = matchedData(req);

    const partido = await MatchModel.create(datos);

    res.status(201).json(partido);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el partido",
    });
  }
};

export const eliminarPartido = async (req, res) => {
  try {
    const { id } = matchedData(req);

    await MatchModel.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Partido eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el partido",
    });
  }
};