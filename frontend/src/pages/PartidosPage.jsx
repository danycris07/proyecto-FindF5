import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import ArmarPartido from "./ArmarPartido.jsx";

function PartidosPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-text-primary">
      <ThemeToggle />
      <header className="border-b border-border bg-surface/70">
        <div className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-status">
            FindF5 · Tu equipo
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-wider sm:text-4xl">
            Gestión de partidos
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            Armá una convocatoria y dejá los datos del encuentro listos para jugar.
          </p>
        </div>
      </header>

      <main>
        <ArmarPartido embedded />
      </main>
    </div>
  );
}

export default PartidosPage;
