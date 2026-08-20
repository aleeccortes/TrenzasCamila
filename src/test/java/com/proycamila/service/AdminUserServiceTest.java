package com.proycamila.service;

import com.proycamila.dto.PasswordChangeRequest;
import com.proycamila.exception.BusinessException;
import com.proycamila.model.AdminUser;
import com.proycamila.repository.AdminUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceTest {
    @Mock AdminUserRepository repository;
    @Mock PasswordEncoder encoder;
    private AdminUserService service;
    private AdminUser admin;

    @BeforeEach
    void setUp() {
        service = new AdminUserService(repository, encoder);
        admin = new AdminUser("camila", "hash-actual", "ADMIN");
        when(repository.findByUsernameIgnoreCase("camila")).thenReturn(Optional.of(admin));
    }

    @Test
    void cambiaLaPasswordCuandoLaActualEsCorrectaYLaNuevaEsFuerte() {
        when(encoder.matches("ClaveActual1!", "hash-actual")).thenReturn(true);
        when(encoder.matches("NuevaClave9!", "hash-actual")).thenReturn(false);
        when(encoder.encode("NuevaClave9!")).thenReturn("hash-nuevo");

        service.cambiarPassword("camila", new PasswordChangeRequest("ClaveActual1!", "NuevaClave9!"));

        assertThat(admin.getPassword()).isEqualTo("hash-nuevo");
        verify(encoder).encode("NuevaClave9!");
    }

    @Test
    void rechazaElCambioCuandoLaPasswordActualEsIncorrecta() {
        when(encoder.matches("Incorrecta1!", "hash-actual")).thenReturn(false);

        assertThatThrownBy(() -> service.cambiarPassword(
                "camila", new PasswordChangeRequest("Incorrecta1!", "NuevaClave9!")))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("actual");

        assertThat(admin.getPassword()).isEqualTo("hash-actual");
    }
}
