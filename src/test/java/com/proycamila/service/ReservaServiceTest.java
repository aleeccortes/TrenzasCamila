package com.proycamila.service;

import com.proycamila.dto.ReservaRequest;
import com.proycamila.exception.BusinessException;
import com.proycamila.repository.ReservaRepository;
import com.proycamila.repository.ServicioTrenzaRepository;
import org.junit.jupiter.api.*;
import org.mockito.*;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReservaServiceTest {
    @Mock ReservaRepository repository;
    @Mock ServicioTrenzaRepository servicioTrenzaRepository;
    ReservaService service;
    AutoCloseable mocks;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        service = new ReservaService(repository, servicioTrenzaRepository);
    }

    @AfterEach
    void tearDown() throws Exception {
        mocks.close();
    }

    @Test
    void rechazaTelefonoInvalido() {
        ReservaRequest request = new ReservaRequest("Camila", "abc", "camila@test.com", LocalDate.now().plusDays(1), "Box braids", null);
        assertThatThrownBy(() -> service.crear(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("teléfono");
        verifyNoInteractions(repository);
    }

    @Test
    void evitaReservaDuplicadaParaTelefonoYFecha() {
        LocalDate fecha = LocalDate.now().plusDays(1);
        when(repository.existsByTelefonoAndFechaReserva("+5492615551111", fecha)).thenReturn(true);
        ReservaRequest request = new ReservaRequest("  Ana   Perez ", "+54 9 261 555-1111", "ana@test.com", fecha, " Box braids ", null);
        assertThatThrownBy(() -> service.crear(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Ya existe");
        verify(repository, never()).save(any());
    }

    @Test
    void rechazaFechasConMasDeUnAnio() {
        ReservaRequest request = new ReservaRequest("Ana Perez", "2615551111", "ana@test.com", LocalDate.now().plusYears(1).plusDays(1), "Box braids", null);
        assertThatThrownBy(() -> service.crear(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("anticipación");
    }

    @Test
    void serviceRechazaNombreAunqueNoPasePorController() {
        ReservaRequest request = new ReservaRequest("<script>", "2615551111", "ana@test.com", LocalDate.now().plusDays(1), "Box braids", null);
        assertThatThrownBy(() -> service.crear(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("nombre");
    }

    @Test
    void permiteBuscarPorParteDelTelefono() {
        service.buscarPorTelefono("5551");
        verify(repository).findByTelefonoContainingOrderByCreadaEnDesc("5551");
    }
}
