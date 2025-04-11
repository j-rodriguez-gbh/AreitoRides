-- Drop database if exists and recreate it
DROP DATABASE IF EXISTS areitoDB;
CREATE DATABASE areitoDB;
USE areitoDB;

-- Drop tables if they exist (in reverse order of creation to avoid foreign key constraints)
DROP TABLE IF EXISTS reseñas;
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS alquileres;
DROP TABLE IF EXISTS estado_vehiculo;
DROP TABLE IF EXISTS detalles_vehiculo;
DROP TABLE IF EXISTS vehiculos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS tipo_combustible;
DROP TABLE IF EXISTS modelos;
DROP TABLE IF EXISTS marcas;
DROP TABLE IF EXISTS tipo_vehiculo;

-- Crear tabla de tipos de vehículos
CREATE TABLE tipo_vehiculo (
    id_tipo_vehiculo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Crear tabla de marcas
CREATE TABLE marcas (
    id_marca INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Crear tabla de modelos
CREATE TABLE modelos (
    id_modelo INT PRIMARY KEY AUTO_INCREMENT,
    id_marca INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_marca) REFERENCES marcas(id_marca) ON DELETE CASCADE,
    UNIQUE KEY unique_modelo_marca (id_marca, nombre)
);

-- Crear tabla de tipos de combustible
CREATE TABLE tipo_combustible (
    id_tipo_combustible INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    rol ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Crear tabla de clientes
CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    tarjeta_cr VARCHAR(30),
    limite_credito DECIMAL(10,2) DEFAULT 0.00,
    tipo_persona ENUM('fisica', 'juridica') NOT NULL DEFAULT 'fisica',
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de vehículos
CREATE TABLE vehiculos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_tipoVehiculo INT NOT NULL,
    id_marca INT NOT NULL,
    id_modelo INT NOT NULL,
    id_tipo_combustible INT NOT NULL,
    estado ENUM('disponible', 'alquilado', 'mantenimiento', 'inactivo') NOT NULL DEFAULT 'disponible',
    precio_dia DECIMAL(10,2) NOT NULL,
    anio INT NOT NULL DEFAULT 2024,
    no_chasis VARCHAR(50),
    no_motor VARCHAR(50),
    no_placa VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_tipoVehiculo) REFERENCES tipo_vehiculo(id_tipo_vehiculo),
    FOREIGN KEY (id_marca) REFERENCES marcas(id_marca),
    FOREIGN KEY (id_modelo) REFERENCES modelos(id_modelo),
    FOREIGN KEY (id_tipo_combustible) REFERENCES tipo_combustible(id_tipo_combustible)
);

-- Crear tabla para detalles técnicos del vehículo
CREATE TABLE detalles_vehiculo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_vehiculo INT NOT NULL,
    kilometraje INT DEFAULT 0,
    ultimo_mantenimiento DATE,
    fecha_compra DATE,
    valor_compra DECIMAL(10,2),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE CASCADE
);

-- Crear tabla para el historial de estados
CREATE TABLE estado_vehiculo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_vehiculo INT NOT NULL,
    estado ENUM('disponible', 'alquilado', 'mantenimiento', 'inactivo') NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE CASCADE
);

-- Crear tabla de alquileres
CREATE TABLE alquileres (
    id_alquiler INT PRIMARY KEY AUTO_INCREMENT,
    id_vehiculo INT NOT NULL,
    id_cliente INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'activo', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

-- Crear tabla de pagos
CREATE TABLE pagos (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_alquiler INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL,
    estado ENUM('pendiente', 'completado', 'reembolsado') NOT NULL DEFAULT 'pendiente',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_alquiler) REFERENCES alquileres(id_alquiler)
);

-- Crear tabla de reseñas
CREATE TABLE reseñas (
    id_reseña INT PRIMARY KEY AUTO_INCREMENT,
    id_alquiler INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_alquiler) REFERENCES alquileres(id_alquiler)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_vehiculo_estado ON vehiculos(estado);
CREATE INDEX idx_vehiculo_activo ON vehiculos(activo);
CREATE INDEX idx_detalles_vehiculo ON detalles_vehiculo(id_vehiculo);
CREATE INDEX idx_estado_vehiculo ON estado_vehiculo(id_vehiculo);
CREATE INDEX idx_alquiler_fechas ON alquileres(fecha_inicio, fecha_fin);
CREATE INDEX idx_alquiler_estado ON alquileres(estado);
CREATE INDEX idx_usuario_rol ON usuarios(rol);
CREATE INDEX idx_usuario_activo ON usuarios(activo);
CREATE INDEX idx_cliente_cedula ON clientes(cedula);
CREATE INDEX idx_cliente_estado ON clientes(estado);

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (usuario, contrasena, nombre, apellido, email, rol) VALUES 
('admin', '$2b$10$adyG6bKMGMcwyK07P4ZL6OtJj4MIEMt1pdyZAtviu8UN4YlYYZl8i', 'Administrador', 'Sistema', 'admin@areitorides.com', 'admin');

