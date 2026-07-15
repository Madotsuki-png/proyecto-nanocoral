-- ============================================
-- NANOCORAL - MySQL Schema (Convertido de Oracle)
-- Archivo creado - miércoles-julio-15-2026
-- ============================================

-- ============================================
-- Crear Base de Datos
-- ============================================
CREATE DATABASE IF NOT EXISTS nanocoral;
USE nanocoral;

-- ============================================
-- Tabla: CATEGORIAS
-- ============================================
CREATE TABLE CATEGORIAS (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(100) NOT NULL,
    DESCRIPCION LONGTEXT
) ENGINE=InnoDB;

-- ============================================
-- Tabla: USUARIOS
-- ============================================
CREATE TABLE USUARIOS (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(100),
    EMAIL VARCHAR(100) NOT NULL UNIQUE,
    PASSWORD VARCHAR(255) NOT NULL,
    ROL VARCHAR(20) DEFAULT 'CLIENT'
) ENGINE=InnoDB;

-- ============================================
-- Tabla: PRODUCTOS
-- ============================================
CREATE TABLE PRODUCTOS (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(150) NOT NULL,
    DESCRIPCION LONGTEXT,
    PRECIO DECIMAL(10,2) NOT NULL,
    IMAGEN_URL VARCHAR(255),
    STOCK INT DEFAULT 0,
    CATEGORIA_ID INT,
    FOREIGN KEY (CATEGORIA_ID) REFERENCES CATEGORIAS(ID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- Tabla: ORDENES
-- ============================================
CREATE TABLE ORDENES (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    USUARIO_ID INT,
    TOTAL DECIMAL(10,2),
    ESTADO VARCHAR(20),
    NOMBRE_CLIENTE VARCHAR(100),
    EMAIL_CLIENTE VARCHAR(100),
    TELEFONO VARCHAR(20),
    DIRECCION VARCHAR(200),
    CIUDAD VARCHAR(100),
    ESTADO_POSTAL VARCHAR(20),
    NUMERO_TARJETA VARCHAR(4),
    FECHA_ORDEN TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (USUARIO_ID) REFERENCES USUARIOS(ID)
) ENGINE=InnoDB;

-- ============================================
-- Tabla: ORDEN_DETALLES
-- ============================================
CREATE TABLE ORDEN_DETALLES (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ORDEN_ID INT,
    PRODUCTO_ID INT,
    CANTIDAD INT,
    PRECIO_UNITARIO DECIMAL(10,2),
    FOREIGN KEY (ORDEN_ID) REFERENCES ORDENES(ID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Tabla: RESENAS
-- ============================================
CREATE TABLE RESENAS (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    USUARIO VARCHAR(100) NOT NULL,
    COMENTARIO LONGTEXT NOT NULL,
    CALIFICACION INT NOT NULL CHECK (CALIFICACION BETWEEN 1 AND 5),
    FECHA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ORDEN_ID INT,
    FOREIGN KEY (ORDEN_ID) REFERENCES ORDENES(ID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- INSERTS: CATEGORIAS
-- ============================================
INSERT INTO CATEGORIAS (ID, NOMBRE) VALUES
(1, 'Corales'),
(2, 'Iluminación'),
(3, 'Peces e Invertebrados');

-- ============================================
-- INSERTS: USUARIOS
-- ============================================
INSERT INTO USUARIOS (ID, NOMBRE, EMAIL, PASSWORD, ROL) VALUES
(1, 'Administrador', 'admin@nanocoral.com', '123456', 'ADMIN'),
(21, 'Cliente Prueba', 'cliente@nanocoral.com', '123456', 'CLIENT'),
(41, 'David cobra', 'david@gmail.com', '123456', 'CLIENT'),
(61, 'Jovan del prado', 'jovan@gmail.com', '123456', 'CLIENT');

-- ============================================
-- INSERTS: PRODUCTOS
-- ============================================
INSERT INTO PRODUCTOS (ID, NOMBRE, PRECIO, IMAGEN_URL, STOCK, CATEGORIA_ID) VALUES
(1, 'Zoantidos', 450.00, 'zoanthids.jpg', 15, 1),
(2, 'Duncan Azul', 1250.00, 'duncan.jpg', 5, 1),
(3, 'Sarcophyton Green', 500.00, 'sarco.jpg', 8, 1),
(4, 'Colonia de Zoas', 1350.00, 'colonia_zoas.jpg', 3, 1),
(5, 'Alveopora Premium', 1450.00, 'alveopora.jpg', 4, 1),
(6, 'Prime 16HD', 7250.00, 'prime16.jpg', 10, 2),
(7, 'Radion XR30 PRO', 19800.00, 'radion.jpg', 2, 2),
(8, 'Luz de Arrecife 30W', 1320.00, 'luz30w.jpg', 20, 2),
(9, 'Pez Payaso Wyoming White', 1200.00, 'wyoming.jpg', 6, 3),
(10, 'Pez Cirujano Azul', 1500.00, 'cirujano_azul.jpg', 4, 3),
(11, 'Gobio watchman', 450.00, 'watch.jpg', 0, 3),
(21, 'Palitoas', 150.00, '1783541378676-769869343.jpg', 0, 1);

-- ============================================
-- INSERTS: ORDENES
-- ============================================
INSERT INTO ORDENES (ID, USUARIO_ID, TOTAL, ESTADO, NOMBRE_CLIENTE, EMAIL_CLIENTE, TELEFONO, DIRECCION, CIUDAD, ESTADO_POSTAL, NUMERO_TARJETA, FECHA_ORDEN) VALUES
(3, 21, 450.00, 'DESPACHADO', 'David Bowie', 'bowie@gmail.com', '5566783099', 'enrique glez mz13 lt 10', 'chimalhuacan', '56346', '1234', '2026-07-13 20:10:33'),
(4, 41, 7250.00, 'ENTREGADO', 'David valdez', 'david@gmail.com', '5566783099', 'Enrique glez', 'chimalhuacan', '56346', '1234', '2026-07-13 20:19:51'),
(5, 61, 8450.00, 'PENDIENTE', 'Jovan del prado', 'jovan@gmail.com', '5566783099', 'calle ortiz', 'nezahualcoyotl', '56346', '1234', '2026-07-13 21:40:26');

-- ============================================
-- INSERTS: ORDEN_DETALLES
-- ============================================
INSERT INTO ORDEN_DETALLES (ID, ORDEN_ID, PRODUCTO_ID, CANTIDAD, PRECIO_UNITARIO) VALUES
(4, 3, 1, 1, 450.00),
(5, 4, 6, 1, 7250.00),
(6, 5, 6, 1, 7250.00),
(7, 5, 9, 1, 1200.00);

-- ============================================
-- INSERTS: RESENAS
-- ============================================
INSERT INTO RESENAS (ID, USUARIO, CALIFICACION, FECHA, ORDEN_ID) VALUES
(1, 'Rodolfo J.', 5, '2026-07-04 20:21:05', NULL),
(2, 'Alan Torres', 5, '2026-07-04 20:21:05', NULL),
(3, 'Valde', 5, '2026-07-04 20:21:05', NULL);

-- ============================================
-- Indices (Automáticamente creados con PRIMARY KEY en MySQL)
-- ============================================
-- En MySQL, los PRIMARY KEY crean índices automáticamente
-- No es necesario crear índices adicionales

-- ============================================
-- VERIFICACIÓN DE DATOS
-- ============================================
-- Ejecuta este comando después de importar para verificar:
-- SELECT 'CATEGORIAS' AS tabla, COUNT(*) AS cantidad FROM CATEGORIAS
-- UNION ALL SELECT 'USUARIOS', COUNT(*) FROM USUARIOS
-- UNION ALL SELECT 'PRODUCTOS', COUNT(*) FROM PRODUCTOS
-- UNION ALL SELECT 'ORDENES', COUNT(*) FROM ORDENES
-- UNION ALL SELECT 'ORDEN_DETALLES', COUNT(*) FROM ORDEN_DETALLES
-- UNION ALL SELECT 'RESENAS', COUNT(*) FROM RESENAS;
