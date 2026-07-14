# 🚀 Guía de Despliegue en Railway

Railway es una plataforma moderna para desplegar aplicaciones sin configurar servidores. Este proyecto está totalmente configurado para Railway.

## ✅ Requisitos Previos

1. Tener una cuenta en **https://railway.app**
2. Repositorio en GitHub (público o privado)
3. Variables de entorno configuradas

## 📋 Paso a Paso para Desplegar

### **Paso 1: Hacer Push del Código a GitHub**

Si aún no has subido el código:

```bash
git add .
git commit -m "Configure Railway deployment with Docker and Dockerfiles"
git push origin main
```

### **Paso 2: Crear Proyecto en Railway**

1. Ve a **https://railway.app**
2. Click en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta tu cuenta de GitHub
5. Selecciona el repositorio **`proyecto-nanocoral`**
6. Railway detectará automáticamente el Dockerfile

### **Paso 3: Configurar Dos Servicios**

Railway necesita 2 servicios separados (Backend y Frontend):

#### **Servicio 1: Backend (Node.js + Express)**

```bash
1. Click en "+ New Service"
2. Selecciona "GitHub Repo"
3. Elige tu repositorio
4. Selecciona la rama "main"
5. En "Root Directory": backend
6. Click "Deploy"
```

**Luego configura las variables de entorno:**

```
DB_USER = Rafael
DB_PASSWORD = 123456789
DB_HOST = [tu_host_de_oracle]
DB_PORT = 1521
DB_SID = xe
NODE_ENV = production
PORT = 5000
```

**En Railway:**
1. Abre el servicio Backend
2. Click en "Variables"
3. Agrega cada variable

#### **Servicio 2: Frontend (React + Nginx)**

```bash
1. Click en "+ New Service"
2. Selecciona "GitHub Repo"
3. Elige tu repositorio
4. Selecciona la rama "main"
5. En "Root Directory": frontend
6. Click "Deploy"
```

**Configura la variable de entorno:**

```
VITE_API_URL = https://[nombre-backend-railway].railway.app
```

### **Paso 4: Conectar Servicios**

Para que el frontend sepa dónde está el backend:

1. En el servicio **Frontend**, agrega:
   ```
   VITE_API_URL = https://[nombre-tu-backend-railway].railway.app
   ```

2. En el servicio **Backend**, agrega:
   ```
   FRONTEND_URL = https://[nombre-tu-frontend-railway].railway.app
   ```

### **Paso 5: Configurar Dominio Personalizado (Opcional)**

Para usar tu propio dominio:

1. En Railway → Settings → Domains
2. Click "+ Add Domain"
3. Ingresa tu dominio (ej: `nanocoral.com`)
4. Apunta tu DNS a Railway (instrucciones en Railway)

## 🔧 Variables de Entorno Importantes

| Variable | Valor | Dónde |
|----------|-------|-------|
| `DB_USER` | Rafael | Backend |
| `DB_PASSWORD` | 123456789 | Backend |
| `DB_HOST` | tu_servidor_oracle | Backend |
| `DB_PORT` | 1521 | Backend |
| `DB_SID` | xe | Backend |
| `NODE_ENV` | production | Backend |
| `PORT` | 5000 | Backend |
| `VITE_API_URL` | URL del Backend | Frontend |

## 🆘 Solución de Problemas

### **El Frontend no se conecta al Backend**

```javascript
// Verifica en frontend/src/App.jsx o donde hagas fetch:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### **Base de datos no se conecta**

1. Verifica que la BD Oracle está accesible desde Railway
2. Usa un host público, no localhost
3. Abre el puerto 1521 en tu firewall

### **Ver Logs**

En Railway:
1. Abre el servicio
2. Click en "Logs"
3. Mira los errores

```bash
# O desde terminal si tienes Railway CLI:
railway logs --follow
```

## 📊 Monitoreo en Railway

1. Dashboard muestra:
   - CPU usage
   - Memory usage
   - Network I/O
   - Deploy history

2. Alertas automáticas si hay errores

## 💾 Backups de BD

Ya que usas Oracle externo, el backup debe hacerse en tu servidor Oracle, no en Railway.

Recomendado:
```bash
# En tu servidor Oracle
expdp rafael/123456789 directory=DATA_PUMP_DIR dumpfile=backup_$(date +%Y%m%d).dmp
```

## 🔄 Deploy Automático

Cada push a `main` en GitHub:
1. Railway detecta el cambio
2. Construye los Dockerfiles
3. Deploya automáticamente
4. Sin downtime

## 📈 Plan de Precios (Railway)

- **Gratis**: $5/mes de crédito (para empezar)
- **Pay-as-you-go**: Pagas por lo que usas
- Sugerido para proyecto escolar: Plan Free/Pay-as-you-go

## ✅ Checklist Final

- [ ] Código pusheado a GitHub
- [ ] 2 servicios creados en Railway (Backend + Frontend)
- [ ] Variables de entorno configuradas
- [ ] BD Oracle accesible desde Railway
- [ ] Frontend puede llamar al Backend
- [ ] Healthcheck en Backend pasa (/health)
- [ ] Dominio personalizado configurado (opcional)
- [ ] Logs monitoreados

## 🎉 Listo!

Tu aplicación está desplegada en:
- **Frontend**: https://[nombre].up.railway.app
- **Backend**: https://[nombre].up.railway.app:5000

¡Accede desde cualquier navegador!
