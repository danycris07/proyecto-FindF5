/**
 * Presenta las tarjetas de ejemplo para descubrir canchas.
 * @param {{ sectionTitle: string }} props Clase compartida para el título de sección.
 */
function Canchas({ sectionTitle }) {
  return (
    <section id="canchas" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        <h2 className={sectionTitle}>Canchas</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {[1, 2, 3].map((cancha) => (
            <div
              key={cancha}
              className="group overflow-hidden rounded-sm border border-border bg-surface transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-black/30 motion-reduce:transition-none"
            >
              <div className="relative aspect-video overflow-hidden bg-background">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 640 360"
                  className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                >
                  <defs>
                    <linearGradient id={`court-${cancha}`} x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0" stopColor="#24324a" />
                      <stop offset="1" stopColor="#111827" />
                    </linearGradient>
                  </defs>
                  <rect width="640" height="360" fill="#0b0f19" />
                  <path d="M34 38H606L574 322H66Z" fill={`url(#court-${cancha})`} />
                  <path
                    d="M34 38H606L574 322H66ZM320 38V322M34 106H114V254H50M606 106H526V254H590"
                    fill="none"
                    stroke="#94a3b8"
                    strokeOpacity="0.72"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="320"
                    cy="180"
                    rx="46"
                    ry="58"
                    fill="none"
                    stroke="#94a3b8"
                    strokeOpacity="0.72"
                    strokeWidth="2"
                  />
                  <path d="M320 38V322" stroke="#94a3b8" strokeOpacity="0.3" strokeDasharray="6 9" />
                  <path d="M34 38L66 106M606 38L574 106M66 254L66 322M574 254L574 322" stroke="#cbd5e1" strokeOpacity="0.24" />
                  <circle cx="54" cy="57" r="4" fill="#f1f5f9" opacity="0.8" />
                  <circle cx="586" cy="57" r="4" fill="#f1f5f9" opacity="0.8" />
                </svg>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
              <div className="border-t border-border p-5">
                <h3 className="font-display text-xl font-bold uppercase tracking-wider text-text-primary">
                  Nombre de la cancha
                </h3>
                <p className="mt-2 text-sm text-text-secondary tabular-nums">
                  Zona · Horarios · Precio
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