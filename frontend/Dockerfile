FROM node:20-alpine AS builder

WORKDIR /app

# Verificar versión de Node
RUN node --version && npm --version

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
