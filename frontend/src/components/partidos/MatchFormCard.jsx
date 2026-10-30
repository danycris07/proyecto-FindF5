function MatchFormCard({
  embedded,
  animated,
  onSubmit,
  isSubmitting,
  fields,
  error,
  isEditMode,
}) {
  const title = isEditMode ? "Editar partido" : "Armar partido";
  const desc = isEditMode
    ? "Actualizá los datos o corregí imprevistos."
    : "Dejá la cancha, el horario y la cuota listos para que el equipo se sume.";
  const btnText = isSubmitting
    ? "Guardando..."
    : isEditMode
      ? "Guardar cambios"
      : "Armar partido";
  return (
    <section
      className={`relative isolate overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-2xl shadow-[var(--shadow-color)] transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none sm:p-8 ${
        animated ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative z-10">
        {embedded ? (
          <h2 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-wider text-text-primary sm:text-5xl">
            {title}
          </h2>
        ) : (
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-wider text-text-primary sm:text-5xl">
            {title}
          </h1>
        )}
        <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">{desc}</p>

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
              className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-sm border border-primary bg-primary px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-[0_8px_30px_var(--primary-shadow)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_var(--primary-shadow-strong)] active:translate-y-0 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none sm:w-auto"
          >
            {btnText}
          </button>
        </form>
      </div>
    </section>
  );
}

export default MatchFormCard;