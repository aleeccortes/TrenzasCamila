package com.proycamila.service;

import com.proycamila.exception.BusinessException;
import com.proycamila.exception.NotFoundException;
import com.proycamila.model.Reserva;
import com.proycamila.repository.ReservaRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

class RecordatorioServiceTest {
    @Mock
    ReservaRepository reservaRepository;
    @Mock
    JavaMailSender mailSender;

    RecordatorioService service;
    AutoCloseable mocks;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        service = new RecordatorioService(reservaRepository, mailSender);
    }

    @AfterEach
    void tearDown() throws Exception {
        mocks.close();
    }

    @Test
    void rechazaReservaSinEmailParaEnvioCorreo() {
        Reserva r = new Reserva("Camila", "2612502696", "", LocalDate.now().plusDays(1), "Box Braids", new BigDecimal("15000"));
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(r));

        assertThatThrownBy(() -> service.enviarRecordatorioEmail(1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("correo electrónico");
    }

    @Test
    void lanzaExcepcionSiReservaNoExiste() {
        when(reservaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.enviarRecordatorioEmail(99L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void generaEnlaceWhatsAppCorrectamente() {
        Reserva r = new Reserva("Camila Colombo", "2612502696", "camila@test.com", LocalDate.of(2026, 9, 26), "Knotless Braids", new BigDecimal("20000"));
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(r));

        Map<String, String> resultado = service.generarEnlaceWhatsApp(1L);

        assertThat(resultado).containsKey("url");
        assertThat(resultado.get("url")).contains("wa.me/2612502696");
        assertThat(resultado.get("url")).contains("Camila");
    }
}
