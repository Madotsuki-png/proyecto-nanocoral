# 🚀 PASOS EXACTOS PARA DESPLEGAR FRONTEND EN RAILWAY

## 📍 POSICIONAMIENTO: Estás aquí

```
✅ Backend ya online: proyecto-nanocoral-production.up.railway.app
✅ Código pusheado a GitHub con URLs correctas
👉 AHORA: Agregar Frontend Service en Railway
```

---

## 🎯 PASO A PASO (Copiar exacto)

### **PASO 1: Entra a Railway Dashboard**
```
https://railway.app/dashboard
```

### **PASO 2: Abre tu Proyecto**
- Click en tu proyecto "NanoCoral" o "proyecto-nanocoral"
- Deberías ver el servicio "backend" que ya está online

### **PASO 3: Agregar Nuevo Servicio**
- Click botón **"+ New Service"** (arriba a la derecha del proyecto)
- Se abre un menú con opciones

### **PASO 4: Seleccionar GitHub Repository**
Ves estas opciones:
```
☐ GitHub Repository  ← CLICKEA AQUÍ
☐ Database
☐ Template
☐ Docker Image
☐ Function
☐ Bucket
☐ Volume
☐ Empty Service
```

### **PASO 5: Seleccionar Tu Repo**
- Te pedirá que autorices GitHub (si no lo hiciste)
- Selecciona: **proyecto-nanocoral**
- Click "Connect"

### **PASO 6: Configurar Rama y Carpeta**
Te aparecerá un formulario:
```
Branch: main ✓
Root Directory: [AQUÍ ESCRIBE] frontend
```

**⚠️ IMPORTANTE:** En "Root Directory" escribe: `frontend`

### **PASO 7: Deploy**
- Click **"Deploy"** (botón azul)
- Railway empezará a:
  1. Leer el Dockerfile en `/frontend`
  2. Instalar dependencias
  3. Compilar con Vite
  4. Construir imagen Docker
  5. Desplegar en Railway

**Esto toma 3-5 minutos**

### **PASO 8: Esperar a que Termine**
En Railway verás:
```
Building... ⏳
Deploying... ⏳
Running ✅ (cuando termine)
```

### **PASO 9: Agregar Variable de Entorno**
Una vez que el servicio esté "Running":

1. Click en el servicio "frontend"
2. Click pestaña **"Variables"** (al lado de "Deployments")
3. Click **"+ Add Variable"**
4. Rellena:
   ```
   KEY: VITE_API_URL
   VALUE: https://proyecto-nanocoral-production.up.railway.app
   ```
5. Click "Add"
6. **REDEPLOY** automáticamete (o click botón redeploy si no lo hace)

### **PASO 10: Obtener URL del Frontend**
En Railway verás:
```
Public URL: https://proyecto-nanocoral-[ALGO].up.railway.app
```

Esa es tu URL del frontend. Cópiala.

---

## ✅ VERIFICACIÓN

Abre tu navegador y ve a:
```
https://proyecto-nanocoral-[ALGO].up.railway.app
```

Deberías ver:
- ✅ Landing page de NanoCoral
- ✅ Logo, botones, estilos oscuro/claro

### Prueba Rápida:
1. Click "EXPLORAR" o "Shop"
2. ¿Se cargan productos? Si sí → Conectó con backend ✅
3. Click "Login"
4. Intenta hacer login → Funciona? ✅

Si todo funciona → **¡LISTO! Todo está online**

---

## 🎯 RESUMEN RÁPIDO

| Paso | Acción |
|------|--------|
| 1 | Abre https://railway.app/dashboard |
| 2 | Click "+ New Service" |
| 3 | Selecciona "GitHub Repository" |
| 4 | Elige "proyecto-nanocoral" |
| 5 | Root Directory: `frontend` |
| 6 | Click "Deploy" |
| 7 | Espera 3-5 min |
| 8 | Agrega variable `VITE_API_URL` |
| 9 | Abre URL y prueba |
| 10 | ¡Listo! |

---

## ⚠️ SI NO FUNCIONA

### Error en build:
- Ve a Railway → Logs (en el servicio frontend)
- Busca la línea roja con error
- Probablemente falta instalar algo

### No conecta con backend:
- Verifica que la variable `VITE_API_URL` esté correcta
- Prueba manualmente:
  ```
  https://proyecto-nanocoral-production.up.railway.app/health
  ```
- Debe retornar: `{"status":"OK"...}`

### Las imágenes no cargan:
- Verifica que el backend esté en línea
- Las URLs de imágenes usan: `${VITE_API_URL}/images/...`

---

**NO HAGAS NADA LOCAL. Todo es en Railway.app**

¿Ya estás en Railway? Si sí, comienza por PASO 1.
