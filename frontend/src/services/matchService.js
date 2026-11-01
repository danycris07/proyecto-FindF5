import { mockFields, mockMatches, mockUsers } from "../mocks/MockData.js";
import {
  useInitialLoading,
  waitForInitialLoading,
} from "../hooks/useInitialLoading.js";

const MATCHES_STORAGE_KEY = "findf5-published-matches";
const DELETED_STORAGE_KEY = "findf5-deleted-matches";
const PARTICIPATION_STORAGE_KEY = "findf5-match-participation";

// Poné en true para que "Restar cupo" falle ~50% de las veces y probar el rollback.
const SIMULAR_ERROR_DE_RED = false;

/**
 * Cupos derivados:
 *   faltan = esperados - (organizador juega ? 1 : 0) - cubiertos por fuera - anotados
 * Los anotados y los cubiertos por fuera se guardan aparte, por partido.
 */
function getParticipation() {
  const stored = localStorage.getItem(PARTICIPATION_STORAGE_KEY);
  if (!stored) return {};

  const data = JSON.parse(stored);
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(
      "No se pudieron leer los jugadores anotados de esta sesión.",
    );
  }
  return data;
}

function saveParticipation(matchId, changes) {
  const all = getParticipation();
  all[matchId] = { ...all[matchId], ...changes };
  localStorage.setItem(PARTICIPATION_STORAGE_KEY, JSON.stringify(all));
}

function leerCupos(details, anotados = 0) {
  const organizerPlays = details.organizerPlays !== false;
  const outsideSlots = Number(details.cubiertosPorFuera ?? 0);
  const expectedPlayers = Number(details.jugadoresEsperados);

  if (!Number.isInteger(outsideSlots) || outsideSlots < 0) {
    throw new Error("Los jugadores cubiertos por fuera deben ser 0 o más.");
  }
  if ((organizerPlays ? 1 : 0) + outsideSlots + anotados > expectedPlayers) {
    throw new Error("Hay más jugadores confirmados que lugares en el partido.");
  }

  return { organizerPlays, outsideSlots };
}

function normalizeMatch(match) {
  const record = getParticipation()[match.id] ?? {};
  const participants = record.participants ?? [];
  const expectedPlayers = Number(match.expectedPlayers);
  // Por defecto el organizador juega (también aplica a los partidos mock).
  const organizerSlots = match.organizerPlays === false ? 0 : 1;
  // Los mock traían "faltantes" fijos: se toman como lo ya cubierto por fuera.
  const outsideSlots =
    record.outsideSlots ??
    (match.missingPlayers === undefined
      ? 0
      : Math.max(
          0,
          expectedPlayers - organizerSlots - Number(match.missingPlayers),
        ));
  const missingPlayers = Math.max(
    0,
    expectedPlayers - organizerSlots - outsideSlots - participants.length,
  );

  return {
    ...match,
    organizerPlays: organizerSlots === 1,
    organizerName:
      match.organizerName ??
      mockUsers.find((user) => String(user.id) === String(match.organizerId))
        ?.name ??
      "Organizador",
    participants,
    outsideSlots,
    missingPlayers,
    fieldName:
      match.fieldName ??
      mockFields.find((field) => field.id === match.fieldId)?.name ??
      "Cancha a confirmar",
  };
}

// El organizador marca un lugar como cubierto por fuera (amigos sin la app).
export async function decreaseMatchSlot(matchId, userId) {
  await waitForInitialLoading();

  const match = await getMatchById(matchId);
  if (!match) throw new Error("No encontramos ese partido.");

  if (String(match.organizerId) !== String(userId)) {
    throw new Error("Solo el organizador puede editar los cupos.");
  }

  if (match.missingPlayers <= 0) {
    throw new Error("La cancha ya está llena.");
  }

  if (SIMULAR_ERROR_DE_RED && Math.random() > 0.5) {
    throw new Error("Error de conexión al servidor. Reintentá.");
  }

  saveParticipation(matchId, { outsideSlots: match.outsideSlots + 1 });

  return getMatchById(matchId);
}

