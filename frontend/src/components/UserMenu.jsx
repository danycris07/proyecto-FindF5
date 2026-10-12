import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearMockSession, getMockSession } from "../services/sessionService.js";

const links = [
  { label: "Convocatorias", to: "/partidos", description: "Ver partidos abiertos" },
  { label: "Armar partido", to: "/partidos/nuevo", description: "Publicar una convocatoria" },
];

function UserMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const session = getMockSession();
  const initials = session?.name
    ?.split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const handleLogout = () => {
    clearMockSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="fixed right-5 top-5 z-50">
      <button
        type="button"
        aria-label={open ? "Cerrar menú de usuario" : "Abrir menú de usuario"}
        aria-expanded={open}
        aria-controls="user-menu-panel"
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface font-bold text-primary shadow-lg shadow-[var(--shadow-color)] transition-colors hover:border-status focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status"
      >
        {initials || "U"}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 cursor-default bg-black/20"
          />
          <aside
            id="user-menu-panel"
            aria-label="Menú de usuario"
            className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2.5rem))] rounded-sm border border-border bg-surface p-5 text-text-primary shadow-2xl shadow-[var(--shadow-color)]"
          >
            <div className="border-b border-border pb-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-secondary">
                Sesión iniciada
              </p>
              <p className="mt-2 font-display text-xl font-bold">{session?.name || "Usuario"}</p>
              <p className="text-sm text-text-secondary">{session?.email}</p>
            </div>

            <nav aria-label="Secciones" className="grid gap-1 py-3">
              {links.map(({ label, to, description }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="rounded-sm px-3 py-2 transition-colors hover:bg-[var(--surface-hover-strong)] focus-visible:outline-2 focus-visible:outline-status"
                >
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-xs text-text-secondary">{description}</span>
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex min-h-11 w-full items-center justify-center rounded-sm border border-red-400/60 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:border-red-300 hover:bg-red-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
            >
              Cerrar sesión
            </button>
          </aside>
        </>
      )}
    </div>
  );
}

export default UserMenu;
