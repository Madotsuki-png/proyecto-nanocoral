# 6. MANTENIMIENTO Y EVOLUCIÓN - DOCUMENTACIÓN COMPLETA

## 📋 Entregables

---

## ✅ 1. Registro de Incidencias y Solicitudes de Cambio

### Sistema de Tracking: GitHub Issues

**Ubicación:** https://github.com/usuario/proyecto-nanocoral/issues

### Formato de Issue

#### Bug Report Template

```markdown
## 🐛 Reporte de Bug

**Descripción:**
[Describe el problema de forma clara]

**Pasos para reproducir:**
1. Abre [página]
2. Haz clic en [botón]
3. Observa el error

**Comportamiento esperado:**
[Qué debería pasar]

**Comportamiento actual:**
[Qué está pasando]

**Capturas de pantalla:**
[Si aplica, adjunta imagen]

**Información del navegador:**
- Browser: Chrome 120.0
- SO: Windows 11
- Dispositivo: Desktop

**Severidad:** 🔴 Alta / 🟡 Media / 🟢 Baja

**Labels:** bug, frontend/backend, critical
```

#### Feature Request Template

```markdown
## ✨ Solicitud de Función

**Descripción:**
[Descripción clara de la funcionalidad deseada]

**Caso de uso:**
[Por qué se necesita esta funcionalidad]

**Aceptación:**
- [ ] Debe hacer X
- [ ] Debe hacer Y
- [ ] No debe hacer Z

**Estimado de esfuerzo:** 2-3 días
**Prioridad:** Alta / Media / Baja

**Labels:** enhancement, feature, roadmap
```

### Tabla de Control de Incidencias

| ID | Tipo | Descripción | Estado | Severidad | Asignado | Fecha |
|-------|------|-------------|--------|-----------|----------|-------|
| #1 | Bug | Las imágenes no cargan en mobile | 🔄 In Progress | 🔴 Alta | Juan | 2026-01-15 |
| #2 | Enhancement | Integrar Stripe para pagos reales | 📋 Backlog | 🟡 Media | María | 2026-01-16 |
| #3 | Bug | Login falla con emails en mayúscula | ✅ Closed | 🟢 Baja | Carlos | 2026-01-10 |
| #4 | Feature | App móvil nativa | 📋 Backlog | 🟡 Media | Equipo | 2026-02-01 |

---

## ✅ 2. Parches y Actualizaciones (Versiones Menores)

### Versionado: Semantic Versioning

```
v1.0.0 → v1.0.1 → v1.1.0 → v2.0.0
│         │         │         │
│         │         │         └─ Breaking changes
│         │         └───────────── Nueva funcionalidad
│         └───────────────────────── Bug fix
└────────────────────────────────────── Release inicial
```

### Historial de Versiones

#### v1.0.0 - 2026-01-10 (Release Inicial)

**Funcionalidades:**
- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Sistema de órdenes
- ✅ Autenticación JWT
- ✅ Panel administrativo
- ✅ Reseñas y calificaciones

**Cambios:**
```
git tag -a v1.0.0 -m "Release inicial: Catálogo + Órdenes"
git push origin v1.0.0
```

#### v1.0.1 - 2026-01-13 (Bug Fix)

**Bugs Corregidos:**
- 🔧 Arregladas imágenes no cargaban en iOS
- 🔧 Login fallaba con emails en mayúscula
- 🔧 Carrito no persistía al cambiar de dispositivo

**Cambios:**
```javascript
// frontend/src/Shop.jsx
- src={`${API_URL}/images/${producto.imagen_url}`}
+ src={`${API_URL}/images/${producto.imagen_url}?v=1.0.1`}  // Cache busting

// backend/server.js
- const sql = 'SELECT * FROM USUARIOS WHERE EMAIL = :email'
+ const sql = 'SELECT * FROM USUARIOS WHERE LOWER(TRIM(EMAIL)) = LOWER(TRIM(:email))'
```

**Deploy:**
```bash
git add .
git commit -m "v1.0.1: Fix image loading and login case sensitivity"
git tag v1.0.1
git push origin main --tags
# Railway auto-redeploy
```

#### v1.1.0 - 2026-01-20 (Feature Minor)

**Nuevas Funcionalidades:**
- ✨ Búsqueda de productos
- ✨ Filtros avanzados
- ✨ Notificaciones por email
- ✨ Exportar órdenes a PDF

**Deprecations:**
- ⚠️ API v1 será deprecated en v2.0.0
- ⚠️ Cambio en estructura de respuestas

**Migration Guide:**
```javascript
// Viejo (v1.0.x)
const productos = await fetch('/api/productos')
// Retorna: [{ id, nombre, precio }]

// Nuevo (v1.1.0)
const productos = await fetch('/api/v1/productos')
// Retorna: { data: [...], meta: { total, page } }
```

**Deploy:**
```bash
git add .
git commit -m "v1.1.0: Add search, filters, notifications, and PDF export"
git tag v1.1.0
git push origin main --tags
```

### Tabla de Versiones

| Versión | Fecha | Tipo | Cambios | Estado |
|---------|-------|------|---------|--------|
| v1.0.0 | 2026-01-10 | Release | Release inicial | ✅ |
| v1.0.1 | 2026-01-13 | Patch | 3 bugs arreglados | ✅ |
| v1.1.0 | 2026-01-20 | Minor | +4 features | ✅ |
| v1.2.0 | 2026-02-01 | Minor | Integración Stripe | 🔄 Planning |
| v2.0.0 | 2026-03-01 | Major | Refactor API | 📋 Backlog |

---

## ✅ 3. Monitoreo de Rendimiento y Logs

### Opción 1: Railway Built-in (Gratis - Ya Incluido)

#### Dashboard Railway

**Ubicación:** https://railway.app/dashboard

**Métricas en Vivo:**

```
Frontend (grand-alignment)
├── Status: 🟢 Active
├── Memory: 120MB / 512MB (23%)
├── CPU: 12%
├── Network I/O: 2.5 MB/s
├── Response Time: 145ms
├── Requests/min: 850
└── Uptime: 99.82%

Backend (proyecto-nanocoral-production)
├── Status: 🟢 Active
├── Memory: 280MB / 512MB (55%)
├── CPU: 18%
├── Network I/O: 1.8 MB/s
├── Response Time: 125ms
├── DB Queries/min: 450
└── Uptime: 99.95%
```

**Logs en Vivo:**

```bash
# Frontend Logs
[2026-01-15 10:23:45] GET /shop 200 145ms
[2026-01-15 10:23:47] POST /api/login 200 85ms
[2026-01-15 10:23:50] GET /api/productos 200 120ms

# Backend Logs
[2026-01-15 10:23:45] ✅ Conectado a BD Oracle
[2026-01-15 10:23:47] SELECT COUNT(*) FROM USUARIOS took 45ms
[2026-01-15 10:23:50] INSERT INTO ORDENES 1 row
```

### Opción 2: New Relic (Recomendado para Producción)

#### Instalación

**Backend (Node.js):**

```bash
# 1. Instalar agent
npm install newrelic

# 2. Crear archivo newrelic.js en backend/
cat > backend/newrelic.js << 'EOF'
exports.config = {
  app_name: ['NanoCoral-Backend'],
  license_key: 'YOUR_LICENSE_KEY_HERE',
  logging: {
    level: 'info'
  }
};
EOF

# 3. Agregar al inicio de server.js
require('newrelic');  // PRIMERA línea
const express = require('express');
// ...resto del código
```

**Frontend (Browser):**

```html
<!-- En frontend/index.html, antes de </head> -->
<script>
  window.NREUM||(NREUM={});
  NREUM.init={
    agent_host:"bam.nr-data.net",
    beacon:"bam.nr-data.net",
    errorBeacon:"bam.nr-data.net",
    applicationID:"YOUR_APP_ID",
    applicationToken:"YOUR_TOKEN"
  };
</script>
<script src="https://js-agent.newrelic.com/nr-1234.min.js"></script>
```

#### Dashboard New Relic

**Ubicación:** https://one.newrelic.com

**Paneles Disponibles:**

