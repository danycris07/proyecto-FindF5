import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { UniqueConstraintError } from "sequelize";
import { hashPassword } from "../auth/password.js";
import { createRequireAuth, requireRole } from "../middleware/require-auth.js";
import {
  DOMINANT_FOOTS,
  PLAYER_POSITIONS,
  USER_ROLES,
} from "../models/enums.js";
import {
  getMatchResponse,
  isFutureMatch,
  normalizeMatchInput,
} from "../services/match-rules.js";
import { matchInputValidation } from "./matches.routes.js";

function validationErrors(request, response, next) {
  const result = validationResult(request);
  if (result.isEmpty()) {
    return next();
  }

  return response.status(400).json({
    message: "Revisá los datos ingresados.",
    errors: result
      .array()
      .map(({ path, msg }) => ({ field: path, message: msg })),
  });
}

function idValidation(name) {
  return param(name)
    .isInt({ min: 1 })
    .withMessage("El identificador no es válido.")
    .toInt();
}

const userFieldsValidation = [
  body("name")
    .isString()
    .withMessage("Ingresá un nombre.")
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
  body("role")
    .isIn(USER_ROLES)
    .withMessage("Elegí un tipo de cuenta válido."),
  body("phone")
    .optional({ values: "null" })
    .isString()
    .bail()
    .trim()
    .isLength({ max: 30 })
    .withMessage("El teléfono no puede superar los 30 caracteres."),
  body("position")
    .optional({ values: "null" })
    .isIn(PLAYER_POSITIONS)
    .withMessage("Elegí jugador de campo o arquero."),
  body("dominantFoot")
    .optional({ values: "null" })
    .isIn(DOMINANT_FOOTS)
    .withMessage("Elegí una pierna hábil válida."),
  body("position").custom((position, { req }) => {
    if (req.body.role !== "PLAYER" && position) {
      throw new Error("Solo los jugadores pueden tener una posición.");
    }
    return true;
  }),
];

