# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Estructura de la landing

`src/App.jsx` renderiza `src/pages/LandingPage.jsx`, que compone las secciones en este orden: Navbar, Hero, ComoFunciona, Canchas, PreguntasFrecuentes y Footer. La página comparte las clases de botones y títulos para mantener una presentación consistente.

| Componente | Responsabilidad | Props o datos |
| --- | --- | --- |
| `Navbar` | Marca, enlaces internos y acciones de acceso. | `btnPrimary` y `btnSecondary`; sus enlaces apuntan a los ids de las secciones. |
| `Hero` | Propuesta de valor, acciones principales e ilustración de cancha. | `btnPrimary` y `btnSecondary`. |
| `ComoFunciona` | Presenta los pasos principales para usar la app. | `sectionTitle`. |
| `Canchas` | Muestra tarjetas de ejemplo de canchas. | `sectionTitle`. |
| `PreguntasFrecuentes` | Renderiza preguntas y respuestas de demostración. | `sectionTitle` y `src/mocks/preguntasFrecuentes.js`. |
| `Footer` | Cierra la página con la marca y el aviso de derechos. | Sin props. |

Los componentes visuales viven en `src/components/ui/`. Conserva los ids `como-funciona`, `canchas` y `preguntas-frecuentes`: el Navbar los utiliza para navegar dentro de la landing.
