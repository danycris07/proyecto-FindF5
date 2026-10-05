import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MatchConfirmationCard from "../components/partidos/MatchConfirmationCard.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { getMatchById } from "../services/matchService.js";

function PartidoPublicado() {
  const { partidoId } = useParams();
  const [entrada, setEntrada] = useState({ partidoId: null, activa: false });
  const [resultado, setResultado] = useState({
    partidoId: null,
    partido: null,
    error: "",
    estado: "cargando",
  });
  const cargando =
    resultado.partidoId !== partidoId || resultado.estado === "cargando";
  const partido = resultado.partidoId === partidoId ? resultado.partido : null;
  const error = resultado.partidoId === partidoId ? resultado.error : "";
  const animarTarjeta =
    resultado.estado === "cargado" &&
    resultado.partidoId === partidoId &&
    entrada.partidoId === partidoId &&
    entrada.activa;

  useEffect(() => {
    let activo = true;
    let primerFrameId;
    let segundoFrameId;

    getMatchById(partidoId)
      .then((match) => {
        if (activo) {
          setResultado({
            partidoId,
            partido: match,
            error: "",
            estado: match ? "cargado" : "vacio",
          });

          if (match) {
            primerFrameId = window.requestAnimationFrame(() => {
              segundoFrameId = window.requestAnimationFrame(() => {
                if (activo) {
                  setEntrada({ partidoId, activa: true });
                }
              });
            });
          }
        }
      })
      .catch((loadError) => {
        if (activo) {
          setResultado({
            partidoId,
            partido: null,
            error:
              loadError instanceof Error
                ? `No se pudo cargar el partido: ${loadError.message}`
                : "No se pudo cargar el partido.",
            estado: "error",
          });
        }
      });

    return () => {
      activo = false;
      if (primerFrameId) {
        window.cancelAnimationFrame(primerFrameId);
      }
      if (segundoFrameId) {
        window.cancelAnimationFrame(segundoFrameId);
      }
    };
  }, [partidoId]);

  return (
    <main className="min-h-screen bg-background px-4 py-10 font-sans text-text-primary sm:px-6 sm:py-14">
      <ThemeToggle />
      {cargando ? (
        <section className="mx-auto w-full max-w-3xl rounded-sm border border-border bg-surface p-5 sm:p-8">
          <p role="status" className="text-text-secondary">
            Cargando tu partido...
          </p>
        </section>
      ) : error ? (
        <section className="mx-auto w-full max-w-3xl rounded-sm border border-border bg-surface p-5 sm:p-8">
          <div role="alert" className="space-y-5">
            <p className="text-red-300">{error}</p>
            <Link to="/partidos" className="font-semibold text-text-primary underline">
              Volver a Gestión de partidos
            </Link>
          </div>
        </section>
      ) : !partido ? (
        <section className="mx-auto w-full max-w-3xl rounded-sm border border-border bg-surface p-5 sm:p-8">
          <div className="space-y-5">
            <h1 className="font-display text-3xl font-extrabold uppercase">
              No encontramos ese partido
            </h1>
            <p className="text-text-secondary">
              Puede que ya no esté disponible en esta sesión de prueba.
            </p>
            <Link to="/partidos" className="font-semibold text-text-primary underline">
              Volver a Gestión de partidos
            </Link>
          </div>
        </section>
      ) : (
        <MatchConfirmationCard match={partido} animated={animarTarjeta} />
      )}
    </main>
  );
}

export default PartidoPublicado;
