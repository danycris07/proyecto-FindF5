# Backend de FindF5

El backend vive en esta carpeta y mantiene sus dependencias y comandos separados
del frontend.

## Desarrollo

1. En MySQL, crear la base y un usuario local con permisos sobre ella:

   ```sql
   CREATE DATABASE findf5_dev
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;
   CREATE USER 'findf5_app'@'127.0.0.1'
     IDENTIFIED BY 'elegir-una-clave-local';
   GRANT ALL PRIVILEGES ON findf5_dev.* TO 'findf5_app'@'127.0.0.1';
   ```

2. Copiar `.env.example` como `.env` y completar los datos locales. Usar la
   misma clave configurada para MySQL, ajustar `FRONTEND_ORIGIN` si Vite usa
   otro origen y no subir `.env` al repositorio.
3. Instalar dependencias con `npm install`.
4. Crear las tablas faltantes con `npm run db:sync`.
5. Iniciar el servidor con `npm run dev`.
6. Ejecutar las pruebas con `npm test`.

El servidor valida la conexión a MySQL antes de empezar a escuchar. La
configuración de la base se lee desde `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`
y `DB_PASSWORD`.

`db:sync` es una operación manual de desarrollo: crea tablas que no existan,
pero no altera ni elimina tablas existentes y se bloquea cuando
`NODE_ENV=production`. Los cambios futuros de esquema requieren una estrategia
de migraciones explícita; no se debe habilitar `alter` o `force` en producción.

La API expone `GET /api/health` y estos endpoints de autenticación:

- `POST /api/auth/register`: crea una cuenta de jugador o dueño de cancha e
  inicia su sesión. La posición y pierna hábil son opcionales para jugadores.
- `POST /api/auth/login`: valida email y contraseña y crea una sesión.
- `GET /api/auth/me`: devuelve el perfil público de la sesión activa.
- `POST /api/auth/logout`: invalida la sesión actual.

Las sesiones usan una cookie `HttpOnly`, `SameSite=Lax`, con duración de siete
días. En producción se añade `Secure`. La base guarda únicamente el hash del
token de sesión, y las contraseñas se derivan con `scrypt`. El rol administrador
no puede asignarse desde el registro.

Los endpoints de partidos requieren una sesión:

- `GET /api/fields`: lista las canchas disponibles para el formulario.
- `GET /api/matches`: lista convocatorias abiertas y ordenadas por fecha/hora.
- `GET /api/matches/mine`: lista los partidos que organiza o donde participa el
  usuario autenticado.
- `GET /api/matches/:matchId`: devuelve detalle, organizador, anotados y cupos.
- `POST /api/matches`: crea un partido para el jugador autenticado.
- `PUT /api/matches/:matchId`: edita el partido; solo puede hacerlo su
  organizador.
- `DELETE /api/matches/:matchId`: elimina lógicamente el partido; solo puede
  hacerlo su organizador.
- `POST /api/matches/:matchId/join` y `DELETE /api/matches/:matchId/join`:
  permiten sumarse y bajarse. El último cupo se asigna dentro de una
  transacción que bloquea la fila del partido.
- `POST /api/matches/:matchId/outside-slots`: registra un jugador confirmado
  por fuera; solo puede hacerlo el organizador.

La respuesta del partido calcula `missingPlayers` a partir de jugadores
esperados, participación del organizador, confirmados por fuera y participantes
anotados. La hora se interpreta en la zona `America/Argentina/Buenos_Aires`.

Los endpoints administrativos requieren una sesión con rol `ADMIN`:

- `/api/admin/users`: listar, consultar, crear, editar y eliminar usuarios.
  Las contraseñas nuevas o restablecidas se guardan con `scrypt`; los datos de
  respuesta nunca incluyen el hash. Los cambios de rol y contraseña revocan
  las sesiones existentes.
- `/api/admin/fields`: CRUD de canchas, incluyendo propietario, dirección,
  coordenadas, precio e información de imagen.
- `/api/admin/matches`: CRUD de partidos, pudiendo asignar un jugador como
  organizador. Las respuestas conservan el mismo formato y cálculo de cupos que
  `/api/matches`.

Las eliminaciones son lógicas. No se permite que el administrador se elimine o
quite su propio rol, y debe quedar al menos un administrador activo. Los
identificadores de propietarios, organizadores, canchas y equipos se validan
antes de guardar.

Para crear el primer administrador, completar `ADMIN_NAME`, `ADMIN_EMAIL` y
`ADMIN_PASSWORD` en `.env` (contraseña de al menos 12 caracteres) y ejecutar
`npm run db:bootstrap-admin`. El comando no eleva cuentas existentes que no
sean administradoras y es idempotente para una cuenta administradora ya creada.

Las pruebas de integración contra MySQL crean y eliminan datos temporales.
Con la base de desarrollo configurada, ejecutarlas con
`$env:RUN_DB_INTEGRATION_TESTS="1"; npm test` en PowerShell. No ejecutar pruebas
de integración contra una base de producción.