export async function joinMatch(matchId, user) {
  await waitForInitialLoading();

  if (!user?.id) throw new Error("Iniciá sesión para sumarte a un partido.");

  const match = await getMatchById(matchId);
  if (!match) throw new Error("No encontramos ese partido.");

  if (String(match.organizerId) === String(user.id)) {
    throw new Error("Sos el organizador de este partido.");
  }
  if (match.participants.some((p) => String(p.userId) === String(user.id))) {
    throw new Error("Ya estás anotado en este partido.");
  }
  if (match.missingPlayers <= 0) {
    throw new Error("La cancha ya está llena.");
  }

  saveParticipation(matchId, {
    participants: [
      ...match.participants,
      { userId: user.id, name: user.name, joinedAt: new Date().toISOString() },
    ],
  });

  return getMatchById(matchId);
}

export async function leaveMatch(matchId, userId) {
  await waitForInitialLoading();

  const match = await getMatchById(matchId);
  if (!match) throw new Error("No encontramos ese partido.");

  if (!match.participants.some((p) => String(p.userId) === String(userId))) {
    throw new Error("No estabas anotado en este partido.");
  }

  saveParticipation(matchId, {
    participants: match.participants.filter(
      (p) => String(p.userId) !== String(userId),
    ),
  });

  return getMatchById(matchId);
}

function getDeletedMatches() {
  const stored = localStorage.getItem(DELETED_STORAGE_KEY);
  if (!stored) return {};

  const deleted = JSON.parse(stored);
  if (
    deleted === null ||
    typeof deleted !== "object" ||
    Array.isArray(deleted)
  ) {
    throw new Error(
      "No se pudieron leer los partidos eliminados de esta sesión.",
    );
  }
  return deleted;
}

function getActiveMatches() {
  const deleted = getDeletedMatches();
  const saved = getSavedMatches();
  const savedIds = new Set(saved.map((m) => String(m.id)));

  const activeMocks = mockMatches.filter((m) => !savedIds.has(String(m.id)));

  return [...activeMocks, ...saved].filter((match) => !deleted[match.id]);
}
function getSavedMatches() {
  const storedMatches = localStorage.getItem(MATCHES_STORAGE_KEY);

  if (!storedMatches) {
    return [];
  }

  const matches = JSON.parse(storedMatches);
  if (!Array.isArray(matches)) {
    throw new Error(
      "No se pudieron leer los partidos guardados en esta sesión.",
    );
  }

  return matches;
}

export async function createMatch(details, organizerId) {
  if (!organizerId) {
    throw new Error("Iniciá sesión antes de publicar un partido.");
  }

  const basePricePerPlayer = Number(details.cuota);
  const playingForCoca = details.jugarPorLaCoca === true;
  const cocaAmountPerPlayer = playingForCoca
    ? Number(details.montoExtraCoca)
    : 0;

  if (!Number.isFinite(basePricePerPlayer) || basePricePerPlayer < 0) {
    throw new Error("La cuota base debe ser un monto igual o mayor que 0.");
  }
  if (
    playingForCoca &&
    (!Number.isFinite(cocaAmountPerPlayer) || cocaAmountPerPlayer <= 0)
  ) {
    throw new Error("El monto extra por jugador debe ser mayor que 0.");
  }

  const { organizerPlays, outsideSlots } = leerCupos(details);

  const field = mockFields.find(
    (availableField) => availableField.name === details.cancha,
  );
  const now = new Date().toISOString();
  const match = {
    id: Date.now(),
    fieldId: field?.id ?? null,
    fieldName: details.cancha,
    date: details.fecha,
    startTime: details.hora,
    expectedPlayers: details.jugadoresEsperados,
    playingForCoca,
    basePricePerPlayer,
    cocaAmountPerPlayer,
    pricePerPlayer: basePricePerPlayer + cocaAmountPerPlayer,
    organizerId,
    organizerPlays,
    status: "OPEN",
    createdAt: now,
    updatedAt: now,
  };

  localStorage.setItem(
    MATCHES_STORAGE_KEY,
    JSON.stringify([...getSavedMatches(), match]),
  );
  saveParticipation(match.id, { participants: [], outsideSlots });

  return normalizeMatch(match);
}

