# 🗄️ GUÍA: SUBIR BASE DE DATOS A PRODUCCIÓN

## 📋 Pre-requisitos

- ✅ Acceso SSH al servidor Oracle
- ✅ Credenciales de usuario `rafael`
- ✅ Espacio en disco: mínimo 2GB
- ✅ `expdp` y `impdp` instalados en Oracle

---

## 🔍 PASO 1: Verificar Estado de BD Actual

### En tu máquina local:

```bash
# Conectar a la BD local (desarrollo)
sqlplus rafael/123456789@xe

# Verificar tablas
SQL> SELECT COUNT(*) FROM USUARIOS;
SQL> SELECT COUNT(*) FROM PRODUCTOS;
SQL> SELECT COUNT(*) FROM ORDENES;
SQL> SELECT COUNT(*) FROM RESENAS;

SQL> EXIT;
```

**Esperado:**
```
COUNT(*)
--------
       5  (usuarios)
      12  (productos)
       3  (órdenes)
       2  (reseñas)
```

---

## 💾 PASO 2: Exportar Datos Locales

### Windows/Mac/Linux:

```bash
# Crear directorio para backups
mkdir -p ./backups

# Exportar solo datos (sin estructura)
expdp rafael/123456789 \
  DUMPFILE=nanocoral_data.dmp \
  LOGFILE=export_log.log \
  FULL=Y

# O si prefieres exportar tablas específicas:
expdp rafael/123456789 \
  DUMPFILE=nanocoral_tables.dmp \
  LOGFILE=export_log.log \
  TABLES=USUARIOS,PRODUCTOS,ORDENES,ORDEN_DETALLES,RESENAS,CATEGORIAS
```

**Debería terminar con:**
```
Export terminated successfully without warnings
```

---

## 🔗 PASO 3: Conectar al Servidor Oracle en Producción

### Opción A: SSH + sqlplus (Recomendado)

```bash
# Conectar por SSH
ssh usuario@ip_servidor_oracle

# Una vez dentro del servidor, conectar a Oracle
sqlplus rafael/123456789@xe

# Verificar que está vacía la BD (o hacer backup antes)
SQL> SELECT COUNT(*) FROM USUARIOS;
# Esperado: 0 (o el número de registros actuales)

SQL> EXIT;
```

### Opción B: SQL*Plus Directo Remoto

```bash
# Desde tu máquina local, conectar directo
sqlplus rafael/123456789@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=IP_SERVIDOR)(PORT=1521))(CONNECT_DATA=(SID=xe)))
```

---

## 📤 PASO 4: Transferir Archivo DMP al Servidor

### Via SCP (Linux/Mac):

```bash
# Desde tu máquina local
scp ./nanocoral_tables.dmp usuario@ip_servidor:/home/usuario/

# Verificar
ssh usuario@ip_servidor "ls -lh /home/usuario/nanocoral_tables.dmp"
```

### Via SFTP (Windows):

```bash
# Usar WinSCP o Filezilla
# Host: ip_servidor
# Usuario: usuario
# Contraseña: [tu_contraseña]

# Arrastra el archivo .dmp a la carpeta del servidor
```

### Via Oracle Import Directo (Si tienes acceso directo a BD):

```bash
# Saltar este paso si usaste sqlplus remoto
```

---

## 🔄 PASO 5: Importar Datos en Producción

### En el servidor Oracle:

```bash
# SSH al servidor
ssh usuario@ip_servidor

# Crear directorio para Oracle Data Pump
mkdir -p /u01/oradata/pump

# Mover archivo DMP
sudo mv ~/nanocoral_tables.dmp /u01/oradata/pump/

# Cambiar permisos
sudo chown oracle:oinstall /u01/oradata/pump/nanocoral_tables.dmp

# Conectar a Oracle
sqlplus / as sysdba

# Crear directorio Oracle (si no existe)
SQL> CREATE DIRECTORY DATA_PUMP_DIR AS '/u01/oradata/pump';
SQL> GRANT READ,WRITE ON DIRECTORY DATA_PUMP_DIR TO rafael;
SQL> EXIT;
```

### Ejecutar Import:

```bash
# En el servidor, como usuario oracle
impdp rafael/123456789 \
  DUMPFILE=nanocoral_tables.dmp \
  LOGFILE=import_log.log \
  FULL=Y \
  COMMIT=Y

# O si importas solo tablas:
impdp rafael/123456789 \
  DUMPFILE=nanocoral_tables.dmp \
  LOGFILE=import_log.log \
  TABLES=USUARIOS,PRODUCTOS,ORDENES,ORDEN_DETALLES,RESENAS,CATEGORIAS
```

**Esperado:**
```
Table USUARIOS imported
Table PRODUCTOS imported
Table ORDENES imported
Table ORDEN_DETALLES imported
Table RESENAS imported
Table CATEGORIAS imported

Import terminated successfully without warnings
```

---

## ✅ PASO 6: Verificar Datos en Producción

### En el servidor Oracle:

```bash
sqlplus rafael/123456789@xe

# Contar registros
SQL> SELECT 'USUARIOS' AS tabla, COUNT(*) AS cantidad FROM USUARIOS
     UNION ALL
     SELECT 'PRODUCTOS', COUNT(*) FROM PRODUCTOS
     UNION ALL
     SELECT 'ORDENES', COUNT(*) FROM ORDENES
     UNION ALL
     SELECT 'RESENAS', COUNT(*) FROM RESENAS;

# Debería mostrar lo mismo que en desarrollo
```

