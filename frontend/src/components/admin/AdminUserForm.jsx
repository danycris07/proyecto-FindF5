import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import AdminFormField, { adminInputClass } from "./AdminFormField.jsx";
import { adminButtonClass } from "./AdminResourceList.jsx";

const EMPTY_USER = {
  name: "",
  email: "",
  phone: "",
  role: "PLAYER",
  position: "",
  dominantFoot: "",
  password: "",
};

function AdminUserForm({ user, onSave, onCancel }) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          role: user.role,
          position: user.position ?? "",
          dominantFoot: user.dominantFoot ?? "",
          password: "",
        }
      : EMPTY_USER,
  });
  const role = useWatch({ control, name: "role" });

  const submit = async (data) => {
    setSaving(true);
    await onSave({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.role,
      position: data.role === "PLAYER" ? data.position || null : null,
      dominantFoot: data.role === "PLAYER" ? data.dominantFoot || null : null,
      ...(data.password ? { password: data.password } : {}),
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-5 grid gap-4">
      <h3 className="font-bold">
        {user ? `Editar ${user.name}` : "Crear usuario"}
      </h3>
      <AdminFormField
        id="admin-user-name"
        label="Nombre"
        registration={register("name", {
          required: "Ingresá un nombre.",
          minLength: { value: 2, message: "Escribí al menos 2 caracteres." },
        })}
      />
      {errors.name && <p role="alert" className="text-sm text-danger">{errors.name.message}</p>}
      <AdminFormField
        id="admin-user-email"
        label="Email"
        type="email"
        registration={register("email", {
          required: "Ingresá un correo.",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Revisá el correo." },
        })}
      />
      {errors.email && <p role="alert" className="text-sm text-danger">{errors.email.message}</p>}
      <AdminFormField
        id="admin-user-phone"
        label="Teléfono"
        registration={register("phone")}
      />
      <AdminFormField id="admin-user-role" label="Rol">
        <select id="admin-user-role" className={adminInputClass} {...register("role")}>
          <option value="PLAYER">Jugador</option>
          <option value="FIELD_OWNER">Dueño de cancha</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </AdminFormField>
      {role === "PLAYER" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminFormField id="admin-user-position" label="Posición">
            <select id="admin-user-position" className={adminInputClass} {...register("position")}>
              <option value="">Sin definir</option>
              <option value="FIELD_PLAYER">Jugador de campo</option>
              <option value="GOALKEEPER">Arquero</option>
            </select>
          </AdminFormField>
          <AdminFormField id="admin-user-foot" label="Pierna hábil">
            <select id="admin-user-foot" className={adminInputClass} {...register("dominantFoot")}>
              <option value="">Sin definir</option>
              <option value="LEFT">Izquierda</option>
              <option value="RIGHT">Derecha</option>
            </select>
          </AdminFormField>
        </div>
      )}
      <AdminFormField
        id="admin-user-password"
        label={user ? "Nueva contraseña (opcional)" : "Contraseña"}
        type="password"
        registration={register("password", {
          required: !user && "Ingresá una contraseña.",
          validate: (value) =>
            !value ||
            value.length >= 6 ||
            "La contraseña debe tener al menos 6 caracteres.",
        })}
      />
      {errors.password && <p role="alert" className="text-sm text-danger">{errors.password.message}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={saving} className={`${adminButtonClass} border-primary bg-primary text-primary-foreground`}>
          {saving ? "Guardando..." : user ? "Guardar cambios" : "Crear usuario"}
        </button>
        {user && (
          <button type="button" onClick={onCancel} className={`${adminButtonClass} border-border text-text-primary`}>
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}

export default AdminUserForm;
