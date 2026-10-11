import historiasUsuarios from "../../mocks/UsersHistoryData";
import Skeleton from "./Skeleton";

/**
 * Renderiza las historias de usuarios desde el mock del frontend.
 * @param {{ sectionTitle: string }} props Clase compartida para el título de sección.
 */
function UserHistory({ sectionTitle, isLoading = false }) {
  return (
    <section
      id="HistoriasUsuarios"
      className="scroll-mt-24 border-t border-border/70 bg-surface/20"
      aria-busy={isLoading}
    >
      <div className="mx-auto max-w-4xl px-5 py-20 sm:py-24 lg:px-8">
        <h2 className={sectionTitle}>Historias de usuarios</h2>
        <div className="mt-9">
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="space-y-4 border-b border-border py-6 first:border-t sm:py-7"
                >
                  <Skeleton className="h-5 w-3/4" />
                  <div className="space-y-2 pl-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))
            : historiasUsuarios.map((historia) => (
                <div
                  key={historia.id}
                  className="border-b border-border py-6 first:border-t sm:py-10 "
                >
                  <div className="relative mb-5 h-25 w-25 rounded-4xl bg-background sm:h-25 sm:w-25">
                    <img
                      src={historia.imagen}
                      className="absolute h-25 w-25 object-cover rounded-4xl"
                    />
                  </div>
                  <h3 className="flex items-start gap-4 text-base font-semibold text-text-primary before:mt-1.5 before:h-2.5 before:w-2.5 before:shrink-0 before:rotate-45 before:bg-border before:content-[''] sm:text-lg">
                    {historia.titulo}
                  </h3>
                  <p className="mt-3 pl-6 text-sm leading-7 text-text-secondary sm:text-base">
                    {historia.respuesta}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default UserHistory;
