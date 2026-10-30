import { useState } from "react";
import historiasUsuarios from "../../mocks/UsersHistoryData";
import Skeleton from "./Skeleton";

/**
 * Foto del usuario. Si la imagen no carga (las del mock vienen de internet),
 * muestra la inicial en un recuadro para que la tarjeta no quede rota.
 * El alt va vacío a propósito: el nombre aparece escrito al lado.
 */
function Avatar({ nombre, imagen }) {
  const [fallo, setFallo] = useState(false);
  const base = "h-16 w-16 shrink-0 rounded-sm border border-border";

  if (!imagen || fallo) {
    return (
      <div
        aria-hidden="true"
        className={`${base} flex items-center justify-center bg-background font-display text-2xl font-extrabold uppercase text-text-secondary`}
      >
        {nombre.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={imagen}
      alt=""
      width="64"
      height="64"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFallo(true)}
      className={`${base} bg-background object-cover`}
    />
  );
}

/**
 * Renderiza las historias de usuarios desde el mock del frontend.
 * @param {{ sectionTitle: string }} props Clase compartida para el título de sección.
 */
function UserHistory({ sectionTitle, isLoading = false }) {
  return (
    <section
      id="historias-de-usuarios"
      className="scroll-mt-24 border-t border-border/70 bg-surface/20"
      aria-busy={isLoading}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        <h2 className={sectionTitle}>Historias de usuarios</h2>
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="rounded-sm border border-border bg-surface p-6 sm:p-8"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 shrink-0" />
                    <div className="w-full space-y-3">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))
            : historiasUsuarios.map((historia) => (
                <article
                  key={historia.id}
                  className="flex h-full flex-col rounded-sm border border-border bg-surface p-6 sm:p-8"
                >
                  <header className="flex items-center gap-4">
                    <Avatar nombre={historia.nombre} imagen={historia.imagen} />
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-extrabold uppercase leading-none tracking-wider text-text-primary">
                        {historia.nombre}
                      </h3>
                      <p className="mt-2 inline-flex rounded-sm border border-status/40 bg-status/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-status">
                        {historia.rol}
                      </p>
                    </div>
                  </header>
                  <p className="mt-5 border-l-2 border-border pl-4 text-sm leading-7 text-text-secondary sm:text-base">
                    {historia.respuesta}
                  </p>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}

export default UserHistory;
