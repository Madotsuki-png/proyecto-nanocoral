# ✅ TODO LISTO PARA DESPLEGAR FRONTEND EN RAILWAY

## 🎯 Estado Actual

✅ **Backend** - YA DEPLOYADO en Railroad
```
https://proyecto-nanocoral-production.up.railway.app
```

✅ **Código actualizado** - TODOS los archivos usan la URL de Railway
- Login.jsx
- Shop.jsx
- CartView.jsx
- MyOrders.jsx
- AdminPanel.jsx
- OrdersPanel.jsx
- LandingPage.jsx
- ProductDetail.jsx
- api.config.js (centralizado)

✅ **Dockerfiles preparados:**
- frontend/Dockerfile
- frontend/nginx.conf
- docker-compose.yml

---

## 🚀 Cómo Desplegar Frontend en Railway (EN 3 PASOS)

### Paso 1: Hacer Push a GitHub

En tu terminal:
```bash
git add .
git commit -m "Update all API URLs to Railway backend"
git push origin main
```

### Paso 2: En Railway.app

1. Ve a **https://railway.app/dashboard**
2. Entra a tu proyecto existente
3. Click **"+ New Service"**
4. Selecciona **"GitHub Repository"**
5. **Elige tu repo:** proyecto-nanocoral
6. **Root Directory:** `frontend`
7. Railway detectará automáticamente el Dockerfile
8. Click **"Deploy"**

### Paso 3: Configurar Variables

1. El servicio se está creando (~2-3 min)
2. Una vez termine, abre el servicio "frontend"
3. Click pestaña **"Variables"**
4. Agrega esta variable:
   ```
   VITE_API_URL=https://proyecto-nanocoral-production.up.railway.app
   ```
5. **Redeploy** automáticamente

---

## ✨ URLs Finales

Después del deploy tendrás:

- **🌐 Frontend:** `https://proyecto-nanocoral-xxx.up.railway.app` (generada por Railway)
- **🔧 Backend:** `https://proyecto-nanocoral-production.up.railway.app`
- **Auto-conectadas:** El frontend automáticamente hablará con el backend ✅

---

## 🔗 Variables Clave

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://proyecto-nanocoral-production.up.railway.app` |

El frontend la lee automáticamente desde `api.config.js`

---

## ⚡ Verificación Rápida

Una vez deployed, intenta:

1. **Abre el frontend**
2. **Login/Registro** ← Si funciona, la conexión está bien
3. **Ver productos** ← Las imágenes cargarán desde el backend
4. **Agregar al carrito**
5. **Hacer checkout** ← La orden se crea en la BD

Si todo funciona → ✅ **TODO ESTÁ LISTO**

---

## 📋 Checklist Final

- [ ] Push a GitHub hecho
- [ ] Nuevo servicio "frontend" creado en Railway
- [ ] Detectó Dockerfile ✓
- [ ] Build completó (~5 min)
- [ ] Variable `VITE_API_URL` agregada
- [ ] Frontend disponible en URL
- [ ] Login funciona
- [ ] Productos se ven
- [ ] Checkout funciona
- [ ] Órdenes se crean en BD

---

## 🆘 Si Algo Falla

### El frontend no carga
- Ve a Railway → Logs
- Busca errores en build

### No conecta con backend
- Verifica que `VITE_API_URL` esté configurada
- Prueba manualmente: `https://proyecto-nanocoral-production.up.railway.app/health`
- Debe retornar: `{"status": "OK"}`

### Las imágenes no cargan
- Verifica que el backend está online
- URL de imágenes es: `${VITE_API_URL}/images/...`

---

**¡Listo! Solo sigue los 3 pasos arriba y estará online en 5 minutos.**
