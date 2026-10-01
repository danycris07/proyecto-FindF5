import preguntasFrecuentes from "../../mocks/preguntasFrecuentes";

/**
 * Renderiza las preguntas y respuestas desde el mock del frontend.
 * @param {{ sectionTitle: string }} props Clase compartida para el título de sección.
 */
function PreguntasFrecuentes({ sectionTitle }) {
  return (
    <section
      id="preguntas-frecuentes"
      className="scroll-mt-24 border-t border-white/[0.07] bg-surface/20"
    >
      <div className="mx-auto max-w-4xl px-5 py-20 sm:py-24 lg:px-8">
        <h2 className={sectionTitle}>Preguntas frecuentes</h2>
        <div className="mt-9">
          {preguntasFrecuentes.map((pregunta) => (
            <div
              key={pregunta.id}
              className="border-b border-white/10 py-6 first:border-t sm:py-7"
            >
              <h3 className="flex items-start gap-4 text-base font-semibold text-text-primary before:mt-1.5 before:h-2.5 before:w-2.5 before:shrink-0 before:rotate-45 before:bg-primary before:content-[''] sm:text-lg">
                {pregunta.titulo}
              </h3>
              <p className="mt-3 pl-6 text-sm leading-7 text-text-secondary sm:text-base">
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