import { Link } from "react-router-dom";
import { m as motion, useReducedMotion } from "framer-motion";
import ImpactButton from "../ui/ImpactButton.jsx";
import PlayerProfilePopover from "./PlayerProfilePopover.jsx";

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
  currentUserId,
  isJoined = false,
  onJoin,
  onLeave,
  pendingAction = null,
  participationError = "",
  canParticipate = true,
}) {
  const reduceMotion = useReducedMotion();
  const isFull = match.missingPlayers === 0;
  const participants = match.participants ?? [];
  const nobodyYet =
    !match.organizerPlays && participants.length === 0 && !match.outsideSlots;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={
        reduceMotion || animated
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 24 }
      }
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
      className="relative isolate mx-auto w-full max-w-3xl overflow-visible rounded-md border border-border bg-surface p-5 sm:p-8"
    >
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
          <div className="mt-4 flex flex-wrap gap-2">
            {isJoined && (
              <div className="inline-flex items-center rounded-sm border border-status/40 bg-status/10 px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-status">
                Estás anotado
              </div>
            )}
            {isFull && (
              <div className="inline-flex items-center rounded-sm border border-status/40 bg-status/10 px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-status">
                Cancha llena
              </div>
            )}
          </div>
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-background p-4">
            <dt className="text-sm font-medium text-text-secondary">
              Cancha
            </dt>
            <dd className="mt-2 font-semibold text-text-primary">
              {match.fieldName ?? "Cancha"}
            </dd>
          </div>
          <div className="rounded-sm border border-border bg-background p-4">
            <dt className="text-sm font-medium text-text-secondary">
              Día
            </dt>
            <dd className="mt-2 font-semibold capitalize text-text-primary">
              {formatoFecha(match.date)}
            </dd>
          </div>
          <div className="rounded-sm border border-border bg-background p-4">
            <dt className="text-sm font-medium text-text-secondary">
              Hora
            </dt>
            <dd className="mt-2 font-semibold tabular-nums text-text-primary">
              {match.startTime}
            </dd>
          </div>

          {/* Criterio 1 y 4: Visor de Cupos y Botón Restar */}
          <div className="flex flex-col justify-between rounded-sm border border-border bg-background p-4">
            <div>
              <dt className="text-sm font-medium text-text-secondary">
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
                  className="inline-flex min-h-10 items-center justify-center rounded-sm border border-primary/50 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary-text transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
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
            <dt className="text-sm font-medium text-text-secondary">
              Anotados
            </dt>
            <dd className="mt-3">
              {nobodyYet ? (
                <p className="text-sm text-text-secondary">
                  Todavía no se anotó nadie desde la app.
                </p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {match.organizerPlays && (
                    match.organizerId ? (
                      <PlayerProfilePopover
                        key={match.organizerId}
                        userId={match.organizerId}
                        name={match.organizerName}
                        photoUrl={match.organizerPhotoUrl}
                        matchName={match.fieldName ?? "el partido"}
                        isCurrentUser={String(match.organizerId) === String(currentUserId)}
                        badge="Organiza"
                      />
                    ) : (
                      <li className="inline-flex min-h-11 items-center gap-2 px-1.5 text-sm">
                        <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-xs font-bold text-text-secondary">
                          {match.organizerName?.trim()?.charAt(0)?.toLocaleUpperCase() ?? "J"}
                        </span>
                        <span>{match.organizerName}</span>
                        <span className="ml-1 text-xs font-semibold text-status">Organiza</span>
                      </li>
                    )
                  )}
                  {participants.map((participant) => (
                    <PlayerProfilePopover
                      key={participant.userId}
                      userId={participant.userId}
                      name={participant.name}
                      photoUrl={participant.profilePhotoUrl}
                      matchName={match.fieldName ?? "el partido"}
                      isCurrentUser={String(participant.userId) === String(currentUserId)}
                    />
                  ))}
                  {match.outsideSlots > 0 && (
                    <li className="inline-flex items-center rounded-sm border border-dashed border-border px-2.5 py-1 text-sm text-text-secondary">
                      +{match.outsideSlots} confirmados por fuera
                    </li>
                  )}
                </ul>
              )}
            </dd>
          </div>

          <div className="rounded-sm border border-border bg-background p-4 sm:col-span-2">
            <dt className="text-sm font-medium text-text-secondary">
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
          {canParticipate && !isOrganizer && isJoined && (
            <button
              type="button"
              onClick={onLeave}
              disabled={pendingAction !== null}
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-danger/60 px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-danger hover:border-danger hover:bg-danger/10 disabled:cursor-wait disabled:opacity-60"
            >
              {pendingAction === "leave" ? "Bajándome..." : "Bajarme del partido"}
            </button>
          )}
          {/* Se puede sumar quien no organiza, no está anotado y hay lugar */}
          {canParticipate && !isOrganizer && !isJoined && !isFull && (
            <ImpactButton
              type="button"
              onClick={onJoin}
              disabled={!onJoin || pendingAction !== null}
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-primary-foreground bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
            >
              {pendingAction === "join" ? "Sumándome..." : "Sumarme"}
            </ImpactButton>
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
        {participationError && (
          <p role="alert" className="mt-4 text-sm font-medium text-danger">
            {participationError}
          </p>
        )}
      </div>
    </motion.section>
  );
}

export default MatchConfirmationCard;
