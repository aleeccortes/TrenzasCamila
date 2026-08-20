package com.proycamila.dto;

import com.proycamila.model.Reserva;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservaResponse(Long id, String nombre, String telefono, LocalDate fechaReserva,
                              String tipoTrenza, LocalDateTime creadaEn) {
    public static ReservaResponse from(Reserva reserva) {
        return new ReservaResponse(reserva.getId(), reserva.getNombre(), reserva.getTelefono(),
                reserva.getFechaReserva(), reserva.getTipoTrenza(), reserva.getCreadaEn());
    }
}
