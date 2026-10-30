import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell.jsx";
import { AuthField, AuthSubmitButton } from "../components/auth/AuthField.jsx";
import { mockUsers } from "../mocks/MockData";
import {
  useInitialLoading,
  waitForInitialLoading,
} from "../hooks/useInitialLoading.js";

export function Registro({ isLoading: loadingProp }) {
  const initialLoading = useInitialLoading();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: "PLAYER" } });
  const isLoading = loadingProp ?? initialLoading;

  const onSubmit = async (data) => {
    await waitForInitialLoading();
    const nextId =
      mockUsers.reduce(
        (highestId, user) => Math.max(highestId, Number(user.id) || 0),
        0,
      ) + 1;
    mockUsers.push({ ...data, id: nextId });
    reset();

    navigate("/login");
  };

  return (
    <AuthShell
      eyebrow="Nuevo jugador"
      title="Armá tu ficha"
      subtitle="Creá tu cuenta en FindF5 y empezá a sumarte a partidos de fútbol 5."
      loading={isLoading}
      loadingLabel="Cargando formulario de registro"
      skeletonFields={5}
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-text-primary underline underline-offset-4 hover:text-status"
          >
            Iniciá sesión
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={isSubmitting}
        className="space-y-5"
      >
        <AuthField
          id="name"
          label="Nombre"
          type="text"
          autoComplete="name"
          placeholder="Juan Pérez"
          registration={register("name", {
            required: "Ingresá tu nombre.",
            minLength: { value: 2, message: "Escribí al menos 2 letras." },
          })}
          error={errors.name?.message}
        />

        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="juan@email.com"
          registration={register("email", {
            required: "Ingresá tu email.",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Revisá el formato del email.",
            },
          })}
          error={errors.email?.message}
        />

        <AuthField
          id="phone"
          label="Teléfono (opcional)"
          type="tel"
          autoComplete="tel"
          placeholder="+54 9 3704..."
          registration={register("phone", {
            pattern: {
              value: /^[+\d][\d\s()-]{6,}$/,
              message: "Ingresá un teléfono válido.",
            },
          })}
          error={errors.phone?.message}
        />

        <AuthField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          registration={register("password", {
            required: "Elegí una contraseña.",
            minLength: { value: 6, message: "Mínimo 6 caracteres." },
          })}
          error={errors.password?.message}
        />

        <AuthField
          id="role"
          as="select"
          label="Tipo de cuenta"
          registration={register("role")}
        >
          <option value="PLAYER">Jugador</option>
          <option value="FIELD_OWNER">Dueño de cancha</option>
        </AuthField>

        <AuthSubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </AuthSubmitButton>
      </form>
    </AuthShell>
  );
}
