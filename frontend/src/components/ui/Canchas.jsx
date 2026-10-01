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
              className="group overflow-hidden rounded-sm border border-white/10 bg-surface/65 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-2xl hover:shadow-black/30 motion-reduce:transition-none"
            >
              <div className="relative aspect-video overflow-hidden bg-[#101914]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 640 360"
                  className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                >
                  <defs>
                    <linearGradient id={`court-${cancha}`} x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0" stopColor="#243c2a" />
                      <stop offset="1" stopColor="#101b17" />
                    </linearGradient>
                  </defs>
                  <rect width="640" height="360" fill="#0c1310" />
                  <path d="M34 38H606L574 322H66Z" fill={`url(#court-${cancha})`} />
                  <path
                    d="M34 38H606L574 322H66ZM320 38V322M34 106H114V254H50M606 106H526V254H590"
                    fill="none"
                    stroke="#c7f28d"
                    strokeOpacity="0.62"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="320"
                    cy="180"
                    rx="46"
                    ry="58"
                    fill="none"
                    stroke="#c7f28d"
                    strokeOpacity="0.62"
                    strokeWidth="2"
                  />
                  <path d="M320 38V322" stroke="#c7f28d" strokeOpacity="0.25" strokeDasharray="6 9" />
                  <path d="M34 38L66 106M606 38L574 106M66 254L66 322M574 254L574 322" stroke="#d9e9c1" strokeOpacity="0.2" />
                  <circle cx="54" cy="57" r="4" fill="#f0ffd5" opacity="0.9" />
                  <circle cx="586" cy="57" r="4" fill="#f0ffd5" opacity="0.9" />
                </svg>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08100c]/70 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/65 to-transparent" />
              </div>
              <div className="border-t border-white/[0.07] p-5">
                <h3 className="font-display text-xl font-bold text-text-primary">
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