export async function getMatches() {
  return getActiveMatches()
    .filter((match) => match.status === "OPEN")
    .map(normalizeMatch)
    .sort((a, b) =>
      `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`),
    );
}

/** Partidos abiertos en los que el usuario organiza o está anotado. */
export async function getMyMatches(userId) {
  const matches = await getMatches();
  return matches.filter(
    (match) =>
      String(match.organizerId) === String(userId) ||
      match.participants.some((p) => String(p.userId) === String(userId)),
  );
}

export async function getMatchById(matchId) {
  const match = getActiveMatches().find(
    (item) => String(item.id) === String(matchId),
  );
  return match ? normalizeMatch(match) : null;
}
export async function deleteMatch(matchId, userId) {
  // Simula la demora de la red. Borrar esta línea cuando exista el backend.
  await new Promise((resolve) => setTimeout(resolve, 600));

  const match = getActiveMatches().find(
    (item) => String(item.id) === String(matchId),
  );
  if (!match) {
    throw new Error("No encontramos ese partido.");
  }
  if (!userId || String(match.organizerId) !== String(userId)) {
    throw new Error("Solo el organizador puede eliminar este partido.");
  }

  localStorage.setItem(
    DELETED_STORAGE_KEY,
    JSON.stringify({
      ...getDeletedMatches(),
      [match.id]: new Date().toISOString(),
    }),
  );
}

// Y agrega esta nueva función al final del archivo:
export async function updateMatch(matchId, userId, details) {
  // Simulamos red
  await new Promise((resolve) => setTimeout(resolve, 600));

  const match = await getMatchById(matchId);
  if (!match) throw new Error("No encontramos ese partido.");
  if (String(match.organizerId) !== String(userId)) {
    throw new Error("Solo el organizador puede editar el partido.");
  }

  const basePricePerPlayer = Number(details.cuota);
  const playingForCoca = details.jugarPorLaCoca === true;
  const cocaAmountPerPlayer = playingForCoca
    ? Number(details.montoExtraCoca)
    : 0;

  if (!Number.isFinite(basePricePerPlayer) || basePricePerPlayer < 0) {
    throw new Error("La cuota base debe ser un monto igual o mayor que 0.");
  }

  const field = mockFields.find((f) => f.name === details.cancha);

  const raw = getActiveMatches().find(
    (item) => String(item.id) === String(matchId),
  );
  const { organizerPlays, outsideSlots } = leerCupos(
    details,
    match.participants.length,
  );

  const updatedMatch = {
    ...raw,
    fieldId: field?.id ?? null,
    fieldName: details.cancha,
    date: details.fecha,
    startTime: details.hora,
    expectedPlayers: details.jugadoresEsperados,
    organizerPlays,
    playingForCoca,
    basePricePerPlayer,
    cocaAmountPerPlayer,
    pricePerPlayer: basePricePerPlayer + cocaAmountPerPlayer,
    updatedAt: new Date().toISOString(),
  };

  saveParticipation(matchId, { outsideSlots });

  // Actualizar la lista de guardados
  const savedMatches = getSavedMatches();
  const index = savedMatches.findIndex((m) => String(m.id) === String(matchId));

  if (index >= 0) {
    savedMatches[index] = updatedMatch;
  } else {
    // Si era un mock sin modificaciones previas, lo guardamos ahora
    savedMatches.push(updatedMatch);
  }

  localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(savedMatches));

  return await getMatchById(matchId);
}