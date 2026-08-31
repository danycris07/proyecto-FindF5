import { matchedData } from "express-validator";
import { TeamModel } from "../models/team.model.js";
import { UserModel } from "../models/user.model.js";

export const obtenerTodosLosEquipos = async (req, res) => {
  try {
    const equipos = await TeamModel.findAll({
      include: {
        model: UserModel,
        as: "captain",
        attributes: ["id", "name", "email"],
      },
    });

    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los equipos",
    });
  }
};

export const obtenerEquipoPorId = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const equipo = await TeamModel.findByPk(id, {
      include: {
        model: UserModel,
        as: "captain",
        attributes: ["id", "name", "email"],
      },
    });

    res.status(200).json(equipo);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el equipo",
    });
  }
};

export const crearEquipo = async (req, res) => {
  try {
    const datos = matchedData(req);

    const equipo = await TeamModel.create(datos);

    res.status(201).json(equipo);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el equipo",
    });
  }
};

export const eliminarEquipo = async (req, res) => {
  try {
    const { id } = matchedData(req);

    await TeamModel.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Equipo eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el equipo",
    });
  }
};