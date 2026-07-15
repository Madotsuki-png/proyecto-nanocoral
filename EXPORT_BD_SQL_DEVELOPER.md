# 🗄️ GUÍA: EXPORTAR BD DESDE SQL DEVELOPER E IMPORTAR EN PRODUCCIÓN

## 📍 Situación Actual

```
Tu máquina (localhost:1521)
├── SQL Developer instalado ✅
├── Oracle XE corriendo ✅
└── BD: usuario=rafael, sid=xe

Objetivo: Llevar datos a servidor de PRODUCCIÓN
```

---

## 🔍 PASO 1: Verificar Datos en SQL Developer

### 1.1 Conectar en SQL Developer

1. **Abre SQL Developer**
2. **Click en "+New Connection"**
3. Completa:
   ```
   Connection Name: desarrollo
   Username: rafael
   Password: 123456789
   Hostname: localhost
   Port: 1521
   SID: xe
   ```
4. **Test Connection** → Debe decir "Status: Success"
5. **Connect**

### 1.2 Verificar Datos

```sql
-- Ejecuta estas queries en SQL Developer

-- 1. Contar registros
SELECT 'USUARIOS' AS tabla, COUNT(*) AS cantidad FROM USUARIOS
UNION ALL
SELECT 'PRODUCTOS', COUNT(*) FROM PRODUCTOS
UNION ALL
SELECT 'ORDENES', COUNT(*) FROM ORDENES
UNION ALL
SELECT 'ORDEN_DETALLES', COUNT(*) FROM ORDEN_DETALLES
UNION ALL
SELECT 'RESENAS', COUNT(*) FROM RESENAS
UNION ALL
SELECT 'CATEGORIAS', COUNT(*) FROM CATEGORIAS;

-- 2. Ver estructura de USUARIOS
DESC USUARIOS;

-- 3. Ver un producto
SELECT * FROM PRODUCTOS WHERE ROWNUM <= 1;
```

**Esperado:**
```
TABLA              CANTIDAD
------------- ---------
USUARIOS             5
PRODUCTOS           12
ORDENES              3
ORDEN_DETALLES       [varios]
RESENAS              2
CATEGORIAS           3
```

---

## 💾 PASO 2: Exportar Datos desde SQL Developer

### Opción A: Export Wizard de SQL Developer (Recomendado - GUI)

#### 2.A.1 Exportar TABLA POR TABLA

1. **En SQL Developer, click derecho en tabla "USUARIOS"**
2. **Export → Select Export Type**
3. **Elige: "SQL INSERT"** o **"Excel"** (más fácil)
4. **Location:** Guarda en `./backups/`
5. **Repeat para cada tabla:**
   - CATEGORIAS
   - PRODUCTOS
   - USUARIOS
   - ORDENES
   - ORDEN_DETALLES
   - RESENAS

**Estructura de carpeta:**
```
./backups/
├── CATEGORIAS.sql
├── PRODUCTOS.sql
├── USUARIOS.sql
├── ORDENES.sql
├── ORDEN_DETALLES.sql
└── RESENAS.sql
```

#### 2.A.2 Alternativa: Export a Data Pump

1. **En SQL Developer:**
2. **Tools → Export Data**
3. **Format: Oracle Data Pump**
4. **Nombre archivo: nanocoral_data.dmp**
5. **Ubicación: ./backups/nanocoral_data.dmp**
6. **Selecciona tablas a exportar**
7. **Start Export**

**Esperado:**
```
Export Status: SUCCESS
File created: nanocoral_data.dmp (tamaño: 2-5 MB)
```

---

## 🔗 PASO 3: ¿Dónde está tu servidor de PRODUCCIÓN?

### Importante: Necesitamos saber DÓNDE desplegar

**Opción 1: Servidor Oracle en AWS / Azure / Digital Ocean**
```
Si tienes un servidor en la nube:
- IP: 54.123.45.67 (ejemplo)
- Puerto: 1521
- Usuario: oracle
- SID: xe

→ Saltamos a PASO 5 (Conectar por SSH)
```

**Opción 2: Servidor Local (otra máquina en red)**
```
Si tienes otro servidor en tu red local:
- IP: 192.168.1.100 (ejemplo)
- Puerto: 1521

→ Conectar directamente (PASO 4)
```

