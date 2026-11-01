import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  AdminMatchPriceFields,
  AdminMatchScheduleFields,
} from "./AdminMatchFormFields.jsx";
import { adminButtonClass } from "./AdminResourceList.jsx";

const EMPTY_MATCH = {
  fieldId: "",
  fieldName: "",
  date: "",
  startTime: "",
  endTime: "",
  expectedPlayers: 10,
  organizerId: "",
  organizerPlays: true,
  outsideSlots: 0,
  playingForCoca: false,
  basePricePerPlayer: 0,
  cocaAmountPerPlayer: "",
};

function AdminMatchForm({
  match,
  fields,
  players,
  referenceError,
  onSave,
  onCancel,
}) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: match
      ? {
          fieldId: match.fieldId ?? "",
          fieldName: match.fieldName,
          date: match.date,
          startTime: match.startTime.slice(0, 5),
          endTime: match.endTime?.slice(0, 5) ?? "",
          expectedPlayers: match.expectedPlayers,
          organizerId: match.organizerId,
          organizerPlays: match.organizerPlays,
          outsideSlots: match.outsideSlots,
          playingForCoca: match.playingForCoca,
          basePricePerPlayer: match.basePricePerPlayer,
          cocaAmountPerPlayer: match.cocaAmountPerPlayer || "",
        }
      : EMPTY_MATCH,
  });
  const playingForCoca = useWatch({ control, name: "playingForCoca" });

  const submit = async (data) => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-5 grid gap-4">
      <h3 className="font-bold">
        {match ? `Editar partido #${match.id}` : "Crear partido"}
      </h3>
      {referenceError && <p role="alert" className="text-sm text-danger">{referenceError}</p>}
      <AdminMatchScheduleFields
        register={register}
        setValue={setValue}
        errors={errors}
        fields={fields}
        players={players}
        match={match}
      />
      <AdminMatchPriceFields
        register={register}
        errors={errors}
        playingForCoca={playingForCoca}
      />
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={saving} className={`${adminButtonClass} border-primary bg-primary text-primary-foreground`}>
          {saving ? "Guardando..." : match ? "Guardar cambios" : "Crear partido"}
        </button>
        {match && (
          <button type="button" onClick={onCancel} className={`${adminButtonClass} border-border text-text-primary`}>
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}

export default AdminMatchForm;
