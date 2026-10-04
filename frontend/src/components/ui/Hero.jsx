/**
 * Presenta la propuesta de valor, sus acciones y una ilustración de cancha.
 * @param {{ btnPrimary: string, btnSecondary: string }} props Clases compartidas de botones.
 */
import { Link } from "react-router-dom";
import portada from "../../assets/portada.jpeg";

function Hero({ btnPrimary, btnSecondary }) {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:py-20 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-10 lg:px-8 lg:py-24">
      <div className="relative z-10 space-y-7 md:py-8">
        <h1 className="max-w-3xl font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-wider text-text-primary sm:text-6xl lg:text-7xl">
          ¿Te falta gente para el F5?
        </h1>
        <p className="max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
          Encontrá canchas, sumate a partidos y conectá con personas que también
          quieren jugar.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/registro" className={btnPrimary}>
            Registrarme
          </Link>
          <Link to="/login" className={btnSecondary}>
            Iniciar Sesion
          </Link>
        </div>
      </div>

      <div className="hero-image-shade group relative aspect-[1.12] overflow-hidden rounded-sm border border-border bg-background shadow-2xl shadow-[var(--shadow-color)] before:absolute before:inset-0 before:z-10 before:content-['']">
        {/*
          PARA USAR TU IMAGEN: borrá el <svg> de abajo y poné:
          <img src="/tu-imagen.jpg" alt="Descripción de la imagen" className="h-full w-full object-cover" />
        */}
        <img
          src={portada}
          alt="Cancha de fútbol 5"
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="hero-image-glint pointer-events-none absolute inset-0 z-10"
        />
      </div>
    </section>
  );
}

export default Hero;
