import { pasos } from "../../mocks/MockData";
import Skeleton from "./Skeleton";

/**
 * Explica en tres pasos el flujo principal de la aplicación.
 * @param {{ sectionTitle: string }} props Clase compartida para el título de sección.
 */
function ComoFunciona({ sectionTitle, isLoading = false }) {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 border-y border-white/[0.07] bg-surface/20"
      aria-busy={isLoading}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        <h2 className={sectionTitle}>Cómo funciona</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="space-y-5 rounded-sm border border-border bg-surface p-6 sm:p-7"
                >
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))
            : pasos.map((paso) => (
                <div
                  key={paso.numero}
                  className="group relative isolate overflow-hidden rounded-sm border border-border bg-surface p-6 transition-[transform,border-color,background-color,box-shadow] duration-300 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-border before:content-[''] hover:-translate-y-1 hover:border-white/25 hover:bg-border/70 hover:shadow-xl motion-reduce:transition-none sm:p-7"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-10 -z-10 h-32 w-32 rounded-full bg-border/50 blur-2xl transition-colors duration-300 group-hover:bg-border/70"
                  />
                  <p className="font-display text-xl font-extrabold uppercase tracking-wider text-text-secondary">
                    Paso {paso.numero}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">
                    {paso.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {paso.description}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default ComoFunciona;
