import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchCard from "../components/partidos/MatchCard.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { getMatches } from "../services/matchService.js";
import MatchConfirmationCard from "../components/partidos/MatchDetailCard.jsx";
import MatchModal from "../components/partidos/MatchModal.jsx";
import { getMockSession } from "../services/sessionService.js";
import { waitForInitialLoading } from "../hooks/useInitialLoading.js";

const CTA_CLASSES =
  "inline-flex min-h-11 items-center justify-center rounded-sm border border-primary bg-primary px-5 py-2 text-sm font-extrabold uppercase tracking-wider text-primary-foreground";

function PartidosPage() {
  const navigate = useNavigate();
  const [openingForm, setOpeningForm] = useState(false);
  const openingFormRef = useRef(false);
  const [estado, setEstado] = useState({
    status: "cargando",
    partidos: [],
    error: "",
  });
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const session = getMockSession();

  const handleOpenForm = async () => {
    if (openingFormRef.current) return;

    openingFormRef.current = true;
    setOpeningForm(true);
    await waitForInitialLoading();
    navigate("/partidos/nuevo");
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
    <div className="min-h-screen bg-background font-sans text-text-primary">
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
          </div>
          {armarPartidoButton}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
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
            <p className="text-text-secondary">
              Todavía no hay convocatorias abiertas. Armá la primera.
            </p>
            {armarPartidoButton}
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
                String(partidoSeleccionado.organizerId) === String(session?.id)
              }
              onClose={() => setPartidoSeleccionado(null)}
            />
          )}
        </MatchModal>
      </main>
    </div>
  );
}

export default PartidosPage;
