# Rules for AI Agent - Frontend (React + Vite + Tailwind)

## 1. Stack Frontend

- **Base**: React + Vite.
- **Estilos**: Tailwind CSS nativo (clases utilitarias directas, diseño mobile-first).
- **Iconografía**: `lucide-react`.


## 2. Estructura de Carpetas

- Componentes UI reutilizables: `src/components/ui/`
- Vistas / Páginas principales: `src/pages/`
- Lógica de estado y llamadas a API: `src/hooks/`
- Datos de prueba para la demo: `src/mocks/`
- Servicios / Clientes de API: `src/services/`

## 3. Componentes

- Si un componente supera las 150 líneas, modularizarlo o extraer la lógica a un Custom Hook (`use[Nombre].js`).

## 4. Props / Datos

- Validar siempre la existencia de datos antes de renderizar (encadenamiento opcional `data?.property` o valores por defecto) para evitar pantallas en blanco durante la demo.

## 5. Tailwind

- Usar **únicamente** Tailwind CSS nativo en el JSX (evitar CSS genérico o estilos inline).
- Reemplazar estilos arbitrarios (ej. `w-[324px]`) por clases estándar (`w-80`, `w-full`).

## 6. Responsive

- Diseño mobile-first usando los prefijos `sm:`, `md:`, `lg:`.
- Validar que la interfaz sea totalmente responsiva antes de dar cualquier tarea por completada.

## 7. Lucide

- Usar siempre `lucide-react`. Importación nombrada explícita: `import { MapPin, AlertTriangle } from 'lucide-react'`.

## 8. API

- La URL base de la API debe leerse **siempre** desde `import.meta.env.VITE_API_URL`. Nunca hardcodear URLs absolutas (`localhost:5000`) dentro de los componentes.

## 9. Estados Loading / Error / Empty

Todo componente que consuma datos asíncronos debe contemplar visualmente:

1. Estado de carga (_loading / skeleton_).
2. Estado de error (mensaje claro o botón de reintento).
3. Estado vacío (_empty state_ cuando la lista viene con `[]`).

## 10. Mocks

- Los datos hardcodeados deben extraerse hacia archivos de mock centralizados en `src/mocks/`.
- **Fallback automático**: si la API del backend falla o no está desplegada, el servicio debe caer automáticamente a los datos de `src/mocks/` para que la UI nunca se rompa.

## 11. Integración de v0 (v0.dev → Proyecto)

Al procesar código copiado de v0.dev, en este orden:

1. Eliminar dependencias/componentes raros no instalados (ej. `@radix-ui/*`, `shadcn/ui`) si no están en `package.json`.
2. Extraer los datos hardcodeados hacia `src/mocks/`.
3. Separar la lógica de estado o peticiones en Custom Hooks si el componente supera las 150 líneas (ver sección 3).
4. Reemplazar estilos arbitrarios por clases estándar de Tailwind (ver sección 5).
5. Validar que la interfaz sea totalmente responsiva antes de dar la tarea por completada.

> Nota: las reglas de comportamiento de la IA (qué no inventar, cuándo preguntar, no modificar cosas innecesarias, herramientas obligatorias, memoria, Trello) viven en `agente.md`, para no duplicarlas acá.

<!-- rtk-instructions v2 -->

# Command output

Command output here is condensed to save tokens, keeping every signal and
dropping costly noise. Treat it as the complete result: run commands
normally, and batch related commands into one call to avoid extra turns.
Truncated results state their recovery path in their own output. Re-run a
command as `rtk proxy <cmd>` only when its result is unusable: empty when
output was clearly expected, contradicting its exit code, or garbled.

<!-- /rtk-instructions -->
