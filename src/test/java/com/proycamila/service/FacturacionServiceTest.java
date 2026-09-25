package com.proycamila.service;

import com.proycamila.dto.ReporteFacturacionResponse;
import com.proycamila.exception.BusinessException;
import com.proycamila.model.EstadoPago;
import com.proycamila.model.EstadoReserva;
import com.proycamila.model.Reserva;
import com.proycamila.repository.ReservaRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class FacturacionServiceTest {
    @Mock
    ReservaRepository reservaRepository;
    FacturacionService service;
    AutoCloseable mocks;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        service = new FacturacionService(reservaRepository);
    }

    @AfterEach
    void tearDown() throws Exception {
        mocks.close();
    }

    @Test
    void rechazaAnioInvalido() {
        assertThatThrownBy(() -> service.obtenerReporteMensual(2015, 5))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("año");
    }

    @Test
    void rechazaMesInvalido() {
        assertThatThrownBy(() -> service.obtenerReporteMensual(2026, 15))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("mes");
    }

    @Test
    void calculaReporteMensualCorrectamente() {
        Reserva r1 = new Reserva("Cliente 1", "2612502696", "c1@test.com", LocalDate.of(2026, 9, 10), "Box Braids", new BigDecimal("15000.00"));
        r1.setEstado(EstadoReserva.COMPLETADA);
        r1.setEstadoPago(EstadoPago.PAGADO);

        Reserva r2 = new Reserva("Cliente 2", "2612502697", "c2@test.com", LocalDate.of(2026, 9, 15), "Cornrows", new BigDecimal("10000.00"));
        r2.setEstado(EstadoReserva.CONFIRMADA);
        r2.setEstadoPago(EstadoPago.PENDIENTE);

        when(reservaRepository.findByFechaReservaBetweenOrderByFechaReservaAsc(any(), any()))
                .thenReturn(List.of(r1, r2));

        ReporteFacturacionResponse reporte = service.obtenerReporteMensual(2026, 9);

        assertThat(reporte.totalReservas()).isEqualTo(2);
        assertThat(reporte.reservasCompletadas()).isEqualTo(1);
        assertThat(reporte.reservasPendientes()).isEqualTo(1);
        assertThat(reporte.totalFacturadoCobrado()).isEqualByComparingTo("15000.00");
        assertThat(reporte.totalPendienteCobro()).isEqualByComparingTo("10000.00");
        assertThat(reporte.totalEstimadoMes()).isEqualByComparingTo("25000.00");
        assertThat(reporte.desglosePorServicio()).containsEntry("Box Braids", 1L);
    }
}
