import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell.jsx";
import { AuthField, AuthSubmitButton } from "../components/auth/AuthField.jsx";
import { mockUsers } from "../mocks/MockData";
import {
  useInitialLoading,
  waitForInitialLoading,
} from "../hooks/useInitialLoading.js";
import { setMockSession } from "../services/sessionService.js";

export function Login({ isLoading: loadingProp }) {
  const initialLoading = useInitialLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const isLoading = loadingProp ?? initialLoading;

  const onSubmit = async (data) => {
    setLoginError("");
    await waitForInitialLoading();
    const usuario = mockUsers.find(
      (user) => user.email === data.email && user.password === data.password,
    );
    if (!usuario) {
      setLoginError("Correo o contraseña incorrectos.");
      return;
    }

    try {
      setMockSession(usuario);
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? `No se pudo guardar la sesión en este navegador: ${error.message}`
          : "No se pudo guardar la sesión en este navegador.",
      );
      return;
    }
    reset();

    navigate(location.state?.from?.pathname || "/partidos", { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Ingreso"
      title="Volvé a la cancha"
      subtitle="Iniciá sesión para ver las convocatorias y sumarte a un partido."
      loading={isLoading}
      loadingLabel="Cargando formulario de inicio de sesión"
      skeletonFields={2}
      footer={
        <>
          ¿Todavía no tenés cuenta?{" "}
          <Link
            to="/registro"
            className="font-semibold text-text-primary underline underline-offset-4 hover:text-status"
          >
            Registrate
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
        {loginError && (
          <div
            role="alert"
            className="rounded-sm border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {loginError}
          </div>
        )}

        <AuthField
          id="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="correo@ejemplo.com"
          registration={register("email", {
            required: "Ingresá tu correo.",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Revisá el formato del correo.",
            },
          })}
          error={errors.email?.message}
        />

        <AuthField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          registration={register("password", {
            required: "Ingresá tu contraseña.",
          })}
          error={errors.password?.message}
        />

        <AuthSubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
        </AuthSubmitButton>
      </form>
    </AuthShell>
  );
}
