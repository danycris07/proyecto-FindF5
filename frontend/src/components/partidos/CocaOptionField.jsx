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
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <label
          htmlFor="jugarPorLaCoca"
          className="flex min-h-12 cursor-pointer items-center gap-3 text-sm font-semibold text-white"
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
            className="relative h-7 w-12 rounded-full border border-slate-600 bg-slate-800 transition after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-slate-400 after:transition peer-checked:border-[#CCFF00] peer-checked:bg-[#CCFF00]/20 peer-checked:after:translate-x-5 peer-checked:after:bg-[#CCFF00] peer-focus-visible:ring-2 peer-focus-visible:ring-[#CCFF00] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-950"
          />
          Jugar por la coca
        </label>
        <span
          className={`rounded-sm px-2 py-1 text-xs font-bold uppercase tracking-wider ${
            enabled
              ? "bg-[#CCFF00]/15 text-[#CCFF00]"
              : "bg-slate-800 text-slate-400"
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

          <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm tabular-nums sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto]">
            <dt className="text-slate-400">Cuota</dt>
            <dd className="text-right text-white">
              {formatAmount(baseAmount)}
            </dd>
            <dt className="text-slate-400 sm:text-right">Extra por jugador</dt>
            <dd className="text-right text-white">
              {formatAmount(extraAmount)}
            </dd>
            <dt className="font-semibold text-slate-300">Total por jugador</dt>
            <dd className="text-right font-bold text-[#CCFF00]">
              {formatAmount(totalAmount)}
            </dd>
          </dl>
        </>
      )}
    </div>
  );
}

export default CocaOptionField;
