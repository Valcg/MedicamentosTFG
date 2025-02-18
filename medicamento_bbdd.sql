/* -- DEFINITIVA POR AHORA
CREATE TABLE FAMILIARES (
    id_familiar INT PRIMARY KEY,
    parentesco VARCHAR(100) NOT NULL
);

CREATE TABLE FAMILIARES_PACIENTES (
    id_familiar INT,
    id_paciente INT,
    PRIMARY KEY (id_familiar, id_paciente),
    FOREIGN KEY (id_familiar) REFERENCES FAMILIARES(id_familiar),
    FOREIGN KEY (id_paciente) REFERENCES PACIENTES(id_paciente)
);*/

CREATE DATABASE MEDICAMENTOS_BBDD;
USE MEDICAMENTOS_BBDD;

CREATE TABLE MEDICOS_COLEGIADOS (
    numero_colegiado INT UNIQUE NOT NULL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL
);

CREATE TABLE MEDICOS (
    id_medico INT PRIMARY KEY AUTO_INCREMENT,
    numero_colegiado INT NOT NULL UNIQUE,
    especialidad VARCHAR(100) NOT NULL
);

CREATE TABLE PACIENTES (
    id_paciente INT PRIMARY KEY AUTO_INCREMENT,
    diagnostico VARCHAR(255) NOT NULL
);

CREATE TABLE USUARIOS (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    dni VARCHAR(9) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    id_referencia_paciente INT,
    id_referencia_medico INT,
    tipo_usuario ENUM('paciente', 'familiar', 'medico') NOT NULL,
    enabled ENUM('DESACTIVO', 'ACTIVO') NOT NULL,
    FOREIGN KEY (id_referencia_paciente) REFERENCES PACIENTES(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_referencia_medico) REFERENCES MEDICOS(id_medico) ON DELETE CASCADE
);

CREATE TABLE MEDICOS_PACIENTES (
    id_medico INT,
    id_paciente INT,
    PRIMARY KEY (id_medico, id_paciente),
    FOREIGN KEY (id_medico) REFERENCES MEDICOS(id_medico),
    FOREIGN KEY (id_paciente) REFERENCES PACIENTES(id_paciente)
);

CREATE TABLE MEDICAMENTOS (
    id_medicamento INT PRIMARY KEY AUTO_INCREMENT,
    nombre_medicamento VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

CREATE TABLE ALERTAS (
    id_alerta INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT,
    id_medicamento INT,
    fecha_hora_alerta DATETIME NOT NULL,
    estado_alerta ENUM('confirmado', 'sinConfirmar') NOT NULL,
    tipo_alerta ENUM('medicacion', 'bajo_stock') NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES PACIENTES(id_paciente),
    FOREIGN KEY (id_medicamento) REFERENCES MEDICAMENTOS(id_medicamento)
);

CREATE TABLE HISTORIAL_TOMAS (
    id_toma INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT,
    id_alerta INT,
    fecha_hora_toma DATETIME NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES PACIENTES(id_paciente),
    FOREIGN KEY (id_alerta) REFERENCES ALERTAS(id_alerta)
);

CREATE TABLE RECETAS (
    id_receta INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT,
    id_medico INT,
    dosis VARCHAR(50) NOT NULL,
    frecuencia INT NOT NULL,
    duracion_tratamiento VARCHAR(100) NOT NULL,
    caducidad ENUM('Caducada', 'Activa') NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES PACIENTES(id_paciente),
    FOREIGN KEY (id_medico) REFERENCES MEDICOS(id_medico)
);

CREATE TABLE RECETAS_MEDICAMENTOS (
    id_medicamento INT,
    id_receta INT,
    cantidad_prescrita INT NOT NULL CHECK (cantidad_prescrita > 0),
    PRIMARY KEY (id_medicamento, id_receta),
    FOREIGN KEY (id_medicamento) REFERENCES MEDICAMENTOS(id_medicamento),
    FOREIGN KEY (id_receta) REFERENCES RECETAS(id_receta)
);

CREATE TABLE MOVIMIENTOS_MEDICAMENTOS (
    id_movimiento INT PRIMARY KEY AUTO_INCREMENT,
    id_medicamento INT NOT NULL,
    tipo_movimiento ENUM('entrada', 'salida') NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_medicamento) REFERENCES MEDICAMENTOS(id_medicamento) ON DELETE CASCADE
);

