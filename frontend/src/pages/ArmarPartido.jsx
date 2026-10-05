import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import MatchFormCard from "../components/partidos/MatchFormCard.jsx";
import PartidoFormFields from "../components/partidos/PartidoFormFields.jsx";
import { createMatch } from "../services/matchService.js";
import { getMockSession } from "../services/sessionService.js";
import { useAvailableFields } from "../hooks/useAvailableFields.js";

function fechaLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function horaLocal(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function ArmarPartido({ embedded = false }) {
  const navigate = useNavigate();
  const [hasEntered, setHasEntered] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const {
    fields: canchas,
    loading: canchasLoading,
    error: canchasError,
    retry: cargarCanchas,
  } = useAvailableFields();
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const now = new Date();
  const today = fechaLocal(now);
  const selectedDate = useWatch({ control, name: "fecha" });

  useEffect(() => {
    let enterFrameId;
    const initialFrameId = window.requestAnimationFrame(() => {
      enterFrameId = window.requestAnimationFrame(() => setHasEntered(true));
    });

    return () => {
      window.cancelAnimationFrame(initialFrameId);
      if (enterFrameId) {
        window.cancelAnimationFrame(enterFrameId);
      }
    };
  }, []);

  const onSubmit = async (data) => {
    setErrorEnvio("");
    const fechaHora = new Date(`${data.fecha}T${data.hora}`);

    if (Number.isNaN(fechaHora.getTime()) || fechaHora <= new Date()) {
      const message = "Elegí una fecha y hora futuras.";
      setError("fecha", { type: "validate", message });
      setError("hora", { type: "validate", message });
      return;
    }

    const session = getMockSession();
    if (!session) {
      setErrorEnvio("Tu sesión de prueba venció. Iniciá sesión para continuar.");
      return;
    }

    try {
      const match = await createMatch(data, session.id);
      navigate(`/partidos/${match.id}`, { replace: true });
    } catch (error) {
      setErrorEnvio(
        error instanceof Error
          ? `No se pudo publicar el partido: ${error.message}`
          : "No se pudo publicar el partido. Revisá tus datos e intentá de nuevo.",
      );
    }
  };

  const fields = (
    <PartidoFormFields
      register={register}
      errors={errors}
      canchas={canchas}
      canchasLoading={canchasLoading}
      canchasError={canchasError}
      onRetryCanchas={cargarCanchas}
      today={today}
      currentTime={horaLocal(now)}
      selectedDate={selectedDate}
      clearDateTimeErrors={() => clearErrors(["fecha", "hora"])}
    />
  );

  const panel = (
    <MatchFormCard
      embedded={embedded}
      animated={hasEntered}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      fields={fields}
      error={errorEnvio}
    />
  );

  if (embedded) {
    return (
      <section
        id="armar-partido"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-12 sm:py-16 lg:px-8"
      >
        {panel}
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 font-sans text-text-primary sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/"
          className="text-sm font-semibold text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
        >
          Volver al inicio
        </Link>
        <div className="mt-6">{panel}</div>
      </div>
    </main>
  );
}

export default ArmarPartido;
