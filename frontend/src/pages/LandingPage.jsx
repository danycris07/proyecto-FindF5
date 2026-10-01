/**
 * LandingPage.jsx — Esqueleto de la landing de FindF5 (mobile-first, Tailwind v4)
 *
 * Sin lógica, sin íconos y sin animaciones: solo estructura y estilos.
 * Pensado para que lo subdividas en componentes (Navbar, Hero, ComoFunciona,
 * Canchas, PreguntasFrecuentes, Footer).
 *
 * ─── SETUP 1: paleta y fuentes en src/index.css ────────────────────────────
 *
 *   @import "tailwindcss";
 *
 *   @theme {
 *     --color-background: #0B0F19;
 *     --color-surface: #161F30;
 *     --color-border: #24324A;
 *     --color-primary: #CCFF00;
 *     --color-status: #00E5FF;
 *     --color-text-primary: #F1F5F9;
 *     --color-text-secondary: #94A3B8;
 *     --font-display: "Barlow Semi Condensed", sans-serif;
 *     --font-sans: "Inter", sans-serif;
 *   }
 *
 *   html { scroll-behavior: smooth; }
 *
 * ─── SETUP 2: fuentes en el <head> de index.html ───────────────────────────
 *
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 *   <link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
 *
 * Nota: por los nombres del CONTEXT.md, las clases de texto quedan como
 * `text-text-primary` y `text-text-secondary` (color "text-primary" + prefijo "text-").
 */

import Navbar from "../components/ui/Navbar";

// Estilos compartidos (cuando armes componentes, estos pasan a <Button />)
const btnBase =
  "inline-flex items-center justify-center rounded px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:px-4 md:py-2.5";
const btnPrimary = `${btnBase} bg-primary text-background hover:bg-primary/90 focus-visible:outline-primary`;
const btnSecondary = `${btnBase} border border-border text-text-primary hover:bg-surface focus-visible:outline-text-primary`;

const sectionTitle =
  "font-display text-2xl font-extrabold uppercase tracking-wider md:text-3xl";

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans text-text-primary">
      {/* Luz de reflector: degradado radial sutil arriba de todo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.10),transparent_70%)]"
      />

      <Navbar btnPrimary={btnPrimary} btnSecondary={btnSecondary} />

      <main className="relative">
        {/* ───────────── HERO / PROPUESTA DE VALOR ───────────── */}
        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center md:gap-12 md:py-20">
          <div className="space-y-5">
            <h1 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-wider md:text-5xl">
              Título de la propuesta de valor
            </h1>
            <p className="max-w-prose text-base text-text-secondary md:text-lg">
              Descripción de la propuesta de valor. Acá va una o dos frases que
              expliquen qué es la app y para quién sirve.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#" className={btnPrimary}>
                Registrarme
              </a>
              <a href="#" className={btnSecondary}>
                Iniciar sesión
              </a>
            </div>
          </div>

          {/* Espacio de imagen: el SVG es un ejemplo genérico (cancha vista desde arriba) */}
          <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface">
            {/*
              PARA USAR TU IMAGEN: borrá el <svg> de abajo y poné:
              <img src="/tu-imagen.jpg" alt="Descripción de la imagen" className="h-full w-full object-cover" />
            */}
            <svg
              viewBox="0 0 400 300"
              role="img"
              aria-label="Imagen de ejemplo: cancha de fútbol 5 vista desde arriba"
              className="h-full w-full fill-none stroke-text-secondary/40"
              strokeWidth="3"
            >
              <rect x="20" y="20" width="360" height="260" rx="4" />
              <line x1="200" y1="20" x2="200" y2="280" />
              <circle cx="200" cy="150" r="42" />
              <rect x="20" y="95" width="55" height="110" />
              <rect x="325" y="95" width="55" height="110" />
            </svg>
          </div>
        </section>

        {/* ───────────── CÓMO FUNCIONA ───────────── */}
        <section id="como-funciona" className="scroll-mt-6 border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <h2 className={sectionTitle}>Cómo funciona</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((paso) => (
                <div
                  key={paso}
                  className="rounded-lg border border-border bg-surface p-5"
                >
                  <p className="font-display text-lg font-bold uppercase tracking-wider text-text-secondary">
                    Paso {paso}
                  </p>
                  <h3 className="mt-2 font-semibold">Título del paso</h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    Descripción del paso.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── CANCHAS ───────────── */}
        <section id="canchas" className="scroll-mt-6 border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <h2 className={sectionTitle}>Canchas</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((cancha) => (
                <div
                  key={cancha}
                  className="overflow-hidden rounded-lg border border-border bg-surface"
                >
                  <div className="aspect-video bg-background" />
                  <div className="p-4">
                    <h3 className="font-semibold">Nombre de la cancha</h3>
                    <p className="mt-1 text-sm text-text-secondary tabular-nums">
                      Zona · Horarios · Precio
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── PREGUNTAS FRECUENTES ───────────── */}
        <section
          id="preguntas-frecuentes"
          className="scroll-mt-6 border-t border-border"
        >
          <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
            <h2 className={sectionTitle}>Preguntas frecuentes</h2>
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((pregunta) => (
                <div
                  key={pregunta}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <h3 className="font-semibold">Pregunta frecuente {pregunta}</h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    Respuesta de la pregunta.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="relative border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-text-secondary sm:flex-row sm:justify-between">
          <p className="font-display font-bold uppercase tracking-wider text-text-primary">
            FindF5
          </p>
          <p className="tabular-nums">© 2026 FindF5. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Círculo del wireframe (esquina inferior derecha): botón flotante sin definir */}
      <button
        type="button"
        aria-label="Botón flotante (por definir)"
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full border border-border bg-surface"
      />
    </div>
  );
}

export default LandingPage;
