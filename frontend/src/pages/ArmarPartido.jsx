import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import MatchFormCard from "../components/partidos/MatchFormCard.jsx";
import PartidoFormFields from "../components/partidos/PartidoFormFields.jsx";
import {
  createMatch,
  getMatchById,
  updateMatch,
} from "../services/matchService.js";
import { getMockSession } from "../services/sessionService.js";
import { useAvailableFields } from "../hooks/useAvailableFields.js";
import { useInitialLoading } from "../hooks/useInitialLoading.js";
import Skeleton from "../components/ui/Skeleton.jsx";

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
  const { partidoId } = useParams();
  const isEditMode = Boolean(partidoId);
  const initialLoading = useInitialLoading();
  const navigate = useNavigate();

  const [hasEntered, setHasEntered] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const [originalMatch, setOriginalMatch] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState(null);

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
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    shouldUnregister: true,
    defaultValues: { jugarPorLaCoca: false, montoExtraCoca: "" },
  });

  const now = new Date();
  const today = fechaLocal(now);
  const selectedDate = useWatch({ control, name: "fecha" });
  const jugarPorLaCoca = useWatch({
    control,
    name: "jugarPorLaCoca",
    defaultValue: false,
  });
  const cuotaBaseValue = useWatch({ control, name: "cuota", defaultValue: "" });
  const montoExtraValue = useWatch({
    control,
    name: "montoExtraCoca",
    defaultValue: "",
  });
  const jugadoresEsperadosValue = useWatch({
    control,
    name: "jugadoresEsperados",
  });

  const cuotaBase = cuotaBaseValue === "" ? 0 : Number(cuotaBaseValue);
  const montoExtraCoca =
    jugarPorLaCoca && montoExtraValue !== "" ? Number(montoExtraValue) : 0;
  const totalPorJugador = cuotaBase + montoExtraCoca;

  const isLoading =
    initialLoading || isSubmitting || (isEditMode && !originalMatch);

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

  useEffect(() => {
    if (isEditMode && !originalMatch) {
      getMatchById(partidoId).then((match) => {
        if (match) {
          setOriginalMatch(match);
          reset({
            cancha: match.fieldName,
            fecha: match.date,
            hora: match.startTime.slice(0, 5),
            jugadoresEsperados: match.expectedPlayers,
            cuposFaltantes: match.missingPlayers,
            cuota: match.basePricePerPlayer,
            jugarPorLaCoca: match.playingForCoca,
            montoExtraCoca: match.cocaAmountPerPlayer || "",
          });
        } else {
          navigate("/partidos", {
            replace: true,
            state: { aviso: "El partido no existe." },
          });
        }
      });
    }
  }, [isEditMode, partidoId, originalMatch, reset, navigate]);

  const onSubmit = async (data) => {
    setErrorEnvio("");
    const fechaHora = new Date(`${data.fecha}T${data.hora}`);
    if (Number.isNaN(fechaHora.getTime()) || fechaHora <= new Date()) {
      const message = "Elegí una fecha y hora futuras.";
      setError("fecha", { type: "validate", message });
      setError("hora", { type: "validate", message });
      return;
    }

    if (isEditMode && originalMatch) {
      const hasPlayers =
        originalMatch.missingPlayers < originalMatch.expectedPlayers;
      const hasCriticalChanges =
        data.cancha !== originalMatch.fieldName ||
        data.fecha !== originalMatch.date ||
        data.hora !== originalMatch.startTime.slice(0, 5) ||
        Number(data.cuota) !== originalMatch.basePricePerPlayer ||
        data.jugarPorLaCoca !== originalMatch.playingForCoca ||
        (data.jugarPorLaCoca &&
          Number(data.montoExtraCoca) !== originalMatch.cocaAmountPerPlayer);

      if (hasPlayers && hasCriticalChanges) {
        setPendingData(data);
        setConfirmDialog(true);
        return;
      }
    }
    await executeSave(data);
  };

  const executeSave = async (data) => {
    setConfirmDialog(false);
    const session = getMockSession();
    if (!session) return setErrorEnvio("Tu sesión de prueba venció.");

    try {
      if (isEditMode) {
        const updated = await updateMatch(partidoId, session.id, data);
        navigate(`/partidos/${updated.id}`, {
          replace: true,
          state: { aviso: "Partido actualizado con éxito." },
        });
      } else {
        const match = await createMatch(data, session.id);
        navigate(`/partidos/${match.id}`, {
          replace: true,
          state: { justCreated: true },
        });
      }
    } catch (error) {
      setErrorEnvio(error.message || "No se pudo procesar tu solicitud.");
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
      jugarPorLaCoca={jugarPorLaCoca}
      cuotaBase={cuotaBase}
      montoExtraCoca={montoExtraCoca}
      totalPorJugador={totalPorJugador}
      isEditMode={isEditMode}
      jugadoresEsperadosValue={jugadoresEsperadosValue}
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
      isEditMode={isEditMode}
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
          to="/partidos"
          className="text-sm font-semibold text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
        >
          Volver al inicio de convocatorias
        </Link>
        <div className="mt-6">
          {isLoading ? (
            <div
              role="status"
              aria-label="Cargando formulario"
              className="w-full max-w-3xl space-y-8 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-5 shadow-2xl shadow-black/40 sm:p-8"
            >
              <div className="space-y-2">
                <Skeleton className="mt-4 h-10 w-3/4 rounded-sm bg-slate-700 sm:h-12" />
                <Skeleton className="h-4 w-full max-w-xl rounded-sm bg-slate-800" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-32 rounded-sm bg-slate-700" />
                    <Skeleton className="h-12 w-full rounded-xl bg-slate-800" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            panel
          )}
        </div>
      </div>

      {/* Modal flotante de aviso al cambiar condiciones clave */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
            <h3 className="font-display text-2xl font-extrabold uppercase tracking-wider text-white">
              Aviso importante
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Estás por modificar datos clave (cancha, fecha, hora o cuota) en
              un partido que ya tiene jugadores anotados. Se les notificará el
              cambio de condiciones.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDialog(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => executeSave(pendingData)}
                className="rounded-sm bg-primary px-4 py-2 text-sm font-extrabold uppercase tracking-wider text-black transition-transform hover:-translate-y-0.5"
              >
                Confirmar y guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ArmarPartido;
