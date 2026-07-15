FROM node:20-slim

WORKDIR /app

# Copia los archivos del backend (ajustado)
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copia todo el contenido
COPY . .

EXPOSE 5000

# El comando de inicio debe ejecutar el server.js dentro de la carpeta backend
CMD ["node", "backend/server.js"]