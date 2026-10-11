const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function formatoFecha(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function MatchCard({ match, onSelect }) {
  return (
    <button
      onClick={() => onSelect(match)}
      className="block rounded-sm border border-border bg-surface p-5 transition-colors hover:border-primary"
    >
      <p className="font-display text-sm font-bold uppercase tracking-wider text-text-secondary">
        {formatoFecha(match.date)} · {match.startTime.slice(0, 5)} hs
      </p>
      <h2 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-wider text-text-primary">
        {match.fieldName}
      </h2>
      <div className="mt-4 flex items-end justify-between">
        <p className="font-display text-xl font-extrabold tabular-nums text-primary">
          {currencyFormatter.format(match.pricePerPlayer)}
        </p>
        {match.expectedPlayers && (
          <p className="text-sm tabular-nums text-text-secondary">
            {match.expectedPlayers} jugadores
          </p>
        )}
      </div>
    </button>
  );
}

export default MatchCard;
