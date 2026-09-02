import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        const erroresFormateados = {};

        errores.array().forEach((error) => {
            erroresFormateados[error.path] = error.msg;
        });

        return res.status(400).json({
            mensaje: "Error de validación",
            errores: erroresFormateados
        });
    }

    next();
};