// src/controllers/auth.controller.js
import { matchedData } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { ProfileModel } from "../models/profile.model.js";

// REGISTRO
export const register = async (req, res) => {
  try {
    const datos = matchedData(req);

    // 1. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(datos.password, salt);
    datos.password = hashedPassword;

    // 2. Crear el usuario
    const usuario = await UserModel.create(datos);

    // 3. Crear el perfil vacío automáticamente vinculado a este usuario
    await ProfileModel.create({ userId: usuario.id });

    // 4. Generar el JWT para que ya quede logueado al registrarse
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role }, 
      process.env.JWT_SECRET || "mi_clave_super_secreta_123", // Cambiá esto en tu archivo .env
      { expiresIn: "7d" } // El token dura 7 días
    );

    // Borramos el password de la respuesta por seguridad
    const userWithoutPassword = usuario.toJSON();
    delete userWithoutPassword.password;

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);

    // 1. Verificar si el usuario existe
    const usuario = await UserModel.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // 2. Verificar si la contraseña coincide
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // 3. Generar el JWT
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET || "mi_clave_super_secreta_123",
      { expiresIn: "7d" }
    );

    const userWithoutPassword = usuario.toJSON();
    delete userWithoutPassword.password;

    res.status(200).json({
      message: "Login exitoso",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};