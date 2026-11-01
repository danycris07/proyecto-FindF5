const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";

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
    throw new Error("La cuota base debe ser un monto igual o mayor que 0.");
  }
  if (
    playingForCoca &&
    (!Number.isFinite(cocaAmountPerPlayer) || cocaAmountPerPlayer <= 0)
  ) {
    throw new Error("El monto extra por jugador debe ser mayor que 0.");
  }
  if (!Number.isInteger(expectedPlayers) || expectedPlayers < 1) {
    throw new Error("Los jugadores esperados deben ser un entero mayor que 0.");
  }
  if (!Number.isInteger(outsideSlots) || outsideSlots < 0) {
    throw new Error("Los jugadores confirmados por fuera deben ser 0 o más.");
  }
  if ((organizerPlays ? 1 : 0) + outsideSlots > expectedPlayers) {
    throw new Error("Hay más jugadores confirmados que lugares en el partido.");
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
    pricePerPlayer: basePricePerPlayer + cocaAmountPerPlayer,
  };
}
