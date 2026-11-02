import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MatchCard from "../components/partidos/MatchCard.jsx";
import { getMatches } from "../services/matchService.js";
import { useParticipacion } from "../hooks/useParticipacion.js";
import MatchConfirmationCard from "../components/partidos/MatchDetailCard.jsx";
import MatchModal from "../components/partidos/MatchModal.jsx";
import { getSessionUser } from "../services/sessionService.js";
import { waitForInitialLoading } from "../hooks/useInitialLoading.js";
import DeleteMatchDialog from "../components/partidos/DeleteMatchDialog.jsx";
import MatchFilters from "../components/partidos/MatchFilters.jsx";
import { useMatchFilters } from "../hooks/useMatchFilters.js";
import ImpactButton from "../components/ui/ImpactButton.jsx";
import { waitForMinimumSkeleton } from "../hooks/useInitialLoading.js";
import {
  AnimatePresence,
  m as motion,
  useReducedMotion,
} from "framer-motion";
import { GoSearch } from "react-icons/go";

function PartidosPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [openingForm, setOpeningForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
  const partidosVisibles = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase("es-AR");
    return filtrosPartidos.visibles.filter((partido) =>
      !query || [partido.fieldName, partido.fieldAddress, partido.organizerName]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase("es-AR").includes(query)),
    );
  }, [filtrosPartidos.visibles, searchTerm]);

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
    <div className="relative isolate min-h-screen overflow-hidden bg-[#090d16] font-sans text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.06),transparent_60%)]" />
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-20 sm:px-6 md:px-8 md:pt-28 md:pb-12">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-8 sm:gap-5">
            <div>
              <h1 className="font-display text-2xl font-black uppercase tracking-wide text-white sm:text-4xl">Encontrá tu próximo partido</h1>
              <p className="mt-1.5 max-w-xl text-sm leading-5 text-slate-400 sm:mt-2 sm:leading-6">
                Canchas abiertas, jugadores listos. Elegí tu horario y sumate al partido.
              </p>
            </div>
            <ImpactButton
              type="button"
              onClick={handleOpenForm}
              disabled={openingForm}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#CCFF00] bg-[#CCFF00] px-5 py-2.5 text-sm font-black uppercase tracking-wide text-[#0B0F19] transition-colors hover:bg-[#E2FF66] disabled:cursor-wait disabled:opacity-60"
            >
              {openingForm ? "Abriendo…" : "Armar partido"}
            </ImpactButton>
          </header>
          {aviso && (
            <p
              role="status"
              className="mb-6 rounded border border-[#00E5FF]/40 bg-[#161F30] px-4 py-3 text-sm text-[#7BE8F4]"
            >
              {aviso}
            </p>
          )}
          <section aria-label="Buscar partido" className="mb-4 rounded-lg border border-[#24324A] bg-[#161F30] p-3.5 sm:mb-7 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex min-h-12 min-w-[min(100%,22rem)] flex-1 items-center gap-3 rounded border border-[#24324A] bg-[#0B0F19] px-4 focus-within:border-[#CCFF00]">
                <GoSearch aria-hidden="true" className="shrink-0 text-lg text-[#CBD5E1]" />
                <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar cancha o jugador…" aria-label="Buscar por cancha o jugador" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-300" />
                <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500 sm:inline">⌕</kbd>
              </label>
              <button type="button" onClick={() => filtrosPartidos.setFiltro("dia", filtrosPartidos.filtros.dia === "hoy" ? "" : "hoy")} aria-pressed={filtrosPartidos.filtros.dia === "hoy"} className={`min-h-11 rounded border px-3.5 text-xs font-bold transition-colors ${filtrosPartidos.filtros.dia === "hoy" ? "border-[#CCFF00] bg-[#CCFF00] text-[#0B0F19]" : "border-[#24324A] bg-[#0B0F19] text-slate-100 hover:border-[#94A3B8]"}`}>HOY</button>
              <span className="inline-flex min-h-11 items-center gap-2 rounded border border-[#24324A] bg-[#0B0F19] px-3.5 text-xs font-bold text-slate-100">FÚTBOL 5</span>
              {estado.status === "cargado" && (
                <MatchFilters
                  filtros={filtrosPartidos.filtros}
                  onChange={filtrosPartidos.setFiltro}
                  onClear={filtrosPartidos.limpiarFiltros}
                  activos={filtrosPartidos.activos}
                  canchas={canchas}
                  precioInvalido={filtrosPartidos.precioInvalido}
                  compact
                />
              )}
            </div>
          </section>

          {estado.status === "cargando" && (
            <motion.div
              role="status"
              aria-label="Cargando convocatorias"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} aria-hidden="true" className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-4 border-b border-border/70 py-4 sm:grid-cols-[4rem_8.5rem_minmax(0,1fr)_10rem]">
                  <div className="h-12 w-10 animate-pulse rounded-sm bg-border/70 motion-reduce:animate-none" />
                  <div className="col-start-2 h-[4.5rem] animate-pulse rounded-sm bg-border/70 sm:col-start-2" />
                  <div className="col-start-2 space-y-2 sm:col-start-3"><div className="h-5 w-3/4 animate-pulse rounded-sm bg-border/70 motion-reduce:animate-none" /><div className="h-4 w-1/3 animate-pulse rounded-sm bg-border/70 motion-reduce:animate-none" /></div>
                  <div className="col-span-2 h-5 w-1/2 animate-pulse rounded-sm bg-border/70 sm:col-span-1 sm:col-start-4" />
                </div>
              ))}
            </motion.div>
          )}

          {estado.status === "error" && (
            <p role="alert" className="text-danger">
              {estado.error}
            </p>
          )}

          {estado.status === "cargado" && estado.partidos.length > 0 && (
            <p className="mb-3 mt-4 flex items-center gap-2 text-sm text-slate-400 sm:mb-4 sm:mt-6" aria-live="polite">
              <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]" />
              {partidosVisibles.length} {partidosVisibles.length === 1 ? "partido disponible" : "partidos disponibles"}
            </p>
          )}

          {estado.status === "cargado" && estado.partidos.length === 0 && (
            <div className="rounded-lg border border-[#24324A] bg-[#161F30] px-5 py-8 sm:px-6">
              <h2 className="text-xl font-bold text-white">Todavía no hay partidos abiertos</h2>
              <p className="mt-2 text-sm text-slate-400">Publicá una convocatoria y encontrá jugadores para completar la cancha.</p>
            </div>
          )}

          {estado.status === "cargado" &&
            estado.partidos.length > 0 &&
            partidosVisibles.length === 0 && (
              <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#24324A] bg-[#161F30] px-5 py-6 text-sm text-slate-100">
                <span>No hay partidos que coincidan con la búsqueda y los filtros.</span>
                <button type="button" onClick={() => { setSearchTerm(""); filtrosPartidos.limpiarFiltros(); }} className="min-h-11 font-semibold text-[#CCFF00] underline-offset-4 hover:underline">Reiniciar búsqueda</button>
              </div>
            )}

          {estado.status === "cargado" &&
            partidosVisibles.length > 0 && (
              <motion.div
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: {} }}
              >
                <AnimatePresence mode="popLayout">
                  {partidosVisibles.map((partido) => (
                    <div key={partido.id}>
                      <MatchCard
                        match={partido}
                        onSelect={setPartidoSeleccionado}
                        featured={Number(partido.missingPlayers ?? 0) === 1}
                      />
                    </div>
                  ))}
                </AnimatePresence>
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
  );
}

export default PartidosPage;