**Ejemplo de salida:**
```
TABLA            CANTIDAD
------------- ----------
USUARIOS               5
PRODUCTOS             12
ORDENES               3
RESENAS               2
```

### Verificar integridad:

```bash
-- Revisar producto específico
SQL> SELECT ID, NOMBRE, PRECIO FROM PRODUCTOS WHERE ID = 1;

-- Revisar usuario
SQL> SELECT ID, EMAIL, ROL FROM USUARIOS WHERE EMAIL = 'admin@test.com';

-- Revisar orden completa
SQL> SELECT * FROM ORDENES WHERE ID = 1;
SQL> SELECT * FROM ORDEN_DETALLES WHERE ORDEN_ID = 1;

SQL> EXIT;
```

---

## 🧪 PASO 7: Probar Conectividad desde Railway

### Verificar que Railway puede conectar:

```bash
# En tu máquina local, SSH al servidor
ssh usuario@ip_servidor

# Instalar telnet (si no está)
sudo apt-get install telnet

# Probar conectividad desde el servidor hacia Oracle (local)
telnet localhost 1521

# Debería responder:
# Connected to localhost.
# Escape character is ']'.
```

### Si Railway está en la nube:

```bash
# Desde la máquina de Railway
# En los logs de Railway, deberías ver:
# ✅ Conectado a BD Oracle
# ✅ SELECT COUNT(*) FROM USUARIOS

# Si no conecta, revisar:
# - IP/Host correcto en variables de entorno
# - Puerto 1521 abierto en firewall
# - Usuario/contraseña correctos
```

---

## 🔄 PASO 8: Actualizar Variables en Railway

### Backend Service en Railway:

1. Ve a **https://railway.app/dashboard**
2. Click en el servicio **"proyecto-nanocoral-production"** (backend)
3. Click pestaña **"Variables"**
4. Verifica que estas variables apunten al servidor PRODUCCIÓN:

```
DB_HOST = [IP o dominio del servidor Oracle en producción]
DB_PORT = 1521
DB_USER = rafael
DB_PASSWORD = 123456789
DB_SID = xe
```

5. Si las cambiaste, click **"Redeploy"**

---

## 📊 PASO 9: Verificar Datos Desde Frontend

### Prueba en vivo:

1. Abre el frontend: `https://grand-alignment.up.railway.app`
2. Click en **"EXPLORAR"** o **"Shop"**
3. ¿Se cargan los 12 productos?
4. ¿El precio es correcto?

### Verifica las órdenes:

1. **Login como usuario:** email / contraseña
2. Click en **"Mis Órdenes"**
3. ¿Ves las 3 órdenes de prueba?
4. ¿Los detalles son correctos?

### Si todo funciona: ✅ ¡BD SINCRONIZADA!

---

## 🛠️ TROUBLESHOOTING

### Error: "ORA-01017: invalid username/password"

```bash
# Verificar credenciales en el servidor
sqlplus rafael/123456789

# Si falla, resetear usuario
sqlplus / as sysdba
SQL> ALTER USER rafael IDENTIFIED BY "123456789";
SQL> EXIT;
```

### Error: "ORA-12514: TNS:listener does not currently know of service requested"

```bash
# El listener de Oracle no está corriendo
# En el servidor:
sudo systemctl start oracle-listener

# Verificar status
sqlplus / as sysdba
SQL> SELECT STATUS FROM V$INSTANCE;
```

### Error: "Permission denied" en SCP

```bash
# El usuario no tiene permisos en el directorio
# Usa sudo:
sudo scp usuario@tu-pc:~/nanocoral_tables.dmp /u01/oradata/pump/

# O cambia permisos:
sudo chmod 777 /u01/oradata/pump/
```

### Railway dice: "Cannot connect to database"

```bash
# En Railway Console (logs del backend):
# Busca líneas tipo:
# ❌ Error al conectar a BD Oracle

# Soluciones:
# 1. Verifica que el host es PUBLIC (no localhost)
# 2. Verifica que el puerto 1521 está abierto en firewall
# 3. Prueba conectar desde otra máquina:
    telnet ip_servidor 1521

# Si todo falla:
# 4. En el servidor, reinicia Oracle:
    sudo systemctl restart oracle
```

---

## 📋 Checklist Final

- [ ] Datos exportados desde desarrollo
- [ ] Archivo .dmp transferido al servidor
- [ ] Directorio Oracle Data Pump creado
- [ ] Datos importados en producción
- [ ] Conteo de registros verificado
- [ ] Variables de Railway actualizadas
- [ ] Backend redeploy completado
- [ ] Frontend conecta a BD producción
- [ ] Productos se ven en tienda
- [ ] Órdenes se ven en "Mis Órdenes"
- [ ] Login funciona con usuarios producción

---

## 🎯 Resumen

**Antes:**
```
Desarrollo (Local)    →    Producción (Vacía)
BD: 5 usuarios            BD: sin datos
   12 productos          
    3 órdenes            
```

**Después:**
```
Desarrollo (Local)    →    Producción (Sincronizada) ✅
BD: 5 usuarios            BD: 5 usuarios
   12 productos              12 productos
    3 órdenes                 3 órdenes
                          
Frontend en la nube → conecta a BD en producción → datos visibles ✅
```

---

**¡Listo! Tu base de datos está en producción.**

Si algo falla, revisa el checklist de troubleshooting.
