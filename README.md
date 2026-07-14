# 🌊 NanoCoral - E-commerce Platform

Plataforma de comercio electrónico para venta de productos acuáticos (corales, peces y accesorios).

## 📋 Requisitos Previos

- Node.js 18+
- Oracle Database XE
- Git
- Docker (opcional)

## 🚀 Instalación Local

### Backend
```bash
cd backend
npm install
npm start
```

Server escucha en: `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en: `http://localhost:5173`

## 📦 Despliegue en Railway

Railway está totalmente configurado. Sigue la guía completa en:

**📄 [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)**

Pasos rápidos:
1. Push código a GitHub
2. Crear proyecto en Railway.app
3. Conectar repositorio
4. Configurar variables de entorno
5. ¡Listo!

## 🐳 Despliegue con Docker Compose

```bash
docker-compose up -d
```

Accede a:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📚 Documentación

- **[DOCUMENTACION_PROYECTO.md](./DOCUMENTACION_PROYECTO.md)** - Documentación completa del proyecto
- **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** - Guía de despliegue en Railway

## 🏗️ Estructura del Proyecto

```
proyecto-nanocoral/
├── frontend/                 # React App
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
├── backend/                  # Node.js API
│   ├── server.js
│   ├── Dockerfile
│   ├── Procfile
│   └── package.json
├── docker-compose.yml
├── railway.json
├── .env.example
└── RAILWAY_DEPLOYMENT.md
```

## 🔧 Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
# Backend
DB_USER=Rafael
DB_PASSWORD=123456789
DB_HOST=localhost
DB_PORT=1521
DB_SID=xe
NODE_ENV=development
PORT=5000

# Frontend
VITE_API_URL=http://localhost:5000
```

## 📖 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar productos |
| POST | `/api/registro` | Registrar usuario |
| POST | `/api/login` | Autenticación |
| POST | `/api/ordenes` | Crear orden |
| GET | `/api/ordenes/cliente/:id` | Órdenes del cliente |
| POST | `/api/resenas` | Agregar reseña |

## ✨ Características

- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Sistema de órdenes
- ✅ Seguimiento de pedidos
- ✅ Reseñas y calificaciones
- ✅ Panel administrativo
- ✅ Autenticación con JWT
- ✅ Modo oscuro
- ✅ Temas de color personalizables
- ✅ Multiidioma (ES, EN, DE)

## 🛠️ Stack Tecnológico

**Frontend:**
- React 19
- Vite
- React Router
- Lucide React
- i18next

**Backend:**
- Node.js
- Express.js
- Oracle Database
- Multer (file upload)
- JWT

## 📞 Soporte

Para problemas o preguntas, revisa:
1. [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Troubleshooting
2. Logs en Railway dashboard
3. Console del navegador (F12)

## 📄 Licencia

MIT

---

**Hecho con ❤️ para NanoCoral**
