package com.proycamila.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ReservaRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 80, message = "El nombre debe tener entre 2 y 80 caracteres")
        @Pattern(regexp = "^[\\p{L} .'-]+$", message = "El nombre contiene caracteres no permitidos")
        String nombre,

        @NotBlank(message = "El telefono es obligatorio")
        @Size(min = 8, max = 25, message = "El telefono debe tener entre 8 y 25 caracteres")
        @Pattern(regexp = "^\\+?[0-9 ()-]+$", message = "El telefono no es valido")
        String telefono,

        @NotNull(message = "La fecha es obligatoria")
        @FutureOrPresent(message = "La fecha no puede estar en el pasado")
        LocalDate fechaReserva,

        @NotBlank(message = "El tipo de trenza es obligatorio")
        @Size(min = 3, max = 120, message = "El tipo de trenza debe tener entre 3 y 120 caracteres")
        String tipoTrenza
) {}
