import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import { generarJWT } from "../helpers/jwt.helper.js";

//Crear cuenta nueva
export const registrarUsuario = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  try {
    //ver si el email ya esta registrado
    const existeEmail = await UserModel.findOne({ where: { email } });
    if (existeEmail) {
      return res.status(400).json({
        msg: "El correo electrónico ya está registrado.",
      });
    }

    //  encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    const passwordHasheada = bcrypt.hashSync(password, salt);

    //  crear el usuario en la BD
    const nuevoUsuario = await UserModel.create({
      name,
      email,
      password: passwordHasheada,
      phone,
      role,
    });

    //  Generamos el token JWT con tu helper
    const token = generarJWT(nuevoUsuario.id, nuevoUsuario.role);

    //  Respondemos al cliente con los datos básicos y el token
    return res.status(201).json({
      uid: nuevoUsuario.id,
      name: nuevoUsuario.name,
      role: nuevoUsuario.role,
      token,
    });
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    return res.status(500).json({
      msg: "Error inesperado al registrar.",
    });
  }
};

//Iniciar sesion
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    //  ver si el usuario existe mediante su email
    const usuario = await UserModel.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario o contraseña incorrectos.",
      });
    }

    // Comparar la contraseña ingresada con la contraseña hasheada de la BD
    const passwordValida = bcrypt.compareSync(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({
        msg: "Usuario o contraseña incorrectos.",
      });
    }

    //  Si todo coincide, generamos el JWT
    const token = generarJWT(usuario.id, usuario.role);

    // envia el token
    return res.status(200).json({
      uid: usuario.id,
      name: usuario.name,
      role: usuario.role,
      token,
    });
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    return res.status(500).json({
      msg: "Error inesperado al iniciar sesión.",
    });
  }
};
