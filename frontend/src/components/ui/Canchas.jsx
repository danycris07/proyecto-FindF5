/**
 * Presenta las tarjetas de ejemplo para descubrir canchas.
 * @param {{ sectionTitle: string }} props Clase compartida para el título de sección.
 */
import { mockFields } from "../../mocks/MockData";
function Canchas({ sectionTitle }) {
  return (
    <section id="canchas" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        <h2 className={sectionTitle}>Canchas</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {mockFields.map((cancha) => (
            <div
              key={cancha.id}
              className="group overflow-hidden rounded-sm border border-border bg-surface transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-black/30 motion-reduce:transition-none"
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
