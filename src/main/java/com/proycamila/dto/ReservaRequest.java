package com.proycamila.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ReservaRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 80, message = "El nombre debe tener entre 2 y 80 caracteres")
        @Pattern(regexp = "^[\\p{L} .'-]+$", message = "El nombre contiene caracteres no permitidos")
        String nombre,

        @NotBlank(message = "El teléfono es obligatorio")
        @Size(min = 8, max = 25, message = "El teléfono debe tener entre 8 y 25 caracteres")
        @Pattern(regexp = "^\\+?[0-9 ()-]+$", message = "El teléfono no es válido")
        String telefono,

        @Pattern(regexp = "^$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$", message = "El formato del correo electrónico no es válido")
        @Size(max = 100, message = "El correo electrónico no puede superar 100 caracteres")
        String email,

        @NotNull(message = "La fecha es obligatoria")
        @FutureOrPresent(message = "La fecha no puede estar en el pasado")
        LocalDate fechaReserva,

        @NotBlank(message = "El tipo de trenza es obligatorio")
        @Size(min = 3, max = 120, message = "El tipo de trenza debe tener entre 3 y 120 caracteres")
        String tipoTrenza,

        Long servicioId
) {}
