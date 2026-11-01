import { useEffect, useState } from "react";
import AdminMatchForm from "./AdminMatchForm.jsx";
import AdminResourceList, { adminButtonClass } from "./AdminResourceList.jsx";
import { useAdminCollection } from "../../hooks/useAdminCollection.js";
import {
  createAdminMatch,
  deleteAdminMatch,
  getAdminFields,
  getAdminMatches,
  getAdminUsers,
  updateAdminMatch,
} from "../../services/adminService.js";

function AdminMatchesPanel() {
  const { items, loading, error, refresh, runMutation } = useAdminCollection(
    getAdminMatches,
    "partidos",
  );
  const [players, setPlayers] = useState([]);
  const [fields, setFields] = useState([]);
  const [referenceError, setReferenceError] = useState("");
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([getAdminUsers(), getAdminFields()])
      .then(([users, availableFields]) => {
        if (active) {
          setPlayers(users.filter((user) => user.role === "PLAYER"));
          setFields(availableFields);
        }
      })
      .catch((loadError) => {
        if (active) {
          setReferenceError(
            loadError instanceof Error
              ? `No se pudieron cargar organizadores y canchas: ${loadError.message}`
              : "No se pudieron cargar organizadores y canchas.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const saveMatch = (data) => {
    const selectedField = fields.find(
      (field) => String(field.id) === String(data.fieldId),
    );
    const values = {
      fieldName: selectedField?.name ?? data.fieldName.trim(),
      ...(selectedField ? { fieldId: selectedField.id } : {}),
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime || null,
      expectedPlayers: Number(data.expectedPlayers),
      organizerPlays: Boolean(data.organizerPlays),
      outsideSlots: Number(data.outsideSlots),
      playingForCoca: Boolean(data.playingForCoca),
      basePricePerPlayer: Number(data.basePricePerPlayer),
      cocaAmountPerPlayer: data.playingForCoca
        ? Number(data.cocaAmountPerPlayer)
        : 0,
      ...(!editingMatch ? { organizerId: Number(data.organizerId) } : {}),
    };
    return runMutation(
      () =>
        editingMatch
          ? updateAdminMatch(editingMatch.id, values)
          : createAdminMatch(values),
      () => setEditingMatch(null),
    );
  };

  const removeMatch = async (match) => {
    if (!window.confirm(`¿Eliminar el partido de ${match.fieldName}?`)) return;
    await runMutation(() => deleteAdminMatch(match.id));
  };

  return (
    <AdminResourceList
      title="Partidos"
      description="Revisá convocatorias, corregí sus datos y administrá su publicación."
      items={items}
      loading={loading}
      error={error}
      onRefresh={refresh}
      emptyMessage="Todavía no hay partidos para mostrar."
      onCreate={
        <AdminMatchForm
          key={editingMatch?.id ?? "new-match"}
          match={editingMatch}
          fields={fields}
          players={players}
          referenceError={referenceError}
          onSave={saveMatch}
          onCancel={() => setEditingMatch(null)}
        />
      }
      renderItem={(match) => (
        <article key={match.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border p-4">
          <div className="min-w-0">
            <h3 className="font-bold">{match.fieldName}</h3>
            <p className="text-sm text-text-secondary">
              {match.date} · {match.startTime.slice(0, 5)} · {match.organizerName}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-status">
              {match.status} · {match.missingPlayers} cupos disponibles
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditingMatch(match)} className={`${adminButtonClass} border-border text-text-primary hover:border-status`}>
              Editar
            </button>
            <button type="button" onClick={() => removeMatch(match)} className={`${adminButtonClass} border-danger/50 text-danger hover:bg-danger/10`}>
              Eliminar
            </button>
          </div>
        </article>
      )}
    />
  );
}

export default AdminMatchesPanel;
