import AdminFormField, { adminInputClass } from "./AdminFormField.jsx";

export function AdminMatchScheduleFields({
  register,
  setValue,
  errors,
  fields,
  players,
  match,
}) {
  const fieldName = register("fieldName", { required: "Indicá la cancha." });

  return (
    <>
      <AdminFormField id="admin-match-field" label="Cancha">
        <>
          <input
            id="admin-match-field"
            list="admin-match-fields"
            className={adminInputClass}
            {...fieldName}
            onChange={(event) => {
              fieldName.onChange(event);
              const selected = fields.find(
                (field) => field.name === event.target.value,
              );
              setValue("fieldId", selected?.id ?? "", { shouldDirty: true });
            }}
          />
          <datalist id="admin-match-fields">
            {fields.map((field) => (
              <option key={field.id} value={field.name}>{field.address}</option>
            ))}
          </datalist>
        </>
      </AdminFormField>
      <input type="hidden" {...register("fieldId")} />
      {errors.fieldName && <p role="alert" className="text-sm text-danger">{errors.fieldName.message}</p>}
      {!match ? (
        <AdminFormField id="admin-match-organizer" label="Organizador">
          <select
            id="admin-match-organizer"
            className={adminInputClass}
            {...register("organizerId", { required: "Elegí un organizador." })}
          >
            <option value="">Seleccioná un jugador</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
        </AdminFormField>
      ) : (
        <p className="text-sm text-text-secondary">
          Organiza: {match.organizerName}
        </p>
      )}
      {errors.organizerId && <p role="alert" className="text-sm text-danger">{errors.organizerId.message}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminFormField
          id="admin-match-date"
          label="Fecha"
          type="date"
          registration={register("date", { required: "Elegí una fecha." })}
        />
        <AdminFormField
          id="admin-match-start"
          label="Hora de inicio"
          type="time"
          registration={register("startTime", { required: "Elegí una hora." })}
        />
        <AdminFormField
          id="admin-match-end"
          label="Hora de fin"
          type="time"
          registration={register("endTime")}
        />
        <AdminFormField
          id="admin-match-expected"
          label="Jugadores esperados"
          type="number"
          registration={register("expectedPlayers", {
            required: "Indicá los jugadores esperados.",
            valueAsNumber: true,
            min: { value: 1, message: "Debe haber al menos un jugador." },
          })}
          min="1"
        />
      </div>
      {errors.date && <p role="alert" className="text-sm text-danger">{errors.date.message}</p>}
      {errors.startTime && <p role="alert" className="text-sm text-danger">{errors.startTime.message}</p>}
      {errors.expectedPlayers && <p role="alert" className="text-sm text-danger">{errors.expectedPlayers.message}</p>}
    </>
  );
}

export function AdminMatchPriceFields({ register, errors, playingForCoca }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminFormField
          id="admin-match-outside"
          label="Confirmados por fuera"
          type="number"
          registration={register("outsideSlots", {
            setValueAs: (value) => value === "" ? 0 : Number(value),
            validate: (value) => Number.isInteger(value) && value >= 0
              ? true
              : "Ingresá un entero igual o mayor que 0.",
          })}
          min="0"
        />
        <AdminFormField
          id="admin-match-price"
          label="Cuota base por jugador"
          type="number"
          registration={register("basePricePerPlayer", {
            required: "Ingresá la cuota.",
            valueAsNumber: true,
            min: { value: 0, message: "No puede ser menor que 0." },
          })}
          min="0"
          step="0.01"
        />
        <AdminFormField
          id="admin-match-coca-amount"
          label="Extra por la coca"
          type="number"
          registration={register("cocaAmountPerPlayer", {
            setValueAs: (value) => value === "" ? "" : Number(value),
            validate: (value) =>
              !playingForCoca ||
              (Number.isFinite(value) && value > 0) ||
              "Ingresá un extra mayor que 0.",
          })}
          min="0.01"
          step="0.01"
        />
      </div>
      {errors.outsideSlots && <p role="alert" className="text-sm text-danger">{errors.outsideSlots.message}</p>}
      {errors.basePricePerPlayer && <p role="alert" className="text-sm text-danger">{errors.basePricePerPlayer.message}</p>}
      {errors.cocaAmountPerPlayer && <p role="alert" className="text-sm text-danger">{errors.cocaAmountPerPlayer.message}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="checkbox" {...register("organizerPlays")} />
          El organizador juega
        </label>
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="checkbox" {...register("playingForCoca")} />
          Se juega por la coca
        </label>
      </div>
    </>
  );
}