const fieldValidation = [
  body("name")
    .isString()
    .withMessage("Ingresá el nombre de la cancha.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 160 })
    .withMessage("El nombre debe tener entre 2 y 160 caracteres."),
  body("address")
    .isString()
    .withMessage("Ingresá la dirección de la cancha.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("La dirección debe tener entre 2 y 255 caracteres."),
  body("latitude")
    .optional({ values: "null" })
    .isFloat({ min: -90, max: 90 })
    .withMessage("La latitud debe estar entre -90 y 90.")
    .toFloat(),
  body("longitude")
    .optional({ values: "null" })
    .isFloat({ min: -180, max: 180 })
    .withMessage("La longitud debe estar entre -180 y 180.")
    .toFloat(),
  body("price")
    .optional({ values: "null" })
    .isFloat({ min: 0, max: 99999999.99 })
    .withMessage("El precio debe ser un monto igual o mayor que 0.")
    .toFloat(),
  body("imageUrl")
    .optional({ values: "null" })
    .isString()
    .bail()
    .trim()
    .isLength({ max: 2048 })
    .withMessage("El enlace de la imagen es demasiado largo."),
  body("description")
    .optional({ values: "null" })
    .isString()
    .withMessage("La descripción no es válida."),
  body("ownerId")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("El dueño de cancha indicado no es válido.")
    .toInt(),
];

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
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function userValues(body) {
  const isPlayer = body.role === "PLAYER";
  return {
    name: body.name,
    email: body.email,
    phone: body.phone?.trim() || null,
    role: body.role,
    position: isPlayer ? body.position ?? null : null,
    dominantFoot: isPlayer ? body.dominantFoot ?? null : null,
  };
}

function fieldValues(body) {
  return {
    name: body.name,
    address: body.address,
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    price: body.price ?? null,
    imageUrl: body.imageUrl?.trim() || null,
    description: body.description ?? null,
    ownerId: body.ownerId ?? null,
  };
}

function routeError(error, response, duplicateMessage) {
  if (error.status) {
    return response.status(error.status).json({ message: error.message });
  }
  if (error instanceof UniqueConstraintError) {
    return response.status(409).json({ message: duplicateMessage });
  }
  throw error;
}

async function validateFieldOwner(models, ownerId, transaction) {
  if (ownerId == null) {
    return;
  }
  const owner = await models.User.findByPk(ownerId, { transaction });
  if (!owner || owner.role !== "FIELD_OWNER") {
    const error = new Error("El usuario indicado no es dueño de cancha.");
    error.status = 422;
    throw error;
  }
}

async function lockAdministrators(models, transaction) {
  return models.User.findAll({
    where: { role: "ADMIN" },
    attributes: ["id"],
    order: [["id", "ASC"]],
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
}

function matchIncludes(models) {
  return [
    { model: models.User, as: "organizer", attributes: ["id", "name"] },
    { model: models.Field, as: "field", attributes: ["id", "name"] },
    {
      model: models.User,
      as: "participants",
      attributes: ["id", "name"],
      through: { attributes: ["joinedAt"] },
    },
  ];
}

async function findMatch(models, matchId, transaction) {
  return models.Match.findByPk(matchId, {
    include: matchIncludes(models),
    transaction,
    ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}),
  });
}

async function resolveMatchField(models, values, transaction) {
  if (!values.fieldId) {
    return values;
  }
  const field = await models.Field.findByPk(values.fieldId, { transaction });
  if (!field) {
    const error = new Error("No encontramos esa cancha.");
    error.status = 422;
    throw error;
  }
  return { ...values, fieldName: field.name };
}

async function resolveMatchTeam(models, teamId, transaction) {
  if (teamId == null) {
    return null;
  }
  const team = await models.Team.findByPk(teamId, { transaction });
  if (!team) {
    const error = new Error("No encontramos ese equipo.");
    error.status = 422;
    throw error;
  }
  return team.id;
}

function requireFutureMatch(values) {
  if (!isFutureMatch(values.date, values.startTime)) {
    const error = new Error("Elegí una fecha y hora futuras.");
    error.status = 422;
    throw error;
  }
}

export function createAdminRouter({ models, sequelize }) {
  const router = Router();
  router.use(createRequireAuth(models), requireRole("ADMIN"));

  router.get("/users", async (_request, response) => {
    const users = await models.User.findAll({ order: [["id", "ASC"]] });
    return response.json(users.map(publicUser));
  });

  router.get(
    "/users/:userId",
    idValidation("userId"),
    validationErrors,
    async (request, response) => {
      const user = await models.User.findByPk(request.params.userId);
      if (!user) {
        return response.status(404).json({ message: "No encontramos ese usuario." });
      }
      return response.json({ user: publicUser(user) });
    },
  );

  router.post(
    "/users",
    [
      ...userFieldsValidation,
      body("password")
        .isString()
        .withMessage("Ingresá una contraseña.")
        .bail()
        .isLength({ min: 6, max: 128 })
        .withMessage("La contraseña debe tener entre 6 y 128 caracteres."),
    ],
    validationErrors,
    async (request, response) => {
      try {
        const user = await models.User.create({
          ...userValues(request.body),
          passwordHash: await hashPassword(request.body.password),
        });
        return response.status(201).json({ user: publicUser(user) });
      } catch (error) {
        return routeError(error, response, "Ese email ya está en uso.");
      }
    },
  );

  router.put(
    "/users/:userId",
    [
      idValidation("userId"),
      ...userFieldsValidation,
      body("password")
        .optional()
        .isString()
        .bail()
        .isLength({ min: 6, max: 128 })
        .withMessage("La contraseña debe tener entre 6 y 128 caracteres."),
    ],
    validationErrors,
    async (request, response) => {
      try {
        const userId = request.params.userId;
        const updated = await sequelize.transaction(async (transaction) => {
          let user = await models.User.findByPk(userId, { transaction });
          if (!user) {
            const error = new Error("No encontramos ese usuario.");
            error.status = 404;
            throw error;
          }
          const values = userValues(request.body);
          if (user.role === "ADMIN" && values.role !== "ADMIN") {
            if (String(user.id) === String(request.authUser.id)) {
              const error = new Error("No podés quitarte tu propio rol administrador.");
              error.status = 409;
              throw error;
            }
            const administrators = await lockAdministrators(models, transaction);
            user = await models.User.findByPk(userId, {
              transaction,
              lock: transaction.LOCK.UPDATE,
            });
            if (!user) {
              const error = new Error("No encontramos ese usuario.");
              error.status = 404;
              throw error;
            }
            if (
              user.role === "ADMIN" &&
              values.role !== "ADMIN" &&
              administrators.length <= 1
            ) {
              const error = new Error("Debe quedar al menos un administrador activo.");
              error.status = 409;
              throw error;
            }
          } else {
            user = await models.User.findByPk(userId, {
              transaction,
              lock: transaction.LOCK.UPDATE,
            });
            if (!user) {
              const error = new Error("No encontramos ese usuario.");
              error.status = 404;
              throw error;
            }
          }
          const roleChanged = user.role !== values.role;
          await user.update(
            {
              ...values,
              ...(request.body.password
                ? { passwordHash: await hashPassword(request.body.password) }
                : {}),
            },
            { transaction },
          );
          if (request.body.password || roleChanged) {
            await models.Session.destroy({
              where: { userId: user.id },
              transaction,
            });
          }
          return user;
        });
        return response.json({ user: publicUser(updated) });
      } catch (error) {
        return routeError(error, response, "Ese email ya está en uso.");
      }
    },
  );

  router.delete(
    "/users/:userId",
    idValidation("userId"),
    validationErrors,
    async (request, response) => {
      try {
        await sequelize.transaction(async (transaction) => {
          let user = await models.User.findByPk(request.params.userId, {
            transaction,
          });
          if (!user) {
            const error = new Error("No encontramos ese usuario.");
            error.status = 404;
            throw error;
          }
          if (String(user.id) === String(request.authUser.id)) {
            const error = new Error("No podés eliminar tu propia cuenta.");
            error.status = 409;
            throw error;
          }
          if (user.role === "ADMIN") {
            const administrators = await lockAdministrators(models, transaction);
            user = await models.User.findByPk(request.params.userId, {
              transaction,
              lock: transaction.LOCK.UPDATE,
            });
            if (!user) {
              const error = new Error("No encontramos ese usuario.");
              error.status = 404;
              throw error;
            }
            if (user.role === "ADMIN" && administrators.length <= 1) {
              const error = new Error("Debe quedar al menos un administrador activo.");
              error.status = 409;
              throw error;
            }
          } else {
            user = await models.User.findByPk(request.params.userId, {
              transaction,
              lock: transaction.LOCK.UPDATE,
            });
            if (!user) {
              const error = new Error("No encontramos ese usuario.");
              error.status = 404;
              throw error;
            }
          }
          await models.Session.destroy({
            where: { userId: user.id },
            transaction,
          });
          await user.destroy({ transaction });
        });
        return response.status(204).end();
      } catch (error) {
        return routeError(error, response, "No se pudo eliminar el usuario.");
      }
    },
  );

  router.get("/fields", async (_request, response) => {
    const fields = await models.Field.findAll({
      order: [["id", "ASC"]],
    });
    return response.json(fields);
  });

  router.get(
    "/fields/:fieldId",
    idValidation("fieldId"),
    validationErrors,
    async (request, response) => {
      const field = await models.Field.findByPk(request.params.fieldId);
      if (!field) {
        return response.status(404).json({ message: "No encontramos esa cancha." });
      }
      return response.json({ field });
    },
  );

  router.post(
    "/fields",
    fieldValidation,
    validationErrors,
    async (request, response) => {
      try {
        const values = fieldValues(request.body);
        await validateFieldOwner(models, values.ownerId);
        const field = await models.Field.create(values);
        return response.status(201).json({ field });
      } catch (error) {
        return routeError(error, response, "No se pudo guardar la cancha.");
      }
    },
  );

  router.put(
    "/fields/:fieldId",
    [idValidation("fieldId"), ...fieldValidation],
    validationErrors,
    async (request, response) => {
      try {
        const field = await models.Field.findByPk(request.params.fieldId);
        if (!field) {
          return response
            .status(404)
            .json({ message: "No encontramos esa cancha." });
        }
        const values = fieldValues(request.body);
        await validateFieldOwner(models, values.ownerId);
        await field.update(values);
        return response.json({ field });
      } catch (error) {
        return routeError(error, response, "No se pudo guardar la cancha.");
      }
    },
  );

  router.delete(
    "/fields/:fieldId",
    idValidation("fieldId"),
    validationErrors,
    async (request, response) => {
      const field = await models.Field.findByPk(request.params.fieldId);
      if (!field) {
        return response.status(404).json({ message: "No encontramos esa cancha." });
      }
      await field.destroy();
      return response.status(204).end();
    },
  );

  const adminMatchValidation = [
    ...matchInputValidation,
    body("organizerId")
      .isInt({ min: 1 })
      .withMessage("El organizador indicado no es válido.")
      .toInt(),
  ];

  router.get("/matches", async (_request, response) => {
    const matches = await models.Match.findAll({
      include: matchIncludes(models),
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });
    return response.json(matches.map(getMatchResponse));
  });

  router.get(
    "/matches/:matchId",
    idValidation("matchId"),
    validationErrors,
    async (request, response) => {
      const match = await findMatch(models, request.params.matchId);
      if (!match) {
        return response.status(404).json({ message: "No encontramos ese partido." });
      }
      return response.json({ match: getMatchResponse(match) });
    },
  );

  router.post(
    "/matches",
    adminMatchValidation,
    validationErrors,
    async (request, response) => {
      try {
        const values = normalizeMatchInput(request.body);
        requireFutureMatch(values);
        const match = await sequelize.transaction(async (transaction) => {
          const organizer = await models.User.findByPk(request.body.organizerId, {
            transaction,
          });
          if (!organizer || organizer.role !== "PLAYER") {
            const error = new Error("El organizador indicado no es un jugador.");
            error.status = 422;
            throw error;
          }
          const resolvedValues = await resolveMatchField(
            models,
            values,
            transaction,
          );
          const teamId = await resolveMatchTeam(
            models,
            request.body.teamId ?? null,
            transaction,
          );
          const record = await models.Match.create(
            {
              ...resolvedValues,
              teamId,
              organizerId: organizer.id,
              status:
                (resolvedValues.organizerPlays ? 1 : 0) +
                  resolvedValues.outsideSlots >=
                resolvedValues.expectedPlayers
                  ? "COMPLETE"
                  : "OPEN",
            },
            { transaction },
          );
          return findMatch(models, record.id, transaction);
        });
        return response.status(201).json({ match: getMatchResponse(match) });
      } catch (error) {
        return routeError(error, response, "No se pudo crear el partido.");
      }
    },
  );

  router.put(
    "/matches/:matchId",
    [idValidation("matchId"), ...matchInputValidation],
    validationErrors,
    async (request, response) => {
      try {
        const values = normalizeMatchInput(request.body);
        requireFutureMatch(values);
        const match = await sequelize.transaction(async (transaction) => {
          const record = await models.Match.findByPk(request.params.matchId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
          });
          if (!record) {
            const error = new Error("No encontramos ese partido.");
            error.status = 404;
            throw error;
          }
          if (record.status === "CANCELLED") {
            const error = new Error("El partido ya fue cancelado.");
            error.status = 409;
            throw error;
          }
          const resolvedValues = await resolveMatchField(
            models,
            values,
            transaction,
          );
          const teamId = await resolveMatchTeam(
            models,
            request.body.teamId ?? null,
            transaction,
          );
          const participantCount = await models.MatchParticipant.count({
            where: { matchId: record.id },
            transaction,
          });
          const committedPlayers =
            participantCount +
            (resolvedValues.organizerPlays ? 1 : 0) +
            resolvedValues.outsideSlots;
          if (committedPlayers > resolvedValues.expectedPlayers) {
            const error = new Error(
              "Hay más jugadores confirmados que lugares en el partido.",
            );
            error.status = 422;
            throw error;
          }
          await record.update(
            {
              ...resolvedValues,
              teamId,
              status:
                committedPlayers >= resolvedValues.expectedPlayers
                  ? "COMPLETE"
                  : "OPEN",
            },
            { transaction },
          );
          return findMatch(models, record.id, transaction);
        });
        return response.json({ match: getMatchResponse(match) });
      } catch (error) {
        return routeError(error, response, "No se pudo actualizar el partido.");
      }
    },
  );

  router.delete(
    "/matches/:matchId",
    idValidation("matchId"),
    validationErrors,
    async (request, response) => {
      const match = await models.Match.findByPk(request.params.matchId);
      if (!match) {
        return response.status(404).json({ message: "No encontramos ese partido." });
      }
      await match.destroy();
      return response.status(204).end();
    },
  );

  return router;
}
