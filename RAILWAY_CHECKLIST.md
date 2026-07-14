# ✅ Checklist para Despliegue en Railway

## Paso 1: Preparar Código Local

- [ ] Has instalado Node.js 18+
- [ ] Has clonado el repositorio
- [ ] Has ejecutado `npm install` en frontend y backend
- [ ] Backend funciona: `npm start` (escucha en puerto 5000)
- [ ] Frontend funciona: `npm run dev` (escucha en puerto 5173)
- [ ] Puedes conectar a BD Oracle desde tu máquina
- [ ] Has agregado `.env.example` a git

## Paso 2: GitHub

- [ ] Tienes cuenta en GitHub
- [ ] Has creado repositorio público: `proyecto-nanocoral`
- [ ] Has hecho `git add .`
- [ ] Has hecho `git commit -m "Initial commit"`
- [ ] Has hecho `git push origin main`
- [ ] El repositorio está en: `https://github.com/TU_USUARIO/proyecto-nanocoral`

## Paso 3: Railway Setup

- [ ] Tienes cuenta en Railway.app
- [ ] Has conectado tu GitHub a Railway
- [ ] Has autorizado Railway a acceder a tus repos

## Paso 4: Crear Servicios en Railway

### Backend Service

- [ ] Creado nuevo servicio desde repo GitHub
- [ ] Root Directory: `backend`
- [ ] Detectó Dockerfile automáticamente
- [ ] Variables de entorno configuradas:
  - [ ] `DB_USER`: Rafael
  - [ ] `DB_PASSWORD`: 123456789
  - [ ] `DB_HOST`: [tu_servidor_oracle]
  - [ ] `DB_PORT`: 1521
  - [ ] `DB_SID`: xe
  - [ ] `NODE_ENV`: production
  - [ ] `PORT`: 5000
- [ ] Build y deploy completados
- [ ] Endpoint accesible: `https://[nombre-backend].up.railway.app`
- [ ] Health check OK: `https://[nombre-backend].up.railway.app/health` retorna JSON

### Frontend Service

- [ ] Creado nuevo servicio desde repo GitHub
- [ ] Root Directory: `frontend`
- [ ] Detectó Dockerfile automáticamente
- [ ] Variables de entorno configuradas:
  - [ ] `VITE_API_URL`: `https://[nombre-backend].up.railway.app`
- [ ] Build y deploy completados
- [ ] Frontend accesible: `https://[nombre-frontend].up.railway.app`

## Paso 5: Verificación

- [ ] Frontend carga correctamente
- [ ] Puedo hacer login
- [ ] Puedo ver productos
- [ ] Puedo agregar producto al carrito
- [ ] Puedo hacer checkout
- [ ] Admin puede ver órdenes
- [ ] Admin puede despachar órdenes
- [ ] Cliente ve "Confirmar que ya llegó"
- [ ] Cliente puede dejar reseña
- [ ] Reseña aparece en landing page

## Paso 6: Configuración Avanzada (Opcional)

- [ ] Dominio personalizado configurado
- [ ] SSL certificate activo
- [ ] Backups automáticos de BD configurados
- [ ] Monitoreo y alertas configuradas

## Solución de Problemas

| Problema | Solución |
|----------|----------|
| Build falla | Ver logs en Railway > Logs, revisar Dockerfile |
| No conecta a BD | Verificar variables de entorno, host accesible |
| Frontend no ve API | Verificar `VITE_API_URL`, check CORS en backend |
| Deploy takes too long | Normal: ~2-5 min, esperar a que termine |

## Notas Importantes

⚠️ **Base de datos Oracle:**
- Debe ser accesible desde Railway (no localhost)
- Puerto 1521 debe estar abierto
- Usuario/pass deben ser correctos

⚠️ **Variables de entorno:**
- NUNCA incluyas secretos en código
- NUNCA hagas commit de `.env` (solo `.env.example`)
- En Railway, usa el dashboard para agregar variables

⚠️ **Imágenes de productos:**
- Se guardan en `backend/public/images/`
- En Railway necesitarás un storage externo (S3, Azure Blob, etc.)
- Por ahora, funciona si la BD y app están en el mismo servidor

## URLs Finales

Después del deploy, accede a:

- **Frontend:** https://[nombre-tuyo].up.railway.app
- **Backend API:** https://[nombre-tuyo].up.railway.app/api/...
- **Dashboard Railway:** https://railway.app/dashboard

---

## 🎉 ¡Listo para Desplegar!

Si completaste todos los checkboxes, estás listo. ¡Que funcione el deploy!

**Última cosa:** No olvides hacer commits regularmente:
```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Railway desplegará automáticamente cada push a main.
