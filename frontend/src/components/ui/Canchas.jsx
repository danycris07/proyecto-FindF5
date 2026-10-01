function Canchas({ sectionTitle }) {
  return (
    <section id="canchas" className="scroll-mt-6 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className={sectionTitle}>Canchas</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((cancha) => (
            <div
              key={cancha}
              className="overflow-hidden rounded-lg border border-border bg-surface"
            >
              <div className="aspect-video bg-background" />
              <div className="p-4">
                <h3 className="font-semibold">Nombre de la cancha</h3>
                <p className="mt-1 text-sm text-text-secondary tabular-nums">
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