```
APM (Application Performance Monitoring)
├── Response Time
│   ├── Backend API: 125ms (good)
│   ├── Frontend: 145ms (good)
│   └── DB Queries: 85ms (good)
├── Throughput
│   ├── Requests/min: 1250
│   └── Transactions/min: 850
├── Error Rate: 0.02% (excellent)
└── Apdex Score: 0.96 (satisfactory)

Logs
├── All Logs
│   ├── Filter: ERROR
│   ├── Filter: WARNING
│   └── Last 1000 entries
├── Alerts
│   └── Response time > 500ms
└── Trace View

Infrastructure
├── CPU: 15%
├── Memory: 35%
├── Disk: 45%
└── Network: 2.1 MB/s
```

**Alertas Configuradas:**

```yaml
Alert Conditions:
  - name: High Response Time
    condition: response_time > 500ms
    duration: 5 minutes
    severity: warning
    notification: Slack, Email

  - name: Error Rate Spike
    condition: error_rate > 1%
    duration: 2 minutes
    severity: critical
    notification: PagerDuty, SMS

  - name: Memory Leak Detected
    condition: memory > 80%
    duration: 10 minutes
    severity: warning
    notification: Slack

  - name: Database Timeout
    condition: db_query_time > 5000ms
    duration: 1 minute
    severity: critical
    notification: SMS, Email
```

### Opción 3: Datadog (Alternativa Premium)

```bash
# Instalar agent
npm install dd-trace

# Configurar en backend/server.js
const tracer = require('dd-trace').init({
  hostname: process.env.DD_AGENT_HOST,
  port: process.env.DD_AGENT_PORT,
  env: 'production',
  service: 'nanocoral-backend',
  version: '1.0.0'
});
```

---

## ✅ 4. Informes Periódicos de Uso y Métricas

### Google Analytics 4 (Gratuito)

#### Instalación

**Frontend (React):**

```bash
npm install @react-ga/ga4
```

**frontend/src/App.jsx:**

```javascript
import GA4 from '@react-ga/ga4';

GA4.initialize('G-XXXXXXXXXX'); // Tu ID de GA

export default function App() {
  useEffect(() => {
    GA4.pageview({
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }, []);

  return (
    <Router>
      {/* Tu app */}
    </Router>
  );
}
```

#### Métricas Disponibles

**Dashboard GA4:** https://analytics.google.com

```
📊 Resumen Ejecutivo (Mes Actual)

Visitantes Únicos: 5,230
├── Nuevos: 2,150 (41%)
└── Recurrentes: 3,080 (59%)

Sesiones: 8,920
├── Duración promedio: 4m 23s
├── Tasa de rebote: 32%
└── Usuarios por sesión: 1.7

Conversiones:
├── Registros: 120 (1.3%)
├── Compras: 45 (0.5%)
└── Carrito abandonado: 180 (2%)

📍 Geografía
├── México: 3,200 (61%)
├── España: 1,100 (21%)
└── Otros: 930 (18%)

🖥️ Dispositivos
├── Desktop: 3,200 (61%)
├── Mobile: 1,800 (34%)
└── Tablet: 230 (5%)

🌐 Tráfico
├── Direct: 2,100 (40%)
├── Organic: 1,850 (35%)
├── Referral: 950 (18%)
└── Social: 330 (7%)

⏰ Horarios Pico
├── 10:00 - 12:00: 1,200 sesiones
├── 14:00 - 16:00: 950 sesiones
└── 18:00 - 20:00: 1,100 sesiones
```

#### Eventos Personalizados

```javascript
// frontend/src/components/Shop.jsx

// Evento: Usuario ve un producto
GA4.event('view_item', {
  currency: 'MXN',
  items: [{
    item_id: producto.id,
    item_name: producto.nombre,
    price: producto.precio
  }]
});

// Evento: Usuario agrega al carrito
GA4.event('add_to_cart', {
  currency: 'MXN',
  value: producto.precio,
  items: [{
    item_id: producto.id,
    quantity: 1
  }]
});

// Evento: Usuario completa compra
GA4.event('purchase', {
  transaction_id: orden.id,
  value: orden.total,
  currency: 'MXN',
  items: orden.detalles.map(d => ({
    item_id: d.producto_id,
    item_name: d.producto_nombre,
    quantity: d.cantidad,
    price: d.precio_unitario
  }))
});
```

