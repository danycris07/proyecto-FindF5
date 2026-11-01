import { Link, NavLink, useNavigate } from "react-router-dom";
import { GoCalendar, GoPlus, GoSearch } from "react-icons/go";
import UserMenu from "../UserMenu.jsx";

const desktopLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
    isActive
      ? "bg-primary/10 text-primary-text"
      : "text-text-secondary hover:bg-surface-hover-strong hover:text-text-primary"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
    isActive ? "text-primary-text" : "text-text-secondary"
  }`;

function AppNavigation({ showMobile = true }) {
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-40 hidden md:block">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-border bg-surface/80 px-5 shadow-2xl backdrop-blur-md"
        >
          <Link
            to="/partidos"
            aria-label="FindF5 - Convocatorias"
            className="shrink-0 font-display text-lg font-extrabold tracking-tight text-primary-text focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            FindF5
          </Link>

          <div className="flex items-center gap-1">
            <NavLink to="/partidos" end className={desktopLinkClass}>
              Convocatorias
            </NavLink>
            <NavLink to="/mis-partidos" end className={desktopLinkClass}>
              Mis Partidos
            </NavLink>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/partidos/nuevo")}
              className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
            >
              Armar partido
            </button>
            <div className="[&>div]:!static [&>div]:!right-auto [&>div]:!top-auto [&>div]:!z-auto">
              <UserMenu />
            </div>
          </div>
        </nav>
      </header>

      {showMobile && (
        <nav
          aria-label="Navegación móvil"
          className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center border-t border-border bg-surface/90 px-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
        >
          <div className="flex flex-1 justify-center">
            <NavLink to="/partidos" end className={mobileLinkClass}>
              <GoSearch aria-hidden="true" className="h-5 w-5" />
              <span>Buscar</span>
            </NavLink>
          </div>

          <button
            type="button"
            aria-label="Armar partido"
            onClick={() => navigate("/partidos/nuevo")}
            className="absolute left-1/2 top-0 z-10 flex h-13 w-13 -translate-x-1/2 -translate-y-1/4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-95"
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
