import { useState } from "react";
import MatchModal from "./MatchModal.jsx";
import { deleteMatch } from "../../services/matchService.js";

function formatoFecha(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

const BTN =
  "inline-flex min-h-11 items-center justify-center rounded-sm border px-5 py-2 text-sm font-extrabold uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50";

function DeleteMatchDialog({ match, userId, onClose, onDeleted }) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const cerrar = () => {
    setError("");
    onClose();
  };

  const confirmar = async () => {
    setEliminando(true);
    setError("");

    try {
      await deleteMatch(match.id, userId);
      setEliminando(false);
      onDeleted(match);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? `No se pudo eliminar el partido: ${deleteError.message}`
          : "No se pudo eliminar el partido. Intentá de nuevo.",
      );
      setEliminando(false);
    }
  };

  return (
    <MatchModal
      open={match !== null}
      onClose={cerrar}
      size="max-w-md"
      dismissible={!eliminando}
      labelledBy="eliminar-partido-titulo"
    >
      {match && (
        <section className="rounded-md border border-border bg-surface p-5 shadow-2xl shadow-[var(--shadow-color)] sm:p-6">
          <h2
            id="eliminar-partido-titulo"
            className="font-display text-2xl font-extrabold uppercase tracking-wider text-text-primary"
          >
            ¿Eliminar este partido?
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Va a desaparecer de las convocatorias.
          </p>

          <dl className="mt-5 space-y-2 rounded-sm border border-border bg-background p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Cancha</dt>
              <dd className="font-semibold text-text-primary">
                {match.fieldName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Día</dt>
              <dd className="font-semibold capitalize text-text-primary">
                {formatoFecha(match.date)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Hora</dt>
              <dd className="font-semibold tabular-nums text-text-primary">
                {match.startTime.slice(0, 5)} hs
              </dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="mt-4 text-sm text-danger">
              {error}
            </p>
          )}

          {/* Cancelar va primero: el foco arranca en el botón seguro. */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={cerrar}
              disabled={eliminando}
              className={`${BTN} border-border text-text-primary hover:border-text-primary`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmar}
              disabled={eliminando}
              className={`${BTN} border-danger/60 bg-danger/10 text-danger hover:bg-danger/20`}
            >
              {eliminando ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </section>
      )}
    </MatchModal>
  );
}

export default DeleteMatchDialog;
