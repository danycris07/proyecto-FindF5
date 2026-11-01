import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteMatchDialog from "../components/partidos/DeleteMatchDialog.jsx";
import MatchCard from "../components/partidos/MatchCard.jsx";
import MatchConfirmationCard from "../components/partidos/MatchDetailCard.jsx";
import MatchModal from "../components/partidos/MatchModal.jsx";
import { useParticipacion } from "../hooks/useParticipacion.js";
import { getMyMatches } from "../services/matchService.js";
import { getSessionUser } from "../services/sessionService.js";
import { waitForMinimumSkeleton } from "../hooks/useInitialLoading.js";
import { m as motion, useReducedMotion } from "framer-motion";

const CTA_CLASSES =
  "inline-flex min-h-11 items-center justify-center rounded-sm border border-primary-foreground bg-primary px-5 py-2 text-sm font-extrabold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90";

const SECONDARY_CLASSES =
  "inline-flex min-h-11 items-center justify-center rounded-sm border border-border px-5 py-2 text-sm font-extrabold uppercase tracking-wider text-text-primary transition-colors hover:border-text-primary";

function Seccion({ id, titulo, partidos, vacio, onSelect }) {
  return (
    <section aria-labelledby={id} className="mt-10 first:mt-0">
      <h2
        id={id}
        className="font-display text-2xl font-extrabold uppercase tracking-wider"
      >
        {titulo}
        <span className="ml-3 text-base tabular-nums text-text-secondary">
          {partidos.length}
        </span>
      </h2>
      {partidos.length === 0 ? (
        <p className="mt-4 rounded-sm border border-dashed border-border px-4 py-6 text-sm text-text-secondary">
          {vacio}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partidos.map((partido) => (
            <MatchCard key={partido.id} match={partido} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}

function MisPartidos() {
  const reduceMotion = useReducedMotion();
  const session = getSessionUser();
  const userId = session?.id;

  const [estado, setEstado] = useState({
    status: "cargando",
    partidos: [],
    error: "",
  });
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [partidoAEliminar, setPartidoAEliminar] = useState(null);
  const [aviso, setAviso] = useState("");

  const esMio = (partido) =>
    String(partido.organizerId) === String(userId) ||
    partido.participants?.some((p) => String(p.userId) === String(userId));

  // Refleja sumarse, bajarse o restar cupo; si ya no es mío, sale de la lista.
  const handleMatchChange = (actualizado) => {
    setPartidoSeleccionado((actual) =>
      actual && String(actual.id) === String(actualizado.id)
        ? actualizado
        : actual,
    );
    setEstado((prev) => ({
      ...prev,
      partidos: prev.partidos
        .map((p) =>
          String(p.id) === String(actualizado.id) ? actualizado : p,
        )
        .filter(esMio),
    }));
  };
  const participacion = useParticipacion(partidoSeleccionado, handleMatchChange);

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
        const partidos = await getMyMatches(userId);
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
                : "No se pudieron cargar tus partidos.",
          });
        }
      }
    };
    void cargarPartidos();

    return () => {
      activo = false;
    };
  }, [userId]);

  const organizando = estado.partidos.filter(
    (p) => String(p.organizerId) === String(userId),
  );
  const anotado = estado.partidos.filter(
    (p) => String(p.organizerId) !== String(userId),
  );

  return (
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
            aria-label="Cargando tus partidos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="overflow-hidden rounded-sm border border-border bg-surface"
              >
                <div className="h-32 animate-pulse bg-border/70 sm:h-36 motion-reduce:animate-none" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded-sm bg-border/70 motion-reduce:animate-none" />
                  <div className="h-4 w-1/2 animate-pulse rounded-sm bg-border/70 motion-reduce:animate-none" />
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

        {estado.status === "cargado" && estado.partidos.length === 0 && (
          <div className="rounded-sm border border-dashed border-border px-5 py-10 text-center">
            <p className="font-display text-xl font-bold uppercase tracking-wider">
              Todavía no tenés partidos
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Sumate a una convocatoria o armá la tuya.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/partidos" className={CTA_CLASSES}>
                Ver convocatorias
              </Link>
              <Link to="/partidos/nuevo" className={SECONDARY_CLASSES}>
                Armar partido
              </Link>
            </div>
          </div>
        )}

        {estado.status === "cargado" && estado.partidos.length > 0 && (
          <>
            <Seccion
              id="organizo"
              titulo="Los que organizo"
              partidos={organizando}
              vacio="No organizás ningún partido por ahora."
              onSelect={setPartidoSeleccionado}
            />
            <Seccion
              id="voy-a-jugar"
              titulo="Voy a jugar"
              partidos={anotado}
              vacio="No estás anotado en ningún partido de otros."
              onSelect={setPartidoSeleccionado}
            />
          </>
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
                String(partidoSeleccionado.organizerId) === String(userId)
              }
              onClose={() => setPartidoSeleccionado(null)}
              onDelete={() => setPartidoAEliminar(partidoSeleccionado)}
              onDecreaseSlot={participacion.restarCupo}
              decreaseError={participacion.errorCupo}
              currentUserId={userId}
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
          userId={userId}
          onClose={() => setPartidoAEliminar(null)}
          onDeleted={partidoEliminado}
        />
      </main>
    </div>
  );
}

export default MisPartidos;
