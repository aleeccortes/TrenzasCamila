package com.proycamila.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ServicioTrenzaRequest(
    @NotBlank(message = "El nombre del servicio es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    String nombre,

    @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
    String descripcion,

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    BigDecimal precio,

    @Size(max = 500, message = "La URL de la imagen no puede superar los 500 caracteres")
    String imagenUrl,

    @Min(value = 15, message = "La duración mínima es 15 minutos")
    @Max(value = 720, message = "La duración máxima es 720 minutos (12 horas)")
    Integer duracionMinutos
) {}
