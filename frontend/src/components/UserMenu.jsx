import { useEffect, useId, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  m as motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  LuCalendarCheck,
  LuChevronRight,
  LuLogOut,
  LuMail,
  LuPhone,
  LuPlus,
  LuSearch,
  LuShieldCheck,
} from "react-icons/lu";
import ThemeToggle from "./ui/ThemeToggle.jsx";
import { getSessionUser, logoutUser } from "../services/sessionService.js";

const links = [
  {
    label: "Convocatorias",
    to: "/partidos",
    description: "Ver partidos abiertos",
    Icon: LuSearch,
  },
  {
    label: "Mis partidos",
    to: "/mis-partidos",
    description: "Organizados y anotados",
    Icon: LuCalendarCheck,
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

const POSICIONES = {
  GOALKEEPER: "Arquero",
  FIELD_PLAYER: "Jugador de campo",
};

/** Perfil que se muestra en la ficha: el dueño sale del rol, el resto de la posición. */
function perfilDe(session) {
  if (session?.role === "FIELD_OWNER") return "Dueño de cancha";
  return POSICIONES[session?.position] || null;
}

const PIERNAS = { RIGHT: "Diestro", LEFT: "Zurdo" };

function StatTile({ label, value, caption }) {
  return (
    <div className="rounded-sm border border-border bg-background px-3 py-2.5">
      <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight tracking-wider">
        {value}
      </p>
      {caption && <p className="mt-1 text-xs text-text-secondary">{caption}</p>}
    </div>
  );
}

function AttendanceMeter({ porcentaje }) {
  const valor = Math.round(Math.min(100, Math.max(0, porcentaje)));

  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium">Asistencia</span>
        <span className="font-semibold tabular-nums">{valor}%</span>
      </div>
      <div
        role="meter"
        aria-label="Asistencia"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valor}
        aria-valuetext={`${valor}% de asistencia`}
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-sm bg-border"
      >
        <div
          className="h-full rounded-sm bg-status"
          style={{ width: `${valor}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-text-secondary">
        Partidos que jugaste sobre los que confirmaste.
      </p>
    </div>
  );
}

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

function UserMenu({ placement = "desktop" }) {
  const [open, setOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const menuId = useId();
  const menuPanelId = `user-menu-panel-${menuId}`;
  const reputationTitleId = `reputacion-titulo-${menuId}`;
  const isMobile = placement === "mobile";
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useTransform(pointerY, [0, 1], [2.5, -2.5]);
  const rotateY = useTransform(pointerX, [0, 1], [-2.5, 2.5]);
  const glareX = useTransform(pointerX, (value) => `${value * 100}%`);
  const glareY = useTransform(pointerY, (value) => `${value * 100}%`);
  const profileGlare = useMotionTemplate`radial-gradient(ellipse at ${glareX} ${glareY}, rgba(255, 255, 255, 0.18), transparent 56%)`;
  const navigate = useNavigate();
  const session = getSessionUser();
  const esJugador = (session?.role ?? "PLAYER") === "PLAYER";
  const esDuenio = session?.role === "FIELD_OWNER";
  const perfil = perfilDe(session);
  const asistencia = Number.isFinite(session?.reputation?.attendance)
    ? session.reputation.attendance
    : null;
  const initials = session?.name
    ?.split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const trackProfilePointer = (event) => {
    if (event.pointerType === "touch" || reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  };
  const menuLinks =
    session?.role === "ADMIN"
      ? [
          {
            label: "Administración",
            to: "/admin",
            description: "Usuarios, canchas y partidos",
            Icon: LuShieldCheck,
          },
        ]
      : session?.role === "FIELD_OWNER"
        ? links.slice(0, 1)
        : links;

  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const handleLogout = async () => {
    setLogoutPending(true);
    setLogoutError("");
    try {
      await logoutUser();
      navigate("/", { replace: true });
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "No se pudo cerrar sesión.",
      );
    } finally {
      setLogoutPending(false);
    }
  };

  return (
    <div className={isMobile ? "relative z-50" : "fixed right-5 top-5 z-50"}>
      <button
        type="button"
        aria-label={open ? "Cerrar menú de usuario" : "Abrir menú de usuario"}
        aria-expanded={open}
        aria-controls={menuPanelId}
        onClick={() => setOpen((current) => !current)}
        className={
          isMobile
            ? "flex min-w-16 flex-col items-center justify-center gap-1 text-xs font-medium text-text-secondary transition-colors hover:text-primary-text focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status"
            : "flex h-12 w-12 items-center justify-center rounded-sm border border-border bg-surface font-bold text-primary-text shadow-lg shadow-[var(--shadow-color)] transition-colors hover:border-status focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status"
        }
      >
        {isMobile ? (
          <>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-[10px] font-bold text-primary-text">
              {initials || "U"}
            </span>
            <span>Perfil</span>
          </>
        ) : (
          initials || "U"
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.button
            key="user-menu-backdrop"
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 cursor-default bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          />
        )}
        {open && (
          <motion.aside
            key="user-menu-panel"
            id={menuPanelId}
            aria-label="Menú de usuario"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : isMobile
                  ? { opacity: 0, x: 24 }
                  : { opacity: 0, y: -8, scale: 0.98 }
            }
            animate={
              isMobile
                ? { opacity: 1, x: 0 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : isMobile
                  ? { opacity: 0, x: 24 }
                  : { opacity: 0, y: -6, scale: 0.98 }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 360, damping: 30 }
            }
            className={
              isMobile
                ? "fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] right-0 z-50 max-h-[calc(100dvh-5rem)] w-[min(22rem,100vw)] overflow-y-auto rounded-l-sm border border-border bg-surface text-text-primary shadow-2xl shadow-[var(--shadow-color)]"
                : "absolute right-0 top-14 max-h-[calc(100dvh-5rem)] w-[min(22rem,calc(100vw-2.5rem))] overflow-y-auto rounded-sm border border-border bg-surface text-text-primary shadow-2xl shadow-[var(--shadow-color)]"
            }
          >
            {/* Ficha del jugador */}
            <motion.div
              className="user-profile-card border-b border-border p-5"
              onPointerMove={trackProfilePointer}
              style={
                reduceMotion
                  ? undefined
                  : { rotateX, rotateY, transformPerspective: 900 }
              }
              variants={{
                rest: { scale: 1 },
                hover: { scale: reduceMotion ? 1 : 1.005 },
              }}
              initial="rest"
              whileHover="hover"
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
                <motion.div
                  aria-hidden="true"
                  className="user-profile-glare"
                  style={{ background: profileGlare }}
                  variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: reduceMotion ? 0 : 1 },
                  }}
                />
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

                {(esJugador || esDuenio) && (
                  <div
                    className={`mt-4 grid gap-2 ${esJugador ? "grid-cols-2" : "grid-cols-1"}`}
                  >
                    <StatTile
                      label="Perfil"
                      value={perfil || "—"}
                      caption={perfil ? null : "Sin definir"}
                    />
                    {esJugador && (
                      <StatTile
                        label="Pierna hábil"
                        value={PIERNAS[session?.dominantFoot] || "—"}
                        caption={
                          PIERNAS[session?.dominantFoot] ? null : "Sin definir"
                        }
                      />
                    )}
                  </div>
                )}

                {esJugador && (
                  <section
                    aria-labelledby={reputationTitleId}
                    className="mt-4 border-t border-border pt-4"
                  >
                    <h3
                      id={reputationTitleId}
                      className="font-display text-sm font-bold uppercase tracking-[0.2em] text-text-secondary"
                    >
                      Reputación en cancha
                    </h3>
                    {asistencia !== null ? (
                      <AttendanceMeter porcentaje={asistencia} />
                    ) : (
                      <p className="mt-2 text-sm text-text-secondary">
                        Todavía no tenés reputación. Se arma con tus primeros
                        partidos.
                      </p>
                    )}
                  </section>
                )}

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
            </motion.div>

              {/* Navegación */}
              <nav aria-label="Secciones" className="grid gap-1 p-3">
                {menuLinks.map(({ label, to, description, Icon }) => (
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
                <ThemeToggle placement="menu" />
              </div>

              <div className="border-t border-border p-3">
                {logoutError && (
                  <p role="alert" className="mb-3 text-sm text-danger">
                    {logoutError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutPending}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border border-danger/60 bg-danger/10 px-4 py-2 text-sm font-bold text-danger transition-colors hover:border-danger hover:bg-danger/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
                >
                  <LuLogOut aria-hidden="true" className="h-4 w-4" />
                  {logoutPending ? "Cerrando sesión..." : "Cerrar sesión"}
                </button>
              </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserMenu;