# PDF Manager

Una aplicación para gestionar y visualizar archivos PDF locales.

## Estructura del Proyecto

- **client/**: Aplicación React + Vite + Tailwind CSS v4.
- **server/**: API en Express.js para gestionar el sistema de archivos.

## Funcionalidades

- Selección de carpeta de trabajo desde el cliente.
- Visualización de archivos en modo Grilla o Columna.
- Ordenamiento por nombre y fecha de modificación.
- Apertura de archivos locales desde la interfaz.

## Ejecución

### Servidor
```bash
cd server
npm install
node index.js
```

### Cliente
```bash
cd client
npm install
npm run dev
```
