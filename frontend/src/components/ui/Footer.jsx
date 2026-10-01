/** Cierra la landing con la marca y el aviso de derechos reservados. */
function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#080c12]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="font-display text-lg font-extrabold uppercase text-text-primary">
          FindF5
        </p>
        <p className="tabular-nums">© 2026 FindF5. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;