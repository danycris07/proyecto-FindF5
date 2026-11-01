import { useEffect, useState } from "react";
import AdminFieldForm from "./AdminFieldForm.jsx";
import AdminResourceList, { adminButtonClass } from "./AdminResourceList.jsx";
import { useAdminCollection } from "../../hooks/useAdminCollection.js";
import {
  createAdminField,
  deleteAdminField,
  getAdminFields,
  getAdminUsers,
  updateAdminField,
} from "../../services/adminService.js";

function AdminFieldsPanel() {
  const { items, loading, error, refresh, runMutation } = useAdminCollection(
    getAdminFields,
    "canchas",
  );
  const [owners, setOwners] = useState([]);
  const [ownersError, setOwnersError] = useState("");
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    let active = true;
    getAdminUsers()
      .then((users) => {
        if (active) setOwners(users.filter((user) => user.role === "FIELD_OWNER"));
      })
      .catch((loadError) => {
        if (active) {
          setOwnersError(
            loadError instanceof Error
              ? `No se pudieron cargar los dueños: ${loadError.message}`
              : "No se pudieron cargar los dueños de cancha.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const saveField = (values) =>
    runMutation(
      () =>
        editingField
          ? updateAdminField(editingField.id, values)
          : createAdminField(values),
      () => setEditingField(null),
    );

  const removeField = async (field) => {
    if (!window.confirm(`¿Eliminar la cancha ${field.name}?`)) return;
    await runMutation(() => deleteAdminField(field.id));
  };

  return (
    <AdminResourceList
      title="Canchas"
      description="Administrá los datos y la asignación del dueño de cada cancha."
      items={items}
      loading={loading}
      error={error}
      onRefresh={refresh}
      emptyMessage="Todavía no hay canchas para mostrar."
      onCreate={
        <AdminFieldForm
          key={editingField?.id ?? "new-field"}
          field={editingField}
          owners={owners}
          ownersError={ownersError}
          onSave={saveField}
          onCancel={() => setEditingField(null)}
        />
      }
      renderItem={(field) => (
        <article key={field.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border p-4">
          <div className="min-w-0">
            <h3 className="font-bold">{field.name}</h3>
            <p className="text-sm text-text-secondary">{field.address}</p>
            <p className="mt-1 text-xs text-status">
              {owners.find((owner) => String(owner.id) === String(field.ownerId))?.name ?? "Sin dueño asignado"}
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditingField(field)} className={`${adminButtonClass} border-border text-text-primary hover:border-status`}>
              Editar
            </button>
            <button type="button" onClick={() => removeField(field)} className={`${adminButtonClass} border-danger/50 text-danger hover:bg-danger/10`}>
              Eliminar
            </button>
          </div>
        </article>
      )}
    />
  );
}

export default AdminFieldsPanel;
