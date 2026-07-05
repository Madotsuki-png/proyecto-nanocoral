-- 1. Crear Tabla de Categorías
CREATE TABLE categorias (
    id NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    descripcion CLOB
);

-- 2. Crear Tabla de Productos (Tus corales, luces y peces)
CREATE TABLE productos (
    id NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(150) NOT NULL,
    descripcion CLOB,
    precio NUMBER(10, 2) NOT NULL,
    imagen_url VARCHAR2(255),
    stock NUMBER DEFAULT 0,
    categoria_id NUMBER,
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) 
        REFERENCES categorias(id) ON DELETE SET NULL
);

-- 3. Crear Tabla de Reseñas (Para los comentarios del fondo de tu página)
CREATE TABLE resenas (
    id NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    usuario VARCHAR2(100) NOT NULL,
    comentario CLOB NOT NULL,
    calificacion NUMBER CONSTRAINT chk_calificacion CHECK (calificacion BETWEEN 1 AND 5),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);