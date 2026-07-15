const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'https://grand-alignment.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
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

// Configuración de MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  port: parseInt(process.env.DB_PORT) || 3306, // Convertimos a número
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Pool de conexiones MySQL
const pool = mysql.createPool(dbConfig);

// Probar conexión a la BD
pool.getConnection().then(conn => {
  console.log('✅ Conectado a MySQL correctamente');
  conn.release();
}).catch(err => {
  console.error('❌ Error al conectar a MySQL:', err.message);
});

// 1. Ruta para obtener todos los productos
app.get('/api/productos', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = 'SELECT id, nombre, descripcion, precio, imagen_url, stock, categoria_id FROM PRODUCTOS';
    const [rows] = await connection.execute(query);
    return res.json(rows);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    return res.status(500).json({ error: "Error al obtener productos" });
  } finally {
    if (connection) await connection.release();
  }
});

// 2. Ruta para obtener un solo producto
app.get('/api/productos/:id', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = 'SELECT id, nombre, descripcion, precio, imagen_url, stock, categoria_id FROM PRODUCTOS WHERE id = ?';
    const [rows] = await connection.execute(query, [req.params.id]);
    return res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener detalle:", err);
    return res.status(500).json({ error: "Error al obtener detalle" });
  } finally {
    if (connection) await connection.release();
  }
});

// 3. Ruta para obtener reseñas
app.get('/api/resenas', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = 'SELECT id, usuario, comentario, calificacion FROM RESENAS';
    const [rows] = await connection.execute(query);
    return res.json(rows);
  } catch (err) {
    console.error("Error al obtener reseñas:", err);
    return res.status(500).json({ error: "Error al obtener reseñas" });
  } finally {
    if (connection) await connection.release();
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

    connection = await pool.getConnection();
    const sql = `INSERT INTO PRODUCTOS (nombre, precio, descripcion, categoria_id, imagen_url) 
                 VALUES (?, ?, ?, ?, ?)`;
    
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
    if (connection) await connection.release();
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

    connection = await pool.getConnection();
    const checkEmail = 'SELECT COUNT(*) as count FROM USUARIOS WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))';
    const [checkResult] = await connection.execute(checkEmail, [email]);

    if (checkResult[0].count > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const sql = `INSERT INTO USUARIOS (nombre, email, password, rol) 
                 VALUES (?, ?, ?, 'CLIENT')`;
    
    await connection.execute(sql, [nombre, email, password]);

    return res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    return res.status(500).json({ error: "Error al registrar usuario" });
  } finally {
    if (connection) await connection.release();
  }
});

// 6. Ruta para login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  let connection;
  try {
    connection = await pool.getConnection();
    
    const sql = 'SELECT id, email, password, rol, nombre FROM USUARIOS WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))';
    const [rows] = await connection.execute(sql, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    if (password !== usuario.password) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'SECRETO_SUPER_SEGURO', { expiresIn: '24h' });
    res.json({ token, rol: usuario.rol, id: usuario.id, nombre: usuario.nombre });
    
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    if (connection) await connection.release();
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

    connection = await pool.getConnection();
    
    // Insertar la orden (MySQL genera automáticamente el ID con AUTO_INCREMENT)
    const ordenSql = `INSERT INTO ORDENES (usuario_id, total, estado, nombre_cliente, email_cliente, telefono, direccion, ciudad, estado_postal, numero_tarjeta, fecha_orden) 
                      VALUES (?, ?, 'PENDIENTE', ?, ?, ?, ?, ?, ?, ?, NOW())`;
    
    const [orderResult] = await connection.execute(ordenSql, [usuario_id, total, nombre_cliente, email_cliente, telefono, direccion, ciudad, estado_postal, numero_tarjeta]);
    const orden_id = orderResult.insertId;

    console.log('ID de orden generado:', orden_id);
    console.log('Orden insertada exitosamente');

    // Insertar detalles de la orden
    for (const producto of productos) {
      const detalleSql = `INSERT INTO ORDEN_DETALLES (orden_id, producto_id, cantidad, precio_unitario) 
                          VALUES (?, ?, ?, ?)`;
      await connection.execute(detalleSql, [orden_id, producto.id, producto.cantidad || 1, producto.precio]);
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
    if (connection) await connection.release();
  }
});

// 8. Ruta para obtener órdenes del admin
app.get('/api/ordenes', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const sql = `SELECT id, usuario_id, total, estado, nombre_cliente, email_cliente, telefono, direccion, ciudad, estado_postal, fecha_orden 
                 FROM ORDENES ORDER BY fecha_orden DESC`;
    const [rows] = await connection.execute(sql);
    return res.json(rows);
  } catch (err) {
    console.error("Error al obtener órdenes:", err);
    return res.status(500).json({ error: "Error al obtener órdenes" });
  } finally {
    if (connection) await connection.release();
  }
});

// 9. Ruta para actualizar estado de orden (despachar)
app.put('/api/ordenes/:id/despachar', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await pool.getConnection();
    const sql = 'UPDATE ORDENES SET estado = ? WHERE id = ?';
    await connection.execute(sql, ['DESPACHADO', id]);
    return res.json({ message: "Orden despachada correctamente" });
  } catch (err) {
    console.error("Error al despachar orden:", err);
    return res.status(500).json({ error: "Error al despachar orden" });
  } finally {
    if (connection) await connection.release();
  }
});

// 10. Ruta para confirmar recepción de orden
app.put('/api/ordenes/:id/confirmar-recepcion', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await pool.getConnection();
    const sql = 'UPDATE ORDENES SET estado = ? WHERE id = ?';
    await connection.execute(sql, ['ENTREGADO', id]);
    return res.json({ message: "Recepción confirmada" });
  } catch (err) {
    console.error("Error al confirmar recepción:", err);
    return res.status(500).json({ error: "Error al confirmar recepción" });
  } finally {
    if (connection) await connection.release();
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

    connection = await pool.getConnection();
    
    const sql = `INSERT INTO RESENAS (usuario, comentario, calificacion, orden_id, fecha) 
                 VALUES (?, ?, ?, ?, NOW())`;
    
    await connection.execute(sql, [usuario, comentario, calificacion, orden_id]);

    return res.status(201).json({ message: "Reseña agregada correctamente" });
  } catch (err) {
    console.error("Error al agregar reseña:", err);
    return res.status(500).json({ error: "Error al agregar reseña" });
  } finally {
    if (connection) await connection.release();
  }
});

// 12. Ruta para obtener órdenes del cliente
app.get('/api/ordenes/cliente/:usuario_id', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const sql = `SELECT id, usuario_id, total, estado, nombre_cliente, fecha_orden 
                 FROM ORDENES WHERE usuario_id = ? ORDER BY fecha_orden DESC`;
    const [rows] = await connection.execute(sql, [req.params.usuario_id]);
    return res.json(rows);
  } catch (err) {
    console.error("Error al obtener órdenes del cliente:", err);
    return res.status(500).json({ error: "Error al obtener órdenes" });
  } finally {
    if (connection) await connection.release();
  }
});

const PORT = process.env.PORT;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`✅ Servidor Backend corriendo en el puerto ${PORT}`));
