import jwt from "jsonwebtoken";

export const validarJWT = (req, res, next) => {
  //token del headers de la petición
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición. Acceso denegado.",
    });
  }

  try {
    // verifica el token con la misma clave del .env
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del usuario en la request para que el controlador los pueda usar
    req.uid = payload.uid;
    req.role = payload.role;

    //pasa al siguiente controlador
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido o expirado.",
    });
  }
};