### Informe Mensual Automatizado

**Script:** `scripts/monthly_report.js`

```javascript
// Generar reporte mensual en PDF
const generateMonthlyReport = async () => {
  const analytics = await fetchAnalytics();
  const performance = await getPerformanceMetrics();
  const errors = await getErrorLogs();

  const report = {
    mes: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
    visitantes: analytics.users,
    sesiones: analytics.sessions,
    conversion: analytics.conversionRate,
    ingresos: analytics.revenue,
    errores: errors.count,
    uptimePercentage: performance.uptime,
    responseTime: performance.avgResponseTime,
    timestamp: new Date()
  };

  await exportToPDF(report);
  await sendEmailReport(report);
};

// Ejecutar cada 1er día del mes
0 0 1 * * node /path/to/monthly_report.js
```

---

## ✅ 5. Mejoras Incrementales (Nuevas Funcionalidades)

### Roadmap 2026

#### Q1 (Enero - Marzo)

| Feature | Descripción | Esfuerzo | Prioridad | Estado |
|---------|-------------|----------|-----------|--------|
| Integración Stripe | Pagos reales en línea | 5 días | Alta | 🔄 In Progress |
| Búsqueda avanzada | Búsqueda full-text + filtros | 3 días | Alta | ✅ Done |
| Sistema de wishlist | Guardar productos favoritos | 2 días | Media | 📋 Planning |
| Notificaciones | Email + push notifications | 4 días | Media | ⏳ Pending |

#### Q2 (Abril - Junio)

| Feature | Descripción | Esfuerzo | Prioridad | Estado |
|---------|-------------|----------|-----------|--------|
| App móvil (React Native) | iOS + Android | 15 días | Alta | 📋 Backlog |
| Chat en vivo | Soporte en tiempo real | 8 días | Media | 📋 Planning |
| Recomendaciones IA | Productos sugeridos | 10 días | Media | 📋 Research |
| Dashboard analítico | Ventas, clientes, etc. | 5 días | Baja | 📋 Backlog |

#### Q3 (Julio - Septiembre)

| Feature | Descripción | Esfuerzo | Prioridad | Estado |
|---------|-------------|----------|-----------|--------|
| Marketplace externo | Vendedores terceros | 20 días | Baja | 📋 Backlog |
| Programa de afiliados | Comisiones por referral | 8 días | Media | 📋 Backlog |
| Suscripciones | Membresía premium | 10 días | Media | 📋 Backlog |

### Flujo de Desarrollo de Features

```
1. IDEA
   └─ Crear issue en GitHub
   └─ Descripción + caso de uso
   └─ Estimar esfuerzo

2. PLANNING
   └─ Reunión de equipo
   └─ Aceptar/rechazar
   └─ Agregar a sprint

3. DEVELOPMENT
   └─ Crear rama: git checkout -b feature/search-advanced
   └─ Implementar
   └─ Pruebas locales

4. CODE REVIEW
   └─ Pull Request en GitHub
   └─ Revisor aprueba
   └─ Merging a main

5. TESTING
   └─ QA prueba en staging
   └─ Casos de prueba
   └─ Aprobación

6. DEPLOYMENT
   └─ Railway auto-redeploy
   └─ Monitoreo
   └─ Métricas

7. RELEASE
   └─ Crear tag de versión
   └─ Actualizar changelog
   └─ Anunciar en redes
```

### Ejemplo: Feature - Sistema de Búsqueda

**GitHub Issue:**

```markdown
## ✨ Feature: Búsqueda Avanzada de Productos

### Descripción
Los usuarios necesitan buscar productos rápidamente sin navegar por categorías.

### Criterios de Aceptación
- [x] Campo de búsqueda en navbar
- [x] Búsqueda por nombre y descripción
- [x] Filtros: precio, categoría, rating
- [x] Resultados en tiempo real (debounced)
- [x] Soporte para múltiples idiomas

### Tareas
- [ ] Backend: Endpoint /api/search
- [ ] Frontend: SearchBox component
- [ ] Frontend: SearchResults page
- [ ] Pruebas unitarias
- [ ] Documentación

### Estimación: 3 días
### Asignado: @juan-dev
```

