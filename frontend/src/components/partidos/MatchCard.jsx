import { GoClock, GoPeople } from "react-icons/go";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function partesFecha(date) {
  const dia = new Date(`${date}T12:00:00`);
  return {
    semana: dia
      .toLocaleDateString("es-AR", { weekday: "short" })
      .replace(".", ""),
    numero: dia.getDate(),
    mes: dia.toLocaleDateString("es-AR", { month: "short" }).replace(".", ""),
  };
}

function etiquetaDia(date) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dia = new Date(`${date}T00:00:00`);
  const diferencia = Math.round((dia - hoy) / 86400000);

  if (diferencia === 0) return "Hoy";
  if (diferencia === 1) return "Mañana";
  return null;
}

const MAX_FALTAN_URGENTE = 2;

function EstadoCupos({ faltan, urgente }) {
  if (faltan === 0) {
    return (
      <p className="inline-flex items-center gap-1.5 rounded-sm border border-status/40 bg-status/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-status">
        <GoPeople aria-hidden="true" />
        Cancha llena
      </p>
    );
  }

  const tono = urgente
    ? "border-primary-text/50 bg-primary-text/10 text-primary-text"
    : "border-border bg-background text-text-primary";

  return (
    <p
      className={`inline-flex items-center gap-2 rounded-sm border px-2.5 py-1 ${tono}`}
    >
      {urgente && (
        <span aria-hidden="true" className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-text opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-text" />
        </span>
      )}
      <span className="text-xs font-bold uppercase tracking-wider">
        {faltan === 1 ? "Falta" : "Faltan"}
      </span>
      <span className="font-display text-2xl font-extrabold leading-none tabular-nums">
        {faltan}
      </span>
      <span className="sr-only">{faltan === 1 ? "jugador" : "jugadores"}</span>
    </p>
  );
}

function MatchCard({ match, onSelect }) {
  const { semana, numero, mes } = partesFecha(match.date);
  const etiqueta = etiquetaDia(match.date);
  const urgente =
    etiqueta === "Hoy" &&
    match.missingPlayers > 0 &&
    match.missingPlayers <= MAX_FALTAN_URGENTE;

  return (
    <button
      type="button"
      onClick={() => onSelect(match)}
      className="flex w-full gap-4 rounded-sm border border-border bg-surface p-4 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status motion-reduce:transition-none"
    >
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-sm border border-border bg-background py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {semana}
        </span>
        <span className="font-display text-3xl font-extrabold leading-none text-text-primary">
          {numero}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {mes}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        {etiqueta && (
          <span className="mb-1 inline-block rounded-sm border border-status/40 bg-status/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-status">
            {etiqueta}
          </span>
        )}
        <h2 className="truncate font-display text-xl font-extrabold uppercase tracking-wider text-text-primary">
          {match.fieldName}
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm tabular-nums text-text-secondary">
          <GoClock aria-hidden="true" />
          {match.startTime.slice(0, 5)} hs
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-display text-xl font-extrabold tabular-nums text-text-primary">
            {currencyFormatter.format(match.pricePerPlayer)}
          </p>
          {match.missingPlayers !== undefined && (
            <EstadoCupos faltan={match.missingPlayers} urgente={urgente} />
          )}
        </div>
      </div>
    </button>
  );
}

export default MatchCard;