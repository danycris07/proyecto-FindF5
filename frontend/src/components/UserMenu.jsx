import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuChevronRight,
  LuLogOut,
  LuMail,
  LuPhone,
  LuPlus,
  LuSearch,
} from "react-icons/lu";
import {
  clearMockSession,
  getMockSession,
} from "../services/sessionService.js";

const links = [
  {
    label: "Convocatorias",
    to: "/partidos",
    description: "Ver partidos abiertos",
    Icon: LuSearch,
  },
  {
    label: "Armar partido",
    to: "/partidos/nuevo",
    description: "Publicar una convocatoria",
    Icon: LuPlus,
  },
];

const ROLE_LABELS = {
  PLAYER: "Jugador",
  FIELD_OWNER: "Dueño de cancha",
  ADMIN: "Admin",
};

function ContactRow({ Icon, label, value }) {
  return (
    <li className="flex items-center gap-3">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-status" />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          {label}
        </p>
        <p className="truncate text-sm font-medium tabular-nums">{value}</p>
      </div>
    </li>
  );
}

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
            className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-sm border border-border bg-surface text-text-primary shadow-2xl shadow-[var(--shadow-color)]"
          >
            {/* Ficha del jugador */}
            <div className="border-b border-border p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border-2 border-status bg-background font-display text-2xl font-extrabold uppercase tracking-wider">
                  {initials || "U"}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl font-bold uppercase tracking-wider">
                    {session?.name || "Usuario"}
                  </p>
                  <span className="mt-1 inline-flex rounded-sm border border-border px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-text-secondary">
                    {ROLE_LABELS[session?.role] || "Jugador"}
                  </span>
                </div>
              </div>

              <ul className="mt-4 grid gap-3 border-t border-border pt-4">
                <ContactRow
                  Icon={LuPhone}
                  label="Teléfono"
                  value={session?.phone || "Sin teléfono cargado"}
                />
                <ContactRow
                  Icon={LuMail}
                  label="Email"
                  value={session?.email || "Sin email"}
                />
              </ul>
            </div>

            {/* Navegación */}
            <nav aria-label="Secciones" className="grid gap-1 p-3">
              {links.map(({ label, to, description, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 transition-colors hover:bg-[var(--surface-hover-strong)] focus-visible:outline-2 focus-visible:outline-status ${
                      isActive
                        ? "border-primary bg-[var(--surface-hover-strong)]"
                        : "border-transparent"
                    }`
                  }
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-background text-status">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{label}</span>
                    <span className="block text-xs text-text-secondary">
                      {description}
                    </span>
                  </span>
                  <LuChevronRight
                    aria-hidden="true"
                    className="ml-auto h-4 w-4 shrink-0 text-text-secondary transition-transform group-hover:translate-x-0.5"
                  />
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-border p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border border-red-400/60 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:border-red-300 hover:bg-red-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
              >
                <LuLogOut aria-hidden="true" className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

export default UserMenu;
