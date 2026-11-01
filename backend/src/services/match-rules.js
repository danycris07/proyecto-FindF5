const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";
export const MIN_EXPECTED_PLAYERS = 5;
export const MAX_EXPECTED_PLAYERS = 24;

function ruleError(message, field) {
  const error = new Error(message);
  error.field = field;
  return error;
}

export function isFutureMatch(date, time, now = new Date()) {
  const argentinaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const argentinaTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: ARGENTINA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(now);

  return date > argentinaDate || (date === argentinaDate && time > argentinaTime);
}

export function getMissingPlayers(match, participantCount) {
  const organizerSlots = match.organizerPlays === false ? 0 : 1;
  return Math.max(
    0,
    Number(match.expectedPlayers) -
      organizerSlots -
      Number(match.outsideSlots ?? 0) -
      participantCount,
  );
}

export function getMatchStatus(match, participantCount) {
  if (match.status === "CANCELLED") {
    return "CANCELLED";
  }
  return getMissingPlayers(match, participantCount) === 0 ? "COMPLETE" : "OPEN";
}

export function getMatchResponse(match) {
  const participants = (match.participants ?? []).map((participant) => ({
    userId: participant.id,
    name: participant.name,
    joinedAt: participant.MatchParticipant?.joinedAt ?? null,
  }));
  const participantCount = participants.length;

  return {
    id: match.id,
    teamId: match.teamId,
    fieldId: match.fieldId,
    fieldName: match.field?.name ?? match.fieldName,
    fieldImageUrl: match.field?.imageUrl ?? null,
    date: match.date,
    startTime: match.startTime,
    endTime: match.endTime,
    expectedPlayers: Number(match.expectedPlayers),
    organizerId: match.organizerId,
    organizerName: match.organizer?.name ?? "Organizador",
    organizerPlays: match.organizerPlays,
    outsideSlots: Number(match.outsideSlots),
    missingPlayers: getMissingPlayers(match, participantCount),
    participants,
    playingForCoca: match.playingForCoca,
    basePricePerPlayer: Number(match.basePricePerPlayer),
    cocaAmountPerPlayer: Number(match.cocaAmountPerPlayer),
    pricePerPlayer: Number(match.pricePerPlayer),
    status: getMatchStatus(match, participantCount),
    createdAt: match.createdAt,
    updatedAt: match.updatedAt,
  };
}

export function normalizeMatchInput(body) {
  const playingForCoca = body.playingForCoca === true;
  const basePricePerPlayer = Number(body.basePricePerPlayer);
  const cocaAmountPerPlayer = playingForCoca
    ? Number(body.cocaAmountPerPlayer)
    : 0;
  const expectedPlayers = Number(body.expectedPlayers);
  const organizerPlays = body.organizerPlays !== false;
  const outsideSlots = Number(body.outsideSlots ?? 0);

  if (!Number.isFinite(basePricePerPlayer) || basePricePerPlayer < 0) {
    throw ruleError(
      "La cuota base debe ser un monto igual o mayor que 0.",
      "basePricePerPlayer",
    );
  }
  if (
    playingForCoca &&
    (!Number.isFinite(cocaAmountPerPlayer) || cocaAmountPerPlayer <= 0)
  ) {
    throw ruleError(
      "El monto extra por jugador debe ser mayor que 0.",
      "cocaAmountPerPlayer",
    );
  }
  if (
    !Number.isInteger(expectedPlayers) ||
    expectedPlayers < 1 ||
    expectedPlayers > 4294967295
  ) {
    throw ruleError(
      "Los jugadores esperados deben ser un entero mayor que 0.",
      "expectedPlayers",
    );
  }
  if (
    !Number.isInteger(outsideSlots) ||
    outsideSlots < 0 ||
    outsideSlots > 4294967295
  ) {
    throw ruleError(
      "Los jugadores confirmados por fuera deben ser 0 o más.",
      "outsideSlots",
    );
  }
  if ((organizerPlays ? 1 : 0) + outsideSlots > expectedPlayers) {
    throw ruleError(
      "Hay más jugadores confirmados que lugares en el partido.",
      "outsideSlots",
    );
  }

  const pricePerPlayer = basePricePerPlayer + cocaAmountPerPlayer;
  if (pricePerPlayer > 99999999.99) {
    throw ruleError(
      "El importe total por jugador supera el máximo permitido.",
      playingForCoca ? "cocaAmountPerPlayer" : "basePricePerPlayer",
    );
  }

  return {
    fieldId: body.fieldId ?? null,
    fieldName: body.fieldName?.trim(),
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime ?? null,
    expectedPlayers,
    organizerPlays,
    outsideSlots,
    playingForCoca,
    basePricePerPlayer,
    cocaAmountPerPlayer,
    pricePerPlayer,
  };
}

export function normalizePublicMatchInput(body, { requireOpenSlot = false } = {}) {
  const values = normalizeMatchInput(body);
  if (
    values.expectedPlayers < MIN_EXPECTED_PLAYERS ||
    values.expectedPlayers > MAX_EXPECTED_PLAYERS
  ) {
    throw ruleError(
      `El partido debe tener entre ${MIN_EXPECTED_PLAYERS} y ${MAX_EXPECTED_PLAYERS} jugadores esperados.`,
      "expectedPlayers",
    );
  }
  if (values.basePricePerPlayer <= 0) {
    throw ruleError(
      "La cuota por jugador debe ser mayor que 0.",
      "basePricePerPlayer",
    );
  }
  if (!Number.isInteger(values.basePricePerPlayer)) {
    throw ruleError(
      "La cuota por jugador debe ser un importe entero.",
      "basePricePerPlayer",
    );
  }
  if (
    values.playingForCoca &&
    !Number.isInteger(values.cocaAmountPerPlayer)
  ) {
    throw ruleError(
      "El monto extra debe ser un importe entero.",
      "cocaAmountPerPlayer",
    );
  }
  if (requireOpenSlot && getMissingPlayers(values, 0) < 1) {
    throw ruleError(
      "Dejá al menos un cupo disponible para que otros jugadores puedan sumarse.",
      "outsideSlots",
    );
  }

  return values;
}
