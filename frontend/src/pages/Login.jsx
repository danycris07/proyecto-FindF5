import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell.jsx";
import { AuthField, AuthSubmitButton } from "../components/auth/AuthField.jsx";
import { useInitialLoading } from "../hooks/useInitialLoading.js";
import { loginUser } from "../services/sessionService.js";

export function Login({ isLoading: loadingProp }) {
  const initialLoading = useInitialLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const isLoading = loadingProp ?? initialLoading;

  const onSubmit = async (data) => {
    setLoginError("");
    try {
      await loginUser({
        ...data,
        email: data.email.trim().toLowerCase(),
      });
      reset();
      navigate(location.state?.from?.pathname || "/partidos", { replace: true });
    } catch (error) {
      if (error?.status === 401) {
        setError("email", {
          type: "server",
          message: "Verificá que este sea el correo con el que te registraste.",
        });
        setError("password", {
          type: "server",
          message: "Verificá que la contraseña corresponda a ese correo.",
        });
        return;
      }
      setLoginError(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión.",
      );
    }
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
          maxLength={254}
          registration={register("email", {
            required: "Ingresá tu correo.",
            setValueAs: (value) => value.trim(),
<<<<<<< HEAD
            onChange: () => {
              clearErrors(["email", "password"]);
              setLoginError("");
            },
=======
>>>>>>> a72e124b55b1b26738f8d898caced749c4a0052b
            maxLength: {
              value: 254,
              message: "El correo no puede superar los 254 caracteres.",
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
          maxLength={128}
          registration={register("password", {
            required: "Ingresá tu contraseña.",
<<<<<<< HEAD
            onChange: () => {
              clearErrors(["email", "password"]);
              setLoginError("");
            },
=======
>>>>>>> a72e124b55b1b26738f8d898caced749c4a0052b
            maxLength: {
              value: 128,
              message: "La contraseña no puede superar los 128 caracteres.",
            },
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
