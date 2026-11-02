import { useState } from "react";
import { m as motion, useReducedMotion } from "framer-motion";
import { GoArrowUpRight, GoClock, GoPerson, GoPin } from "react-icons/go";
import fieldPlaceholder from "../../assets/cancha-placeholder.svg";
import { resolveProfilePhotoUrl } from "../../utils/profilePhoto.js";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function FieldImage({ src }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={!failed && src ? src : fieldPlaceholder}
      alt=""
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

function timeStatus(match) {
  const startsAt = new Date(`${match.date}T${match.startTime}`);
  const delta = startsAt.getTime() - Date.now();
  if (!Number.isFinite(delta) || delta < 0 || delta > 24 * 60 * 60 * 1000) return null;
  const hours = Math.max(1, Math.floor(delta / 3600000));
  return `EN ${hours} ${hours === 1 ? "HORA" : "HORAS"}`;
}

function PlayerSlots({ match, reduceMotion }) {
  const participants = match.participants ?? [];
  const organizer = match.organizerPlays && match.organizerId
    ? [{ userId: match.organizerId, name: match.organizerName, profilePhotoUrl: match.organizerPhotoUrl }]
    : [];
  const joined = [...organizer, ...participants];
  const expected = Math.max(1, Number(match.expectedPlayers) || 10);
  const filled = Math.min(expected, Math.max(0, expected - Number(match.missingPlayers ?? 0)));
  const displayed = Math.min(expected, 10);
  const slots = Array.from({ length: displayed }, (_, index) => ({
    player: joined[index],
    occupied: index < filled,
  }));
  const progress = Math.round((filled / expected) * 100);

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300">Jugadores anotados</span>
        <span className="font-mono font-bold tabular-nums text-white">{filled}<span className="text-slate-500">/{expected}</span></span>
      </div>
      <div className="flex gap-1.5" aria-label={`${filled} de ${expected} jugadores confirmados`}>
        {slots.map(({ player, occupied }, index) => (
          <span
            key={player?.userId ?? `empty-${index}`}
            className={`relative flex h-7 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-full border ${occupied ? "border-[#CCFF00]/40 bg-[#CCFF00]/10" : "border-[#24324A] bg-[#0B0F19]"}`}
            title={player?.name || (occupied ? "Jugador confirmado" : "Cupo disponible")}
          >
            {player?.profilePhotoUrl ? (
              <img src={resolveProfilePhotoUrl(player.profilePhotoUrl)} alt="" loading="lazy" className="h-full w-full object-cover opacity-80" />
            ) : player ? (
              <span className="flex h-full items-center justify-center text-[10px] font-bold text-[#CCFF00]">{player.name?.trim()?.charAt(0)?.toUpperCase() ?? "J"}</span>
            ) : occupied ? (
              <GoPerson aria-hidden="true" className="text-sm text-[#CCFF00]" />
            ) : null}
          </span>
        ))}
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Cupos ocupados" aria-valuemin={0} aria-valuemax={expected} aria-valuenow={filled}>
        <motion.div
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
          className="h-full rounded-full bg-[#CCFF00]"
        />
      </div>
    </div>
  );
}

function MatchCard({ match, onSelect, featured = false }) {
  const reduceMotion = useReducedMotion();
  const remaining = Number(match.missingPlayers ?? 0);
  const urgency = remaining === 1 ? "ÚLTIMO CUPO" : timeStatus(match);
  const filled = Math.max(0, Number(match.expectedPlayers || 0) - remaining);
  const statusLabel = remaining === 0 ? "PARTIDO COMPLETO" : urgency || "PARTIDO ABIERTO";

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.18 }}
      className={`group relative overflow-hidden rounded-lg border bg-[#161F30] transition-colors hover:border-[#CCFF00]/60 ${featured ? "border-[#CCFF00]/60" : "border-[#24324A]"}`}
    >
      <button
        type="button"
        onClick={() => onSelect(match)}
        aria-label={`${match.fieldName}, ${match.date}, ${match.startTime.slice(0, 5)} hs, ${currencyFormatter.format(match.pricePerPlayer)} por jugador, ${filled} de ${match.expectedPlayers} jugadores. Ver partido.`}
        className="absolute inset-0 z-10 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CCFF00]"
      >
        <span className="sr-only">Ver detalles del partido</span>
      </button>

      <div className="relative h-40 overflow-hidden sm:h-44">
        <FieldImage key={match.fieldImageUrl || "field-placeholder"} src={match.fieldImageUrl} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/35 to-transparent" />
        <span className={`absolute left-3 top-3 inline-flex items-center gap-2 rounded border px-2.5 py-1.5 text-[10px] font-black tracking-[0.08em] ${remaining === 1 ? "border-[#00E5FF]/60 bg-[#0B0F19] text-[#7BE8F4]" : "border-[#94A3B8]/50 bg-[#0B0F19] text-[#F1F5F9]"}`}>
          {statusLabel}
        </span>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#E2E8F0]">{new Date(`${match.date}T12:00:00`).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short" })}</p>
            <p className="mt-1 flex items-center gap-1.5 font-display text-xl font-extrabold text-white"><GoClock aria-hidden="true" className="text-[#94A3B8]" />{match.startTime.slice(0, 5)} hs</p>
          </div>
          {urgency && remaining !== 1 && <span className="rounded-md border border-white/10 bg-black/35 px-2 py-1 text-[10px] font-bold tracking-wider text-white">{urgency}</span>}
        </div>
      </div>

      <div className="relative z-0 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-extrabold tracking-wide text-white sm:text-2xl">{match.fieldName}</h2>
            <div className="mt-2 flex min-w-0 items-center gap-2 text-slate-300">
              <GoPin aria-hidden="true" className="h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold leading-4 text-slate-400">
                  Dirección
                </p>
                <p
                  className="truncate text-xs leading-5"
                  title={match.fieldAddress || "Ubicación no especificada"}
                >
                  {match.fieldAddress || "Ubicación no especificada"}
                </p>
              </div>
            </div>
          </div>
          <span className="shrink-0 rounded border border-[#24324A] bg-[#0B0F19] px-2.5 py-1.5 text-right">
            <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-[#CBD5E1]">Entrada</span>
            <span className="mt-0.5 block font-mono text-sm font-bold tabular-nums text-white">{currencyFormatter.format(match.pricePerPlayer)} <span className="font-sans text-[10px] font-medium text-slate-400">/ jugador</span></span>
          </span>
        </div>

        <PlayerSlots match={match} reduceMotion={reduceMotion} />

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="text-xs font-medium text-slate-400">
            {remaining === 0 ? "Todos los cupos ocupados" : `${remaining} ${remaining === 1 ? "lugar disponible" : "lugares disponibles"}`}
          </span>
          <span className="inline-flex min-h-11 items-center gap-2 rounded bg-[#CCFF00] px-3.5 text-[11px] font-black tracking-[0.06em] text-[#0B0F19]">
            {remaining === 0 ? "VER PARTIDO" : "UNIRSE AL PARTIDO"}<GoArrowUpRight aria-hidden="true" className="text-sm" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default MatchCard;
