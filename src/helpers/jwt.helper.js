import jwt from "jsonwebtoken";

export const generarJWT = (uid, role) => {
  try {
    // El payload es la info que viaja DENTRO del token
    const payload = { uid, role };

    // genera el token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h", // si llegan a robar el token
    });

    return token;
  } catch (error) {
    console.error("Error al generar el token:", error);
    throw new Error("No se pudo generar el token JWT");
  }
};
