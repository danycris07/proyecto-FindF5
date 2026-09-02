// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/user.model.js";

export const validarJWT = async (req, res, next) => {
  // 1. Leer el token de los headers (suele venir como "Bearer eyJhb...")
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No hay token en la petición" });
  }

  try {
    // 2. Verificar el token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "mi_clave_super_secreta_123",
    );

    // 3. Buscar al usuario en la base de datos por si lo borraron
    const usuario = await UserModel.findByPk(payload.id);
    if (!usuario) {
      return res
        .status(401)
        .json({ message: "Token no válido - usuario no existe" });
    }

    // 4. Inyectar el usuario en la request para que los controladores lo usen
    req.usuario = usuario;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token no válido o expirado" });
  }
};
