import { mockFields, mockMatches } from "../mocks/MockData.js";

const MATCHES_STORAGE_KEY = "findf5-published-matches";

function getSavedMatches() {
  const storedMatches = localStorage.getItem(MATCHES_STORAGE_KEY);

  if (!storedMatches) {
    return [];
  }

  const matches = JSON.parse(storedMatches);
  if (!Array.isArray(matches)) {
    throw new Error("No se pudieron leer los partidos guardados en esta sesión.");
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
  if (playingForCoca && (!Number.isFinite(cocaAmountPerPlayer) || cocaAmountPerPlayer <= 0)) {
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

export async function getMatchById(matchId) {
  const matches = [...mockMatches, ...getSavedMatches()];
  return matches.find((match) => String(match.id) === String(matchId)) ?? null;
}
