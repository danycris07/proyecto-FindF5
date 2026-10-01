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
  "inline-flex min-h-11 items-center justify-center rounded-sm px-4 py-2.5 text-sm font-bold transition-[background-color,border-color,color,transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none md:px-5";
const btnPrimary = `${btnBase} bg-primary text-background shadow-[0_8px_30px_rgba(204,255,0,0.14)] hover:-translate-y-0.5 hover:bg-[#d9ff42] hover:shadow-[0_12px_34px_rgba(204,255,0,0.22)] active:translate-y-0 focus-visible:outline-primary`;
const btnSecondary = `${btnBase} border border-white/15 bg-white/[0.02] text-text-primary hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.06] active:translate-y-0 focus-visible:outline-text-primary`;

const sectionTitle =
  "flex items-center gap-4 font-display text-3xl font-extrabold uppercase leading-none before:h-1 before:w-9 before:shrink-0 before:bg-primary before:content-[''] md:text-4xl";

/**
 * Ensambla las secciones del landing en orden y comparte estilos entre ellas.
 */
function LandingPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background font-sans text-text-primary">
      {/* Luz de reflector: degradado radial sutil arriba de todo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.08),transparent_70%)]"
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
        className="fixed bottom-5 right-5 h-12 w-12 rounded-full border border-primary/25 bg-surface/80 shadow-[0_0_28px_rgba(204,255,0,0.08)] backdrop-blur transition-colors duration-200 hover:border-primary/60 motion-reduce:transition-none"
      />
    </div>
  );
}

export default LandingPage;
