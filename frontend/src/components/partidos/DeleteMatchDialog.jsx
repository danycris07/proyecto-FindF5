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
        <section className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-2xl shadow-black/40 sm:p-6">
          <h2
            id="eliminar-partido-titulo"
            className="font-display text-2xl font-extrabold uppercase tracking-wider text-white"
          >
            ¿Eliminar este partido?
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Va a desaparecer de las convocatorias.
          </p>

          <dl className="mt-5 space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Cancha</dt>
              <dd className="font-semibold text-white">{match.fieldName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Día</dt>
              <dd className="font-semibold capitalize text-white">
                {formatoFecha(match.date)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Hora</dt>
              <dd className="font-semibold tabular-nums text-white">
                {match.startTime.slice(0, 5)} hs
              </dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-300">
              {error}
            </p>
          )}

          {/* Cancelar va primero: el foco arranca en el botón seguro. */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={cerrar}
              disabled={eliminando}
              className={`${BTN} border-slate-700 text-white hover:border-white`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmar}
              disabled={eliminando}
              className={`${BTN} border-red-400/60 bg-red-500/10 text-red-300 hover:bg-red-500/20`}
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
