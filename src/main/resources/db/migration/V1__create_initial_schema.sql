CREATE TABLE admin_users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT pk_admin_users PRIMARY KEY (id),
    CONSTRAINT uk_admin_users_username UNIQUE (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reservas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    telefono VARCHAR(25) NOT NULL,
    fecha_reserva DATE NOT NULL,
    tipo_trenza VARCHAR(120) NOT NULL,
    creada_en DATETIME(6) NOT NULL,
    CONSTRAINT pk_reservas PRIMARY KEY (id),
    INDEX idx_reserva_fecha (fecha_reserva),
    INDEX idx_reserva_telefono (telefono)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