-- Inserción de datos en MEDICOS_COLEGIADOS
INSERT INTO MEDICOS_COLEGIADOS (numero_colegiado, nombre, apellido, especialidad) VALUES
( 12345,'Carlos', 'Gómez',  'Cardiología'),
( 67890,'Laura', 'Fernández',  'Pediatría');

-- Inserción de datos en PACIENTES
INSERT INTO PACIENTES (id_paciente, diagnostico) VALUES
(3, 'Hipertensión');

INSERT INTO MEDICOS (id_medico, numero_colegiado,especialidad) VALUES
(101, 12345,'cardiologia');

-- Inserción de datos en FAMILIARES
-- INSERT INTO FAMILIARES (id_familiar, parentesco) VALUES
-- (4, 'Esposa');

-- SET foreign_key_checks = 0;

-- Inserción de datos en USUARIOS
INSERT INTO USUARIOS (id_usuario, nombre, apellido, contrasena, dni, correo, id_referencia_medico, tipo_usuario, enabled) 
VALUES (101, 'Carlos', 'Gómez', 'pass123', '12345678A', 'carlos@mail.com', 101, 'medico', 'ACTIVO');

INSERT INTO USUARIOS (id_usuario, nombre, apellido, contrasena, dni, correo, id_referencia_paciente, tipo_usuario, enabled) 
VALUES (3, 'Juan', 'Pérez', 'pass789', '11223344C', 'juan@mail.com', 3, 'paciente', 'ACTIVO');

-- Inserción en USUARIOS
-- INSERT INTO USUARIOS (id_usuario, nombre, apellido, contrasena, dni, correo, id_referencia, tipo_usuario, enabled) VALUES
-- (101, 'Carlos', 'Gómez', 'pass123', '12345678A', 'carlos@mail.com', 101, 'medico', 'ACTIVO'),
-- (102, 'Laura', 'Fernández', 'pass456', '87654321B', 'laura@mail.com', 102, 'medico', 'ACTIVO'),
-- (3, 'Juan', 'Pérez', 'pass789', '11223344C', 'juan@mail.com', 3, 'paciente', 'ACTIVO');
-- (4, 'Ana', 'Martínez', 'pass000', '44332211D', 'ana@mail.com', 4, 'familiar', 'ACTIVO');

-- Inserción en FAMILIARES_PACIENTES
-- INSERT INTO FAMILIARES_PACIENTES (id_familiar, id_paciente) VALUES
-- (4, 3);

-- Inserción en MEDICOS_PACIENTES
INSERT INTO MEDICOS_PACIENTES (id_medico, id_paciente) VALUES
(101, 3);

-- Inserción en MEDICAMENTOS
INSERT INTO MEDICAMENTOS (id_medicamento, nombre_medicamento, stock) VALUES
(1, 'Paracetamol', 50),
(2, 'Ibuprofeno', 30);

-- Inserción en ALERTAS
INSERT INTO ALERTAS (id_alerta, id_paciente, id_medicamento, fecha_hora_alerta, estado_alerta, tipo_alerta) VALUES
(1, 3, 1, '2025-02-12 08:00:00', 'sinConfirmar', 'medicacion');

-- Inserción en HISTORIAL_TOMAS
INSERT INTO HISTORIAL_TOMAS (id_toma, id_paciente, id_alerta, fecha_hora_toma) VALUES
(1, 3, 1, '2025-02-12 08:05:00');

-- Inserción en RECETAS
INSERT INTO RECETAS (id_receta, id_paciente, id_medico, dosis, frecuencia, duracion_tratamiento, caducidad) VALUES
(1, 3, 101, '500mg', 2, '10 días', 'Activa');

-- Inserción en RECETAS_MEDICAMENTOS
INSERT INTO RECETAS_MEDICAMENTOS (id_medicamento, id_receta, cantidad_prescrita) VALUES
(1, 1, 20);

-- Inserción en MOVIMIENTOS_MEDICAMENTOS
INSERT INTO MOVIMIENTOS_MEDICAMENTOS (id_medicamento, tipo_movimiento, cantidad, fecha_movimiento) VALUES
(1, 'entrada', 100, '2025-02-10 10:00:00');

