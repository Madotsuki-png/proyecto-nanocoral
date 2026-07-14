const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Crear carpeta de imágenes si no existe
const imagesDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configurar multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)'));
    }
  }
});

// Servidor de imágenes
app.use('/images', express.static('public/images'));

// Configuración de Oracle
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB]; 
oracledb.autoCommit = true;

const dbConfig = {
  user: process.env.DB_USER || 'Rafael',
  password: process.env.DB_PASSWORD || '123456789',
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DB_HOST || 'localhost'})(PORT=${process.env.DB_PORT || 1521}))(CONNECT_DATA=(SID=${process.env.DB_SID || 'xe'})))`
};

// 1. Ruta para obtener todos los productos
app.get('/api/productos', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const query = 'SELECT ID AS "id", NOMBRE AS "nombre", DESCRIPCION AS "descripcion", PRECIO AS "precio", IMAGEN_URL AS "imagen_url", STOCK AS "stock", CATEGORIA_ID AS "categoria_id" FROM PRODUCTOS';
    const result = await connection.execute(query);
    return res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    return res.status(500).json({ error: "Error al obtener productos" });
  } finally {
    if (connection) await connection.close();
  }
});

// 2. Ruta para obtener un solo producto
app.get('/api/productos/:id', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      'SELECT ID AS "id", NOMBRE AS "nombre", DESCRIPCION AS "descripcion", PRECIO AS "precio", IMAGEN_URL AS "imagen_url", STOCK AS "stock", CATEGORIA_ID AS "categoria_id" FROM PRODUCTOS WHERE ID = :id',
      [req.params.id]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener detalle:", err);
    return res.status(500).json({ error: "Error al obtener detalle" });
  } finally {
    if (connection) await connection.close();
  }
});

// 3. Ruta para obtener reseñas
app.get('/api/resenas', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT ID AS "id", USUARIO AS "usuario", COMENTARIO AS "comentario", CALIFICACION AS "calificacion" FROM RESENAS');
    return res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener reseñas:", err);
    return res.status(500).json({ error: "Error al obtener reseñas" });
  } finally {
    if (connection) await connection.close();
  }
});

// 4. Ruta para agregar un nuevo producto con carga de imagen
app.post('/api/productos', upload.single('imagen'), async (req, res) => {
  const { nombre, precio, descripcion, categoria_id } = req.body;
  let connection;
  try {
    const imagen_url = req.file ? req.file.filename : req.body.imagen_url;

    if (!imagen_url) {
      return res.status(400).json({ error: "Se requiere una imagen" });
    }

    connection = await oracledb.getConnection(dbConfig);
    const sql = `INSERT INTO PRODUCTOS (NOMBRE, PRECIO, DESCRIPCION, CATEGORIA_ID, IMAGEN_URL) 
                 VALUES (:nombre, :precio, :descripcion, :categoria_id, :imagen_url)`;
    
    await connection.execute(sql, [nombre, precio, descripcion, categoria_id, imagen_url]);
    
    return res.status(201).json({ 
      message: "Producto agregado correctamente",
      imagen_url: imagen_url
    });
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error al eliminar archivo:", unlinkErr);
      });
    }
    console.error("Error al insertar producto:", err);
    return res.status(500).json({ error: "Error al insertar producto en la base de datos" });
  } finally {
    if (connection) await connection.close();
  }
});

// 5. Ruta para registro de clientes
app.post('/api/registro', async (req, res) => {
  const { nombre, email, password, passwordConfirm } = req.body;
  let connection;
  try {
    if (!nombre || !email || !password || !passwordConfirm) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    connection = await oracledb.getConnection(dbConfig);
    const checkEmail = 'SELECT COUNT(*) AS "count" FROM USUARIOS WHERE LOWER(TRIM(EMAIL)) = LOWER(TRIM(:email))';
    const existingUser = await connection.execute(checkEmail, [email]);

    if (existingUser.rows[0].count > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const sql = `INSERT INTO USUARIOS (NOMBRE, EMAIL, PASSWORD, ROL) 
                 VALUES (:nombre, :email, :password, 'CLIENT')`;
    
    await connection.execute(sql, [nombre, email, password]);

    return res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    return res.status(500).json({ error: "Error al registrar usuario" });
  } finally {
    if (connection) await connection.close();
  }
});

// 6. Ruta para login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    const sql = 'SELECT ID AS "id", EMAIL AS "email", PASSWORD AS "password", ROL AS "rol", NOMBRE AS "nombre" FROM USUARIOS WHERE LOWER(TRIM(EMAIL)) = LOWER(TRIM(:email))';
    const result = await connection.execute(sql, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];

    if (password !== usuario.password) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'SECRETO_SUPER_SEGURO', { expiresIn: '24h' });
    res.json({ token, rol: usuario.rol, id: usuario.id, nombre: usuario.nombre });
    
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    if (connection) await connection.close();
  }
});

// 7. Ruta para crear una orden (compra)
app.post('/api/ordenes', async (req, res) => {
  const { usuario_id, productos, total, nombre_cliente, email_cliente, telefono, direccion, ciudad, estado_postal, numero_tarjeta } = req.body;
  let connection;
  try {
    console.log('Creando orden:', { usuario_id, productos, total, nombre_cliente });

    if (!usuario_id || !productos || !total || !nombre_cliente || !direccion) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    connection = await oracledb.getConnection(dbConfig);
    
    // Primero, obtener el próximo ID de la secuencia
    const idResult = await connection.execute('SELECT ORDENES_SEQ.NEXTVAL AS "id" FROM DUAL');
    const orden_id = idResult.rows[0].id;

    console.log('ID de orden generado:', orden_id);

    // Insertar la orden con el ID
    const ordenSql = `INSERT INTO ORDENES (ID, USUARIO_ID, TOTAL, ESTADO, NOMBRE_CLIENTE, EMAIL_CLIENTE, TELEFONO, DIRECCION, CIUDAD, ESTADO_POSTAL, NUMERO_TARJETA, FECHA_ORDEN) 
                      VALUES (:id, :usuario_id, :total, 'PENDIENTE', :nombre_cliente, :email_cliente, :telefono, :direccion, :ciudad, :estado_postal, :numero_tarjeta, SYSDATE)`;
    
    await connection.execute(ordenSql, [orden_id, usuario_id, total, nombre_cliente, email_cliente, telefono, direccion, ciudad, estado_postal, numero_tarjeta]);

    console.log('Orden insertada exitosamente');

    // Insertar detalles de la orden
    for (const producto of productos) {
      const detalleIdResult = await connection.execute('SELECT ORDEN_DETALLES_SEQ.NEXTVAL AS "id" FROM DUAL');
      const detalle_id = detalleIdResult.rows[0].id;

      const detalleSql = `INSERT INTO ORDEN_DETALLES (ID, ORDEN_ID, PRODUCTO_ID, CANTIDAD, PRECIO_UNITARIO) 
                          VALUES (:id, :orden_id, :producto_id, :cantidad, :precio)`;
      await connection.execute(detalleSql, [detalle_id, orden_id, producto.id, producto.cantidad || 1, producto.precio]);
    }

    console.log('Detalles de orden insertados');

    return res.status(201).json({ 
      message: "Orden creada correctamente",
      orden_id: orden_id
    });
  } catch (err) {
    console.error("Error al crear orden:", err);
    return res.status(500).json({ error: "Error al crear la orden: " + err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// 8. Ruta para obtener órdenes del admin
app.get('/api/ordenes', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `SELECT ID AS "id", USUARIO_ID AS "usuario_id", TOTAL AS "total", ESTADO AS "estado", 
                 NOMBRE_CLIENTE AS "nombre_cliente", EMAIL_CLIENTE AS "email_cliente", TELEFONO AS "telefono",
                 DIRECCION AS "direccion", CIUDAD AS "ciudad", ESTADO_POSTAL AS "estado_postal", 
                 FECHA_ORDEN AS "fecha_orden" FROM ORDENES ORDER BY FECHA_ORDEN DESC`;
    const result = await connection.execute(sql);
    return res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener órdenes:", err);
    return res.status(500).json({ error: "Error al obtener órdenes" });
  } finally {
    if (connection) await connection.close();
  }
});

// 9. Ruta para actualizar estado de orden (despachar)
app.put('/api/ordenes/:id/despachar', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 'UPDATE ORDENES SET ESTADO = :estado WHERE ID = :id';
    await connection.execute(sql, ['DESPACHADO', id]);
    return res.json({ message: "Orden despachada correctamente" });
  } catch (err) {
    console.error("Error al despachar orden:", err);
    return res.status(500).json({ error: "Error al despachar orden" });
  } finally {
    if (connection) await connection.close();
  }
});

// 10. Ruta para confirmar recepción de orden
app.put('/api/ordenes/:id/confirmar-recepcion', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 'UPDATE ORDENES SET ESTADO = :estado WHERE ID = :id';
    await connection.execute(sql, ['ENTREGADO', id]);
    return res.json({ message: "Recepción confirmada" });
  } catch (err) {
    console.error("Error al confirmar recepción:", err);
    return res.status(500).json({ error: "Error al confirmar recepción" });
  } finally {
    if (connection) await connection.close();
  }
});

// 11. Ruta para agregar reseña después de confirmación
app.post('/api/resenas', async (req, res) => {
  const { usuario, comentario, calificacion, orden_id } = req.body;
  let connection;
  try {
    if (!usuario || !comentario || !calificacion) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    connection = await oracledb.getConnection(dbConfig);
    
    const idResult = await connection.execute('SELECT RESENAS_SEQ.NEXTVAL AS "id" FROM DUAL');
    const resena_id = idResult.rows[0].id;

    const sql = `INSERT INTO RESENAS (ID, USUARIO, COMENTARIO, CALIFICACION, ORDEN_ID, FECHA) 
                 VALUES (:id, :usuario, :comentario, :calificacion, :orden_id, SYSDATE)`;
    
    await connection.execute(sql, [resena_id, usuario, comentario, calificacion, orden_id]);

    return res.status(201).json({ message: "Reseña agregada correctamente" });
  } catch (err) {
    console.error("Error al agregar reseña:", err);
    return res.status(500).json({ error: "Error al agregar reseña" });
  } finally {
    if (connection) await connection.close();
  }
});

// 12. Ruta para obtener órdenes del cliente
app.get('/api/ordenes/cliente/:usuario_id', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `SELECT ID AS "id", USUARIO_ID AS "usuario_id", TOTAL AS "total", ESTADO AS "estado", 
                 NOMBRE_CLIENTE AS "nombre_cliente", FECHA_ORDEN AS "fecha_orden" 
                 FROM ORDENES WHERE USUARIO_ID = :usuario_id ORDER BY FECHA_ORDEN DESC`;
    const result = await connection.execute(sql, [req.params.usuario_id]);
    return res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener órdenes del cliente:", err);
    return res.status(500).json({ error: "Error al obtener órdenes" });
  } finally {
    if (connection) await connection.close();
  }
});

const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`✅ Servidor Backend corriendo en el puerto ${PORT}`));
