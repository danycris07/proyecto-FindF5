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

function MatchConfirmationCard({ match, animated }) {
  return (
    <section
      className={`relative isolate mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-5 shadow-2xl shadow-black/40 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none sm:p-8 ${
        animated ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-[#CCFF00]/10 blur-3xl"
      />

      <div className="relative z-10">
        <h1 className="mt-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text font-display text-4xl font-extrabold uppercase tracking-wider text-transparent sm:text-5xl">
          ¡Partido armado!
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
          La convocatoria ya está lista. Estos son los datos del encuentro.
        </p>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cancha
            </dt>
            <dd className="mt-2 font-semibold text-white">
              {match.fieldName ?? "Cancha"}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Día
            </dt>
            <dd className="mt-2 font-semibold capitalize text-white">
              {formatoFecha(match.date)}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Hora
            </dt>
            <dd className="mt-2 font-semibold tabular-nums text-white">
              {match.startTime}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cupos previstos
            </dt>
            <dd className="mt-2 font-semibold tabular-nums text-white">
              {match.expectedPlayers}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {match.playingForCoca
                ? "Cuota + monto extra"
                : "Cuota por jugador"}
            </dt>
            {match.playingForCoca ? (
              <dd className="mt-2 space-y-2">
                <p className="flex flex-wrap items-center gap-x-2 text-sm tabular-nums text-slate-300">
                  <span>
                    Cuota {currencyFormatter.format(match.basePricePerPlayer)}
                  </span>
                  <span aria-hidden="true">+</span>
                  <span>
                    monto extra
                    {currencyFormatter.format(match.cocaAmountPerPlayer)}
                  </span>
                </p>
                <p className="font-display text-2xl font-extrabold tabular-nums text-[#CCFF00]">
                  Total {currencyFormatter.format(match.pricePerPlayer)}
                </p>
              </dd>
            ) : (
              <dd className="mt-2 font-display text-2xl font-extrabold tabular-nums text-[#CCFF00]">
                {currencyFormatter.format(match.pricePerPlayer)}
              </dd>
            )}
          </div>
        </dl>

        <Link
          to="/partidos"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-sm border border-[#CCFF00] bg-[#CCFF00] px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-black shadow-[0_8px_30px_rgba(204,255,0,0.16)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(204,255,0,0.38)] active:translate-y-0 motion-reduce:transition-none sm:w-auto"
        >
          Volver a Gestión de partidos
        </Link>
      </div>
    </section>
  );
}

export default MatchConfirmationCard;
