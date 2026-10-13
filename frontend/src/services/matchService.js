import { mockFields, mockMatches } from "../mocks/MockData.js";
import {
  useInitialLoading,
  waitForInitialLoading,
} from "../hooks/useInitialLoading.js";

const MATCHES_STORAGE_KEY = "findf5-published-matches";
const DELETED_STORAGE_KEY = "findf5-deleted-matches";
const SLOTS_STORAGE_KEY = "findf5-match-slots";

function getMatchSlots() {
  const stored = localStorage.getItem(SLOTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function normalizeMatch(match) {
  const slots = getMatchSlots();
  // Si no se editó nunca, los jugadores faltantes son los esperados inicialmente
  const missingPlayers =
    slots[match.id] !== undefined
      ? slots[match.id]
      : (match.missingPlayers ?? match.expectedPlayers);

  return {
    ...match,
    missingPlayers,
    fieldName:
      match.fieldName ??
      mockFields.find((field) => field.id === match.fieldId)?.name ??
      "Cancha a confirmar",
  };
}

export async function decreaseMatchSlot(matchId, userId) {
  // Simulamos el tiempo de respuesta del servidor (400ms)
  waitForInitialLoading();

  const match = await getMatchById(matchId);
  if (!match) throw new Error("No encontramos ese partido.");

  if (String(match.organizerId) !== String(userId)) {
    throw new Error("Solo el organizador puede editar los cupos.");
  }

  if (match.missingPlayers <= 0) {
    throw new Error("La cancha ya está llena.");
  }

  // Para testear el Criterio de Aceptación 5 (Rollback), podés descomentar la siguiente línea:
  if (Math.random() > 0.5)
    throw new Error("Error de conexión al servidor. Reintentá.");

  const slots = getMatchSlots();
  slots[matchId] = match.missingPlayers - 1;
  localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(slots));

  return { ...match, missingPlayers: match.missingPlayers - 1 };
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
  return [...mockMatches, ...getSavedMatches()].filter(
    (match) => !deleted[match.id],
  );
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
    status: "OPEN",
    createdAt: now,
    updatedAt: now,
  };

  localStorage.setItem(
    MATCHES_STORAGE_KEY,
    JSON.stringify([...getSavedMatches(), match]),
  );

  return match;
}

export async function getMatches() {
  return getActiveMatches()
    .filter((match) => match.status === "OPEN")
    .map(normalizeMatch)
    .sort((a, b) =>
      `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`),
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
