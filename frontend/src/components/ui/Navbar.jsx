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
    <header className="relative border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4">
        <a
          href="#"
          className="font-display text-2xl font-extrabold uppercase tracking-wider"
        >
          FindF5
        </a>

        <nav
          aria-label="Principal"
          className="order-last w-full md:order-0 md:w-auto"
        >
          <ul className="flex gap-6 overflow-x-auto text-sm font-medium text-text-secondary">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="shrink-0">
                <a href={link.href} className="hover:text-text-primary">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-2">
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