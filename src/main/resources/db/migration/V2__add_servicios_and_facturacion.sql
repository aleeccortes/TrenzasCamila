CREATE TABLE servicios_trenza (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen_url VARCHAR(500),
    duracion_minutos INT NOT NULL DEFAULT 120,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_servicios_trenza PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE reservas 
    ADD COLUMN email VARCHAR(100) NULL AFTER telefono,
    ADD COLUMN precio DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER tipo_trenza,
    ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' AFTER precio,
    ADD COLUMN estado_pago VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' AFTER estado,
    ADD COLUMN recordatorio_enviado BOOLEAN NOT NULL DEFAULT FALSE AFTER estado_pago;

INSERT INTO servicios_trenza (nombre, descripcion, precio, imagen_url, duracion_minutos, activo) VALUES
('Trenzas Africanas Box Braids', 'Trenzas sueltas tradicionales con extensiones de alta calidad, acabados perfectos y durabilidad garantizada.', 15000.00, 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600', 240, TRUE),
('Trenzas Pegadas Cornrows', 'Diseño de trenzas pegadas al cuero cabelludo con patrones personalizados y decoraciones opcionales.', 10000.00, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600', 120, TRUE),
('Fulani Braids Elegantes', 'Estilo clásico con accesorios y cuentas doradas/plata y diseño frontal destacado.', 18000.00, 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=600', 180, TRUE),
('Knotless Braids Ultra Livianas', 'Trenzas sin nudo inicial, máxima comodidad y protección para el cabello natural.', 20000.00, 'https://images.unsplash.com/photo-1584297091622-af8e5c6a9b40?q=80&w=600', 210, TRUE);