**Opción 3: Usar Oracle Cloud (Gratis - Recomendado)**
```
Oracle ofrece una BD GRATIS en la nube:
- 20 GB storage
- 1 OCPU
- Always Free

→ Crear BD en Oracle Cloud (PASO 4.B)
```

**¿Cuál es tu caso?** Por ahora asumo que USARÁS LA MISMA BD LOCAL (localhost) para desarrollo Y producción.

---

## 📤 PASO 4: Alternativas de Sincronización

### Opción A: Misma BD Local (Más Simple)

Si usas la misma BD tanto en desarrollo como en producción (NO recomendado pero es lo más simple ahora):

```bash
# Railway ya tiene variables de entorno:
DB_HOST=localhost
DB_PORT=1521
DB_USER=rafael
DB_PASSWORD=123456789
DB_SID=xe

# Pero esto falla porque Railway no puede acceder a localhost
# ❌ ESTO NO FUNCIONA
```

### Opción B: Oracle Cloud (Recomendado para Producción)

**Pasos:**

1. **Crea cuenta en Oracle Cloud:**
   - https://www.oracle.com/cloud/free/
   - Sign up (Gratis)
   - Verifica tu email

2. **Crea BD autónoma:**
   - MySQL / Oracle Database
   - Always Free tier
   - Wait 5-10 minutos para creación

3. **Obtén credenciales:**
   - Host: xxxxxxx.oraclecloud.com
   - Port: 1521
   - SID: xxxxxx
   - User: admin
   - Password: [que estableces]

4. **Actualiza variables en Railway:**
   ```
   DB_HOST=xxxxxxx.oraclecloud.com
   DB_PORT=1521
   DB_USER=admin
   DB_PASSWORD=[tu_password]
   DB_SID=xxxxxx
   ```

5. **Importa tus datos ahí**

---

## 📋 PASO 5: Opción Realista - Servidor Dedicado

### Si tienes acceso SSH a un servidor (AWS, etc.)

```bash
# 1. Conectar por SSH
ssh usuario@54.123.45.67

# 2. Ver si Oracle está corriendo
sqlplus / as sysdba
SQL> SELECT NAME FROM V$DATABASE;
# Debería salir: XE (o tu BD)

# 3. Crear usuario oracle (si no existe)
SQL> CREATE USER rafael IDENTIFIED BY "123456789";
SQL> GRANT DBA TO rafael;
```

---

## 🚀 PASO 6: Importar Datos (Depende de tu caso)

### Si usas Oracle Cloud:

```bash
# En tu máquina local:

# 1. Exporta desde SQL Developer (PASO 2)
# Archivo: nanocoral_data.dmp

# 2. Conecta a la BD en Oracle Cloud
sqlplus rafael/123456789@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=xxxxxxx.oraclecloud.com)(PORT=1521))(CONNECT_DATA=(SID=xxxxxx)))

# 3. Importa los datos
impdp rafael/123456789@(DESCRIPTION=...) \
  DUMPFILE=nanocoral_data.dmp \
  FULL=Y
```

---

## 💡 RECOMENDACIÓN FINAL

**Para tu proyecto escolar, te sugiero:**

1. **Opción Más Simple (Ahora):**
   - Mantén BD en tu máquina local
   - Railway se conecta via IP pública de tu router
   - O: Usa ngrok para exponer puerto 1521

2. **Opción Mejor Práctica (Recomendado):**
   - Crea BD en Oracle Cloud (Gratis)
   - Railway conecta directamente
   - Datos en la nube = siempre disponibles

3. **Opción Producción Real:**
   - Renta servidor Linux con Oracle XE
   - DigitalOcean, AWS, Linode, etc.
   - Costo: $5-15 USD/mes

---

## 🎯 ¿CUÁL QUIERES HACER?

**Responde una de estas:**

A) **Mantener BD local** (localhost)
   - Próximo paso: Exponer puerto 1521 por ngrok

B) **Crear BD en Oracle Cloud** (Gratis)
   - Próximo paso: Crear cuenta Oracle Cloud

C) **Otro servidor** (especifica cuál)
   - Próximo paso: Obtener credenciales

**¿Cuál prefieres?** Dime y continúo con pasos exactos.
