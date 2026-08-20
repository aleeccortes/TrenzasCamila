package com.proycamila.dto;

import jakarta.validation.constraints.*;

public record PasswordChangeRequest(
        @NotBlank(message = "La contrasenia actual es obligatoria") String actual,
        @NotBlank(message = "La contrasenia nueva es obligatoria")
        @Size(min = 10, max = 72, message = "La contrasenia debe tener entre 10 y 72 caracteres")
        String nueva
) {}
