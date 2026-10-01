# ⚽ Brief de Producto & Design System: MVP App Fútbol Amateur

## 1. Visión del Producto
Este proyecto es un **MVP de una aplicación web/móvil para conectar jugadores de fútbol amateur**.
Su objetivo principal es resolver el problema recurrente de armar partidos: encontrar jugadores faltantes ("los que faltan para el 5"), unirse a convocatorias abiertas, gestionar la reputación de los participantes y organizar encuentros de forma rápida e intuitiva.

* **Tono del producto:** Dinámico, moderno, competitivo y nocturno. Evita la estética clisé o genérica de "portal de reservas" o "césped verde tradicional".
* **Sensación clave:** Transmitir la vibra de un partido de fútbol 5 bajo los reflectores (*Fútbol 5 Nocturno*).

---

## 2. Sistema de Diseño (Design System)

### A. Paleta de Colores (Estilo "Fútbol 5 Nocturno")
La interfaz utiliza una base en modo oscuro profundo con un color de acento estridente de alta visibilidad para acciones principales (CTA).

* **Fondo Principal (`background`):** `#0B0F19` (Azul noche/carbón profundo, nunca usar `#000000` puro).
* **Superficies / Tarjetas (`surface`):** `#161F30` (Azul/grisáceo más claro para contraste de capas e inputs).
* **Bordes y Divisores (`border`):** `#24324A` (Líneas finas para definir estructuras).
* **Color de Acento / CTA (`primary`):** `#CCFF00` (Verde Volt / Ácido Neón). Se reserva exclusivamente para botones de acción principal, badges activos y elementos que requieren atención inmediata.
* **Color de Acento Secundario (`status`):** `#00E5FF` (Cian Neón para confirmaciones de estado o cupos completos).
* **Texto Principal (`text-primary`):** `#F1F5F9` (Blanco cálido de alta legibilidad).
* **Texto Secundario (`text-secondary`):** `#94A3B8` (Gris frío para metadatos, etiquetas y textos secundarios).

#### Regla de Distribución (60-30-10):
* **60%**: Dominio de fondos oscuros (`#0B0F19` y `#161F30`).
* **30%**: Estructuras, textos y bordes (`#F1F5F9`, `#94A3B8`, `#24324A`).
* **10%**: Acentuación táctica en Volt Neón (`#CCFF00`). No saturar la pantalla con este color.

---

### B. Sistema Tipográfico (Estilo "Deportivo & Ágil")

#### 1. Titulares, Banners y Marcadores (Display / Headers)
* **Fuente:** `Barlow Semi Condensed`
* **Pesos:** `Bold (700)` / `ExtraBold (800)`
* **Estilo:** Siempre en mayúsculas (`text-transform: uppercase`) con espaciado entre letras (`letter-spacing: 0.05em` o `0.04em`).
* **Uso:** Títulos principales, contadores de cupos, fechas, nombres de equipos/partidos.

#### 2. Interfaz, Inputs, Tablas y Textos de Lectura (UI Body)
* **Fuente:** `Inter`
* **Pesos:** `Regular (400)` / `Medium (500)` / `SemiBold (600)`
* **Uso:** Menús de navegación, listados de jugadores, formularios, detalles de convocatorias, botones secundarios.
* **Configuración numérica:** Usar `font-variant-numeric: tabular-nums` para mantener alineados los números (horarios, precios, cantidad de jugadores).

---

### C. Estética Visual y Componentes

* **Bordes (Border Radius):** Ligeramente filosos o sutilmente redondeados (`4px` a `8px`). Evitar bordes redondeados excesivos (píldoras de 24px) para mantener un aspecto sólido y técnico.
* **Profundidad de Fondo:** Usar un degradado radial sutil (`radial-gradient`) en la parte superior con opacidad muy baja del color Volt/Azul para simular la luz de un reflector nocturno.
* **Ficha de Jugador (Perfil Cromo / FIFA):** Representar a los usuarios mediante tarjetas verticales tipo cromo con:
  * Foto de perfil o avatar.
  * Posición en cancha (`POR`, `DEF`, `MED`, `DEL`).
  * Pierna hábil (`Diestro` / `Zurdo`).
  * Indicadores de reputación (Puntualidad, Nivel de juego, Asistencia).
* **Estados "Vivos":** Emplear animaciones de pulso (`pulse`/`ping`) en indicador Neón para partidos de urgencia (ej. "Falta 1 jugador para hoy").

---

## 3. Tono de Voz y UX Copy (Lenguaje de Vestuario)

El lenguaje dentro de la aplicación debe ser directo, futbolero y natural, evitando el rigor corporativo o genérico.

| Término de Sistema Tradicional | Copy Oficial de la App |
| :--- | :--- |
| Buscar / Crear evento | **Convocatorias / Armar partido** |
| Unirse al partido | **Sumarme / Voy a jugar** |
| Estado: Completo | **Cancha llena / Equipo listo** |
| Falta 1 participante | **Falta el '5' / Buscamos 1 volante** |
| Confirmar asistencia | **Confirmar presencia** |
| Calificación del usuario | **Reputación en cancha** |
| Cancelar reserva | **Bajarme del partido** |

---

## 4. Instrucciones para la Inteligencia Artificial

Al generar código (HTML, CSS, React, Tailwind), componentes o interfaces para este proyecto:
1. **Priorizá Tailwind CSS** usando la paleta personalizada definida en la sección 2.
2. **Utilizá el modo oscuro como predeterminado** (`dark mode native`).
3. **Mantené los contrastes altos** para que las pantallas sean legibles bajo el sol o en entornos nocturnos.
4. **Respeta las jerarquías tipográficas**: `Barlow Semi Condensed` en mayúsculas para encabezados deportivos y `Inter` para elementos de interfaz interactivos.
5. **Aplica el UX Copy futbolero** especificado en la sección 3 en lugar de frases por defecto.