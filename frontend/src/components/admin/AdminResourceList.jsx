export const adminButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-sm border px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors disabled:cursor-wait disabled:opacity-50";

function AdminResourceList({
  title,
  description,
  items,
  loading,
  error,
  onRefresh,
  onCreate,
  renderItem,
  emptyMessage,
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
      <div className="rounded-sm border border-border bg-surface p-5 sm:p-6">
        <h2 className="font-display text-xl font-extrabold uppercase tracking-wider">
          {title}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
        {onCreate}
      </div>
      <div className="rounded-sm border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold uppercase tracking-wider">
            Registros <span className="text-sm text-text-secondary">{items.length}</span>
          </h2>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className={`${adminButtonClass} border-border text-text-primary hover:border-status`}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-sm border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            {error}
          </p>
        )}
        {loading ? (
          <p role="status" className="mt-5 text-sm text-text-secondary">
            Cargando registros...
          </p>
        ) : items.length === 0 && !error ? (
          <p className="mt-5 rounded-sm border border-dashed border-border p-4 text-sm text-text-secondary">
            {emptyMessage}
          </p>
        ) : (
          <div className="mt-5 grid gap-3">{items.map(renderItem)}</div>
        )}
      </div>
    </section>
  );
}

export default AdminResourceList;
