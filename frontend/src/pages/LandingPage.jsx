import Navbar from "../components/ui/Navbar.jsx";
import Hero from "../components/ui/Hero.jsx";
import ComoFunciona from "../components/ui/ComoFunciona.jsx";
import Canchas from "../components/ui/Canchas.jsx";
import PreguntasFrecuentes from "../components/ui/PreguntasFrecuentes.jsx";
import Footer from "../components/ui/Footer.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { useInitialLoading } from "../hooks/useInitialLoading.js";

// Estilos compartidos (cuando armes componentes, estos pasan a <Button />)
const btnBase =
  "inline-flex min-h-11 items-center justify-center rounded-sm px-4 py-2.5 text-sm font-semibold transition-[background-color,border-color,color,transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none md:px-5";
const btnPrimary = `${btnBase} border border-primary-foreground bg-primary text-primary-foreground shadow-[0_8px_30px_var(--primary-shadow)] hover:-translate-y-0.5 hover:shadow-[0_12px_34px_var(--primary-shadow-strong)] active:translate-y-0`;
const btnSecondary = `${btnBase} border border-border bg-surface text-text-primary hover:-translate-y-0.5 hover:border-status active:translate-y-0`;

const sectionTitle =
  "flex items-center gap-4 font-display text-3xl font-extrabold uppercase leading-none tracking-wider before:h-1 before:w-9 before:shrink-0 before:bg-border before:content-[''] md:text-4xl";

/**
 * Ensambla las secciones del landing en orden y comparte estilos entre ellas.
 */
function LandingPage({ isLoading: loadingProp }) {
  const initialLoading = useInitialLoading();
  const isLoading = loadingProp ?? initialLoading;

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background font-sans text-text-primary">
      {/* Luz de reflector: degradado radial sutil arriba de todo */}
      <div
        aria-hidden="true"
        className="landing-glow pointer-events-none absolute inset-x-0 top-0 h-152"
      />

      <Navbar />

      <main className="relative">
        <Hero btnPrimary={btnPrimary} btnSecondary={btnSecondary} />

        <ComoFunciona sectionTitle={sectionTitle} isLoading={isLoading} />

        <Canchas sectionTitle={sectionTitle} isLoading={isLoading} />

        <PreguntasFrecuentes
          sectionTitle={sectionTitle}
          isLoading={isLoading}
        />
      </main>

      <Footer />
      <ThemeToggle />
    </div>
  );
}

export default LandingPage;
