/** Cierra la landing con la marca y el aviso de derechos reservados. */
function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-text-secondary sm:flex-row sm:justify-between">
        <p className="font-display font-bold uppercase tracking-wider text-text-primary">
          FindF5
        </p>
        <p className="tabular-nums">© 2026 FindF5. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;