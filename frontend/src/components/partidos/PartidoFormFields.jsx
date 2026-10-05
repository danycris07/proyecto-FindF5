import CocaOptionField from "./CocaOptionField.jsx";
import MatchFormField, { inputClassName } from "./MatchFormField.jsx";

function PartidoFormFields({
  register,
  errors,
  canchas,
  canchasLoading,
  canchasError,
  onRetryCanchas,
  today,
  currentTime,
  selectedDate,
  clearDateTimeErrors,
  jugarPorLaCoca,
  cuotaBase,
  montoExtraCoca,
  totalPorJugador,
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <MatchFormField id="cancha" label="Cancha" error={errors.cancha?.message}>
          <input
            id="cancha"
            type="text"
            list="lista-canchas"
            autoComplete="off"
            aria-invalid={Boolean(errors.cancha)}
            aria-describedby={errors.cancha ? "cancha-error" : undefined}
            placeholder={canchasLoading ? "Cargando canchas..." : "Elegí o escribí una cancha"}
            className={inputClassName}
            {...register("cancha", { required: "Indicá la cancha del partido." })}
          />
          <datalist id="lista-canchas">
            {canchas.map((cancha) => (
              <option key={cancha.id} value={cancha.name}>
                {cancha.address}
              </option>
            ))}
          </datalist>
          {canchasError ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-red-400">
              <p role="alert">{canchasError}</p>
              <button
                type="button"
                onClick={onRetryCanchas}
                className="font-semibold text-[#CCFF00] underline underline-offset-4"
              >
                Reintentar
              </button>
            </div>
          ) : canchas.length === 0 && !canchasLoading ? (
            <p className="mt-2 text-sm text-slate-400">
              No hay canchas sugeridas; podés escribir el nombre.
            </p>
          ) : null}
        </MatchFormField>
      </div>

      <MatchFormField id="fecha" label="Día del partido" error={errors.fecha?.message}>
        <input
          id="fecha"
          type="date"
          min={today}
          aria-invalid={Boolean(errors.fecha)}
          aria-describedby={errors.fecha ? "fecha-error" : undefined}
          className={inputClassName}
          {...register("fecha", {
            required: "Elegí el día del partido.",
            onChange: clearDateTimeErrors,
          })}
        />
      </MatchFormField>

      <MatchFormField id="hora" label="Hora" error={errors.hora?.message}>
        <input
          id="hora"
          type="time"
          min={selectedDate === today ? currentTime : undefined}
          aria-invalid={Boolean(errors.hora)}
          aria-describedby={errors.hora ? "hora-error" : undefined}
          className={`${inputClassName} tabular-nums`}
          {...register("hora", {
            required: "Elegí la hora del partido.",
            onChange: clearDateTimeErrors,
          })}
        />
      </MatchFormField>

      <MatchFormField
        id="jugadoresEsperados"
        label="Jugadores esperados"
        error={errors.jugadoresEsperados?.message}
      >
        <input
          id="jugadoresEsperados"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          aria-invalid={Boolean(errors.jugadoresEsperados)}
          aria-describedby={
            errors.jugadoresEsperados ? "jugadoresEsperados-error" : undefined
          }
          className={`${inputClassName} tabular-nums`}
          {...register("jugadoresEsperados", {
            required: "Indicá cuántos jugadores se esperan.",
            setValueAs: (value) => (value === "" ? "" : Number(value)),
            validate: (value) =>
              (Number.isInteger(value) && value > 0) ||
              "Ingresá un número entero mayor que 0.",
          })}
        />
      </MatchFormField>

      <MatchFormField id="cuota" label="Cuota por jugador ($)" error={errors.cuota?.message}>
        <input
          id="cuota"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          aria-invalid={Boolean(errors.cuota)}
          aria-describedby={errors.cuota ? "cuota-error" : undefined}
          className={`${inputClassName} tabular-nums`}
          {...register("cuota", {
            required: "Indicá cuánto lleva cada jugador.",
            setValueAs: (value) => (value === "" ? "" : Number(value)),
            validate: (value) =>
              (Number.isFinite(value) && value >= 0) ||
              "La cuota debe ser un número igual o mayor que 0.",
          })}
        />
      </MatchFormField>

      <CocaOptionField
        register={register}
        error={errors.montoExtraCoca}
        enabled={jugarPorLaCoca}
        baseAmount={cuotaBase}
        extraAmount={montoExtraCoca}
        totalAmount={totalPorJugador}
      />
    </div>
  );
}

export default PartidoFormFields;
