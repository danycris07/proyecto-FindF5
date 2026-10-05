import { useState } from "react";
import { useForm } from "react-hook-form";
import { mockUsers } from "../mocks/MockData";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "../components/ui/Skeleton";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
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
    formState: { isSubmitting },
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const isLoading = (loadingProp ?? initialLoading) || isSubmitting;

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
    <div
      className="flex min-h-screen items-center justify-center bg-background px-4 py-10"
      aria-busy={isLoading}
    >
      <ThemeToggle />
      {isLoading ? (
        <div
          role="status"
          aria-label="Cargando formulario de inicio de sesión"
          className="w-full max-w-md space-y-7 rounded-2xl border border-border bg-surface p-7 shadow-2xl shadow-[var(--shadow-color)]"
        >
          <div className="space-y-3">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-5">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          aria-busy={isSubmitting}
          className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 shadow-2xl shadow-[var(--shadow-color)]"
        >
          {/* Encabezado */}
          <div className="mb-7">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              Iniciar Sesion
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Completá tus datos para ingresar
            </p>
          </div>

          {loginError && (
            <p role="alert" className="mb-5 text-sm text-red-400">
              {loginError}
            </p>
          )}

          <div className="space-y-5">
            {/* Correo */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                Correo electronico
              </label>

              <input
                id="email"
                type="text"
                placeholder="Correo@ejemplo.com"
                {...register("email")}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary placeholder:text-text-secondary outline-none transition focus:border-status focus:ring-2 focus:ring-status/20"
              />
            </div>

            {/* contraseña */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary placeholder:text-text-secondary outline-none transition focus:border-status focus:ring-2 focus:ring-status/20"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="mt-2 w-full rounded-lg border border-primary-foreground bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg shadow-[var(--primary-shadow)] transition hover:shadow-[var(--primary-shadow-strong)] active:scale-[0.98]"
            >
              Iniciar Sesion
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-text-secondary">
            Al registrarte podrás comenzar a buscar y reservar canchas.
          </p>
        </form>
      )}
    </div>
  );
}
