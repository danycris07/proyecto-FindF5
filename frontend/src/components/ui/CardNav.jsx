import { useCallback, useEffect, useRef, useState } from "react";
import { m as motion, useReducedMotion } from "framer-motion";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import "./CardNav.css";

/** Navegación expandible adaptada al navbar de FindF5. */
function CardNav({ items }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);
  const isExpandedRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const closeMenu = useCallback(() => {
    if (!isExpandedRef.current) return;
    isExpandedRef.current = false;
    setIsExpanded(false);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) closeMenu();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu]);

  const toggleMenu = () => {
    const nextExpanded = !isExpandedRef.current;
    isExpandedRef.current = nextExpanded;
    setIsExpanded(nextExpanded);
  };

  const handleNavigate = (path) => {
    closeMenu();
    navigate(path);
  };

  return (
    <div ref={containerRef} className="card-nav-container">
      <motion.nav
        initial={false}
        animate={{ height: isExpanded ? "auto" : 60 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }
        className={`card-nav${isExpanded ? " open" : ""}`}
      >
        <div className="card-nav-top">
          <a href="#" className="card-nav-brand" aria-label="FindF5, inicio">FindF5</a>
          <div className="card-nav-controls">
            <button
              type="button"
              className="card-nav-cta-button"
              onClick={() => handleNavigate("/registro")}
            >
              Registrarme
            </button>
            <button
              type="button"
              className="card-nav-login-button"
              onClick={() => handleNavigate("/login")}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={`hamburger-menu${isExpanded ? " open" : ""}`}
              onClick={toggleMenu}
              aria-label={isExpanded ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isExpanded}
              aria-controls="findf5-navigation-content"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
        <motion.div
          id="findf5-navigation-content"
          className="card-nav-content"
          aria-hidden={!isExpanded}
          inert={!isExpanded}
          initial="closed"
          animate={isExpanded ? "open" : "closed"}
          variants={{
            closed: {},
            open: {
              transition: reduceMotion
                ? { staggerChildren: 0 }
                : { delayChildren: 0.12, staggerChildren: 0.07 },
            },
          }}
        >
          {(items || []).slice(0, 3).map((item, index) => (
            <motion.div
              key={`${item.label}-${index}`}
              className="nav-card"
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
              variants={{
                closed: { opacity: 0, y: reduceMotion ? 0 : 24 },
                open: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: reduceMotion ? 0 : 0.35 },
                },
              }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((link, linkIndex) => (
                  <a
                    key={`${link.label}-${linkIndex}`}
                    className="nav-card-link"
                    href={link.href}
                    aria-label={link.ariaLabel}
                    onClick={(event) => {
                      if (link.path) {
                        event.preventDefault();
                        handleNavigate(link.path);
                      } else {
                        closeMenu();
                      }
                    }}
                  >
                    <GoArrowUpRight aria-hidden="true" />
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
          <motion.div
            className="card-nav-mobile-actions"
            variants={{
              closed: { opacity: 0, y: reduceMotion ? 0 : 24 },
              open: {
                opacity: 1,
                y: 0,
                transition: { duration: reduceMotion ? 0 : 0.35 },
              },
            }}
          >
            <button
              type="button"
              className="card-nav-mobile-action card-nav-mobile-action-primary"
              onClick={() => handleNavigate("/registro")}
            >
              Registrarme
            </button>
            <button
              type="button"
              className="card-nav-mobile-action"
              onClick={() => handleNavigate("/login")}
            >
              Iniciar sesión
            </button>
          </motion.div>
        </motion.div>
      </motion.nav>
    </div>
  );
}

export default CardNav;