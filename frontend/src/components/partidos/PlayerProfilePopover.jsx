import { useEffect, useId, useRef, useState } from "react";
import { getUserProfile } from "../../services/userProfileService.js";
import { createMatchWhatsAppUrl } from "../../utils/argentinaWhatsApp.js";
import { resolveProfilePhotoUrl } from "../../utils/profilePhoto.js";

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toLocaleUpperCase();
}

function PlayerAvatar({ name, photoUrl, size = "h-9 w-9" }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-background text-xs font-bold text-text-secondary`}
    >
      {photoUrl && !imageFailed ? (
        <img
          src={resolveProfilePhotoUrl(photoUrl)}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initials(name || "Jugador")
      )}
    </span>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className="text-right text-sm font-semibold text-text-primary">{value}</dd>
    </div>
  );
}

function PlayerProfilePopover({
  userId,
  name,
  photoUrl,
  matchName,
  isCurrentUser = false,
  badge = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ left: 16, top: 16 });
  const [state, setState] = useState({ status: "idle", profile: null, error: "" });
  const rootRef = useRef(null);
  const contentId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    let active = true;
    getUserProfile(userId)
      .then((profile) => {
        if (active) setState({ status: "loaded", profile, error: "" });
      })
      .catch((error) => {
        if (active) {
          setState({
            status: "error",
            profile: null,
            error: error instanceof Error ? error.message : "No se pudo cargar el perfil.",
          });
        }
      });

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      active = false;
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, userId]);

  const profile = state.profile;
  const whatsappUrl = profile?.phone
    ? createMatchWhatsAppUrl(profile.phone, matchName)
    : null;
  useEffect(() => {
    if (!isOpen) return undefined;
    const reposition = () => {
      const button = rootRef.current?.querySelector("button");
      if (!button) return;
      const anchor = button.getBoundingClientRect();
      const root = rootRef.current?.getBoundingClientRect() ?? anchor;
      const width = Math.min(288, window.innerWidth - 32);
      const estimatedHeight = Math.min(300, window.innerHeight - 32);
      const top = anchor.bottom + estimatedHeight + 8 <= window.innerHeight - 16
        ? anchor.bottom + 8
        : Math.max(16, anchor.top - estimatedHeight - 8);
      setPopoverPosition({
        left: Math.max(16, Math.min(anchor.left, window.innerWidth - width - 16)) - root.left,
        top: top - root.top,
      });
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [isOpen]);

  const togglePopover = (event) => {
    const opening = !isOpen;
    const anchor = event.currentTarget.getBoundingClientRect();
    const root = rootRef.current?.getBoundingClientRect() ?? anchor;
    const width = Math.min(288, window.innerWidth - 32);
    const estimatedHeight = Math.min(260, window.innerHeight - 32);
    const top = anchor.bottom + estimatedHeight + 8 <= window.innerHeight - 16
      ? anchor.bottom + 8
      : Math.max(16, anchor.top - estimatedHeight - 8);
    setPopoverPosition({
      left: Math.max(16, Math.min(anchor.left, window.innerWidth - width - 16)) - root.left,
      top: top - root.top,
    });
    if (opening) setState({ status: "loading", profile: null, error: "" });
    setIsOpen(opening);
  };

  return (
    <li ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={togglePopover}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm px-1.5 py-1 text-left text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover-strong hover:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status"
      >
        <PlayerAvatar name={name} photoUrl={photoUrl} />
        <span>{name}{isCurrentUser ? " (vos)" : ""}</span>
        {badge && (
          <span className="ml-1 text-xs font-semibold text-status">{badge}</span>
        )}
      </button>

      <section
        id={contentId}
        hidden={!isOpen}
        aria-label={`Perfil de ${name}`}
        style={popoverPosition}
        className="absolute z-30 max-h-[calc(100dvh-2rem)] w-[min(19rem,calc(100vw-2rem))] overflow-y-auto rounded-md border border-border bg-surface p-0 text-text-primary shadow-lg shadow-black/15"
      >
          <header className="flex items-center gap-3 border-b border-border/70 px-4 py-4 sm:px-5">
            <PlayerAvatar
              name={profile?.name ?? name}
              photoUrl={profile?.profilePhotoUrl ?? photoUrl}
              size="h-16 w-16 ring-2 ring-border"
            />
            <div className="min-w-0">
              <h3 className="break-words text-lg font-semibold leading-snug">
                {profile?.name ?? name}
              </h3>
              {profile?.profileType && (
                <p className="mt-1 text-sm text-text-secondary">{profile.profileType}</p>
              )}
              {badge && <p className="mt-1 text-sm font-medium text-primary-text">{badge}</p>}
            </div>
          </header>

          {state.status === "loading" && (
            <p role="status" className="px-4 py-5 text-sm text-text-secondary sm:px-5">
              Cargando perfil…
            </p>
          )}
          {state.status === "error" && (
            <p role="alert" className="px-4 py-4 text-sm text-danger sm:px-5">{state.error}</p>
          )}
          {state.status === "loaded" && profile && (
            <div className="px-4 py-4 sm:px-5">
              <h4 className="mb-1 text-sm font-semibold text-text-primary">Información del jugador</h4>
              <dl className="divide-y divide-border/70 border-y border-border/70">
                {profile.dominantFoot && (
                  <ProfileRow
                    label="Pierna hábil"
                    value={profile.dominantFoot === "RIGHT" ? "Derecha" : "Izquierda"}
                  />
                )}
                <ProfileRow label="Reputación" value={profile.reputation?.label ?? "Nuevo"} />
                {profile.address && (
                  <ProfileRow label="Zona" value={profile.address} />
                )}
              </dl>

              <h4 className="mb-2 mt-4 text-sm font-semibold text-text-primary">Contacto</h4>
              {!isCurrentUser && whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status"
                >
                  Contactar por WhatsApp
                </a>
              ) : (
                <p className="rounded-sm border border-border/70 bg-background px-3 py-2.5 text-sm leading-5 text-text-secondary">
                  {isCurrentUser
                    ? "Este es tu perfil."
                    : profile.phoneAvailable
                      ? "No se pudo preparar el enlace de WhatsApp."
                      : "Teléfono privado"}
                </p>
              )}
            </div>
          )}
      </section>
    </li>
  );
}

export default PlayerProfilePopover;
