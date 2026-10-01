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

import Navbar from "../components/ui/Navbar.jsx";
import Hero from "../components/ui/Hero.jsx";
import ComoFunciona from "../components/ui/ComoFunciona.jsx";
import Canchas from "../components/ui/Canchas.jsx";
import PreguntasFrecuentes from "../components/ui/PreguntasFrecuentes.jsx";
import Footer from "../components/ui/Footer.jsx";


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
        className="pointer-events-none absolute inset-x-0 top-0 bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.10),transparent_70%)]"
      />

      <Navbar btnPrimary={btnPrimary} btnSecondary={btnSecondary} />

      <main className="relative">
        <Hero btnPrimary={btnPrimary} btnSecondary={btnSecondary} />

        <ComoFunciona sectionTitle={sectionTitle} />

        <Canchas sectionTitle={sectionTitle} />

        <PreguntasFrecuentes sectionTitle={sectionTitle} />
      </main>

      <Footer />

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
