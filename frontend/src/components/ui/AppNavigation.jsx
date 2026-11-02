import { Link, NavLink, useNavigate } from "react-router-dom";
import { GoCalendar, GoPlus, GoSearch, GoShield } from "react-icons/go";
import UserMenu from "../UserMenu.jsx";
import { useSession } from "../../context/useSession.js";

const desktopLinkClass = ({ isActive }) =>
  `min-h-11 rounded border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CCFF00] ${
    isActive
      ? "border-[#CCFF00] bg-[#CCFF00] text-[#0B0F19]"
      : "border-transparent text-slate-100 hover:border-[#24324A] hover:bg-[#161F30] hover:text-white"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex min-h-11 w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CCFF00] ${
    isActive ? "text-[#CCFF00]" : "text-slate-200"
  }`;

function AppNavigation({ showMobile = true }) {
  const navigate = useNavigate();
  const { user } = useSession();
  const isAdmin = user?.role === "ADMIN";
  const attendance = Number.isFinite(user?.reputation?.attendance)
    ? Math.max(0, Math.min(100, Math.round(user.reputation.attendance)))
    : null;
  const position = user?.role === "FIELD_OWNER"
    ? "Cancha"
    : user?.position === "GOALKEEPER"
      ? "Arquero"
      : user?.position === "FIELD_PLAYER"
        ? "Jugador de campo"
        : "Jugador";

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-40 hidden px-4 md:block">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 rounded-lg border border-[#24324A] bg-[#0B0F19] px-5"
        >
          <Link
            to="/partidos"
            aria-label="FindF5 - Convocatorias"
            className="shrink-0 rounded font-display text-xl font-black tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CCFF00]"
          >
            FindF5
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <NavLink to="/partidos" end className={desktopLinkClass}>
              Partidos
            </NavLink>
            <NavLink to="/mis-partidos" end className={desktopLinkClass}>
              Mis partidos
            </NavLink>
            <span title="Ranking local: próximamente" className="cursor-not-allowed rounded border border-transparent px-4 py-2 text-sm font-semibold text-slate-400">Ranking local</span>
            {isAdmin && (
              <NavLink to="/admin" className={desktopLinkClass}>
                Administración
              </NavLink>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/partidos/nuevo")}
              className="min-h-11 rounded border border-[#CCFF00] bg-[#CCFF00] px-4 py-2.5 text-sm font-black text-[#0B0F19] transition-colors hover:bg-[#E2FF66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CCFF00] active:bg-[#B8E600]"
            >
              <span>Armar partido</span>
            </button>
            <div className="hidden items-center gap-2.5 border-l border-white/10 pl-4 xl:flex">
              <div className="min-w-24">
                <p className="text-sm font-bold text-white">{position}</p>
                {attendance !== null ? (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#24324A]"><div className="h-full rounded-full bg-[#CCFF00]" style={{ width: `${attendance}%` }} /></div>
                    <span className="text-[10px] font-semibold text-slate-200">Asistencia {attendance}%</span>
                  </div>
                ) : <p className="mt-0.5 text-[10px] text-slate-300">Perfil de jugador</p>}
              </div>
            </div>
            <div className="[&>div]:!static [&>div]:!right-auto [&>div]:!top-auto [&>div]:!z-auto">
              <UserMenu />
            </div>
          </div>
        </nav>
      </header>

      {showMobile && (
        <nav
          aria-label="Navegación móvil"
          className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center border-t border-[#24324A] bg-[#0B0F19] px-3 pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <div className="flex min-w-0 flex-1 items-center justify-evenly">
            <NavLink
              to="/partidos"
              end
              className={({ isActive }) =>
                `${mobileLinkClass({ isActive })} min-w-0 flex-1`
              }
            >
              <GoSearch aria-hidden="true" className="h-5 w-5" />
              <span>Buscar</span>
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${mobileLinkClass({ isActive })} min-w-0 flex-1`
                }
              >
                <GoShield aria-hidden="true" className="h-5 w-5" />
                <span>Admin</span>
              </NavLink>
            )}
          </div>

          <button
            type="button"
            aria-label="Armar partido"
            onClick={() => navigate("/partidos/nuevo")}
            className="absolute left-1/2 top-0 z-10 flex h-13 w-13 -translate-x-1/2 -translate-y-1/4 items-center justify-center rounded-lg border border-[#CCFF00] bg-[#CCFF00] text-[#0B0F19] transition-colors hover:bg-[#E2FF66] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CCFF00] active:bg-[#B8E600]"
          >
            <GoPlus aria-hidden="true" className="h-7 w-7" />
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-evenly">
            <NavLink
              to="/mis-partidos"
              end
              className={({ isActive }) =>
                `${mobileLinkClass({ isActive })} min-w-0 flex-1`
              }
            >
              <GoCalendar aria-hidden="true" className="h-5 w-5" />
              <span>Agenda</span>
            </NavLink>
            <UserMenu placement="mobile" />
          </div>
        </nav>
      )}
    </>
  );
}

export default AppNavigation;
