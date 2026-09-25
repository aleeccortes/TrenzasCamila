package com.proycamila.dto;

import com.proycamila.model.EstadoPago;
import com.proycamila.model.EstadoReserva;
import com.proycamila.model.Reserva;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservaResponse(
    Long id,
    String nombre,
    String telefono,
    String email,
    LocalDate fechaReserva,
    String tipoTrenza,
    BigDecimal precio,
    EstadoReserva estado,
    EstadoPago estadoPago,
    Boolean recordatorioEnviado,
    LocalDateTime creadaEn
) {
    public static ReservaResponse from(Reserva r) {
        return new ReservaResponse(
            r.getId(),
            r.getNombre(),
            r.getTelefono(),
            r.getEmail(),
            r.getFechaReserva(),
            r.getTipoTrenza(),
            r.getPrecio(),
            r.getEstado(),
            r.getEstadoPago(),
            r.getRecordatorioEnviado(),
            r.getCreadaEn()
        );
    }
}