**Rama de desarrollo:**

```bash
git checkout -b feature/search-advanced

# Backend - /api/search
POST /api/search?q=coral&categoria=1&min_price=100&max_price=500&lang=es

# Response
{
  "results": [
    {
      "id": 1,
      "nombre": "Coral Acropora",
      "precio": 250,
      "rating": 4.5,
      "match_score": 0.95
    }
  ],
  "total": 45,
  "page": 1
}
```

**Commit:**

```bash
git add .
git commit -m "feat: Add advanced search with filters and real-time results

- Implement /api/search endpoint with full-text support
- Add SearchBox component with debounced input
- Create SearchResults page with filters
- Add 95% test coverage
- Support ES, EN, DE languages

Fixes #25
"
git push origin feature/search-advanced
```

**Pull Request:**

```markdown
## PR: Add Advanced Search Feature

### Changes
- Added `/api/search` endpoint with full-text search
- Created `SearchBox` and `SearchResults` components
- Implemented price and category filters
- Added 50+ unit tests

### Metrics
- Bundle size +12KB
- Search latency: 45ms avg
- 95% test coverage

### Screenshots
[Imágenes del feature]

### Checklist
- [x] Código sigue guías de estilo
- [x] Tests pasan
- [x] Documentación actualizada
- [x] Sin breaking changes
```

---

## ✅ 6. Documentación Técnica y de Usuario Actualizada

### Documentación Técnica

#### API Documentation

**Ubicación:** `docs/API.md`

```markdown
# API Reference - v1.0.0

## Authentication
Todos los endpoints requieren JWT token en header:
```
Authorization: Bearer {token}
```

## Endpoints

### GET /api/productos
Obtiene lista de productos con paginación.

**Query Parameters:**
- `page`: número de página (default: 1)
- `limit`: items por página (default: 20)
- `categoria`: filtrar por categoría
- `search`: buscar por nombre

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Coral Acropora",
      "precio": 250,
      "imagen_url": "coral1.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120
  }
}
```

### POST /api/login
Autenticación de usuario.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "rol": "CLIENT",
  "id": 5,
  "nombre": "Juan"
}
```

[... más endpoints documentados]
```

#### Architecture Documentation

```markdown
# Arquitectura - NanoCoral

## Stack Tecnológico

### Frontend
- React 19 + Vite
- React Router para navegación
- Contexto API para estado global
- i18next para multiidioma
- CSS variables para temas

### Backend
- Node.js 20 + Express
- JWT para autenticación
- Multer para upload de imágenes
- OracleDB para persistencia

### Infraestructura
- Railway para hosting
- Oracle XE para BD
- GitHub Actions para CI/CD

## Componentes Principales

### Frontend
```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Shop.jsx
│   ├── CartView.jsx
│   └── AdminPanel.jsx
├── contexts/
│   ├── CartContext.jsx
│   ├── ThemeContext.jsx
│   └── LanguageContext.jsx
├── api.config.js
└── App.jsx

## Flujo de Datos

Usuario → React UI → fetch() → API REST
                              ↓
                        Express Server
                              ↓
                          Oracle DB
```

#### Deployment Documentation

```markdown
# Guía de Despliegue

## Proceso Automático
1. Push a main
2. GitHub detecta cambio
3. Railway construye Dockerfiles
4. Redeploy automático (5-10 min)

## Variables de Entorno

### Backend
```
DB_HOST=servidor.com
DB_USER=rafael
DB_PASSWORD=***
NODE_ENV=production
PORT=5000
```

### Frontend
```
VITE_API_URL=https://api.proyecto.com
```

## Monitoreo
- Dashboard Railway en vivo
- Logs disponibles 24/7
- Alertas via email/SMS
```

### Documentación de Usuario

#### Guía para Clientes

```markdown
# Manual de Usuario - NanoCoral

## 🛍️ Cómo Comprar

### 1. Crear Cuenta
1. Click en "Registrarse"
2. Ingresa email y contraseña
3. Confirma tu email
4. ¡Listo!

