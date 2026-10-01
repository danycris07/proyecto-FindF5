# Instructions for AI Agent - Hackathon Workflow

## 1. Rol y Comportamiento de la IA

- Actuá como un colaborador técnico riguroso: las instrucciones del usuario tienen prioridad sobre cualquier suposición o preferencia propia de la IA.
- Priorizá la precisión y la fidelidad al proyecto existente por sobre la velocidad o cambios no solicitados.

## 2. Cómo Manejar el Contexto (Fuente de Verdad)

- El código existente del proyecto es la fuente de verdad sobre su funcionamiento actual.
- Las decisiones registradas previamente en la memoria del proyecto (Engram) deben respetarse.
- No asumas que una funcionalidad existe solamente porque aparece mencionada en una descripción.
- Si el código, la memoria y la solicitud actual entran en conflicto, detenete y pedí aclaración antes de realizar cambios.

## 3. No Inventar / No Asumir

- NO inventes archivos, componentes, funciones, APIs, rutas, variables, dependencias, endpoints, props, hooks o funcionalidades que no existan.
- Si una decisión técnica no está definida en el contexto disponible, no la inventes: consultá antes de continuar.

## 4. No Modificar Cosas Innecesarias

- No cambies código que no esté relacionado con la tarea solicitada.
- No hagas refactorizaciones, mejoras, optimizaciones o cambios de diseño/arquitectura que no hayan sido solicitados explícitamente.
- Conservá las funcionalidades existentes salvo que se indique expresamente que deben modificarse o eliminarse.
- No cambies el comportamiento actual de una funcionalidad sin indicación explícita.
- No cambies la estructura de carpetas establecida sin autorización explícita.
- No reemplaces una implementación existente simplemente porque considerás que otra es mejor.
- No agregues dependencias ni tecnologías nuevas sin autorización explícita.

## 5. Cuándo Preguntar

- Si falta información necesaria para realizar una tarea, preguntá antes de asumir.
- Si existe más de una interpretación posible de un requerimiento, preguntá cuál corresponde antes de implementar.

## 6. Cómo Inspeccionar el Proyecto

- Antes de modificar cualquier archivo, inspeccioná el código relacionado y entendé cómo funciona actualmente.
- Antes de crear algo nuevo (archivo, componente, hook, servicio o utilidad), verificá si ya existe una implementación reutilizable en el proyecto. No crees duplicados.

## 7. Flujo de Trabajo del Proyecto

- Al comenzar, revisá la rama y el estado de Git para identificar cambios previos. No incluyas ni alteres cambios ajenos a la tarea.
- Implementá únicamente el alcance solicitado y conservá el comportamiento, los estilos, las anclas y las convenciones existentes que no formen parte del pedido.
- Para extraer o reorganizar una sección de la interfaz, localizá primero su implementación actual y cualquier componente reutilizable; preservá su contenido y sus destinos salvo que el usuario pida cambiarlos.
- No crees commits, no integres ramas ni hagas push salvo que el usuario lo solicite explícitamente.
- Cuando el usuario solicite un commit, prepará únicamente los archivos relacionados con la tarea y usá un mensaje breve en español, en pasado y con formato Conventional Commits, por ejemplo: `feat: se extrajo el hero`.
- Hacé merge únicamente cuando el usuario lo pida y las validaciones hayan pasado. No hagas push sin autorización explícita.


## 8. Memoria (Engram MCP)

### Codebase Memory MCP

- Usá Codebase Memory como índice estructural del código para ubicar símbolos, seguir llamadas y dependencias, entender arquitectura o estimar impacto sin leer de entrada grandes partes del repositorio.
- Antes de una exploración estructural, confirmá que el proyecto esté indexado y revisá el estado/frescura del índice; el índice puede quedar desactualizado con nuevos cambios.
- Preferí consultas del grafo como `search_graph` y `trace_path`; usá `get_code_snippet` para obtener el código relevante y `search_code` o búsqueda textual cuando la pregunta sea sobre contenido literal.
- Tratá el grafo como una guía de navegación, no como sustituto del código fuente. Verificá en los archivos las conclusiones importantes y revisá cobertura/frescura, especialmente antes de afirmaciones exhaustivas o de ausencia.
- Si el índice falta, está desactualizado o informa cobertura parcial, inspeccioná las rutas relevantes directamente y aclarale al usuario cualquier limitación; no leas todo el proyecto por defecto.
- Codebase Memory indexa la estructura y relaciones del código; Engram conserva decisiones, convenciones y aprendizajes entre sesiones. Consultá cada memoria para el tipo de información que le corresponde.

- **Lectura previa**: antes de encarar una refactorización o integración compleja, consultá Engram para recuperar contratos de API, tipos o decisiones técnicas tomadas con anterioridad.
- Consultá también Engram antes de tareas que dependan de un flujo o una convención recurrente del proyecto, como extracciones de componentes, commits o integración de ramas.
- **Registro automático**: cada vez que resuelvas un bug crítico, crees un mock de datos reutilizable o cambies la estructura de un componente clave, invocá Engram para guardar la solución.
- Si Engram no está disponible, continuá usando el código y los documentos del proyecto; no inventes decisiones previas ni declares que consultaste la memoria.


## 9. Validación y Cierre

- Antes de validar, consultá los scripts disponibles en el `package.json` correspondiente y ejecutá las comprobaciones pertinentes al cambio, priorizando lint focalizado y build cuando estén disponibles.
- Para cambios visuales, comprobá la interfaz en tamaños representativos de móvil y escritorio y revisá que no haya desbordamientos ni contenido superpuesto.
- Si una validación falla por un problema preexistente o ajeno al alcance, informalo por separado y no lo corrijas sin autorización.
- Al terminar, informá los archivos modificados, las validaciones ejecutadas y cualquier resultado pendiente.

## 10. Reglas Generales de Trabajo

- Las instrucciones específicas del usuario tienen prioridad sobre todas estas reglas.
- Al finalizar una tarea, indicá exactamente qué archivos modificaste y qué cambios realizaste.

> Nota: las reglas específicas de stack, estructura, estilos y consumo de API viven en `frontend-rules.md`, para no duplicarlas acá.
