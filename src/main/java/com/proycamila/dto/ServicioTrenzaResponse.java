package com.proycamila.dto;

import com.proycamila.model.ServicioTrenza;
import java.math.BigDecimal;

public record ServicioTrenzaResponse(
    Long id,
    String nombre,
    String descripcion,
    BigDecimal precio,
    String imagenUrl,
    Integer duracionMinutos,
    Boolean activo
) {
    public static ServicioTrenzaResponse desde(ServicioTrenza s) {
        return new ServicioTrenzaResponse(
            s.getId(),
            s.getNombre(),
            s.getDescripcion(),
            s.getPrecio(),
            s.getImagenUrl(),
            s.getDuracionMinutos(),
            s.getActivo()
        );
    }
}
