import { useMemo, useState } from "react";

export const FILTROS_INICIALES = {
  dia: "",
  horario: "",
  precioMin: "",
  precioMax: "",
  cupos: "",
  incluirLlenas: true,
  cancha: "",
  coca: false,
};

function fechaLocal(offsetDias) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDias);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function precioInvalido({ precioMin, precioMax }) {
  return (
    precioMin !== "" && precioMax !== "" && Number(precioMin) > Number(precioMax)
  );
}

export function contarFiltrosActivos(filtros) {
  const hayPrecio = filtros.precioMin !== "" || filtros.precioMax !== "";
  return [
    filtros.dia !== "",
    filtros.horario !== "",
    hayPrecio,
    filtros.cupos !== "",
    !filtros.incluirLlenas,
    filtros.cancha !== "",
    filtros.coca,
  ].filter(Boolean).length;
}

function cumpleHorario(startTime, horario) {
  const hora = Number(startTime?.slice(0, 2));
  if (horario === "tarde") return hora >= 12 && hora < 20;
  if (horario === "noche") return hora >= 20;
  return true;
}

function cumpleCupos(faltan, filtros) {
  if (faltan === 0) return filtros.incluirLlenas && filtros.cupos === "";
  if (filtros.cupos === "1") return faltan === 1;
  if (filtros.cupos === "2+") return faltan >= 2;
  return true;
}

export function filtrarPartidos(partidos, filtros) {
  const dias = { hoy: fechaLocal(0), manana: fechaLocal(1) };
  const usarPrecio = !precioInvalido(filtros);

  return partidos.filter((p) => {
    if (filtros.dia && p.date !== dias[filtros.dia]) return false;
    if (!cumpleHorario(p.startTime, filtros.horario)) return false;
    if (usarPrecio) {
      if (filtros.precioMin !== "" && p.pricePerPlayer < Number(filtros.precioMin))
        return false;
      if (filtros.precioMax !== "" && p.pricePerPlayer > Number(filtros.precioMax))
        return false;
    }
    if (!cumpleCupos(p.missingPlayers, filtros)) return false;
    if (filtros.cancha && p.fieldName !== filtros.cancha) return false;
    if (filtros.coca && !p.playingForCoca) return false;
    return true;
  });
}

export function useMatchFilters(partidos) {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const setFiltro = (campo, valor) =>
    setFiltros((actual) => ({ ...actual, [campo]: valor }));
  const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);

  const visibles = useMemo(
    () => filtrarPartidos(partidos, filtros),
    [partidos, filtros],
  );

  return {
    filtros,
    setFiltro,
    limpiarFiltros,
    visibles,
    activos: contarFiltrosActivos(filtros),
    precioInvalido: precioInvalido(filtros),
  };
}