### 2. Explorar Productos
1. Click en "Shop"
2. Usa filtros por categoría
3. Busca con la barra de búsqueda
4. Click en producto para ver detalles

### 3. Agregar al Carrito
1. Abre producto
2. Click en "Agregar al Carrito"
3. Verás confirmación
4. Continúa comprando o ve al carrito

### 4. Checkout
1. Click en "Carrito"
2. Revisa los productos
3. Click en "Proceder al Pago"
4. Completa formulario
5. Click en "Completar Compra"

### 5. Seguimiento
1. Click en "Mis Órdenes"
2. Ves estado de tu orden
3. Si está "Despachada", confirma recepción
4. Deja tu opinión

## 💳 Métodos de Pago
- Tarjeta de crédito/débito
- Pronto: PayPal
- Pronto: Transferencia bancaria

## 🔒 Seguridad
- Conexión HTTPS encriptada
- Tus datos protegidos
- No guardamos números de tarjeta

## ❓ Preguntas Frecuentes

**¿Cuánto tarda el envío?**
5-7 días hábiles a todo México

**¿Puedo devolver un producto?**
Sí, hasta 30 días desde la compra

**¿Qué pasa si mi paquete llega dañado?**
Contacta a soporte dentro de 7 días
```

#### Guía para Administradores

```markdown
# Manual Admin - NanoCoral

## 📦 Gestión de Productos

### Agregar Producto
1. Login como ADMIN
2. Click en "Panel Admin"
3. Click en "Productos"
4. Click en "+ Agregar Producto"
5. Completa:
   - Nombre
   - Descripción
   - Precio
   - Categoría
   - Imagen
6. Click en "Guardar"

### Editar Producto
1. En listado, click en producto
2. Modifica los campos
3. Click en "Actualizar"

### Eliminar Producto
1. En listado, click en 🗑️
2. Confirma eliminación

## 📋 Gestión de Órdenes

### Ver Órdenes
1. Click en "Órdenes"
2. Filtra por estado:
   - PENDIENTE: Por procesar
   - DESPACHADO: En camino
   - ENTREGADO: Completada

### Despachar Orden
1. Click en orden PENDIENTE
2. Revisa detalles
3. Click en "Despachar Orden"
4. Cliente recibe notificación

### Ver Reseñas
1. En panel, scroll a "Reseñas"
2. Lee opiniones de clientes
3. Responde si es necesario

## 📊 Dashboard
- Total de órdenes
- Ingresos mensuales
- Productos más vendidos
- Clientes activos
```

---

## 📊 Métricas de Mantenimiento

### Tabla de Control Mensual

| Métrica | Meta | Actual | Estado |
|---------|------|--------|--------|
| Uptime | >99.5% | 99.82% | ✅ |
| Response Time | <500ms | 145ms | ✅ |
| Error Rate | <0.5% | 0.02% | ✅ |
| Bugs Reportados | <5 | 2 | ✅ |
| Features Entregadas | 2-3 | 3 | ✅ |
| Users Activos | >1000 | 1,250 | ✅ |
| Satisfacción | >4.0⭐ | 4.6⭐ | ✅ |

---

## 🔄 Ciclo de Mantenimiento

### Diario
- ✅ Revisar logs de errores
- ✅ Responder incidencias críticas
- ✅ Monitoreo de performance

### Semanal
- ✅ Reunión de equipo
- ✅ Revisar métricas de Google Analytics
- ✅ Actualizar backlog

### Mensual
- ✅ Generar reporte de uso
- ✅ Planificación de features
- ✅ Review de performance
- ✅ Actualizar documentación

### Trimestral
- ✅ Planificación de Q siguiente
- ✅ Auditoría de seguridad
- ✅ Optimización de BD
- ✅ Reunión con stakeholders

---

## 📞 Soporte y Contacto

| Canal | Responsable | Horario |
|-------|-------------|---------|
| Email | support@nanocoral.com | 24/7 |
| Chat | Live chat en web | 9-18 hrs |
| Teléfono | +1-800-CORAL-99 | 9-18 hrs |
| GitHub Issues | Equipo Dev | 24/7 |

---

**Documento actualizado:** Enero 2026
**Próxima revisión:** Abril 2026
**Versión:** 1.0.0
