import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MatchCard from "../components/partidos/MatchCard.jsx";
import { getMatches } from "../services/matchService.js";
import { useParticipacion } from "../hooks/useParticipacion.js";
import MatchConfirmationCard from "../components/partidos/MatchDetailCard.jsx";
import MatchModal from "../components/partidos/MatchModal.jsx";
import { getSessionUser } from "../services/sessionService.js";
import { waitForInitialLoading } from "../hooks/useInitialLoading.js";
import DeleteMatchDialog from "../components/partidos/DeleteMatchDialog.jsx";
import { GoPlus } from "react-icons/go";
import MatchFilters from "../components/partidos/MatchFilters.jsx";
import { useMatchFilters } from "../hooks/useMatchFilters.js";
import ImpactButton from "../components/ui/ImpactButton.jsx";
import { waitForMinimumSkeleton } from "../hooks/useInitialLoading.js";
import {
  AnimatePresence,
  m as motion,
  useReducedMotion,
} from "framer-motion";

function PartidosPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [openingForm, setOpeningForm] = useState(false);
  const openingFormRef = useRef(false);
  const [estado, setEstado] = useState({
    status: "cargando",
    partidos: [],
    error: "",
  });
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const location = useLocation();
  const [aviso, setAviso] = useState(location.state?.aviso ?? "");
  const [partidoAEliminar, setPartidoAEliminar] = useState(null);
  const session = getSessionUser();
  const filtrosPartidos = useMatchFilters(estado.partidos);
  const canchas = [
    ...new Set(estado.partidos.map((partido) => partido.fieldName)),
  ].filter(Boolean);

  const handleMatchChange = (actualizado) => {
    setPartidoSeleccionado((actual) =>
      actual && String(actual.id) === String(actualizado.id)
        ? actualizado
        : actual,
    );
    setEstado((prev) => ({
      ...prev,
      partidos: prev.partidos.map((p) =>
        String(p.id) === String(actualizado.id) ? actualizado : p,
      ),
    }));
  };
  const participacion = useParticipacion(partidoSeleccionado, handleMatchChange);

  const handleOpenForm = async () => {
    if (openingFormRef.current) return;

    openingFormRef.current = true;
    setOpeningForm(true);
    await waitForInitialLoading();
    navigate("/partidos/nuevo");
  };

  const partidoEliminado = (partido) => {
    setEstado((actual) => ({
      ...actual,
      partidos: actual.partidos.filter((item) => item.id !== partido.id),
    }));
    setPartidoAEliminar(null);
    setPartidoSeleccionado(null);
    setAviso(`Partido eliminado: ${partido.fieldName}.`);
  };

  useEffect(() => {
    let activo = true;
    const cargarPartidos = async () => {
      const startedAt = Date.now();
      try {
        const partidos = await getMatches();
        await waitForMinimumSkeleton(startedAt);
        if (activo) setEstado({ status: "cargado", partidos, error: "" });
      } catch (error) {
        await waitForMinimumSkeleton(startedAt);
        if (activo) {
          setEstado({
            status: "error",
            partidos: [],
            error:
              error instanceof Error
                ? error.message
                : "No se pudieron cargar las convocatorias.",
          });
        }
      }
    };
    void cargarPartidos();

    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-text-primary relative isolate">
      <div className="relative isolate min-h-screen bg-background font-sans text-text-primary">
        <div
          aria-hidden="true"
          className="landing-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-152"
        />
        <main className="mx-auto w-full max-w-7xl px-5 pt-20 pb-24 md:pt-24 md:pb-12 lg:px-8">
          {aviso && (
            <p
              role="status"
              className="mb-6 rounded-sm border border-status/40 bg-status/10 px-4 py-3 text-sm text-status"
            >
              {aviso}
            </p>
          )}
          {estado.status === "cargando" && (
            <motion.div
              role="status"
              aria-label="Cargando convocatorias"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="overflow-hidden rounded-sm border border-border bg-surface"
                >
                  <div className="h-32 animate-pulse bg-border/70 sm:h-36 motion-reduce:animate-none" />
                  <div className="space-y-3 p-4">
                    <div className="h-5 w-3/4 animate-pulse rounded-sm bg-border/70 motion-reduce:animate-none" />
                    <div className="h-4 w-1/2 animate-pulse rounded-sm bg-border/70 motion-reduce:animate-none" />
                    <div className="h-7 w-1/3 animate-pulse rounded-sm bg-border/70 motion-reduce:animate-none" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {estado.status === "error" && (
            <p role="alert" className="text-danger">
              {estado.error}
            </p>
          )}

          {estado.status === "cargado" && (
            <MatchFilters
              filtros={filtrosPartidos.filtros}
              onChange={filtrosPartidos.setFiltro}
              onClear={filtrosPartidos.limpiarFiltros}
              activos={filtrosPartidos.activos}
              canchas={canchas}
              precioInvalido={filtrosPartidos.precioInvalido}
            />
          )}

          {estado.status === "cargado" && estado.partidos.length === 0 && (
            <div className="space-y-4">
              <ImpactButton
                type="button"
                onClick={handleOpenForm}
                disabled={openingForm}
                className="flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border text-text-secondary transition-colors hover:border-primary hover:text-primary-text disabled:cursor-wait disabled:opacity-60"
              >
                <GoPlus aria-hidden="true" className="text-2xl" />
                <span className="font-display text-lg font-bold uppercase tracking-wider">
                  ¿No hay fecha? Armá el tuyo
                </span>
              </ImpactButton>
            </div>
          )}

          {estado.status === "cargado" &&
            estado.partidos.length > 0 &&
            filtrosPartidos.visibles.length === 0 && (
              <p role="status" className="text-text-secondary">
                No hay partidos que coincidan con los filtros seleccionados.
              </p>
            )}

          {estado.status === "cargado" &&
            filtrosPartidos.visibles.length > 0 && (
              <motion.div
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: reduceMotion
                    ? {}
                    : {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.04,
                        },
                      },
                }}
              >
                <AnimatePresence mode="popLayout">
                  {filtrosPartidos.visibles.map((partido) => (
                    <motion.div
                    key={partido.id}
                      variants={
                        reduceMotion
                          ? {
                              hidden: { opacity: 1, y: 0 },
                              visible: { opacity: 1, y: 0 },
                            }
                          : {
                              hidden: { opacity: 0, y: 20 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                  type: "spring",
                                  stiffness: 320,
                                  damping: 28,
                                },
                              },
                            }
                      }
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    >
                      <MatchCard
                        match={partido}
                        onSelect={setPartidoSeleccionado}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                <ImpactButton
                  type="button"
                  onClick={handleOpenForm}
                  disabled={openingForm}
                  className="flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border text-text-secondary transition-colors hover:border-primary hover:text-primary-text disabled:cursor-wait disabled:opacity-60"
                >
                  <GoPlus aria-hidden="true" className="text-2xl" />
                  <span className="font-display text-lg font-bold uppercase tracking-wider">
                    ¿No hay fecha? Armá el tuyo
                  </span>
                </ImpactButton>
              </motion.div>
            )}

          <MatchModal
            open={partidoSeleccionado !== null}
            onClose={() => setPartidoSeleccionado(null)}
          >
            {partidoSeleccionado && (
              <MatchConfirmationCard
                match={partidoSeleccionado}
                animated
                isOrganizer={
                  String(partidoSeleccionado.organizerId) ===
                  String(session?.id)
                }
                onClose={() => setPartidoSeleccionado(null)}
                onDelete={() => setPartidoAEliminar(partidoSeleccionado)}
                onDecreaseSlot={participacion.restarCupo}
                decreaseError={participacion.errorCupo}
                currentUserId={session?.id}
                isJoined={participacion.estaAnotado}
                onJoin={participacion.sumarme}
                onLeave={participacion.bajarme}
                pendingAction={participacion.accionPendiente}
                participationError={participacion.errorParticipacion}
                canParticipate={participacion.puedeParticipar}
              />
            )}
          </MatchModal>
          <DeleteMatchDialog
            match={partidoAEliminar}
            userId={session?.id}
            onClose={() => setPartidoAEliminar(null)}
            onDeleted={partidoEliminado}
          />
        </main>
      </div>
    </div>
  );
}

export default PartidosPage;