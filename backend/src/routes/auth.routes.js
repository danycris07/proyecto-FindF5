import { randomBytes } from "node:crypto";
import { Router } from "express";
import { validationResult, body } from "express-validator";
import { UniqueConstraintError } from "sequelize";
import {
  clearSessionCookie,
  createSessionToken,
  hashSessionToken,
  readSessionToken,
  SESSION_DURATION_MS,
  setSessionCookie,
} from "../auth/session-cookie.js";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { createRequireAuth } from "../middleware/require-auth.js";
import { DOMINANT_FOOTS, PLAYER_POSITIONS } from "../models/enums.js";

const REGISTERABLE_ROLES = ["PLAYER", "FIELD_OWNER"];
let timingHashPromise;

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    position: user.position,
    dominantFoot: user.dominantFoot,
    reputation: user.reputation,
    isPhoneVisible: user.isPhoneVisible,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function validationErrors(request, response, next) {
  const result = validationResult(request);
  if (result.isEmpty()) {
    return next();
  }

  return response.status(400).json({
    message: "Revisá los datos ingresados.",
    errors: result.array().map(({ path, msg }) => ({ field: path, message: msg })),
  });
}

async function createLoginSession(models, transaction, user) {
  const token = createSessionToken();
  await models.Session.create(
    {
      tokenHash: hashSessionToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
    { transaction },
  );

  return token;
}

export function createAuthRouter({ models, sequelize }) {
  const router = Router();
  const requireAuth = createRequireAuth(models);

  router.patch(
    "/me",
    requireAuth,
    (request, response, next) => {
      const editableFields = [
        "position",
        "dominantFoot",
        "phone",
        "isPhoneVisible",
      ];
      if (
        !request.body ||
        typeof request.body !== "object" ||
        Array.isArray(request.body) ||
        Object.keys(request.body).some((field) => !editableFields.includes(field))
      ) {
        return response.status(400).json({
          message: "Solo podés actualizar posición, pierna hábil y teléfono.",
        });
      }
      return next();
    },
    [
      body("position")
        .optional({ values: "null" })
        .isIn(PLAYER_POSITIONS)
        .withMessage("Elegí jugador de campo o arquero."),
      body("dominantFoot")
        .optional({ values: "null" })
        .isIn(DOMINANT_FOOTS)
        .withMessage("Elegí una pierna hábil válida."),
      body("phone")
        .optional({ values: "null" })
        .isString()
        .bail()
        .trim()
        .isLength({ max: 30 })
        .withMessage("El teléfono no puede superar los 30 caracteres.")
        .bail()
        .custom((phone) => {
          const digitCount = phone.replace(/\D/g, "").length;
          return (
            phone === "" ||
            (/^[+\d][\d\s()-]*$/.test(phone) &&
              digitCount >= 7 &&
              digitCount <= 15)
          );
        })
        .withMessage("Ingresá un teléfono válido con entre 7 y 15 dígitos."),
      body("isPhoneVisible")
        .optional()
        .isBoolean()
        .withMessage("Indicá si querés mostrar tu teléfono."),
      body().custom((_value, { req }) => {
        if (
          req.authUser.role !== "PLAYER" &&
          (Object.hasOwn(req.body, "position") ||
            Object.hasOwn(req.body, "dominantFoot"))
        ) {
          throw new Error("Solo los jugadores pueden editar su perfil deportivo.");
        }
        return true;
      }),
    ],
    validationErrors,
    async (request, response) => {
      const changes = Object.fromEntries(
        Object.entries(request.body).map(([field, value]) => [
          field,
          field === "phone" ? value?.trim() || null : value,
        ]),
      );
      await request.authUser.update(changes);
      return response.status(200).json({ user: publicUser(request.authUser) });
    },
  );

  router.post(
    "/register",
    [
      body("name")
        .isString()
        .withMessage("Ingresá tu nombre.")
        .bail()
        .trim()
        .isLength({ min: 2, max: 120 })
        .withMessage("El nombre debe tener entre 2 y 120 caracteres."),
      body("email")
        .isString()
        .withMessage("Ingresá un correo válido.")
        .bail()
        .trim()
        .isEmail()
        .withMessage("Ingresá un correo válido.")
        .normalizeEmail(),
      body("password")
        .isString()
        .withMessage("Ingresá una contraseña.")
        .bail()
        .isLength({ min: 6, max: 128 })
        .withMessage("La contraseña debe tener entre 6 y 128 caracteres."),
      body("phone")
        .optional({ values: "null" })
        .isString()
        .bail()
        .trim()
        .isLength({ max: 30 })
        .withMessage("El teléfono no puede superar los 30 caracteres.")
        .bail()
        .custom((phone) => {
          const digitCount = phone.replace(/\D/g, "").length;
          return (
            phone === "" ||
            (/^[+\d][\d\s()-]*$/.test(phone) &&
              digitCount >= 7 &&
              digitCount <= 15)
          );
        })
        .withMessage("Ingresá un teléfono válido con entre 7 y 15 dígitos."),
      body("email")
        .isLength({ max: 254 })
        .withMessage("El correo no puede superar los 254 caracteres."),
      body("role")
        .optional()
        .isIn(REGISTERABLE_ROLES)
        .withMessage("Elegí un tipo de cuenta válido."),
      body("position")
        .optional({ values: "null" })
        .isIn(PLAYER_POSITIONS)
        .withMessage("Elegí jugador de campo o arquero."),
      body("dominantFoot")
        .optional({ values: "null" })
        .isIn(DOMINANT_FOOTS)
        .withMessage("Elegí una pierna hábil válida."),
      body("position").custom((position, { req }) => {
        if (req.body.role === "FIELD_OWNER" && position) {
          throw new Error("El dueño de cancha no puede tener posición de jugador.");
        }
        return true;
      }),
    ],
    validationErrors,
    async (request, response) => {
      const {
        name,
        email,
        password,
        phone,
        role = "PLAYER",
        position = null,
        dominantFoot = null,
      } = request.body;

      try {
        const { user, token } = await sequelize.transaction(async (transaction) => {
          const user = await models.User.create(
            {
              name,
              email,
              passwordHash: await hashPassword(password),
              phone: phone?.trim() || null,
              role,
              position: role === "PLAYER" ? position : null,
              dominantFoot: role === "PLAYER" ? dominantFoot : null,
            },
            { transaction },
          );
          const token = await createLoginSession(models, transaction, user);
          return { user, token };
        });

        setSessionCookie(response, token, process.env.NODE_ENV === "production");
        return response.status(201).json({ user: publicUser(user) });
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          return response.status(409).json({ message: "Ese email ya está en uso." });
        }
        throw error;
      }
    },
  );

  router.post(
    "/login",
    [
      body("email")
        .isString()
        .withMessage("Credenciales inválidas.")
        .bail()
        .trim()
        .isLength({ max: 254 })
        .withMessage("Credenciales inválidas.")
        .bail()
        .isEmail()
        .withMessage("Credenciales inválidas.")
        .normalizeEmail(),
      body("password")
        .isString()
        .withMessage("Credenciales inválidas.")
        .bail()
        .isLength({ min: 1, max: 128 })
        .withMessage("Credenciales inválidas."),
    ],
    (request, response, next) => {
      if (!validationResult(request).isEmpty()) {
        return response.status(401).json({ message: "Credenciales inválidas." });
      }
      return next();
    },
    async (request, response) => {
      const user = await models.User.findOne({
        where: { email: request.body.email },
      });
      timingHashPromise ??= hashPassword(randomBytes(32).toString("base64url"));
      const passwordHash = user?.passwordHash ?? (await timingHashPromise);
      const passwordIsValid = await verifyPassword(
        request.body.password,
        passwordHash,
      );

      if (!user || !passwordIsValid) {
        return response.status(401).json({ message: "Credenciales inválidas." });
      }

      const token = await sequelize.transaction((transaction) =>
        createLoginSession(models, transaction, user),
      );

      setSessionCookie(response, token, process.env.NODE_ENV === "production");
      return response.status(200).json({ user: publicUser(user) });
    },
  );

  router.get("/me", requireAuth, (request, response) =>
    response.status(200).json({ user: publicUser(request.authUser) }),
  );

  router.post("/logout", async (request, response) => {
    const token = readSessionToken(request);
    if (token) {
      await models.Session.destroy({
        where: { tokenHash: hashSessionToken(token) },
      });
    }

    clearSessionCookie(response, process.env.NODE_ENV === "production");
    return response.status(204).end();
  });

  return router;
}
