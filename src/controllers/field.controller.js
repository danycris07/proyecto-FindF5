import { matchedData } from "express-validator";
import { FieldModel } from "../models/field.model.js";

export const obtenerTodasLasCanchas = async (req, res) => {
  try {
    const canchas = await FieldModel.findAll();

    res.status(200).json(canchas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las canchas",
    });
  }
};

export const obtenerCanchaPorId = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const cancha = await FieldModel.findByPk(id);

    res.status(200).json(cancha);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la cancha",
    });
  }
};

export const crearCancha = async (req, res) => {
  try {
    const datos = matchedData(req);

    const cancha = await FieldModel.create(datos);

    res.status(201).json(cancha);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la cancha",
    });
  }
};

export const eliminarCancha = async (req, res) => {
  try {
    const { id } = matchedData(req);

    await FieldModel.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Cancha eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la cancha",
    });
  }
};