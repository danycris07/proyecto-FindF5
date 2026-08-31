import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";

export const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await UserModel.findAll();

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const usuario = await UserModel.findByPk(id);

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el usuario",
    });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const datos = matchedData(req);

    const usuario = await UserModel.create(datos);

    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el usuario",
    });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = matchedData(req);

    await UserModel.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el usuario",
    });
  }
};
