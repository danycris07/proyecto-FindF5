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

function MatchCard({ match, onSelect }) {
  const { semana, numero, mes } = partesFecha(match.date);
  const etiqueta = etiquetaDia(match.date);

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

        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="font-display text-xl font-extrabold tabular-nums text-primary-text">
            {currencyFormatter.format(match.pricePerPlayer)}
          </p>
          {match.missingPlayers !== undefined && (
            <p
              className={`flex items-center gap-1.5 text-sm tabular-nums font-semibold ${match.missingPlayers === 0 ? "text-status" : "text-text-secondary"}`}
            >
              <GoPeople aria-hidden="true" />
              {match.missingPlayers > 0
                ? `Faltan ${match.missingPlayers}`
                : "Cancha llena"}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default MatchCard;