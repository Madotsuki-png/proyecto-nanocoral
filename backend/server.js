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
app.use(express.json());

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
    // Genera un nombre único con timestamp
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
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
  user: 'Rafael',
  password: '123456789',
  connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SID=xe)))'
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
    // Si se cargó un archivo, usar ese nombre; si no, usar lo que envió el usuario
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
    // Si hubo error y se subió archivo, eliminarlo
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

// 5. Ruta para login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    const sql = 'SELECT ID AS "id", EMAIL AS "email", PASSWORD AS "password", ROL AS "rol" FROM USUARIOS WHERE LOWER(TRIM(EMAIL)) = LOWER(TRIM(:email))';
    const result = await connection.execute(sql, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];

    if (password !== usuario.password) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'SECRETO_SUPER_SEGURO', { expiresIn: '1h' });
    res.json({ token, rol: usuario.rol });
    
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    if (connection) await connection.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor Backend corriendo en el puerto ${PORT}`));
