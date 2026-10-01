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
import Hero from "../components/ui/Hero";
import ComoFunciona from "../components/ui/ComoFunciona";
import PreguntasFrecuentes from "../components/ui/PreguntasFrecuentes";

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
        <Hero btnPrimary={btnPrimary} btnSecondary={btnSecondary} />

        <ComoFunciona sectionTitle={sectionTitle} />

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

        <PreguntasFrecuentes sectionTitle={sectionTitle} />
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
