import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell.jsx";
import { AuthField, AuthSubmitButton } from "../components/auth/AuthField.jsx";
import { useInitialLoading } from "../hooks/useInitialLoading.js";
import { registerUser } from "../services/sessionService.js";

export function Registro({ isLoading: loadingProp }) {
  const initialLoading = useInitialLoading();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: "PLAYER" } });
  const isLoading = loadingProp ?? initialLoading;

  const onSubmit = async (data) => {
    setRegisterError("");
    try {
      await registerUser({
        ...data,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
      });
      reset();
      navigate("/partidos", { replace: true });
    } catch (error) {
      setRegisterError(
        error instanceof Error ? error.message : "No se pudo crear la cuenta.",
      );
    }
  };

  return (
    <AuthShell
      eyebrow="Nuevo jugador"
      title="Armá tu ficha"
      subtitle="Creá tu cuenta en FindF5 y empezá a sumarte a partidos de fútbol 5."
      loading={isLoading}
      loadingLabel="Cargando formulario de registro"
      skeletonFields={6}
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
        {registerError && (
          <div
            role="alert"
            className="rounded-sm border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {registerError}
          </div>
        )}
        <AuthField
          id="firstName"
          label="Nombre"
          type="text"
          autoComplete="given-name"
          placeholder="Juan"
          maxLength={120}
          registration={register("firstName", {
            required: "Ingresá tu nombre.",
            setValueAs: (value) => value.trim(),
            minLength: { value: 2, message: "Escribí al menos 2 caracteres." },
            maxLength: { value: 120, message: "El nombre no puede superar los 120 caracteres." },
          })}
          error={errors.firstName?.message}
        />

        <AuthField
          id="lastName"
          label="Apellido"
          type="text"
          autoComplete="family-name"
          placeholder="Pérez"
          maxLength={120}
          registration={register("lastName", {
            required: "Ingresá tu apellido.",
            setValueAs: (value) => value.trim(),
            minLength: { value: 2, message: "Escribí al menos 2 caracteres." },
            maxLength: { value: 120, message: "El apellido no puede superar los 120 caracteres." },
          })}
          error={errors.lastName?.message}
        />

        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="juan@email.com"
          maxLength={254}
          registration={register("email", {
            required: "Ingresá tu email.",
            setValueAs: (value) => value.trim(),
            maxLength: {
              value: 254,
              message: "El email no puede superar los 254 caracteres.",
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
          maxLength={30}
          registration={register("phone", {
            setValueAs: (value) => value.trim(),
            validate: (value) => {
              if (!value) return true;
              if (!/^[+\d][\d\s()-]*$/.test(value)) {
                return "Ingresá un teléfono válido.";
              }
              const digitCount = value.replace(/\D/g, "").length;
              return (
                (digitCount >= 7 && digitCount <= 15) ||
                "El teléfono debe tener entre 7 y 15 dígitos."
              );
            },
          })}
          error={errors.phone?.message}
        />

        <AuthField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          maxLength={128}
          registration={register("password", {
            required: "Elegí una contraseña.",
            minLength: { value: 6, message: "Mínimo 6 caracteres." },
            maxLength: {
              value: 128,
              message: "La contraseña no puede superar los 128 caracteres.",
            },
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
