const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Hace que Oracle devuelva los datos como objetos (ej: {nombre: "Zoantidos"}) en vez de arreglos
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

// Configuración de la conexión usando tus variables del .env
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING
};

// 1. Ruta para obtener todos los productos (o filtrar por categoría)
app.get('/api/productos', async (req, res) => {
  const { categoria } = req.query;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let query = 'SELECT id, nombre, descripcion, precio, imagen_url, stock, categoria_id AS "categoria_id" FROM productos';
    let params = [];

    if (categoria) {
      query += ' WHERE categoria_id = :categoria';
      params.push(categoria);
    }

    const result = await connection.execute(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { console.error(e); }
    }
  }
});

// 2. Ruta para obtener un solo producto por su ID
app.get('/api/productos/:id', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      'SELECT id, nombre, descripcion, precio, imagen_url, stock, categoria_id AS "categoria_id" FROM productos WHERE id = :id',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { console.error(e); }
    }
  }
});

// 3. Ruta para obtener las reseñas de los clientes
app.get('/api/resenas', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT id, usuario, comentario, calificacion FROM resenas');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { console.error(e); }
    }
  }
});

// Encender el servidor en el puerto 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor Backend corriendo en el puerto ${PORT}`));