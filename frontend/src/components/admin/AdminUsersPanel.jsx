import { useState } from "react";
import AdminResourceList, { adminButtonClass } from "./AdminResourceList.jsx";
import AdminUserForm from "./AdminUserForm.jsx";
import { useAdminCollection } from "../../hooks/useAdminCollection.js";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from "../../services/adminService.js";

function AdminUsersPanel() {
  const { items, loading, error, refresh, runMutation } = useAdminCollection(
    getAdminUsers,
    "usuarios",
  );
  const [editingUser, setEditingUser] = useState(null);

  const saveUser = (values) =>
    runMutation(
      () =>
        editingUser
          ? updateAdminUser(editingUser.id, values)
          : createAdminUser(values),
      () => setEditingUser(null),
    );

  const removeUser = async (user) => {
    if (!window.confirm(`¿Eliminar la cuenta de ${user.name}?`)) return;
    await runMutation(() => deleteAdminUser(user.id));
  };

  return (
    <AdminResourceList
      title="Usuarios"
      description="Creá cuentas, actualizá perfiles y administrá roles."
      items={items}
      loading={loading}
      error={error}
      onRefresh={refresh}
      emptyMessage="Todavía no hay usuarios para mostrar."
      onCreate={
        <AdminUserForm
          key={editingUser?.id ?? "new-user"}
          user={editingUser}
          onSave={saveUser}
          onCancel={() => setEditingUser(null)}
        />
      }
      renderItem={(user) => (
        <article key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border p-4">
          <div className="min-w-0">
            <h3 className="font-bold">{user.name}</h3>
            <p className="break-all text-sm text-text-secondary">{user.email}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-status">
              {user.role} {user.position ? `· ${user.position}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditingUser(user)} className={`${adminButtonClass} border-border text-text-primary hover:border-status`}>
              Editar
            </button>
            <button type="button" onClick={() => removeUser(user)} className={`${adminButtonClass} border-danger/50 text-danger hover:bg-danger/10`}>
              Eliminar
            </button>
          </div>
        </article>
      )}
    />
  );
}

export default AdminUsersPanel;
