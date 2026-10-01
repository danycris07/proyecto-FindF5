/**
 * Explica en tres pasos el flujo principal de la aplicación.
 * @param {{ sectionTitle: string }} props Clase compartida para el título de sección.
 */
function ComoFunciona({ sectionTitle }) {
  return (
    <section id="como-funciona" className="scroll-mt-6 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className={sectionTitle}>Cómo funciona</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((paso) => (
            <div
              key={paso}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <p className="font-display text-lg font-bold uppercase tracking-wider text-text-secondary">
                Paso {paso}
              </p>
              <h3 className="mt-2 font-semibold">Título del paso</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Descripción del paso.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ComoFunciona;