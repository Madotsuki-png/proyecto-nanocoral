-- 1. Insertar las 3 Categorías principales
INSERT INTO categorias (nombre, descripcion) VALUES ('Corales', 'Corales blandos, LPS y SPS para acuarios reef marinos');
INSERT INTO categorias (nombre, descripcion) VALUES ('Iluminación', 'Lámparas y pantallas programables para el crecimiento de corales');
INSERT INTO categorias (nombre, descripcion) VALUES ('Peces e Invertebrados', 'Fauna marina para mantener el acuario equilibrado');

-- 2. Insertar tus Productos del catálogo
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Zoantidos', 'Frags de zoántidos coloridos e ideales para coleccionistas de pico reef.', 450.00, 'zoanthids.jpg', 15, 1);
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Duncan Azul', 'Coral LPS Duncan de espectro verde y azul metálico.', 1250.00, 'duncan.jpg', 5, 1);
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Sarcophyton Green', 'Coral blando tipo cuero con pólipos verdes de alta extensión.', 500.00, 'sarco.jpg', 8, 1);
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Colonia de Zoas', 'Roca completamente tapizada de zoántidos ultra premium.', 1350.00, 'colonia_zoas.jpg', 3, 1);
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Alveopora Premium', 'Coral LPS Alveopora con excelente movimiento de pólipos.', 1450.00, 'alveopora.jpg', 4, 1);
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Prime 16HD', 'Pantalla LED AquaIllumination programable vía App.', 7250.00, 'prime16.jpg', 10, 2);
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Radion XR30 PRO', 'Pantalla LED Ecotech Marine de máximo rendimiento profesional.', 19800.00, 'radion.jpg', 2, 2);
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Luz de Arrecife 30W', 'Lámpara de clip ideal para sistemas nano y pico reefs.', 1320.00, 'luz30w.jpg', 20, 2);
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Pez Payaso Wyoming White', 'Ejemplar seleccionado premium de Amphiprion ocellaris de diseño.', 1200.00, 'wyoming.jpg', 6, 3);
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria_id) VALUES ('Pez Cirujano Azul', 'Paracanthurus hepatus, pez cirujano aclimatado y sano.', 1500.00, 'cirujano_azul.jpg', 4, 3);

-- 3. Insertar las Reseñas de los clientes
INSERT INTO resenas (usuario, comentario, calificacion) VALUES ('Rodolfo J.', 'Excelente tiempo de entrega, el coral llegó en perfectas condiciones.', 5);
INSERT INTO resenas (usuario, comentario, calificacion) VALUES ('Alan Torres', 'La mejor tienda calidad precio, muy accesibles.', 5);
INSERT INTO resenas (usuario, comentario, calificacion) VALUES ('Valde', 'Buena comunicación por parte de la tienda.', 5);

-- 4. Guardar los cambios permanentemente en Oracle
COMMIT;