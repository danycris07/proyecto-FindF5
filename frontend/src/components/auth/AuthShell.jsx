import { Link } from "react-router-dom";
import Skeleton from "../ui/Skeleton.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

/**
 * Estructura común de login y registro: marca, encabezado deportivo,
 * tarjeta, estado de carga y enlace a la otra pantalla.
 */
function AuthShell({
  eyebrow,
  title,
  subtitle,
  footer,
  loading = false,
  loadingLabel = "Cargando formulario",
  skeletonFields = 2,
  children,
}) {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background px-4 py-10 font-sans text-text-primary"
      aria-busy={loading}
    >
      <ThemeToggle />
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 font-display text-2xl font-extrabold uppercase tracking-wider text-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-status"
        >
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-sm border border-primary-foreground bg-primary"
          />
          FindF5
        </Link>

        <section className="rounded-md border border-border bg-surface p-6 shadow-2xl shadow-[var(--shadow-color)] sm:p-8">
          <header className="mb-7">
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-status">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none tracking-wider">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              {subtitle}
            </p>
          </header>

          {loading ? (
            <div role="status" aria-label={loadingLabel} className="space-y-5">
              {Array.from({ length: skeletonFields }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            children
          )}

          <p className="mt-6 text-center text-sm text-text-secondary">
            {footer}
          </p>
        </section>
      </div>
    </main>
  );
}

export default AuthShell;
