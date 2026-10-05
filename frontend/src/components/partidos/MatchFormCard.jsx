function MatchFormCard({
  embedded,
  animated,
  onSubmit,
  isSubmitting,
  fields,
  error,
}) {
  return (
    <section
      className={`relative isolate overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-5 shadow-2xl shadow-black/40 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none sm:p-8 ${
        animated ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-[#CCFF00]/10 blur-3xl"
      />

      <div className="relative z-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#CCFF00]">
          <span
            aria-hidden="true"
            className="h-2 w-2 animate-pulse rounded-full bg-[#CCFF00]"
          />
          Nueva convocatoria
        </p>
        {embedded ? (
          <h2 className="mt-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text font-display text-4xl font-extrabold uppercase tracking-wider text-transparent sm:text-5xl">
            Armar partido
          </h2>
        ) : (
          <h1 className="mt-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text font-display text-4xl font-extrabold uppercase tracking-wider text-transparent sm:text-5xl">
            Armar partido
          </h1>
        )}
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Dejá la cancha, el horario y la cuota listos para que el equipo se
          sume.
        </p>

        <form
          className="mt-8 space-y-6"
          onSubmit={onSubmit}
          noValidate
          aria-busy={isSubmitting}
        >
          {fields}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-sm border border-[#CCFF00] bg-[#CCFF00] px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-black shadow-[0_8px_30px_rgba(204,255,0,0.16)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(204,255,0,0.38)] active:translate-y-0 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none sm:w-auto"
          >
            {isSubmitting ? "Publicando..." : "Armar partido"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default MatchFormCard;
