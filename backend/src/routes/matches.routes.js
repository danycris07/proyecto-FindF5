import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { UniqueConstraintError } from "sequelize";
import { createRequireAuth, requireRole } from "../middleware/require-auth.js";
import {
  getMatchResponse,
  getMatchStatus,
  isFutureMatch,
  MAX_EXPECTED_PLAYERS,
  MIN_EXPECTED_PLAYERS,
  normalizePublicMatchInput,
} from "../services/match-rules.js";

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

const matchIdValidation = param("matchId")
  .isInt({ min: 1 })
  .withMessage("El identificador del partido no es válido.")
  .toInt();

export const matchInputValidation = [
  body("fieldId")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("La cancha seleccionada no es válida.")
    .toInt(),
  body("fieldName")
    .optional()
    .isString()
    .withMessage("Ingresá una cancha válida.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 160 })
    .withMessage("El nombre de la cancha debe tener entre 2 y 160 caracteres."),
  body("date")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Ingresá una fecha válida.")
    .bail()
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("Ingresá una fecha válida."),
  body("startTime")
    .matches(/^\d{2}:\d{2}(:\d{2})?$/)
    .withMessage("Ingresá una hora válida.")
    .bail()
    .custom(isValidTime)
    .withMessage("Ingresá una hora válida."),
  body("endTime")
    .optional({ values: "null" })
    .matches(/^\d{2}:\d{2}(:\d{2})?$/)
    .withMessage("Ingresá una hora de finalización válida.")
    .bail()
    .custom(isValidTime)
    .withMessage("Ingresá una hora de finalización válida."),
  body("expectedPlayers")
    .isInt({ min: 1, max: 4294967295 })
    .withMessage("Los jugadores esperados deben ser un entero válido.")
    .toInt(),
  body("organizerPlays")
    .optional()
    .isBoolean()
    .withMessage("Indicá si el organizador juega.")
    .toBoolean(),
  body("outsideSlots")
    .optional()
    .isInt({ min: 0, max: 4294967295 })
    .withMessage("Los confirmados por fuera deben ser un entero de 0 o más.")
    .toInt(),
  body("playingForCoca")
    .optional()
    .isBoolean()
    .withMessage("Indicá si se juega por la coca.")
    .toBoolean(),
  body("basePricePerPlayer")
    .isFloat({ min: 0, max: 99999999.99 })
    .withMessage("La cuota base debe ser un monto igual o mayor que 0.")
    .toFloat(),
  body("cocaAmountPerPlayer")
    .optional()
    .isFloat({ min: 0, max: 99999999.99 })
    .withMessage("El monto extra debe ser un monto igual o mayor que 0.")
    .toFloat(),
  body("teamId")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("El equipo indicado no es válido.")
    .toInt(),
  body("endTime").custom((endTime, { req }) => {
    if (
      typeof req.body.startTime === "string" &&
      typeof endTime === "string" &&
      endTime <= req.body.startTime
    ) {
      throw new Error("La hora de finalización debe ser posterior al inicio.");
    }
    return true;
  }),
  body("fieldName").custom((fieldName, { req }) => {
    if (req.body.fieldId == null && typeof fieldName !== "string") {
      throw new Error("Elegí una cancha o ingresá su nombre.");
    }
    return true;
  }),
];

const publicMatchInputValidation = [
  ...matchInputValidation,
  body("expectedPlayers")
    .isInt({ min: MIN_EXPECTED_PLAYERS, max: MAX_EXPECTED_PLAYERS })
    .withMessage(
      `El partido debe tener entre ${MIN_EXPECTED_PLAYERS} y ${MAX_EXPECTED_PLAYERS} jugadores esperados.`,
    ),
  body("basePricePerPlayer")
    .isInt({ min: 1, max: 99999999 })
    .withMessage("La cuota por jugador debe ser un importe entero mayor que 0."),
  body("cocaAmountPerPlayer")
    .if((value, { req }) => req.body.playingForCoca === true)
    .isInt({ min: 1, max: 99999999 })
    .withMessage("El monto extra debe ser un importe entero mayor que 0."),
];

function isValidTime(value) {
  const [hours, minutes, seconds = 0] = value.split(":").map(Number);
  return (
    Number.isInteger(hours) &&
    hours >= 0 &&
    hours <= 23 &&
    Number.isInteger(minutes) &&
    minutes >= 0 &&
    minutes <= 59 &&
    Number.isInteger(seconds) &&
    seconds >= 0 &&
    seconds <= 59
  );
}

function matchIncludes(models) {
  return [
    {
      model: models.User,
      as: "organizer",
      attributes: ["id"],
      include: [{ model: models.Profile, as: "profile", attributes: ["firstName", "lastName", "profilePhotoUrl"] }],
    },
    {
      model: models.Field,
      as: "field",
      attributes: ["id", "name", "address", "imageUrl"],
      paranoid: false,
    },
    {
      model: models.User,
      as: "participants",
      attributes: ["id"],
      include: [{ model: models.Profile, as: "profile", attributes: ["firstName", "lastName", "profilePhotoUrl"] }],
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

async function findMatchForUpdate(models, matchId, transaction) {
  const match = await models.Match.findByPk(matchId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
  if (!match) {
    return null;
  }
  return findMatch(models, matchId, transaction);
}

async function resolveField(models, values, transaction) {
  if (!values.fieldId) {
    return values;
  }
  const field = await models.Field.findByPk(values.fieldId, { transaction });
  if (!field) {
    const error = new Error("No encontramos esa cancha.");
    error.status = 422;
    error.field = "fieldId";
    throw error;
  }

  return {
    ...values,
    fieldName: field.name,
  };
}

async function resolveTeam(models, teamId, transaction) {
  if (teamId == null) {
    return null;
  }
  const team = await models.Team.findByPk(teamId, { transaction });
  if (!team) {
    const error = new Error("No encontramos ese equipo.");
    error.status = 422;
    error.field = "teamId";
    throw error;
  }
  return team.id;
}

function requireFutureMatch(values) {
  if (!isFutureMatch(values.date, values.startTime)) {
    const error = new Error("Elegí una fecha y hora futuras.");
    error.status = 422;
    error.field = "date";
    throw error;
  }
}

function missingPlayersForWrite(match) {
  const participantCount = match.participants?.length ?? 0;
  return Math.max(
    0,
    Number(match.expectedPlayers) -
      (match.organizerPlays ? 1 : 0) -
      Number(match.outsideSlots) -
      participantCount,
  );
}

export function createMatchesRouter({ models, sequelize }) {
  const router = Router();
  const requireAuth = createRequireAuth(models);
  const requirePlayer = requireRole("PLAYER");

  router.use(requireAuth);

  router.get("/", async (_request, response) => {
    const matches = await models.Match.findAll({
      where: { status: "OPEN" },
      include: matchIncludes(models),
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });

    return response.json(
      matches
        .map(getMatchResponse)
        .filter((match) => match.status === "OPEN"),
    );
  });

  router.get("/mine", async (request, response) => {
    const matches = await models.Match.findAll({
      include: [
        ...matchIncludes(models),
      ],
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });
    const userId = String(request.authUser.id);

    return response.json(
      matches
        .map(getMatchResponse)
        .filter(
          (match) =>
            String(match.organizerId) === userId ||
            match.participants.some(
              (participant) => String(participant.userId) === userId,
            ),
        ),
    );
  });

  router.post(
    "/",
    requirePlayer,
    publicMatchInputValidation,
    validationErrors,
    async (request, response) => {
      let values;
      try {
        values = normalizePublicMatchInput(request.body, {
          requireOpenSlot: true,
        });
        requireFutureMatch(values);
      } catch (error) {
        return response
          .status(error.status ?? 422)
          .json({
            message: error.message,
            ...(error.field ? { field: error.field } : {}),
          });
      }

      try {
        const match = await sequelize.transaction(async (transaction) => {
          const resolvedValues = await resolveField(
            models,
            values,
            transaction,
          );
          const teamId = await resolveTeam(
            models,
            request.body.teamId ?? null,
            transaction,
          );
          const record = await models.Match.create(
            {
              ...resolvedValues,
              teamId,
              organizerId: request.authUser.id,
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
        if (error.status) {
          return response
            .status(error.status)
            .json({
              message: error.message,
              ...(error.field ? { field: error.field } : {}),
            });
        }
        if (error instanceof UniqueConstraintError) {
          return response
            .status(409)
            .json({ message: "No se pudo crear el partido." });
        }
        throw error;
      }
    },
  );

  router.get(
    "/:matchId",
    matchIdValidation,
    validationErrors,
    async (request, response) => {
      const match = await findMatch(models, request.params.matchId);
      if (!match) {
        return response
          .status(404)
          .json({ message: "No encontramos ese partido." });
      }
      return response.json({ match: getMatchResponse(match) });
    },
  );

  router.put(
    "/:matchId",
    requirePlayer,
    matchIdValidation,
    publicMatchInputValidation,
    validationErrors,
    async (request, response) => {
      try {
        const values = normalizePublicMatchInput(request.body);
        requireFutureMatch(values);
        const updated = await sequelize.transaction(async (transaction) => {
          const match = await findMatchForUpdate(
            models,
            request.params.matchId,
            transaction,
          );
          if (!match) {
            const error = new Error("No encontramos ese partido.");
            error.status = 404;
            throw error;
          }
          if (String(match.organizerId) !== String(request.authUser.id)) {
            const error = new Error(
              "Solo el organizador puede editar este partido.",
            );
            error.status = 403;
            throw error;
          }
          if (match.status === "CANCELLED") {
            const error = new Error("El partido ya fue cancelado.");
            error.status = 409;
            throw error;
          }

          const resolvedValues = await resolveField(
            models,
            values,
            transaction,
          );
          const teamId = await resolveTeam(
            models,
            request.body.teamId ?? null,
            transaction,
          );
          const committedPlayers =
            match.participants.length +
            (resolvedValues.organizerPlays ? 1 : 0) +
            resolvedValues.outsideSlots;
          if (committedPlayers > resolvedValues.expectedPlayers) {
            const error = new Error(
              "Hay más jugadores confirmados que lugares en el partido.",
            );
            error.status = 422;
            error.field = "expectedPlayers";
            throw error;
          }

          await match.update(
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
          return findMatch(models, match.id, transaction);
        });
        return response.json({ match: getMatchResponse(updated) });
      } catch (error) {
        if (error.status) {
          return response.status(error.status).json({
            message: error.message,
            ...(error.field ? { field: error.field } : {}),
          });
        }
        throw error;
      }
    },
  );

  router.delete(
    "/:matchId",
    requirePlayer,
    matchIdValidation,
    validationErrors,
    async (request, response) => {
      const match = await models.Match.findByPk(request.params.matchId);
      if (!match) {
        return response
          .status(404)
          .json({ message: "No encontramos ese partido." });
      }
      if (String(match.organizerId) !== String(request.authUser.id)) {
        return response
          .status(403)
          .json({ message: "Solo el organizador puede eliminar este partido." });
      }
      await match.destroy();
      return response.status(204).end();
    },
  );

  router.post(
    "/:matchId/join",
    requirePlayer,
    matchIdValidation,
    validationErrors,
    async (request, response) => {
      try {
        const match = await sequelize.transaction(async (transaction) => {
          const record = await findMatchForUpdate(
            models,
            request.params.matchId,
            transaction,
          );
          if (!record) {
            const error = new Error("No encontramos ese partido.");
            error.status = 404;
            throw error;
          }
          if (String(record.organizerId) === String(request.authUser.id)) {
            const error = new Error("Sos el organizador de este partido.");
            error.status = 409;
            throw error;
          }
          if (record.status === "CANCELLED") {
            const error = new Error("El partido ya no está disponible.");
            error.status = 409;
            throw error;
          }
          if (!isFutureMatch(record.date, record.startTime)) {
            const error = new Error("No podés sumarte a un partido que ya pasó.");
            error.status = 422;
            throw error;
          }
          if (
            record.participants.some(
              (participant) =>
                String(participant.id) === String(request.authUser.id),
            )
          ) {
            const error = new Error("Ya estás anotado en este partido.");
            error.status = 409;
            throw error;
          }
          if (missingPlayersForWrite(record) <= 0) {
            const error = new Error("La cancha ya está llena.");
            error.status = 409;
            throw error;
          }

          await record.addParticipant(request.authUser, {
            through: { joinedAt: new Date() },
            transaction,
          });
          const updated = await findMatch(
            models,
            record.id,
            transaction,
          );
          await updated.update(
            { status: getMatchStatus(updated, updated.participants.length) },
            { transaction },
          );
          return findMatch(models, updated.id, transaction);
        });
        return response.json({ match: getMatchResponse(match) });
      } catch (error) {
        if (error.status) {
          return response.status(error.status).json({ message: error.message });
        }
        if (error instanceof UniqueConstraintError) {
          return response.status(409).json({ message: "Ya estás anotado en este partido." });
        }
        throw error;
      }
    },
  );

  router.delete(
    "/:matchId/join",
    requirePlayer,
    matchIdValidation,
    validationErrors,
    async (request, response) => {
      try {
        const match = await sequelize.transaction(async (transaction) => {
          const record = await findMatchForUpdate(
            models,
            request.params.matchId,
            transaction,
          );
          if (!record) {
            const error = new Error("No encontramos ese partido.");
            error.status = 404;
            throw error;
          }
          const isParticipant = record.participants.some(
            (participant) =>
              String(participant.id) === String(request.authUser.id),
          );
          if (!isParticipant) {
            const error = new Error("No estabas anotado en este partido.");
            error.status = 409;
            throw error;
          }

          await record.removeParticipant(request.authUser, { transaction });
          const updated = await findMatch(
            models,
            record.id,
            transaction,
          );
          await updated.update(
            { status: getMatchStatus(updated, updated.participants.length) },
            { transaction },
          );
          return findMatch(models, updated.id, transaction);
        });
        return response.json({ match: getMatchResponse(match) });
      } catch (error) {
        if (error.status) {
          return response.status(error.status).json({ message: error.message });
        }
        throw error;
      }
    },
  );

  router.post(
    "/:matchId/outside-slots",
    requirePlayer,
    matchIdValidation,
    validationErrors,
    async (request, response) => {
      try {
        const match = await sequelize.transaction(async (transaction) => {
          const record = await findMatchForUpdate(
            models,
            request.params.matchId,
            transaction,
          );
          if (!record) {
            const error = new Error("No encontramos ese partido.");
            error.status = 404;
            throw error;
          }
          if (String(record.organizerId) !== String(request.authUser.id)) {
            const error = new Error("Solo el organizador puede editar los cupos.");
            error.status = 403;
            throw error;
          }
          if (missingPlayersForWrite(record) <= 0) {
            const error = new Error("La cancha ya está llena.");
            error.status = 409;
            throw error;
          }

          await record.increment("outsideSlots", { by: 1, transaction });
          const updated = await findMatch(
            models,
            record.id,
            transaction,
          );
          await updated.update(
            { status: getMatchStatus(updated, updated.participants.length) },
            { transaction },
          );
          return findMatch(models, updated.id, transaction);
        });
        return response.json({ match: getMatchResponse(match) });
      } catch (error) {
        if (error.status) {
          return response.status(error.status).json({ message: error.message });
        }
        throw error;
      }
    },
  );

  return router;
}
