import { matchedData } from "express-validator";

import { ProfileModel } from "../models/profile.model.js";


export const obtenerTodosLosProfiles = async (req, res) => {
    try {
        const profiles = await ProfileModel.findAll();

        return res.status(200).json({
            mensaje: "Perfiles obtenidos correctamente",
            profiles
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener los perfiles",
            error: error.message
        });
    }
};


export const obtenerProfilePorId = async (req, res) => {
    try {
        const { id } = matchedData(req, {
            locations: ["params"]
        });

        const profile = await ProfileModel.findByPk(id);

        return res.status(200).json({
            mensaje: "Perfil obtenido correctamente",
            profile
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener el perfil",
            error: error.message
        });
    }
};


export const crearProfile = async (req, res) => {
    try {
        const datos = matchedData(req);

        const profile = await ProfileModel.create(datos);

        return res.status(201).json({
            mensaje: "Perfil creado correctamente",
            profile
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al crear el perfil",
            error: error.message
        });
    }
};


export const actualizarProfile = async (req, res) => {
    try {
        const { id } = matchedData(req, {
            locations: ["params"]
        });

        const datos = matchedData(req, {
            locations: ["body"]
        });

        const profile = await ProfileModel.findByPk(id);

        await profile.update(datos);

        return res.status(200).json({
            mensaje: "Perfil actualizado correctamente",
            profile
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al actualizar el perfil",
            error: error.message
        });
    }
};


export const eliminarProfile = async (req, res) => {
    try {
        const { id } = matchedData(req, {
            locations: ["params"]
        });

        const profile = await ProfileModel.findByPk(id);

        await profile.destroy();

        return res.status(200).json({
            mensaje: "Perfil eliminado correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al eliminar el perfil",
            error: error.message
        });
    }
};


export const actualizarProfileImage = async (req, res) => {
    try {
        const { id } = matchedData(req, {
            locations: ["params"]
        });

        const profile = await ProfileModel.findByPk(id);

        if (!req.file) {
            return res.status(400).json({
                mensaje: "Debes seleccionar una imagen"
            });
        }

        profile.profileImage = `/uploads/profiles/${req.file.filename}`;

        await profile.save();

        return res.status(200).json({
            mensaje: "Imagen de perfil actualizada correctamente",
            profile
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al actualizar la imagen de perfil",
            error: error.message
        });
    }
};