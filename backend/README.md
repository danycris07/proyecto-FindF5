# Backend de FindF5

El backend vive en esta carpeta y mantiene sus dependencias y comandos separados
del frontend.

## Desarrollo

1. Copiar `.env.example` como `.env` y ajustar las variables locales.
2. Instalar dependencias con `npm install`.
3. Iniciar el servidor con `npm run dev`.
4. Ejecutar las pruebas con `npm test`.

La API inicial expone `GET /api/health` para comprobar que el servidor responde.
La conexión a MySQL, autenticación y funcionalidades de negocio se incorporarán
en etapas posteriores.
