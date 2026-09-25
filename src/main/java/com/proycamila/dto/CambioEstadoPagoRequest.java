package com.proycamila.dto;

import com.proycamila.model.EstadoPago;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoPagoRequest(
    @NotNull(message = "El nuevo estado de pago es obligatorio")
    EstadoPago estadoPago
) {}
