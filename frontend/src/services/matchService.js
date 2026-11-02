import { mockFields, mockMatches, mockUsers } from "../mocks/MockData.js";
import {
  apiRequest,
  reportMockFallback,
  shouldUseMockFallback,
} from "./apiClient.js";

function normalizeMockMatch(match) {
  const field = mockFields.find(
    (availableField) => String(availableField.id) === String(match.fieldId),
  );
  const organizer = mockUsers.find(
    (user) => String(user.id) === String(match.organizerId),
  );
  const participants = match.participants ?? [];
  const organizerPlays = match.organizerPlays !== false;
  const outsideSlots = Number(match.outsideSlots ?? 0);

  return {
    ...match,
    organizerPlays,
    organizerName: match.organizerName ?? organizer?.name ?? "Organizador",
    participants,
    outsideSlots,
    missingPlayers: Math.max(
      0,
      Number(match.expectedPlayers) -
        (organizerPlays ? 1 : 0) -
        outsideSlots -
        participants.length,
    ),
    fieldName: match.fieldName ?? field?.name ?? "Cancha a confirmar",
    fieldAddress: match.fieldAddress ?? field?.address ?? null,
    fieldImageUrl: match.fieldImageUrl ?? field?.imagen ?? null,
  };
}

function getMockMatches() {
  return mockMatches
    .filter((match) => !match.deletedAt && match.status === "OPEN")
    .map(normalizeMockMatch);
}

function fallbackForMatch(error, action, mockValue) {
  if (!shouldUseMockFallback(error)) {
    throw error;
  }
  reportMockFallback(action, error);
  return mockValue;
}

function toApiMatchDetails(details) {
  const fieldId = Number(details.fieldId);
  return {
    fieldName: details.cancha?.trim(),
    ...(Number.isInteger(fieldId) && fieldId > 0 ? { fieldId } : {}),
    date: details.fecha,
    startTime: details.hora,
    endTime: details.horaFin || null,
    expectedPlayers: Number(details.jugadoresEsperados),
    playingForCoca: details.jugarPorLaCoca === true,
    basePricePerPlayer: Number(details.cuota),
    cocaAmountPerPlayer:
      details.jugarPorLaCoca === true ? Number(details.montoExtraCoca) : 0,
    organizerPlays: details.organizerPlays !== false,
    outsideSlots: Number(details.cubiertosPorFuera ?? 0),
    ...(details.teamId ? { teamId: Number(details.teamId) } : {}),
  };
}

export async function getMatches() {
  try {
    return await apiRequest("/matches");
  } catch (error) {
    return fallbackForMatch(error, "partidos", getMockMatches());
  }
}

export async function getMyMatches(userId) {
  try {
    return await apiRequest("/matches/mine");
  } catch (error) {
    const mockMatchesForUser = getMockMatches().filter(
      (match) => String(match.organizerId) === String(userId),
    );
    return fallbackForMatch(error, "tus partidos", mockMatchesForUser);
  }
}

export async function getMatchById(matchId) {
  try {
    const result = await apiRequest(`/matches/${encodeURIComponent(matchId)}`);
    return result.match;
  } catch (error) {
    if (error?.status === 404) return null;
    const mockMatch = mockMatches.find(
      (match) => String(match.id) === String(matchId),
    );
    return fallbackForMatch(
      error,
      "el detalle del partido",
      mockMatch ? normalizeMockMatch(mockMatch) : null,
    );
  }
}

export async function createMatch(details, organizerId) {
  if (!organizerId) {
    throw new Error("Iniciá sesión antes de publicar un partido.");
  }
  const result = await apiRequest("/matches", {
    method: "POST",
    body: toApiMatchDetails(details),
  });
  return result.match;
}

export async function updateMatch(matchId, userId, details) {
  if (!userId) {
    throw new Error("Iniciá sesión para editar este partido.");
  }
  const result = await apiRequest(`/matches/${encodeURIComponent(matchId)}`, {
    method: "PUT",
    body: toApiMatchDetails(details),
  });
  return result.match;
}

export async function deleteMatch(matchId, userId) {
  if (!userId) {
    throw new Error("Iniciá sesión para eliminar este partido.");
  }
  await apiRequest(`/matches/${encodeURIComponent(matchId)}`, {
    method: "DELETE",
  });
}

export async function joinMatch(matchId, user) {
  if (!user?.id) {
    throw new Error("Iniciá sesión para sumarte a un partido.");
  }
  const result = await apiRequest(
    `/matches/${encodeURIComponent(matchId)}/join`,
    { method: "POST" },
  );
  return result.match;
}

export async function leaveMatch(matchId, userId) {
  if (!userId) {
    throw new Error("Iniciá sesión para bajarte de este partido.");
  }
  const result = await apiRequest(
    `/matches/${encodeURIComponent(matchId)}/join`,
    { method: "DELETE" },
  );
  return result.match;
}

export async function decreaseMatchSlot(matchId, userId) {
  if (!userId) {
    throw new Error("Iniciá sesión para actualizar los cupos.");
  }
  const result = await apiRequest(
    `/matches/${encodeURIComponent(matchId)}/outside-slots`,
    { method: "POST" },
  );
  return result.match;
}
