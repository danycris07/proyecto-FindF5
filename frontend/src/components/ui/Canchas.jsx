/**
 * Presenta las tarjetas de ejemplo para descubrir canchas.
 * @param {{ sectionTitle: string }} props Clase compartida para el título de sección.
 */
import { mockFields } from "../../mocks/MockData";
import Skeleton from "./Skeleton";

function Canchas({ sectionTitle, isLoading = false }) {
  return (
    <section id="canchas" className="scroll-mt-24" aria-busy={isLoading}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        <h2 className={sectionTitle}>Canchas</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {isLoading
            ? Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-sm border border-border bg-surface"
                >
                  <Skeleton className="aspect-video rounded-none" />
                  <div className="space-y-3 border-t border-border p-5">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            : mockFields.map((cancha) => (
                <div
                  key={cancha.id}
                  className="group overflow-hidden rounded-sm border border-border bg-surface transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-status hover:shadow-2xl hover:shadow-[var(--shadow-color)] motion-reduce:transition-none"
                >
                  <div className="relative aspect-video overflow-hidden bg-background">
                    <img
                      src={cancha.imagen}
                      alt={cancha.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>
                  <div className="border-t border-border p-5">
                    <h3 className="font-display text-xl font-bold uppercase tracking-wider text-text-primary">
                      {cancha.name}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary tabular-nums">
                      ${cancha.price} · {cancha.address} ·
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default Canchas;
