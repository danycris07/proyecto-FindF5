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

## Conexión con el backend

Copiá `.env.example` como `.env.local`, iniciá el backend en el puerto indicado
por `API_PROXY_TARGET` y luego iniciá el frontend con `npm run dev`. En
desarrollo, `VITE_API_URL=/api` hace que Vite reenvíe las llamadas al backend.
Esto mantiene la sesión en el mismo origen, también al compartir el puerto de
Vite con un celular, y evita que el navegador bloquee la cookie de autenticación
por diferencias entre el dominio compartido y la IP local.

Para un despliegue, configurá `VITE_API_URL` con la URL base de la API,
incluyendo `/api`.

El inicio y cierre de sesión, registro y las escrituras de partidos usan el
backend y muestran sus errores. Las consultas de partidos y canchas usan los
mocks como fallback cuando el servidor no está disponible; ese fallback no
guarda ni simula cambios.

Las cuentas con rol administrador acceden a `/admin` desde el menú de usuario
para gestionar usuarios, canchas y partidos. El panel usa exclusivamente los
endpoints administrativos y no sustituye sus errores por datos de prueba.
Las tarjetas de partidos muestran la imagen configurada en la cancha asociada;
si no hay una imagen disponible, usan una ilustración local de respaldo.
En el formulario administrativo de canchas, el botón de mapa abre un selector
OpenStreetMap para marcar o arrastrar el pin; las coordenadas y la dirección se
completan automáticamente y siguen siendo editables. El mapa requiere conexión
a internet.

Los formularios públicos validan datos de registro e inicio de sesión. Para
publicar o editar partidos se exigen cuotas enteras positivas y un total de
entre 5 y 24 jugadores; una nueva convocatoria debe conservar al menos un cupo
abierto.

Las interacciones visuales usan Framer Motion: las tarjetas iluminan el área
bajo el puntero y aparecen escalonadas, el último cupo late en cian, la ficha
del usuario se inclina con brillo y los botones muestran una onda al activarse.
Las cargas de recursos conservan el skeleton visible por al menos 400 ms sin
retrasar las solicitudes. Las animaciones respetan la preferencia del sistema
para reducir movimiento.
