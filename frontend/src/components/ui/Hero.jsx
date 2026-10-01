/**
 * Presenta la propuesta de valor, sus acciones y una ilustración de cancha.
 * @param {{ btnPrimary: string, btnSecondary: string }} props Clases compartidas de botones.
 */
function Hero({ btnPrimary, btnSecondary }) {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:py-20 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-10 lg:px-8 lg:py-24">
      <div className="relative z-10 space-y-7 md:py-8">
        <h1 className="max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.9] text-text-primary sm:text-6xl lg:text-7xl">
          Título de la propuesta de valor
        </h1>
        <p className="max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
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

      <div className="group relative aspect-[1.12] overflow-hidden rounded-sm border border-white/10 bg-[#101914] shadow-2xl shadow-black/40 before:absolute before:inset-0 before:z-10 before:bg-[radial-gradient(ellipse_at_50%_48%,transparent_35%,rgba(5,10,8,0.48)_100%)] before:content-['']">
        {/*
          PARA USAR TU IMAGEN: borrá el <svg> de abajo y poné:
          <img src="/tu-imagen.jpg" alt="Descripción de la imagen" className="h-full w-full object-cover" />
        */}
        <svg
          viewBox="0 0 800 600"
          role="img"
          aria-label="Imagen de ejemplo: cancha de fútbol 5 vista desde arriba"
          className="h-full w-full fill-none stroke-[#b8ef62]/65 transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transition-none"
          strokeWidth="2"
        >
          <defs>
            <linearGradient id="hero-court" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#1b3527" />
              <stop offset="0.52" stopColor="#14261d" />
              <stop offset="1" stopColor="#0b1511" />
            </linearGradient>
            <linearGradient id="hero-light" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ccff00" stopOpacity="0.2" />
              <stop offset="1" stopColor="#ccff00" stopOpacity="0" />
            </linearGradient>
            <pattern id="hero-grain" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#d8f5ad" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="#0b110e" />
          <path d="M56 54H744L680 548H120Z" fill="url(#hero-court)" />
          <path d="M56 54H744L680 548H120Z" fill="url(#hero-grain)" />
          <path d="M56 54H744L680 548H120Z" fill="url(#hero-light)" />
          <path d="M56 54H744L680 548H120Z" />
          <path d="M400 54V548" />
          <ellipse cx="400" cy="301" rx="82" ry="91" />
          <circle cx="400" cy="301" r="5" fill="#ccff00" stroke="none" />
          <path d="M56 185H157V418H93M744 185H643V418H707" />
          <path d="M56 224H187V379H101M744 224H613V379H699" opacity="0.75" />
          <path d="M120 54L157 185M680 54L643 185M120 548L157 418M680 548L643 418" opacity="0.5" />
          <path d="M400 54V548" strokeDasharray="8 12" opacity="0.24" />
          <circle cx="79" cy="74" r="7" fill="#efffc9" stroke="none" />
          <circle cx="721" cy="74" r="7" fill="#efffc9" stroke="none" />
          <circle cx="132" cy="520" r="5" fill="#efffc9" stroke="none" opacity="0.65" />
          <circle cx="668" cy="520" r="5" fill="#efffc9" stroke="none" opacity="0.65" />
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(115deg,transparent_42%,rgba(204,255,0,0.055)_50%,transparent_58%)]"
        />
      </div>
    </section>
  );
}

export default Hero;