import { useState } from "react";
import {
  decreaseMatchSlot,
  joinMatch,
  leaveMatch,
} from "../services/matchService.js";
import { getMockSession } from "../services/sessionService.js";

const SIN_ACCION = { matchId: null, accion: null };
const SIN_ERROR = { matchId: null, accion: null, mensaje: "" };

/**
 * Acciones de participación sobre un partido: sumarse, bajarse y, para el
 * organizador, cubrir un cupo por fuera ("Restar cupo", con actualización
 * optimista y rollback si falla).
 * `onChange` recibe el partido actualizado para que la pantalla lo refleje.
 */
export function useParticipacion(match, onChange) {
  const session = getMockSession();
  const [pendiente, setPendiente] = useState(SIN_ACCION);
  const [fallo, setFallo] = useState(SIN_ERROR);

  const matchId = match?.id ?? null;
  const accionPendiente = pendiente.matchId === matchId ? pendiente.accion : null;
  const errorDe = (...acciones) =>
    fallo.matchId === matchId && acciones.includes(fallo.accion)
      ? fallo.mensaje
      : "";

  const estaAnotado = Boolean(
    match && session
      ? match.participants?.some(
          (participante) => String(participante.userId) === String(session.id),
        )
      : false,
  );

  const ejecutar = async (accion, tarea, optimista) => {
    if (!match || accionPendiente) return;

    setFallo(SIN_ERROR);
    setPendiente({ matchId: match.id, accion });
    if (optimista) onChange(optimista);

    try {
      onChange(await tarea());
    } catch (error) {
      if (optimista) onChange(match);
      setFallo({
        matchId: match.id,
        accion,
        mensaje:
          error instanceof Error
            ? error.message
            : "No se pudo completar la acción.",
      });
    } finally {
      setPendiente(SIN_ACCION);
    }
  };

  return {
    estaAnotado,
    accionPendiente,
    errorParticipacion: errorDe("join", "leave"),
    errorCupo: errorDe("decrease"),
    sumarme: () => ejecutar("join", () => joinMatch(match.id, session)),
    bajarme: () => ejecutar("leave", () => leaveMatch(match.id, session?.id)),
    restarCupo: () =>
      match?.missingPlayers > 0
        ? ejecutar(
            "decrease",
            () => decreaseMatchSlot(match.id, session?.id),
            {
              ...match,
              missingPlayers: match.missingPlayers - 1,
              outsideSlots: match.outsideSlots + 1,
            },
          )
        : undefined,
  };
}
