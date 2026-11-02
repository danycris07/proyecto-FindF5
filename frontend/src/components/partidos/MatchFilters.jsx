import { useId, useState } from "react";
import { GoChevronDown, GoX } from "react-icons/go";
import { Chip, Grupo, Opciones } from "./FilterControls.jsx";

const CAMPO =
  "min-h-11 w-full rounded border border-[#24324A] bg-[#0B0F19] px-3 text-sm tabular-nums text-white placeholder:text-slate-300 focus:border-[#CCFF00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CCFF00]";

const DIAS = [
  ["", "Cualquier día"],
  ["hoy", "Hoy"],
  ["manana", "Mañana"],
];
const HORARIOS = [
  ["", "Cualquiera"],
  ["tarde", "Tarde (12 a 20 hs)"],
  ["noche", "Noche (desde las 20 hs)"],
];
const CUPOS = [
  ["", "Cualquiera"],
  ["1", "Falta 1"],
  ["2+", "Faltan 2 o más"],
];

function MatchFilters({
  filtros,
  onChange,
  onClear,
  activos,
  canchas,
  precioInvalido,
  disabled,
  compact = false,
}) {
  const [abierto, setAbierto] = useState(false);
  const panelId = useId();
  const opcionesCancha =
    filtros.cancha && !canchas.includes(filtros.cancha)
      ? [...canchas, filtros.cancha]
      : canchas;

  return (
    <section aria-label="Filtros de partidos" className={compact ? "mb-0" : "mb-6"}>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={disabled}
          aria-expanded={abierto}
          aria-controls={abierto ? panelId : undefined}
          onClick={() => setAbierto((v) => !v)}
          className={`inline-flex min-h-11 items-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${
            activos > 0
              ? "border-[#CCFF00] bg-[#CCFF00] text-[#0B0F19]"
              : "border-[#24324A] bg-[#0B0F19] text-slate-100 hover:border-[#94A3B8]"
          }`}
        >
          Filtrar partidos
          {activos > 0 && (
              <span className="rounded-sm bg-[#0B0F19] px-1.5 text-xs tabular-nums text-current">
              {activos}
              <span className="sr-only">
                {activos === 1 ? " filtro activo" : " filtros activos"}
              </span>
            </span>
          )}
          <GoChevronDown
            aria-hidden="true"
            className={`transition-transform motion-reduce:transition-none ${abierto ? "rotate-180" : ""}`}
          />
        </button>
        {activos > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm px-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
          >
            <GoX aria-hidden="true" />
            Limpiar filtros
          </button>
        )}
      </div>

      {abierto && (
        <div
          id={panelId}
          className="mt-3 grid gap-5 rounded-lg border border-[#24324A] bg-[#161F30] p-4 text-white sm:grid-cols-2 lg:grid-cols-3"
        >
          <Grupo titulo="Día">
            <Opciones
              name="dia"
              opciones={DIAS}
              valor={filtros.dia}
              onChange={(v) => onChange("dia", v)}
            />
          </Grupo>
          <Grupo titulo="Horario">
            <Opciones
              name="horario"
              opciones={HORARIOS}
              valor={filtros.horario}
              onChange={(v) => onChange("horario", v)}
            />
          </Grupo>
          <Grupo titulo="Cupos">
            <Opciones
              name="cupos"
              opciones={CUPOS}
              valor={filtros.cupos}
              onChange={(v) => onChange("cupos", v)}
            />
            <Chip
              tipo="checkbox"
              name="incluirLlenas"
              checked={filtros.incluirLlenas}
              onChange={(e) => onChange("incluirLlenas", e.target.checked)}
            >
              Incluir cancha llena
            </Chip>
          </Grupo>
          <Grupo titulo="Precio por jugador (ARS)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min="0"
                aria-label="Precio mínimo"
                placeholder="Mín."
                value={filtros.precioMin}
                onChange={(e) => onChange("precioMin", e.target.value)}
                className={CAMPO}
              />
              <input
                type="number"
                inputMode="numeric"
                min="0"
                aria-label="Precio máximo"
                placeholder="Máx."
                value={filtros.precioMax}
                onChange={(e) => onChange("precioMax", e.target.value)}
                className={CAMPO}
              />
            </div>
            {precioInvalido && (
              <p role="alert" className="text-xs text-rose-300">
                El mínimo no puede superar al máximo.
              </p>
            )}
          </Grupo>
          <Grupo titulo="Cancha">
            <select
              aria-label="Cancha"
              value={filtros.cancha}
              onChange={(e) => onChange("cancha", e.target.value)}
              className={CAMPO}
            >
              <option value="">Todas las canchas</option>
              {opcionesCancha.map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          </Grupo>
          <Grupo titulo="Premio">
            <Chip
              tipo="checkbox"
              name="coca"
              checked={filtros.coca}
              onChange={(e) => onChange("coca", e.target.checked)}
            >
              Jugar por la coca
            </Chip>
          </Grupo>
        </div>
      )}
    </section>
  );
}

export default MatchFilters;
