import MatchModal from "./MatchModal.jsx";

const moneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function formatearDia(fecha) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function textoCoca(juega, monto) {
  return juega ? `Sí, +${moneda.format(Number(monto) || 0)}` : "No";
}

/** Compara el partido original con lo editado y lista solo lo que cambia. */
function listarCambios(original, data) {
  const cambios = [];

  if (data.cancha !== original.fieldName) {
    cambios.push({ etiqueta: "Cancha", antes: original.fieldName, ahora: data.cancha });
  }
  if (data.fecha !== original.date) {
    cambios.push({
      etiqueta: "Día",
      antes: formatearDia(original.date),
      ahora: formatearDia(data.fecha),
    });
  }
  if (data.hora !== original.startTime.slice(0, 5)) {
    cambios.push({
      etiqueta: "Hora",
      antes: `${original.startTime.slice(0, 5)} hs`,
      ahora: `${data.hora} hs`,
    });
  }
  if (Number(data.cuota) !== original.basePricePerPlayer) {
    cambios.push({
      etiqueta: "Cuota por jugador",
      antes: moneda.format(original.basePricePerPlayer),
      ahora: moneda.format(Number(data.cuota)),
    });
  }

  const cocaAntes = textoCoca(original.playingForCoca, original.cocaAmountPerPlayer);
  const cocaAhora = textoCoca(data.jugarPorLaCoca, data.montoExtraCoca);
  if (cocaAntes !== cocaAhora) {
    cambios.push({ etiqueta: "Jugar por la coca", antes: cocaAntes, ahora: cocaAhora });
  }

  return cambios;
}

/** Pide confirmación antes de cambiar condiciones de un partido con jugadores anotados. */
function ConfirmEditDialog({ open, original, data, onCancel, onConfirm }) {
  const cambios = original && data ? listarCambios(original, data) : [];

  return (
    <MatchModal
      open={open}
      onClose={onCancel}
      size="max-w-md"
      labelledBy="confirm-edit-title"
    >
      <div className="rounded-md border border-border bg-surface p-6 text-text-primary shadow-2xl shadow-[var(--shadow-color)]">
        <h2
          id="confirm-edit-title"
          className="font-display text-3xl font-extrabold uppercase leading-none tracking-wider"
        >
          ¿Guardar los cambios?
        </h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Este partido ya tiene jugadores anotados. Se les notificará el cambio
          de condiciones.
        </p>

        {cambios.length > 0 && (
          <dl className="mt-5 space-y-2">
            {cambios.map((cambio) => (
              <div
                key={cambio.etiqueta}
                className="rounded-sm border border-border bg-background px-4 py-3"
              >
                <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {cambio.etiqueta}
                </dt>
                <dd className="mt-1 flex flex-wrap items-center gap-x-2 text-sm tabular-nums">
                  <span className="text-text-secondary line-through">
                    <span className="sr-only">Antes: </span>
                    {cambio.antes}
                  </span>
                  <span aria-hidden="true" className="text-text-secondary">
                    →
                  </span>
                  <span className="font-semibold text-text-primary">
                    <span className="sr-only">Ahora: </span>
                    {cambio.ahora}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-border px-4 py-2 text-sm font-extrabold uppercase tracking-wider text-text-primary transition-colors hover:border-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-primary-foreground bg-primary px-4 py-2 text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-[0_8px_30px_var(--primary-shadow)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_34px_var(--primary-shadow-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status motion-reduce:transition-none"
          >
            Confirmar y guardar
          </button>
        </div>
      </div>
    </MatchModal>
  );
}

export default ConfirmEditDialog;
