FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar código de la aplicación
COPY . .

# Crear directorio para imágenes
RUN mkdir -p public/images

# Exponer puerto
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para ejecutar
CMD ["node", "server.js"]
