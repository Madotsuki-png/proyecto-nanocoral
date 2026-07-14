# 🚀 Desplegar Frontend en Railway

Tu backend ya está en producción:
```
https://proyecto-nanocoral-production.up.railway.app
```

Ahora vamos a deployar el frontend. Es muy fácil.

## ✅ Paso 1: Agregar la URL del Backend al Código

El código ya está actualizado con:
```
VITE_API_URL=https://proyecto-nanocoral-production.up.railway.app
```

## 📋 Paso 2: En Railway Dashboard

1. Ve a **https://railway.app/dashboard**
2. Abre tu proyecto
3. Click en **"+ New Service"** (arriba a la derecha)
4. Selecciona **"GitHub Repository"**

## 🔧 Paso 3: Configurar Frontend Service

1. **Selecciona tu repo:** `proyecto-nanocoral`
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build` (auto)
4. **Start Command:** nginx (auto, desde Dockerfile)
5. Click **"Deploy"**

Railway detectará automáticamente:
- ✅ Dockerfile en `frontend/`
- ✅ nginx.conf
- ✅ Build de Vite

## ⚙️ Paso 4: Configurar Variables de Entorno

Una vez que cree el servicio:

1. Click en el servicio "frontend"
2. Click en **"Variables"** (pestaña)
3. Agrega esta variable:

```
VITE_API_URL=https://proyecto-nanocoral-production.up.railway.app
```

4. **Redeploy** automáticamente

## 🎯 Paso 5: Verificar Despliegue

1. El build toma 2-3 minutos
2. Busca en Railway tu URL del frontend (algo como: `https://proyecto-nanocoral-xxx.up.railway.app`)
3. Abre en navegador
4. Intenta:
   - ✅ Login
   - ✅ Ver productos
   - ✅ Agregar al carrito
   - ✅ Hacer checkout

## 🐛 Si No Funciona

### El frontend no ve el backend

Verifica en console del navegador (F12):
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Debería mostrar:
```
https://proyecto-nanocoral-production.up.railway.app
```

Si sale `undefined`, verifica que agregaste la variable en Railway.

### Build falla

En Railway → Logs, busca el error. Usualmente es:
- Dependencias no instaladas: `npm install`
- Vite no encuentra archivos: revisar imports en código

### API retorna 404

Verifica que el backend está online:
```
https://proyecto-nanocoral-production.up.railway.app/health
```

Debe retornar:
```json
{"status": "OK", "message": "Backend is running"}
```

## 📊 Resultado Final

Una vez todo funcione tendrás:

- **Frontend:** `https://proyecto-nanocoral-xxx.up.railway.app`
- **Backend:** `https://proyecto-nanocoral-production.up.railway.app`
- **Ambos conectados** ✅

## 💾 Auto-Deploy

Cada vez que hagas push a GitHub:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Railway automáticamente:
1. Detecta el cambio
2. Construye la imagen Docker
3. Deploya sin downtime

## ⚠️ IMPORTANTE

**Asegúrate de:**
1. ✅ Backend está en línea y responde `/health`
2. ✅ Variable `VITE_API_URL` está en Railway
3. ✅ Dockerfile y nginx.conf existen en `frontend/`
4. ✅ `package.json` tiene `build` script

---

¿Necesitas algo más? El frontend debería deployarse solo con estos pasos.
