import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MatchCard from "../components/partidos/MatchCard.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { getMatches, decreaseMatchSlot } from "../services/matchService.js";
import MatchConfirmationCard from "../components/partidos/MatchDetailCard.jsx";
import MatchModal from "../components/partidos/MatchModal.jsx";
import { getMockSession } from "../services/sessionService.js";
import { waitForInitialLoading } from "../hooks/useInitialLoading.js";
import DeleteMatchDialog from "../components/partidos/DeleteMatchDialog.jsx";
import { GoPlus } from "react-icons/go";

const CTA_CLASSES =
  "inline-flex min-h-11 items-center justify-center rounded-sm border border-primary bg-primary px-5 py-2 text-sm font-extrabold uppercase tracking-wider text-primary-foreground";

function PartidosPage() {
  const [decreaseError, setDecreaseError] = useState("");

  const handleDecreaseSlot = async () => {
    if (!partidoSeleccionado || partidoSeleccionado.missingPlayers <= 0) return;

    setDecreaseError("");
    const prevSlots = partidoSeleccionado.missingPlayers;

    // Criterio 2: Actualización Optimista (Al instante)
    setPartidoSeleccionado((p) => ({ ...p, missingPlayers: prevSlots - 1 }));

    try {
      const updated = await decreaseMatchSlot(
        partidoSeleccionado.id,
        session.id,
      );
      setPartidoSeleccionado(updated);
      setEstado((prev) => ({
        ...prev,
        partidos: prev.partidos.map((p) => (p.id === updated.id ? updated : p)),
      }));
    } catch (err) {
      // Criterio 5: Rollback visual con mensaje de error
      setPartidoSeleccionado((p) => ({ ...p, missingPlayers: prevSlots }));
      setDecreaseError(err.message);
    }
  };

  const navigate = useNavigate();

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
  const session = getMockSession();

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

  const armarPartidoButton = (
    <button
      type="button"
      onClick={handleOpenForm}
      disabled={openingForm}
      aria-busy={openingForm}
      className={`${CTA_CLASSES} ${
        openingForm
          ? "cursor-wait opacity-60 disabled:cursor-wait"
          : "transition-opacity hover:opacity-90"
      }`}
    >
      {openingForm ? "Cargando..." : "Armar partido"}
    </button>
  );

  useEffect(() => {
    let activo = true;
    getMatches()
      .then((partidos) => {
        if (activo) setEstado({ status: "cargado", partidos, error: "" });
      })
      .catch((error) => {
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
      });

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
        <ThemeToggle />
        <header className="border-b border-border bg-surface/70">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-4 px-5 py-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-status">
                FindF5 · Convocatorias
              </p>
              <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-wider sm:text-4xl">
                Partidos abiertos
              </h1>
              {estado.status === "cargado" && (
                <p className="mt-1 text-sm tabular-nums text-text-secondary">
                  {estado.partidos.length}{" "}
                  {estado.partidos.length === 1
                    ? "convocatoria abierta"
                    : "convocatorias abiertas"}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {armarPartidoButton}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
          {aviso && (
            <p
              role="status"
              className="mb-6 rounded-sm border border-status/40 bg-status/10 px-4 py-3 text-sm text-status"
            >
              {aviso}
            </p>
          )}
          {estado.status === "cargando" && (
            <p role="status" className="text-text-secondary">
              Cargando convocatorias...
            </p>
          )}

          {estado.status === "error" && (
            <p role="alert" className="text-red-300">
              {estado.error}
            </p>
          )}

          {estado.status === "cargado" && estado.partidos.length === 0 && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleOpenForm}
                disabled={openingForm}
                className="flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-wait disabled:opacity-60"
              >
                <GoPlus aria-hidden="true" className="text-2xl" />
                <span className="font-display text-lg font-bold uppercase tracking-wider">
                  ¿No hay fecha? Armá el tuyo
                </span>
              </button>
            </div>
          )}

          {estado.status === "cargado" && estado.partidos.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {estado.partidos.map((partido) => (
                <MatchCard
                  key={partido.id}
                  match={partido}
                  onSelect={setPartidoSeleccionado}
                />
              ))}
              <button
                type="button"
                onClick={handleOpenForm}
                disabled={openingForm}
                className="flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-wait disabled:opacity-60"
              >
                <GoPlus aria-hidden="true" className="text-2xl" />
                <span className="font-display text-lg font-bold uppercase tracking-wider">
                  ¿No hay fecha? Armá el tuyo
                </span>
              </button>
            </div>
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
                onDecreaseSlot={handleDecreaseSlot}
                decreaseError={decreaseError}
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
