# Recorrido de implementación del backend

Este documento registra las etapas acordadas para construir y conectar el
backend de FindF5 sin perder el contexto entre sesiones.

## Decisiones acordadas

- El backend y sus dependencias viven en `backend/`; el frontend conserva su
  carpeta y configuración independientes.
- Base de datos de desarrollo: MySQL local con Sequelize.
- Autenticación: cookie `HttpOnly`.
- Cada cuenta tiene un único rol: jugador, dueño de cancha o administrador.
- El jugador elige una posición: jugador de campo o arquero.
- El dueño de cancha tendrá perfil en esta etapa; la gestión de sus canchas se
  definirá más adelante.
- El administrador podrá crear, consultar, editar y eliminar usuarios,
  canchas y partidos.
- La cuenta inicial de administración se creará mediante un comando local que
  lea sus credenciales desde variables de entorno. No se guardarán credenciales
  predeterminadas en el código ni en este documento.
- Los servicios del frontend podrán recurrir a mocks para consultas si la API
  falla. Las escrituras deben informar el error y no simular que se guardaron.
- El usuario mock id 1 sirve como referencia de los campos del perfil; sus
  credenciales son de demostración y no deben reutilizarse como cuenta real.

## Etapas

### 1. Base del backend — completada

- Crear una rama de trabajo y separar la aplicación dentro de `backend/`.
- Definir las dependencias y comandos propios del backend.
- Crear el servidor Express y `GET /api/health`.
- Agregar una prueba para comprobar que la API responde.

Commit: `13ef9ef feat: se creó la base del backend`.

### 2. MySQL y modelos — completada

- [x] Documentar las variables de entorno necesarias para MySQL.
- [x] Implementar la conexión Sequelize sin exponer secretos.
- [x] Definir modelos y relaciones a partir de los mocks.
- [x] Crear sincronización manual de desarrollo que no altera ni elimina tablas.
- [x] Probar configuración, asociaciones y validaciones de modelos sin conexión.
- [x] Configurar y probar la conexión real y el esquema con MySQL local.

Verificación real de MySQL confirmada por el usuario con su configuración local.

### 3. Usuarios y autenticación — siguiente

- Implementar registro, inicio y cierre de sesión.
- Guardar contraseñas con hash; nunca almacenar contraseñas en texto plano.
- Aplicar cookie `HttpOnly` y proteger las rutas autenticadas por rol.
- Crear el comando local para inicializar el primer administrador usando
  variables de entorno.
- Probar email duplicado, credenciales inválidas, sesión y permisos.

### 4. Partidos y participación

- Implementar consulta, creación, edición y eliminación de partidos.
- Implementar sumarse, bajarse y ver participantes.
- Derivar los cupos con la regla acordada:
  `faltan = esperados - (1 si el organizador juega) - confirmados por fuera - anotados en la app`.
- Validar fechas pasadas, permisos del organizador y límites de cupos.
- Hacer atómica la asignación del último lugar para evitar sobreinscripciones
  concurrentes.
- Cubrir la opción “Jugar por la coca” y los datos de cancha disponibles.

### 5. Administración

- Implementar rutas administrativas para usuarios, canchas y partidos.
- Restringir esas rutas al rol administrador.
- Probar las operaciones autorizadas y el rechazo de los demás roles.

### 6. Integración con el frontend

- Adaptar los servicios existentes para usar `import.meta.env.VITE_API_URL`.
- Mantener mocks como fallback de consultas cuando falle la API.
- En las escrituras, mostrar errores reales sin reportar éxito local no
  sincronizado con el backend.
- Verificar estados de carga, error y vacío en las pantallas afectadas.

### 7. Validación y cierre del recorrido

- Ejecutar las pruebas relevantes de backend y frontend.
- Verificar los flujos principales de punta a punta con MySQL local.
- Documentar la configuración necesaria para desarrollo.
- Mantener cada etapa en su rama y commit semántico en pasado, sin mezclar
  cambios de frontend y backend en un mismo commit.

## Fuera del primer recorrido

Las funciones de geolocalización, alertas, reputación, contacto y notificaciones
que aparecen en el backlog de Jira no forman parte del recorrido inicial, salvo
que se acuerde incorporarlas expresamente.

## Registro de avance

- [x] Etapa 1: base del backend.
- [x] Etapa 2: MySQL y modelos.
- [ ] Etapa 3: usuarios y autenticación.
- [ ] Etapa 4: partidos y participación.
- [ ] Etapa 5: administración.
- [ ] Etapa 6: integración con el frontend.
- [ ] Etapa 7: validación y cierre.
