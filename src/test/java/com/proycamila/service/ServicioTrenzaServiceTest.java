package com.proycamila.service;

import com.proycamila.dto.ServicioTrenzaRequest;
import com.proycamila.exception.BusinessException;
import com.proycamila.repository.ServicioTrenzaRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class ServicioTrenzaServiceTest {
    @Mock
    ServicioTrenzaRepository repository;
    ServicioTrenzaService service;
    AutoCloseable mocks;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        service = new ServicioTrenzaService(repository);
    }

    @AfterEach
    void tearDown() throws Exception {
        mocks.close();
    }

    @Test
    void rechazaNombreDuplicadoAlCrear() {
        when(repository.existsByNombreIgnoreCase("Box Braids")).thenReturn(true);
        ServicioTrenzaRequest request = new ServicioTrenzaRequest("Box Braids", "Trenzas hermosas", new BigDecimal("15000"), "", 120);

        assertThatThrownBy(() -> service.crearServicio(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Ya existe");
        verify(repository, never()).save(any());
    }

    @Test
    void permiteListarServiciosActivos() {
        service.listarServiciosActivos();
        verify(repository).findByActivoTrueOrderByNombreAsc();
    }
}
