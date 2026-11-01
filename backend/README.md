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
   misma clave configurada para MySQL y no subir `.env` al repositorio.
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

La API expone `GET /api/health` para comprobar que el servidor responde. La
autenticación y las funcionalidades de negocio se incorporarán en etapas
posteriores.
