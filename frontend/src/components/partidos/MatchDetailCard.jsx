import { Link } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

function formatoFecha(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function MatchConfirmationCard({
  match,
  animated,
  justCreated = false,
  isOrganizer = false,
  onClose,
  onDelete,
  onDecreaseSlot,
  decreaseError,
}) {
  const isFull = match.missingPlayers === 0;

  return (
    <section
      className={`relative isolate mx-auto w-full max-w-3xl overflow-hidden rounded-md border border-border bg-surface p-5 shadow-2xl shadow-[var(--shadow-color)] transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none sm:p-8 ${
        animated ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-wider text-text-primary sm:text-5xl">
              {justCreated ? "¡Partido publicado!" : "Detalles del partido"}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              {justCreated
                ? "La convocatoria ya está lista. Estos son los datos del encuentro."
                : "Estos son los datos del encuentro."}
            </p>
          </div>

          {/* Criterio 3: Estado Cancha Llena */}
          {isFull && (
            <div className="mt-4 inline-flex items-center rounded-sm border border-status/40 bg-status/10 px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-status">
              Cancha llena
            </div>
          )}
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-background p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Cancha
            </dt>
            <dd className="mt-2 font-semibold text-text-primary">
              {match.fieldName ?? "Cancha"}
            </dd>
          </div>
          <div className="rounded-sm border border-border bg-background p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Día
            </dt>
            <dd className="mt-2 font-semibold capitalize text-text-primary">
              {formatoFecha(match.date)}
            </dd>
          </div>
          <div className="rounded-sm border border-border bg-background p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Hora
            </dt>
            <dd className="mt-2 font-semibold tabular-nums text-text-primary">
              {match.startTime}
            </dd>
          </div>

          {/* Criterio 1 y 4: Visor de Cupos y Botón Restar */}
          <div className="flex flex-col justify-between rounded-sm border border-border bg-background p-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Cupos faltantes
              </dt>
              <dd className="mt-2 font-display text-2xl font-extrabold tabular-nums text-text-primary">
                {match.missingPlayers}{" "}
                <span className="text-sm font-medium text-text-secondary">
                  / {match.expectedPlayers}
                </span>
              </dd>
            </div>

            {isOrganizer && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={onDecreaseSlot}
                  disabled={isFull}
                  className="inline-flex items-center justify-center rounded-sm border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Restar cupo
                </button>
                {decreaseError && (
                  <p className="mt-2 text-xs font-medium text-danger">
                    {decreaseError}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-sm border border-border bg-background p-4 sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {match.playingForCoca
                ? "Cuota + monto extra"
                : "Cuota por jugador"}
            </dt>
            {match.playingForCoca ? (
              <dd className="mt-2 space-y-2">
                <p className="flex flex-wrap items-center gap-x-2 text-sm tabular-nums text-text-secondary">
                  <span>
                    Cuota {currencyFormatter.format(match.basePricePerPlayer)}
                  </span>
                  <span aria-hidden="true">+</span>
                  <span>
                    monto extra
                    {currencyFormatter.format(match.cocaAmountPerPlayer)}
                  </span>
                </p>
                <p className="font-display text-2xl font-extrabold tabular-nums text-primary-text">
                  Total {currencyFormatter.format(match.pricePerPlayer)}
                </p>
              </dd>
            ) : (
              <dd className="mt-2 font-display text-2xl font-extrabold tabular-nums text-primary-text">
                {currencyFormatter.format(match.pricePerPlayer)}
              </dd>
            )}
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          {/* Criterio 3: Deshabilita la opción de sumarse si la cancha está llena */}
          {!isFull && !isOrganizer && (
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-primary bg-primary px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-primary-foreground transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_var(--primary-shadow-strong)]"
            >
              Sumarme
            </button>
          )}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-border px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-text-primary hover:border-text-primary"
            >
              Cerrar
            </button>
          ) : (
            <Link
              to="/partidos"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-border px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-text-primary hover:border-text-primary"
            >
              Volver a convocatorias
            </Link>
          )}
          {isOrganizer && (
            <Link
              to={`/partidos/${match.id}/editar`}
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-border px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-text-primary hover:border-text-primary"
            >
              Editar partido
            </Link>
          )}
          {isOrganizer && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-danger/60 px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-danger hover:border-danger hover:bg-danger/10"
            >
              Eliminar partido
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default MatchConfirmationCard;