-- Insertar tipos de vehículos
INSERT INTO tipo_vehiculo (nombre) VALUES 
('Sedán'),
('SUV'),
('Pickup'),
('Van'),
('Deportivo'),
('Híbrido'),
('Eléctrico');

-- Insertar marcas
INSERT INTO marcas (nombre) VALUES 
('Toyota'),
('Honda'),
('Ford'),
('Chevrolet'),
('Nissan'),
('Volkswagen'),
('BMW'),
('Mercedes-Benz'),
('Hyundai'),
('Kia');

-- Insertar modelos (asociados a marcas)
INSERT INTO modelos (id_marca, nombre) VALUES 
(1, 'Corolla'),
(1, 'RAV4'),
(1, 'Camry'),
(2, 'Civic'),
(2, 'CR-V'),
(2, 'Accord'),
(3, 'Mustang'),
(3, 'F-150'),
(3, 'Explorer'),
(4, 'Silverado'),
(4, 'Malibu'),
(4, 'Equinox'),
(5, 'Altima'),
(5, 'Rogue'),
(5, 'Sentra'),
(6, 'Golf'),
(6, 'Tiguan'),
(6, 'Jetta'),
(7, '3 Series'),
(7, 'X5'),
(7, '5 Series'),
(8, 'C-Class'),
(8, 'E-Class'),
(8, 'GLC'),
(9, 'Elantra'),
(9, 'Tucson'),
(9, 'Santa Fe'),
(10, 'Sportage'),
(10, 'Sorento'),
(10, 'Forte');

-- Insertar tipos de combustible
INSERT INTO tipo_combustible (nombre) VALUES 
('Gasolina'),
('Diesel'),
('Híbrido'),
('Eléctrico'),
('Gas Natural'),
('Etanol');

-- Insertar clientes de ejemplo
INSERT INTO clientes (nombre, cedula, tarjeta_cr, limite_credito, tipo_persona, estado) VALUES
('Juan Pérez', '001-1234567-8', '1234-5678-9012-3456', 10000.00, 'fisica', 'activo'),
('Empresa Dominicana SA', '123456789', '9876-5432-1098-7654', 50000.00, 'juridica', 'activo'),
('María González', '002-9876543-1', '5678-1234-8765-4321', 5000.00, 'fisica', 'activo'),
('Carlos Rodríguez', '003-4567890-1', '1357-2468-1357-2468', 15000.00, 'fisica', 'activo'),
('Importadora Internacional SRL', '987654321', '2468-1357-2468-1357', 100000.00, 'juridica', 'activo');

-- Insertar vehículos (versión actualizada, sin campo descripción)
INSERT INTO vehiculos (id_marca, id_modelo, id_tipoVehiculo, id_tipo_combustible, estado, precio_dia, activo, anio, no_chasis, no_motor, no_placa) VALUES
(1, 1, 1, 1, 'disponible', 50.00, TRUE, 2023, 'TC12345678901234', 'TM123456789', 'ABC123'),  -- Toyota Corolla
(1, 2, 2, 1, 'disponible', 70.00, TRUE, 2023, 'TC23456789012345', 'TM234567890', 'DEF456'),  -- Toyota RAV4
(2, 4, 1, 1, 'disponible', 55.00, TRUE, 2024, 'TC34567890123456', 'TM345678901', 'GHI789'),  -- Honda Civic
(2, 5, 2, 1, 'disponible', 75.00, TRUE, 2023, 'TC45678901234567', 'TM456789012', 'JKL012'),  -- Honda CR-V
(3, 8, 3, 2, 'disponible', 85.00, TRUE, 2024, 'TC56789012345678', 'TM567890123', 'MNO345'),  -- Ford F-150
(3, 7, 5, 1, 'disponible', 60.00, TRUE, 2023, 'TC67890123456789', 'TM678901234', 'PQR678'),  -- Ford Mustang
(4, 11, 1, 1, 'disponible', 65.00, TRUE, 2024, 'TC78901234567890', 'TM789012345', 'STU901'), -- Chevrolet Malibu
(4, 12, 2, 1, 'disponible', 80.00, TRUE, 2023, 'TC89012345678901', 'TM890123456', 'VWX234'), -- Chevrolet Equinox
(5, 13, 1, 1, 'disponible', 55.00, TRUE, 2024, 'TC90123456789012', 'TM901234567', 'YZA567'), -- Nissan Altima
(5, 14, 2, 1, 'disponible', 75.00, TRUE, 2023, 'TC01234567890123', 'TM012345678', 'BCD890'), -- Nissan Rogue
(6, 18, 1, 1, 'disponible', 60.00, TRUE, 2024, 'TC12345678901235', 'TM123456790', 'EFG123'), -- Volkswagen Jetta
(6, 17, 2, 1, 'disponible', 80.00, TRUE, 2023, 'TC23456789012346', 'TM234567891', 'HIJ456'), -- Volkswagen Tiguan
(7, 19, 1, 1, 'disponible', 90.00, TRUE, 2024, 'TC34567890123457', 'TM345678902', 'KLM789'), -- BMW 3 Series
(7, 20, 2, 1, 'disponible', 100.00, TRUE, 2023, 'TC45678901234568', 'TM456789013', 'NOP012'), -- BMW X5
(8, 22, 1, 1, 'disponible', 95.00, TRUE, 2024, 'TC56789012345679', 'TM567890124', 'QRS345'); -- Mercedes-Benz C-Class

