/**
 * Presenta la propuesta de valor, sus acciones y una ilustración de cancha.
 * @param {{ btnPrimary: string, btnSecondary: string }} props Clases compartidas de botones.
 */
function Hero({ btnPrimary, btnSecondary }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center md:gap-12 md:py-20">
      <div className="space-y-5">
        <h1 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-wider md:text-5xl">
          Título de la propuesta de valor
        </h1>
        <p className="max-w-prose text-base text-text-secondary md:text-lg">
          Descripción de la propuesta de valor. Acá va una o dos frases que
          expliquen qué es la app y para quién sirve.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#" className={btnPrimary}>
            Registrarme
          </a>
          <a href="#" className={btnSecondary}>
            Iniciar sesión
          </a>
        </div>
      </div>

      <div className="aspect-4/3 overflow-hidden rounded-lg border border-border bg-surface">
        {/*
          PARA USAR TU IMAGEN: borrá el <svg> de abajo y poné:
          <img src="/tu-imagen.jpg" alt="Descripción de la imagen" className="h-full w-full object-cover" />
        */}
        <svg
          viewBox="0 0 400 300"
          role="img"
          aria-label="Imagen de ejemplo: cancha de fútbol 5 vista desde arriba"
          className="h-full w-full fill-none stroke-text-secondary/40"
          strokeWidth="3"
        >
          <rect x="20" y="20" width="360" height="260" rx="4" />
          <line x1="200" y1="20" x2="200" y2="280" />
          <circle cx="200" cy="150" r="42" />
          <rect x="20" y="95" width="55" height="110" />
          <rect x="325" y="95" width="55" height="110" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;