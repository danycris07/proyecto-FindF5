import preguntasFrecuentes from "../../mocks/preguntasFrecuentes";

/**
 * Renderiza las preguntas y respuestas desde el mock del frontend.
 * @param {{ sectionTitle: string }} props Clase compartida para el título de sección.
 */
function PreguntasFrecuentes({ sectionTitle }) {
  return (
    <section
      id="preguntas-frecuentes"
      className="scroll-mt-6 border-t border-border"
    >
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h2 className={sectionTitle}>Preguntas frecuentes</h2>
        <div className="mt-6 space-y-3">
          {preguntasFrecuentes.map((pregunta) => (
            <div
              key={pregunta.id}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <h3 className="font-semibold">{pregunta.titulo}</h3>
              <p className="mt-1 text-sm text-text-secondary">
                {pregunta.respuesta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PreguntasFrecuentes;