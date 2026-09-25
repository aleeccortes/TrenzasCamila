package com.proycamila.dto;

import com.proycamila.model.EstadoReserva;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoReservaRequest(
    @NotNull(message = "El nuevo estado de la reserva es obligatorio")
    EstadoReserva estado
) {}
