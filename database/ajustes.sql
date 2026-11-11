-- Green Parking Lot: ajustes sobre parqueaderodb.sql
-- 1) Importa primero database/parqueaderodb.sql
-- 2) Luego importa este archivo sobre la base parqueaderodb
USE parqueaderodb;

-- Usuarios: login por número de documento
ALTER TABLE usuarios
  ADD COLUMN tipo_documento ENUM('CC','CE','TI','PAS') NOT NULL DEFAULT 'CC' AFTER id,
  ADD COLUMN numero_documento VARCHAR(15) NULL AFTER tipo_documento,
  ADD COLUMN celular VARCHAR(15) NULL AFTER correo,
  ADD UNIQUE KEY numero_documento (numero_documento);

-- Vehículos: datos descriptivos
ALTER TABLE vehiculos
  ADD COLUMN color VARCHAR(30) NULL,
  ADD COLUMN marca VARCHAR(50) NULL,
  ADD COLUMN modelo VARCHAR(50) NULL;

-- Celdas: código, piso y estado de mantenimiento
ALTER TABLE espacios
  ADD COLUMN codigo VARCHAR(10) NULL AFTER id,
  ADD COLUMN piso TINYINT NOT NULL DEFAULT 1,
  MODIFY estado ENUM('disponible','ocupado','reservado','mantenimiento') NOT NULL DEFAULT 'disponible';

-- Ingresos: estado del registro
ALTER TABLE ingresos_salidas
  ADD COLUMN estado ENUM('activo','finalizado') NOT NULL DEFAULT 'activo';

-- Incidencias: tipo y vehículo involucrado
ALTER TABLE incidentes
  ADD COLUMN vehiculo_id INT(11) NULL,
  ADD COLUMN tipo VARCHAR(40) NULL,
  ADD CONSTRAINT incidentes_ibfk_2 FOREIGN KEY (vehiculo_id) REFERENCES vehiculos (id);

-- Pico y placa (dia_semana: 0 = domingo ... 6 = sábado)
CREATE TABLE restricciones (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dia_semana TINYINT NOT NULL,
  ultimo_digito TINYINT NOT NULL,
  UNIQUE KEY dia_digito (dia_semana, ultimo_digito)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales
INSERT INTO roles (nombre) VALUES ('administrador'), ('operador'), ('usuario');

INSERT INTO parqueaderos (id, nombre, direccion, capacidad_total, capacidad_motos, capacidad_autos)
VALUES (1, 'Green Parking Lot', 'Calle 10 # 20-30, Medellín', 18, 6, 12);

INSERT INTO espacios (codigo, parqueadero_id, tipo, piso) VALUES
('A-01',1,'auto',1),('A-02',1,'auto',1),('A-03',1,'auto',1),('A-04',1,'auto',1),
('A-05',1,'auto',1),('A-06',1,'auto',1),('A-07',1,'auto',2),('A-08',1,'auto',2),
('A-09',1,'auto',2),('A-10',1,'auto',2),('A-11',1,'auto',2),('A-12',1,'auto',2),
('M-01',1,'moto',1),('M-02',1,'moto',1),('M-03',1,'moto',1),
('M-04',1,'moto',1),('M-05',1,'moto',1),('M-06',1,'moto',1);

INSERT INTO tarifas (tipo_vehiculo, tiempo, precio) VALUES
('auto','hora',4000),('moto','hora',2000);

INSERT INTO restricciones (dia_semana, ultimo_digito) VALUES
(1,1),(1,2),(2,3),(2,4),(3,5),(3,6),(4,7),(4,8),(5,9),(5,0);

-- Luego crea el administrador con:  npm run crear-admin