-- Insertar detalles técnicos de los vehículos
INSERT INTO detalles_vehiculo (id_vehiculo, kilometraje, ultimo_mantenimiento, fecha_compra, valor_compra) VALUES
(1, 15000, '2024-01-15', '2023-01-01', 25000.00),
(2, 12000, '2024-02-01', '2023-02-15', 35000.00),
(3, 18000, '2024-01-20', '2023-03-01', 27000.00),
(4, 10000, '2024-02-10', '2023-04-15', 37000.00),
(5, 20000, '2024-01-25', '2023-05-01', 45000.00),
(6, 8000, '2024-02-15', '2023-06-15', 40000.00),
(7, 16000, '2024-01-30', '2023-07-01', 28000.00),
(8, 9000, '2024-02-20', '2023-08-15', 42000.00),
(9, 14000, '2024-02-05', '2023-09-01', 26000.00),
(10, 11000, '2024-02-25', '2023-10-15', 38000.00),
(11, 17000, '2024-01-10', '2023-11-01', 29000.00),
(12, 13000, '2024-02-28', '2023-12-15', 39000.00),
(13, 19000, '2024-01-05', '2024-01-01', 48000.00),
(14, 7000, '2024-02-08', '2024-01-15', 52000.00),
(15, 15000, '2024-01-12', '2024-02-01', 46000.00);

-- Insertar historial de estados de los vehículos
INSERT INTO estado_vehiculo (id_vehiculo, estado, fecha_cambio, observaciones) VALUES
(1, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(2, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(3, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(4, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(5, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(6, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(7, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(8, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(9, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(10, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(11, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(12, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(13, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(14, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario'),
(15, 'disponible', '2024-01-01', 'Vehículo nuevo en inventario');

-- Insertar más vehículos con diferentes estados
INSERT INTO vehiculos (id_tipoVehiculo, id_marca, id_modelo, id_tipo_combustible, estado, precio_dia, no_chasis, no_motor, no_placa) VALUES 
(6, 1, 3, 3, 'mantenimiento', 80.00, 'JTDKB20U977654322', '2ZR-FXE123457', 'EFG123'),
(1, 2, 6, 1, 'alquilado', 70.00, '1HGCM82633A123456', 'K24Z3-789013', 'HIJ456'),
(3, 3, 8, 2, 'disponible', 110.00, '1FTRW14L83KC12345', 'EcoBoost-345679', 'KLM789'),
(1, 4, 12, 1, 'inactivo', 60.00, '1G1ZD5ST9JF123456', 'LTG-901235', 'NOP012'),
(2, 5, 15, 1, 'disponible', 72.00, '5N1AT2MV8HC123456', 'QR25-567891', 'QRS345');

-- Insertar detalles técnicos para los nuevos vehículos
INSERT INTO detalles_vehiculo (id_vehiculo, kilometraje, ultimo_mantenimiento, fecha_compra, valor_compra) VALUES 
(16, 5000, '2023-12-01', '2023-06-15', 35000.00),
(17, 8000, '2023-11-15', '2023-07-20', 32000.00),
(18, 3000, '2023-12-10', '2023-08-01', 48000.00),
(19, 12000, '2023-10-20', '2023-05-15', 28000.00),
(20, 9000, '2023-11-30', '2023-09-10', 33000.00);

-- Insertar historial de estados para los nuevos vehículos
INSERT INTO estado_vehiculo (id_vehiculo, estado, observaciones) VALUES 
(16, 'mantenimiento', 'Revisión programada'),
(17, 'alquilado', 'Alquilado por 7 días'),
(18, 'disponible', 'Nuevo ingreso'),
(19, 'inactivo', 'En espera de reparación'),
(20, 'disponible', 'Listo para alquiler');

-- Insertar algunos alquileres de ejemplo (actualizado para usar id_cliente en lugar de id_usuario)
INSERT INTO alquileres (id_vehiculo, id_cliente, fecha_inicio, fecha_fin, precio_total, estado) VALUES
(2, 1, '2023-12-01', '2023-12-07', 525.00, 'completado'),
(7, 2, '2023-12-10', '2023-12-15', 750.00, 'activo'),
(17, 3, '2023-12-05', '2023-12-12', 490.00, 'activo');

-- Insertar algunos pagos de ejemplo
INSERT INTO pagos (id_alquiler, monto, metodo_pago, estado) VALUES
(1, 525.00, 'tarjeta', 'completado'),
(2, 750.00, 'transferencia', 'completado'),
(3, 490.00, 'tarjeta', 'completado');

-- Insertar algunas reseñas de ejemplo
INSERT INTO reseñas (id_alquiler, calificacion, comentario) VALUES
(1, 5, 'Excelente servicio y vehículo en perfectas condiciones'),
(2, 4, 'Muy buen vehículo, un poco caro pero vale la pena'),
(3, 5, 'Proceso de alquiler muy sencillo y rápido'); 