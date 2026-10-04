import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import "./CardNav.css";

/** Navegación expandible adaptada al navbar de FindF5. */
function CardNav({ items, ease = "power3.out" }) {
  const navigate = useNavigate();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingPath, setLoadingPath] = useState(null);
  const navRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);
  const navigationTimeoutRef = useRef(null);
  const isExpandedRef = useRef(false);

  const calculateHeight = () => {
    const navElement = navRef.current;
    if (!navElement) return 260;
    if (window.matchMedia("(max-width: 768px)").matches) {
      const content = navElement.querySelector(".card-nav-content");
      if (content) {
        const previousStyles = {
          visibility: content.style.visibility,
          pointerEvents: content.style.pointerEvents,
          position: content.style.position,
          height: content.style.height,
        };
        content.style.visibility = "visible";
        content.style.pointerEvents = "auto";
        content.style.position = "static";
        content.style.height = "auto";
        const contentHeight = content.scrollHeight;
        Object.assign(content.style, previousStyles);
        return 60 + contentHeight + 16;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    if (!navRef.current) return null;
    gsap.set(navRef.current, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 24, opacity: 0 });
    return gsap.timeline({ paused: true })
      .to(navRef.current, { height: calculateHeight, duration: 0.4, ease })
      .to(cardsRef.current, { y: 0, opacity: 1, duration: 0.35, ease, stagger: 0.07 }, "-=0.1");
  };

  useLayoutEffect(() => {
    const timeline = createTimeline();
    timelineRef.current = timeline;
    return () => {
      timeline?.kill();
      if (navigationTimeoutRef.current) window.clearTimeout(navigationTimeoutRef.current);
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!timelineRef.current) return;
      timelineRef.current.kill();
      const timeline = createTimeline();
      timelineRef.current = timeline;
      if (isExpandedRef.current) timeline?.progress(1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  function closeMenu() {
    if (!isExpandedRef.current) return;
    setIsHamburgerOpen(false);
    const timeline = timelineRef.current;
    timeline?.eventCallback("onReverseComplete", () => {
      isExpandedRef.current = false;
      setIsExpanded(false);
    });
    timeline?.reverse();
  }

  const toggleMenu = () => {
    if (isExpandedRef.current) {
      closeMenu();
      return;
    }
    isExpandedRef.current = true;
    setIsExpanded(true);
    setIsHamburgerOpen(true);
    timelineRef.current?.play(0);
  };

  const handleNavigate = (path) => {
    if (loadingPath || navigationTimeoutRef.current) return;
    setLoadingPath(path);
    closeMenu();
    navigationTimeoutRef.current = window.setTimeout(() => {
      navigate(path);
      setLoadingPath(null);
      navigationTimeoutRef.current = null;
    }, 800);
  };

  return (
    <div ref={containerRef} className="card-nav-container">
      <nav ref={navRef} className={`card-nav${isExpanded ? " open" : ""}`}>
        <div className="card-nav-top">
          <a href="#" className="card-nav-brand" aria-label="FindF5, inicio">FindF5</a>
          <div className="card-nav-controls">
            <button
              type="button"
              className="card-nav-cta-button"
              onClick={() => handleNavigate("/registro")}
              disabled={loadingPath !== null}
            >
              {loadingPath === "/registro" ? "Cargando..." : "Registrarme"}
            </button>
            <button
              type="button"
              className="card-nav-login-button"
              onClick={() => handleNavigate("/login")}
              disabled={loadingPath !== null}
            >
              {loadingPath === "/login" ? "Cargando..." : "Iniciar Sesion"}
            </button>
            <button
              type="button"
              className={`hamburger-menu${isHamburgerOpen ? " open" : ""}`}
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
        <div id="findf5-navigation-content" className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="nav-card"
              ref={(element) => { if (element) cardsRef.current[index] = element; }}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
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
            </div>
          ))}
          <div
            className="card-nav-mobile-actions"
            ref={(element) => { if (element) cardsRef.current[3] = element; }}
          >
            <button
              type="button"
              className="card-nav-mobile-action card-nav-mobile-action-primary"
              onClick={() => handleNavigate("/registro")}
              disabled={loadingPath !== null}
            >
              {loadingPath === "/registro" ? "Cargando..." : "Registrarme"}
            </button>
            <button
              type="button"
              className="card-nav-mobile-action"
              onClick={() => handleNavigate("/login")}
              disabled={loadingPath !== null}
            >
              {loadingPath === "/login" ? "Cargando..." : "Iniciar Sesion"}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default CardNav;
