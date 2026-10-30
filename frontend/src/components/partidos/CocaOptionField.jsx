import MatchFormField, { inputClassName } from "./MatchFormField.jsx";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

function formatAmount(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function CocaOptionField({
  register,
  error,
  enabled,
  baseAmount,
  extraAmount,
  totalAmount,
}) {
  return (
    <div className="sm:col-span-2">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-background p-4">
        <label
          htmlFor="jugarPorLaCoca"
          className="flex min-h-12 cursor-pointer items-center gap-3 text-sm font-semibold text-text-primary"
        >
          <input
            id="jugarPorLaCoca"
            type="checkbox"
            role="switch"
            className="peer sr-only"
            {...register("jugarPorLaCoca")}
          />
          <span
            aria-hidden="true"
            className="relative h-7 w-12 rounded-full border border-border bg-surface transition after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-text-secondary after:transition peer-checked:border-[#CCFF00] peer-checked:bg-[#CCFF00]/20 peer-checked:after:translate-x-5 peer-checked:after:bg-[#CCFF00] peer-focus-visible:ring-2 peer-focus-visible:ring-status peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface"
          />
          Jugar por la coca
        </label>
        <span
          className={`rounded-sm px-2 py-1 text-xs font-bold uppercase tracking-wider ${
            enabled
              ? "bg-primary/15 text-primary-text"
              : "bg-surface text-text-secondary"
          }`}
        >
          {enabled ? "Activado" : "Desactivado"}
        </span>
      </div>

      {enabled && (
        <>
          <div className="mt-4">
            <MatchFormField
              id="montoExtraCoca"
              label="Monto extra por jugador ($)"
              error={error?.message}
            >
              <input
                id="montoExtraCoca"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "montoExtraCoca-error" : undefined}
                className={`${inputClassName} tabular-nums`}
                {...register("montoExtraCoca", {
                  setValueAs: (value) => (value === "" ? "" : Number(value)),
                  validate: (value) =>
                    (Number.isFinite(value) && value > 0) ||
                    "Ingresá un monto mayor que 0.",
                })}
              />
            </MatchFormField>
          </div>

          <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 rounded-sm border border-border bg-background p-4 text-sm tabular-nums sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto]">
            <dt className="text-text-secondary">Cuota</dt>
            <dd className="text-right text-text-primary">
              {formatAmount(baseAmount)}
            </dd>
            <dt className="text-text-secondary sm:text-right">
              Extra por jugador
            </dt>
            <dd className="text-right text-text-primary">
              {formatAmount(extraAmount)}
            </dd>
            <dt className="font-semibold text-text-primary">
              Total por jugador
            </dt>
            <dd className="text-right font-bold text-primary-text">
              {formatAmount(totalAmount)}
            </dd>
          </dl>
        </>
      )}
    </div>
  );
}

export default CocaOptionField;
