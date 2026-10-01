const NAV_LINKS = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Canchas", href: "#canchas" },
  { label: "Preguntas frecuentes", href: "#preguntas-frecuentes" },
];

/**
 * Muestra la marca, los enlaces a secciones y las acciones de acceso.
 * Los href de NAV_LINKS corresponden a los ids de la landing.
 * @param {{ btnPrimary: string, btnSecondary: string }} props Clases compartidas de botones.
 */
function Navbar({ btnPrimary, btnSecondary }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 lg:flex-nowrap lg:px-8">
        <a
          href="#"
          className="font-display text-3xl font-extrabold uppercase leading-none tracking-wider text-text-primary transition-colors duration-200 hover:text-text-secondary"
        >
          FindF5
        </a>

        <nav
          aria-label="Principal"
          className="order-last w-full lg:order-none lg:w-auto"
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2 overflow-x-auto text-sm font-semibold text-text-secondary sm:gap-7 lg:overflow-visible">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  className="transition-colors duration-200 hover:text-text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 gap-2 sm:gap-3">
          <a href="#" className={btnSecondary}>
            Iniciar sesión
          </a>
          <a href="#" className={btnPrimary}>
            Registrarme
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;